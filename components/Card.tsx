
import React from 'react';
import ArrowRightIcon from './icons/ArrowRightIcon';
import { ReactIcon, GeminiIcon, PowerAutomateIcon, BrainIcon, StrategyIcon, CopilotStudioIcon } from './index';
import AzureIcon from './icons/AzureIcon';
import CodeIcon from './icons/CodeIcon';
import PowerBiIcon from './icons/PowerBiIcon';
import OpenAiIcon from './icons/OpenAiIcon';
import '../styles/Card.css';

const techIconMap: { [key: string]: React.ReactNode } = {
    'AzureIcon': <AzureIcon />,
    'PythonIcon': <CodeIcon className="h-5 w-5 text-green-500" />,
    'CodeIcon': <CodeIcon className="h-5 w-5" />,
    'PowerBiIcon': <PowerBiIcon />,
    'OpenAiIcon': <OpenAiIcon />,
    'ReactIcon': <ReactIcon />,
    'GeminiIcon': <GeminiIcon />,
    'PowerAutomateIcon': <PowerAutomateIcon />,
    'BrainIcon': <BrainIcon />,
    'StrategyIcon': <StrategyIcon />,
    'CopilotStudioIcon': <CopilotStudioIcon />,
};

export interface CardProps {
    variant: 'simple' | 'project-overview-light' | 'project-overview-dark' | 'carousel';
    imageUrl?: string;
    category?: string;
    title: string;
    description?: string;
    buttonText?: string;
    link?: string;
    timeline?: string;
    techStack?: string[];
    layout?: 'large';
}

// FIX: This component was not returning a ReactNode, causing a type error.
// The implementation has been completed based on its usage elsewhere in the app,
// and it now correctly returns JSX, wrapped in a link if a 'link' prop is provided.
export const Card: React.FC<CardProps> = (props) => {
    const { variant, imageUrl, category, title, description, buttonText, link, timeline, techStack } = props;

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        const url = new URL(path, window.location.origin);
        window.history.pushState(null, '', url.pathname + url.search + url.hash);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    const cardContent = () => {
        switch (variant) {
            case 'carousel':
                return (
                    <div className="card-carousel group">
                        {imageUrl && (
                            <div className="card-carousel-image-wrapper">
                                <img className="card-carousel-image" src={imageUrl} alt={title} loading="lazy" />
                                <div className="card-carousel-overlay"></div>
                            </div>
                        )}
                        <div className="card-carousel-content">
                            <h3 className="card-carousel-title">{title}</h3>
                        </div>
                    </div>
                );
            case 'simple':
                return (
                    <div className="card-simple group">
                        {imageUrl && <div className="card-simple-image-wrapper"><img className="card-simple-image" src={imageUrl} alt={title} loading="lazy" /></div>}
                        <div className="card-simple-content">
                            {category && <p className="card-simple-category">{category}</p>}
                            <h3 className="card-simple-title">{title}</h3>
                            {description && <p className="card-simple-description">{description}</p>}
                            {buttonText && (
                                <div className="card-simple-footer">
                                    <span className="card-simple-button-text">
                                        {buttonText}
                                    </span>
                                    <ArrowRightIcon className="card-arrow-icon" />
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'project-overview-light':
            case 'project-overview-dark':
                const cardClass = variant === 'project-overview-light' ? 'card-project-overview light' : 'card-project-overview dark';
                return (
                    <div className={`${cardClass} group`}>
                        <div className="card-project-overview-content">
                            <h3 className="card-project-overview-title">{title}</h3>
                            {description && <p className="card-project-overview-description">{description}</p>}
                            <div className="card-project-overview-meta">
                                {timeline && (
                                    <div className="meta-item">
                                        <span className="meta-item-label">Timeline</span>
                                        <span className="meta-item-value">{timeline}</span>
                                    </div>
                                )}
                                {techStack && techStack.length > 0 && (
                                    <div className="meta-item">
                                        <span className="meta-item-label">Tech</span>
                                        <div className="meta-item-icons">
                                            {techStack.map(tech => techIconMap[tech] ? <div key={tech} className="tech-icon">{techIconMap[tech]}</div> : null)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {imageUrl && <img src={imageUrl} alt={title} className="card-project-overview-image" />}
                         {buttonText && (
                            <div className="card-project-overview-footer">
                                <span>{buttonText}</span>
                                <ArrowRightIcon className="card-arrow-icon" />
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    const content = cardContent();

    if (link) {
        return (
            <a href={link} onClick={(e) => handleNav(e, link)} className="card-link-wrapper">
                {content}
            </a>
        );
    }

    return content;
};