
import React, { useState, useEffect } from 'react';
import type { BreadcrumbLink } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import GeminiBot from './components/GeminiBot';
import { useI18n } from './i18n/useI18n';
import * as analytics from './analytics';
import { routes, RouteConfig } from './routes';
import NotFoundPage from './pages/NotFoundPage'; // Import the new 404 page
import { updateMetaTags } from './seo';
import './styles/App.css';

const matchRoute = (path: string, routeConfigs: RouteConfig[]): { route: RouteConfig; params: { [key: string]: string } } | null => {
    for (const route of routeConfigs) {
        const paramNames: string[] = [];
        const regexPath = route.path.replace(/:([^\s/]+)/g, (match, paramName) => {
            paramNames.push(paramName);
            return '([^\\s/]+)';
        });

        const regex = new RegExp(`^${regexPath}$`);
        const match = path.match(regex);

        if (match) {
            const params = paramNames.reduce((acc, paramName, index) => {
                acc[paramName] = match[index + 1];
                return acc;
            }, {} as { [key: string]: string });
            return { route, params };
        }
    }
    return null;
};


const generateBreadcrumbs = (pathname: string, t: (key: string) => any): BreadcrumbLink[] => {
    const toCamelCase = (str: string): string => str.replace(/-([a-z])/g, g => g[1].toUpperCase());
    const basePath = (pathname.split('?')[0] || '');
    const path = basePath.startsWith('/') ? basePath.substring(1) : basePath;

    if (!path) {
        return []; // No breadcrumbs on the homepage
    }

    const parts = path.split('/');
    const crumbs: BreadcrumbLink[] = [{ label: t('nav.home'), href: '/' }];
    
    const pageKey = toCamelCase(parts[0]);
    const aboutPages = ['about', 'experience', 'education', 'certificates'];
    const aboutPageKeys = ['about', 'experience', 'education', 'certificates'];


    if (aboutPages.includes(parts[0])) {
        crumbs.push({ label: t('nav.about'), href: '/about' });
        if (parts[0] !== 'about') {
             const navKey = aboutPageKeys.find(key => key === parts[0]);
             if(navKey) {
                crumbs.push({ label: t(`nav.${navKey}`) });
             }
        }
    } else if (parts[0] === 'projects') {
        crumbs.push({ label: t('nav.projects'), href: '/projects' });
        if (parts[1]) {
            // Title for project pages is now handled by the page component itself
            // through data fetching, so we don't need to look it up here.
            // A placeholder could be used, but it's better to let the page set its own title.
            // The breadcrumb will be updated by the ProjectDetailPage component.
        }
    } else {
        const navLabel = t(`nav.${pageKey}`);
        if (navLabel) {
            crumbs.push({ label: navLabel });
        }
    }
    
    return crumbs.length > 1 ? crumbs : [];
};

const generateStructuredData = (pathname: string, t: (key: string) => any) => {
    const baseUrl = 'https://www.e-margot.ch/';
    const author = {
        '@type': 'Person',
        'name': 'Elliot Margot',
        'url': baseUrl
    };

    const matchedRoute = matchRoute(pathname, routes);

    if(!matchedRoute) {
        return {};
    }

    const { route: routeInfo } = matchedRoute;
    const seoKey = `seo.${routeInfo.key}`;

    if (routeInfo.key === 'home') {
        return {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            'url': baseUrl,
            'name': t(`${seoKey}.title`),
            'description': t(`${seoKey}.description`),
            'author': author
        };
    }

    const pageUrl = new URL(pathname.substring(1), baseUrl).href;
    return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'url': pageUrl,
        'name': t(`${seoKey}.title`),
        'description': t(`${seoKey}.description`)
    };
};

const getPath = () => window.location.pathname;

const App: React.FC = () => {
    const { t } = useI18n();
    const [route, setRoute] = useState(getPath());
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbLink[]>([]);
    const [isBotOpen, setIsBotOpen] = useState(false);
    const [botIntent, setBotIntent] = useState<'default' | 'bug_report'>('default');
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setTheme(savedTheme);
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        analytics.trackEvent('theme_switch', { theme: newTheme });
    };

    const handleOpenBot = (intent: 'default' | 'bug_report' = 'default') => {
        setBotIntent(intent);
        setIsBotOpen(true);
    };

    useEffect(() => {
        analytics.init();
    }, []);

    useEffect(() => {
        const handleLocationChange = () => {
            setRoute(getPath());
        };
        
        // Set initial route
        handleLocationChange();

        window.addEventListener('popstate', handleLocationChange);
        return () => {
            window.removeEventListener('popstate', handleLocationChange);
        };
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        const fullPath = window.location.pathname + window.location.search;
        const currentPath = fullPath.split('?')[0] || '/';
        const matchedRoute = matchRoute(currentPath, routes);
        
        // SEO for dynamic pages is handled within their respective components
        if (!currentPath.startsWith('/projects/') && !currentPath.startsWith('/blog/')) {
            let title, description;
            if (matchedRoute) {
                const seoKey = `seo.${matchedRoute.route.key}`;
                title = t(`${seoKey}.title`);
                description = t(`${seoKey}.description`);
            } else {
                // Handle 404 page SEO
                const seoKey = `seo.notFound`;
                title = t(`${seoKey}.title`);
                description = t(`${seoKey}.description`);
            }
            if (title && description) {
                updateMetaTags({
                    title,
                    description,
                    url: fullPath,
                });
                analytics.trackPageView(fullPath, title);
            }
        }
        
        setBreadcrumbs(generateBreadcrumbs(fullPath, t));
        
        const structuredData = generateStructuredData(currentPath, t);
        let scriptTag = document.getElementById('structured-data') as HTMLScriptElement | null;
        if (!scriptTag) {
            scriptTag = document.createElement('script');
            scriptTag.id = 'structured-data';
            document.head.appendChild(scriptTag);
        }
        scriptTag.type = 'application/ld+json';
        if (Object.keys(structuredData).length > 0) {
            scriptTag.textContent = JSON.stringify(structuredData);
        }
    }, [route, t]);
    
    const renderPage = () => {
        const pageProps = { breadcrumbs };
        const currentPath = route.split('?')[0] || '/';
        
        const matchedRoute = matchRoute(currentPath, routes);

        if (matchedRoute) {
            const PageComponent = matchedRoute.route.component;
            return <PageComponent {...pageProps} {...matchedRoute.params} />;
        }
        
        // Fallback to 404 page
        return <NotFoundPage />;
    };

    return (
        <div className="app-container">
            <Header 
                currentRoute={route} 
                onReportBug={() => handleOpenBot('bug_report')}
                theme={theme}
                toggleTheme={toggleTheme} 
            />
            <main className="main-content">
                {renderPage()}
            </main>
            <Footer />
            <GeminiBot 
                currentRoute={route}
                isOpen={isBotOpen}
                setIsOpen={setIsBotOpen}
                intent={botIntent}
                setIntent={setBotIntent}
            />
        </div>
    );
};

export default App;
