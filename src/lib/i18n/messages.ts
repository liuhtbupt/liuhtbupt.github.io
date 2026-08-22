export interface LocaleMessages {
  common: {
    all: string;
    copyToClipboard: string;
  };
  navigation: {
    openMainMenu: string;
  };
  theme: {
    system: string;
    light: string;
    dark: string;
    currentTheme: string;
    cycleTheme: string;
  };
  profile: {
    email: string;
    location: string;
    workAddress: string;
    click: string;
    googleMap: string;
    send: string;
    sendEmail: string;
    academicHomepage: string;
    researchInterests: string;
    like: string;
    liked: string;
    thanks: string;
  };
  home: {
    about: string;
    news: string;
    selectedPublications: string;
    viewAll: string;
  };
  publications: {
    searchPlaceholder: string;
    filters: string;
    year: string;
    type: string;
    authorship: string;
    firstAuthor: string;
    studentFirstAuthor: string;
    correspondingAuthor: string;
    typeLabels: Record<string, string>;
    noResults: string;
    abstract: string;
    abstractUnavailable: string;
    doiUnavailable: string;
    bibtex: string;
    code: string;
    total: string;
    popularPaper: string;
    popularArticleSincePublication: string;
    bestPaperAward: string;
  };
  footer: {
    lastUpdated: string;
    builtWithPrism: string;
    visits: string;
  };
}

const en: LocaleMessages = {
  common: {
    all: 'All',
    copyToClipboard: 'Copy to clipboard',
  },
  navigation: {
    openMainMenu: 'Open main menu',
  },
  theme: {
    system: 'System',
    light: 'Light',
    dark: 'Dark',
    currentTheme: 'Current theme',
    cycleTheme: 'Click to cycle theme',
  },
  profile: {
    email: 'Email',
    location: 'Location',
    workAddress: 'Work Address',
    click: 'Click',
    googleMap: 'Google Map',
    send: 'Send',
    sendEmail: 'Send Email',
    academicHomepage: 'Chinese Academic Homepage',
    researchInterests: 'Research Interests',
    like: 'Like',
    liked: 'Liked',
    thanks: 'Thanks!',
  },
  home: {
    about: 'About',
    news: 'News',
    selectedPublications: 'Selected Publications',
    viewAll: 'View All',
  },
  publications: {
    searchPlaceholder: 'Search publications...',
    filters: 'Filters',
    year: 'Year',
    type: 'Type',
    authorship: 'Authorship',
    firstAuthor: 'First Author',
    studentFirstAuthor: 'Student First Author',
    correspondingAuthor: 'Corresponding Author',
    typeLabels: {
      journal: 'Journal',
      magazine: 'Magazine',
      conference: 'Conference',
      workshop: 'Workshop',
      'book-chapter': 'Book Chapter',
      book: 'Book',
      thesis: 'Thesis',
      preprint: 'Preprint',
      patent: 'Patent',
      'technical-report': 'Technical Report',
    },
    noResults: 'No publications found matching your criteria.',
    abstract: 'Abstract',
    abstractUnavailable: 'The official abstract has not been added yet. Add it to this entry in content/publications.bib.',
    doiUnavailable: 'No verified DOI is available for this publication.',
    bibtex: 'BibTeX',
    code: 'Code',
    total: 'Total: {count}',
    popularPaper: 'Popular Paper',
    popularArticleSincePublication: 'Popular Article since publication',
    bestPaperAward: 'Best Paper Award',
  },
  footer: {
    lastUpdated: 'Last updated',
    builtWithPrism: 'Built with PRISM',
    visits: 'Visits',
  },
};

const zh: LocaleMessages = {
  common: {
    all: '全部',
    copyToClipboard: '复制到剪贴板',
  },
  navigation: {
    openMainMenu: '打开主菜单',
  },
  theme: {
    system: '跟随系统',
    light: '浅色',
    dark: '深色',
    currentTheme: '当前主题',
    cycleTheme: '点击切换主题',
  },
  profile: {
    email: '邮箱',
    location: '地址',
    workAddress: '办公地址',
    click: '点击',
    googleMap: '谷歌地图',
    send: '发送',
    sendEmail: '发送邮件',
    academicHomepage: '中文学术主页',
    researchInterests: '研究兴趣',
    like: '点赞',
    liked: '已点赞',
    thanks: '感谢支持！',
  },
  home: {
    about: '关于我',
    news: '动态',
    selectedPublications: '精选论文',
    viewAll: '查看全部',
  },
  publications: {
    searchPlaceholder: '搜索论文...',
    filters: '筛选',
    year: '年份',
    type: '类型',
    authorship: '作者身份',
    firstAuthor: '第一作者',
    studentFirstAuthor: '学生一作',
    correspondingAuthor: '通信作者',
    typeLabels: {
      journal: '期刊',
      magazine: '杂志',
      conference: '会议',
      workshop: '研讨会',
      'book-chapter': '书籍章节',
      book: '书籍',
      thesis: '学位论文',
      preprint: '预印本',
      patent: '专利',
      'technical-report': '技术报告',
    },
    noResults: '没有找到符合条件的论文。',
    abstract: '摘要',
    abstractUnavailable: '这篇论文的正式摘要尚未添加。请在 content/publications.bib 的对应记录中补充。',
    doiUnavailable: '这篇论文目前没有经过核实的 DOI。',
    bibtex: 'BibTeX',
    code: '代码',
    total: '共 {count} 篇',
    popularPaper: '热门论文',
    popularArticleSincePublication: '发表以来持续入选热门文章',
    bestPaperAward: '最佳论文奖',
  },
  footer: {
    lastUpdated: '最近更新',
    builtWithPrism: '由 PRISM 构建',
    visits: '访问量',
  },
};

export const messages: Record<string, LocaleMessages> = {
  en,
  zh,
};

export function getMessages(locale: string): LocaleMessages {
  return messages[locale] || en;
}
