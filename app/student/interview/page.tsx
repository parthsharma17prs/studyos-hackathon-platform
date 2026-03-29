'use client';

import { useState } from 'react';
import Ribbon from '@/components/shared/Ribbon';
import { LuMic } from 'react-icons/lu';

export default function InterviewPrep() {
   const [topic, setTopic] = useState('');
   const [difficulty, setDifficulty] = useState('Medium');
   const [bloom, setBloom] = useState('Apply');
   const [isPrep, setIsPrep] = useState(false);
   const [currentQuestion, setCurrentQuestion] = useState(0);
   const [answer, setAnswer] = useState('');
   const [questions, setQuestions] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(false);

   const startInterview = async () => {
      if (!topic) return;
      setIsLoading(true);
      try {
         const res = await fetch('/api/saarthi/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject: topic, difficulty, bloom_level: bloom, count: 3 })
         });
         const data = await res.json();
         if (data.questions) {
            setQuestions(data.questions);
            setIsPrep(true);
            setCurrentQuestion(0);
            setAnswer('');
         }
      } catch (e) {
         console.error("Saarthi Gen Error", e);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="max-w-4xl mx-auto space-y-8">
         <div>
            <h2 className="text-3xl font-black tracking-tight mb-2">AI Interview Prep</h2>
            <p className="text-os-muted">Real-world interview simulation based on your weak subjects.</p>
         </div>

         {!isPrep ? (
            <div className="glass-card p-8 border-student-accent max-w-xl mx-auto mt-12 mb-24">
               <h3 className="text-xl font-bold mb-6">Setup Mock Interview</h3>
               <div className="space-y-4">
                  <div>
                     <label className="text-xs font-bold uppercase tracking-widest text-os-muted mb-2 block">Focus Subject</label>
                     <input
                        placeholder="e.g. Data Structures, React, Node.js"
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        className="w-full bg-os-card border border-os-border focus:border-student-accent p-4 rounded-xl outline-none"
                     />
                  </div>
                  <div>
                     <label className="text-xs font-bold uppercase tracking-widest text-os-muted mb-2 block">Bloom's Taxonomy / Skill</label>
                     <select
                        value={bloom}
                        onChange={e => setBloom(e.target.value)}
                        className="w-full bg-os-card border border-os-border focus:border-student-accent p-4 rounded-xl outline-none"
                     >
                        {['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'].map(c => <option key={c}>{c}</option>)}
                     </select>
                  </div>
                  <button
                     onClick={startInterview}
                     disabled={!topic || isLoading}
                     className={"btn-primary-student w-full mt-4 flex items-center justify-center " + (isLoading ? "opacity-50 cursor-wait" : "")}
                  >
                     {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Start Saarthi Session →'}
                  </button>
               </div>
            </div>
         ) : (
            <div className="animate-fade-up">
               <div className="glass-card p-12 min-h-[400px] flex flex-col justify-between border-2 border-student-accent bg-black relative">
                  <div className="absolute top-0 inset-x-0 h-1 bg-os-border">
                     <div className="h-full bg-student-accent transition-all duration-300" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
                  </div>

                  <div className="text-center">
                     <span className="bg-student-accent/20 text-student-accent font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-6 inline-block">
                        {questions[currentQuestion]?.bloom_level} Knowledge
                     </span>
                     <h2 className="text-3xl md:text-5xl font-black leading-tight mt-4 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        "{questions[currentQuestion]?.question_text}"
                     </h2>
                  </div>

                  <div className="mt-12 space-y-4">
                     <textarea
                        placeholder="Type your answer here, or click the mic button to speak..."
                        value={answer}
                        onChange={e => setAnswer(e.target.value)}
                        className="w-full bg-os-card/50 border border-os-border p-6 rounded-2xl resize-none outline-none focus:border-student-accent text-lg"
                        rows={4}
                     />
                     <div className="flex justify-between items-center">
                        <button className="p-4 rounded-full bg-os-border hover:bg-student-accent transition-colors flex items-center justify-center text-xl group">
                           <LuMic size={24} /> <span className="text-xs ml-2 uppercase font-black tracking-widest hidden group-hover:inline">Speak Answer</span>
                        </button>
                        <button
                           onClick={() => {
                              if (currentQuestion < questions.length - 1) {
                                 setCurrentQuestion(prev => prev + 1);
                                 setAnswer('');
                              } else {
                                 setIsPrep(false);
                                 alert("Mock Interview Complete. AI evaluates your response here.");
                              }
                           }}
                           disabled={!answer.trim()}
                           className={"btn-primary-student py-4 px-10 " + (!answer.trim() ? 'opacity-50 cursor-not-allowed' : '')}
                        >
                           {currentQuestion === questions.length - 1 ? 'Finish & Evaluate' : 'Submit & Next →'}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
