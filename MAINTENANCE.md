# 网站日常维护指南

这个网站采用“内容和页面程序分开”的方式。绝大多数日常更新只需要修改 `content/` 或 `content_zh/`，不需要修改 `src/` 中的程序。

## 第一次上线 GitHub Pages

线上仓库是 `https://github.com/liuhtbupt/liuhtbupt.github.io`。旧网站目前在 `master` 分支，新网站使用 `main` 分支。第一次上线时不要删除 `master`，先把它保留为旧站备份。

在 PowerShell 中执行：

```powershell
cd "C:\Users\Haotian Liu\website-migration\new-website"
git add .
git status
git commit -m "Migrate academic website to PRISM"
git remote add origin https://github.com/liuhtbupt/liuhtbupt.github.io.git
git push -u origin main
```

如果第一次提交提示没有设置姓名和邮箱，先执行下面两句，再重新运行 `git commit`；邮箱换成自己的 GitHub 邮箱：

```powershell
git config user.name "Haotian Liu"
git config user.email "你的 GitHub 邮箱"
```

推送时如果弹出 GitHub 登录窗口，按提示在浏览器登录并授权。推送完成后，在 GitHub 仓库中设置：

1. **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
2. **Settings → General → Default branch** 将默认分支改为 `main`。
3. **Actions → Deploy PRISM to GitHub Pages → Run workflow**，选择 `main` 后运行。
4. 等待 `build` 和 `deploy` 都显示绿色对勾，然后访问 `https://liuhtbupt.github.io/`。

新站成功上线前，旧 `master` 分支不要删除。部署失败时，打开 **Actions → Deploy PRISM to GitHub Pages**，进入失败记录查看标红步骤。项目已经包含部署工作流，不要在 GitHub 重新创建 Pages 工作流。

## 文件对应关系

| 要修改的内容 | 英文文件 | 中文文件 |
| --- | --- | --- |
| 姓名、职称、学校、链接、导航 | `content/config.toml` | `content_zh/config.toml` |
| 首页栏目和研究方向 | `content/about.toml` | `content_zh/about.toml` |
| Biography | `content/bio.md` | `content_zh/bio.md` |
| News | `content/news.toml` | `content_zh/news.toml` |
| 论文 | `content/publications.bib` | 中英文共用 |
| 教育经历 | `content/education.toml` | `content_zh/education.toml` |
| 奖励 | `content/awards.toml` | `content_zh/awards.toml` |
| 专利 | `content/patents.toml` | `content_zh/patents.toml` |
| 学术服务 | `content/services.toml` | `content_zh/services.toml` |
| 头像 | `public/liuhaotian.png` | 中英文共用 |
| 论文缩略图 | `public/papers/` | 中英文共用 |

## 直接在 GitHub 网页修改

1. 打开 GitHub 上的网站仓库。
2. 找到要修改的文件。
3. 点击右上角铅笔图标 **Edit this file**。
4. 修改内容；Markdown 文件可以点击 **Preview** 预览。
5. 点击 **Commit changes** 保存。小改动可以直接提交到 `main`；论文较多或改动较大时，建议新建分支和 Pull Request。
6. 打开仓库的 **Actions** 页面，等待 `Deploy PRISM to GitHub Pages` 变成绿色。
7. 刷新 `https://liuhtbupt.github.io` 查看新版本。

需要同时修改多个文件时，在仓库首页按键盘上的 `.`，打开 GitHub 网页版编辑器；修改完成后在左侧 **Source Control** 中填写说明并提交。上传论文图片时，进入 `public/papers/`，点击 **Add file → Upload files**，并确保图片文件名与 `publications.bib` 的 `preview` 完全一致。原始 PDF 不要上传到 GitHub。

## 在本地修改后推送

每次开始修改前先同步线上版本：

```powershell
cd "C:\Users\Haotian Liu\website-migration\new-website"
git pull --rebase origin main
```

修改完成后执行：

```powershell
npm run build
git status
git add .
git commit -m "Update website content"
git push
```

`git push` 成功后会自动触发部署，不要手工上传 `out`、`.next` 或 `node_modules`。

## 添加一条动态

在英文 `content/news.toml` 和中文 `content_zh/news.toml` 顶部各加入一段：

```toml
[[news]]
date = "2026-08-21"
content = "Our new paper was accepted by **Conference Name**."
```

```toml
[[news]]
date = "2026-08-21"
content = "我们的新论文被 **会议名称** 录用。"
```

动态支持 Markdown 超链接。写成 `[显示文字](https://example.com)` 后，网页只显示“显示文字”，点击会在新标签页打开链接；不要直接把长网址贴在正文中。

