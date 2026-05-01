-- =============================================
-- Supabase Database Setup for phatdo-12
-- Chạy SQL này trong Supabase SQL Editor
-- =============================================

-- Table: site_config (thay cho Firestore config/meData)
CREATE TABLE IF NOT EXISTS site_config (
  id TEXT PRIMARY KEY DEFAULT 'meData',
  headline TEXT,
  roles TEXT[] DEFAULT '{}',
  home_text1 TEXT,
  home_subtitle TEXT,
  home_button_text TEXT,
  home_button_link TEXT,
  hero_image TEXT,
  me_title TEXT,
  me_subtitle TEXT,
  chill_headline TEXT,
  chill_title TEXT,
  chill_subtitle TEXT,
  contact_headline TEXT,
  contact_subtitle TEXT,
  og_image TEXT,
  site_title TEXT,
  favicon_url TEXT,
  phone TEXT,
  email TEXT,
  facebook TEXT,
  instagram TEXT,
  threads TEXT,
  tiktok TEXT,
  education JSONB DEFAULT '[]',
  experience JSONB DEFAULT '[]',
  awards JSONB DEFAULT '[]',
  places JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT,
  description TEXT,
  logo TEXT,
  website_url TEXT,
  video_url TEXT,
  images TEXT[] DEFAULT '{}',
  other_links JSONB DEFAULT '[]',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: visual
CREATE TABLE IF NOT EXISTS visual (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  type TEXT,
  images TEXT[] DEFAULT '{}',
  other_links JSONB DEFAULT '[]',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: clip
CREATE TABLE IF NOT EXISTS clip (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  role TEXT,
  description TEXT,
  video_url TEXT,
  other_links JSONB DEFAULT '[]',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: crew
CREATE TABLE IF NOT EXISTS crew (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization TEXT,
  role TEXT,
  description TEXT,
  logo TEXT,
  images TEXT[] DEFAULT '{}',
  other_links JSONB DEFAULT '[]',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Enable Row Level Security
-- =============================================
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE visual ENABLE ROW LEVEL SECURITY;
ALTER TABLE clip ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS Policies: Public read, Auth write
-- =============================================

-- site_config
CREATE POLICY "Public read access" ON site_config FOR SELECT USING (true);
CREATE POLICY "Auth insert" ON site_config FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update" ON site_config FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete" ON site_config FOR DELETE USING (auth.role() = 'authenticated');

-- projects
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Auth insert" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete" ON projects FOR DELETE USING (auth.role() = 'authenticated');

-- visual
CREATE POLICY "Public read access" ON visual FOR SELECT USING (true);
CREATE POLICY "Auth insert" ON visual FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update" ON visual FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete" ON visual FOR DELETE USING (auth.role() = 'authenticated');

-- clip
CREATE POLICY "Public read access" ON clip FOR SELECT USING (true);
CREATE POLICY "Auth insert" ON clip FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update" ON clip FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete" ON clip FOR DELETE USING (auth.role() = 'authenticated');

-- crew
CREATE POLICY "Public read access" ON crew FOR SELECT USING (true);
CREATE POLICY "Auth insert" ON crew FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update" ON crew FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete" ON crew FOR DELETE USING (auth.role() = 'authenticated');

-- =============================================
-- Storage bucket for uploads
-- =============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Auth upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');
CREATE POLICY "Auth update uploads" ON storage.objects FOR UPDATE USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete uploads" ON storage.objects FOR DELETE USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');
