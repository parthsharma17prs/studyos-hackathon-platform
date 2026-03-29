'use client';

import { LuStar, LuQuote } from 'react-icons/lu';

const reviews = [
    {
        name: 'Aravind K.',
        role: 'CS Final Year',
        text: 'StudyOS literally saved my placement prep. The ATS checker is on another level.',
        rating: 5
    },
    {
        name: 'Sarah M.',
        role: 'Medical Student',
        text: "Generating flashcards from 50-page PDFs in seconds is a game changer for Anatomy.",
        rating: 5
    },
    {
        name: 'Rahul S.',
        role: 'JEE Aspirant',
        text: 'The voice calling agent is annoying but effective. It actually gets me off my bed to study.',
        rating: 5
    },
    {
        name: 'Sneha P.',
        role: 'MBA Student',
        text: 'Clean interface, zero fluff. The Peer Battle mode makes late-night prep fun.',
        rating: 5
    },
    {
        name: 'Ishaan V.',
        role: 'Bio-Tech Junior',
        text: 'Finally an AI tool that doesn’t just hallucinate but actually finds the gaps in my notes.',
        rating: 5
    },
];

export default function Reviews() {
    return (
        <section id="reviews" className="py-24 bg-black overflow-hidden border-t border-os-border reveal">
            <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                    Don’t take our <span className="text-student-accent">word</span> for it
                </h2>
                <p className="text-os-muted text-lg max-w-2xl mx-auto">
                    Join 40,000+ students who are already using StudyOS to dominate their exams.
                </p>
            </div>

            <div className="flex animate-scroll-x hover:[animation-play-state:paused]">
                {[...reviews, ...reviews].map((review, i) => (
                    <div
                        key={i}
                        className="flex-shrink-0 w-[400px] px-4"
                    >
                        <div className="glass-card p-8 h-full">
                            <div className="flex gap-1 text-student-accent mb-4">
                                {[...Array(review.rating)].map((_, i) => (
                                    <LuStar key={i} size={16} fill="currentColor" />
                                ))}
                            </div>
                            <LuQuote className="text-os-border mb-4" size={32} />
                            <p className="text-sm leading-relaxed text-white mb-6">
                                "{review.text}"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600/20 to-transparent flex items-center justify-center font-black text-xs text-student-accent">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-sm">{review.name}</div>
                                    <div className="text-[10px] text-os-muted uppercase tracking-widest">{review.role}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
