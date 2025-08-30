
import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n/useI18n';
import ProjectDetailLayout from '../components/ProjectDetailLayout';
import type { BreadcrumbLink } from '../types';
import * as analytics from '../analytics';
import { updateMetaTags } from '../seo';

interface ProjectDetailPageProps {
    slug: string;
    breadcrumbs: BreadcrumbLink[];
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ slug, breadcrumbs }) => {
    const { language } = useI18n();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjectData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/i18n/content/projects/${slug}.${language}.json`);
                if (!response.ok) {
                    throw new Error(`Project not found: ${slug}`);
                }
                const data = await response.json();
                setProject(data);

                // SEO & Analytics
                const pageTitle = `${data.title} | Elliot Margot`;
                updateMetaTags({
                    title: pageTitle,
                    description: data.subtitle,
                    imageUrl: data.heroImageUrl,
                    url: `/projects/${slug}`
                });

                analytics.trackPageView(`/projects/${slug}`, data.title);

            } catch (err) {
                setError((err as Error).message);
                console.error("Failed to fetch project:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [slug, language]);

    if (loading) {
        return <div>Loading project...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    
    const updatedBreadcrumbs = [...breadcrumbs, { label: project.title }];

    return <ProjectDetailLayout project={project} breadcrumbs={updatedBreadcrumbs} />;
};

export default ProjectDetailPage;
