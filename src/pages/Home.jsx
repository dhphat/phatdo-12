import React, { useState, useEffect } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMeData } from '../hooks/useContent';

const Home = () => {
    const { data: meData, loading } = useMeData();
    const roles = meData?.roles || ["Creative Designer"];
    const [roleIndex, setRoleIndex] = useState(0);

    useEffect(() => {
        if (!roles.length) return;
        const interval = setInterval(() => {
            setRoleIndex((prev) => (prev + 1) % roles.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [roles.length]);

    if (loading) return null; // Or a subtle skeleton

    return (
        <div className="min-h-screen flex items-center overflow-hidden">
            {/* Hero Section - Single Full Screen Screen */}
            <section className="container flex flex-col md:flex-row items-center justify-between gap-12 py-20 relative">

                {/* Left Side: Content */}
                <div className="w-full md:w-1/2 z-10 transition-all duration-700">
                    <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
                        <div className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-accent-primary shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                            <Star size={12} fill="currentColor" />
                        </div>
                        <div className="h-4 flex items-center">
                            <AnimatePresence mode="wait">
                                <motion.h4
                                    key={roles[roleIndex]}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 0.7, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.5, ease: "circOut" }}
                                    className="text-accent-primary font-bold tracking-[0.3em] text-[10px] uppercase"
                                >
                                    {roles[roleIndex]}
                                </motion.h4>
                            </AnimatePresence>
                        </div>
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-10 leading-[0.9] tracking-tighter animate-fade-in-up text-white lowercase">
                        {meData?.homeText1 ? (
                            meData.homeText1.split('\n').map((line, i) => (
                                <React.Fragment key={i}>
                                    {line.includes('guidance') ? (
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">{line}</span>
                                    ) : (
                                        <>{line}<br /></>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <>
                                expert <br />
                                creative <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">guidance.</span>
                            </>
                        )}
                    </h1>

                    <p className="text-lg md:text-xl text-text-secondary max-w-sm mb-12 leading-relaxed animate-fade-in-up font-light lowercase italic opacity-50" style={{ animationDelay: '0.1s' }}>
                        {meData?.homeText2?.includes('chill with...') ? (
                            <>
                                {meData.homeText2.split('chill with...')[0]}
                                <span className="text-accent-primary">chill with...</span>
                            </>
                        ) : (
                            meData?.homeText2 || "nơi mình chia sẻ những khoảnh khắc sáng tạo và chill with..."
                        )}
                    </p>

                    <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <a href={meData?.homeButtonLink || "#shortcuts"} className="btn-pill px-10 border-white/5 bg-white/5 hover:bg-accent-primary hover:text-bg-primary">
                            {meData?.homeButtonText || "khám phá dự án"} <ArrowRight size={14} />
                        </a>
                    </div>
                </div>

                {/* Right Side: Clean Portrait (No Overlays) */}
                <div className="w-full md:w-1/2 flex justify-end items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="relative w-full max-w-[450px] aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl group">
                        {/* Main Image Clean */}
                        <img
                            src={meData?.heroImage || "/assets/hero-portrait-blue.png"}
                            alt="Phat Do"
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                        />

                        {/* Minimal Gradient for depth */}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg-primary opacity-60"></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
