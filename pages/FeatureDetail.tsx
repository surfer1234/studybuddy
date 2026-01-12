
import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { StudyResult, StudyFeature, SummaryData, QuizData, TipsData, CheatSheetData } from '../types.ts';

interface FeatureDetailProps {
  results: StudyResult[];
}

const FeatureDetail: React.FC<FeatureDetailProps> = ({ results }) => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const feature = searchParams.get('feature') as StudyFeature;
  const result = results.find(r => r.id === id);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  if (!result || !result.content) {
    return <div className="p-12 text-center text-white font-black italic">404: Brain Cell Missing.</div>;
  }

  const content = result.content;

  const renderSummary = (data: SummaryData) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="glass-card p-8 rounded-[2.5rem] border-blue-500/20">
        <h3 className="text-3xl font-900 text-white italic mb-6 neon-text-blue">{data.title}</h3>
        <div className="space-y-8">
          {data.chapters.map((chapter, idx) => (
            <div key={idx} className="border-l-4 border-blue-500/30 pl-6 py-2">
              <h4 className="font-900 text-blue-400 text-lg uppercase tracking-tighter mb-2 italic">{chapter.title}</h4>
              <p className="text-white/80 leading-relaxed text-sm">{chapter.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderQuiz = (data: any) => {
    const currentQuestion = data.questions[currentQuestionIndex];
    
    const handleAnswer = (answer: string) => {
      const newAnswers = { ...answers, [currentQuestion.id]: answer };
      setAnswers(newAnswers);
      if (currentQuestionIndex < data.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        let correct = 0;
        data.questions.forEach((q: any) => {
          if (newAnswers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase().trim()) {
            correct++;
          }
        });
        setScore(correct);
        setShowResults(true);
      }
    };

    if (showResults) {
      return (
        <div className="text-center py-10 space-y-8">
          <h3 className="text-5xl font-900 text-white italic">SCORE: {score}/{data.questions.length}</h3>
          <button onClick={() => navigate('/')} className="w-full btn-neon py-5 rounded-3xl text-white font-900 uppercase">Back Home</button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="glass-card p-10 rounded-[3rem] border-white/10">
           <h3 className="text-2xl font-900 text-white italic mb-8">{currentQuestion.question}</h3>
           <div className="space-y-4">
             {currentQuestion.options ? (
               currentQuestion.options.map((opt: string, i: number) => (
                 <button key={i} onClick={() => handleAnswer(opt)} className="w-full text-left p-6 rounded-2xl bg-white/5 border border-white/10 text-white">{opt}</button>
               ))
             ) : (
               <input 
                 type="text" 
                 className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-white"
                 onKeyDown={(e) => e.key === 'Enter' && handleAnswer((e.target as HTMLInputElement).value)}
               />
             )}
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-4 pb-20 max-w-md mx-auto">
      <button onClick={() => navigate(-1)} className="mb-6 p-3 bg-white/5 rounded-2xl text-white">← Terug</button>
      {feature === StudyFeature.SUMMARY && renderSummary(content)}
      {feature === StudyFeature.QUIZ && renderQuiz(content)}
    </div>
  );
};

export default FeatureDetail;
