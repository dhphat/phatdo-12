import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Me from './pages/Me';
import ChillWith from './pages/ChillWith';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import LoadingScreen from './components/LoadingScreen';
import { useMeData } from './hooks/useContent';
import './App.css';

function App() {
  const { data: meData, loading: dataLoading } = useMeData();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!dataLoading && meData?.heroImage) {
      const img = new Image();
      img.src = meData.heroImage;
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageLoaded(true); // Don't block forever if image fails
    } else if (!dataLoading && !meData?.heroImage) {
      setImageLoaded(true); // No image to load
    }
  }, [dataLoading, meData?.heroImage]);

  useEffect(() => {
    if (meData?.siteTitle) {
      document.title = meData.siteTitle;
    }
    if (meData?.faviconUrl) {
      const link = document.querySelector("link[rel~='icon']");
      if (link) {
        link.href = meData.faviconUrl;
      }
    }
  }, [meData]);

  const isEverythingReady = !dataLoading && imageLoaded;

  if (!isEverythingReady) return <LoadingScreen />;

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/minh" element={<Me />} />
          <Route path="/chill-voi" element={<ChillWith />} />
          <Route path="/nhau-nha" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
