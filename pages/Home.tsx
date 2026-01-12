
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StudyResult, StudyFeature, UserSettings } from '../types.ts';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface HomeProps {
  results: StudyResult[];
  settings: UserSettings;
  isLibrary?: boolean;
  onDelete?: (id: string) => void;
}

const mockChartData = [
  { name: 'Ma', score: 6.5 },
  { name: 'Di', score: 7.2 },
  { name: 'Wo', score: 6.8 },
  { name: 'Do', score: 8.1 },
  { name: 'Vr', score: 7.5 },
  { name: 'Za', score: 8.5 },
  { name: 'Zo', score: 7.9 },
];

const Home: React.FC<HomeProps> = ({ results = [], settings, isLibrary = false, onDelete }) => {
  const navigate = useNavigate();

  const getFeatureIcon = (feature: StudyFeature) => {
    switch (feature) {
      case StudyFeature.SUMMARY: return '📝';
      case StudyFeature.QUIZ: return '❓';
      case StudyFeature.CHEAT_SHEET: return '📄';
      case StudyFeature.TIPS: return '💡';
      default: return '📚';
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onDelete && window.confirm('Delete dit uit je geheugen? 🧠')) {
      onDelete(id);
    }
  };

  if (isLibrary) {
    return (
      <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-6 duration-500">
        <div className="flex justify-between items-end px-2">
          <div>
            <h2 className="text-4xl font-900 text-white tracking-tighter italic">Mijn Bieb 📚</h2>
            <p className="text-blue-400 text-xs font-black uppercase tracking-widest mt-1">Al je brain power hier.</p>
          </div>
        </div>

        {!results || results.length === 0 ? (
          <div className="glass-card rounded-[2.5rem] p-12 text-center mt-4 border-white/5">
            <div className="text-7xl mb-6">🏝️</div>
            <p className="text-white font-black text-xl mb-2 italic">Niks te zien, chef.</p>
            <p className="text-white/40 text-sm mb-8">Scan je boeken en start de grind!</p>
            <button 
              onClick={() => navigate('/scan')}
              className="w-full btn-neon text-white py-5 rounded-2xl font-black shadow-xl active:scale-95 transition-all uppercase tracking-widest"
            >
              Start Eerste Scan 🚀
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 pb-12">
            {results.map(res => (
              <div 
                key={res.id}
                onClick={() => navigate(`/results/${res.id}`)}
                className="glass-card p-6 rounded-[2rem] flex items-center justify-between group active:scale-[0.98] border-white/10 hover:border-blue-500/50 transition-colors"
              >
                <div className="flex items-center space-x-5 min-w-0">
                  <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-inner border border-white/10 group-hover:rotate-6 transition-transform">
                    {getFeatureIcon(res.feature)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-900 text-white truncate text-xl leading-tight italic">{res.subject || 'Topic'}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{new Date(res.date).toLocaleDateString('nl-NL')}</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={(e) => handleDelete(e, res.id)}
                  className="p-3 text-white/20 hover:text-red-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-6 animate-in fade-in duration-700">
      <section className="px-2 flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-900 text-white tracking-tighter italic neon-text-blue line-clamp-1 max-w-[200px]">Yo {settings.name}! 🔥</h2>
          <p className="text-white/50 text-xs font-black uppercase tracking-widest mt-1">Lekker bezig, MVP.</p>
        </div>
        <div 
          onClick={() => navigate('/settings')}
          className="w-14 h-14 rounded-full border-2 border-blue-500/50 p-1 cursor-pointer active:scale-90 transition-transform bg-white/5"
        >
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${settings.avatarSeed}`} 
            alt="Avatar" 
            className="w-full h-full rounded-full bg-blue-500/20" 
          />
        </div>
      </section>

      <section className="glass-card rounded-[2.5rem] p-8 border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[60px] -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.2em] mb-1">BRAIN GAIN / WEEK</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-6xl font-900 text-white italic">7.8</span>
                <span className="text-green-400 text-[10px] font-black bg-green-400/10 px-2 py-1 rounded-lg border border-green-400/20 uppercase">LEVEL UP ↑</span>
              </div>
            </div>
          </div>
          <div className="mt-8 h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00d2ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="score" stroke="#00d2ff" strokeWidth={5} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 flex items-center space-x-4">
         <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center text-2xl border border-yellow-500/30">🎯</div>
         <div className="flex-1">
            <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Daily Goal</p>
            <p className="text-white font-bold italic text-sm">Scan 1 nieuwe pagina voor de grind van vandaag!</p>
         </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => navigate('/scan')}
          className="glass-card p-8 rounded-[2rem] border-white/10 flex flex-col items-center space-y-4 active:scale-95 transition-all group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 bg-gradient-to-tr from-orange-400 to-red-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-[0_0_20px_rgba(251,146,60,0.4)] group-hover:rotate-12 transition-transform relative z-10">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="font-900 text-white text-sm uppercase italic tracking-widest relative z-10">Scan Boek</span>
        </button>
        <button 
          onClick={() => navigate('/planner')}
          className="glass-card p-8 rounded-[2rem] border-white/10 flex flex-col items-center space-y-4 active:scale-95 transition-all group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 bg-gradient-to-tr from-green-400 to-emerald-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.4)] group-hover:-rotate-12 transition-transform relative z-10">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2-0 002-2V7a2 2-0 00-2-2H5a2 2-0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="font-900 text-white text-sm uppercase italic tracking-widest relative z-10">Planner</span>
        </button>
      </section>

      <section className="space-y-5">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-2xl font-900 text-white italic tracking-tighter">Onlangs Geleerd ⚡</h3>
          <button onClick={() => navigate('/library')} className="text-blue-400 text-[10px] font-black uppercase tracking-widest border-b-2 border-blue-400/30">Bekijk Alles</button>
        </div>
        <div className="flex space-x-5 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide">
          {results && results.length > 0 ? (
            results.slice(0, 5).map(res => (
              <div 
                key={res.id}
                onClick={() => navigate(`/results/${res.id}`)}
                className="glass-card min-w-[180px] p-6 rounded-[2.2rem] border-white/5 flex flex-col items-center text-center active:scale-95 transition-all shrink-0 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 -mr-8 -mt-8 rotate-45 group-hover:bg-blue-500/10 transition-colors"></div>
                <div className="text-5xl mb-4 drop-shadow-lg group-hover:scale-110 transition-transform">{getFeatureIcon(res.feature)}</div>
                <h4 className="font-900 text-white text-sm italic line-clamp-1 w-full">{res.subject || 'Onderwerp'}</h4>
                <div className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-[8px] font-black mt-3 uppercase tracking-widest border border-blue-400/20">Openen</div>
              </div>
            ))
          ) : (
            <div className="w-full glass-card p-12 rounded-[2.5rem] border-dashed border-white/10 text-center">
              <p className="text-white/40 text-sm font-black uppercase tracking-widest">Nog geen scans. Start de grind! 🔥</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-gradient-to-r from-pink-600/40 to-purple-600/40 rounded-[2.5rem] p-8 flex items-center space-x-6 border border-white/10 backdrop-blur-3xl relative overflow-hidden">
        <div className="absolute inset-0 shimmer opacity-20"></div>
        <div className="text-6xl animate-bounce drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">🔥</div>
        <div className="relative z-10">
          <p className="font-900 text-white text-2xl leading-none tracking-tighter uppercase italic">STREAK: 3 DAGEN</p>
          <p className="text-sm text-pink-200/60 font-black uppercase tracking-widest mt-1">Niet stoppen nu! 🧠</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
