
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StudyResult } from '../types.ts';

interface PlannerProps {
  results: StudyResult[];
  onUpdate?: (id: string, updates: Partial<StudyResult>) => void;
}

const Planner: React.FC<PlannerProps> = ({ results, onUpdate }) => {
  const navigate = useNavigate();
  const upcomingTests = results
    .filter(r => r.testDate)
    .sort((a, b) => new Date(a.testDate!).getTime() - new Date(b.testDate!).getTime());

  return (
    <div className="space-y-8 pt-6 pb-20">
      <h2 className="text-4xl font-900 text-white italic">Planner 📅</h2>
      <div className="space-y-4">
        {upcomingTests.map(test => (
          <div key={test.id} className="glass-card p-6 rounded-[2rem] flex justify-between items-center">
            <div>
              <h4 className="font-900 text-white">{test.subject}</h4>
              <p className="text-blue-400 text-xs">{test.testDate}</p>
            </div>
            <button onClick={() => navigate(`/results/${test.id}`)} className="bg-blue-600 px-4 py-2 rounded-xl text-white text-xs">Start</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Planner;
