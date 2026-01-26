import React from 'react';
import { BookOpen, Briefcase, Award, Globe, MapPin, Zap } from 'lucide-react';
import { useMeData } from '../hooks/useContent';
// Keeping static data as fallback if needed, but we will prefer Firebase data
import { meData as staticMeData } from '../data/content';

const TimelineItem = ({ title, place, period, description, index }) => (
    <div className="relative pl-8 pb-12 border-l border-white/10 last:pb-0 group" style={{ animationDelay: `${index * 0.1}s` }}>
        <div className="absolute left-[-21px] top-1.5 w-10 aspect-square rounded-full glass-panel flex items-center justify-center text-accent-primary group-hover:border-accent-primary/50 transition-all duration-500 text-[10px] font-black italic bg-bg-primary">
            {index + 1}
        </div>
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-primary transition-colors">{title}</h3>
        <div className="flex items-center gap-2 text-[10px] text-accent-secondary mb-3 font-black uppercase tracking-[0.2em] opacity-60">
            <span>{place}</span>
            <span>•</span>
            <span>{period}</span>
        </div>
        <p className="text-sm text-text-secondary leading-loose font-light">{description}</p>
    </div>
);

const AwardItem = ({ title, place, period, description }) => (
    <div className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-accent-primary/20 transition-all duration-500 group flex items-start gap-5">
        <div className="p-3 rounded-2xl bg-white/5 text-accent-secondary group-hover:bg-accent-secondary group-hover:text-bg-primary transition-all duration-500">
            <Award size={24} />
        </div>
        <div>
            <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
            <p className="text-[10px] text-accent-primary font-black uppercase tracking-widest opacity-60 mb-2">{place} • {period}</p>
            <p className="text-xs text-text-secondary font-light leading-relaxed">{description}</p>
        </div>
    </div>
);

const Me = () => {
    const { data: remoteMeData, loading } = useMeData();
    const meData = remoteMeData || staticMeData;

    if (loading && !remoteMeData) return null;

    return (
        <div className="container min-h-screen py-40 md:py-56">
            <div className="max-w-5xl mx-auto">
                <header className="mb-24 text-center">
                    <div className="flex items-center justify-center gap-2 mb-8 mx-auto">
                        <div className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-accent-primary">
                            <Zap size={14} fill="currentColor" />
                        </div>
                        <h4 className="text-accent-primary font-bold tracking-[0.4em] text-[11px] uppercase">creative identity</h4>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter text-white">
                        về <span className="text-accent-primary">mình.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-text-secondary max-w-2xl font-light leading-relaxed animate-fade-in-up mx-auto italic opacity-60">
                        ngôi nhà nơi mình chia sẻ những cảm xúc và tư duy về nghề sáng tạo.
                    </p>
                </header>

                <div className="grid lg:grid-cols-2 gap-20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {/* Education */}
                    <div>
                        <h2 className="text-2xl font-black mb-12 flex items-center gap-3 text-white uppercase italic tracking-widest text-[13px] opacity-40">
                            học vấn
                        </h2>
                        <div className="space-y-2">
                            {meData.education.map((item, index) => (
                                <TimelineItem key={index} index={index} {...item} />
                            ))}
                        </div>
                    </div>

                    {/* Experience */}
                    <div>
                        <h2 className="text-2xl font-black mb-12 flex items-center gap-3 text-white uppercase italic tracking-widest text-[13px] opacity-40">
                            kinh nghiệm
                        </h2>
                        <div className="space-y-2">
                            {meData.experience.map((item, index) => (
                                <TimelineItem key={index} index={index} {...item} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Awards Section */}
                <section className="mt-32 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <h2 className="text-2xl font-black mb-12 text-white uppercase italic tracking-widest text-[13px] opacity-40 text-center">thành tích</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {meData.awards.map((award, index) => (
                            <AwardItem key={index} {...award} />
                        ))}
                    </div>
                </section>

                <section className="mt-32 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <h2 className="text-2xl font-black mb-12 text-white uppercase italic tracking-widest text-[13px] opacity-40">đã từng ghé qua</h2>

                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="glass-panel p-8 rounded-3xl border border-white/5">
                            <div className="flex items-center gap-3 mb-6">
                                <Globe className="text-accent-primary opacity-50" size={20} />
                                <h3 className="text-lg font-bold">THẾ GIỚI</h3>
                            </div>
                            <div className="aspect-[2/1] bg-white/[0.02] rounded-2xl flex items-center justify-center border border-white/5 mb-6 relative overflow-hidden group">
                                <div className="flex gap-1.5 flex-wrap justify-center p-6">
                                    {meData.travel?.countries?.map(c => (
                                        <span key={c} className="px-2 py-0.5 bg-accent-primary/10 text-accent-primary rounded-lg text-[9px] font-black border border-accent-primary/10 uppercase tracking-tighter">{c}</span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-[11px] text-text-secondary font-bold uppercase opacity-30 italic">
                                {meData.travel?.countries?.length || 0} {meData.travel?.countries?.length === 1 ? 'country' : 'countries'} explored
                            </p>
                        </div>

                        <div className="glass-panel p-8 rounded-3xl border border-white/5">
                            <div className="flex items-center gap-3 mb-6">
                                <MapPin className="text-accent-secondary opacity-50" size={20} />
                                <h3 className="text-lg font-bold">VIỆT NAM</h3>
                            </div>
                            <div className="aspect-[2/1] bg-white/[0.02] rounded-2xl flex items-center justify-center border border-white/5 mb-6 relative overflow-hidden group">
                                <div className="flex gap-1.5 flex-wrap justify-center p-6 text-[9px]">
                                    {meData.travel?.provinces?.slice(0, 8).map(p => (
                                        <span key={p} className="px-2 py-0.5 bg-white/5 text-text-primary rounded-lg font-bold border border-white/5">{p}</span>
                                    ))}
                                    {(meData.travel?.provinces?.length > 8) && (
                                        <span className="px-2 py-0.5 bg-accent-secondary/10 text-accent-secondary rounded-lg font-bold">+{meData.travel.provinces.length - 8}</span>
                                    )}
                                </div>
                            </div>
                            <p className="text-[11px] text-text-secondary font-bold uppercase opacity-30 italic">
                                {meData.travel?.provinces?.length || 0} {meData.travel?.provinces?.length === 1 ? 'province' : 'provinces'} visited
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Me;
