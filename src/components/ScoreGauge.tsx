import React from 'react';
import { TrendingUp, Award, CheckCircle2, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import type { ScoreBreakdown } from '../types/resume.js';

interface ScoreGaugeProps {
  beforeScore: number;
  afterScore: number;
  scoreAnalysis: string;
  scoreBreakdown?: ScoreBreakdown;
  matchStrengths?: string[];
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  beforeScore,
  afterScore,
  scoreAnalysis,
  scoreBreakdown,
  matchStrengths,
}) => {
  const boost = Math.max(0, afterScore - beforeScore);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 stroke-emerald-500 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-blue-600 stroke-blue-500 bg-blue-50 border-blue-200';
    if (score >= 55) return 'text-amber-600 stroke-amber-500 bg-amber-50 border-amber-200';
    return 'text-rose-600 stroke-rose-500 bg-rose-50 border-rose-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Exceptional Match';
    if (score >= 80) return 'Strong Candidate';
    if (score >= 65) return 'Moderate Fit';
    return 'Low Alignment';
  };

  // SVG Circular Gauge helper
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const beforeOffset = circumference - (beforeScore / 100) * circumference;
  const afterOffset = circumference - (afterScore / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            <h2 className="text-lg font-bold text-gray-900 font-google">
              ATS Match Score Assessment
            </h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Never Invent: Score rises from better wording only
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Evaluated against target role requirements. Numbers, dates, companies, and titles remain strictly untouched.
          </p>
        </div>

        {boost > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>+{boost}% Match Score Boost</span>
          </div>
        )}
      </div>

      {/* Main Score Comparison Display */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 items-center">
        {/* Before & After Dials */}
        <div className="md:col-span-6 flex items-center justify-center sm:justify-around gap-4 bg-gray-50/70 p-5 rounded-2xl border border-gray-100">
          {/* Before Score Dial */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium text-gray-500 mb-2">Original Resume</span>
            <div className="relative flex items-center justify-center">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  className="stroke-gray-200"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  className="stroke-amber-500 transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={beforeOffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-800 font-google">
                  {beforeScore}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">/ 100</span>
              </div>
            </div>
            <span className="mt-2 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              {getScoreLabel(beforeScore)}
            </span>
          </div>

          {/* Transformation Arrow */}
          <div className="flex flex-col items-center justify-center px-1">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 shadow-xs">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-wider">
              Tailored
            </span>
          </div>

          {/* After Score Dial */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium text-gray-900 font-semibold mb-2">
              Tailored Resume
            </span>
            <div className="relative flex items-center justify-center">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  className="stroke-gray-200"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  className="stroke-emerald-500 transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={afterOffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-emerald-700 font-google">
                  {afterScore}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">/ 100</span>
              </div>
            </div>
            <span className="mt-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {getScoreLabel(afterScore)}
            </span>
          </div>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="md:col-span-6 space-y-3.5">
          {scoreBreakdown ? (
            <>
              {/* Technical Skills */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-700">Technical Skills & Frameworks</span>
                  <div className="space-x-1.5 font-mono">
                    <span className="text-gray-400">{scoreBreakdown.technicalSkills.before}%</span>
                    <span className="text-gray-300">➔</span>
                    <span className="font-bold text-emerald-600">{scoreBreakdown.technicalSkills.after}%</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${scoreBreakdown.technicalSkills.after}%` }}
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-700"
                  />
                </div>
              </div>

              {/* Experience Alignment */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-700">Experience & Responsibility Fit</span>
                  <div className="space-x-1.5 font-mono">
                    <span className="text-gray-400">{scoreBreakdown.experienceAlignment.before}%</span>
                    <span className="text-gray-300">➔</span>
                    <span className="font-bold text-emerald-600">{scoreBreakdown.experienceAlignment.after}%</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${scoreBreakdown.experienceAlignment.after}%` }}
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-700"
                  />
                </div>
              </div>

              {/* ATS Keyword Density */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-700">ATS Keyword Density & Structure</span>
                  <div className="space-x-1.5 font-mono">
                    <span className="text-gray-400">{scoreBreakdown.atsKeywords.before}%</span>
                    <span className="text-gray-300">➔</span>
                    <span className="font-bold text-emerald-600">{scoreBreakdown.atsKeywords.after}%</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${scoreBreakdown.atsKeywords.after}%` }}
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-700"
                  />
                </div>
              </div>
            </>
          ) : null}

          {/* Score Analysis Text */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-xs text-blue-900 leading-relaxed">
            <span className="font-semibold text-blue-950 block mb-0.5">Gemini Fit Analysis:</span>
            {scoreAnalysis}
          </div>
        </div>
      </div>

      {/* Match Strengths Chips */}
      {matchStrengths && matchStrengths.length > 0 && (
        <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Key Strengths Aligned:
          </span>
          {matchStrengths.map((str, idx) => (
            <span
              key={idx}
              className="inline-flex items-center text-xs bg-gray-50 text-gray-700 px-2.5 py-1 rounded-lg border border-gray-200"
            >
              {str}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
