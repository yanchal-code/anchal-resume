/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FileText,
  Briefcase,
  Layers,
  Award,
  ChevronDown,
  Info,
  AlertTriangle,
  History,
  Save,
  Check,
  Building,
} from 'lucide-react';
import { Header } from './components/Header.js';
import { InputPanel } from './components/InputPanel.js';
import { ScoreGauge } from './components/ScoreGauge.js';
import { ChangesDiffList } from './components/ChangesDiffList.js';
import { GapsAnalysis } from './components/GapsAnalysis.js';
import { KeywordsMatrix } from './components/KeywordsMatrix.js';
import { TailoredResumeView } from './components/TailoredResumeView.js';
import { InterviewTips } from './components/InterviewTips.js';
import { HelpModal } from './components/HelpModal.js';
import { VersionsSidebar } from './components/VersionsSidebar.js';
import { PRESETS, Preset } from './data/presets.js';
import { useAuth } from './context/AuthContext.js';
import {
  saveResumeVersion,
  updateVersionStatus,
  deleteVersion,
  subscribeUserVersions,
  SavedVersion,
  ResumeStatus,
} from './firebase/versionsService.js';
import type { TailorResponse, TailorRequest } from './types/resume.js';

const ALL_STATUSES: ResumeStatus[] = ['Draft', 'Applied', 'Interview', 'Offer', 'Rejected'];

const STATUS_PILL: Record<ResumeStatus, { bg: string; text: string; border: string }> = {
  Draft: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
  Applied: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Interview: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Offer: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  Rejected: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
};

