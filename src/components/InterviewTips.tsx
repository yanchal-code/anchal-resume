import React from 'react';
import { MessageSquare, Lightbulb, CheckCircle, ArrowRight } from 'lucide-react';

interface InterviewTipsProps {
  tips: string[];
}

export const InterviewTips: React.FC<InterviewTipsProps> = ({ tips }) => {
  if (!tips || tips.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900 font-google">
            Recruiter & Interview Talking Points
          </h3>
          <p className="text-xs text-gray-500">
            Strategic advice for defending and discussing your newly tailored achievements
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tips.map((tip, idx) => (
          <div
            key={idx}
            className="bg-amber-50/40 border border-amber-200/60 rounded-xl p-4 flex flex-col justify-between"
          >
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                {idx + 1}
              </span>
              <p className="text-xs text-gray-800 leading-relaxed font-sans">{tip}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
