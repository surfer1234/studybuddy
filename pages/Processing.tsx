
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { analyzeStudyMaterial } from '../services/geminiService';
import { StudyFeature, StudyResult, QuizDifficulty } from '../types';

interface ProcessingProps {
  scans: string[];
  results: StudyResult[];
  onDone: (result: StudyResult) => void;
  onUpdate: (id: string, updates: Partial<StudyResult>) => void;
}

const Processing: React.FC<ProcessingProps> = ({ scans, results, onDone, onUpdate }) => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Booting Brain...');
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const targetFeature = (searchParams.get('feature') as StudyFeature) || StudyFeature.SUMMARY;
  const targetId = searchParams.get('id');
  const targetDifficulty = (searchParams.get('difficulty') as QuizDifficulty) || 'GEMIDDELD';
  const targetCount = parseInt(searchParams.get('count') || '10');

  const messages = [
    'CHARGING BRAIN CELLS... ⚡',
    'INJECTING SMART KNOWLEDGE... 💉',
    'ZAPPING PIXELS... ⚡',
    'DOWNLOADING THE GRIND... 📥',
    'CALCULATING BIG BRAIN MOVES... 🧠',
    'READY TO OWN IT! 🚀'
  ];

  useEffect(() => {
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setStatus(messages[msgIdx]);
    }, 1200);

    async function process() {
      try {
        setProgress(15);
        let imagesToUse = scans;
        const existingResult = targetId ? results.find(r => r.id === targetId) : null;
        
        if (targetId && existingResult) {
          imagesToUse = existingResult.images;
        }

        if (!imagesToUse || imagesToUse.length === 0) {
          throw new Error("Geen scans.");
        }

        setProgress(35);
        const data = await analyzeStudyMaterial(imagesToUse, targetFeature, {
          level: existingResult?.level,
          grade: existingResult?.grade,
          difficulty: targetDifficulty,
          questionCount: targetCount
        });
        
        setProgress(85);
        if (targetId && existingResult) {
          const updatedFeatures = Array.from(new Set([...(existingResult.generatedFeatures || []), targetFeature]));
          onUpdate(targetId, {
            feature: targetFeature,
            content: data,
            generatedFeatures: updatedFeatures
          });
          setProgress(100);
          setTimeout(() => navigate(`/detail/${targetId}?feature=${targetFeature}`), 800);
        } else {
          const newResult: StudyResult = {
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString(),
            subject: data.title || 'Topic Name',
            images: imagesToUse,
            feature: targetFeature,
            content: data,
            generatedFeatures: [targetFeature]
          };
          onDone(newResult);
          setProgress(100);
          setTimeout(() => navigate(`/results/${newResult.id}`), 800);
        }
      } catch (err) {
        console.error(err);
        setStatus('BRAIN ERROR... ZAPPING AGAIN! ⚡');
      }
    }

    process();
    return () => clearInterval(interval);
  }, [scans, targetFeature, targetId, results, onDone, onUpdate, navigate, targetDifficulty, targetCount]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-10 bg-transparent text-center overflow-hidden">
      <div className="relative w-80 h-80 mb-16 flex items-center justify-center perspective-[2000px]">
        {/* Intense Circular Aura */}
        <div className="absolute inset-0 border-[2px] border-blue-500/10 rounded-full animate-[spin_4s_linear_infinite]"></div>
        <div className="absolute inset-8 border-[2px] border-purple-500/20 rounded-full animate-[spin_6s_linear_infinite_reverse]"></div>
        <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full animate-pulse"></div>

        {/* High-Detail 3D Turning Brain - Intensive Version */}
        <div className="relative z-10 w-56 h-56 transition-transform duration-1000" style={{ transformStyle: 'preserve-3d' }}>
           <div className="absolute inset-0 animate-[rotate3DBrainFast_8s_infinite_linear]" style={{ transformStyle: 'preserve-3d' }}>
              {[...Array(9)].map((_, i) => (
                <svg 
                  key={i}
                  className="absolute inset-0 w-full h-full text-blue-300 opacity-70" 
                  style={{ 
                    transform: `translateZ(${(i - 4) * 12}px)`,
                    filter: `drop-shadow(0 0 ${10 + i}px rgba(0,210,255,${0.3 + (i/15)}))`
                  }}
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="0.6"
                >
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z" fill="currentColor" fillOpacity="0.1"/>
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z" fill="currentColor" fillOpacity="0.1"/>
                </svg>
              ))}
           </div>
          
          {/* Intense Electrical Core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full blur-3xl animate-[ping_1.5s_infinite] opacity-40"></div>
            <div className="absolute w-full h-1 bg-blue-500 blur-md animate-[lightningFlash_0.2s_infinite]"></div>
          </div>
        </div>

        {/* Floating Feature Icon */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 glass-card rounded-[2.5rem] flex flex-col items-center justify-center shadow-[0_0_40px_rgba(0,210,255,0.6)] animate-bounce border-white/20 z-20">
          <span className="text-4xl drop-shadow-lg">
            {targetFeature === StudyFeature.QUIZ ? '❓' : 
             targetFeature === StudyFeature.CHEAT_SHEET ? '📄' : 
             targetFeature === StudyFeature.TIPS ? '💡' : '📝'}
          </span>
          <span className="text-[8px] font-black text-blue-400 mt-1 uppercase tracking-widest">Active</span>
        </div>
      </div>

      <h2 className="text-5xl font-900 text-white mb-6 tracking-tighter italic neon-text-blue uppercase">ZAPPING BRAIN</h2>
      <p className="text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] h-6 animate-pulse">{status}</p>

      <div className="w-full max-w-[340px] mt-20 px-4">
        <div className="flex justify-between text-[9px] font-black text-white/50 uppercase tracking-widest mb-3">
           <span className="flex items-center"><span className="w-2.5 h-2.5 bg-blue-400 rounded-full mr-2 animate-ping shadow-[0_0_10px_#00d2ff]"></span> CORE ENERGY</span>
           <span className="text-blue-300 font-900">{progress}%</span>
        </div>
        <div className="w-full bg-white/5 h-5 rounded-full overflow-hidden border border-white/10 p-1 backdrop-blur-md">
          <div 
            className="bg-gradient-to-r from-blue-400 via-white to-purple-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_30px_rgba(0,210,255,1)] relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 shimmer opacity-60"></div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes rotate3DBrainFast {
            0% { transform: rotateY(0deg) rotateX(20deg) rotateZ(5deg); }
            100% { transform: rotateY(360deg) rotateX(20deg) rotateZ(5deg); }
        }
        @keyframes lightningFlash {
            0%, 90% { opacity: 0; transform: scaleY(0); }
            95% { opacity: 1; transform: scaleY(1) skewX(20deg); }
            100% { opacity: 0; transform: scaleY(0); }
        }
      `}</style>
    </div>
  );
};

export default Processing;
