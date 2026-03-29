'use client';

import { useEffect, useState } from 'react';

export default function ScrollEffects() {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        // 1. Scroll Progress Logic
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            const currentScroll = window.scrollY;
            setScrollProgress((currentScroll / totalScroll) * 100);
        };

        // 2. Intersection Observer for Reveals
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elementsToReveal = document.querySelectorAll('.reveal');
        elementsToReveal.forEach((el) => revealObserver.observe(el));

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            revealObserver.disconnect();
        };
    }, []);

    return (
        <div className="scroll-progress-container">
            <div
                className="scroll-progress-bar"
                style={{ width: `${scrollProgress}%` }}
            />
        </div>
    );
}
