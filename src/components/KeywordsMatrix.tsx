import React, { useState } from 'react';
import {
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Search,
  Layers,
  Filter,
  Check,
  Zap,
  Info,
} from 'lucide-react';
import type { KeywordItem } from '../types/resume.js';

interface KeywordsMatrixProps {
  keywords: KeywordItem[];
}

export const KeywordsMatrix: React.FC<KeywordsMatrixProps> = ({ keywords }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'newly_added' | 'already_matched' | 'gap_suggestion'>('all');
  const [search, setSearch] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordItem | null>(null);

  const matchedCount = keywords.filter((k) => k.status === 'already_matched' || k.status === 'newly_added').length;
  const newlyAddedCount = keywords.filter((k) => k.status === 'newly_added').length;
  const alreadyMatchedCount = keywords.filter((k) => k.status === 'already_matched').length;
  const gapCount = keywords.filter((k) => k.status === 'gap_suggestion').length;

  const coveragePercentage = keywords.length > 0 ? Math.round((matchedCount / keywords.length) * 100) : 0;

  // Filter
  const filtered = keywords.filter((k) => {
    const matchesFilter = activeFilter === 'all' || k.status === activeFilter;
    const matchesSearch =
      search === '' ||
      k.keyword.toLowerCase().includes(search.toLowerCase()) ||
      k.category.toLowerCase().includes(search.toLowerCase()) ||
      k.context.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Group by Category
  const categories = Array.from(new Set(filtered.map((k) => k.category || 'General')));

  const getStatusBadge = (status: KeywordItem['status']) => {
    switch (status) {
      case 'newly_added':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-blue-600" />,
          label: 'Added by Tailor',
          containerClass: 'bg-blue-50 text-blue-900 border-blue-200 hover:border-blue-300',
          dot: 'bg-blue-600',
        };
      case 'already_matched':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
          label: 'In Original Resume',
          containerClass: 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:border-emerald-300',
          dot: 'bg-emerald-600',
        };
      case 'gap_suggestion':
      default:
        return {
          icon: <Info className="w-3.5 h-3.5 text-amber-600" />,
          label: 'Interview Talking Point',
          containerClass: 'bg-amber-50 text-amber-900 border-amber-200 hover:border-amber-300',
          dot: 'bg-amber-500',
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Coverage Summary Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900 font-google flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Target Job Keyword Coverage
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Identified core technical competencies and terminology extracted from the job posting
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-gray-500 font-medium">ATS Keyword Coverage</div>
              <div className="text-lg font-bold text-emerald-700 font-google">
                {coveragePercentage}%{' '}
                <span className="text-xs font-normal text-gray-400">
                  ({matchedCount}/{keywords.length})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === 'all'
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Keywords ({keywords.length})
            </button>
            <button
              onClick={() => setActiveFilter('newly_added')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeFilter === 'newly_added'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              Newly Added ({newlyAddedCount})
            </button>
            <button
              onClick={() => setActiveFilter('already_matched')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeFilter === 'already_matched'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              Previously Matched ({alreadyMatchedCount})
            </button>
            <button
              onClick={() => setActiveFilter('gap_suggestion')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeFilter === 'gap_suggestion'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Info className="w-3 h-3" />
              Interview Topics ({gapCount})
            </button>
          </div>

          {/* Keyword Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search target keyword..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      {/* Categorized Keyword Grid */}
      <div className="space-y-4">
        {categories.map((category) => {
          const categoryKeywords = filtered.filter((k) => (k.category || 'General') === category);
          if (categoryKeywords.length === 0) return null;

          return (
            <div
              key={category}
              className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs"
            >
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-blue-600 rounded-full inline-block"></span>
                {category}
                <span className="text-gray-400 font-normal">({categoryKeywords.length})</span>
              </h4>

              <div className="flex flex-wrap gap-2.5">
                {categoryKeywords.map((k, idx) => {
                  const statusInfo = getStatusBadge(k.status);
                  const isSelected = selectedKeyword?.keyword === k.keyword;

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedKeyword(isSelected ? null : k)}
                      className={`group flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left cursor-pointer ${
                        statusInfo.containerClass
                      } ${isSelected ? 'ring-2 ring-blue-500/50 shadow-sm' : ''}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
                      <span className="font-semibold text-gray-900">{k.keyword}</span>
                      <span className="opacity-70 group-hover:opacity-100 transition-opacity">
                        {statusInfo.icon}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Keyword Detail Modal / Drawer Card */}
      {selectedKeyword && (
        <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-4 shadow-sm flex items-start justify-between gap-3 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h5 className="text-sm font-bold text-blue-950 font-google">
                  {selectedKeyword.keyword}
                </h5>
                <span className="text-[11px] font-medium text-blue-700 bg-white/80 px-2 py-0.5 rounded-md border border-blue-200">
                  {selectedKeyword.category}
                </span>
                <span className="text-[11px] font-medium text-gray-600 bg-white/80 px-2 py-0.5 rounded-md">
                  Status: {getStatusBadge(selectedKeyword.status).label}
                </span>
              </div>
              <p className="text-xs text-blue-900 mt-1 leading-relaxed">
                {selectedKeyword.context}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedKeyword(null)}
            className="text-blue-500 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded-md hover:bg-blue-100 transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
