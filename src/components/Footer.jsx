import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-bg-primary pt-20 pb-12 border-t border-white/5 mt-auto">
            <div className="container">
                <div className="flex flex-col md:flex-row justify-between items-center gap-10">

                    {/* Socials & Info */}
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">contact</h4>
                        <div className="flex gap-6">
                            <a href="tel:+84348669124" className="text-xs font-bold hover:text-accent-primary transition-colors">+84 348 669 124</a>
                            <a href="mailto:contact@phatdo.com" className="text-xs font-bold hover:text-accent-primary transition-colors">contact@phatdo.com</a>
                        </div>
                    </div>

                    {/* Social Icons */}
                    <div className="flex gap-6">
                        <a href="https://facebook.com/dhphat" target="_blank" rel="noreferrer" className="text-white hover:text-accent-primary transition-all hover:-translate-y-1 transform opacity-40 hover:opacity-100"><Facebook size={18} /></a>
                        <a href="https://instagram.com/phatdo.hp" target="_blank" rel="noreferrer" className="text-white hover:text-accent-primary transition-all hover:-translate-y-1 transform opacity-40 hover:opacity-100"><Instagram size={18} /></a>
                    </div>

                    {/* Copyright */}
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-20 text-center md:text-right">
                        © {new Date().getFullYear()} phat do. all rights reserved.
                    </p>

                </div>
            </div>
        </footer>
    );
};

export default Footer;
