import React, { useMemo } from 'react';
import { Star, Zap, Sparkles, Smile, Compass, MapPin, Heart, Infinity, Moon, Sun, Wind, Mountain, Coffee, Fingerprint, Trophy } from 'lucide-react';

const LoadingScreen = () => {
    const HeadlineIcon = useMemo(() => {
        const icons = [Star, Zap, Sparkles, Smile, Compass, MapPin, Heart, Infinity, Moon, Sun, Wind, Mountain, Coffee, Fingerprint, Trophy];
        return icons[Math.floor(Math.random() * icons.length)];
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] bg-bg-primary flex flex-col items-center justify-center">
            <div className="relative">
                {/* Pulsing Outer Glow */}
                <div className="absolute inset-0 bg-accent-primary/20 blur-3xl rounded-full animate-pulse-slow scale-150"></div>

                {/* Main Logo/Icon */}
                <div className="relative glass-panel w-20 h-20 rounded-full flex items-center justify-center border-white/5 shadow-2xl animate-float">
                    <HeadlineIcon size={32} className="text-accent-primary animate-pulse" fill="currentColor" />
                </div>
            </div>

            {/* Minimalist Text */}
            <div className="mt-12 text-center">
                <p className="text-xs font-black tracking-[0.3em] text-accent-primary opacity-80 animate-pulse lowercase">
                    phát ơi khách tới nhà kìa
                </p>
            </div>

            {/* Subtle Progress Bar (Design only) */}
            <div className="mt-8 w-32 h-[1px] bg-white/5 overflow-hidden">
                <div className="h-full bg-accent-primary/40 animate-loading-bar origin-left"></div>
            </div>
        </div>
    );
};

export default LoadingScreen;
