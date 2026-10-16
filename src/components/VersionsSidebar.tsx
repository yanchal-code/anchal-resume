import React, { useState } from 'react';
import {
  X,
  History,
  FolderOpen,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  Briefcase,
  Building,
  TrendingUp,
  Filter,
  Sparkles,
  ChevronRight,
  LogIn,
} from 'lucide-react';
import type { SavedVersion, ResumeStatus } from '../firebase/versionsService.js';
import { useAuth } from '../context/AuthContext.js';

interface VersionsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  versions: SavedVersion[];
  onSelectVersion: (version: SavedVersion) => void;
  onUpdateStatus: (versionId: string, status: ResumeStatus) => void;
  onDeleteVersion: (versionId: string) => void;
  activeVersionId?: string;
}

const STATUS_CONFIG: Record<
  ResumeStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  Draft: {
    label: 'Draft',
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300',
    dot: 'bg-gray-400',
  },
  Applied: {
    label: 'Applied',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  Interview: {
    label: 'Interview',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    dot: 'bg-purple-500',
  },
  Offer: {
    label: 'Offer',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    dot: 'bg-emerald-600',
  },
  Rejected: {
    label: 'Rejected',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-400',
  },
};

const ALL_STATUSES: ResumeStatus[] = ['Draft', 'Applied', 'Interview', 'Offer', 'Rejected'];

export const VersionsSidebar: React.FC<VersionsSidebarProps> = ({
  isOpen,
  onClose,
  versions,
  onSelectVersion,
  onUpdateStatus,
  onDeleteVersion,
  activeVersionId,
}) => {
  const { user, signInWithGoogle } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredVersions = versions.filter((ver) => {
    const matchesStatus = statusFilter === 'all' || ver.status === statusFilter;
    const matchesSearch =
      search === '' ||
      ver.company.toLowerCase().includes(search.toLowerCase()) ||
      ver.role.toLowerCase().includes(search.toLowerCase()) ||
      ver.date.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-gray-200">
        {/* Top Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 font-google">
                Resume Versions
              </h2>
              <p className="text-xs text-gray-500">
                {user ? `${versions.length} saved applications in Firestore` : 'Sign in to save and manage versions'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Not Logged In Prompt */}
        {!user ? (
          <div className="p-6 text-center space-y-4 my-auto">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-blue-100">
              <History className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 font-google">
                Track Application Versions
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Sign in with Google to automatically save every tailored resume to your private Firestore database, track application status, and reopen past versions anytime.
              </p>
            </div>
            <button
              onClick={signInWithGoogle}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign in with Google</span>
            </button>
          </div>
        ) : (
          <>
            {/* Search and Status Filters */}
            <div className="p-3 border-b border-gray-100 bg-white space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by company or role..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Status filter chips */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-gray-900 text-white font-semibold'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All ({versions.length})
                </button>
                {ALL_STATUSES.map((st) => {
                  const count = versions.filter((v) => v.status === st).length;
                  const cfg = STATUS_CONFIG[st];
                  const active = statusFilter === st;
                  return (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors border ${
                        active
                          ? `${cfg.bg} ${cfg.text} ${cfg.border} font-bold ring-1 ring-blue-500/30`
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {st} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Versions List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {filteredVersions.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs">
                  {versions.length === 0 ? (
                    <div className="space-y-2">
                      <Clock className="w-8 h-8 text-gray-300 mx-auto" />
                      <p className="font-medium text-gray-600">No versions saved yet.</p>
                      <p className="text-[11px]">
                        Tailor a resume and click "Save Version" or enable auto-save to build your application history.
                      </p>
                    </div>
                  ) : (
                    <p>No versions match your current search or filter.</p>
                  )}
                </div>
              ) : (
                filteredVersions.map((ver) => {
                  const isActive = activeVersionId === ver.id;
                  const cfg = STATUS_CONFIG[ver.status] || STATUS_CONFIG.Draft;
                  const scoreBoost = Math.max(0, ver.afterScore - ver.beforeScore);

                  return (
                    <div
                      key={ver.id}
                      className={`rounded-xl border p-3.5 transition-all text-xs bg-white ${
                        isActive
                          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-xs'
                      }`}
                    >
                      {/* Company & Role Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 truncate text-sm">
                            {ver.role}
                          </h4>
                          <div className="flex items-center gap-1.5 text-gray-500 text-[11px] mt-0.5">
                            <Building className="w-3 h-3 text-gray-400 shrink-0" />
                            <span className="font-medium text-gray-700 truncate">
                              {ver.company}
                            </span>
                            <span>•</span>
                            <span className="text-gray-400">{ver.date}</span>
                          </div>
                        </div>

                        {/* Interactive Status Selector */}
                        <div className="relative">
                          <select
                            aria-label="Update status"
                            value={ver.status}
                            onChange={(e) =>
                              onUpdateStatus(ver.id, e.target.value as ResumeStatus)
                            }
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-md border cursor-pointer focus:outline-none ${cfg.bg} ${cfg.text} ${cfg.border}`}
                          >
                            {ALL_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Scores Banner */}
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg px-2.5 py-1.5 mb-2.5 border border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-gray-500">ATS Match:</span>
                          <span className="font-mono text-gray-600 font-medium">
                            {ver.beforeScore}%
                          </span>
                          <span className="text-gray-300">➔</span>
                          <span className="font-mono font-bold text-emerald-700">
                            {ver.afterScore}%
                          </span>
                        </div>
                        {scoreBoost > 0 && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            +{scoreBoost}%
                          </span>
                        )}
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                        <button
                          onClick={() => {
                            onSelectVersion(ver);
                            onClose();
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                          <span>Reopen</span>
                        </button>

                        {confirmDeleteId === ver.id ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-red-600 font-medium">Delete?</span>
                            <button
                              onClick={() => {
                                onDeleteVersion(ver.id);
                                setConfirmDeleteId(null);
                              }}
                              className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold hover:bg-red-700"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] hover:bg-gray-200"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(ver.id)}
                            className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                            title="Delete this version"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
