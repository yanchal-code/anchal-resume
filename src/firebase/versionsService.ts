import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config.js';
import { handleFirestoreError, OperationType } from './errorHandling.js';
import type { TailorResponse } from '../types/resume.js';

export type ResumeStatus = 'Draft' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export interface SavedVersion {
  id: string;
  userId: string;
  company: string;
  role: string;
  status: ResumeStatus;
  date: string; // Formatted date e.g. "Oct 15, 2026"
  beforeScore: number;
  afterScore: number;
  resume: string;
  jobDescription: string;
  tailoredResume: string;
  tailoredSummary: string;
  scoreAnalysis?: string;
  tailorResult?: TailorResponse;
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Save a tailored resume version to Firestore under /users/{uid}/versions/{versionId}
 */
export async function saveResumeVersion(
  userId: string,
  payload: {
    company: string;
    role: string;
    status: ResumeStatus;
    resume: string;
    jobDescription: string;
    tailorResult: TailorResponse;
  }
): Promise<string> {
  const versionId = `ver_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const path = `users/${userId}/versions/${versionId}`;

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const versionData: Record<string, any> = {
    id: versionId,
    userId,
    company: payload.company.trim() || 'Target Company',
    role: payload.role.trim() || 'Target Role',
    status: payload.status || 'Draft',
    date: dateFormatted,
    beforeScore: Number(payload.tailorResult.beforeScore) || 0,
    afterScore: Number(payload.tailorResult.afterScore) || 0,
    resume: payload.resume,
    jobDescription: payload.jobDescription,
    tailoredResume: payload.tailorResult.tailoredResume,
    tailoredSummary: payload.tailorResult.tailoredSummary || '',
    scoreAnalysis: payload.tailorResult.scoreAnalysis || '',
    tailorResult: payload.tailorResult,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'users', userId, 'versions', versionId), versionData);
    return versionId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Update the status of an existing resume version
 */
export async function updateVersionStatus(
  userId: string,
  versionId: string,
  newStatus: ResumeStatus
): Promise<void> {
  const path = `users/${userId}/versions/${versionId}`;
  try {
    await updateDoc(doc(db, 'users', userId, 'versions', versionId), {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Delete a resume version
 */
export async function deleteVersion(
  userId: string,
  versionId: string
): Promise<void> {
  const path = `users/${userId}/versions/${versionId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'versions', versionId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Real-time listener for user resume versions sorted by creation
 */
export function subscribeUserVersions(
  userId: string,
  onVersions: (versions: SavedVersion[]) => void,
  onError?: (err: any) => void
): () => void {
  const versionsPath = `users/${userId}/versions`;
  const versionsRef = collection(db, 'users', userId, 'versions');

  return onSnapshot(
    versionsRef,
    (snapshot) => {
      const versions: SavedVersion[] = [];
      snapshot.forEach((docSnap) => {
        versions.push(docSnap.data() as SavedVersion);
      });

      // Sort by newest first
      versions.sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });

      onVersions(versions);
    },
    (error) => {
      console.error('Versions subscription error:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, versionsPath);
    }
  );
}
