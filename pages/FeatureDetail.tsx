
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { StudyResult, StudyFeature, SummaryData, QuizData, TipsData, CheatSheetData, QuizQuestion } from '../types.ts';

interface FeatureDetailProps {
  results: StudyResult[];
}

export const FeatureDetail: React.FC<FeatureDetailProps> = ({ results }) => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const feature = searchParams.get('feature') as StudyFeature;
  const result = results.find(r => r.id === id);

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  if (!result || !result.content) {
    return <div className="p-12 text-center text-white font-black italic">404: Brain Cell Missing.</div>;
  }

  const content = result.content;

  const renderSummary = (data: SummaryData) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="glass-card p-8 rounded-[2.5rem] border-blue-500/20">
        <h3 className="text-3xl font-900 text-white italic mb-6 neon-text-blue">{data.title}</h3>
        <div className="space-y-8">
          {data.chapters.map((chapter, idx) => (
            <div key={idx} className="border-l-4 border-blue-500/30 pl-6 py-2">
              <h4 className="font-900 text-blue-400 text-lg uppercase tracking-tighter mb-2 italic">{chapter.title}</h4>
              <p className="text-white/80 leading-relaxed text-sm">{chapter.content}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-card p-8 rounded-[2.5rem] bg-indigo-900/20">
        <h4 className="font-900 text-white text-xl italic mb-4">SLEUTELBEGRIPPEN 🔑</h4>
        <div className="flex flex-wrap gap-2">
          {data.keyConcepts.map((concept, idx) => (
            <span key={idx} className="bg-blue-600/30 text-blue-100 px-4 py-2 rounded-full text-xs font-black border border-blue-400/20 italic">
              {concept}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderQuiz = (data: QuizData) => {
    const currentQuestion = data.questions[currentQuestionIndex];
    
    const handleAnswer = (answer: string) => {
      setAnswers({ ...answers, [currentQuestion.id]: answer });
      if (currentQuestionIndex < data.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Calculate score
        let correct = 0;
        data.questions.forEach(q => {
          if (answers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase().trim()) {
            correct++;
          }
        });
        setScore(correct);
        setShowResults(true);
      }
    };

    if (showResults) {
      return (
        <div className="text-center py-10 space-y-8 animate-in zoom-in-95 duration-500">
          <div className="relative inline-block">
            <div className="text-9xl mb-4 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">🏆</div>
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>
          </div>
          <h3 className="text-5xl font-900 text-white italic tracking-tighter">BRAIN POWER: {Math.round((score / data.questions.length) * 100)}%</h3>
          <p className="text-blue-400 font-black uppercase tracking-widest text-sm">Je hebt {score} van de {data.questions.length} vragen gekilled.</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full btn-neon py-5 rounded-3xl text-white font-900 italic uppercase tracking-widest shadow-2xl"
          >
            Terug naar Home 🏠
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <span className="text-blue-400 font-black text-xs uppercase tracking-widest">VRAAG {currentQuestionIndex + 1} / {data.questions.length}</span>
          <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / data.questions.length) * 100}%` }}></div>
          </div>
        </div>
        <div className="glass-card p-10 rounded-[3rem] border-white/10 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-3xl -mr-10 -mt-10"></div>
           <h3 className="text-2xl font-900 text-white italic leading-tight mb-8">{currentQuestion.question}</h3>
           
           <div className="space-y-4">
             {currentQuestion.options ? (
               currentQuestion.options.map((opt, i) => (
                 <button 
                   key={i}
                   onClick={() => handleAnswer(opt)}
                   className="w-full text-left p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all font-bold text-white/90 active:scale-95"
                 >
                   {opt}
                 </button>
               ))
             ) : (
               <div className="space-y-4">
                 <input 
                   type="text" 
                   placeholder="Type je antwoord hier..." 
                   className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-white outline-none focus:border-blue-500"
                   onKeyDown={(e) => {
                     if (e.key === 'Enter') handleAnswer((e.target as HTMLInputElement).value);
                   }}
                 />
                 <p className="text-[10px] text-white/40 font-black uppercase text-center">DRUK OP ENTER OM TE VERSTUREN</p>
               </div>
             )}
           </div>
        </div>
      </div>
    );
  };

  const renderTips = (data: TipsData) => (
    <div className="space-y-6 animate-in fade-in">
       <div className="glass-card p-8 rounded-[2.5rem]">
          <h3 className="text-3xl font-900 text-white italic mb-6 neon-text-blue">{data.title}</h3>
          <div className="space-y-8">
             <section>
                <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Geheugensteuntjes 🧠</h4>
                <div className="grid gap-3">
                   {data.mnemonics.map((m, i) => (
                      <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10">
                         <p className="font-black text-white italic">{m.concept}</p>
                         <p className="text-blue-300 text-xs mt-1">{m.trick}</p>
                      </div>
                   ))}
                </div>
             </section>
             <section>
                <h4 className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] mb-4">Examen Tips ⏱️</h4>
                <ul className="space-y-2">
                   {data.examTips.map((tip, i) => (
                      <li key={i} className="text-sm text-white/80 flex items-start space-x-2">
                         <span className="text-purple-400">⚡</span>
                         <span>{tip}</span>
                      </li>
                   ))}
                </ul>
             </section>
          </div>
       </div>
    </div>
  );

  const renderCheatSheet = (data: CheatSheetData) => (
    <div className="space-y-6 animate-in fade-in">
       <div className="glass-card p-8 rounded-[2.5rem] border-pink-500/20 shadow-[0_0_30px_rgba(236,72,153,0.1)]">
          <h3 className="text-3xl font-900 text-white italic mb-6 text-pink-400">{data.title}</h3>
          <div className="grid grid-cols-1 gap-6">
             {data.sections.map((section, i) => (
                <div key={i} className="space-y-3">
                   <h4 className="text-[10px] font-black text-pink-500 uppercase tracking-widest">{section.label}</h4>
                   <div className="flex flex-wrap gap-2">
                      {section.items.map((item, j) => (
                         <span key={j} className="bg-pink-500/10 text-pink-100 px-3 py-1 rounded-lg text-xs font-bold border border-pink-500/20 italic">
                            {item}
                         </span>
                      ))}
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );

  return (
    <div className="pt-4 pb-20 max-w-md mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-3 bg-white/5 rounded-2xl text-white hover:bg-white/10">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <h2 className="text-xl font-900 text-white uppercase italic tracking-tighter">Study Mode ⚡</h2>
      </div>

      {feature === StudyFeature.SUMMARY && renderSummary(content)}
      {feature === StudyFeature.QUIZ && renderQuiz(content)}
      {feature === StudyFeature.TIPS && renderTips(content)}
      {feature === StudyFeature.CHEAT_SHEET && renderCheatSheet(content)}

      <div className="mt-12 text-center text-[10px] text-white/20 font-black uppercase tracking-widest">
        Gegenereerd door StudyBuddy AI • {result.subject}
      </div>
    </div>
  );
};
