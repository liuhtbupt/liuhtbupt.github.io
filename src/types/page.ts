export interface BasePageConfig {
    type: 'about' | 'publication' | 'card' | 'text';
    title: string;
    description?: string;
}

export interface PublicationPageConfig extends BasePageConfig {
    type: 'publication';
    source: string;
}

export interface TextPageConfig extends BasePageConfig {
    type: 'text';
    source: string;
}

export interface CardItem {
    title: string;
    subtitle?: string;
    date?: string;
    level?: string;
    content?: string;
    tags?: string[];
    link?: string;
    image?: string;
}

export interface CardPageConfig extends BasePageConfig {
    type: 'card';
    items: CardItem[];
    count_text?: string;
    enable_author_filters?: boolean;
    highlight_name?: string;
    author_filter_label?: string;
    student_author_label?: string;
    first_author_label?: string;
    all_authors_label?: string;
    no_results_text?: string;
    enable_level_filters?: boolean;
    level_filter_label?: string;
    all_levels_label?: string;
    sort_by_date?: boolean;
}
