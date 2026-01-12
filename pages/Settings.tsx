
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserSettings } from '../types.ts';

interface SettingsProps {
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
  onResetData: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onUpdate, onResetData }) => {
  const navigate = useNavigate();

  const levels = ['Groep 7/8', 'VMBO', 'HAVO', 'VWO', 'MBO', 'HBO', 'WO'];
  const grades = ['1', '2', '3', '4', '5', '6'];

  const handleReset = () => {
    if (confirm('Weet je het zeker? AL je scans en brain gains worden gewist! 🧠🗑️')) {
      onResetData();
      navigate('/');
    }
  };

  return (
    <div className="space-y-8 pt-6 pb-20 animate-in fade-in">
      <header className="px-2 flex items-center space-x-4">
         <button onClick={() => navigate(-1)} className="p-3 bg-white/5 rounded-2xl text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>
         </button>
         <h2 className="text-3xl font-900 text-white tracking-tighter italic">Settings ⚙️</h2>
      </header>

      <div className="glass-card p-8 rounded-[2.5rem] border-white/10 text-center">
         <div className="relative inline-block mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-blue-500/30 p-1 bg-white/5">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${settings.avatarSeed}`} alt="Avatar" className="w-full h-full rounded-full" />
            </div>
            <button 
              onClick={() => onUpdate({ ...settings, avatarSeed: Math.random().toString() })}
              className="absolute bottom-0 right-0 bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#020617] text-white text-xs"
            >
              🔄
            </button>
         </div>
         <input 
            type="text" 
            value={settings.name}
            onChange={(e) => onUpdate({ ...settings, name: e.target.value })}
            className="w-full bg-transparent text-center text-2xl font-900 text-white italic outline-none mb-2"
            placeholder="Je Naam..."
         />
         <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Studie Legend</p>
      </div>

      <section className="glass-card p-8 rounded-[2.5rem] border-white/10 space-y-6">
         <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest px-2">Schoolniveau</label>
            <div className="flex flex-wrap gap-2">
               {levels.map(l => (
                  <button 
                    key={l}
                    onClick={() => onUpdate({ ...settings, level: l })}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${settings.level === l ? 'bg-blue-600 text-white border-blue-500' : 'bg-white/5 text-white/50 border border-white/10'}`}
                  >
                     {l}
                  </button>
               ))}
            </div>
         </div>

         <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest px-2">Leerjaar</label>
            <div className="flex gap-2">
               {grades.map(g => (
                  <button 
                    key={g}
                    onClick={() => onUpdate({ ...settings, grade: g })}
                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${settings.grade === g ? 'bg-purple-600 text-white border-purple-500' : 'bg-white/5 text-white/50 border border-white/10'}`}
                  >
                     {g}
                  </button>
               ))}
            </div>
         </div>
      </section>

      <section className="glass-card p-6 rounded-[2.2rem] border-red-500/10 space-y-4">
         <h3 className="font-900 text-white text-sm uppercase italic px-2">Gevaarlijke Zone ⚠️</h3>
         <button 
            onClick={handleReset}
            className="w-full py-4 bg-red-600/10 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest border border-red-500/20 hover:bg-red-600/20 transition-all"
         >
            Wis AL je Geheugen
         </button>
      </section>
      
      <p className="text-center text-[8px] font-black text-white/10 uppercase tracking-[0.4em]">StudyBuddy v1.0.4 • Powered by AI</p>
    </div>
  );
};
