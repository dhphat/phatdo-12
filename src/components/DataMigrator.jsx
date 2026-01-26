import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { meData, projects, photos, clips, crew } from '../data/content';
import { Database, ArrowUpCircle, CheckCircle2, AlertCircle } from 'lucide-react';

const DataMigrator = () => {
    const [status, setStatus] = useState('idle'); // idle, running, success, error
    const [log, setLog] = useState([]);

    const addLog = (msg) => setLog(prev => [...prev, msg]);

    const runMigration = async () => {
        setStatus('running');
        setLog([]);
        try {
            addLog("Bắt đầu di chuyển dữ liệu...");

            // 1. Sync meData
            addLog("Đang đồng bộ hồ sơ cá nhân...");
            await setDoc(doc(db, 'config', 'meData'), meData);

            // 2. Sync Collections
            const syncCollection = async (name, data) => {
                addLog(`Đang đồng bộ collection: ${name}...`);
                for (const item of data) {
                    await addDoc(collection(db, name), item);
                }
            };

            await syncCollection('projects', projects);
            await syncCollection('photos', photos);
            await syncCollection('clips', clips);
            await syncCollection('crew', crew);

            addLog("Hoàn tất di chuyển dữ liệu thành công!");
            setStatus('success');
        } catch (err) {
            console.error(err);
            addLog(`Lỗi: ${err.message}`);
            setStatus('error');
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto space-y-6 animate-fade-in-up">
            <div className="p-8 glass-panel border-accent-primary/20 rounded-3xl text-center">
                <div className="w-16 h-16 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary mx-auto mb-6">
                    <Database size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Đồng bộ dữ liệu ban đầu</h3>
                <p className="text-text-secondary text-sm font-light italic opacity-50 mb-8">
                    Nhấn nút dưới đây để đẩy tất cả dữ liệu từ file `content.js` lên Firebase Firestore của bạn.
                    Chỉ nên thực hiện việc này **một lần duy nhất**.
                </p>

                {status === 'idle' && (
                    <button
                        onClick={runMigration}
                        className="btn-pill px-8 py-4 bg-accent-primary text-bg-primary font-black uppercase tracking-widest flex items-center gap-3 mx-auto"
                    >
                        <ArrowUpCircle size={20} /> Bắt đầu đồng bộ
                    </button>
                )}

                {status === 'running' && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent-primary"></div>
                        <p className="text-accent-primary text-xs font-bold animate-pulse">Đang đẩy dữ liệu lên mây...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="text-accent-primary flex flex-col items-center gap-2">
                        <CheckCircle2 size={40} />
                        <p className="font-bold">Đã hoàn tất!</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="text-red-400 flex flex-col items-center gap-2">
                        <AlertCircle size={40} />
                        <p className="font-bold">Đã có lỗi xảy ra</p>
                    </div>
                )}
            </div>

            {log.length > 0 && (
                <div className="bg-black/40 rounded-2xl p-6 font-mono text-[10px] space-y-1 h-40 overflow-y-auto border border-white/5">
                    {log.map((line, i) => (
                        <div key={i} className="text-text-secondary">
                            <span className="text-accent-primary mr-2 opacity-50">[{new Date().toLocaleTimeString()}]</span>
                            {line}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DataMigrator;
