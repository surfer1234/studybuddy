
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StudyResult, StudyFeature, QuizDifficulty } from '../types.ts';

interface ResultsProps {
  results: StudyResult[];
  onUpdate?: (id: string, updates: Partial<StudyResult>) => void;
}

const Results: React.FC<ResultsProps> = ({ results, onUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const result = results.find(r => r.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(result?.subject || '');

  if (!result) return <div className="p-12 text-center text-white font-black italic">404: Brain Cell Missing.</div>;

  const handleTitleSave = () => {
    if (onUpdate && id) {
      onUpdate(id, { subject: newTitle });
      setIsEditing(false);
    }
  };

  const startFeature = (feature: StudyFeature, options: any = {}) => {
    const params = new URLSearchParams({ 
      feature, 
      id: result.id,
      ...options 
    });
    navigate(`/processing?${params.toString()}`);
  };

  return (
    <div className="space-y-8 pt-6 pb-20 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <section className="px-2">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            {isEditing ? (
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-white/10 border border-blue-500/50 rounded-xl px-4 py-2 text-white font-900 italic outline-none flex-1"
                />
                <button onClick={handleTitleSave} className="bg-blue-600 p-2 rounded-xl text-white">✅</button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <h2 className="text-4xl font-900 text-white tracking-tighter italic neon-text-blue uppercase truncate">{result.subject}</h2>
                <button onClick={() => setIsEditing(true)} className="text-white/20 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth={2.5}/></svg>
                </button>
              </div>
            )}
            <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Geanalyseerd op {new Date(result.date).toLocaleDateString('nl-NL')}</p>
          </div>
        </div>

        {/* Scan Preview */}
        <div className="flex space-x-3 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
          {result.images.map((img, idx) => (
            <div key={idx} className="relative shrink-0 w-24 h-32 rounded-2xl overflow-hidden border-2 border-white/10 shadow-xl group hover:border-blue-500 transition-colors">
              <img src={img} className="w-full h-full object-cover" alt="Scan" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <span className="absolute bottom-2 left-2 text-[8px] font-black text-white uppercase">Blad {idx + 1}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Main Actions */}
      <section className="grid grid-cols-1 gap-5">
        <button 
          onClick={() => navigate(`/detail/${result.id}?feature=${StudyFeature.SUMMARY}`)}
          className="glass-card p-8 rounded-[2.5rem] border-white/10 flex items-center space-x-6 active:scale-95 transition-all group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-4xl shadow-lg group-hover:rotate-6 transition-transform">📝</div>
          <div className="text-left">
            <h4 className="font-900 text-white text-xl italic leading-none">SAMENVATTING</h4>
            <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mt-2">De kern in turbo-modus</p>
          </div>
        </button>

        <div className="glass-card rounded-[2.5rem] border-white/10 p-1">
          <div className="p-7">
             <div className="flex items-center space-x-6 mb-8">
               <div className="w-16 h-16 bg-purple-600 text-white rounded-2xl flex items-center justify-center text-4xl shadow-lg">❓</div>
               <div className="text-left">
                 <h4 className="font-900 text-white text-xl italic leading-none">OVERHORING</h4>
                 <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mt-2">Check je brain power</p>
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-3">
               <button 
                 onClick={() => navigate(`/detail/${result.id}?feature=${StudyFeature.QUIZ}`)}
                 className="bg-white/5 hover:bg-white/10 border border-white/10 py-5 rounded-2xl flex flex-col items-center transition-all group"
               >
                 <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🧠</span>
                 <span className="text-[9px] font-black text-white uppercase tracking-tighter">Oefenen</span>
               </button>
               <button 
                 onClick={() => navigate(`/detail/${result.id}?feature=${StudyFeature.QUIZ}&mode=exam`)}
                 className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 py-5 rounded-2xl flex flex-col items-center transition-all group"
               >
                 <span className="text-2xl mb-1 group-hover:animate-pulse">⏱️</span>
                 <span className="text-[9px] font-black text-red-400 uppercase tracking-tighter">Examen Mode</span>
               </button>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
           <button 
             onClick={() => {
               if (result.generatedFeatures?.includes(StudyFeature.CHEAT_SHEET)) {
                 navigate(`/detail/${result.id}?feature=${StudyFeature.CHEAT_SHEET}`);
               } else {
                 startFeature(StudyFeature.CHEAT_SHEET);
               }
             }}
             className="glass-card p-6 rounded-[2.2rem] border-white/10 flex flex-col items-center text-center group active:scale-95 transition-all"
           >
             <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📄</div>
             <h4 className="font-900 text-white text-xs italic tracking-tighter">LEERBRIEFJE</h4>
           </button>
           <button 
             onClick={() => {
               if (result.generatedFeatures?.includes(StudyFeature.TIPS)) {
                 navigate(`/detail/${result.id}?feature=${StudyFeature.TIPS}`);
               } else {
                 startFeature(StudyFeature.TIPS);
               }
             }}
             className="glass-card p-6 rounded-[2.2rem] border-white/10 flex flex-col items-center text-center group active:scale-95 transition-all"
           >
             <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">💡</div>
             <h4 className="font-900 text-white text-xs italic tracking-tighter">STUDIETIPS</h4>
           </button>
        </div>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
           <div className="text-3xl">📅</div>
           <div>
             <p className="text-white font-black italic text-sm">Toetsdatum</p>
             <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">{result.testDate ? new Date(result.testDate).toLocaleDateString('nl-NL') : 'Nog niet gepland'}</p>
           </div>
        </div>
        <button 
          onClick={() => navigate('/planner')}
          className="text-blue-400 text-[10px] font-black uppercase tracking-widest border-b-2 border-blue-400/30"
        >
          {result.testDate ? 'Aanpassen' : 'Plan Nu'}
        </button>
      </section>
    </div>
  );
};

export default Results;