export default function App() {
  const { user, signInWithGoogle } = useAuth();

  // Input states
  const [resume, setResume] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [company, setCompany] = useState<string>('Google / Cloud Platform');
  const [role, setRole] = useState<string>('Senior Full Stack Software Engineer');
  const [seniority, setSeniority] = useState<'standard' | 'senior' | 'executive' | 'specialist'>('senior');
  const [focus, setFocus] = useState<'balanced' | 'metrics' | 'ats_keywords'>('balanced');
  const [activePresetId, setActivePresetId] = useState<string>('');

  // Execution states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('Analyzing job requirements...');
  const [error, setError] = useState<string | null>(null);
  const [tailorResult, setTailorResult] = useState<TailorResponse | null>(null);

  // Versions and tracking state
  const [versions, setVersions] = useState<SavedVersion[]>([]);
  const [isVersionsOpen, setIsVersionsOpen] = useState<boolean>(false);
  const [activeVersionId, setActiveVersionId] = useState<string | undefined>(undefined);
  const [currentStatus, setCurrentStatus] = useState<ResumeStatus>('Draft');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // View state
  const [activeTab, setActiveTab] = useState<'changes' | 'gaps' | 'keywords' | 'resume' | 'tips'>('changes');
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Initialize with the first preset so the app is immediately demonstrative and useful
  useEffect(() => {
    const defaultPreset = PRESETS[0];
    setResume(defaultPreset.resume);
    setJobDescription(defaultPreset.jobDescription);
    setCompany(defaultPreset.companyHint || 'Google');
    setRole('Senior Full Stack Software Engineer');
    setActivePresetId(defaultPreset.id);
  }, []);

  // Subscribe to user versions in Firestore when authenticated
  useEffect(() => {
    if (!user) {
      setVersions([]);
      return;
    }

    const unsubscribe = subscribeUserVersions(
      user.uid,
      (fetchedVersions) => {
        setVersions(fetchedVersions);
      },
      (err) => {
        console.error('Error in versions subscription:', err);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleSelectPreset = (preset: Preset) => {
    setResume(preset.resume);
    setJobDescription(preset.jobDescription);
    setCompany(preset.companyHint || 'Tech Enterprise');
    setRole(preset.role.split('➔')[1]?.trim() || preset.role);
    setActivePresetId(preset.id);
    setActiveVersionId(undefined);
    setTailorResult(null);
    setError(null);
  };

  const handleReset = () => {
    setResume('');
    setJobDescription('');
    setCompany('');
    setRole('');
    setActivePresetId('');
    setActiveVersionId(undefined);
    setTailorResult(null);
    setError(null);
  };

  // Keyboard shortcut: Cmd/Ctrl + Enter triggers tailoring
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (resume.trim() && jobDescription.trim() && !isLoading) {
          handleTailorResume();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resume, jobDescription, seniority, focus, isLoading]);

  const handleTailorResume = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError('Please provide both your resume and the target job description.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSaveSuccessMsg(null);

    // Progressive loading messages
    const steps = [
      'Extracting core job competencies and technical requirements...',
      'Benchmarking original resume ATS compatibility score...',
      'Upgrading passive bullet points with high-impact action verbs...',
      'Checking against strict NEVER INVENT rule...',
      'Auditing side-by-side wording diffs and residual gaps...',
    ];
    let stepIndex = 0;
    setLoadingStep(steps[0]);
    const interval = setInterval(() => {
      stepIndex = (stepIndex + 1) % steps.length;
      setLoadingStep(steps[stepIndex]);
    }, 1800);

    try {
      const payload: TailorRequest = {
        resume,
        jobDescription,
        seniority,
        focus,
      };

      const response = await fetch('/api/tailor-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data: TailorResponse = await response.json();
      setTailorResult(data);
      setActiveTab('changes');

      // Auto-save to Firestore if signed in
      if (user) {
        try {
          const savedId = await saveResumeVersion(user.uid, {
            company: company.trim() || 'Target Company',
            role: role.trim() || 'Target Role',
            status: 'Draft',
            resume,
            jobDescription,
            tailorResult: data,
          });
          setActiveVersionId(savedId);
          setCurrentStatus('Draft');
          setSaveSuccessMsg('Saved to your Firestore versions as Draft');
          setTimeout(() => setSaveSuccessMsg(null), 4000);
        } catch (saveErr) {
          console.error('Auto-save error:', saveErr);
        }
      }

      // Smooth scroll down to results after short delay
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Tailoring error:', err);
      setError(err?.message || 'Failed to tailor resume. Please try again.');
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  // Reopen a saved version from the sidebar
  const handleSelectVersion = (version: SavedVersion) => {
    setResume(version.resume);
    setJobDescription(version.jobDescription);
    setCompany(version.company);
    setRole(version.role);
    setCurrentStatus(version.status);
    setActiveVersionId(version.id);

    if (version.tailorResult) {
      setTailorResult(version.tailorResult);
    } else {
      // Reconstruct TailorResponse
      setTailorResult({
        beforeScore: version.beforeScore,
        afterScore: version.afterScore,
        scoreAnalysis: version.scoreAnalysis || 'Saved resume version loaded from Firestore.',
        scoreBreakdown: {
          technicalSkills: { before: version.beforeScore, after: version.afterScore },
          experienceAlignment: { before: version.beforeScore, after: version.afterScore },
          atsKeywords: { before: version.beforeScore, after: version.afterScore },
        },
        keywords: [],
        changes: [],
        gaps: [],
        tailoredResume: version.tailoredResume,
        tailoredSummary: version.tailoredSummary,
        interviewTips: [],
        matchStrengths: [],
      });
    }

    setActiveTab('resume');
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Manual save or update
  const handleSaveCurrentVersion = async () => {
    if (!user) {
      signInWithGoogle();
      return;
    }
    if (!tailorResult) return;

    try {
      const savedId = await saveResumeVersion(user.uid, {
        company: company.trim() || 'Target Company',
        role: role.trim() || 'Target Role',
        status: currentStatus,
        resume,
        jobDescription,
        tailorResult,
      });
      setActiveVersionId(savedId);
      setSaveSuccessMsg(`Saved version for ${company || 'role'} to Firestore!`);
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    } catch (err: any) {
      console.error('Save version error:', err);
      setError('Failed to save version to Firestore.');
    }
  };

  // Update status
  const handleUpdateStatus = async (versionId: string, newStatus: ResumeStatus) => {
    if (!user) return;
    try {
      await updateVersionStatus(user.uid, versionId, newStatus);
      if (activeVersionId === versionId) {
        setCurrentStatus(newStatus);
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  // Delete version
  const handleDeleteVersion = async (versionId: string) => {
    if (!user) return;
    try {
      await deleteVersion(user.uid, versionId);
      if (activeVersionId === versionId) {
        setActiveVersionId(undefined);
      }
    } catch (err) {
      console.error('Delete version error:', err);
    }
  };

  const hasContent = resume.trim().length > 0 || jobDescription.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#f8fafd] flex flex-col font-sans">
      {/* Header with Google Sign In & Versions Toggle */}
      <Header
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
        activePresetId={activePresetId}
        hasContent={hasContent}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenVersions={() => setIsVersionsOpen(true)}
        versionsCount={versions.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Hero Tagline Banner */}
        <div className="text-center py-4 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200/80 text-xs font-medium text-gray-700 shadow-2xs mb-1">
            <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
            Smart ATS Match • Never Invent Guarantee • Firestore Tracking
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-google">
            Tailor Your Resume to Any Job
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Paste your resume and job description. Gemini rewrites your bullet points using strictly your verified experience, identifies missing gaps with honest advice, and saves every version to your private Firestore.
          </p>
        </div>

        {/* Input Panel with Company and Role */}
        <InputPanel
          resume={resume}
          setResume={setResume}
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          company={company}
          setCompany={setCompany}
          role={role}
          setRole={setRole}
          seniority={seniority}
          setSeniority={setSeniority}
          focus={focus}
          setFocus={setFocus}
          onTailor={handleTailorResume}
          isLoading={isLoading}
          onSelectPreset={handleSelectPreset}
          activePresetId={activePresetId}
        />

        {/* Loading Indicator */}
        {isLoading && (
          <div className="bg-white rounded-2xl border border-blue-200 p-8 shadow-xs text-center space-y-4 animate-fade-in">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-3 border-blue-100 border-t-blue-600 animate-spin" />
              <Sparkles className="w-5 h-5 text-blue-600 absolute" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 font-google">
                Tailoring Your Resume with Gemini...
              </h3>
              <p className="text-xs text-blue-700 font-medium mt-1 animate-pulse">
                {loadingStep}
              </p>
            </div>
            <div className="max-w-xs mx-auto bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-2/3 animate-pulse rounded-full" />
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-semibold block mb-0.5">Optimization Error</strong>
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-500 hover:text-rose-800 font-medium text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Results Container */}
        {tailorResult && (
          <div ref={resultsRef} className="space-y-6 pt-4 animate-fade-in">
            {/* Application & Firestore Tracking Bar */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{company || 'Target Company'}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-600 font-medium">{role || 'Target Role'}</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1.5">
                    {user ? (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Firestore Synced (users/{user.uid.slice(0, 8)}.../versions)
                      </span>
                    ) : (
                      <span>Sign in to automatically sync versions to Firestore</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Selector & Save Button */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-xl border border-gray-200 text-xs">
                  <span className="text-gray-500 font-medium text-[11px]">Status:</span>
                  <select
                    aria-label="Application status"
                    value={currentStatus}
                    onChange={(e) => {
                      const newSt = e.target.value as ResumeStatus;
                      setCurrentStatus(newSt);
                      if (activeVersionId && user) {
                        handleUpdateStatus(activeVersionId, newSt);
                      }
                    }}
                    className={`text-xs font-bold px-2 py-0.5 rounded-md border cursor-pointer focus:outline-none ${STATUS_PILL[currentStatus].bg} ${STATUS_PILL[currentStatus].text} ${STATUS_PILL[currentStatus].border}`}
                  >
                    {ALL_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleSaveCurrentVersion}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
                  title="Save current tailored resume to Firestore"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{user ? 'Save Version' : 'Sign in to Save'}</span>
                </button>
              </div>
            </div>

            {/* Save Success Toast */}
            {saveSuccessMsg && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 text-xs text-emerald-800 font-medium flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* Match Score Gauge Banner (Before & After) */}
            <ScoreGauge
              beforeScore={tailorResult.beforeScore}
              afterScore={tailorResult.afterScore}
              scoreAnalysis={tailorResult.scoreAnalysis}
              scoreBreakdown={tailorResult.scoreBreakdown}
              matchStrengths={tailorResult.matchStrengths}
            />

            {/* Results Tab Navigation */}
            <div className="bg-white rounded-2xl border border-gray-200 p-1.5 shadow-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1">
                {/* Tab 1: What Changed */}
                <button
                  onClick={() => setActiveTab('changes')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'changes'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>What Changed</span>
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === 'changes'
                        ? 'bg-blue-700 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tailorResult.changes.length}
                  </span>
                </button>

                {/* Tab 2: Gaps */}
                <button
                  onClick={() => setActiveTab('gaps')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'gaps'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-amber-200" />
                  <span>Gaps</span>
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === 'gaps'
                        ? 'bg-amber-700 text-white'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {tailorResult.gaps?.length || 0}
                  </span>
                </button>

                {/* Tab 3: Job Keywords */}
                <button
                  onClick={() => setActiveTab('keywords')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'keywords'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Job Keywords</span>
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === 'keywords'
                        ? 'bg-blue-700 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tailorResult.keywords.length}
                  </span>
                </button>

                {/* Tab 4: Tailored Resume */}
                <button
                  onClick={() => setActiveTab('resume')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'resume'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Tailored Resume</span>
                </button>

                {/* Tab 5: Interview Prep */}
                <button
                  onClick={() => setActiveTab('tips')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'tips'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Interview Prep</span>
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === 'tips'
                        ? 'bg-blue-700 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tailorResult.interviewTips?.length || 3}
                  </span>
                </button>
              </div>

              {/* Quick Jump indicator */}
              <div className="hidden lg:flex items-center gap-2 text-xs text-gray-400 px-3">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Strict Rule: Never Invent • Factual rewrites only</span>
              </div>
            </div>

            {/* Tab Views */}
            {activeTab === 'changes' && (
              <ChangesDiffList changes={tailorResult.changes} />
            )}

            {activeTab === 'gaps' && (
              <GapsAnalysis gaps={tailorResult.gaps} />
            )}

            {activeTab === 'keywords' && (
              <KeywordsMatrix keywords={tailorResult.keywords} />
            )}

            {activeTab === 'resume' && (
              <TailoredResumeView
                tailoredResume={tailorResult.tailoredResume}
                originalResume={resume}
                tailoredSummary={tailorResult.tailoredSummary}
                onUpdateTailoredResume={(newText) => {
                  setTailorResult({ ...tailorResult, tailoredResume: newText });
                }}
              />
            )}

            {activeTab === 'tips' && (
              <InterviewTips tips={tailorResult.interviewTips} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-6 text-center text-xs text-gray-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Resume Tailor</span>
            <span className="text-gray-300">•</span>
            <span>Clean, friendly Google-style resume optimization & Firestore version tracking</span>
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            <span>Powered by Gemini 3.8 Flash</span>
            <button
              onClick={() => setIsHelpOpen(true)}
              className="hover:text-blue-600 transition-colors"
            >
              How it works
            </button>
          </div>
        </div>
      </footer>

      {/* Versions Sidebar Drawer */}
      <VersionsSidebar
        isOpen={isVersionsOpen}
        onClose={() => setIsVersionsOpen(false)}
        versions={versions}
        activeVersionId={activeVersionId}
        onSelectVersion={handleSelectVersion}
        onUpdateStatus={handleUpdateStatus}
        onDeleteVersion={handleDeleteVersion}
      />

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
