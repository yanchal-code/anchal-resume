import React, { useState } from 'react';
import {
  ArrowRight,
  Copy,
  Check,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
  ArrowUpDown,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';
import type { WordingChange } from '../types/resume.js';

interface ChangesDiffListProps {
  changes: WordingChange[];
}

export const ChangesDiffList: React.FC<ChangesDiffListProps> = ({ changes }) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'card' | 'split'>('card');

  // Extract unique sections
  const sections = ['all', ...Array.from(new Set(changes.map((c) => c.section)))];

  const filteredChanges = changes.filter((change) => {
    const matchesSection = selectedSection === 'all' || change.section === selectedSection;
    const matchesSearch =
      searchQuery === '' ||
      change.oldWording.toLowerCase().includes(searchQuery.toLowerCase()) ||
      change.newWording.toLowerCase().includes(searchQuery.toLowerCase()) ||
      change.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (change.keywordTargeted && change.keywordTargeted.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSection && matchesSearch;
  });

  const handleCopyNew = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getImpactBadge = (change: WordingChange) => {
    const type = change.impactType || '';
    if (type.includes('verb') || change.reason.toLowerCase().includes('verb')) {
      return {
        label: 'Action Verb Upgrade',
        className: 'bg-purple-50 text-purple-700 border-purple-200',
      };
    }
    if (type.includes('metric') || change.reason.toLowerCase().includes('metric') || change.reason.toLowerCase().includes('quantif')) {
      return {
        label: 'Quantified Impact',
        className: 'bg-blue-50 text-blue-700 border-blue-200',
      };
    }
    if (type.includes('keyword') || change.keywordTargeted) {
      return {
        label: 'Target Keyword',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
    }
    return {
      label: 'ATS Refinement',
      className: 'bg-amber-50 text-amber-700 border-amber-200',
    };
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search changes or keywords..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Section Filters & View Mode */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          {/* Section dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
            <select
              aria-label="Filter changes by section"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-gray-700 font-medium focus:outline-none"
            >
              {sections.map((sec) => (
                <option key={sec} value={sec}>
                  {sec === 'all' ? `All Sections (${changes.length})` : sec}
                </option>
              ))}
            </select>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200">
            <button
              onClick={() => setViewMode('card')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'card'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'split'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Side-by-Side
            </button>
          </div>
        </div>
      </div>

      {/* Summary Count */}
      <div className="flex items-center justify-between px-2 text-xs text-gray-500">
        <span>
          Showing <strong className="text-gray-800">{filteredChanges.length}</strong> of{' '}
          <strong className="text-gray-800">{changes.length}</strong> wording improvements
        </span>
        <span className="text-[11px] text-gray-400">
          Click copy to grab any newly phrased achievement bullet
        </span>
      </div>

      {/* Changes List */}
      {filteredChanges.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
          <p className="text-sm font-medium">No wording changes match your search filter.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSection('all');
            }}
            className="mt-2 text-xs text-blue-600 font-medium hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : viewMode === 'card' ? (
        /* Card Layout */
        <div className="space-y-3.5">
          {filteredChanges.map((change, index) => {
            const badge = getImpactBadge(change);
            const isCopied = copiedId === index;

            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4 sm:p-5 hover:border-blue-200 hover:shadow-sm transition-all"
              >
                {/* Header row: Section title & Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-800 bg-gray-100 px-2.5 py-0.5 rounded-md">
                      {change.section}
                    </span>
                    {change.keywordTargeted && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        <Tag className="w-3 h-3 text-blue-500" />
                        {change.keywordTargeted}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                    <button
                      onClick={() => handleCopyNew(change.newWording, index)}
                      className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border transition-all ${
                        isCopied
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      title="Copy new wording to clipboard"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy bullet</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Diff Grid: Old ➔ New */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch">
                  {/* Old Wording */}
                  <div className="bg-rose-50/50 border border-rose-200/70 rounded-xl p-3.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-800 mb-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                        Old Wording (Before)
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans line-through opacity-85">
                        {change.oldWording}
                      </p>
                    </div>
                  </div>

                  {/* New Wording */}
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 mb-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                        New Tailored Wording (After)
                      </div>
                      <p className="text-xs sm:text-sm text-gray-900 font-medium leading-relaxed font-sans">
                        {change.newWording}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Improvement Rationale */}
                <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-start gap-2 text-xs text-gray-600">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-800 font-medium">Why this works: </strong>
                    <span>{change.reason}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Side-by-Side Table Layout */
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-1/5">Section & Impact</th>
                  <th className="py-3 px-4 w-2/5 text-rose-800">Original Phrasing</th>
                  <th className="py-3 px-4 w-2/5 text-emerald-800">Tailored Phrasing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredChanges.map((change, index) => {
                  const badge = getImpactBadge(change);
                  const isCopied = copiedId === index;

                  return (
                    <tr key={index} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 align-top">
                        <span className="font-semibold text-gray-800 block mb-1">
                          {change.section}
                        </span>
                        <span
                          className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-md border ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                        {change.keywordTargeted && (
                          <span className="block mt-1 text-[10px] text-blue-600 font-medium">
                            • {change.keywordTargeted}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 align-top text-gray-600 bg-rose-50/20 line-through">
                        {change.oldWording}
                      </td>

                      <td className="py-3.5 px-4 align-top bg-emerald-50/20">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-gray-900 font-medium leading-relaxed">
                            {change.newWording}
                          </p>
                          <button
                            onClick={() => handleCopyNew(change.newWording, index)}
                            className="p-1 text-gray-400 hover:text-gray-700 rounded-md shrink-0 transition-colors"
                            title="Copy"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="mt-1 text-[11px] text-gray-500 italic">
                          Rationale: {change.reason}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
