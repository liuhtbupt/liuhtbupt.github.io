'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useMessages } from '@/lib/i18n/useMessages';

export interface NewsItem {
    date: string;
    content: string;
    image?: string;
    image_alt?: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

export default function News({ items, title }: NewsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.news;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{resolvedTitle}</h2>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <span className="text-xs text-neutral-500 mt-1 w-16 flex-shrink-0">{item.date}</span>
                        <div className="min-w-0 flex-1">
                            <ReactMarkdown
                                components={{
                                    p: ({ children }) => <p className="text-sm text-neutral-700 dark:text-neutral-300">{children}</p>,
                                    a: ({ children, href }) => (
                                        <a
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium text-accent underline decoration-accent/40 underline-offset-2 hover:text-accent-dark"
                                        >
                                            {children}
                                        </a>
                                    ),
                                    strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                                }}
                            >
                                {item.content}
                            </ReactMarkdown>
                            {item.image && (
                                <a
                                    href={item.image}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 block w-full max-w-xl overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={item.image}
                                        alt={item.image_alt || ''}
                                        className="h-auto w-full object-contain"
                                        loading="lazy"
                                    />
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
