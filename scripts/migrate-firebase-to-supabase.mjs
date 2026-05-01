/**
 * Migration Script: Firebase → Supabase
 * 
 * Script này sẽ:
 * 1. Đọc data từ Firebase Firestore
 * 2. Ghi vào Supabase PostgreSQL
 * 
 * Chạy: node scripts/migrate-firebase-to-supabase.mjs
 * 
 * Trước khi chạy, đảm bảo đã:
 * 1. Chạy SQL setup trong Supabase SQL Editor (setup-supabase.sql)
 * 2. Tạo admin user trong Supabase Auth
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { createClient } from '@supabase/supabase-js';

// ============ Firebase Config ============
const firebaseConfig = {
    apiKey: "AIzaSyD0_mMx4MOEMEiS8kyFAw90BQ7_m8em83c",
    authDomain: "phatdo-12.firebaseapp.com",
    projectId: "phatdo-12",
    storageBucket: "phatdo-12.firebasestorage.app",
    messagingSenderId: "421675025769",
    appId: "1:421675025769:web:40b3cedd3a47a7797c29f8"
};

// ============ Supabase Config ============
const SUPABASE_URL = 'https://unuskiphlcazohpiuaxz.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Cần service role key để bypass RLS

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

if (!SUPABASE_SERVICE_KEY) {
    console.error('\n❌ Cần SUPABASE_SERVICE_KEY để chạy migration.');
    console.error('Lấy service_role key tại: Supabase Dashboard → Settings → API → service_role (secret)');
    console.error('\nChạy lệnh: SUPABASE_SERVICE_KEY="your-key" node scripts/migrate-firebase-to-supabase.mjs\n');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function migrateConfig() {
    console.log('\n📦 Migrating site_config (meData)...');
    
    const docSnap = await getDoc(doc(db, 'config', 'meData'));
    if (!docSnap.exists()) {
        console.log('  ⚠️  No meData found in Firebase, skipping.');
        return;
    }
    
    const data = docSnap.data();
    console.log('  Found meData with keys:', Object.keys(data).join(', '));
    
    const row = {
        id: 'meData',
        headline: data.headline || null,
        roles: data.roles || [],
        home_text1: data.homeText1 || null,
        home_subtitle: data.homeSubtitle || data.homeText2 || null,
        home_button_text: data.homeButtonText || null,
        home_button_link: data.homeButtonLink || null,
        hero_image: data.heroImage || null,
        me_title: data.meTitle || null,
        me_subtitle: data.meSubtitle || null,
        chill_headline: data.chillHeadline || null,
        chill_title: data.chillTitle || null,
        chill_subtitle: data.chillSubtitle || null,
        contact_headline: data.contactHeadline || null,
        contact_subtitle: data.contactSubtitle || null,
        og_image: data.ogImage || null,
        site_title: data.siteTitle || null,
        favicon_url: data.faviconUrl || null,
        phone: data.phone || null,
        email: data.email || null,
        facebook: data.facebook || null,
        instagram: data.instagram || null,
        threads: data.threads || null,
        tiktok: data.tiktok || null,
        education: data.education || [],
        experience: data.experience || [],
        awards: data.awards || [],
        places: data.places || [],
        updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase.from('site_config').upsert(row);
    if (error) {
        console.error('  ❌ Error migrating site_config:', error.message);
    } else {
        console.log('  ✅ site_config migrated successfully');
    }
}

async function migrateCollection(collectionName, mapFn) {
    console.log(`\n📦 Migrating ${collectionName}...`);
    
    const snapshot = await getDocs(collection(db, collectionName));
    if (snapshot.empty) {
        console.log(`  ⚠️  No documents found in ${collectionName}, skipping.`);
        return;
    }
    
    console.log(`  Found ${snapshot.docs.length} documents`);
    
    const rows = snapshot.docs.map((doc, idx) => {
        const data = doc.data();
        return mapFn(data, idx);
    });
    
    const { error } = await supabase.from(collectionName).insert(rows);
    if (error) {
        console.error(`  ❌ Error migrating ${collectionName}:`, error.message);
    } else {
        console.log(`  ✅ ${collectionName} migrated: ${rows.length} items`);
    }
}

async function main() {
    console.log('🚀 Starting Firebase → Supabase Migration');
    console.log('==========================================');
    
    // 1. Migrate config
    await migrateConfig();
    
    // 2. Migrate projects
    await migrateCollection('projects', (data, idx) => ({
        title: data.title || '',
        category: data.category || null,
        description: data.description || null,
        logo: data.logo || null,
        website_url: data.websiteUrl || null,
        video_url: data.videoUrl || null,
        images: data.images || [],
        other_links: data.otherLinks || [],
        order: data.order !== undefined ? data.order : idx
    }));
    
    // 3. Migrate visual
    await migrateCollection('visual', (data, idx) => ({
        title: data.title || null,
        type: data.type || null,
        images: data.image ? [data.image] : (data.images || []),
        other_links: data.otherLinks || [],
        order: data.order !== undefined ? data.order : idx
    }));
    
    // 4. Migrate clip
    await migrateCollection('clip', (data, idx) => ({
        title: data.title || null,
        role: data.role || null,
        description: data.description || null,
        video_url: data.videoUrl || null,
        other_links: data.otherLinks || [],
        order: data.order !== undefined ? data.order : idx
    }));
    
    // 5. Migrate crew
    await migrateCollection('crew', (data, idx) => ({
        organization: data.organization || null,
        role: data.role || null,
        description: data.description || null,
        logo: data.logo || null,
        images: data.images || [],
        other_links: data.otherLinks || [],
        order: data.order !== undefined ? data.order : idx
    }));
    
    console.log('\n==========================================');
    console.log('✅ Migration complete!');
    console.log('\nLưu ý: Ảnh trên Firebase Storage vẫn giữ nguyên URL.');
    console.log('Các URL cũ sẽ vẫn hoạt động miễn là Firebase project chưa bị xóa.');
    console.log('Sau khi xác nhận mọi thứ OK, bạn có thể xóa Firebase project.\n');
    
    process.exit(0);
}

main().catch(err => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
});
