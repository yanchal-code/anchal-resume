import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  RotateCcw,
  HelpCircle,
  History,
  LogIn,
  LogOut,
  User as UserIcon,
  ChevronDown,
} from 'lucide-react';
import { PRESETS, Preset } from '../data/presets.js';
import { useAuth } from '../context/AuthContext.js';

interface HeaderProps {
  onSelectPreset: (preset: Preset) => void;
  onReset: () => void;
  activePresetId?: string;
  hasContent: boolean;
  onOpenHelp: () => void;
  onOpenVersions: () => void;
  versionsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectPreset,
  onReset,
  activePresetId,
  hasContent,
  onOpenHelp,
  onOpenVersions,
  versionsCount,
}) => {
  const { user, signInWithGoogle, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white shadow-sm ring-1 ring-blue-500/20">
              <FileText className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500 border-2 border-white"></span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-gray-900 font-google">
                  Resume Tailor
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  <Sparkles className="w-3 h-3 mr-1 text-blue-600" />
                  Gemini Flash
                </span>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block">
                ATS Optimization • Never Invent Guarantee • Firestore Tracking
              </p>
            </div>
          </div>

          {/* Actions & Presets */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Presets Menu */}
            <div className="hidden lg:flex items-center gap-1.5 bg-gray-50 p-1 rounded-lg border border-gray-200/80">
              <span className="text-xs font-medium text-gray-500 px-2">Sample:</span>
              {PRESETS.map((p) => {
                const isActive = activePresetId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectPreset(p)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                      isActive
                        ? 'bg-white text-blue-700 shadow-xs font-semibold border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            {/* Versions Sidebar Toggle */}
            <button
              onClick={onOpenVersions}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all shadow-2xs relative"
              title="Open saved versions"
            >
              <History className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Versions</span>
              {user && versionsCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                  {versionsCount}
                </span>
              )}
            </button>

            {/* Help / ATS Guide */}
            <button
              onClick={onOpenHelp}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="How Resume Tailor works"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Reset Button */}
            {hasContent && (
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                title="Clear resume and job description"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Reset</span>
              </button>
            )}

            {/* Google Authentication */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-6 h-6 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                      {user.displayName?.[0] || 'U'}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-gray-800 hidden sm:inline max-w-[100px] truncate">
                    {user.displayName?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 text-xs animate-fade-in">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="font-semibold text-gray-900 truncate">
                        {user.displayName || 'Google User'}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenVersions();
                      }}
                      className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <History className="w-4 h-4 text-blue-600" />
                      <span>My Resume Versions ({versionsCount})</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold border border-gray-300 shadow-2xs transition-all cursor-pointer"
              >
                {/* Google G logo */}
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="hidden sm:inline">Sign in with Google</span>
                <span className="sm:hidden">Sign in</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
