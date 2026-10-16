export interface KeywordItem {
  keyword: string;
  category: 'Technical Skills' | 'Frameworks & Tools' | 'Architecture & Methods' | 'Leadership & Soft Skills' | 'Domain Knowledge' | string;
  status: 'already_matched' | 'newly_added' | 'gap_suggestion';
  context: string;
}

export interface WordingChange {
  id?: string;
  section: string;
  oldWording: string;
  newWording: string;
  reason: string;
  keywordTargeted?: string;
  impactType?: 'verb_upgrade' | 'quantified_metric' | 'keyword_match' | 'ats_clarity' | string;
}

export interface ScoreBreakdown {
  technicalSkills: { before: number; after: number };
  experienceAlignment: { before: number; after: number };
  atsKeywords: { before: number; after: number };
}

export interface ResumeGap {
  requirement: string;
  missingSkillOrArea: string;
  honestAdvice: string;
  severity: 'critical' | 'moderate' | 'nice_to_have' | string;
}

export interface TailorResponse {
  beforeScore: number;
  afterScore: number;
  scoreAnalysis: string;
  scoreBreakdown: ScoreBreakdown;
  keywords: KeywordItem[];
  changes: WordingChange[];
  gaps: ResumeGap[];
  tailoredResume: string;
  tailoredSummary: string;
  interviewTips: string[];
  matchStrengths: string[];
}

export interface TailorRequest {
  resume: string;
  jobDescription: string;
  seniority?: 'standard' | 'senior' | 'executive' | 'specialist';
  focus?: 'balanced' | 'metrics' | 'ats_keywords';
}
