import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Briefcase, Image as ImageIcon, Video, Users, ExternalLink, Play, ArrowRight, Star, Zap, Sparkles, Smile, Compass, MapPin, Heart, Infinity, Moon, Sun, Wind, Mountain, Coffee, Fingerprint, Trophy, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMeData, useCollection } from '../hooks/useContent';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { projects as staticProjects, visual as staticVisuals, clip as staticClips, crew as staticCrew } from '../data/content';

const getYouTubeId = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url.split('embed/')[1]?.split('?')[0];
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }
    return videoId;
};

const getEmbedUrl = (url) => {
    const videoId = getYouTubeId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1` : url;
};

const getThumbnailUrl = (url) => {
    const videoId = getYouTubeId(url);
    return videoId ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` : null;
};

const Lightbox = ({ images, currentIndex, onClose, onPrev, onNext }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'ArrowRight') onNext();
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [onClose, onPrev, onNext]);

    if (!images || images.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-bg-primary/95 flex items-center justify-center p-4 md:p-10 backdrop-blur-md"
            onClick={onClose}
        >
            <button
                className="absolute top-6 right-6 text-white hover:text-accent-primary p-2 z-[101] active:scale-90 transition-all"
                onClick={onClose}
            >
                <X size={32} />
            </button>

            {images.length > 1 && (
                <>
                    <button
                        className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-white hover:text-accent-primary p-2 z-[101] active:scale-90 transition-all"
                        onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    >
                        <ChevronLeft size={48} />
                    </button>
                    <button
                        className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 text-white hover:text-accent-primary p-2 z-[101] active:scale-90 transition-all"
                        onClick={(e) => { e.stopPropagation(); onNext(); }}
                    >
                        <ChevronRight size={48} />
                    </button>
                </>
            )}

            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative max-w-full max-h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={images[currentIndex]}
                    alt=""
                    className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5"
                />

                {images.length > 1 && (
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-xs font-black tracking-widest uppercase">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

const YouTubePlayer = ({ url, title, isActive }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const thumbnail = getThumbnailUrl(url);

    return (
        <div className={`aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/5 mb-6 group relative max-w-2xl transition-all duration-700 ${isActive ? 'grayscale-0' : 'grayscale'}`}>
            {!isPlaying ? (
                <div
                    className="relative w-full h-full cursor-pointer group/player"
                    onClick={() => setIsPlaying(true)}
                >
                    <img
                        src={thumbnail || "/assets/video-placeholder.jpg"}
                        alt={title}
                        className="w-full h-full object-cover opacity-60 group-hover/player:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-accent-primary/20 backdrop-blur-sm flex items-center justify-center text-accent-primary group-hover/player:scale-110 transition-transform shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                            <Play size={24} fill="currentColor" className="ml-1" />
                        </div>
                    </div>
                </div>
            ) : (
                <iframe
                    src={getEmbedUrl(url)}
                    title={title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            )}
        </div>
    );
};

const PageHeader = ({ title, subtitle, headline, headlineIcon: HeadlineIcon }) => (
    <div className="mb-10 md:mb-16 animate-fade-in-up text-center px-4">
        {headline && (
            <div className="flex items-center justify-center gap-2 mb-6 mx-auto">
                <div className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-accent-primary">
                    <HeadlineIcon size={12} fill="currentColor" />
                </div>
                <h4 className="text-accent-primary font-black uppercase tracking-[0.4em] text-[10px]">
                    {headline}
                </h4>
            </div>
        )}
        <h1 className="text-4xl md:text-7xl font-black mb-4 md:mb-6 text-white tracking-tighter leading-tight">{title}</h1>
        <p className="text-xs md:text-sm text-text-secondary max-w-2xl font-light leading-relaxed mx-auto opacity-70">{subtitle}</p>
    </div>
);

const TabButton = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-full border transition-all duration-500 font-bold tracking-widest uppercase text-[10px] active:scale-95 ${active
            ? 'bg-accent-primary text-bg-primary border-accent-primary shadow-[0_0_15px_rgba(0,229,255,0.3)] scale-105'
            : 'bg-white/5 text-text-secondary border-white/5 hover:text-white hover:bg-white/10'
            }`}
    >
        <Icon size={14} />
        {label}
    </button>
);

const MediaGrid = ({ images, isActive, onImageClick }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 max-w-xl">
        {images?.map((img, idx) => (
            <div
                key={idx}
                className="aspect-square rounded-lg overflow-hidden border border-white/5 group/img cursor-zoom-in"
                onClick={() => onImageClick(images, idx)}
            >
                <img
                    src={img}
                    alt=""
                    className={`w-full h-full object-cover transition-all duration-1000 group-hover/img:scale-110 active:scale-110 ${isActive ? 'grayscale-0' : 'grayscale group-hover/img:grayscale-0'}`}
                />
            </div>
        ))}
    </div>
);

const ProjectItem = ({ item, onImageClick }) => {
    const [ref, isVisible] = useIntersectionObserver();

    return (
        <div
            ref={ref}
            className={`glass-panel p-6 md:p-8 rounded-[1.5rem] border transition-all duration-700 animate-fade-in-up ${isVisible ? 'border-accent-primary/20 shadow-[0_0_30px_rgba(0,229,255,0.05)]' : 'border-white/5'}`}
        >
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/4">
                    <div className={`aspect-square rounded-xl overflow-hidden bg-white/5 flex items-center justify-center p-4 border border-white/5 mb-4 group ring-1 ring-white/10 max-w-[100px] lg:max-w-none mx-auto lg:mx-0 transition-all duration-700 ${isVisible ? 'grayscale-0 scale-105' : 'grayscale'}`}>
                        <img src={item.logo} alt={item.title} className="w-full h-full object-contain transition-transform duration-500" />
                    </div>
                    <div className="space-y-3 text-center lg:text-left">
                        {item.websiteUrl && (
                            <a href={item.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between text-accent-primary hover:text-white active:scale-95 transition-all font-black uppercase text-[8px] tracking-[0.2em] bg-white/5 p-2.5 rounded-lg border border-white/5">
                                visit project <ArrowRight size={12} />
                            </a>
                        )}
                        <div className="flex flex-wrap gap-1 justify-center lg:justify-start">
                            {item.otherLinks?.map((link, idx) => (
                                <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="text-[7px] text-text-secondary hover:text-white active:scale-95 transition-all uppercase font-black tracking-widest px-1.5 py-1 rounded-md bg-white/5 border border-white/5">
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:w-3/4">
                    <span className="text-accent-secondary font-black uppercase tracking-[0.4em] text-[8px] mb-2 block opacity-60">/ {item.category}</span>
                    <h3 className="text-2xl font-black text-white mb-3 tracking-tighter leading-none">{item.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed font-light mb-5 opacity-80">{item.description}</p>

                    {item.videoUrl && (
                        <YouTubePlayer url={item.videoUrl} title={item.title} isActive={isVisible} />
                    )}
                    {item.images && <MediaGrid images={item.images} isActive={isVisible} onImageClick={onImageClick} />}
                </div>
            </div>
        </div>
    );
};

const VisualItem = ({ item, onImageClick }) => {
    const [ref, isVisible] = useIntersectionObserver();
    const images = useMemo(() => item.image ? [item.image] : (item.images || []), [item.image, item.images]);

    return (
        <div ref={ref} className="group animate-fade-in-up">
            <div
                className="aspect-[4/5] overflow-hidden rounded-[1rem] border border-white/5 mb-3 cursor-zoom-in"
                onClick={() => onImageClick(images, 0)}
            >
                <img
                    src={images[0]}
                    alt={item.title}
                    className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 active:scale-110 ${isVisible ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`}
                />
            </div>
            <div>
                <span className="text-accent-primary font-black text-[8px] uppercase tracking-[0.3em] mb-1 block">/ {item.type}</span>
                <h3 className="text-base font-black text-white tracking-tight">{item.title}</h3>
            </div>
        </div>
    );
};

const ClipItem = ({ item }) => {
    const [ref, isVisible] = useIntersectionObserver();

    return (
        <div ref={ref} className={`glass-panel p-6 rounded-[1.5rem] border transition-all duration-700 animate-fade-in-up ${isVisible ? 'border-accent-primary/20 shadow-[0_0_30px_rgba(0,229,255,0.05)]' : 'border-white/5'}`}>
            <div className="flex flex-col gap-5">
                <YouTubePlayer url={item.videoUrl} title={item.title} isActive={isVisible} />
                <div>
                    <span className="text-accent-secondary font-black uppercase tracking-[0.4em] text-[8px] mb-1 block opacity-60">/ {item.role}</span>
                    <h3 className="text-xl font-black text-white mb-2 tracking-tighter">{item.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed font-light mb-4 opacity-60">{item.description}</p>
                    <div className="flex gap-2">
                        {item.otherLinks?.map((link, idx) => (
                            <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[7px] text-text-secondary hover:text-accent-primary active:scale-95 transition-all uppercase font-black tracking-widest px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5">
                                {link.name} <ExternalLink size={8} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CrewItem = ({ item, onImageClick }) => {
    const [ref, isVisible] = useIntersectionObserver();

    return (
        <div ref={ref} className={`glass-panel p-6 rounded-[1.5rem] border transition-all duration-700 animate-fade-in-up ${isVisible ? 'border-accent-primary/20 shadow-[0_0_30px_rgba(0,229,255,0.05)]' : 'border-white/5'}`}>
            <div className="mb-6">
                <span className="text-accent-secondary font-black uppercase tracking-[0.4em] text-[8px] mb-1 block opacity-60">/ {item.role}</span>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tighter text-center lg:text-left">{item.organization}</h3>
                <p className="text-sm text-text-secondary leading-relaxed font-light mb-5 opacity-80">{item.description}</p>
                <div className="flex gap-2 justify-center lg:justify-start">
                    {item.otherLinks?.map((link, idx) => (
                        <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[8px] text-accent-primary hover:text-white active:scale-95 transition-all uppercase font-black tracking-widest px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                            {link.name} <ArrowRight size={10} />
                        </a>
                    ))}
                </div>
            </div>
            {item.images && <MediaGrid images={item.images} isActive={isVisible} onImageClick={onImageClick} />}
        </div>
    );
};

const ChillWith = () => {
    const [activeTab, setActiveTab] = useState('project');
    const [lightbox, setLightbox] = useState({ isOpen: false, images: [], index: 0 });

    const { data: remoteProjects, loading: loadingP } = useCollection('projects');
    const { data: remoteVisuals, loading: loadingPh } = useCollection('visual');
    const { data: remoteClips, loading: loadingC } = useCollection('clip');
    const { data: remoteCrew, loading: loadingCr } = useCollection('crew');

    const projects = remoteProjects.length > 0 ? remoteProjects : staticProjects;
    const visuals = remoteVisuals.length > 0 ? remoteVisuals : staticVisuals;
    const clips = remoteClips.length > 0 ? remoteClips : staticClips;
    const crew = remoteCrew.length > 0 ? remoteCrew : staticCrew;

    const { data: remoteMeData } = useMeData();

    const HeadlineIcon = useMemo(() => {
        const icons = [Star, Zap, Sparkles, Smile, Compass, MapPin, Heart, Infinity, Moon, Sun, Wind, Mountain, Coffee, Fingerprint, Trophy];
        return icons[Math.floor(Math.random() * icons.length)];
    }, []);

    const openLightbox = (images, index) => {
        setLightbox({ isOpen: true, images, index });
    };

    const closeLightbox = () => {
        setLightbox({ ...lightbox, isOpen: false });
    };

    const prevImage = () => {
        setLightbox(prev => ({
            ...prev,
            index: (prev.index - 1 + prev.images.length) % prev.images.length
        }));
    };

    const nextImage = () => {
        setLightbox(prev => ({
            ...prev,
            index: (prev.index + 1) % prev.images.length
        }));
    };

    const isLoading = loadingP || loadingPh || loadingC || loadingCr;

    return (
        <div className="container min-h-screen py-32 md:py-48">
            <PageHeader
                headline={remoteMeData?.chillHeadline || "chill vibes"}
                headlineIcon={HeadlineIcon}
                title={remoteMeData?.chillTitle || "chill với..."}
                subtitle={remoteMeData?.chillSubtitle || "nơi mình lưu giữ những giá trị sáng tạo và những con người đã đồng hành cùng mình."}
            />

            <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-2 md:gap-3 mb-10 md:mb-16 animate-fade-in-up overflow-x-auto pb-4 px-4 scrollbar-hide">
                <TabButton active={activeTab === 'project'} onClick={() => setActiveTab('project')} icon={Briefcase} label="Project" />
                <TabButton active={activeTab === 'visual'} onClick={() => setActiveTab('visual')} icon={ImageIcon} label="Visual" />
                <TabButton active={activeTab === 'clip'} onClick={() => setActiveTab('clip')} icon={Video} label="Clip" />
                <TabButton active={activeTab === 'crew'} onClick={() => setActiveTab('crew')} icon={Users} label="Crew" />
            </div>

            <div className="space-y-10 max-w-4xl mx-auto px-4">
                {activeTab === 'project' && projects.map(item => <ProjectItem key={item.id} item={item} onImageClick={openLightbox} />)}
                {activeTab === 'visual' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {visuals.map(item => <VisualItem key={item.id} item={item} onImageClick={openLightbox} />)}
                    </div>
                )}
                {activeTab === 'clip' && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {clips.map(item => <ClipItem key={item.id} item={item} />)}
                    </div>
                )}
                {activeTab === 'crew' && (
                    <div className="space-y-10">
                        {crew.map(item => <CrewItem key={item.id} item={item} onImageClick={openLightbox} />)}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {lightbox.isOpen && (
                    <Lightbox
                        images={lightbox.images}
                        currentIndex={lightbox.index}
                        onClose={closeLightbox}
                        onPrev={prevImage}
                        onNext={nextImage}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChillWith;
