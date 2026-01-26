import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc, collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useMeData, useCollection } from '../../hooks/useContent';
import { Settings, Image, Layout as LayoutIcon, LogOut, ChevronRight, Plus, Save, Trash2, Upload, Link, Video as VideoIcon, Globe, MapPin, BookOpen, ArrowUp, ArrowDown, ListOrdered } from 'lucide-react';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 ${active ? 'bg-accent-primary/10 text-accent-primary border-r-2 border-accent-primary' : 'text-text-secondary hover:bg-white/5 hover:text-white'}`}
    >
        <Icon size={18} />
        <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
    </button>
);

const ImageUpload = ({ onUpload, onRemove, label, currentImage, multiple = false }) => {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setUploading(true);
        try {
            const urls = await Promise.all(files.map(async (file) => {
                const storageRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
                await uploadBytes(storageRef, file);
                return await getDownloadURL(storageRef);
            }));

            if (multiple) {
                onUpload(urls);
            } else {
                onUpload(urls[0]);
            }
        } catch (err) {
            console.error("Upload error:", err);
            alert("Lỗi khi tải ảnh lên.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">{label}</label>
            <div className="flex flex-col gap-4">
                {currentImage && !multiple && (
                    <div className="relative group/img w-24 h-24 rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                        <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
                        {onRemove && (
                            <button
                                type="button"
                                onClick={() => onRemove(currentImage)}
                                className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg"
                                title="Xóa ảnh"
                            >
                                <Trash2 size={12} />
                            </button>
                        )}
                    </div>
                )}
                {multiple && Array.isArray(currentImage) && currentImage.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {currentImage.map((url, i) => (
                            <div key={i} className="relative group/img w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                                <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                {onRemove && (
                                    <button
                                        type="button"
                                        onClick={() => onRemove(url)}
                                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg"
                                        title="Xóa ảnh"
                                    >
                                        <Trash2 size={10} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                <label className={`cursor-pointer group flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border border-dashed border-white/10 hover:border-accent-primary/50 hover:bg-white/[0.02] transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Upload size={20} className="text-text-secondary group-hover:text-accent-primary transition-colors" />
                    <span className="text-[10px] font-bold text-text-secondary group-hover:text-white uppercase tracking-widest">
                        {uploading ? "Đang tải lên..." : (multiple ? "Tải lên nhiều ảnh" : "Chọn ảnh từ máy")}
                    </span>
                    <input type="file" multiple={multiple} onChange={handleFileChange} className="hidden" accept="image/*" />
                </label>
            </div>
        </div>
    );
};

