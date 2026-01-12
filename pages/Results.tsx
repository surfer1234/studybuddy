
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StudyResult, StudyFeature, QuizDifficulty } from '../types';

interface ResultsProps {
  results: StudyResult[];
  onUpdate?: (id: string, updates: Partial<StudyResult>) => void;
}

const Results: React.FC<ResultsProps> = ({ results, onUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentResult = results.find(r => r.id === id);

  const [quizConfig, setQuizConfig] = useState({
    difficulty: 'GEMIDDELD' as QuizDifficulty,
    count: 10,
    mode: 'practice' as 'practice' | 'exam'
  });
  const [showQuizModal, setShowQuizModal] = useState(false);

  if (!currentResult) return <div className="p-8 text-center text-white">Laden...</div>;

  const isFeatureReady = (feature: StudyFeature) => currentResult.generatedFeatures?.includes(feature);

  const startCustomQuiz = () => {
    navigate(`/processing?feature=${StudyFeature.QUIZ}&id=${currentResult.id}&difficulty=${quizConfig.difficulty}&count=${quizConfig.count}&mode=${quizConfig.mode}`);
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="glass-card rounded-[2rem] p-6 border-white/20">
        <h2 className="text-2xl font-900 text-gray-800 leading-tight truncate italic mb-4">{currentResult.subject}</h2>
        <div className="space-y-4 pt-2">
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Wanneer is de Toets?</label>
          <input 
            type="date" 
            value={currentResult.testDate || ''}
            onChange={(e) => onUpdate?.(currentResult.id, { testDate: e.target.value })}
            className="w-full p-4 bg-white/40 border border-white/20 rounded-2xl font-bold text-gray-800 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { feature: StudyFeature.SUMMARY, title: 'Samenvatting', icon: '📝' },
          { feature: StudyFeature.QUIZ, title: 'Overhoring', icon: '❓' },
          { feature: StudyFeature.CHEAT_SHEET, title: 'Leerbriefje', icon: '📄' },
          { feature: StudyFeature.TIPS, title: 'Tips & Tricks', icon: '💡' },
        ].map((item) => (
          <button 
            key={item.feature}
            onClick={() => {
              if (item.feature === StudyFeature.QUIZ && !isFeatureReady(item.feature)) {
                setShowQuizModal(true);
              } else if (isFeatureReady(item.feature)) {
                navigate(`/detail/${currentResult.id}?feature=${item.feature}`);
              } else {
                navigate(`/processing?feature=${item.feature}&id=${currentResult.id}`);
              }
            }}
            className="flex items-center p-5 glass-card rounded-[1.8rem] border-white/20 transition-all active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mr-4 bg-white/20 border border-white/30">{item.icon}</div>
            <div className="text-left flex-1 min-w-0">
              <h4 className="font-900 text-gray-800 leading-none">{item.title}</h4>
              <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-tighter">
                {isFeatureReady(item.feature) ? 'Bekijk Resultaat' : 'Genereer Nu'}
              </p>
            </div>
            {isFeatureReady(item.feature) ? <div className="bg-green-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase shadow-lg">READY</div> : <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">+</div>}
          </button>
        ))}
      </div>

      {showQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowQuizModal(false)}></div>
          <div className="glass-card w-full max-w-sm rounded-[3rem] p-8 border-white/20 relative z-10">
            <h4 className="text-2xl font-900 text-gray-800 mb-8 italic text-center">Quiz Setup ❓</h4>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-3">Moeilijkheid</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['BASIS', 'GEMIDDELD', 'GEVORDERD'] as QuizDifficulty[]).map(d => (
                    <button key={d} onClick={() => setQuizConfig(c => ({ ...c, difficulty: d }))} className={`py-3 rounded-xl text-[9px] font-black border-2 transition-all ${quizConfig.difficulty === d ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400'}`}>{d}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-3">Vragen: {quizConfig.count}</label>
                <input type="range" min="5" max="50" step="5" value={quizConfig.count} onChange={(e) => setQuizConfig(c => ({ ...c, count: parseInt(e.target.value) }))} className="w-full accent-blue-600" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-3">Modus</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setQuizConfig(c => ({ ...c, mode: 'practice' }))} className={`py-3 rounded-xl text-[9px] font-black border-2 transition-all ${quizConfig.mode === 'practice' ? 'bg-green-500 border-green-400 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400'}`}>OEFENEN</button>
                  <button onClick={() => setQuizConfig(c => ({ ...c, mode: 'exam' }))} className={`py-3 rounded-xl text-[9px] font-black border-2 transition-all ${quizConfig.mode === 'exam' ? 'bg-red-500 border-red-400 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400'}`}>EXAMEN</button>
                </div>
              </div>
              <button onClick={startCustomQuiz} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Start Overhoring! 🚀</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
