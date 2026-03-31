'use client';

import { useState, useEffect } from 'react';
import { LuFileText, LuSparkles, LuBrain, LuChartLine, LuBookOpen, LuCircleCheck, LuUpload, LuDownload } from 'react-icons/lu';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ExamPractitionerPage() {
  const [activeTab, setActiveTab] = useState<'solver' | 'generator' | 'confidence'>('solver');
  
  // Solver State
  const [questionPaperText, setQuestionPaperText] = useState('');
  const [solverSummaryText, setSolverSummaryText] = useState('');
  const [solverResult, setSolverResult] = useState('');
  const [solving, setSolving] = useState(false);

  // Generator State
  const [templateText, setTemplateText] = useState('');
  const [notesJsonText, setNotesJsonText] = useState('');
  const [generatedPaper, setGeneratedPaper] = useState('');
  const [generatingPaper, setGeneratingPaper] = useState(false);
  
  // Study Sessions
  const [studySessions, setStudySessions] = useState<any[]>([]);

  useEffect(() => {
    const fetchStudySessions = async () => {
      try {
        const q = query(collection(db, 'studySessions'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const sessions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setStudySessions(sessions);
      } catch (err) {
        console.error('Failed to fetch study sessions', err);
      }
    };
    fetchStudySessions();
  }, []);

  // Confidence State
  const [learningNotes, setLearningNotes] = useState('');
  const [quizText, setQuizText] = useState('');
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [preScore, setPreScore] = useState(0);
  const [postScore, setPostScore] = useState(0);
  const [confidenceData, setConfidenceData] = useState<{improvement: number, accuracy: number} | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setter(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        const text = await file.text();
        setter(text);
      }
    }
  };

  const handleSolve = async () => {
    if (!questionPaperText) return;
    setSolving(true);
    try {
      const res = await fetch('/api/groq/exam-practitioner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'solve', payload: { questionPaper: questionPaperText, summaryNotes: solverSummaryText } })
      });
      const data = await res.json();
      setSolverResult(data.result || data.error);
    } catch (e) {
      console.error(e);
    }
    setSolving(false);
  };

  const handleGeneratePaper = async () => {
    if (!templateText || !notesJsonText) return;
    setGeneratingPaper(true);
    try {
      const res = await fetch('/api/groq/exam-practitioner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_paper', payload: { template: templateText, notes: notesJsonText } })
      });
      const data = await res.json();
      setGeneratedPaper(data.result || data.error);
    } catch (e) {
      console.error(e);
    }
    setGeneratingPaper(false);
  };

  const handleGenerateQuiz = async () => {
    if (!learningNotes) return;
    setGeneratingQuiz(true);
    try {
      const res = await fetch('/api/groq/exam-practitioner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_quiz', payload: { notes: learningNotes, type: 'pre' } })
      });
      const data = await res.json();
      setQuizText(data.result || data.error);
    } catch (e) {
      console.error(e);
    }
    setGeneratingQuiz(false);
  };

  const calculateConfidence = () => {
    const total = 5;
    const improvement = ((postScore - preScore) / total) * 100;
    const accuracy = (postScore / total) * 100;
    setConfidenceData({ improvement, accuracy });
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-5xl font-black tracking-tighter mb-4">
            Exam <span className="text-student-accent">Practitioner</span>
          </h1>
          <p className="text-os-muted font-bold tracking-widest uppercase text-xs">AI-Powered Question Paper Solver & Generator Framework</p>
        </div>
      </div>

      <div className="flex border-b border-os-border gap-8">
        <button 
          onClick={() => setActiveTab('solver')}
          className={`pb-4 font-black tracking-widest uppercase transition-all ${activeTab === 'solver' ? 'border-b-2 border-student-accent text-student-accent' : 'text-os-muted hover:text-white'}`}
        >
          <span className="flex items-center gap-2"><LuUpload size={18}/> Auto-Solver</span>
        </button>
        <button 
          onClick={() => setActiveTab('generator')}
          className={`pb-4 font-black tracking-widest uppercase transition-all ${activeTab === 'generator' ? 'border-b-2 border-student-accent text-student-accent' : 'text-os-muted hover:text-white'}`}
        >
          <span className="flex items-center gap-2"><LuFileText size={18}/> Paper Generator</span>
        </button>
        <button 
          onClick={() => setActiveTab('confidence')}
          className={`pb-4 font-black tracking-widest uppercase transition-all ${activeTab === 'confidence' ? 'border-b-2 border-student-accent text-student-accent' : 'text-os-muted hover:text-white'}`}
        >
          <span className="flex items-center gap-2"><LuChartLine size={18}/> Confidence Meter</span>
        </button>
      </div>

      {activeTab === 'solver' && (
        <div className="space-y-6">
          <div className="glass-card p-6 bg-gradient-to-br from-student-accent/5 to-transparent">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                <LuUpload className="text-student-accent"/> Upload Question Paper (PYQ)
              </h2>
              <label className="cursor-pointer bg-black/40 border border-student-accent/30 hover:bg-student-accent/10 px-4 py-2 rounded-lg text-sm font-bold transition-all">
                <input type="file" accept=".txt,.json,.doc,.docx,.pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleFileUpload(e, setQuestionPaperText)} />
                Choose File
              </label>
            </div>
            
            {questionPaperText.startsWith('data:image/') ? (
              <img src={questionPaperText} alt="Uploaded Paper" className="w-full h-48 object-contain bg-black/40 rounded-xl mb-4 p-2 border border-os-border" />
            ) : (
                <textarea 
                  value={questionPaperText}
                  onChange={(e) => setQuestionPaperText(e.target.value)}
                  placeholder="Paste the contents of your Question Paper here or use 'Choose File' to upload Images, PDFs, Docs, or text..."
                  className="w-full h-32 bg-black/40 border border-os-border focus:border-student-accent rounded-xl p-4 text-white outline-none mb-4 resize-none"
                />
            )}

            <div className="flex justify-between items-center mb-4 mt-6">
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2 text-os-muted">
                <LuBookOpen /> Context: Summary JSON (Optional)
              </h2>
              <label className="cursor-pointer bg-black/40 border border-os-border hover:border-student-accent/30 px-4 py-2 rounded-lg text-sm font-bold transition-all">
                <input type="file" accept=".json,.txt" className="hidden" onChange={(e) => handleFileUpload(e, setSolverSummaryText)} />
                Choose Summary
              </label>
            </div>
            <textarea 
              value={solverSummaryText}
              onChange={(e) => setSolverSummaryText(e.target.value)}
              placeholder="Provide any JSON summary files to strictly constraint the AI's solutions..."
              className="w-full h-24 bg-black/40 border border-os-border focus:border-student-accent rounded-xl p-4 text-white outline-none mb-6 resize-none"
            />

            <button 
              onClick={handleSolve}
              disabled={solving}
              className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-student-accent hover:bg-red-700 disabled:opacity-50 text-white rounded-xl font-black transition-all hover:scale-[1.02]"
            >
              {solving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><LuSparkles /> SOLVE PAPER SEQUENCE-WISE</>}
            </button>
          </div>

          {solverResult && (
            <div className="glass-card p-8 bg-black/60 border border-student-accent/20">
              <h3 className="text-xl font-black tracking-tight text-student-accent mb-6 flex items-center gap-2">
                <LuCircleCheck /> AI Sequence-Wise Solutions
              </h3>
              <div className="prose prose-invert max-w-none whitespace-pre-wrap font-medium">
                {solverResult}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="glass-card p-6 bg-gradient-to-br from-blue-500/5 to-transparent">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                  <LuFileText className="text-blue-500"/> Sample PYQ Template
                </h2>
                <label className="cursor-pointer bg-black/40 border border-blue-500/30 hover:bg-blue-500/10 px-4 py-2 rounded-lg text-sm font-bold transition-all">
                  <input type="file" accept=".txt,.json,.doc,.docx,.pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleFileUpload(e, setTemplateText)} />
                  Choose File
                </label>
              </div>
              {templateText.startsWith('data:image/') ? (
                <img src={templateText} alt="Uploaded Template" className="w-full h-32 object-cover bg-black/40 rounded-xl mb-4 p-2 border border-os-border" />
              ) : (
                <textarea 
                  value={templateText}
                  onChange={(e) => setTemplateText(e.target.value)}
                  placeholder="E.g., Section A: 5 qs (2 marks)\nSection B: 3 qs (5 marks)..."
                  className="w-full h-32 bg-black/40 border border-os-border focus:border-blue-500 rounded-xl p-4 text-white outline-none resize-none"
                />
              )}
            </div>
            <div className="glass-card p-6 bg-gradient-to-br from-purple-500/5 to-transparent">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                  <LuBookOpen className="text-purple-500"/> RAG Context / Study Notes
                </h2>
                <div className="flex gap-2">
                  <select 
                    onChange={(e) => {
                      const session = studySessions.find(s => s.id === e.target.value);
                      if (session) {
                        setNotesJsonText(JSON.stringify(session.messages || [], null, 2));
                      } else {
                        setNotesJsonText('');
                      }
                    }}
                    className="bg-black/40 border border-purple-500/30 px-3 py-2 rounded-lg text-sm font-bold text-white outline-none"
                  >
                    <option value="">Select from Study Session...</option>
                    {studySessions.map((session) => (
                      <option key={session.id} value={session.id}>
                        {session.title || 'Untitled Session'} - {new Date(session.createdAt?.toDate?.() || Date.now()).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                  <label className="cursor-pointer bg-black/40 border border-purple-500/30 hover:bg-purple-500/10 px-4 py-2 rounded-lg text-sm font-bold transition-all">
                    <input type="file" accept=".txt,.json" className="hidden" onChange={(e) => handleFileUpload(e, setNotesJsonText)} />
                    Choose File
                  </label>
                </div>
              </div>
              <textarea 
                value={notesJsonText}
                onChange={(e) => setNotesJsonText(e.target.value)}
                placeholder="Paste the documentation, notes or extracted content to generate questions from..."
                className="w-full h-32 bg-black/40 border border-os-border focus:border-purple-500 rounded-xl p-4 text-white outline-none resize-none"
              />
            </div>
            <button 
              onClick={handleGeneratePaper}
              disabled={generatingPaper}
              className="flex items-center justify-center gap-2 w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 disabled:opacity-50 text-white rounded-xl font-black transition-all hover:scale-[1.02]"
            >
              {generatingPaper ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><LuBrain /> GENERATE MOCK PAPER</>}
            </button>
          </div>

          <div className="glass-card p-8 bg-black/60 border border-os-border min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                <LuCircleCheck className="text-student-accent"/> Generated Mock Paper
              </h3>
              {generatedPaper && (
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      const blob = new Blob([generatedPaper], { type: 'application/msword' });
                      const link = document.createElement('a');
                      link.href = URL.createObjectURL(blob);
                      link.download = 'Mock_Paper.doc';
                      link.click();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 rounded-lg text-sm font-bold transition-all border border-blue-500/30"
                  >
                    <LuDownload /> Word
                  </button>
                  <button 
                    onClick={() => {
                      window.print();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg text-sm font-bold transition-all border border-red-500/30"
                  >
                    <LuDownload /> PDF
                  </button>
                </div>
              )}
            </div>
            {generatedPaper ? (
              <div className="prose prose-invert max-w-none whitespace-pre-wrap font-medium">
                {generatedPaper}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-os-muted italic text-sm font-bold">
                Generated question paper will appear here based on the RAG context...
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'confidence' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="glass-card p-6 bg-gradient-to-br from-orange-500/5 to-transparent">
                    <h2 className="text-xl font-black tracking-tight mb-2 flex items-center gap-2">
                        <LuBrain className="text-orange-500"/> Study Notes Input
                    </h2>
                    <textarea 
                        value={learningNotes}
                        onChange={(e) => setLearningNotes(e.target.value)}
                        placeholder="Paste study material to generate Pre/Post MCQs..."
                        className="w-full h-32 bg-black/40 border border-os-border focus:border-orange-500 rounded-xl p-4 text-white outline-none mb-4 resize-none"
                    />
                    <button 
                        onClick={handleGenerateQuiz}
                        disabled={generatingQuiz}
                        className="flex items-center justify-center gap-2 w-full px-8 py-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-xl font-black transition-all hover:scale-[1.02]"
                    >
                    {generatingQuiz ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><LuSparkles /> GENERATE 5 MCQs</>}
                    </button>
                </div>

                {quizText && (
                    <div className="glass-card p-6 border-orange-500/30 bg-black/50">
                        <h3 className="font-black text-orange-400 mb-4">Generated Quiz (Pre/Post)</h3>
                        <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm">
                            {quizText}
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <div className="glass-card p-6 bg-gradient-to-br from-green-500/5 to-transparent">
                    <h2 className="text-xl font-black tracking-tight mb-6 flex items-center gap-2">
                        <LuChartLine className="text-green-500"/> Performance & Confidence Meter
                    </h2>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-os-muted">Estimated Confidence Score (0-5)</label>
                            <input 
                                type="number" 
                                min="0" max="5" 
                                value={preScore} 
                                onChange={(e) => setPreScore(Number(e.target.value))}
                                className="w-full bg-black/40 border border-os-border focus:border-green-500 rounded-xl p-4 text-white outline-none"
                            />
                            <p className="text-[10px] text-os-muted italic">Self-assess before test</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-os-muted">Actual Score (0-5)</label>
                            <input 
                                type="number" 
                                min="0" max="5" 
                                value={postScore} 
                                onChange={(e) => setPostScore(Number(e.target.value))}
                                className="w-full bg-black/40 border border-os-border focus:border-green-500 rounded-xl p-4 text-white outline-none"
                            />
                            <p className="text-[10px] text-os-muted italic">Score after evaluating test</p>
                        </div>
                    </div>
                    <button 
                        onClick={calculateConfidence}
                        className="flex items-center justify-center gap-2 w-full px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-black transition-all hover:scale-[1.02]"
                    >
                        MEASURE CONFIDENCE
                    </button>
                </div>

                {confidenceData && (
                    <div className="glass-card p-8 border-green-500/30 text-center space-y-6 bg-black/60 relative overflow-hidden">
                        <div className="absolute top-0 left-0 h-1 bg-green-500 transition-all duration-1000" style={{ width: `${confidenceData.accuracy}%` }} />
                        
                        <div>
                            <h3 className="text-4xl font-black text-white">{confidenceData.accuracy.toFixed(1)}%</h3>
                            <p className="text-xs font-black text-os-muted uppercase tracking-widest mt-1">Final Accuracy</p>
                        </div>
                        
                        <div className="w-full h-px bg-os-border" />

                        <div>
                            <h3 className={`text-3xl font-black ${confidenceData.improvement > 0 ? 'text-green-400' : confidenceData.improvement === 0 ? 'text-blue-400' : 'text-red-400'}`}>
                                {confidenceData.improvement > 0 ? '+' : ''}{confidenceData.improvement.toFixed(1)}%
                            </h3>
                            <p className="text-xs font-black text-os-muted uppercase tracking-widest mt-1">Reality Gap (Actual vs Estimated)</p>
                        </div>

                        <div className="pt-4">
                            {confidenceData.improvement < 0 ? (
                                <span className="inline-block px-4 py-2 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 font-black text-xs tracking-widest uppercase">⚠️ Overconfident</span>
                            ) : confidenceData.improvement === 0 ? (
                                <span className="inline-block px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 font-black text-xs tracking-widest uppercase">🎯 Perfectly Confident</span>
                            ) : (
                                <span className="inline-block px-4 py-2 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 font-black text-xs tracking-widest uppercase">📈 Modest/Learned</span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}

    </div>
  );
}
