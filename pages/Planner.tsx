
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudyResult } from '../types.ts';

interface PlannerProps {
  results: StudyResult[];
  onUpdate?: (id: string, updates: Partial<StudyResult>) => void;
}

export const Planner: React.FC<PlannerProps> = ({ results, onUpdate }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleSetDate = (id: string, date: string) => {
    if (onUpdate) {
      onUpdate(id, { testDate: date });
    }
  };

  const upcomingTests = results
    .filter(r => r.testDate)
    .sort((a, b) => new Date(a.testDate!).getTime() - new Date(b.testDate!).getTime());

  return (
    <div className="space-y-8 pt-6 pb-20 animate-in fade-in slide-in-from-bottom-6">
      <header className="px-2">
        <h2 className="text-4xl font-900 text-white tracking-tighter italic neon-text-blue">Study Planner 📅</h2>
        <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Stippel je route naar 10'en uit.</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-6 rounded-[2rem] border-white/5">
          <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Toetsen</p>
          <p className="text-4xl font-900 text-white italic">{upcomingTests.length}</p>
        </div>
        <div className="glass-card p-6 rounded-[2rem] border-white/5">
          <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Voltooid</p>
          <p className="text-4xl font-900 text-green-400 italic">80%</p>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-xl font-900 text-white italic px-2">Komende Deadlines ⚡</h3>
        {upcomingTests.length > 0 ? (
          <div className="space-y-3">
            {upcomingTests.map(test => (
              <div key={test.id} className="glass-card p-6 rounded-[2rem] flex items-center justify-between border-blue-500/20 bg-blue-500/5">
                <div>
                  <h4 className="font-900 text-white text-lg italic uppercase">{test.subject}</h4>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                    {new Date(test.testDate!).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' })}
                  </p>
                </div>
                <button 
                  onClick={() => navigate(`/results/${test.id}`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
                >
                  Grind
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-10 rounded-[2.5rem] text-center border-dashed border-white/10">
            <p className="text-white/40 font-black italic text-sm">Geen toetsen gepland. Lekker rustig!</p>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-900 text-white italic px-2">Plan een Scan 📝</h3>
        <div className="space-y-3">
          {results.filter(r => !r.testDate).map(res => (
            <div key={res.id} className="glass-card p-6 rounded-[2rem] border-white/5">
               <div className="flex justify-between items-start mb-4">
                  <h4 className="font-900 text-white italic">{res.subject}</h4>
                  <span className="text-[8px] font-black text-white/30 uppercase">Zonder Datum</span>
               </div>
               <div className="flex space-x-2">
                  <input 
                    type="date" 
                    onChange={(e) => handleSetDate(res.id, e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none focus:border-blue-500 transition-colors"
                  />
                  <button className="bg-white/10 p-2 rounded-xl text-white">📅</button>
               </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
