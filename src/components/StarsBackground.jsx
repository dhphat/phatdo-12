import React, { useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const StarsBackground = () => {
    const canvasRef = useRef(null);
    const location = useLocation();
    const prevPathRef = useRef(location.pathname);
    const velocityRef = useRef({ x: 0, y: 0 });
    const boostRef = useRef(0);

    const routes = useMemo(() => ['/', '/minh', '/chill-voi', '/nhau-nha'], []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const starCount = 250;
        const stars = Array.from({ length: starCount }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2.0 + 0.5,
            opacity: Math.random(),
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            baseOpacity: Math.random() * 0.7 + 0.3
        }));

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Decelerate boost
            boostRef.current *= 0.95;
            if (Math.abs(boostRef.current) < 0.1) boostRef.current = 0;

            stars.forEach(star => {
                // Update position with boost
                star.x += boostRef.current;

                // Wrap around
                if (star.x < 0) star.x = canvas.width;
                if (star.x > canvas.width) star.x = 0;

                // Twinkle
                star.opacity += star.twinkleSpeed;
                if (star.opacity > 1 || star.opacity < 0) {
                    star.twinkleSpeed = -star.twinkleSpeed;
                }

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, star.opacity * star.baseOpacity)})`;
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    useEffect(() => {
        const prevIndex = routes.indexOf(prevPathRef.current);
        const currIndex = routes.indexOf(location.pathname);

        if (prevIndex !== -1 && currIndex !== -1 && prevIndex !== currIndex) {
            // Whoosh effect direction
            const direction = currIndex > prevIndex ? -50 : 50;
            boostRef.current = direction;
        }

        prevPathRef.current = location.pathname;
    }, [location.pathname, routes]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
        />
    );
};

export default StarsBackground;
