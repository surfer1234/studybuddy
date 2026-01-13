import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Scan from './pages/Scan.tsx';
import Processing from './pages/Processing.tsx';
import Results from './pages/Results.tsx';
import FeatureDetail from './pages/FeatureDetail.tsx';
import Planner from './pages/Planner.tsx';
import Settings from './pages/Settings.tsx';
import { StudyResult, UserSettings } from './types.ts';

// Eenvoudige Error Boundary Component om crashes op te vangen
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col items-center justify-center p-10 text-center bg-[#020617]">
          <h1 className="text-4xl font-black text-white mb-4 italic">Oeps! Brainfreeze 🥶</h1>
          <p className="text-white/60 mb-8">Er ging iets mis in de hersenpan van StudyBuddy.</p>
          <button onClick={() => window.location.reload()} className="btn-neon px-8 py-4 rounded-2xl font-black text-white uppercase">Herstart App</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppLayout: React.FC<{ settings: UserSettings; children: React.ReactNode }> = ({ settings, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isScanning = location.pathname === '/scan';

  return (
    <div className="flex flex-col h-[100dvh] max-w-md mx-auto relative overflow-hidden bg-transparent pt-[env(safe-area-inset-top)]">
      {!isScanning && (
        <header className="px-6 py-5 flex justify-between items-center z-50 shrink-0">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
              <span className="text-white font-black text-lg">S</span>
            </div>
            <h1 className="text-2xl font-800 text-white tracking-tight italic">StudyBuddy</h1>
          </div>
          <button 
            onClick={() => navigate('/settings')}
            className="w-10 h-10 rounded-full border-2 border-blue-500/30 p-0.5 overflow-hidden active:scale-90 transition-transform"
          >
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${settings.avatarSeed}`} 
              alt="Avatar" 
              className="w-full h-full rounded-full bg-blue-500/20" 
            />
          </button>
        </header>
      )}

      <main className="flex-1 overflow-y-auto pb-32 z-40 px-4 relative scroll-smooth scrollbar-hide">
        {children}
      </main>

      {!isScanning && (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] nav-glass rounded-3xl flex justify-around items-center py-4 z-50 border border-white/20 shadow-2xl">
          <button onClick={() => navigate('/')} className={`flex flex-col items-center transition-all ${location.pathname === '/' ? 'text-blue-400 scale-110' : 'text-gray-400'}`}>
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          </button>
          <button 
            onClick={() => navigate('/scan')} 
            className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center -mt-10 text-white shadow-xl shadow-blue-600/40 border-4 border-[#020617] active:scale-90 transition-transform"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          </button>
          <button onClick={() => navigate('/planner')} className={`flex flex-col items-center transition-all ${location.pathname === '/planner' ? 'text-blue-400 scale-110' : 'text-gray-400'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2-0 002-2V7a2 2-0 00-2-2H5a2 2-0 00-2 2v12a2 2-0 002 2z" /></svg>
          </button>
        </nav>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [results, setResults] = useState<StudyResult[]>([]);
  const [currentScans, setCurrentScans] = useState<string[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    name: 'Emma',
    level: 'HAVO',
    grade: '4',
    notifications: true,
    aiPersonality: 'HYPED',
    streakReminders: true,
    avatarSeed: 'Emma'
  });

  useEffect(() => {
    try {
      const savedResults = localStorage.getItem('study_buddy_results');
      if (savedResults) setResults(JSON.parse(savedResults));
      const savedSettings = localStorage.getItem('study_buddy_settings');
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    } catch (e) {
      console.error("Failed to load local data", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('study_buddy_results', JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem('study_buddy_settings', JSON.stringify(settings));
  }, [settings]);

  const addResult = (newResult: StudyResult) => setResults(prev => [newResult, ...prev]);
  const updateResult = (id: string, updates: Partial<StudyResult>) => setResults(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  const deleteResult = (id: string) => setResults(prev => prev.filter(r => r.id !== id));
  
  const resetAllData = () => {
    setResults([]);
    localStorage.removeItem('study_buddy_results');
    window.location.reload();
  };

  return (
    <HashRouter>
      <ErrorBoundary>
        <AppLayout settings={settings}>
          <Routes>
            <Route path="/" element={<Home results={results} settings={settings} onDelete={deleteResult} />} />
            <Route path="/scan" element={<Scan setScans={setCurrentScans} />} />
            <Route path="/processing" element={<Processing scans={currentScans} results={results} onDone={addResult} onUpdate={updateResult} />} />
            <Route path="/results/:id" element={<Results results={results} onUpdate={updateResult} />} />
            <Route path="/detail/:id" element={<FeatureDetail results={results} />} />
            <Route path="/planner" element={<Planner results={results} onUpdate={updateResult} />} />
            <Route path="/settings" element={<Settings settings={settings} onUpdate={setSettings} onResetData={resetAllData} />} />
          </Routes>
        </AppLayout>
      </ErrorBoundary>
    </HashRouter>
  );
};

export default App;