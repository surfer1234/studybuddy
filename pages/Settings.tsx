import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserSettings } from '../types.ts';

interface SettingsProps {
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
  onResetData: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdate, onResetData }) => {
  const navigate = useNavigate();

  const levels = [
    'Basisschool', 'VMBO', 'HAVO', 'VWO', 'MBO', 'HBO', 'Universiteit'
  ];

  const personalities: {id: 'HYPED' | 'CHILL' | 'PRO', icon: string, label: string}[] = [
    { id: 'HYPED', icon: '🔥', label: 'Hyped' },
    { id: 'CHILL', icon: '🌊', label: 'Chill' },
    { id: 'PRO', icon: '🎓', label: 'Pro' }
  ];

  const handleLevelChange = (level: string) => {
    onUpdate({ ...settings, level });
  };

  const handleToggle = (key: keyof UserSettings) => {
    onUpdate({ ...settings, [key]: !settings[key] });
  };

  const randomizeAvatar = () => {
    const seeds = ['Felix', 'Luna', 'Oscar', 'Milo', 'Zoe', 'Leo', 'Mia'];
    const newSeed = seeds[Math.floor(Math.random() * seeds.length)] + Math.floor(Math.random() * 1000);
    onUpdate({ ...settings, avatarSeed: newSeed });
  };

  return (
    <div className="space-y-8 pt-6 pb-32">
      <header className="flex items-center space-x-4 px-2">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-4xl font-900 text-white italic tracking-tighter uppercase">Instellingen ⚙️</h2>
      </header>

      <section className="glass-card p-8 rounded-[2.5rem] border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[50px] -mr-16 -mt-16"></div>
        <div className="flex flex-col items-center space-y-6 relative z-10">
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-blue-500/50 p-1 bg-white/5">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${settings.avatarSeed}`} 
                alt="Avatar" 
                className="w-full h-full rounded-full bg-blue-500/10" 
              />
            </div>
            <button 
              onClick={randomizeAvatar}
              className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-[#020617] active:scale-90 transition-transform"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <div className="w-full space-y-2">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest text-center">Jouw Naam</p>
            <input 
              type="text" 
              value={settings.name} 
              onChange={(e) => onUpdate({...settings, name: e.target.value})}
              placeholder="Hoe noemen we je?"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-900 text-white italic text-center outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] px-4">Onderwijs Niveau 🎓</h3>
        <div className="glass-card p-6 rounded-[2.5rem] border-white/10 space-y-6">
          <div className="flex flex-wrap gap-2">
            {levels.map(lvl => (
              <button
                key={lvl}
                onClick={() => handleLevelChange(lvl)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  settings.level === lvl 
                    ? 'bg-blue-600 text-white shadow-lg border-transparent' 
                    : 'bg-white/5 text-white/50 border border-white/10'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
          
          <div className="space-y-2">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Klas / Leerjaar</p>
            <div className="grid grid-cols-4 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8'].map(g => (
                <button
                  key={g}
                  onClick={() => onUpdate({...settings, grade: g})}
                  className={`py-3 rounded-xl font-900 transition-all ${
                    settings.grade === g 
                      ? 'bg-indigo-600 text-white shadow-lg border-transparent' 
                      : 'bg-white/5 text-white/40 border border-white/5'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] px-4">AI Persoonlijkheid 🤖</h3>
        <div className="grid grid-cols-3 gap-3">
          {personalities.map(p => (
            <button
              key={p.id}
              onClick={() => onUpdate({...settings, aiPersonality: p.id})}
              className={`glass-card p-4 rounded-3xl flex flex-col items-center space-y-2 border-white/10 transition-all ${
                settings.aiPersonality === p.id ? 'ring-2 ring-blue-500 bg-blue-500/10' : 'opacity-60'
              }`}
            >
              <span className="text-3xl">{p.icon}</span>
              <span className="text-[9px] font-black text-white uppercase tracking-widest">{p.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] px-4">Voorkeuren 🔔</h3>
        <div className="glass-card rounded-[2.5rem] border-white/10 overflow-hidden divide-y divide-white/5">
          <div className="p-6 flex justify-between items-center">
            <div>
              <p className="text-white font-900 italic">Push Meldingen</p>
              <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">Blijf op de hoogte</p>
            </div>
            <button 
              onClick={() => handleToggle('notifications')}
              className={`w-14 h-8 rounded-full transition-all relative ${settings.notifications ? 'bg-blue-600' : 'bg-white/10'}`}
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${settings.notifications ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
          <div className="p-6 flex justify-between items-center">
            <div>
              <p className="text-white font-900 italic">Streak Reminders</p>
              <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">Mis nooit een dag grind</p>
            </div>
            <button 
              onClick={() => handleToggle('streakReminders')}
              className={`w-14 h-8 rounded-full transition-all relative ${settings.streakReminders ? 'bg-indigo-600' : 'bg-white/10'}`}
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${settings.streakReminders ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
        </div>
      </section>

      <section className="pt-8">
        <button 
          onClick={() => {
            if(confirm('Weet je het zeker? Al je voortgang wordt gewist! 💀')) onResetData();
          }}
          className="w-full py-6 bg-red-600/10 border border-red-500/20 text-red-500 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-red-600 hover:text-white transition-all active:scale-95"
        >
          Reset Geheugen 🧠⚡
        </button>
      </section>
    </div>
  );
};

export default Settings;