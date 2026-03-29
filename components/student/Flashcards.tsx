'use client';

import { LuZap } from 'react-icons/lu';

interface FlashcardProps {
    term: string;
    definition: string;
}

export default function Flashcards({ term, definition }: FlashcardProps) {
    return (
        <div className="flip-card h-64 w-full">
            <div className="flip-card-inner">
                {/* Front */}
                <div className="flip-card-front glass-card p-10 flex flex-col items-center justify-center text-center border-student-accent/10">
                    <LuZap className="text-student-accent mb-6 opacity-40 group-hover:opacity-100 transition-opacity" size={40} />
                    <h3 className="text-2xl font-black tracking-tight leading-tight">{term}</h3>
                    <p className="text-[10px] text-os-muted uppercase tracking-[0.2em] font-bold mt-6">Click/Hover to see definition</p>
                </div>

                {/* Back */}
                <div className="flip-card-back glass-card p-10 flex flex-col items-center justify-center text-center border-student-accent/30 bg-gradient-to-br from-red-600/5 to-transparent">
                    <h4 className="text-xs font-black text-student-accent uppercase tracking-widest mb-4">Definition</h4>
                    <p className="text-sm font-medium leading-relaxed text-os-muted">
                        {definition}
                    </p>
                </div>
            </div>
        </div>
    );
}
