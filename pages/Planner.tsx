
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudyResult } from '../types';

interface PlannerProps {
  results: StudyResult[];
  onUpdate?: (id: string, updates: Partial<StudyResult>) => void;
}

const Planner: React.FC<PlannerProps> = ({ results, onUpdate }) => {
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);

  const plannedTests = results
    .filter(r => r.testDate)
    .sort((a, b) => new Date(a.testDate!).getTime() - new Date(b.testDate!).getTime());

  const subjectsWithoutDate = results.filter(r => !r.testDate);

  const getDaysLeft = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getProgressColor = (days: number) => {
    if (days <= 2) return 'bg-red-500';
    if (days <= 5) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-8 pt-4 pb-12 animate-in fade-in duration-500">
      <div className="px-2">
        <h2 className="text-3xl font-900 text-white tracking-tight italic">Toets Planner 📅</h2>
        <p className="text-blue-200/60 font-medium">Overzicht = Rust in je hoofd.</p>
      </div>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em] px-2">Aankomende Toetsen</h3>
        {plannedTests.length === 0 ? (
          <div className="glass-card rounded-[2.5rem] p-10 text-center border-white/10">
            <p className="text-white/40 text-sm italic font-medium">Nog geen toetsen ingepland.</p>
          </div>
        ) : (
          plannedTests.map(test => {
            const daysLeft = getDaysLeft(test.testDate!);
            const isPassed = daysLeft < 0;

            return (
              <div 
                key={test.id}
                className="glass-card p-6 rounded-[2rem] border-white/20 relative overflow-hidden group"
              >
                <div className="flex justify-between items-start">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-lg font-900 text-gray-800 truncate pr-4">{test.subject}</h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                      {new Date(test.testDate!).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                  </div>
                  <button 
                    onClick={() => setEditingId(editingId === test.id ? null : test.id)}
                    className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                </div>

                {editingId === test.id && (
                  <div className="mt-4 p-4 bg-white/50 rounded-2xl animate-in slide-in-from-top-4 duration-300">
                    <input 
                      type="date"
                      className="w-full bg-white border border-gray-100 rounded-xl p-3 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      value={test.testDate || ''}
                      onChange={(e) => onUpdate?.(test.id, { testDate: e.target.value })}
                    />
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${isPassed ? 'bg-gray-400' : getProgressColor(daysLeft)}`}></div>
                    <span className="text-xs font-black text-gray-500 uppercase">
                      {isPassed ? 'Geweest' : daysLeft === 0 ? 'VANDAAG 🔥' : `${daysLeft} dagen te gaan`}
                    </span>
                  </div>
                  <button 
                    onClick={() => navigate(`/results/${test.id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    Oefen Nu
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>

      {subjectsWithoutDate.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em] px-2">Nog in te plannen</h3>
          <div className="grid grid-cols-1 gap-3">
            {subjectsWithoutDate.map(subj => (
              <div key={subj.id} className="glass-card p-5 rounded-[1.5rem] border-white/20 flex items-center justify-between">
                <span className="text-sm font-800 text-gray-700 truncate max-w-[160px]">{subj.subject}</span>
                <input 
                  type="date"
                  className="bg-white/50 border border-white/40 rounded-lg px-2 py-1 text-[10px] font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => onUpdate?.(subj.id, { testDate: e.target.value })}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Planner;
