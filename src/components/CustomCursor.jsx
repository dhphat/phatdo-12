import React, { useEffect, useState, useCallback, useRef } from 'react';

const CustomCursor = () => {
    const [position, setPosition] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);
    const cursorRef = useRef(null);

    const onMouseMove = useCallback((e) => {
        const { clientX, clientY } = e;
        setPosition({ x: clientX, y: clientY });

        document.documentElement.style.setProperty('--mouse-x', `${clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${clientY}px`);
    }, []);

    const onMouseOver = useCallback((e) => {
        const target = e.target;
        const isInteractive = target.closest('a') || target.closest('button') || ['A', 'BUTTON'].includes(target.tagName);
        setIsHovering(!!isInteractive);
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('mouseover', onMouseOver, { passive: true });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseover', onMouseOver);
        };
    }, [onMouseMove, onMouseOver]);

    return (
        <div
            ref={cursorRef}
            className={`fixed top-0 left-0 w-3 h-3 bg-accent-primary rounded-full pointer-events-none z-[9999] transition-transform duration-200 ease-out shadow-[0_0_15px_rgba(0,229,255,0.8)] ${isHovering ? 'scale-[2.5]' : 'scale-100'}`}
            style={{
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, -50%)' // Keep internal centered
            }}
        />
    );
};

export default CustomCursor;
