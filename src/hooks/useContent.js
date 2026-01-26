import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';

/**
 * Hook to fetch global content (meData) from Firestore
 */
export const useMeData = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // meData is stored as a single document in 'config' collection
        const unsub = onSnapshot(doc(db, 'config', 'meData'), (doc) => {
            if (doc.exists()) {
                setData(doc.data());
            }
            setLoading(false);
        }, (err) => {
            console.error("Error fetching meData:", err);
            setError(err);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    return { data, loading, error };
};

/**
 * Hook to fetch a collection of items (projects, clips, etc.)
 */
export const useCollection = (collectionName) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const q = query(collection(db, collectionName), orderBy('order', 'asc'));
        const unsub = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setData(items);
            setLoading(false);
        }, (err) => {
            console.error(`Error fetching collection ${collectionName}:`, err);
            setError(err);
            setLoading(false);
        });

        return () => unsub();
    }, [collectionName]);

    return { data, loading, error };
};
