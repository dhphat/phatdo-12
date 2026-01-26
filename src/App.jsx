import { useEffect } from 'react';
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
  const { data: meData, loading } = useMeData();

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

  if (loading) return <LoadingScreen />;

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
