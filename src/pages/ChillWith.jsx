import React, { useState } from 'react';
import { Briefcase, Image as ImageIcon, Video, Users, ExternalLink, Play, ArrowRight } from 'lucide-react';
import { useCollection } from '../hooks/useContent';
import { projects as staticProjects, photos as staticPhotos, clips as staticClips, crew as staticCrew } from '../data/content';

const PageHeader = ({ title, subtitle }) => (
    <div className="mb-20 animate-fade-in-up text-center">
        <h1 className="text-6xl md:text-8xl font-black mb-8 text-white tracking-tighter uppercase">{title}</h1>
        <p className="text-lg md:text-xl text-text-secondary max-w-3xl font-light leading-relaxed mx-auto italic opacity-60 lowercase">{subtitle}</p>
    </div>
);

const TabButton = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 px-8 py-3 rounded-full border transition-all duration-500 font-bold tracking-widest uppercase text-[11px] ${active
            ? 'bg-accent-primary text-bg-primary border-accent-primary shadow-[0_0_20px_rgba(0,229,255,0.3)] scale-105'
            : 'bg-white/5 text-text-secondary border-white/5 hover:text-white hover:bg-white/10'
            }`}
    >
        <Icon size={16} />
        {label}
    </button>
);

const MediaGrid = ({ images }) => (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
        {images?.map((img, idx) => (
            <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-white/5 group/img">
                <img src={img} alt="" className="w-full h-full object-cover grayscale group-hover/img:grayscale-0 transition-all duration-1000 group-hover/img:scale-110" />
            </div>
        ))}
    </div>
);

const ProjectItem = ({ item }) => (
    <div className="glass-panel p-8 md:p-10 rounded-[2rem] border border-white/5 animate-fade-in-up hover:border-accent-primary/10 transition-colors duration-500">
        <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-1/4">
                <div className="aspect-square rounded-2xl overflow-hidden bg-white/5 flex items-center justify-center p-6 border border-white/5 mb-4 group ring-1 ring-white/10">
                    <img src={item.logo} alt={item.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="space-y-2">
                    {item.websiteUrl && (
                        <a href={item.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between text-accent-primary hover:text-white transition-colors font-black uppercase text-[9px] tracking-[0.2em] bg-white/5 p-3 rounded-xl border border-white/5">
                            visit project <ArrowRight size={14} />
                        </a>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                        {item.otherLinks?.map((link, idx) => (
                            <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="text-[8px] text-text-secondary hover:text-white transition-colors uppercase font-black tracking-widest px-2 py-1.5 rounded-lg bg-white/5 border border-white/5">
                                {link.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="lg:w-3/4">
                <span className="text-accent-secondary font-black uppercase tracking-[0.4em] text-[9px] mb-3 block opacity-60 italic">/ {item.category}</span>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tighter leading-none lowercase">{item.title}</h3>
                <p className="text-base text-text-secondary leading-relaxed font-light mb-6 opacity-80 lowercase italic">{item.description}</p>

                {item.videoUrl && (
                    <div className="aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/5 mb-6 group">
                        <iframe src={item.videoUrl} className="w-full h-full opacity-40 group-hover:opacity-100 transition-opacity duration-1000 grayscale group-hover:grayscale-0" />
                    </div>
                )}
                {item.images && <MediaGrid images={item.images} />}
            </div>
        </div>
    </div>
);

const PhotoItem = ({ item }) => (
    <div className="group animate-fade-in-up">
        <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-white/5 mb-4">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
        </div>
        <div>
            <span className="text-accent-primary font-black text-[9px] uppercase tracking-[0.3em] mb-1 block">/ {item.type}</span>
            <h3 className="text-lg font-black text-white tracking-tight lowercase">{item.title}</h3>
        </div>
    </div>
);

const ClipItem = ({ item }) => (
    <div className="glass-panel p-8 rounded-[2rem] border border-white/5 animate-fade-in-up">
        <div className="flex flex-col gap-6">
            <div className="aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/5 group relative">
                <iframe src={item.videoUrl} className="w-full h-full opacity-40 group-hover:opacity-100 transition-opacity duration-1000 grayscale group-hover:grayscale-0" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-accent-primary/20 backdrop-blur-sm flex items-center justify-center text-accent-primary">
                        <Play size={24} fill="currentColor" />
                    </div>
                </div>
            </div>
            <div>
                <span className="text-accent-secondary font-black uppercase tracking-[0.4em] text-[9px] mb-2 block opacity-60 italic">/ {item.role}</span>
                <h3 className="text-2xl font-black text-white mb-3 tracking-tighter lowercase">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed font-light mb-4 lowercase italic opacity-60">{item.description}</p>
                <div className="flex gap-2">
                    {item.otherLinks?.map((link, idx) => (
                        <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[8px] text-text-secondary hover:text-accent-primary transition-colors uppercase font-black tracking-widest px-3 py-2 rounded-lg bg-white/5 border border-white/5">
                            {link.name} <ExternalLink size={10} />
                        </a>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const CrewItem = ({ item }) => (
    <div className="glass-panel p-8 rounded-[2rem] border border-white/5 animate-fade-in-up">
        <div className="mb-6">
            <span className="text-accent-secondary font-black uppercase tracking-[0.4em] text-[9px] mb-2 block opacity-60 italic">/ {item.role}</span>
            <h3 className="text-3xl font-black text-white mb-3 tracking-tighter lowercase">{item.organization}</h3>
            <p className="text-base text-text-secondary leading-relaxed font-light mb-6 lowercase italic opacity-80">{item.description}</p>
            <div className="flex gap-3">
                {item.otherLinks?.map((link, idx) => (
                    <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[9px] text-accent-primary hover:text-white transition-colors uppercase font-black tracking-widest px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                        {link.name} <ArrowRight size={12} />
                    </a>
                ))}
            </div>
        </div>
        {item.images && <MediaGrid images={item.images} />}
    </div>
);

const ChillWith = () => {
    const [activeTab, setActiveTab] = useState('project');

    const { data: remoteProjects, loading: loadingP } = useCollection('projects');
    const { data: remotePhotos, loading: loadingPh } = useCollection('photos');
    const { data: remoteClips, loading: loadingC } = useCollection('clips');
    const { data: remoteCrew, loading: loadingCr } = useCollection('crew');

    const projects = remoteProjects.length > 0 ? remoteProjects : staticProjects;
    const photos = remotePhotos.length > 0 ? remotePhotos : staticPhotos;
    const clips = remoteClips.length > 0 ? remoteClips : staticClips;
    const crew = remoteCrew.length > 0 ? remoteCrew : staticCrew;

    const { data: remoteMeData } = useMeData();

    const isLoading = loadingP || loadingPh || loadingC || loadingCr;
    if (isLoading && !remoteProjects.length) return null;

    return (
        <div className="container min-h-screen py-40 md:py-56">
            <PageHeader
                title={remoteMeData?.chillTitle || "chill với..."}
                subtitle={remoteMeData?.chillSubtitle || "nơi mình lưu giữ những giá trị sáng tạo và những con người đã đồng hành cùng mình."}
            />

            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-20 animate-fade-in-up">
                <TabButton active={activeTab === 'project'} onClick={() => setActiveTab('project')} icon={Briefcase} label="Project" />
                <TabButton active={activeTab === 'hinh'} onClick={() => setActiveTab('hinh')} icon={ImageIcon} label="Hình" />
                <TabButton active={activeTab === 'clip'} onClick={() => setActiveTab('clip')} icon={Video} label="Clip" />
                <TabButton active={activeTab === 'crew'} onClick={() => setActiveTab('crew')} icon={Users} label="Crew" />
            </div>

            <div className="space-y-12 max-w-5xl mx-auto">
                {activeTab === 'project' && projects.map(item => <ProjectItem key={item.id} item={item} />)}
                {activeTab === 'hinh' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {photos.map(item => <PhotoItem key={item.id} item={item} />)}
                    </div>
                )}
                {activeTab === 'clip' && (
                    <div className="grid md:grid-cols-2 gap-8">
                        {clips.map(item => <ClipItem key={item.id} item={item} />)}
                    </div>
                )}
                {activeTab === 'crew' && (
                    <div className="space-y-12">
                        {crew.map(item => <CrewItem key={item.id} item={item} />)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChillWith;
