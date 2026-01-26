import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import CustomCursor from './CustomCursor';
import StarsBackground from './StarsBackground';

const Layout = ({ children }) => {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');

    return (
        <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary selection:bg-accent-primary selection:text-bg-primary relative overflow-hidden">
            <StarsBackground />
            <CustomCursor />
            {!isAdminPage && <Navbar />}
            <main className="flex-grow">
                {children}
            </main>
        </div>
    );
};

export default Layout;
