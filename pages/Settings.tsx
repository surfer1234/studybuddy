
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserSettings } from '../types';

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
    <div className="space-y-8 pt-6 pb-20 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="flex items-center px-2">
        <button 
          onClick={() => navigate('/')}
          className="mr-6 bg-white/5 backdrop-blur-3xl p-4 rounded-[1.5rem] border border-white/10 text-white active:scale-95 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-3xl font-900 text-white tracking-tighter italic">Settings ⚙️</h2>
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Customize your vibe.</p>
        </div>
      </div>

      {/* Profile Section */}
      <section className="glass-card rounded-[3rem] p-8 border-white/10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl -mr-16 -mt-16"></div>
        <div className="relative inline-block mb-6 group cursor-pointer" onClick={() => handleChange('avatarSeed', Math.random().toString(36).substring(7))}>
          <div className="w-28 h-28 rounded-full border-4 border-blue-500/50 p-1 bg-white/5">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${settings.avatarSeed}`} 
              alt="Avatar" 
              className="w-full h-full rounded-full bg-blue-500/10 transition-transform group-hover:scale-110" 
            />
          </div>
          <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full border-2 border-[#020617] shadow-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="text-left">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-4">Gamer Name</label>
            <input 
              type="text" 
              value={settings.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xl font-900 italic text-white focus:neon-border-blue outline-none transition-all mt-2"
              placeholder="Je naam..."
            />
          </div>
        </div>
      </section>

      {/* Study Stats Section */}
      <section className="glass-card rounded-[3rem] p-8 border-white/10">
        <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-6 italic">Study Info 📚</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-2">Niveau</label>
            <select 
              value={settings.level}
              onChange={(e) => handleChange('level', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-bold text-white outline-none focus:neon-border-blue"
            >
              <option value="Groep 7/8">Groep 7/8</option>
              <option value="VMBO">VMBO</option>
              <option value="HAVO">HAVO</option>
              <option value="VWO">VWO</option>
              <option value="HBO/WO">HBO/WO</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-2">Leerjaar</label>
            <select 
              value={settings.grade}
              onChange={(e) => handleChange('grade', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-bold text-white outline-none focus:neon-border-blue"
            >
              {[1,2,3,4,5,6].map(n => <option key={n} value={n.toString()}>{n}e jaar</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="glass-card rounded-[3rem] p-8 border-white/10 space-y-6">
        <h3 className="text-sm font-black text-pink-500 uppercase tracking-widest italic mb-2">Vibes & Notifs 🔔</h3>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white font-bold text-sm italic">Daily Reminders</p>
            <p className="text-[10px] text-white/30 uppercase font-black tracking-tighter">Stay on top of your streak</p>
          </div>
          <button 
            onClick={() => handleToggle('notifications')}
            className={`w-14 h-8 rounded-full p-1 transition-colors ${settings.notifications ? 'bg-blue-600' : 'bg-white/10'}`}
          >
            <div className={`w-6 h-6 rounded-full bg-white transition-transform ${settings.notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>

        <div className="flex justify-between items-center pt-2">
          <div>
            <p className="text-white font-bold text-sm italic">AI Personality</p>
            <p className="text-[10px] text-white/30 uppercase font-black tracking-tighter">How the AI talks to you</p>
          </div>
          <select 
            value={settings.aiPersonality}
            onChange={(e) => handleChange('aiPersonality', e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-black text-blue-400 outline-none"
          >
            <option value="HYPED">🚀 HYPED</option>
            <option value="CHILL">🕶️ CHILL</option>
            <option value="PRO">👨‍🏫 PRO</option>
          </select>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="p-4 pt-10">
        <button 
          onClick={() => {
            if(confirm("Wacht! Weet je het zeker? AL je voortgang wordt gewist! 🛑")) {
              onResetData();
              alert("Data gewist. Fresh start! 🔄");
              navigate('/');
            }
          }}
          className="w-full bg-red-500/10 border-2 border-red-500/20 text-red-500 py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-red-500/20 transition-all"
        >
          Reset All Brain Data 🧨
        </button>
      </section>
    </div>
  );
};

export default Settings;
