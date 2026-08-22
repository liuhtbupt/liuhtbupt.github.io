'use client';

import Link from 'next/link';
import PublicationsList from '@/components/publications/PublicationsList';
import { Publication } from '@/types/publication';
import { useMessages } from '@/lib/i18n/useMessages';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function SelectedPublications({ publications, title, enableOnePageMode = false }: SelectedPublicationsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.selectedPublications;

    return (
        <section className="relative">
            <Link
                href={enableOnePageMode ? '/#publications' : '/publications'}
                prefetch={true}
                className="absolute right-0 top-1 z-10 text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
            >
                {messages.home.viewAll} →
            </Link>
            <PublicationsList
                config={{
                    type: 'publication',
                    title: resolvedTitle,
                    description: '',
                    source: 'publications.bib',
                }}
                publications={publications}
                embedded={true}
                showControls={false}
            />
        </section>
    );
}
