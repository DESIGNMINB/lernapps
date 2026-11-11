import React, { useEffect, useRef, useState } from 'react';
import { generateQuizQuestion } from '../services/geminiService';
import { QuizQuestion } from '../types';

// Anzeigenamen der Themen (die Schlüssel bleiben für die Fragensammlung erhalten)
const TOPIC_LABELS: Record<string, string> = {
  'Usability Heuristiken': 'Usability-Heuristiken',
  'Gestaltgesetze': 'Gestaltgesetze',
  'Accessibility': 'Barrierefreiheit',
  "Fitts's Law": 'Fitts’ Gesetz',
  'User Centered Design': 'Nutzerzentriertes Design',
};

export const QuizLab: React.FC = () => {
  // --- Quiz State ---
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizTopic, setQuizTopic] = useState("Usability Heuristiken");
  const analysisRef = useRef<HTMLDivElement>(null);

  // Nach der Antwort Fokus auf die Auswertung setzen, damit sie vorgelesen wird (WCAG 2.4.3, 4.1.3)
  useEffect(() => {
    if (selectedOption !== null) analysisRef.current?.focus();
  }, [selectedOption]);

  // --- Quiz Handlers ---
  const handleGenerateQuiz = async () => {
    setLoadingQuiz(true);
    setCurrentQuestion(null);
    setSelectedOption(null);
    const question = await generateQuizQuestion(quizTopic);
    setCurrentQuestion(question);
    setLoadingQuiz(false);
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-200 pb-4 mb-6 gap-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-stone-900 inline-block">
            Lern-Labor
          </h2>
          <h1 className="text-[clamp(34px,5vw,52px)] leading-[1.08] font-bold tracking-[-0.01em] text-orange-600 mt-1">
            Prüfungstrainer
          </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="bg-white flex-1 flex flex-col overflow-hidden rounded-xl border border-stone-200 shadow-sm relative">
        
        {/* === QUIZ VIEW === */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12">
          {!currentQuestion && !loadingQuiz && (
            <div className="text-center h-full flex flex-col justify-center items-center max-w-2xl mx-auto space-y-8">
              <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center text-5xl mb-4">
                  📝
              </div>
              <div>
                <h3 className="text-2xl font-bold text-stone-900 mb-2">Wissen überprüfen</h3>
                <p className="text-stone-600">Wählen Sie ein Themengebiet für Ihre nächste Herausforderung.</p>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center">
                {['Usability Heuristiken', 'Gestaltgesetze', 'Accessibility', 'Fitts\'s Law', 'User Centered Design'].map(topic => (
                  <button
                    key={topic}
                    type="button"
                    aria-pressed={quizTopic === topic}
                    onClick={() => setQuizTopic(topic)}
                    className={`px-4 py-2 rounded-full border text-sm transition-all ${quizTopic === topic ? 'border-cta bg-cta text-white' : 'border-stone-200 hover:border-stone-400 text-stone-700'}`}
                  >
                    {TOPIC_LABELS[topic] || topic}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleGenerateQuiz}
                className="px-8 py-3 bg-cta text-white font-bold text-sm uppercase tracking-wider hover:bg-cta-hover transition-all rounded-lg shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-1"
              >
                Frage starten
              </button>
            </div>
          )}

          {loadingQuiz && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin mb-6"></div>
              <p className="text-stone-500 font-serif italic text-lg">Frage wird geladen …</p>
            </div>
          )}

          {currentQuestion && (
            <div className="space-y-10 animate-fade-in max-w-3xl mx-auto w-full py-4">
              <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                <div className="flex items-center gap-3">
                   <span className="text-xs font-bold uppercase tracking-widest text-stone-500">{TOPIC_LABELS[quizTopic] || quizTopic}</span>
                </div>
                <button onClick={handleGenerateQuiz} className="text-xs font-bold uppercase tracking-widest text-stone-900 hover:underline">Nächste Frage →</button>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 leading-snug">
                {currentQuestion.question}
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((option, idx) => {
                  let btnClass = "w-full text-left p-6 border rounded-lg transition-all duration-300 group ";
                  if (selectedOption === null) {
                    btnClass += "border-stone-200 hover:border-stone-400 bg-white hover:bg-stone-50";
                  } else if (idx === currentQuestion.correctIndex) {
                    btnClass += "border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600";
                  } else if (selectedOption === idx) {
                    btnClass += "border-rose-200 bg-rose-50 text-rose-900";
                  } else {
                    btnClass += "border-stone-100 opacity-50";
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedOption !== null}
                      onClick={() => setSelectedOption(idx)}
                      className={btnClass}
                    >
                      <div className="flex items-start gap-4">
                        <span className={`text-xs font-bold uppercase tracking-widest mt-1 border w-6 h-6 flex items-center justify-center rounded ${
                          selectedOption === null ? 'border-stone-300 text-stone-400' :
                          idx === currentQuestion.correctIndex ? 'border-emerald-600 bg-emerald-600 text-white' :
                          'border-stone-300 text-stone-300'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-lg leading-relaxed">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedOption !== null && (
                <div ref={analysisRef} tabIndex={-1} className="bg-stone-50 p-8 rounded-lg border-l-4 border-stone-900 animate-slide-up focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900">
                  <h4 className="font-bold text-stone-900 mb-2 font-serif text-lg">
                    {selectedOption === currentQuestion.correctIndex ? 'Richtig – ' : 'Leider falsch – '}Analyse
                  </h4>
                  <p className="text-stone-700 leading-relaxed">{currentQuestion.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
