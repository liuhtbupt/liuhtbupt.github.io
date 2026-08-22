import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  args.set(process.argv[index], process.argv[index + 1]);
}

const root = process.cwd();
const configPath = path.join(root, 'publication-monitor.json');
const bibPath = path.join(root, 'content', 'publications.bib');
const outputPath = args.get('--output') || path.join(root, 'publication-update.md');
const githubOutputPath = args.get('--github-output');
const inputPath = args.get('--input');

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const bibtex = fs.readFileSync(bibPath, 'utf8');

function normalize(value = '') {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[{}\\]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '')
    .toLowerCase();
}

function normalizeOrcid(value = '') {
  return value.replace(/^https?:\/\/orcid\.org\//i, '').trim().toLowerCase();
}

function extractBibField(entry, field) {
  const fieldPattern = new RegExp(`(?:^|\\n)\\s*${field}\\s*=\\s*`, 'i');
  const match = fieldPattern.exec(entry);
  if (!match) return '';

  let cursor = match.index + match[0].length;
  while (/\s/.test(entry[cursor] || '')) cursor += 1;

  const opener = entry[cursor];
  if (opener === '{') {
    let depth = 0;
    let value = '';
    for (; cursor < entry.length; cursor += 1) {
      const character = entry[cursor];
      if (character === '{') {
        if (depth > 0) value += character;
        depth += 1;
      } else if (character === '}') {
        depth -= 1;
        if (depth === 0) return value.trim();
        value += character;
      } else if (depth > 0) {
        value += character;
      }
    }
  }

  if (opener === '"') {
    const end = entry.indexOf('"', cursor + 1);
    return end === -1 ? '' : entry.slice(cursor + 1, end).trim();
  }

  return entry.slice(cursor).split(/[\n,]/, 1)[0].trim();
}

function parseExistingPublications(source) {
  return source
    .split(/\n(?=@)/g)
    .filter((entry) => entry.trim().startsWith('@'))
    .map((entry) => {
      const key = entry.match(/^@\w+\s*\{\s*([^,]+)/i)?.[1]?.trim() || '';
      return {
        key,
        title: extractBibField(entry, 'title'),
        doi: extractBibField(entry, 'doi'),
      };
    });
}

async function fetchCrossrefWorks() {
  const fullName = `${config.author.given} ${config.author.family}`;
  const fromDate = `${config.earliest_year}-01-01`;
  const query = new URLSearchParams({
    'query.author': fullName,
    filter: `from-pub-date:${fromDate}`,
    rows: '100',
    sort: 'published',
    order: 'desc',
    mailto: config.author.email,
  });
  const url = `https://api.crossref.org/works?${query.toString()}`;

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': `PRISM-publication-monitor/1.0 (mailto:${config.author.email})`,
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) throw new Error(`Crossref returned HTTP ${response.status}`);
      const payload = await response.json();
      return payload.message?.items || [];
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
    }
  }
  throw lastError;
}

function authorName(author) {
  return `${author.given || ''} ${author.family || ''}`.trim();
}

function publicationYear(item) {
  const dateParts = item.published?.['date-parts']?.[0]
    || item['published-online']?.['date-parts']?.[0]
    || item['published-print']?.['date-parts']?.[0];
  return Number(dateParts?.[0]) || new Date().getUTCFullYear();
}

function isLikelyTargetPublication(item) {
  const authors = item.author || [];
  const targetName = normalize(`${config.author.given} ${config.author.family}`);
  const targetOrcid = normalizeOrcid(config.author.orcid);
  const targetAuthor = authors.find((author) => normalize(authorName(author)) === targetName);
  if (!targetAuthor) return false;

  const hasMatchingOrcid = normalizeOrcid(targetAuthor.ORCID) === targetOrcid;
  const affiliations = authors.flatMap((author) => author.affiliation || []).map((entry) => entry.name || '');
  const hasTrustedAffiliation = affiliations.some((affiliation) =>
    config.trusted_affiliations.some((trusted) => affiliation.toLowerCase().includes(trusted.toLowerCase())),
  );
  const authorNames = new Set(authors.map((author) => normalize(authorName(author))));
  const hasTrustedCoauthor = config.trusted_coauthors.some((name) => authorNames.has(normalize(name)));
  const title = (item.title?.[0] || '').toLowerCase();
  const hasMatchingTopic = config.topic_keywords.some((keyword) => title.includes(keyword.toLowerCase()));

  return hasMatchingOrcid || hasTrustedAffiliation || hasTrustedCoauthor || hasMatchingTopic;
}

