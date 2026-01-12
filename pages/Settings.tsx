
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
  return (
    <div className="space-y-8 pt-6 pb-20">
      <h2 className="text-4xl font-900 text-white italic">Settings ⚙️</h2>
      <div className="glass-card p-8 rounded-[2.5rem]">
        <input 
          type="text" 
          value={settings.name} 
          onChange={(e) => onUpdate({...settings, name: e.target.value})}
          className="w-full bg-transparent text-2xl font-900 text-white italic outline-none"
        />
      </div>
      <button onClick={onResetData} className="w-full py-4 bg-red-600/20 text-red-500 rounded-2xl font-black">RESET ALLES</button>
    </div>
  );
};

export default Settings;
