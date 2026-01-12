
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { StudyResult, StudyFeature, SummaryData, QuizData, TipsData, CheatSheetData, QuizQuestion } from '../types';

interface FeatureDetailProps {
  results: StudyResult[];
}

const FeatureDetail: React.FC<FeatureDetailProps> = ({ results }) => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const result = results.find(r => r.id === id);
  
  const displayFeature = searchParams.get('feature') as StudyFeature || result?.feature;

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [selectedMCQ, setSelectedMCQ] = useState<string | null>(null);
  
  // Timer State for Exam Mode
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const isExamMode = searchParams.get('mode') === 'exam';

  useEffect(() => {
    if (isExamMode && !quizFinished && timeLeft === null) {
      setTimeLeft(600); // 10 minuten standaard
    }
    if (timeLeft !== null && timeLeft > 0 && !quizFinished) {
      const timer = setInterval(() => setTimeLeft(t => t! - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setQuizFinished(true);
    }
  }, [timeLeft, quizFinished, isExamMode]);

  if (!result) return <div className="p-12 text-center text-white font-black italic">404: Brain Cell Missing.</div>;

  const renderSummary = (data: SummaryData) => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="glass-card rounded-[2.8rem] p-10 border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
        <h3 className="text-3xl font-900 text-blue-400 mb-8 italic tracking-tighter uppercase underline decoration-blue-500/30 decoration-8 underline-offset-8">DE INTEL 📝</h3>
        {data.chapters?.map((chap, idx) => (
          <div key={idx} className="mb-10 last:mb-0 relative z-10">
            <h4 className="font-900 text-white bg-white/5 border border-white/10 px-4 py-1.5 rounded-xl inline-block mb-4 text-xs uppercase tracking-widest">{chap.title}</h4>
            <p className="text-white/70 text-lg leading-relaxed font-medium">{chap.content}</p>
          </div>
        ))}
      </div>
      
      <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-[2.5rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 shimmer opacity-10"></div>
        <h4 className="font-900 text-white text-xl mb-6 uppercase italic tracking-tighter">FLASH CONCEPTS ⚡</h4>
        <div className="flex flex-wrap gap-3">
          {data.keyConcepts?.map((concept, idx) => (
            <span key={idx} className="bg-white/10 backdrop-blur-3xl px-5 py-2.5 rounded-2xl text-[10px] font-black text-white border border-white/10 uppercase tracking-widest hover:neon-border-pink transition-all cursor-default">
              {concept}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCheatSheet = (data: CheatSheetData) => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="glass-card rounded-[2.5rem] p-8 border-white/20 bg-white/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/20 blur-2xl rounded-full -mr-12 -mt-12"></div>
        <h3 className="text-2xl font-900 text-green-400 mb-6 italic tracking-tighter uppercase">LEERBRIEFJE 📄</h3>
        <div className="grid grid-cols-1 gap-6">
          {data.sections?.map((section, idx) => (
            <div key={idx} className="border-l-4 border-green-500/30 pl-4 py-1">
              <h4 className="font-900 text-white text-sm uppercase tracking-widest mb-3">{section.label}</h4>
              <ul className="space-y-2">
                {section.items?.map((item, i) => (
                  <li key={i} className="text-white/70 text-sm flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {(data.formulas && data.formulas.length > 0) && (
        <div className="glass-card rounded-[2.5rem] p-8 border-white/20 bg-blue-600/10">
          <h4 className="font-900 text-blue-400 text-sm uppercase tracking-widest mb-4 italic">FORMULES & REGELS 📏</h4>
          <div className="space-y-3">
            {data.formulas.map((formula, idx) => (
              <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/10 text-center font-mono text-white text-lg">
                {formula}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderQuizQuestion = (q: QuizQuestion) => {
    switch (q.type) {
      case 'MCQ':
      case 'TRUE_FALSE':
        return (
          <div className="space-y-4">
            {q.options?.map((opt, idx) => (
              <button 
                key={idx}
                disabled={showExplanation}
                onClick={() => {
                  setSelectedMCQ(opt);
                  setShowExplanation(true);
                }}
                className={`w-full text-left p-6 rounded-[1.8rem] border-2 transition-all duration-300 font-900 text-lg italic ${
                  showExplanation 
                    ? opt === q.answer ? 'bg-green-500 border-green-400 text-white shadow-[0_0_30px_rgba(34,197,94,0.4)]' : opt === selectedMCQ ? 'bg-red-500 border-red-400 text-white' : 'bg-white/5 border-white/5 text-white/30'
                    : 'bg-white/5 border-white/10 text-white hover:border-blue-500 hover:bg-white/10 active:scale-[0.98]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        );
      case 'INVUL':
        const parts = q.question.split('[?]');
        return (
          <div className="space-y-6">
             <div className="text-2xl font-900 text-white leading-tight text-center italic">
               {parts[0]} <span className="text-blue-400 underline decoration-8 decoration-blue-500/40 underline-offset-8 px-2">{userInput || '...'}</span> {parts[1]}
             </div>
             <input 
               type="text"
               disabled={showExplanation}
               className="w-full p-8 bg-white/5 border-2 border-white/10 rounded-[2rem] focus:border-blue-500 outline-none font-900 text-center text-2xl text-white placeholder:text-white/20 transition-all shadow-inner"
               placeholder="Vul in..."
               value={userInput}
               onChange={(e) => setUserInput(e.target.value)}
             />
             {!showExplanation && (
               <button onClick={() => setShowExplanation(true)} className="w-full btn-neon text-white py-6 rounded-[1.5rem] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all">CHECK IT! 🔥</button>
             )}
          </div>
        );
      case 'OPEN':
        return (
          <div className="space-y-6">
            <textarea 
              className="w-full p-8 bg-white/5 border-2 border-white/10 rounded-[2.5rem] outline-none font-bold text-lg text-white placeholder:text-white/20 focus:border-purple-500 transition-all shadow-inner"
              placeholder="Typ hier je antwoord..."
              rows={4}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={showExplanation}
            />
            {!showExplanation && (
              <button onClick={() => setShowExplanation(true)} className="w-full btn-neon text-white py-6 rounded-[1.5rem] font-black uppercase tracking-widest shadow-2xl">REVEAL TRUTH 🔮</button>
            )}
          </div>
        );
      default:
        return <p className="text-white/40 italic">Huh? Dit type vraag ken ik niet... 🤔</p>;
    }
  };

  const renderQuiz = (data: QuizData) => {
    const questions = data.questions || [];
    const q = questions[currentQuestionIndex];
    if (!q) return <div className="p-12 text-center text-white font-black italic">Geen vragen gevonden.</div>;

    const handleNext = (awardedPoints: number = 0) => {
      setUserScore(prev => prev + awardedPoints);
      setShowExplanation(false);
      setUserInput('');
      setSelectedMCQ(null);
      
      if (currentQuestionIndex < (questions.length || 0) - 1) {
        setCurrentQuestionIndex(i => i + 1);
      } else {
        setQuizFinished(true);
      }
    };

    if (quizFinished) {
      return (
        <div className="text-center glass-card rounded-[3.5rem] p-12 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <div className="text-8xl mb-8 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] animate-bounce">🏆</div>
          <h3 className="text-4xl font-900 text-white mb-2 leading-none italic tracking-tighter">STUDY BOSS!</h3>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-10">Missie Voltooid</p>
          <div className="flex items-center justify-center space-x-4 mb-12">
            <div className="text-9xl font-900 text-blue-400 italic tracking-tighter leading-none">{userScore}</div>
            <div className="text-white/20 font-black text-3xl">/ {questions.length}</div>
          </div>
          <button onClick={() => navigate(`/results/${result.id}`)} className="w-full btn-neon text-white py-7 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">Naar Menu 🏠</button>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-in slide-in-from-right-20 duration-500">
        <div className="flex justify-between items-end px-4">
           <div>
             <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">VRAAG {currentQuestionIndex + 1} / {questions.length}</span>
             {isExamMode && (
               <div className="text-sm font-black text-white bg-red-600 px-3 py-1 rounded-full mt-2 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                 ⏱️ {Math.floor(timeLeft! / 60)}:{(timeLeft! % 60).toString().padStart(2, '0')}
               </div>
             )}
           </div>
           <div className="w-40 h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
             <div className="bg-gradient-to-r from-blue-400 to-indigo-600 h-full rounded-full transition-all duration-700" style={{ width: `${((currentQuestionIndex + 1) / (questions.length || 1)) * 100}%` }}></div>
           </div>
        </div>

        <div className="glass-card rounded-[3rem] p-12 border-white/10 shadow-2xl relative overflow-hidden min-h-[400px]">
          <div className="absolute top-0 right-0 bg-white/5 px-8 py-3 rounded-bl-[2rem] text-[10px] font-black text-blue-400 uppercase tracking-widest italic">{q.type} MODE</div>
          <h3 className="text-2xl font-900 text-white mb-12 leading-tight tracking-tight italic">{q.question}</h3>
          
          {renderQuizQuestion(q)}

          {showExplanation && (
            <div className="mt-12 p-10 bg-white/5 rounded-[2.8rem] border border-white/10 animate-in slide-in-from-bottom-12 duration-500 shadow-inner">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6 text-center">HET ANTWOORD:</p>
              <div className="bg-white/5 p-6 rounded-2xl mb-8 text-center border border-white/5">
                <p className="font-900 text-white text-2xl italic neon-text-blue">{q.answer}</p>
              </div>
              <p className="text-white/60 text-lg italic mb-10 font-medium text-center px-4 leading-relaxed">{q.explanation}</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => handleNext(1)} className="bg-green-500 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Lekker! ✅</button>
                <button onClick={() => handleNext(0)} className="bg-red-500 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Oops... ❌</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTips = (data: TipsData) => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-600">
      <section>
        <h3 className="text-2xl font-900 text-white italic mb-6 px-4 tracking-tighter">EZ MODE 💡</h3>
        <div className="grid grid-cols-1 gap-5">
          {data.mnemonics?.map((m, idx) => (
            <div key={idx} className="glass-card p-8 rounded-[2.2rem] border-white/10 relative group hover:neon-border-blue transition-all">
              <div className="absolute top-0 right-0 p-5 opacity-5 text-6xl group-hover:rotate-12 transition-transform">🧠</div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 italic">{m.concept}</p>
              <p className="font-900 text-white text-xl italic leading-snug">{m.trick}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-blue-600 to-purple-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 shimmer opacity-10"></div>
        <h3 className="text-3xl font-900 text-white italic mb-8 tracking-tighter uppercase leading-none">THE STRAT ⚡</h3>
        <div className="space-y-6">
          {data.strategies?.map((s, idx) => <p key={idx} className="text-white font-bold text-lg italic flex items-start"><span className="text-blue-300 mr-4">✦</span> {s}</p>)}
        </div>
        <div className="mt-12 pt-8 border-t border-white/10">
          <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-[0.3em] mb-6 italic">TIME ATTACK ⏱️</h4>
          {data.timeManagement?.map((t, idx) => <p key={idx} className="text-white/60 text-xs mb-3 italic font-black uppercase tracking-widest">{t}</p>)}
        </div>
      </section>

      <section className="bg-red-500/10 border border-red-500/20 p-10 rounded-[3rem] backdrop-blur-3xl">
        <h3 className="text-2xl font-900 text-red-500 italic mb-6 tracking-tighter uppercase">MAJOR L'S (VALKUILEN) ⚠️</h3>
        {data.pitfalls?.map((p, idx) => <p key={idx} className="text-sm font-black text-white/80 mb-4 italic leading-relaxed">💀 {p}</p>)}
      </section>
    </div>
  );

  return (
    <div className="pt-6 pb-28">
      <div className="flex items-center mb-12 px-4">
        <button onClick={() => navigate(`/results/${result.id}`)} className="mr-6 bg-white/5 backdrop-blur-3xl p-5 rounded-[2rem] border border-white/10 text-white shadow-2xl active:scale-95 transition-all">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-3xl font-900 text-white leading-none truncate tracking-tighter italic neon-text-blue uppercase">{result.subject}</h2>
          <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] mt-3">MODE: {displayFeature}</p>
        </div>
      </div>

      <div className="relative px-2">
        {displayFeature === StudyFeature.SUMMARY && renderSummary(result.content as SummaryData)}
        {displayFeature === StudyFeature.QUIZ && renderQuiz(result.content as QuizData)}
        {displayFeature === StudyFeature.TIPS && renderTips(result.content as TipsData)}
        {displayFeature === StudyFeature.CHEAT_SHEET && renderCheatSheet(result.content as CheatSheetData)}
      </div>
    </div>
  );
};

export default FeatureDetail;
