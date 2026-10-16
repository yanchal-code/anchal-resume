import React from 'react';
import { X, CheckCircle, Sparkles, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 font-google">
              How Resume Tailor Works
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
              1
            </span>
            <div>
              <strong className="text-gray-900 block font-semibold mb-0.5">
                Strict Rule: Never Invent
              </strong>
              We use strictly the facts that are in your resume. Numbers, dates, job titles, and company names are never altered. You may reword and reorder bullets, but never invent unearned qualifications.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-xs">
              2
            </span>
            <div>
              <strong className="text-gray-900 block font-semibold mb-0.5">
                Dedicated "Gaps" Tab with Honest Advice
              </strong>
              Anything the job asks for that your resume lacks goes directly into the "Gaps" tab with candid, actionable advice on how to address, learn, or frame it in interviews.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
              3
            </span>
            <div>
              <strong className="text-gray-900 block font-semibold mb-0.5">
                Honest ATS Match Score (0-100)
              </strong>
              The "after" score rises strictly from clearer phrasing, active voice, and better structure—never from fabricated content.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0 text-xs">
              4
            </span>
            <div>
              <strong className="text-gray-900 block font-semibold mb-0.5">
                "What Changed" Audit & Document Export
              </strong>
              Review every wording improvement side-by-side (old wording ➔ new wording), inspect job keywords, and export to TXT, Markdown, or PDF.
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            Got it, let's tailor!
          </button>
        </div>
      </div>
    </div>
  );
};
