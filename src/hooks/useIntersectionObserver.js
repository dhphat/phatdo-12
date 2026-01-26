import { useState, useEffect, useRef } from 'react';

/**
 * Hook to track when an element is in the viewport "sweet spot" (e.g., center of the screen).
 * @param {Object} options - IntersectionObserver options
 * @returns {[Object, boolean]} - Ref to attach to element and visibility state
 */
export const useIntersectionObserver = (options = {}) => {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -30% 0px', // Sweet spot: middle 40% of the screen
            threshold: 0,
            ...options
        };

        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting);
        }, observerOptions);

        const currentElement = elementRef.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, [options.root, options.rootMargin, options.threshold]);

    return [elementRef, isVisible];
};
