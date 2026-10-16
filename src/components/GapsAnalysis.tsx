import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  CheckCircle,
  Lightbulb,
  Copy,
  Check,
  ArrowRight,
  Info,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import type { ResumeGap } from '../types/resume.js';

interface GapsAnalysisProps {
  gaps: ResumeGap[];
}

export const GapsAnalysis: React.FC<GapsAnalysisProps> = ({ gaps }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyAdvice = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return {
          label: 'Critical Job Requirement',
          className: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
        };
      case 'moderate':
        return {
          label: 'Important Core Competency',
          className: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
        };
      case 'nice_to_have':
      default:
        return {
          label: 'Preferred / Bonus Qualification',
          className: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Integrity & Zero Hallucination Guarantee Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 font-google flex items-center gap-2">
                Honest Gaps & Career Strategy
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Strict Rule: Never Invent
                </span>
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                We use strictly the facts in your resume. Any missing job requirements are analyzed here with constructive, candid advice.
              </p>
            </div>
          </div>

          <div className="text-xs text-emerald-800 font-semibold bg-white/80 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
            {gaps?.length || 0} Gaps Documented
          </div>
        </div>

        <div className="pt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Never fabricates companies or job titles</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Keeps exact dates and numbers unchanged</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Score rises only from honest, clearer wording</span>
          </div>
        </div>
      </div>

      {/* Gaps List */}
      {!gaps || gaps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
          <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-gray-900">No Significant Gaps Found!</h4>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
            Your original resume already covers all the major technical competencies and qualifications requested in the job posting.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {gaps.map((gap, index) => {
            const badge = getSeverityBadge(gap.severity);
            const isCopied = copiedIndex === index;

            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 hover:border-amber-200 transition-all"
              >
                {/* Header row: Severity badge & Missing Area */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-md border ${badge.className}`}>
                      <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                      {badge.label}
                    </span>
                    <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-md">
                      Missing: {gap.missingSkillOrArea}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyAdvice(gap.honestAdvice, index)}
                    className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border transition-all ${
                      isCopied
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    title="Copy advice to clipboard"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied advice</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy advice</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Job Requirement vs Honest Strategy */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Job Requirement */}
                  <div className="md:col-span-5 bg-rose-50/40 border border-rose-100 rounded-xl p-3.5 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        Job Posting Requirement
                      </div>
                      <p className="text-xs text-gray-800 leading-relaxed font-sans font-medium">
                        "{gap.requirement}"
                      </p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-rose-200/50 text-[11px] text-rose-700">
                      Not found in candidate resume — omitted from rewrite to maintain factual integrity.
                    </div>
                  </div>

                  {/* Honest Advice */}
                  <div className="md:col-span-7 bg-amber-50/40 border border-amber-200/70 rounded-xl p-3.5 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        Honest Advice & Interview Strategy
                      </div>
                      <p className="text-xs text-gray-800 leading-relaxed font-sans">
                        {gap.honestAdvice}
                      </p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-amber-200/50 flex items-center gap-1 text-[11px] text-amber-800 font-medium">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>Use this talking point during recruiter screen or technical interviews</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
