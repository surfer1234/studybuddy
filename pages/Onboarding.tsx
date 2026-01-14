import React, { useState } from 'react';
import { UserSettings } from '../types.ts';

interface OnboardingProps {
  onComplete: (settings: UserSettings) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [grade, setGrade] = useState('');
  const [apiKey, setApiKey] = useState('');

  const levels = ['Basisschool', 'VMBO', 'HAVO', 'VWO', 'MBO', 'HBO', 'Universiteit'];
  const grades = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const handleComplete = () => {
    const settings: UserSettings = {
      name: name || 'Student',
      level: level || 'HAVO',
      grade: grade || '4',
      notifications: true,
      aiPersonality: 'HYPED',
      streakReminders: true,
      avatarSeed: name || 'Student',
      apiKey,
      onboardingComplete: true
    };
    onComplete(settings);
  };

  const canProceed = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return level.length > 0;
    if (step === 3) return grade.length > 0;
    if (step === 4) return apiKey.trim().length > 0;
    return false;
  };

  return (
    <div className="h-full flex flex-col bg-[#020617] p-6" style={{ height: '100dvh' }}>
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">

        {step === 1 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-3xl flex items-center justify-center shadow-lg mx-auto mb-6">
                <span className="text-white font-black text-3xl">S</span>
              </div>
              <h1 className="text-4xl font-900 text-white italic tracking-tighter">Welkom bij StudyBuddy!</h1>
              <p className="text-white/50 text-sm mt-2">Laten we je profiel instellen</p>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Hoe heet je?</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jouw naam..."
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-xl font-bold text-white text-center outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-3xl font-900 text-white italic tracking-tighter">Hey {name}!</h2>
              <p className="text-white/50 text-sm mt-2">Op welk niveau zit je?</p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {levels.map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`px-5 py-3 rounded-2xl text-sm font-black uppercase tracking-wider transition-all ${
                    level === lvl
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-white/5 text-white/50 border border-white/10'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-3xl font-900 text-white italic tracking-tighter">{level}, nice!</h2>
              <p className="text-white/50 text-sm mt-2">In welk leerjaar zit je?</p>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {grades.map(g => (
                <button
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`py-4 rounded-2xl text-xl font-900 transition-all ${
                    grade === g
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-white/5 text-white/40 border border-white/5'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-3xl font-900 text-white italic tracking-tighter">Laatste stap!</h2>
              <p className="text-white/50 text-sm mt-2">Voer je Gemini API key in</p>
            </div>
            <div className="space-y-3">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Plak je API key hier..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold text-white outline-none focus:border-blue-500/50 transition-colors"
              />
              <p className="text-[10px] text-white/40 text-center">
                Krijg een gratis key op{' '}
                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                  aistudio.google.com
                </a>
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 pb-8">
        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`w-2 h-2 rounded-full transition-all ${s === step ? 'bg-blue-500 w-6' : s < step ? 'bg-blue-500/50' : 'bg-white/20'}`} />
          ))}
        </div>

        <button
          onClick={() => step < 4 ? setStep(step + 1) : handleComplete()}
          disabled={!canProceed()}
          className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${
            canProceed()
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/30 active:scale-95'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
        >
          {step < 4 ? 'Volgende' : 'Start StudyBuddy!'}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
