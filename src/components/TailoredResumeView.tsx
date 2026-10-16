import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Printer,
  FileCode,
  Eye,
  Columns,
  Sparkles,
  FileText,
  Pencil,
} from 'lucide-react';

interface TailoredResumeViewProps {
  tailoredResume: string;
  originalResume: string;
  tailoredSummary: string;
  onUpdateTailoredResume?: (newText: string) => void;
}

export const TailoredResumeView: React.FC<TailoredResumeViewProps> = ({
  tailoredResume,
  originalResume,
  tailoredSummary,
  onUpdateTailoredResume,
}) => {
  const [viewTab, setViewTab] = useState<'formatted' | 'compare' | 'editor'>('formatted');
  const [copied, setCopied] = useState(false);
  const [resumeText, setResumeText] = useState(tailoredResume);

  const handleCopy = () => {
    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tailored_resume.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMd = () => {
    const blob = new Blob([resumeText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tailored_resume.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(e.target.value);
    if (onUpdateTailoredResume) {
      onUpdateTailoredResume(e.target.value);
    }
  };

  // Simple Markdown to HTML preview helper for standard resume format
  const renderFormattedResume = (text: string) => {
    const lines = text.split('\n');

    return (
      <div className="font-sans text-gray-800 leading-relaxed text-sm max-w-3xl mx-auto space-y-3">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          if (trimmed.startsWith('# ')) {
            return (
              <h1
                key={idx}
                className="text-2xl sm:text-3xl font-bold text-gray-900 border-b border-gray-300 pb-2 text-center uppercase tracking-wide font-google"
              >
                {trimmed.replace('# ', '')}
              </h1>
            );
          }
          if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
            const heading = trimmed.replace(/^#+\s*/, '');
            return (
              <h3
                key={idx}
                className="text-sm sm:text-base font-bold text-blue-900 uppercase tracking-wider border-b-2 border-blue-600/30 pb-1 pt-3 font-google"
              >
                {heading}
              </h3>
            );
          }
          if (trimmed.startsWith('---')) {
            return <hr key={idx} className="my-2 border-gray-200" />;
          }
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const bullet = trimmed.replace(/^[-*]\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-blue-600 mt-1.5 text-xs select-none">•</span>
                <span
                  className="flex-1 text-xs sm:text-sm text-gray-800"
                  dangerouslySetInnerHTML={{
                    __html: bullet
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900 font-semibold">$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em class="text-gray-700 italic">$1</em>'),
                  }}
                />
              </div>
            );
          }
          if (trimmed === '') {
            return <div key={idx} className="h-1" />;
          }

          return (
            <p
              key={idx}
              className="text-xs sm:text-sm text-gray-700 leading-normal"
              dangerouslySetInnerHTML={{
                __html: line
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900 font-semibold">$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em class="text-gray-700 italic">$1</em>'),
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Transformation Executive Highlight */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border border-blue-100/80 rounded-2xl p-4 shadow-xs flex items-start gap-3">
        <div className="p-2 bg-blue-600 text-white rounded-xl mt-0.5 shadow-xs">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider mb-0.5">
            Tailoring Executive Summary
          </h4>
          <p className="text-xs sm:text-sm text-blue-900 leading-relaxed font-sans">
            {tailoredSummary}
          </p>
        </div>
      </div>

      {/* Main Document Container Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Document Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-gray-100 bg-gray-50/70">
          {/* Sub-view switcher */}
          <div className="flex items-center bg-gray-200/70 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setViewTab('formatted')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewTab === 'formatted'
                  ? 'bg-white text-gray-900 shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setViewTab('compare')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewTab === 'compare'
                  ? 'bg-white text-gray-900 shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
            <button
              onClick={() => setViewTab('editor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewTab === 'editor'
                  ? 'bg-white text-gray-900 shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Text</span>
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                copied
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900 shadow-xs'
              }`}
              title="Copy tailored resume text"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Resume</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-xs"
              title="Download as Plain Text file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">.TXT</span>
            </button>

            <button
              onClick={handleDownloadMd}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-xs"
              title="Download as Markdown file"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">.MD</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-xs"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
          </div>
        </div>

        {/* View Mode Content */}
        <div className="p-4 sm:p-8 bg-white min-h-[480px]">
          {viewTab === 'formatted' && (
            <div className="bg-white p-6 sm:p-10 border border-gray-200 rounded-xl shadow-xs">
              {renderFormattedResume(resumeText)}
            </div>
          )}

          {viewTab === 'compare' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Resume Side */}
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/60 flex flex-col">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-200">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Original Resume
                  </span>
                  <span className="text-[11px] text-gray-400">Read-only comparison</span>
                </div>
                <div className="font-mono text-xs text-gray-600 whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[600px] p-2 bg-white rounded-lg border border-gray-100">
                  {originalResume}
                </div>
              </div>

              {/* Tailored Resume Side */}
              <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/20 flex flex-col">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-blue-200">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-blue-600" /> Tailored Rewrite
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ATS Aligned
                  </span>
                </div>
                <div className="font-mono text-xs text-gray-900 whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[600px] p-2 bg-white rounded-lg border border-blue-100">
                  {resumeText}
                </div>
              </div>
            </div>
          )}

          {viewTab === 'editor' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Directly edit the markdown below before copying or exporting:</span>
                <span className="font-mono">{resumeText.length} characters</span>
              </div>
              <textarea
                value={resumeText}
                onChange={handleTextChange}
                rows={22}
                className="w-full p-4 font-mono text-xs sm:text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
