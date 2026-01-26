import { useEffect } from 'react';
import { useMeData } from '../hooks/useContent';

const SEOManager = () => {
    const { data: meData } = useMeData();

    useEffect(() => {
        if (!meData) return;

        // Update Website Title
        if (meData.siteTitle) {
            document.title = meData.siteTitle;
        }

        // Update Favicon
        if (meData.faviconUrl) {
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = meData.faviconUrl;
        }

        // Update OG Image (Thumbnail)
        if (meData.ogImage) {
            let ogImg = document.querySelector('meta[property="og:image"]');
            if (ogImg) {
                ogImg.setAttribute('content', meData.ogImage);
            }
        }
    }, [meData]);

    return null;
};

export default SEOManager;
