import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { path: '/', label: 'hôm nay' },
        { path: '/minh', label: 'mình' },
        { path: '/chill-voi', label: 'chill với' },
        { path: '/nhau-nha', label: 'nhau nha' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-4 bg-bg-primary/40 backdrop-blur-xl' : 'py-8 bg-transparent'}`}>
            <div className="container flex items-center justify-center">
                {/* Centered Navigation without Brand Logo */}
                <div className="flex items-center glass-panel rounded-full px-2 py-1 border-white/5 shadow-2xl max-[370px]:hidden">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-link rounded-full active:scale-95 transition-all ${location.pathname === link.path ? 'active bg-white/5' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Mobile Toggle (only visible on exceptionally narrow screens) */}
                <button className="max-[370px]:flex hidden md:hidden absolute right-6 text-text-primary mt-1 items-center justify-center w-10 h-10 rounded-full glass-panel" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-0 left-0 right-0 h-screen bg-bg-primary/95 backdrop-blur-[50px] z-50 flex flex-col items-center justify-center space-y-8 animate-fade-in">
                    <button className="absolute top-8 right-8 text-text-primary w-12 h-12 rounded-full glass-panel flex items-center justify-center active:scale-95 transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                        <X size={24} />
                    </button>
                    {navLinks.map((link, idx) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-4xl font-black tracking-tighter active:scale-95 transition-all animate-fade-in-up ${location.pathname === link.path ? 'text-accent-primary' : 'text-text-secondary/60 hover:text-white'}`}
                            style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