function suggestedKey(item, usedKeys) {
  const firstAuthor = item.author?.[0];
  const family = normalize(firstAuthor?.family || config.author.family).replace(/[^a-z0-9]/g, '') || 'paper';
  const year = publicationYear(item);
  const stopWords = new Set(['a', 'an', 'and', 'for', 'in', 'of', 'on', 'the', 'to', 'with']);
  const words = (item.title?.[0] || 'paper')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter((word) => word && !stopWords.has(word));

  let key = `${family}${year}${words[0] || 'paper'}`;
  let wordIndex = 1;
  while (usedKeys.has(key)) {
    key = `${family}${year}${words.slice(0, wordIndex + 1).join('') || `paper${wordIndex + 1}`}`;
    wordIndex += 1;
  }
  usedKeys.add(key);
  return key;
}

function markdownFor(candidates, existing) {
  const usedKeys = new Set(existing.map((publication) => publication.key));
  const lines = [
    `# 检测到 ${candidates.length} 篇候选新论文`,
    '',
    '这是每周论文监测自动生成的提醒。请先通过 DOI 和 Google Scholar 主页核对，确认属于本人后再上传 PDF。',
    '',
    `[打开 Google Scholar 主页](${config.google_scholar_url})`,
    '',
  ];

  candidates.forEach((item, index) => {
    const title = item.title?.[0] || 'Untitled';
    const authors = (item.author || []).map(authorName).filter(Boolean).join(', ');
    const venue = item['container-title']?.[0] || 'Venue not provided';
    const doi = item.DOI || '';
    const key = suggestedKey(item, usedKeys);
    lines.push(`## ${index + 1}. ${title}`);
    lines.push('');
    lines.push(`- 作者：${authors || 'Crossref 未提供'}`);
    lines.push(`- 期刊/会议：${venue}`);
    lines.push(`- 年份：${publicationYear(item)}`);
    lines.push(`- DOI：${doi ? `[${doi}](https://doi.org/${doi})` : '未提供'}`);
    lines.push(`- 建议 PDF 文件名：\`${key}.pdf\``);
    lines.push(`- [ ] 将 PDF 放入 \`source-pdfs/${key}.pdf\` 并确认加入网站`);
    lines.push('');
  });

  lines.push('> 自动监测只负责发现候选项，不会未经确认直接改动正式论文列表。上传 PDF 后，可由 Codex 提取摘要和候选图片并补齐 BibTeX。');
  return `${lines.join('\n')}\n`;
}

const existing = parseExistingPublications(bibtex);
const existingTitles = new Set(existing.map((publication) => normalize(publication.title)));
const existingDois = new Set(existing.map((publication) => normalize(publication.doi)).filter(Boolean));
const items = inputPath
  ? JSON.parse(fs.readFileSync(path.resolve(root, inputPath), 'utf8')).message.items
  : await fetchCrossrefWorks();

const candidates = items
  .filter(isLikelyTargetPublication)
  .filter((item) => {
    const title = normalize(item.title?.[0] || '');
    const doi = normalize(item.DOI || '');
    return title && !existingTitles.has(title) && (!doi || !existingDois.has(doi));
  })
  .sort((a, b) => publicationYear(b) - publicationYear(a));

if (candidates.length > 0) {
  fs.writeFileSync(outputPath, markdownFor(candidates, existing), 'utf8');
}

if (githubOutputPath) {
  fs.appendFileSync(githubOutputPath, `found=${candidates.length > 0}\ncount=${candidates.length}\n`, 'utf8');
}

console.log(candidates.length > 0
  ? `Found ${candidates.length} candidate publication(s). Details: ${outputPath}`
  : 'No candidate publications found.');