## 添加论文

把正式 BibTeX 追加到 `content/publications.bib`。作者顺序必须与论文一致，只在通讯作者姓名后添加 `*`：

```bibtex
@article{liu2026shortkey,
  title = {论文英文标题},
  author = {Haotian Liu and Coauthor Name*},
  journal = {期刊名称},
  year = {2026},
  cas_zone = {1},
  cas_top = {true},
  cas_year = {2025},
  jcr_quartile = {Q1},
  jcr_year = {2025},
  impact_factor = {10.7},
  impact_factor_year = {2025},
  month = aug,
  doi = {10.xxxx/xxxxx},
  url = {https://example.com/paper},
  abstract = {论文正式英文摘要},
  preview = {liu2026shortkey.jpg},
  keywords = {Integrated Sensing and Communication}
}
```

相应图片放到 `public/papers/liu2026shortkey.jpg`。建议使用横向图片，比例约为 4:3 或 16:9。

网站构建时不会联网抓图。把 PDF 放入 `source-pdfs/` 后，可在本地运行 `python scripts/extract-pdf-previews.py`：脚本优先截取 Figure 1，找不到时使用论文首页，并把图片保存到 `public/papers/`。自动裁剪后仍建议查看 `tmp/pdfs/preview-contact-sheet.jpg`，确认没有截错；需要调整时可以直接替换同名 JPG。没有配置 `preview` 时，网站显示统一的 ISAC 视觉卡片。

字段说明：

- `doi`：显示 DOI 按钮。
- `abstract`：显示可展开的“摘要”按钮。
- `preview`：显示论文缩略图。
- `selected = {true}`：将论文加入首页“精选论文”。
- `selected_order`：控制精选论文的显示顺序，数字越小越靠前。
- `student_first = {true}`：把论文加入“学生一作”筛选；此字段只用于网站筛选，不会显示在复制出的 BibTeX 中。
- `note = {Popular Paper}`：在论文卡片上显示“热门论文”标签；如果文章自发表以来持续入选热门文章，可写成 `note = {Popular Article since publication}`。多个其他标签也可以使用自定义字段 `badges = {标签一; 标签二}`，用英文分号分隔。

- `cas_zone`、`cas_top`、`cas_year`：分别填写中科院大类分区、是否为 Top 期刊及采用的分区版本年份。
- `jcr_quartile`、`jcr_year`：填写 JCR 分区及采用的版本年份，例如 `Q1` 和 `2025`。
- `impact_factor`、`impact_factor_year`：填写影响因子及采用的版本年份。以上评价字段会显示在论文卡片右下角，但不会混入访客复制的标准 BibTeX。

期刊评价指标不能只按期刊名称永久固定：同一期刊在不同年份可能升区或降区。新增论文时应按论文采用的评价版本逐项填写；不属于 SCI/JCR 的中文期刊、尚无 JIF 的杂志及会议论文不要强行填写这些字段。

“第一作者”会根据作者列表中刘浩田是否排在第一位自动判断；“通信作者”会根据刘浩田姓名后的 `*` 自动判断。杂志类型会自动识别名称中带有 `Magazine` 的期刊，以及 `IEEE Wireless Communications`。

DOI 通常可以根据论文标题从 Crossref 或出版社页面自动核验，不必每篇手输。有本地 PDF 时，运行 `python scripts/extract-pdf-abstracts.py` 可批量读取正式英文摘要并写入 BibTeX；特殊排版仍需核对。论文真实配图可由预览脚本批量提取，再根据联系表人工确认。

如果要批量处理 PDF，请把文件放入 `new-website/source-pdfs/`，并使用论文的 BibTeX 标识命名，例如 `liu2026wctnet.pdf`。这个目录仅作为本地提取源，不会显示在网站上，也不会提交到 GitHub。依次执行下面三条命令：

```powershell
python scripts/extract-pdf-abstracts.py
python scripts/extract-pdf-previews.py
npm run build
```

处理后，正式摘要会写入 `content/publications.bib`，缩略图会放入 `public/papers/`，并自动补上对应的 `preview` 字段。`tmp/pdfs/` 只保存检查用的中间文件，已被 Git 忽略。

## 添加奖励、专利、教育经历或学术服务

在对应 TOML 文件中复制一个现有的 `[[items]]` 区块，粘贴到合适位置，再修改：

```toml
[[items]]
title = "奖项名称"
subtitle = "颁发单位"
date = "2026年8月"
level = "国家级"
content = "必要的补充说明。"
```

