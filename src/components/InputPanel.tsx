import React, { useRef } from 'react';
import {
  FileText,
  Briefcase,
  Sparkles,
  ClipboardPaste,
  Trash2,
  Upload,
  ArrowRight,
  Sliders,
  CheckCircle,
  Building,
} from 'lucide-react';
import { PRESETS, Preset } from '../data/presets.js';

interface InputPanelProps {
  resume: string;
  setResume: (val: string) => void;
  jobDescription: string;
  setJobDescription: (val: string) => void;
  company: string;
  setCompany: (val: string) => void;
  role: string;
  setRole: (val: string) => void;
  seniority: 'standard' | 'senior' | 'executive' | 'specialist';
  setSeniority: (val: 'standard' | 'senior' | 'executive' | 'specialist') => void;
  focus: 'balanced' | 'metrics' | 'ats_keywords';
  setFocus: (val: 'balanced' | 'metrics' | 'ats_keywords') => void;
  onTailor: () => void;
  isLoading: boolean;
  onSelectPreset: (preset: Preset) => void;
  activePresetId?: string;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  resume,
  setResume,
  jobDescription,
  setJobDescription,
  company,
  setCompany,
  role,
  setRole,
  seniority,
  setSeniority,
  focus,
  setFocus,
  onTailor,
  isLoading,
  onSelectPreset,
  activePresetId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePasteResume = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setResume(text);
    } catch {
      // Fallback
    }
  };

  const handlePasteJob = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setJobDescription(text);
    } catch {
      // Fallback
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) setResume(content);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resumeWords = resume.trim() ? resume.trim().split(/\s+/).length : 0;
  const jobWords = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;
  const canSubmit = resume.trim().length > 20 && jobDescription.trim().length > 20 && !isLoading;

  return (
    <div className="space-y-4">
      {/* Quick Preset & Target Application Bar */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-xs space-y-3">
        {/* Preset selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800">Quick Test:</span>
            <span className="text-gray-500">Load sample job pair:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  activePresetId === preset.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-50 text-blue-700 border border-blue-200 hover:bg-blue-50'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Company & Role Name for Firestore Version Tracking */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-600" />
              Target Company
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Google, Stripe, OpenAI..."
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-amber-600" />
              Target Job Title / Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer..."
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Dual Column Input Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Current Resume Card */}
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs flex flex-col focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Your Current Resume</h3>
                <span className="text-xs text-gray-500">{resumeWords} words</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                title="Upload .txt or .md file"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upload</span>
              </button>
              <button
                type="button"
                onClick={handlePasteResume}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                title="Paste from clipboard"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Paste</span>
              </button>
              {resume && (
                <button
                  type="button"
                  onClick={() => setResume('')}
                  className="p-1 text-gray-400 hover:text-red-500 rounded-md transition-colors"
                  title="Clear resume"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="relative flex-1 p-3">
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your existing resume here (experience, skills, summary, education)..."
              rows={12}
              className="w-full h-full min-h-[220px] max-h-[420px] p-2 text-sm text-gray-800 placeholder-gray-400 bg-transparent border-0 focus:ring-0 resize-y outline-hidden font-mono leading-relaxed"
            />
          </div>
        </div>

        {/* Target Job Description Card */}
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs flex flex-col focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Target Job Description</h3>
                <span className="text-xs text-gray-500">{jobWords} words</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePasteJob}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                title="Paste from clipboard"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Paste</span>
              </button>
              {jobDescription && (
                <button
                  type="button"
                  onClick={() => setJobDescription('')}
                  className="p-1 text-gray-400 hover:text-red-500 rounded-md transition-colors"
                  title="Clear job description"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="relative flex-1 p-3">
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job posting here (job title, responsibilities, requirements, qualifications)..."
              rows={12}
              className="w-full h-full min-h-[220px] max-h-[420px] p-2 text-sm text-gray-800 placeholder-gray-400 bg-transparent border-0 focus:ring-0 resize-y outline-hidden font-mono leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Optimization Tuning & CTA Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Tailoring Parameters */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
            <Sliders className="w-3.5 h-3.5 text-gray-400" />
            <span>Role Target:</span>
            <select
              aria-label="Select role target seniority"
              value={seniority}
              onChange={(e) => setSeniority(e.target.value as any)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="standard">Mid-Level Professional</option>
              <option value="senior">Senior / Lead Contributor</option>
              <option value="executive">Staff / Principal / Director</option>
              <option value="specialist">Domain Specialist</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
            <span>Optimization Focus:</span>
            <select
              aria-label="Select optimization focus"
              value={focus}
              onChange={(e) => setFocus(e.target.value as any)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="balanced">Balanced (Keywords + Action Verbs)</option>
              <option value="metrics">Heavy Quantified Impact & Metrics</option>
              <option value="ats_keywords">Maximum ATS Keyword Density</option>
            </select>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={onTailor}
            className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
              canSubmit
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 cursor-pointer active:scale-[0.98]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Tailoring with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span className="font-google font-semibold">Tailor Resume</span>
                <ArrowRight className="w-4 h-4 ml-1 opacity-75" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
