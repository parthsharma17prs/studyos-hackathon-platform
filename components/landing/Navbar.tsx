'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LuMenu, LuX, LuChevronRight } from 'react-icons/lu';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'Reviews', href: '#reviews' },
        { name: 'How it Works', href: '#how-it-works' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${isScrolled
            ? 'py-3 bg-black/60 backdrop-blur-2xl border-b border-white/5 shadow-glass-glow'
            : 'py-6 bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-student-accent to-red-800 flex items-center justify-center group-hover:shadow-student-shadow transition-all duration-500 group-hover:rotate-6">
                        <span className="text-white font-black text-xl">S</span>
                    </div>
                    <span className="text-xl font-black tracking-tighter group-hover:tracking-normal transition-all duration-500">
                        Study<span className="text-student-accent">OS</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-bold text-os-muted hover:text-white transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link href="/auth?role=student">
                        <button className="btn-primary-student !py-2.5 !px-6 !text-xs">
                            Log In <LuChevronRight className="inline-block ml-1" />
                        </button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-os-border overflow-hidden transition-all duration-500 ${isMobileMenuOpen ? 'max-h-screen py-8' : 'max-h-0'
                }`}>
                <div className="flex flex-col items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-lg font-bold text-os-muted"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link href="/auth?role=student" onClick={() => setIsMobileMenuOpen(false)}>
                        <button className="btn-primary-student">
                            Student Login
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
