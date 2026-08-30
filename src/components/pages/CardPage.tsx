'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { CardPageConfig } from '@/types/page';

const markdownComponents = {
    p: ({ children }: React.ComponentProps<'p'>) => <p className="mb-3 last:mb-0">{children}</p>,
    ul: ({ children }: React.ComponentProps<'ul'>) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
    ol: ({ children }: React.ComponentProps<'ol'>) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
    li: ({ children }: React.ComponentProps<'li'>) => <li className="mb-1">{children}</li>,
    a: ({ ...props }) => (
        <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
        />
    ),
    blockquote: ({ children }: React.ComponentProps<'blockquote'>) => (
        <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
            {children}
        </blockquote>
    ),
    strong: ({ children }: React.ComponentProps<'strong'>) => <strong className="font-semibold text-primary">{children}</strong>,
    em: ({ children }: React.ComponentProps<'em'>) => <em className="italic">{children}</em>,
    code: ({ children }: React.ComponentProps<'code'>) => (
        <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[0.95em]">{children}</code>
    ),
};

const englishMonths: Record<string, number> = {
    january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
    july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
};

function dateSortValue(value?: string): number {
    if (!value) return 0;

    const chinese = value.match(/(\d{4})\s*年\s*(\d{1,2})\s*月(?:\s*(\d{1,2})\s*日)?/);
    if (chinese) {
        return Date.UTC(Number(chinese[1]), Number(chinese[2]) - 1, Number(chinese[3] || 1));
    }

    const english = value.match(/([A-Za-z]+)\s+(?:(\d{1,2}),\s*)?(\d{4})/);
    if (english) {
        const month = englishMonths[english[1].toLowerCase()];
        if (month) return Date.UTC(Number(english[3]), month - 1, Number(english[2] || 1));
    }

    const iso = value.match(/(\d{4})[-/.](\d{1,2})(?:[-/.](\d{1,2}))?/);
    if (iso) {
        return Date.UTC(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3] || 1));
    }

    const year = value.match(/\b(\d{4})\b/);
    return year ? Date.UTC(Number(year[1]), 0, 1) : 0;
}

export default function CardPage({ config, embedded = false }: { config: CardPageConfig; embedded?: boolean }) {
    const [authorFilter, setAuthorFilter] = useState<'all' | 'student' | 'first'>('all');
    const [levelFilter, setLevelFilter] = useState('all');
    const availableLevels = useMemo(
        () => Array.from(new Set(config.items.map((item) => item.level).filter((level): level is string => Boolean(level)))),
        [config.items]
    );
    const filteredItems = useMemo(() => {
        const items = config.items.filter((item) => {
            const authors = (item.subtitle || '')
                .split(/[、,]/)
                .map((name) => name.trim())
                .filter(Boolean);
            const matchesAuthor =
                !config.enable_author_filters ||
                !config.highlight_name ||
                authorFilter === 'all' ||
                (authorFilter === 'student' && item.student_first === true) ||
                (authorFilter === 'first' && (item.first_author === true || authors[0] === config.highlight_name));
            const matchesLevel =
                !config.enable_level_filters ||
                levelFilter === 'all' ||
                item.level === levelFilter;

            return matchesAuthor && matchesLevel;
        });

        return config.sort_by_date
            ? items.sort((a, b) => dateSortValue(b.date) - dateSortValue(a.date))
            : items;
    }, [authorFilter, config.enable_author_filters, config.enable_level_filters, config.highlight_name, config.items, config.sort_by_date, levelFilter]);

    const renderSubtitle = (subtitle: string) => {
        if (!config.enable_author_filters || !config.highlight_name) {
            return subtitle;
        }

        return subtitle.split(/([、,]\s*)/).map((part, index) => (
            part.trim() === config.highlight_name
                ? <span key={index} className="font-semibold text-accent">{part}</span>
                : <span key={index}>{part}</span>
        ));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className={embedded ? "mb-4" : "mb-8"}>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary`}>{config.title}</h1>
                    {config.count_text && (
                        <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-sm font-semibold text-accent-dark dark:text-accent-light">
                            {config.count_text.replace('{count}', String(config.items.length))}
                        </span>
                    )}
                </div>
                {config.description && (
                    <div className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 max-w-2xl leading-relaxed`}>
                        <ReactMarkdown components={markdownComponents}>
                            {config.description}
                        </ReactMarkdown>
                    </div>
                )}
            </div>

            {config.enable_author_filters && config.highlight_name && (
                <div className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                    <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {config.author_filter_label || 'Author role'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {([
                            ['all', config.all_authors_label || 'All'],
                            ['student', config.student_author_label || 'Student author'],
                            ['first', config.first_author_label || 'First author'],
                        ] as const).map(([value, label]) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setAuthorFilter(value)}
                                className={`rounded-full px-3 py-1 text-xs transition-colors ${
                                    authorFilter === value
                                        ? 'bg-accent text-white'
                                        : 'bg-white text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {config.enable_level_filters && availableLevels.length > 0 && (
                <div className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                    <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {config.level_filter_label || 'Type'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setLevelFilter('all')}
                            className={`rounded-full px-3 py-1 text-xs transition-colors ${
                                levelFilter === 'all'
                                    ? 'bg-accent text-white'
                                    : 'bg-white text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700'
                            }`}
                        >
                            {config.all_levels_label || 'All'}
                        </button>
                        {availableLevels.map((level) => (
                            <button
                                key={level}
                                type="button"
                                onClick={() => setLevelFilter(level)}
                                className={`rounded-full px-3 py-1 text-xs transition-colors ${
                                    levelFilter === level
                                        ? 'bg-accent text-white'
                                        : 'bg-white text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700'
                                }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className={`grid ${embedded ? "gap-4" : "gap-6"}`}>
                {filteredItems.length === 0 ? (
                    <div className="py-10 text-center text-neutral-500">
                        {config.no_results_text || 'No matching items.'}
                    </div>
                ) : filteredItems.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className={`bg-white dark:bg-neutral-900 ${embedded ? "p-4" : "p-6"} rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]`}
                    >
                        <div className="flex justify-between items-start gap-3 mb-2">
                            <h3 className={`${embedded ? "text-lg" : "text-xl"} font-semibold text-primary`}>{item.title}</h3>
                            <div className="flex flex-wrap justify-end gap-2 flex-shrink-0">
                                {item.level && (
                                    <span className="text-xs text-accent-dark dark:text-accent-light font-semibold bg-accent/10 border border-accent/20 px-2 py-1 rounded-full">
                                        {item.level}
                                    </span>
                                )}
                                {item.date && (
                                    <span className="text-sm text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                                        {item.date}
                                    </span>
                                )}
                            </div>
                        </div>
                        {item.subtitle && (
                            <p className={`${embedded ? "text-sm" : "text-base"} ${config.enable_author_filters ? 'text-neutral-600 dark:text-neutral-400' : 'text-accent font-medium'} mb-3`}>
                                {renderSubtitle(item.subtitle)}
                            </p>
                        )}
                        {item.content && (
                            <div className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-500 leading-relaxed`}>
                                <ReactMarkdown components={markdownComponents}>
                                    {item.content}
                                </ReactMarkdown>
                            </div>
                        )}
                        {item.tags && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {item.tags.map(tag => (
                                    <span key={tag} className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-1 rounded border border-neutral-100 dark:border-neutral-800">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
