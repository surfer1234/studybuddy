import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { analyzeStudyMaterial } from '../services/geminiService.ts';
import { StudyFeature, StudyResult, QuizDifficulty } from '../types.ts';

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
    'ANALYSING TEXT...',
    'GENERATING CONTENT...',
    'SYNCING BRAIN...',
    'READY TO OWN IT!'
  ];

  useEffect(() => {
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setStatus(messages[msgIdx]);
    }, 2000);

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
          setTimeout(() => navigate(`/detail/${targetId}?feature=${targetFeature}`), 500);
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
          setTimeout(() => navigate(`/results/${newResult.id}`), 500);
        }
      } catch (err) {
        console.error(err);
        setStatus('BRAIN ERROR... REBOOTING.');
      }
    }

    process();
    return () => clearInterval(interval);
  }, [scans, targetFeature, targetId, results, onDone, onUpdate, navigate, targetDifficulty, targetCount]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-10 bg-transparent text-center overflow-hidden">
      <div className="relative w-80 h-80 mb-16 flex items-center justify-center">
        <div className="absolute inset-0 border-[2px] border-blue-500/10 rounded-full"></div>
        <div className="absolute inset-8 border-[2px] border-purple-500/20 rounded-full"></div>

        <div className="relative z-10 w-56 h-56">
           <div className="absolute inset-0">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i}
                  className="absolute inset-0 w-full h-full text-blue-300 opacity-20" 
                  style={{ transform: `translateZ(${(i - 2) * 10}px)` }}
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="0.5"
                >
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z" />
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z" />
                </svg>
              ))}
              <div className="absolute inset-0 flex items-center justify-center text-8xl">🧠</div>
           </div>
        </div>

        <div className="absolute -bottom-4 -right-4 w-24 h-24 glass-card rounded-[2.5rem] flex flex-col items-center justify-center border-white/20 z-20">
          <span className="text-4xl">
            {targetFeature === StudyFeature.QUIZ ? '❓' : 
             targetFeature === StudyFeature.CHEAT_SHEET ? '📄' : 
             targetFeature === StudyFeature.TIPS ? '💡' : '📝'}
          </span>
          <span className="text-[8px] font-black text-blue-400 mt-1 uppercase tracking-widest">Active</span>
        </div>
      </div>

      <h2 className="text-5xl font-900 text-white mb-6 tracking-tighter italic neon-text-blue uppercase">PROCESSING</h2>
      <p className="text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] h-6">{status}</p>

      <div className="w-full max-w-[340px] mt-20 px-4">
        <div className="flex justify-between text-[9px] font-black text-white/50 uppercase tracking-widest mb-3">
           <span>PROGRESS</span>
           <span className="text-blue-300 font-900">{progress}%</span>
        </div>
        <div className="w-full bg-white/5 h-5 rounded-full overflow-hidden border border-white/10 p-1 backdrop-blur-md">
          <div 
            className="bg-gradient-to-r from-blue-400 to-purple-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Processing;