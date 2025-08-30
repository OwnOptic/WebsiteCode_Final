
const defaultImageUrl = 'https://res.cloudinary.com/dapoc7ekn/image/upload/v1756109046/Gemini_Generated_Image_5at9q35at9q35at9_sklnd1.png';
const baseUrl = 'https://www.e-margot.ch/';

interface MetaTags {
    title: string;
    description: string;
    imageUrl?: string;
    url: string;
}

/**
 * Updates the document's meta tags for SEO purposes.
 * @param {MetaTags} tags - The meta tag information.
 */
export const updateMetaTags = ({ title, description, imageUrl, url }: MetaTags): void => {
    document.title = title;

    const pageUrl = new URL(url.startsWith('/') ? url.substring(1) : url, baseUrl).href;

    // Standard Meta Tags
    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) descriptionTag.setAttribute('content', description || '');
    
    // Open Graph / Facebook
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', description || '');

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', pageUrl);

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', imageUrl || defaultImageUrl);

    // Twitter
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', title);

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', description || '');
    
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) twitterImage.setAttribute('content', imageUrl || defaultImageUrl);
};