const LinkEditor = ({ links = [], onChange, label }) => {
    const addLink = () => onChange([...links, { name: '', url: '' }]);
    const removeLink = (idx) => onChange(links.filter((_, i) => i !== idx));
    const updateLink = (idx, field, value) => {
        const newLinks = [...links];
        newLinks[idx] = { ...newLinks[idx], [field]: value };
        onChange(newLinks);
    };

    return (
        <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">{label}</label>
            <div className="space-y-3">
                {links.map((link, idx) => (
                    <div key={idx} className="flex gap-2 group">
                        <input
                            type="text"
                            placeholder="Nhãn (VD: Facebook)"
                            value={link.name}
                            onChange={(e) => updateLink(idx, 'name', e.target.value)}
                            className="w-1/3 bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] text-white focus:outline-none focus:border-accent-primary/30 transition-all font-bold"
                        />
                        <input
                            type="text"
                            placeholder="Đường dẫn (URL)"
                            value={link.url}
                            onChange={(e) => updateLink(idx, 'url', e.target.value)}
                            className="flex-grow bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] text-white focus:outline-none focus:border-accent-primary/30 transition-all font-sans"
                        />
                        <button
                            type="button"
                            onClick={() => removeLink(idx)}
                            className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 transition-all border border-red-500/10 hover:text-white"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addLink}
                    className="w-full py-3 rounded-xl border border-dashed border-white/10 text-[9px] font-black uppercase tracking-widest text-text-secondary hover:border-accent-primary/50 hover:text-accent-primary transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={12} /> Thêm đường dẫn (Facebook, Social, Tags...)
                </button>
            </div>
        </div>
    );
};

const PlacesListEditor = ({ items = [], onChange, label }) => {
    const addItem = () => onChange([...items, { name: '', type: 'dom', link: '' }]);
    const removeItem = (idx) => onChange(items.filter((_, i) => i !== idx));
    const updateItem = (idx, field, value) => {
        const newItems = [...items];
        newItems[idx] = { ...newItems[idx], [field]: value };
        onChange(newItems);
    };

    const moveItem = (index, direction) => {
        const newList = [...items];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newList.length) return;
        [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
        onChange(newList);
    };

    return (
        <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">{label}</label>
            <div className="space-y-3">
                {items.map((item, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-2 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                        <input
                            type="text"
                            placeholder="Tên địa điểm"
                            value={item.name}
                            onChange={(e) => updateItem(idx, 'name', e.target.value)}
                            className="flex-grow bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] text-white focus:outline-none focus:border-accent-primary/30 transition-all font-bold"
                        />
                        <select
                            value={item.type}
                            onChange={(e) => updateItem(idx, 'type', e.target.value)}
                            className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] text-white focus:outline-none focus:border-accent-primary/30 transition-all font-bold"
                        >
                            <option value="dom" className="bg-[#0A192F]">Trong nước</option>
                            <option value="intl" className="bg-[#0A192F]">Quốc tế</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Link (Ảnh/Chia sẻ)"
                            value={item.link}
                            onChange={(e) => updateItem(idx, 'link', e.target.value)}
                            className="flex-grow bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] text-white focus:outline-none focus:border-accent-primary/30 transition-all font-sans"
                        />
                        <div className="flex items-center gap-1 shrink-0">
                            <button type="button" onClick={() => moveItem(idx, 'up')} disabled={idx === 0} className="p-2 text-text-secondary hover:text-accent-primary transition-colors disabled:opacity-0">
                                <ArrowUp size={12} />
                            </button>
                            <button type="button" onClick={() => moveItem(idx, 'down')} disabled={idx === items.length - 1} className="p-2 text-text-secondary hover:text-accent-primary transition-colors disabled:opacity-0">
                                <ArrowDown size={12} />
                            </button>
                            <button
                                type="button"
                                onClick={() => removeItem(idx)}
                                className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 transition-all border border-red-500/10 hover:text-white ml-2"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addItem}
                    className="w-full py-3 rounded-xl border border-dashed border-white/10 text-[9px] font-black uppercase tracking-widest text-text-secondary hover:border-accent-primary/50 hover:text-accent-primary transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={12} /> Thêm địa điểm mới
                </button>
            </div>
        </div>
    );
};

const ProfileEditor = () => {
    const { data: remoteData, loading } = useMeData();
    const [meData, setMeData] = useState({
        headline: '',
        roles: [],
        homeText1: 'expert creative guidance.',
        homeSubtitle: 'nơi mình chia sẻ những khoảnh khắc sáng tạo và chill with...',
        homeButtonText: 'khám phá dự án',
        homeButtonLink: '#shortcuts',
        heroImage: '/assets/hero-portrait-blue.png',
        meTitle: 'về mình.',
        meSubtitle: 'ngôi nhà nơi mình chia sẻ những cảm xúc và tư duy về nghề sáng tạo.',
        chillHeadline: 'chill vibes',
        chillTitle: 'chill với...',
        chillSubtitle: 'nơi mình lưu giữ những giá trị sáng tạo và những con người đã đồng hành cùng mình.',
        contactHeadline: "let's talk creative",
        contactSubtitle: 'mình luôn sẵn sàng cho những dự án mới, những ý tưởng điên rồ hoặc đơn giản là một buổi cà phê chia sẻ.',
        ogImage: '',
        siteTitle: '',
        faviconUrl: '',
        phone: '',
        email: '',
        facebook: '',
        instagram: '',
        threads: '',
        tiktok: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (remoteData) {
            setMeData({
                headline: remoteData.headline || '',
                roles: remoteData.roles || [],
                homeText1: remoteData.homeText1 || 'expert creative guidance.',
                homeSubtitle: remoteData.homeSubtitle || remoteData.homeText2 || 'nơi mình chia sẻ những khoảnh khắc sáng tạo và chill with...',
                homeButtonText: remoteData.homeButtonText || 'khám phá dự án',
                homeButtonLink: remoteData.homeButtonLink || '#shortcuts',
                heroImage: remoteData.heroImage || '/assets/hero-portrait-blue.png',
                meTitle: remoteData.meTitle || 'về mình.',
                meSubtitle: remoteData.meSubtitle || 'ngôi nhà nơi mình chia sẻ những cảm xúc và tư duy về nghề sáng tạo.',
                chillHeadline: remoteData.chillHeadline || 'chill vibes',
                chillTitle: remoteData.chillTitle || 'chill với...',
                chillSubtitle: remoteData.chillSubtitle || 'nơi mình lưu giữ những giá trị sáng tạo và những con người đã đồng hành cùng mình.',
                contactHeadline: remoteData.contactHeadline || "let's talk creative",
                contactSubtitle: remoteData.contactSubtitle || 'mình luôn sẵn sàng cho những dự án mới, những ý tưởng điên rồ hoặc đơn giản là một buổi cà phê chia sẻ.',
                ogImage: remoteData.ogImage || '',
                siteTitle: remoteData.siteTitle || '',
                faviconUrl: remoteData.faviconUrl || '',
                phone: remoteData.phone || '',
                email: remoteData.email || '',
                facebook: remoteData.facebook || '',
                instagram: remoteData.instagram || '',
                threads: remoteData.threads || '',
                tiktok: remoteData.tiktok || ''
            });
        }
    }, [remoteData]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await setDoc(doc(db, 'config', 'meData'), meData, { merge: true });
            alert("Đã lưu thành công!");
        } catch (err) {
            console.error("Save error:", err);
            alert("Lỗi khi lưu dữ liệu.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-20 opacity-40 animate-pulse">Đang tải dữ liệu...</div>;

    return (
        <form onSubmit={handleSave} className="w-full max-w-2xl mx-auto space-y-10 animate-fade-in-up">
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Lời chào (Top Label) - Hiển thị trên cùng trang 'Về mình'</label>
                    <input
                        type="text"
                        value={meData.headline}
                        onChange={(e) => setMeData({ ...meData, headline: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-accent-primary/30 focus:bg-white/[0.08] transition-all font-bold"
                        placeholder="VD: creative identity"
                    />
                </div>

                <div className="pt-10 border-t border-white/5 space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Cài đặt Trang chủ</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Tiêu đề chính (Sử dụng * để highlight màu)</label>
                                <textarea
                                    value={meData.homeText1}
                                    onChange={(e) => setMeData({ ...meData, homeText1: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-accent-primary/30"
                                    placeholder="expert *creative* guidance."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Mô tả ngắn trang chủ (Subtitle)</label>
                                <textarea
                                    value={meData.homeSubtitle}
                                    onChange={(e) => setMeData({ ...meData, homeSubtitle: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-accent-primary/30"
                                    placeholder="nơi mình chia sẻ những khoảnh khắc sáng tạo và chill with..."
                                />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Nút bấm Home (Text & Link)</label>
                                <div className="flex gap-2">
                                    <input type="text" value={meData.homeButtonText} onChange={e => setMeData({ ...meData, homeButtonText: e.target.value })} className="flex-grow bg-white/5 border border-white/5 rounded-xl p-3 text-xs" />
                                    <input type="text" value={meData.homeButtonLink} onChange={e => setMeData({ ...meData, homeButtonLink: e.target.value })} className="w-1/3 bg-white/5 border border-white/5 rounded-xl p-3 text-xs" />
                                </div>
                            </div>
                            <ImageUpload
                                label="Hình nền trang chủ (Hero)"
                                currentImage={meData.heroImage}
                                onUpload={(url) => setMeData({ ...meData, heroImage: url })}
                                onRemove={() => setMeData({ ...meData, heroImage: '' })}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Cài đặt Trang con (Me & Chill)</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Trang 'Về mình' (Tiêu đề & Mô tả)</label>
                                <input type="text" value={meData.meTitle} onChange={e => setMeData({ ...meData, meTitle: e.target.value })} placeholder="về mình." className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs mb-2" />
                                <textarea value={meData.meSubtitle} onChange={e => setMeData({ ...meData, meSubtitle: e.target.value })} placeholder="ngôi nhà nơi mình chia sẻ những cảm xúc và tư duy về nghề sáng tạo." className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs" />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Trang 'Chill với' (Top Label, Tiêu đề & Mô tả)</label>
                                <input type="text" value={meData.chillHeadline} onChange={e => setMeData({ ...meData, chillHeadline: e.target.value })} placeholder="chill vibes" className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs mb-2" />
                                <input type="text" value={meData.chillTitle} onChange={e => setMeData({ ...meData, chillTitle: e.target.value })} placeholder="chill với..." className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs mb-2" />
                                <textarea value={meData.chillSubtitle} onChange={e => setMeData({ ...meData, chillSubtitle: e.target.value })} placeholder="nơi mình lưu giữ những giá trị sáng tạo và những con người đã đồng hành cùng mình." className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Trang Liên hệ (Nhau nha)</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Nhãn trên cùng (Top Label)</label>
                            <input type="text" value={meData.contactHeadline} onChange={e => setMeData({ ...meData, contactHeadline: e.target.value })} placeholder="let's talk creative" className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Mô tả phụ (Subtitle)</label>
                            <textarea value={meData.contactSubtitle} onChange={e => setMeData({ ...meData, contactSubtitle: e.target.value })} placeholder="mình luôn sẵn sàng cho những dự án mới..." className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs" />
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Cấu hình SEO & Chia sẻ</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <p className="text-[10px] text-text-secondary leading-relaxed opacity-60">
                                Hình ảnh này sẽ hiển thị khi bạn chia sẻ link website lên Facebook, Zalo, iMessage...
                            </p>
                            <ImageUpload
                                label="Ảnh Thumbnail Website (OG Image)"
                                currentImage={meData.ogImage}
                                onUpload={(url) => setMeData({ ...meData, ogImage: url })}
                                onRemove={() => setMeData({ ...meData, ogImage: '' })}
                            />
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Tên Website (Tab trình duyệt)</label>
                                <input
                                    type="text"
                                    value={meData.siteTitle}
                                    onChange={e => setMeData({ ...meData, siteTitle: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs"
                                    placeholder="Phat Do | Creative Designer & Consultant"
                                />
                            </div>
                            <ImageUpload
                                label="Biểu tượng Website (Favicon)"
                                currentImage={meData.faviconUrl}
                                onUpload={(url) => setMeData({ ...meData, faviconUrl: url })}
                                onRemove={() => setMeData({ ...meData, faviconUrl: '' })}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Thông tin Liên hệ (Contact)</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Số điện thoại</label>
                            <input type="text" value={meData.phone} onChange={e => setMeData({ ...meData, phone: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs" placeholder="+84 348 669 124" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Email</label>
                            <input type="email" value={meData.email} onChange={e => setMeData({ ...meData, email: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs" placeholder="contact@phatdo.com" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Facebook URL</label>
                            <input type="text" value={meData.facebook} onChange={e => setMeData({ ...meData, facebook: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Instagram URL</label>
                            <input type="text" value={meData.instagram} onChange={e => setMeData({ ...meData, instagram: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Threads URL</label>
                            <input type="text" value={meData.threads} onChange={e => setMeData({ ...meData, threads: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">TikTok URL</label>
                            <input type="text" value={meData.tiktok} onChange={e => setMeData({ ...meData, tiktok: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs" />
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Danh sách vị trí (Roles)</label>
                    <div className="space-y-3">
                        {meData?.roles?.map((role, idx) => (
                            <div key={idx} className="flex gap-3">
                                <input
                                    type="text"
                                    value={role}
                                    onChange={(e) => {
                                        const newRoles = [...meData.roles];
                                        newRoles[idx] = e.target.value;
                                        setMeData({ ...meData, roles: newRoles });
                                    }}
                                    className="flex-grow bg-white/5 border border-white/5 rounded-xl py-3 px-5 text-sm text-white focus:outline-none focus:border-accent-primary/30 transition-all font-bold"
                                />
                                <button
                                    type="button"
                                    onClick={() => setMeData({ ...meData, roles: meData.roles.filter((_, i) => i !== idx) })}
                                    className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/10"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setMeData({ ...meData, roles: [...meData.roles, "Role mới"] })}
                            className="w-full py-3 rounded-xl border border-dashed border-white/10 text-[10px] font-black uppercase tracking-widest text-text-secondary hover:border-accent-primary/50 hover:text-accent-primary transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={14} /> Thêm vị trí
                        </button>
                    </div>
                </div>
            </div>
            <button type="submit" disabled={saving} className="w-full btn-pill py-4 flex items-center justify-center gap-3 bg-white text-bg-primary font-black uppercase tracking-widest hover:bg-accent-primary transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
                {!saving && <Save size={18} />}
            </button>
        </form>
    );
};

const BiographyEditor = () => {
    const { data: remoteData, loading } = useMeData();
    const [meData, setMeData] = useState({
        education: [],
        experience: [],
        awards: [],
        places: []
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (remoteData) {
            setMeData({
                ...meData,
                ...remoteData,
                education: remoteData.education || [],
                experience: remoteData.experience || [],
                awards: remoteData.awards || [],
                places: remoteData.places || []
            });
        }
    }, [remoteData]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await setDoc(doc(db, 'config', 'meData'), meData, { merge: true });
            alert("Đã cập nhật tiểu sử!");
        } catch (err) {
            console.error(err);
            alert("Lỗi khi lưu.");
        } finally {
            setSaving(false);
        }
    };

    const addItem = (field, template) => {
        setMeData({ ...meData, [field]: [...meData[field], template] });
    };

    const removeItem = (field, index) => {
        const newList = [...meData[field]];
        newList.splice(index, 1);
        setMeData({ ...meData, [field]: newList });
    };

    const updateItem = (field, index, subfield, value) => {
        const newList = [...meData[field]];
        newList[index] = { ...newList[index], [subfield]: value };
        setMeData({ ...meData, [field]: newList });
    };

    const moveItem = (field, index, direction) => {
        const newList = [...meData[field]];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newList.length) return;
        [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
        setMeData({ ...meData, [field]: newList });
    };

    if (loading) return <div className="text-center py-20 opacity-40">Đang tải...</div>;

    const sections = [
        { key: 'education', label: 'Học vấn', template: { title: '', place: '', period: '', description: '', link: '' } },
        { key: 'experience', label: 'Kinh nghiệm', template: { title: '', place: '', period: '', description: '', link: '' } },
        { key: 'awards', label: 'Thành tích', template: { title: '', place: '', period: '', description: '', link: '' } }
    ];

    return (
        <form onSubmit={handleSave} className="space-y-12 animate-fade-in-up">
            {sections.map(section => (
                <div key={section.key} className="space-y-6">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-primary">{section.label}</label>
                        <button type="button" onClick={() => addItem(section.key, section.template)} className="flex items-center gap-2 text-[10px] font-bold text-text-secondary hover:text-white transition-colors">
                            <Plus size={14} /> Thêm mục
                        </button>
                    </div>
                    <div className="grid gap-4">
                        {meData[section.key]?.map((item, idx) => (
                            <div key={idx} className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4 relative group">
                                <div className="absolute top-4 right-4 flex items-center gap-1">
                                    <button type="button" onClick={() => moveItem(section.key, idx, 'up')} disabled={idx === 0} className="p-2 text-text-secondary hover:text-accent-primary transition-colors disabled:opacity-0">
                                        <ArrowUp size={14} />
                                    </button>
                                    <button type="button" onClick={() => moveItem(section.key, idx, 'down')} disabled={idx === meData[section.key].length - 1} className="p-2 text-text-secondary hover:text-accent-primary transition-colors disabled:opacity-0">
                                        <ArrowDown size={14} />
                                    </button>
                                    <button type="button" onClick={() => removeItem(section.key, idx)} className="p-2 text-red-400/40 hover:text-red-400 transition-colors ml-2">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Tiêu đề (VD: Cử nhân)" value={item.title} onChange={e => updateItem(section.key, idx, 'title', e.target.value)} className="bg-transparent border-b border-white/10 py-2 text-sm text-white focus:outline-none focus:border-accent-primary/50" />
                                    <input type="text" placeholder="Nơi học/làm (VD: Đại học FPT)" value={item.place} onChange={e => updateItem(section.key, idx, 'place', e.target.value)} className="bg-transparent border-b border-white/10 py-2 text-sm text-white focus:outline-none focus:border-accent-primary/50" />
                                    <input type="text" placeholder="Thời gian (VD: 2016 - 2020)" value={item.period} onChange={e => updateItem(section.key, idx, 'period', e.target.value)} className="bg-transparent border-b border-white/10 py-2 text-sm text-white focus:outline-none focus:border-accent-primary/50" />
                                    <input type="text" placeholder="Link tham chiếu (URL)" value={item.link} onChange={e => updateItem(section.key, idx, 'link', e.target.value)} className="bg-transparent border-b border-white/10 py-2 text-sm text-white focus:outline-none focus:border-accent-primary/50 font-sans" />
                                </div>
                                <textarea placeholder="Mô tả..." value={item.description} onChange={e => updateItem(section.key, idx, 'description', e.target.value)} className="w-full bg-transparent border-b border-white/10 py-2 text-sm text-text-secondary focus:outline-none focus:border-accent-primary/50 font-light h-16 resize-none" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className="space-y-6">
                <div className="flex items-center border-b border-white/5 pb-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-primary">Những nơi đã từng ghé qua (Places)</label>
                </div>
                <PlacesListEditor
                    label="Danh sách địa điểm"
                    items={meData.places}
                    onChange={(newItems) => setMeData({ ...meData, places: newItems })}
                />
            </div>

            <button type="submit" disabled={saving} className="w-full btn-pill py-4 flex items-center justify-center gap-3 bg-white text-bg-primary font-black uppercase tracking-widest hover:bg-accent-primary transition-all">
                {saving ? "Đang lưu..." : "Lưu tiểu sử"}
                {!saving && <Save size={18} />}
            </button>
        </form>
    );
};

const ProjectsEditor = () => {
    const { data: projects, loading } = useCollection('projects');
    const [editing, setEditing] = useState(null); // null or project object
    const [saving, setSaving] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editing.id) {
                const { id, ...data } = editing;
                await updateDoc(doc(db, 'projects', id), data);
            } else {
                const newProject = { ...editing, order: projects.length };
                await addDoc(collection(db, 'projects'), newProject);
            }
            setEditing(null);
            alert("Đã cập nhật dự án!");
        } catch (err) {
            console.error(err);
            alert("Lỗi khi lưu dự án.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa dự án này?")) {
            try {
                await deleteDoc(doc(db, 'projects', id));
            } catch (err) {
                console.error(err);
                alert("Lỗi khi xóa.");
            }
        }
    };

    const moveItemFirestore = async (items, index, direction) => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= items.length) return;

        setSaving(true);
        try {
            const item1 = items[index];
            const item2 = items[newIndex];

            // Ensure both have order values, use index as fallback
            const order1 = item1.order !== undefined ? item1.order : index;
            const order2 = item2.order !== undefined ? item2.order : newIndex;

            await Promise.all([
                updateDoc(doc(db, 'projects', item1.id), { order: order2 }),
                updateDoc(doc(db, 'projects', item2.id), { order: order1 })
            ]);
        } catch (err) {
            console.error("Move error:", err);
            alert("Lỗi khi sắp xếp.");
        } finally {
            setSaving(false);
        }
    };
    const fixOrders = async () => {
        if (!window.confirm("Đặt lại thứ tự cho toàn bộ danh sách dự án dựa trên vị trí hiện tại?")) return;
        setSaving(true);
        try {
            const batch = projects.map((p, idx) => updateDoc(doc(db, 'projects', p.id), { order: idx }));
            await Promise.all(batch);
            alert("Đã đặt lại thứ tự dự án!");
        } catch (err) {
            console.error(err);
            alert("Lỗi khi đặt lại thứ tự.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-20 opacity-40 animate-pulse">Đang tải dự án...</div>;

    if (editing) {
        return (
            <div className="animate-fade-in-up">
                <button onClick={() => setEditing(null)} className="mb-8 text-text-secondary hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                    <ChevronRight size={14} className="rotate-180" /> Quay lại danh sách
                </button>
                <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Tên dự án</label>
                            <input type="text" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-accent-primary/30" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Danh mục</label>
                            <input type="text" value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-accent-primary/30" />
                        </div>
                        <div className="space-y-2">
                            <ImageUpload
                                label="Logo dự án"
                                currentImage={editing.logo}
                                onUpload={(url) => setEditing({ ...editing, logo: url })}
                                onRemove={() => setEditing({ ...editing, logo: '' })}
                            />
                        </div>
                        <div className="space-y-2">
                            <ImageUpload
                                label="Hình ảnh dự án (Tải nhiều)"
                                multiple={true}
                                currentImage={editing.images}
                                onUpload={(urls) => setEditing({ ...editing, images: [...(editing.images || []), ...urls] })}
                                onRemove={(url) => setEditing({ ...editing, images: editing.images.filter(img => img !== url) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Website URL</label>
                            <input type="text" value={editing.websiteUrl} onChange={e => setEditing({ ...editing, websiteUrl: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-accent-primary/30 font-sans" />
                        </div>
                        <div className="pt-4">
                            <LinkEditor
                                label="Các đường dẫn khác"
                                links={editing.otherLinks}
                                onChange={(newLinks) => setEditing({ ...editing, otherLinks: newLinks })}
                            />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Mô tả dự án</label>
                            <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={4} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-accent-primary/30 font-light" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Video URL (Youtube/Vimeo)</label>
                            <input type="text" value={editing.videoUrl} onChange={e => setEditing({ ...editing, videoUrl: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-accent-primary/30" />
                        </div>
                        <button type="submit" disabled={saving} className="w-full btn-pill py-5 bg-accent-primary text-bg-primary font-black uppercase tracking-widest mt-4">
                            {saving ? "Đang lưu..." : "Lưu dự án"}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-bold text-white">Danh sách dự án</h3>
                <div className="flex gap-2">
                    <button onClick={fixOrders} disabled={saving} title="Đặt lại thứ tự theo danh sách hiện tại" className="btn-pill px-4 py-3 bg-white/5 hover:bg-accent-primary/20 text-text-secondary hover:text-accent-primary border-white/10">
                        <ListOrdered size={16} />
                    </button>
                    <button onClick={() => setEditing({ title: '', category: '', description: '', logo: '', websiteUrl: '', videoUrl: '', images: [] })} className="btn-pill px-6 py-3 bg-white/5 hover:bg-white/10 text-white border-white/10 flex items-center gap-2">
                        <Plus size={16} /> Thêm mới
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects?.map(p => (
                    <div key={p.id} className="glass-panel p-6 rounded-3xl flex items-center justify-between group hover:border-accent-primary/20 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden p-2 ring-1 ring-white/5">
                                <img src={p.logo} alt="" className="w-full h-full object-contain grayscale" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white group-hover:text-accent-primary transition-colors">{p.title}</h4>
                                <span className="text-[9px] text-text-secondary uppercase tracking-widest opacity-50">{p.category}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex flex-col gap-1 mr-2">
                                <button onClick={() => moveItemFirestore(projects, projects.findIndex(x => x.id === p.id), 'up')} disabled={projects.findIndex(x => x.id === p.id) === 0} className="p-1.5 rounded-lg bg-white/5 text-text-secondary hover:text-white disabled:opacity-0 transition-all"><ArrowUp size={12} /></button>
                                <button onClick={() => moveItemFirestore(projects, projects.findIndex(x => x.id === p.id), 'down')} disabled={projects.findIndex(x => x.id === p.id) === projects.length - 1} className="p-1.5 rounded-lg bg-white/5 text-text-secondary hover:text-white disabled:opacity-0 transition-all"><ArrowDown size={12} /></button>
                            </div>
                            <button onClick={() => setEditing(p)} className="p-3 rounded-xl bg-white/5 text-text-secondary hover:text-white hover:bg-white/10 transition-all"><Settings size={16} /></button>
                            <button onClick={() => handleDelete(p.id)} className="p-3 rounded-xl bg-red-500/5 text-red-400/40 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MediaEditor = () => {
    const [subTab, setSubTab] = useState('visual');
    const { data: items, loading } = useCollection(subTab);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editing.id) {
                const { id, ...data } = editing;
                await updateDoc(doc(db, subTab, id), data);
            } else {
                const newItem = { ...editing, order: items.length };
                await addDoc(collection(db, subTab), newItem);
            }
            setEditing(null);
            alert("Đã cập nhật!");
        } catch (err) {
            console.error(err);
            alert("Lỗi khi lưu.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Xóa mục này?")) {
            await deleteDoc(doc(db, subTab, id));
        }
    };

    const moveItemFirestore = async (index, direction) => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= items.length) return;

        setSaving(true);
        try {
            const item1 = items[index];
            const item2 = items[newIndex];

            const order1 = item1.order !== undefined ? item1.order : index;
            const order2 = item2.order !== undefined ? item2.order : newIndex;

            await Promise.all([
                updateDoc(doc(db, subTab, item1.id), { order: order2 }),
                updateDoc(doc(db, subTab, item2.id), { order: order1 })
            ]);
        } catch (err) {
            console.error("Move error:", err);
            alert("Lỗi khi sắp xếp.");
        } finally {
            setSaving(false);
        }
    };

    const fixOrders = async () => {
        if (!window.confirm(`Đặt lại thứ tự cho toàn bộ ${subTab} dựa trên vị trí hiện tại?`)) return;
        setSaving(true);
        try {
            const batch = items.map((it, idx) => updateDoc(doc(db, subTab, it.id), { order: idx }));
            await Promise.all(batch);
            alert("Đã đặt lại thứ tự!");
        } catch (err) {
            console.error(err);
            alert("Lỗi khi đặt lại thứ tự.");
        } finally {
            setSaving(false);
        }
    };


    if (loading) return <div className="text-center py-20 opacity-40 animate-pulse">Đang tải...</div>;

    if (editing) {
        return (
            <div className="animate-fade-in-up">
                <button onClick={() => setEditing(null)} className="mb-8 text-text-secondary hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                    <ChevronRight size={14} className="rotate-180" /> Quay lại
                </button>
                <form onSubmit={handleSave} className="space-y-6 max-w-xl mx-auto">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Tiêu đề / Tên</label>
                        <input type="text" value={editing.title || editing.organization || ''} onChange={e => setEditing(subTab === 'crew' ? { ...editing, organization: e.target.value } : { ...editing, title: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-accent-primary/30" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">{subTab === 'visual' ? 'Loại (Type)' : 'Vai trò (Role)'}</label>
                        <input type="text" value={editing.type || editing.role || ''} onChange={e => setEditing(subTab === 'visual' ? { ...editing, type: e.target.value } : { ...editing, role: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-accent-primary/30" />
                    </div>
                    {subTab === 'crew' && (
                        <div className="space-y-2">
                            <ImageUpload
                                label="Logo tổ chức (Crew)"
                                currentImage={editing.logo}
                                onUpload={(url) => setEditing({ ...editing, logo: url })}
                                onRemove={() => setEditing({ ...editing, logo: '' })}
                            />
                        </div>
                    )}
                    {(subTab === 'visual' || subTab === 'crew') && (
                        <div className="space-y-2">
                            <ImageUpload
                                label={subTab === 'visual' ? "Hình ảnh" : "Hình ảnh Crew (Tải nhiều)"}
                                multiple={true}
                                currentImage={editing.images}
                                onUpload={(urls) => setEditing({ ...editing, images: [...(editing.images || []), ...urls] })}
                                onRemove={(url) => setEditing({ ...editing, images: (editing.images || []).filter(img => img !== url) })}
                            />
                        </div>
                    )}
                    {subTab === 'clip' && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Video URL (Embed/Youtube)</label>
                            <input type="text" value={editing.videoUrl || ''} onChange={e => setEditing({ ...editing, videoUrl: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-accent-primary/30 font-sans" />
                        </div>
                    )}
                    {(subTab === 'crew' || subTab === 'clip') && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Mô tả ({subTab})</label>
                            <textarea value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={4} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-accent-primary/30 font-light" />
                        </div>
                    )}
                    <div className="pt-4 border-t border-white/5">
                        <LinkEditor
                            label="Các đường dẫn liên quan"
                            links={editing.otherLinks}
                            onChange={(newLinks) => setEditing({ ...editing, otherLinks: newLinks })}
                        />
                    </div>
                    <button type="submit" disabled={saving} className="w-full btn-pill py-5 bg-accent-primary text-bg-primary font-black uppercase tracking-widest mt-4">
                        {saving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fade-in-up">
            <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-full md:w-fit mx-auto overflow-x-auto whitespace-nowrap scrollbar-hide">
                {['visual', 'clip', 'crew'].map(t => (
                    <button key={t} onClick={() => setSubTab(t)} className={`flex-grow md:flex-none px-4 md:px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${subTab === t ? 'bg-white text-bg-primary shadow-lg' : 'text-text-secondary hover:text-white'}`}>
                        {t}
                    </button>
                ))}
            </div>

            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white capitalize">{subTab}</h3>
                <div className="flex gap-2">
                    <button onClick={fixOrders} disabled={saving} title="Đặt lại thứ tự theo danh sách hiện tại" className="btn-pill px-4 py-3 bg-white/5 hover:bg-accent-primary/20 text-text-secondary hover:text-accent-primary border-white/10">
                        <ListOrdered size={16} />
                    </button>
                    <button onClick={() => setEditing({})} className="btn-pill px-6 py-3 border-white/10 flex items-center gap-2 text-white">
                        <Plus size={16} /> Thêm {subTab}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {items?.map(item => (
                    <div key={item.id} className="glass-panel group relative rounded-2xl overflow-hidden border-white/5 hover:border-accent-primary/20 transition-all aspect-[4/5]">
                        <div className="absolute inset-0">
                            {(item.image || item.images?.length > 0) && (
                                <img src={item.image || item.images[0]} alt="" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                            )}
                        </div>
                        {subTab === 'crew' && item.logo && (
                            <div className="absolute top-4 left-4 w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md p-2 border border-white/10 z-10">
                                <img src={item.logo} alt="" className="w-full h-full object-contain" />
                            </div>
                        )}
                        <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-bg-primary">
                            <h4 className="font-bold text-white leading-tight mb-1">{item.title || item.organization}</h4>
                            <p className="text-[9px] text-accent-primary uppercase tracking-widest font-black opacity-60">{item.type || item.role}</p>
                            <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                <div className="flex gap-1 mr-1">
                                    <button onClick={(e) => { e.stopPropagation(); moveItemFirestore(items.findIndex(x => x.id === item.id), 'up'); }} disabled={items.findIndex(x => x.id === item.id) === 0} className="p-2.5 rounded-lg bg-white/10 hover:bg-white text-white hover:text-bg-primary disabled:opacity-0 transition-all"><ArrowUp size={14} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); moveItemFirestore(items.findIndex(x => x.id === item.id), 'down'); }} disabled={items.findIndex(x => x.id === item.id) === items.length - 1} className="p-2.5 rounded-lg bg-white/10 hover:bg-white text-white hover:text-bg-primary disabled:opacity-0 transition-all"><ArrowDown size={14} /></button>
                                </div>
                                <button onClick={() => setEditing(item)} className="p-2.5 rounded-lg bg-white/10 hover:bg-white text-white hover:text-bg-primary transition-all"><Settings size={14} /></button>
                                <button onClick={() => handleDelete(item.id)} className="p-2.5 rounded-lg bg-red-400/10 hover:bg-red-500 text-red-400 hover:text-white transition-all"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const [user, loadingAuth] = useAuthState(auth);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        signOut(auth);
        navigate('/admin/login');
    };

    useEffect(() => {
        if (!loadingAuth && !user && !auth.currentUser) {
            navigate('/admin/login');
        }
    }, [user, loadingAuth, navigate]);

    if (loadingAuth) {
        return (
            <div className="fixed inset-0 min-h-screen flex items-center justify-center bg-[#020617] z-[9999]">
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent-primary"></div>
                    <div className="space-y-2">
                        <span className="block text-xs text-accent-primary font-black uppercase tracking-[0.3em] animate-pulse">Aura Admin Security</span>
                        <p className="text-[10px] text-text-secondary opacity-60">Xác thực quyền truy cập...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!user && !auth.currentUser) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-[#020617] text-white cursor-auto relative">
            {/* Sidebar Overlay for Mobile */}
            <div className={`fixed inset-0 bg-black/80 z-[60] transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}></div>

            {/* Sidebar */}
            <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 border-r border-white/5 bg-[#010410] flex flex-col z-[70] transition-transform duration-500 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-8 mb-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-black text-white tracking-widest uppercase">Aura CMS</h1>
                        <p className="text-[10px] text-accent-primary font-bold tracking-[0.2em] opacity-50 mt-1">phatdo.com</p>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-text-secondary"><Plus className="rotate-45" size={24} /></button>
                </div>
                <nav className="flex-grow overflow-y-auto">
                    <SidebarItem icon={Settings} label="Hồ sơ & Chức danh" active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setIsMobileMenuOpen(false); }} />
                    <SidebarItem icon={BookOpen} label="Tiểu sử & Thành tích" active={activeTab === 'biography'} onClick={() => { setActiveTab('biography'); setIsMobileMenuOpen(false); }} />
                    <SidebarItem icon={LayoutIcon} label="Dự án (Work)" active={activeTab === 'projects'} onClick={() => { setActiveTab('projects'); setIsMobileMenuOpen(false); }} />
                    <SidebarItem icon={Image} label="Media (Photos/Clips)" active={activeTab === 'media'} onClick={() => { setActiveTab('media'); setIsMobileMenuOpen(false); }} />

                </nav>
                <div className="p-6 border-t border-white/5 bg-[#010410]">
                    <button onClick={handleLogout} className="flex items-center gap-3 text-text-secondary hover:text-red-400 transition-colors text-[10px] font-black uppercase tracking-widest pl-2">
                        <LogOut size={16} /> Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow min-w-0 p-6 md:p-12 overflow-y-auto relative z-10">
                <header className="mb-12 flex justify-between items-center text-white">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-3 rounded-xl bg-white/5 border border-white/5">
                            <Plus size={20} />
                        </button>
                        <div>
                            <h2 className="text-2xl md:text-4xl font-black tracking-tighter capitalize">{activeTab}</h2>
                            <div className="flex items-center gap-2 text-[10px] text-text-secondary mt-1 uppercase tracking-widest opacity-40">
                                <span className="hidden md:inline">Admin</span> <span className="hidden md:inline"><ChevronRight size={10} /></span> <span>Dashboard</span> <ChevronRight size={10} /> <span className="text-accent-primary font-bold">{activeTab}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="bg-[#0A192F]/50 border border-white/5 p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-2xl min-h-[600px] flex flex-col items-stretch overflow-hidden">
                    {activeTab === 'profile' && <ProfileEditor />}
                    {activeTab === 'biography' && <BiographyEditor />}
                    {activeTab === 'projects' && <ProjectsEditor />}
                    {activeTab === 'media' && <MediaEditor />}

                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
