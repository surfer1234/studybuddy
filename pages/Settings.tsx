
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

  const handleToggle = (key: keyof UserSettings) => {
    onUpdate({ ...settings, [key]: !settings[key] });
  };

  const handleChange = (key: keyof UserSettings, value: string) => {
    onUpdate({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-8 pt-6 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="px-2">
        <h2 className="text-4xl font-900 text-white tracking-tighter italic">Settings ⚙️</h2>
        <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mt-1">Stel je brain buddy in.</p>
      </div>

      {/* Profiel Sectie */}
      <section className="glass-card p-8 rounded-[2.5rem] border-white/10 space-y-6">
        <div className="flex items-center space-x-6">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full border-4 border-blue-500/30 p-1 overflow-hidden bg-white/5">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${settings.avatarSeed}`} 
                alt="Avatar" 
                className="w-full h-full rounded-full" 
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1 block">Naam</label>
            <input 
              type="text" 
              value={settings.name} 
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-bold italic outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1 block">Avatar Seed (Typ voor nieuw poppetje)</label>
          <input 
            type="text" 
            value={settings.avatarSeed} 
            onChange={(e) => handleChange('avatarSeed', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-bold outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
      </section>

      {/* School Sectie */}
      <section className="glass-card p-8 rounded-[2.5rem] border-white/10 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1 block">Niveau</label>
            <select 
              value={settings.level} 
              onChange={(e) => handleChange('level', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none appearance-none"
            >
              <option value="Lagere school">Lagere school</option>
              <option value="VMBO">VMBO</option>
              <option value="HAVO">HAVO</option>
              <option value="VWO">VWO</option>
              <option value="HBO">HBO</option>
              <option value="Universiteit">Uni</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1 block">Leerjaar</label>
            <select 
              value={settings.grade} 
              onChange={(e) => handleChange('grade', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none appearance-none"
            >
              <option value="Groep 7">Groep 7</option>
              <option value="Groep 8">Groep 8</option>
              {[1,2,3,4,5,6].map(n => (
                <option key={n} value={n.toString()}>{n}e jaar</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1 block">AI Personality</label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {(['HYPED', 'CHILL', 'PRO'] as const).map(p => (
              <button
                key={p}
                onClick={() => handleChange('aiPersonality', p)}
                className={`py-2 rounded-xl text-[10px] font-black transition-all ${settings.aiPersonality === p ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-white/40 border border-white/5'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Notificatie Sectie */}
      <section className="glass-card p-8 rounded-[2.5rem] border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-bold italic">Push Notificaties</p>
            <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Toets alerts & tips</p>
          </div>
          <button 
            onClick={() => handleToggle('notifications')}
            className={`w-12 h-6 rounded-full transition-colors relative ${settings.notifications ? 'bg-blue-600' : 'bg-white/10'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.notifications ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-bold italic">Streak Reminders</p>
            <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Hou je grind levend</p>
          </div>
          <button 
            onClick={() => handleToggle('streakReminders')}
            className={`w-12 h-6 rounded-full transition-colors relative ${settings.streakReminders ? 'bg-blue-600' : 'bg-white/10'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.streakReminders ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="px-2 space-y-4">
        <button 
          onClick={() => {
            if(confirm('Weet je het zeker? Al je voortgang wordt gewist! 💀')) {
              onResetData();
              navigate('/');
            }
          }}
          className="w-full py-5 bg-red-600/10 border border-red-500/20 text-red-500 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-red-600 hover:text-white transition-all active:scale-95"
        >
          Reset Alle Data 🧠💨
        </button>
      </section>

      <div className="text-center pb-10">
        <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.5em]">StudyBuddy v2.5 Premium</p>
      </div>
    </div>
  );
};

export default Settings;
