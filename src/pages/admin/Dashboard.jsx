import React, { useState, useEffect } from 'react';
import { auth, db } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc, collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useMeData, useCollection } from '../../hooks/useContent';
import DataMigrator from '../../components/DataMigrator';
import { Settings, Image, Layout as LayoutIcon, LogOut, ChevronRight, Plus, Save, Trash2, Database, Upload, Link, Video as VideoIcon, Globe, MapPin, BookOpen } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 ${active ? 'bg-accent-primary/10 text-accent-primary border-r-2 border-accent-primary' : 'text-text-secondary hover:bg-white/5 hover:text-white'}`}
    >
        <Icon size={20} />
        <span className="text-sm font-bold tracking-tight">{label}</span>
    </button>
);

const ProfileEditor = () => {
    const { data: remoteData, loading } = useMeData();
    const [meData, setMeData] = useState({
        headline: '',
        bio: '',
        roles: []
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (remoteData) {
            setMeData(remoteData);
        }
    }, [remoteData]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await setDoc(doc(db, 'config', 'meData'), meData);
            alert("Đã lưu thành công!");
        } catch (err) {
            console.error("Save error:", err);
            alert("Lỗi khi lưu dữ liệu.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-20 opacity-40 animate-pulse italic">Đang tải dữ liệu...</div>;

    return (
        <form onSubmit={handleSave} className="w-full max-w-2xl mx-auto space-y-10 animate-fade-in-up">
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Lời chào (Headline)</label>
                    <input
                        type="text"
                        value={meData.headline}
                        onChange={(e) => setMeData({ ...meData, headline: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-accent-primary/30 focus:bg-white/[0.08] transition-all font-bold"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Mô tả ngắn (Bio)</label>
                    <textarea
                        value={meData.bio}
                        onChange={(e) => setMeData({ ...meData, bio: e.target.value })}
                        rows={3}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-accent-primary/30 focus:bg-white/[0.08] transition-all font-light leading-relaxed italic"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Danh sách vị trí (Roles)</label>
                    <div className="space-y-3">
                        {meData.roles.map((role, idx) => (
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
        travel: { countries: [], provinces: [] }
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
                travel: remoteData.travel || { countries: [], provinces: [] }
            });
        }
    }, [remoteData]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await setDoc(doc(db, 'config', 'meData'), { ...remoteData, ...meData });
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

    if (loading) return <div className="text-center py-20 opacity-40 italic">Đang tải...</div>;

    const sections = [
        { key: 'education', label: 'Học vấn', template: { title: '', place: '', period: '', description: '' } },
        { key: 'experience', label: 'Kinh nghiệm', template: { title: '', place: '', period: '', description: '' } },
        { key: 'awards', label: 'Thành tích', template: { title: '', place: '', period: '', description: '' } }
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
                        {meData[section.key].map((item, idx) => (
                            <div key={idx} className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4 relative group">
                                <button type="button" onClick={() => removeItem(section.key, idx)} className="absolute top-4 right-4 p-2 text-red-400/40 hover:text-red-400 transition-colors">
                                    <Trash2 size={14} />
                                </button>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Tiêu đề (VD: Cử nhân)" value={item.title} onChange={e => updateItem(section.key, idx, 'title', e.target.value)} className="bg-transparent border-b border-white/10 py-2 text-sm text-white focus:outline-none focus:border-accent-primary/50" />
                                    <input type="text" placeholder="Nơi học/làm (VD: Đại học FPT)" value={item.place} onChange={e => updateItem(section.key, idx, 'place', e.target.value)} className="bg-transparent border-b border-white/10 py-2 text-sm text-white focus:outline-none focus:border-accent-primary/50" />
                                    <input type="text" placeholder="Thời gian (VD: 2016 - 2020)" value={item.period} onChange={e => updateItem(section.key, idx, 'period', e.target.value)} className="bg-transparent border-b border-white/10 py-2 text-sm text-white focus:outline-none focus:border-accent-primary/50" />
                                </div>
                                <textarea placeholder="Mô tả..." value={item.description} onChange={e => updateItem(section.key, idx, 'description', e.target.value)} className="w-full bg-transparent border-b border-white/10 py-2 text-sm text-text-secondary focus:outline-none focus:border-accent-primary/50 font-light h-16 resize-none" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className="space-y-6">
                <div className="flex items-center border-b border-white/5 pb-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-primary">Du lịch (Travel)</label>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-[8px] font-black uppercase tracking-widest text-text-secondary">Quốc gia (Countries)</label>
                        <textarea
                            value={meData.travel.countries.join(', ')}
                            onChange={e => setMeData({ ...meData, travel: { ...meData.travel, countries: e.target.value.split(',').map(s => s.trim()).filter(s => s) } })}
                            className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-accent-primary/30 h-24"
                            placeholder="Vietnam, Thailand, Singapore..."
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[8px] font-black uppercase tracking-widest text-text-secondary">Tỉnh thành (Provinces)</label>
                        <textarea
                            value={meData.travel.provinces.join(', ')}
                            onChange={e => setMeData({ ...meData, travel: { ...meData.travel, provinces: e.target.value.split(',').map(s => s.trim()).filter(s => s) } })}
                            className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-accent-primary/30 h-24"
                            placeholder="TP. HCM, Hà Nội, Đà Lạt..."
                        />
                    </div>
                </div>
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
                await addDoc(collection(db, 'projects'), editing);
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

    if (loading) return <div className="text-center py-20 opacity-40 animate-pulse italic">Đang tải dự án...</div>;

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
                            <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Logo URL</label>
                            <input type="text" value={editing.logo} onChange={e => setEditing({ ...editing, logo: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-accent-primary/30" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Website URL</label>
                            <input type="text" value={editing.websiteUrl} onChange={e => setEditing({ ...editing, websiteUrl: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-accent-primary/30" />
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
                <button onClick={() => setEditing({ title: '', category: '', description: '', logo: '', websiteUrl: '', videoUrl: '', images: [] })} className="btn-pill px-6 py-3 bg-white/5 hover:bg-white/10 text-white border-white/10 flex items-center gap-2">
                    <Plus size={16} /> Thêm mới
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map(p => (
                    <div key={p.id} className="glass-panel p-6 rounded-3xl flex items-center justify-between group hover:border-accent-primary/20 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden p-2 ring-1 ring-white/5">
                                <img src={p.logo} alt="" className="w-full h-full object-contain grayscale" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white group-hover:text-accent-primary transition-colors">{p.title}</h4>
                                <span className="text-[9px] text-text-secondary uppercase tracking-widest opacity-50 italic">{p.category}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
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
    const [subTab, setSubTab] = useState('photos');
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
                await addDoc(collection(db, subTab), editing);
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

    if (loading) return <div className="text-center py-20 opacity-40 animate-pulse italic">Đang tải...</div>;

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
                    {(subTab === 'photos' || subTab === 'clips' || subTab === 'crew') && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">{subTab === 'photos' ? 'Loại (Type)' : 'Vai trò (Role)'}</label>
                            <input type="text" value={editing.type || editing.role || ''} onChange={e => setEditing(subTab === 'photos' ? { ...editing, type: e.target.value } : { ...editing, role: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-accent-primary/30" />
                        </div>
                    )}
                    {(subTab === 'photos' || subTab === 'crew') && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Image URL</label>
                            <input type="text" value={editing.image || (editing.images ? editing.images[0] : '')} onChange={e => setEditing(subTab === 'crew' ? { ...editing, images: [e.target.value] } : { ...editing, image: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-accent-primary/30" />
                        </div>
                    )}
                    {subTab === 'clips' && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60">Video URL (Embed)</label>
                            <input type="text" value={editing.videoUrl || ''} onChange={e => setEditing({ ...editing, videoUrl: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-accent-primary/30" />
                        </div>
                    )}
                    <button type="submit" disabled={saving} className="w-full btn-pill py-5 bg-accent-primary text-bg-primary font-black uppercase tracking-widest mt-4">
                        {saving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fade-in-up">
            <div className="flex gap-4 p-1.5 bg-white/5 rounded-2xl w-fit mx-auto">
                {['photos', 'clips', 'crew'].map(t => (
                    <button key={t} onClick={() => setSubTab(t)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${subTab === t ? 'bg-white text-bg-primary shadow-lg' : 'text-text-secondary hover:text-white'}`}>
                        {t}
                    </button>
                ))}
            </div>

            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white capitalize">{subTab}</h3>
                <button onClick={() => setEditing({})} className="btn-pill px-6 py-3 border-white/10 flex items-center gap-2 text-white">
                    <Plus size={16} /> Thêm mới
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {items.map(item => (
                    <div key={item.id} className="glass-panel group relative rounded-2xl overflow-hidden border-white/5 hover:border-accent-primary/20 transition-all aspect-[4/5]">
                        {(item.image || item.images) && (
                            <img src={item.image || item.images[0]} alt="" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                        )}
                        <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-bg-primary">
                            <h4 className="font-bold text-white leading-tight mb-1">{item.title || item.organization}</h4>
                            <p className="text-[9px] text-accent-primary uppercase tracking-widest font-black opacity-60">{item.type || item.role}</p>
                            <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
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

    const handleLogout = () => {
        signOut(auth);
        navigate('/admin/login');
    };

    useEffect(() => {
        // Use auth.currentUser as a synchronous check alongside the hook state
        if (!loadingAuth && !user && !auth.currentUser) {
            navigate('/admin/login');
        }
    }, [user, loadingAuth, navigate]);

    if (loadingAuth || (!user && !loadingAuth && !auth.currentUser)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-primary/95 backdrop-blur-xl z-[100] fixed inset-0">
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent-primary border-r-2 border-r-transparent"></div>
                    <div className="space-y-2">
                        <span className="block text-xs text-accent-primary font-black uppercase tracking-[0.3em] animate-pulse">Aura Admin Security</span>
                        <p className="text-[10px] text-text-secondary italic opacity-60">Đang xác thực quyền truy cập của bạn...</p>
                    </div>
                    {/* Failsafe link if stuck */}
                    <button
                        onClick={() => navigate('/admin/login')}
                        className="mt-8 text-[9px] font-bold text-text-secondary hover:text-white underline underline-offset-4 opacity-40 hover:opacity-100 transition-all uppercase tracking-widest"
                    >
                        Nếu không thể tự động chuyển hướng, nhấn vào đây
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent flex relative z-10">
            <aside className="w-64 border-r border-white/5 bg-bg-primary/80 backdrop-blur-2xl flex flex-col fixed inset-y-0 left-0 z-50">
                <div className="p-8 mb-4">
                    <h1 className="text-xl font-black text-white tracking-widest uppercase">Aura CMS</h1>
                    <p className="text-[10px] text-accent-primary font-bold tracking-[0.2em] opacity-50 mt-1 italic">phatdo.com</p>
                </div>
                <nav className="flex-grow">
                    <SidebarItem icon={Settings} label="Hồ sơ & Chức danh" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                    <SidebarItem icon={BookOpen} label="Tiểu sử & Thành tích" active={activeTab === 'biography'} onClick={() => setActiveTab('biography')} />
                    <SidebarItem icon={LayoutIcon} label="Dự án (Work)" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
                    <SidebarItem icon={Image} label="Media (Photos/Clips)" active={activeTab === 'media'} onClick={() => setActiveTab('media')} />
                    <SidebarItem icon={Database} label="Hệ thống (Migration)" active={activeTab === 'system'} onClick={() => setActiveTab('system')} />
                </nav>
                <div className="p-6 border-t border-white/5">
                    <button onClick={handleLogout} className="flex items-center gap-3 text-text-secondary hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-widest pl-2">
                        <LogOut size={16} /> Đăng xuất
                    </button>
                </div>
            </aside>

            <main className="flex-grow ml-64 p-12 overflow-y-auto bg-transparent relative z-10">
                <header className="mb-12 flex justify-between items-center text-white">
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter capitalize">{activeTab}</h2>
                        <div className="flex items-center gap-2 text-[11px] text-text-secondary mt-1 uppercase tracking-widest opacity-40 italic">
                            <span>Admin</span> <ChevronRight size={10} /> <span>Dashboard</span> <ChevronRight size={10} /> <span className="text-accent-primary font-bold">{activeTab}</span>
                        </div>
                    </div>
                </header>

                <div className="glass-panel p-10 rounded-[2.5rem] border-white/5 shadow-2xl min-h-[600px] flex flex-col">
                    {activeTab === 'profile' && <ProfileEditor />}
                    {activeTab === 'biography' && <BiographyEditor />}
                    {activeTab === 'projects' && <ProjectsEditor />}
                    {activeTab === 'media' && <MediaEditor />}
                    {activeTab === 'system' && <DataMigrator />}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