建议统一使用以下奖项级别：`国际级`、`国家级`、`省部级`、`校级`、`学会/会议级`。无法准确判断时留空，不要为了好看而提高等级。

奖励总数会根据 `[[items]]` 自动统计，奖励页的类型筛选会根据每项的 `level` 自动生成；新增一种级别后无需修改页面代码。

专利页会从 `subtitle` 按顺序读取发明人：中文版用 `、` 分隔，英文版用英文逗号分隔。`highlight_name` 控制黄色高亮姓名；“学生作者”筛选该姓名是否在发明人名单中，“第一作者”筛选该姓名是否排在第一位。

## 点赞和访问量

- 点赞按钮目前记录在访问者自己的浏览器中，适合作为轻量互动，但不是所有访客共享的总点赞数。
- 网站只显示一个“访问量”，沿用旧网站的 `busuanzi_value_site_pv` 计数方式和 Vercount 脚本，不再同时显示访客数。
- 计数器初始显示 `0`，随后只在正式域名 `liuhtbupt.github.io` 上加载真实统计。本地 `localhost` 预览不会加载统计脚本，因此不会再跳到公共 localhost 的巨大共享计数。
- 访问量放在首页左侧个人资料区域，与旧网站位置和功能保持一致。
- 如果以后需要“所有人共享的总点赞数”、后台数据和反作弊，需要再接入 Supabase、Cloudflare D1 或其他数据库服务；GitHub Pages 自身不能保存动态点赞数据。

论文总数由 `content/publications.bib` 的记录数自动计算；专利总数由中英文 `patents.toml` 中的 `[[items]]` 数量自动计算。添加或删除记录后，无需手工修改页面上的总数。

论文会根据 BibTeX 中的 `year` 和 `month` 自动按时间倒序排列；专利会根据 `date` 自动识别中文或英文日期并按时间倒序排列。新增记录时不需要手工移动到列表顶部，但日期应尽量填写完整。

## 自动发现新论文并提醒上传 PDF

网站仓库包含 `Weekly publication monitor` 自动任务。网站正式上传 GitHub 后，它会在每周一北京时间 10:17 运行，也可以在 GitHub 的 **Actions → Weekly publication monitor → Run workflow** 中手动检查。

Google Scholar 官方不提供稳定的批量访问接口，并明确限制自动抓取，因此自动任务不会直接爬取 Scholar 页面。它会使用 `publication-monitor.json` 中的姓名、ORCID、学校、研究方向和常见合作者，通过 Crossref 检查候选论文，再与 `content/publications.bib` 中已有标题和 DOI 去重。Google Scholar 主页链接会附在提醒中，方便本人最终核对。

检测到候选论文后，GitHub 会：

1. 创建或更新标题为“检测到新论文：请核对并上传 PDF”的 Issue。
2. 将 Issue 指派给仓库所有者，并列出题目、作者、期刊/会议、DOI 和建议的 PDF 文件名。
3. 等待本人把 PDF 放入 `source-pdfs/`。PDF 不会被提交到 GitHub。
4. PDF 上传后，由 Codex 提取摘要、候选图片并把确认后的论文加入正式列表。
5. 当候选论文已经加入 `publications.bib` 后，下一次检查会自动关闭提醒。

首次启用时，请确认 GitHub 仓库的 **Settings → General → Features → Issues** 已开启，并在个人 GitHub 通知设置中允许接收被指派 Issue 的邮件。自动任务只生成候选提醒，不会未经确认直接把可能属于同名作者的论文发布到网站。

## 在 VS Code 本地修改

在 `new-website` 目录执行：

```bash
git pull
npm install
npm run dev
```

浏览器打开 `http://localhost:3000`。修改完成后执行：

```bash
npm run build
git add content content_zh public
git commit -m "更新论文和近期动态"
git push
```

如果还修改了程序或自动部署文件，应先在 VS Code 的 Source Control 中检查全部差异，再决定是否使用 `git add .`。

## 第一次连接 GitHub

当前 `new-website` 已经初始化为本地 `main` 仓库，但尚未提交和连接远程仓库。正式替换旧网站前，先在 GitHub 上为旧仓库建立备份分支或下载 ZIP 备份。确认新站内容后再执行：

```bash
git add .
git commit -m "将个人网站迁移到 PRISM"
git remote add origin https://github.com/liuhtbupt/liuhtbupt.github.io.git
git push --force-with-lease origin main
```

最后一条命令会替换远程分支内容，必须在旧站完成备份、本人确认新站无误之后执行。随后在 GitHub 中将 **Settings → Pages → Build and deployment → Source** 设置成 **GitHub Actions**。
