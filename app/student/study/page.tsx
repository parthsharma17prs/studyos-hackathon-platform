'use client';

import { useState, useCallback } from 'react';
import Ribbon from '@/components/shared/Ribbon';

/**
 * Study Notes + Quiz Generator — Core feature
 * Input: paste text / upload file → AI generates summary, quiz, key terms
 * Features: difficulty control, language toggle, adaptive retry, PDF download
 */

// ─── TYPES ───
interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  topic: string;
}

interface KeyTerm {
  term: string;
  definition: string;
}

interface StudyData {
  summary: string[];
  quiz: QuizQuestion[];
  keyTerms: KeyTerm[];
  studyStrategy: string;
  confabulationFlags: number[]; // indices of flagged summary points
}

type Difficulty = 'easy' | 'medium' | 'hard';
type Language = 'English' | 'Hindi' | 'Hinglish';
type ViewMode = 'input' | 'results';
type ResultTab = 'summary' | 'quiz' | 'terms' | 'results';

export default function StudyPage() {
  // ─── STATE ───
  const [viewMode, setViewMode] = useState<ViewMode>('input');
  const [inputText, setInputText] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [language, setLanguage] = useState<Language>('English');
  const [isGenerating, setIsGenerating] = useState(false);
  const [studyData, setStudyData] = useState<StudyData | null>(null);
  const [activeTab, setActiveTab] = useState<ResultTab>('summary');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');

  // ─── FILE UPLOAD HANDLER ───
  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'text/plain') {
      const text = await file.text();
      setInputText(text);
    } else if (file.type === 'application/pdf') {
      // For hackathon demo, we read PDF as text (basic extraction)
      setInputText(`[PDF Content from: ${file.name}]\n\nNote: For full PDF parsing, the backend API with Gemini Vision processes the file. Paste your text content here for the demo.`);
    } else if (file.type.startsWith('image/')) {
      // Convert image to base64 for Gemini Vision
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        setInputText(`[Image uploaded: ${file.name}]\nBase64 data ready for Gemini Vision processing.\n\nFor demo: paste your handwritten notes as text.`);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // ─── GENERATE STUDY SET ───
  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError('Please paste some text or upload a file.');
      return;
    }
    if (inputText.trim().length < 50) {
      setError('Please provide at least 50 characters of study material.');
      return;
    }

    setError('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          difficulty,
          count: questionCount,
          language,
        }),
      });

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const data: StudyData = await res.json();
      setStudyData(data);
      setViewMode('results');
      setActiveTab('summary');
      setSelectedAnswers({});
      setQuizSubmitted(false);
    } catch (err: any) {
      setError(err.message || 'Failed to generate. Check your API key in .env.local');
    } finally {
      setIsGenerating(false);
    }
  };

  // ─── QUIZ SUBMISSION ───
  const handleQuizSubmit = () => {
    if (!studyData) return;
    let correct = 0;
    studyData.quiz.forEach((q, i) => {
      if (selectedAnswers[i] === q.correct) correct++;
    });
    const finalScore = Math.round((correct / studyData.quiz.length) * 100);
    setScore(finalScore);
    setQuizSubmitted(true);
    setActiveTab('results');

    // Save session to localStorage
    const sessions = JSON.parse(localStorage.getItem('studyos_sessions') || '[]');
    sessions.push({
      topic: inputText.substring(0, 50) + '...',
      score: finalScore,
      date: new Date().toLocaleDateString(),
      questionsCount: studyData.quiz.length,
    });
    localStorage.setItem('studyos_sessions', JSON.stringify(sessions));

    // Update spaced repetition schedule
    if (studyData.keyTerms.length > 0) {
      const spaced = JSON.parse(localStorage.getItem('studyos_spaced_repetition') || '{}');
      const today = new Date().toISOString().split('T')[0];
      studyData.quiz.forEach((q, i) => {
        const isCorrect = selectedAnswers[i] === q.correct;
        const existing = spaced[q.topic] || { interval: 1, nextReview: today };
        const ease = isCorrect ? (finalScore >= 80 ? 2.5 : 2.0) : 1.3;
        const nextInterval = Math.round(existing.interval * ease);
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + nextInterval);
        spaced[q.topic] = {
          interval: nextInterval,
          nextReview: nextDate.toISOString().split('T')[0],
          lastScore: isCorrect ? 100 : 0,
        };
      });
      localStorage.setItem('studyos_spaced_repetition', JSON.stringify(spaced));
    }
  };

  // ─── ADAPTIVE RETRY ───
  const handleAdaptiveRetry = async () => {
    if (!studyData) return;
    const wrongTopics = studyData.quiz
      .filter((_, i) => selectedAnswers[i] !== studyData.quiz[i].correct)
      .map(q => q.topic);

    if (wrongTopics.length === 0) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-adaptive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wrongTopics,
          originalText: inputText,
          difficulty: 'hard',
        }),
      });

      if (!res.ok) throw new Error('Failed to generate adaptive quiz');

      const data = await res.json();
      setStudyData(prev => prev ? { ...prev, quiz: data.quiz } : prev);
      setSelectedAnswers({});
      setQuizSubmitted(false);
      setActiveTab('quiz');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // ─── PDF DOWNLOAD ───
  const handleDownloadPDF = async () => {
    if (!studyData) return;
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('StudyOS — Study Sheet', 20, 25);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()} | Difficulty: ${difficulty}`, 20, 35);

    let y = 50;

    // Summary
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 20, y);
    y += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    studyData.summary.forEach(point => {
      const lines = doc.splitTextToSize(`• ${point}`, 170);
      if (y + lines.length * 5 > 280) { doc.addPage(); y = 20; }
      doc.text(lines, 20, y);
      y += lines.length * 5 + 3;
    });

    // Quiz + Score
    if (quizSubmitted) {
      y += 10;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      if (y > 260) { doc.addPage(); y = 20; }
      doc.text(`Quiz Score: ${score}%`, 20, y);
      y += 10;
    }

    // Key Terms
    y += 5;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    if (y > 250) { doc.addPage(); y = 20; }
    doc.text('Key Terms', 20, y);
    y += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    studyData.keyTerms.forEach(term => {
      const lines = doc.splitTextToSize(`${term.term}: ${term.definition}`, 170);
      if (y + lines.length * 5 > 280) { doc.addPage(); y = 20; }
      doc.text(lines, 20, y);
      y += lines.length * 5 + 3;
    });

    doc.save('studyos-study-sheet.pdf');
  };

  // ═════════════════════════════════════════
  // INPUT SCREEN
  // ═════════════════════════════════════════
  if (viewMode === 'input') {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-2">Generate Study Set</h2>
          <p className="text-os-muted">Paste your notes or upload a file — AI does the rest.</p>
        </div>

        {/* Text Input Area */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your study notes, chapter text, lecture content, or any study material here..."
            className="w-full h-64 bg-os-card border-2 border-os-border rounded-2xl p-6 text-white placeholder-os-muted/50 resize-none focus:border-student-accent focus:outline-none transition-colors text-sm leading-relaxed"
          />
          <div className="absolute bottom-4 right-4 text-xs text-os-muted">
            {inputText.length} characters
          </div>
        </div>

        {/* File Upload */}
        <div className="flex items-center gap-4">
          <label className="btn-ghost cursor-pointer flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload PDF / TXT / Image
            <input type="file" accept=".pdf,.txt,.png,.jpg,.jpeg" className="hidden" onChange={handleFileUpload} />
          </label>
          <span className="text-xs text-os-muted">Supports PDF, TXT, PNG, JPG</span>
        </div>

        <Ribbon theme="student" />

        {/* Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Difficulty */}
          <div>
            <label className="text-xs text-os-muted uppercase tracking-wider font-semibold block mb-3">
              Difficulty
            </label>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                    difficulty === d
                      ? 'bg-student-accent text-white'
                      : 'bg-os-card border border-os-border text-os-muted hover:text-white hover:border-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div>
            <label className="text-xs text-os-muted uppercase tracking-wider font-semibold block mb-3">
              Questions: {questionCount}
            </label>
            <input
              type="range"
              min={3}
              max={15}
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full accent-student-accent"
            />
            <div className="flex justify-between text-xs text-os-muted mt-1">
              <span>3</span>
              <span>15</span>
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="text-xs text-os-muted uppercase tracking-wider font-semibold block mb-3">
              Language
            </label>
            <div className="flex gap-2">
              {(['English', 'Hindi', 'Hinglish'] as Language[]).map(l => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                    language === l
                      ? 'bg-student-accent text-white'
                      : 'bg-os-card border border-os-border text-os-muted hover:text-white hover:border-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 rounded-xl bg-red-900/20 border border-red-800 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !inputText.trim()}
          className={`
            w-full py-5 rounded-2xl text-lg font-black uppercase tracking-widest
            transition-all duration-300 transform
            ${isGenerating
              ? 'bg-os-border text-os-muted cursor-wait'
              : 'bg-student-accent text-white hover:scale-[1.02] hover:shadow-lg hover:shadow-red-600/20'
            }
          `}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating with AI...
            </span>
          ) : (
            'GENERATE MY STUDY SET'
          )}
        </button>
      </div>
    );
  }

  // ═════════════════════════════════════════
  // RESULTS SCREEN
  // ═════════════════════════════════════════
  if (!studyData) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back + Actions Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setViewMode('input')}
          className="flex items-center gap-2 text-os-muted hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          New Study Set
        </button>

        <div className="flex gap-3">
          <button onClick={handleDownloadPDF} className="btn-ghost text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-os-card rounded-2xl p-1.5">
        {[
          { key: 'summary', label: 'Summary', icon: '📋' },
          { key: 'quiz', label: 'Quiz', icon: '🧠' },
          { key: 'terms', label: 'Key Terms', icon: '📚' },
          { key: 'results', label: 'Results', icon: '📊', disabled: !quizSubmitted },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => !tab.disabled && setActiveTab(tab.key as ResultTab)}
            disabled={tab.disabled}
            className={`
              flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300
              flex items-center justify-center gap-2
              ${activeTab === tab.key
                ? 'bg-student-accent text-white'
                : tab.disabled
                  ? 'text-os-muted/30 cursor-not-allowed'
                  : 'text-os-muted hover:text-white'
              }
            `}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <Ribbon theme="student" />

      {/* ─── TAB: SUMMARY ─── */}
      {activeTab === 'summary' && (
        <div className="space-y-4">
          <h3 className="text-2xl font-black">Summary</h3>
          <div className="space-y-3">
            {studyData.summary.map((point, i) => (
              <div
                key={i}
                className="glass-card p-5 animate-fade-up flex gap-4"
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <div className="w-8 h-8 rounded-lg bg-student-accent/20 flex items-center justify-center shrink-0">
                  <span className="text-student-accent font-bold text-xs">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">{point}</p>
                  {studyData.confabulationFlags.includes(i) && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-yellow-500">
                      <span>⚠️</span>
                      <span>AI confidence low — verify this point against source material</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Study Strategy */}
          {studyData.studyStrategy && (
            <div className="glass-card p-6 border-student-accent/20">
              <h4 className="font-bold text-sm text-student-accent mb-2">🎯 Study Strategy</h4>
              <p className="text-sm text-os-muted leading-relaxed">{studyData.studyStrategy}</p>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB: QUIZ ─── */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black">Quiz</h3>
            <span className="text-sm text-os-muted">
              {Object.keys(selectedAnswers).length} / {studyData.quiz.length} answered
            </span>
          </div>

          {/* Progress bar */}
          <div className="progress-bar">
            <div
              className="progress-fill-red"
              style={{ width: `${(Object.keys(selectedAnswers).length / studyData.quiz.length) * 100}%` }}
            />
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {studyData.quiz.map((q, qi) => (
              <div
                key={qi}
                className="glass-card p-6 animate-fade-up"
                style={{ animationDelay: `${qi * 0.05}s`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-start gap-3 mb-5">
                  <span className="bg-student-accent/20 text-student-accent font-black text-xs px-2.5 py-1.5 rounded-lg shrink-0">
                    Q{qi + 1}
                  </span>
                  <p className="font-semibold text-sm leading-relaxed">{q.question}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, oi) => {
                    const isSelected = selectedAnswers[qi] === oi;
                    const isCorrect = quizSubmitted && oi === q.correct;
                    const isWrong = quizSubmitted && isSelected && oi !== q.correct;

                    return (
                      <button
                        key={oi}
                        onClick={() => {
                          if (quizSubmitted) return;
                          setSelectedAnswers(prev => ({ ...prev, [qi]: oi }));
                        }}
                        disabled={quizSubmitted}
                        className={`
                          p-4 rounded-xl text-left text-sm font-medium transition-all duration-300
                          ${isCorrect
                            ? 'bg-student-accent text-white border-2 border-student-accent'
                            : isWrong
                              ? 'bg-os-border text-os-muted border-2 border-os-border line-through'
                              : isSelected
                                ? 'bg-student-accent/20 border-2 border-student-accent text-white'
                                : 'bg-os-card border-2 border-os-border text-os-muted hover:border-white hover:text-white'
                          }
                        `}
                      >
                        <span className="font-bold mr-2">
                          {String.fromCharCode(65 + oi)}.
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation (after submit) */}
                {quizSubmitted && (
                  <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-os-border">
                    <p className="text-xs text-os-muted leading-relaxed">
                      <span className="font-bold text-white">Explanation: </span>
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          {!quizSubmitted && (
            <button
              onClick={handleQuizSubmit}
              disabled={Object.keys(selectedAnswers).length < studyData.quiz.length}
              className={`
                w-full py-5 rounded-2xl text-lg font-black uppercase tracking-widest
                transition-all duration-300
                ${Object.keys(selectedAnswers).length >= studyData.quiz.length
                  ? 'bg-student-accent text-white hover:scale-[1.02]'
                  : 'bg-os-border text-os-muted cursor-not-allowed'
                }
              `}
            >
              Submit Quiz ({Object.keys(selectedAnswers).length}/{studyData.quiz.length})
            </button>
          )}
        </div>
      )}

      {/* ─── TAB: KEY TERMS ─── */}
      {activeTab === 'terms' && (
        <div className="space-y-6">
          <h3 className="text-2xl font-black">Key Terms</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {studyData.keyTerms.map((term, i) => (
              <div
                key={i}
                className="flip-card h-40"
              >
                <div className="flip-card-inner relative w-full h-full">
                  {/* Front */}
                  <div className="flip-card-front absolute inset-0 glass-card p-5 flex flex-col justify-center">
                    <p className="font-black text-lg">{term.term}</p>
                    <p className="text-xs text-os-muted mt-1">Hover to see definition</p>
                  </div>
                  {/* Back */}
                  <div className="flip-card-back absolute inset-0 glass-card p-5 flex flex-col justify-center border-student-accent/30">
                    <p className="font-bold text-sm text-student-accent mb-2">{term.term}</p>
                    <p className="text-sm text-os-muted leading-relaxed">{term.definition}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB: RESULTS ─── */}
      {activeTab === 'results' && quizSubmitted && (
        <div className="space-y-8">
          {/* Giant Score */}
          <div className="text-center py-8">
            <div className={`text-8xl font-black ${score >= 70 ? 'text-student-accent glow-text-red' : 'text-os-muted'}`}>
              {score}%
            </div>
            <p className="text-os-muted mt-4 text-lg">
              {score >= 80 ? '🔥 Excellent! Keep it up!' :
               score >= 60 ? '👍 Good work. Room to improve.' :
               score >= 40 ? '📚 Keep studying. You\'ll get there.' :
               '💪 Don\'t give up. Let\'s retry on weak topics.'}
            </p>
          </div>

          <Ribbon theme="student" />

          {/* Confidence by Topic */}
          <div>
            <h4 className="font-black text-lg mb-4">Topic Confidence</h4>
            <div className="space-y-3">
              {Array.from(new Set(studyData.quiz.map(q => q.topic))).map((topic, i) => {
                const topicQuestions = studyData.quiz.filter(q => q.topic === topic);
                const correct = topicQuestions.filter((q, qi) => {
                  const idx = studyData.quiz.indexOf(q);
                  return selectedAnswers[idx] === q.correct;
                }).length;
                const pct = Math.round((correct / topicQuestions.length) * 100);

                return (
                  <div key={i} className="glass-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">{topic}</span>
                      <span className={`text-sm font-black ${pct >= 70 ? 'text-student-accent' : 'text-os-muted'}`}>
                        {pct}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill-red" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Adaptive Retry */}
          {score < 80 && (
            <button
              onClick={handleAdaptiveRetry}
              disabled={isGenerating}
              className="w-full py-4 rounded-xl bg-student-accent text-white font-black uppercase tracking-wider hover:scale-[1.02] transition-all"
            >
              {isGenerating ? 'Generating targeted quiz...' : '🎯 RETRY ON WEAK TOPICS'}
            </button>
          )}

          {/* Study Strategy */}
          <div className="glass-card p-6 border-student-accent/20">
            <h4 className="font-bold text-sm text-student-accent mb-3">📝 Exam Strategy</h4>
            <p className="text-sm text-os-muted leading-relaxed">{studyData.studyStrategy}</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-900/20 border border-red-800 text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
