import React from 'react';
import { Phone, Mail, Facebook, Instagram, Star, Zap } from 'lucide-react';
import { useMeData } from '../hooks/useContent';

const ContactItem = ({ icon: Icon, label, value, href }) => {
    if (!value) return null;
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 p-6 glass-panel rounded-2xl hover:bg-white/[0.03] transition-all group border border-white/5 hover:border-accent-primary/20 hover:-translate-y-1">
            <div className="p-3 rounded-full bg-white/5 text-accent-primary group-hover:scale-110 transition-transform duration-300 shadow-[0_0_10px_rgba(242,254,119,0.1)]">
                <Icon size={18} />
            </div>
            <div className="overflow-hidden">
                <p className="text-[9px] text-text-secondary mb-1 font-black uppercase tracking-widest opacity-40 italic">{label}</p>
                <p className="text-base font-bold text-white group-hover:text-accent-primary transition-colors truncate">{value}</p>
            </div>
        </a>
    );
};

const Contact = () => {
    const { data: meData } = useMeData();

    return (
        <div className="container min-h-screen py-48 md:py-64 flex flex-col justify-center">
            <div className="max-w-4xl mx-auto w-full">
                {/* Header */}
                <div className="mb-24 animate-fade-in-up text-center">
                    <div className="flex items-center justify-center gap-2 mb-8 mx-auto opacity-50">
                        <div className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-accent-primary">
                            <Star size={12} fill="currentColor" />
                        </div>
                        <h4 className="text-accent-primary font-bold tracking-[0.4em] text-[10px] uppercase">let's talk creative</h4>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black mb-10 leading-tight tracking-tighter text-white lowercase">
                        nhau nha.
                    </h1>
                    <p className="text-lg text-text-secondary leading-relaxed font-light max-w-lg mx-auto italic opacity-40 lowercase">
                        mình luôn sẵn sàng cho những dự án mới, những ý tưởng điên rồ hoặc đơn giản là một buổi cà phê chia sẻ.
                    </p>
                </div>

                {/* Contact Methods - Compact Grid */}
                <div className="grid md:grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <ContactItem icon={Phone} label="Số điện thoại" value={meData?.phone} href={`tel:${meData?.phone?.replace(/\s/g, '')}`} />
                    <ContactItem icon={Mail} label="Email" value={meData?.email} href={`mailto:${meData?.email}`} />
                    <ContactItem icon={Facebook} label="Facebook" value="Đỗ Hữu Phát" href={meData?.facebook} />
                    <ContactItem icon={Instagram} label="Instagram" value="@phatdo.hp" href={meData?.instagram} />
                    <ContactItem icon={Zap} label="Threads" value="@phatdo.hp" href={meData?.threads} />
                    <ContactItem icon={Zap} label="TikTok" value="@phatdo.hp" href={meData?.tiktok} />
                </div>
            </div>
        </div>
    );
};

export default Contact;
