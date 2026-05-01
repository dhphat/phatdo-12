import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook to fetch global content (meData) from Supabase site_config table
 */
export const useMeData = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: row, error: fetchError } = await supabase
                    .from('site_config')
                    .select('*')
                    .eq('id', 'meData')
                    .single();

                if (fetchError) throw fetchError;

                if (row) {
                    // Convert snake_case DB columns to camelCase for compatibility
                    setData({
                        headline: row.headline,
                        roles: row.roles || [],
                        homeText1: row.home_text1,
                        homeSubtitle: row.home_subtitle,
                        homeButtonText: row.home_button_text,
                        homeButtonLink: row.home_button_link,
                        heroImage: row.hero_image,
                        meTitle: row.me_title,
                        meSubtitle: row.me_subtitle,
                        chillHeadline: row.chill_headline,
                        chillTitle: row.chill_title,
                        chillSubtitle: row.chill_subtitle,
                        contactHeadline: row.contact_headline,
                        contactSubtitle: row.contact_subtitle,
                        ogImage: row.og_image,
                        siteTitle: row.site_title,
                        faviconUrl: row.favicon_url,
                        phone: row.phone,
                        email: row.email,
                        facebook: row.facebook,
                        instagram: row.instagram,
                        threads: row.threads,
                        tiktok: row.tiktok,
                        education: row.education || [],
                        experience: row.experience || [],
                        awards: row.awards || [],
                        places: row.places || []
                    });
                }
            } catch (err) {
                console.error("Error fetching meData:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Subscribe to realtime changes
        const channel = supabase
            .channel('site_config_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'site_config',
                filter: 'id=eq.meData'
            }, (payload) => {
                const row = payload.new;
                if (row) {
                    setData({
                        headline: row.headline,
                        roles: row.roles || [],
                        homeText1: row.home_text1,
                        homeSubtitle: row.home_subtitle,
                        homeButtonText: row.home_button_text,
                        homeButtonLink: row.home_button_link,
                        heroImage: row.hero_image,
                        meTitle: row.me_title,
                        meSubtitle: row.me_subtitle,
                        chillHeadline: row.chill_headline,
                        chillTitle: row.chill_title,
                        chillSubtitle: row.chill_subtitle,
                        contactHeadline: row.contact_headline,
                        contactSubtitle: row.contact_subtitle,
                        ogImage: row.og_image,
                        siteTitle: row.site_title,
                        faviconUrl: row.favicon_url,
                        phone: row.phone,
                        email: row.email,
                        facebook: row.facebook,
                        instagram: row.instagram,
                        threads: row.threads,
                        tiktok: row.tiktok,
                        education: row.education || [],
                        experience: row.experience || [],
                        awards: row.awards || [],
                        places: row.places || []
                    });
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return { data, loading, error };
};

/**
 * Hook to fetch a collection of items (projects, clips, etc.) from Supabase
 */
export const useCollection = (collectionName) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: rows, error: fetchError } = await supabase
                    .from(collectionName)
                    .select('*')
                    .order('order', { ascending: true });

                if (fetchError) throw fetchError;

                // Convert snake_case to camelCase for compatibility
                const mapped = (rows || []).map(row => mapRowToItem(collectionName, row));
                setData(mapped);
            } catch (err) {
                console.error(`Error fetching collection ${collectionName}:`, err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Subscribe to realtime changes
        const channel = supabase
            .channel(`${collectionName}_changes`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: collectionName
            }, async () => {
                // Re-fetch on any change to keep order consistent
                const { data: rows } = await supabase
                    .from(collectionName)
                    .select('*')
                    .order('order', { ascending: true });

                if (rows) {
                    setData(rows.map(row => mapRowToItem(collectionName, row)));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [collectionName]);

    return { data, loading, error };
};

/**
 * Map database row (snake_case) to frontend item (camelCase)
 */
function mapRowToItem(collectionName, row) {
    const base = { id: row.id, order: row.order };

    switch (collectionName) {
        case 'projects':
            return {
                ...base,
                title: row.title,
                category: row.category,
                description: row.description,
                logo: row.logo,
                websiteUrl: row.website_url,
                videoUrl: row.video_url,
                images: row.images || [],
                otherLinks: row.other_links || []
            };
        case 'visual':
            return {
                ...base,
                title: row.title,
                type: row.type,
                images: row.images || [],
                otherLinks: row.other_links || []
            };
        case 'clip':
            return {
                ...base,
                title: row.title,
                role: row.role,
                description: row.description,
                videoUrl: row.video_url,
                otherLinks: row.other_links || []
            };
        case 'crew':
            return {
                ...base,
                organization: row.organization,
                role: row.role,
                description: row.description,
                logo: row.logo,
                images: row.images || [],
                otherLinks: row.other_links || []
            };
        default:
            return { ...base, ...row };
    }
}
