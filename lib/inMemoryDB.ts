// app/lib/inMemoryDB.ts
export type Candidate = {
  id: number;
  name: string;
  email: string;
  contact?: string;
  tier: number;
  knowsHtmlCssJs: boolean;
  knowsReactNext: boolean;
  canBuildCrud: boolean;
  canBuildAuth: boolean;
  knowsBackendFrameworks: boolean;
  knowsGolang: boolean;
  knowsCloudInfra: boolean;
  knowsSystemDesign: boolean;
  createdAt: Date;
};

import { loadCandidates, addCandidateToFile, getCandidatesFromFile, deleteCandidateFromFile } from './persistentDB';

// Load candidates from persistent storage on module initialization
export let candidates: Candidate[] = [];

// Initialize candidates from file
try {
  candidates = loadCandidates();
  console.log('Loaded candidates from persistent storage:', candidates.length);
} catch (error) {
  console.error('Failed to load candidates, using empty array:', error);
  candidates = [];
}

// Helper functions for persistence
export function addCandidate(candidate: Candidate) {
  // Add to in-memory array
  candidates.unshift(candidate);
  
  // Save to persistent storage immediately
  addCandidateToFile(candidate);
  
  console.log('Added candidate to both memory and file:', candidate.name);
  console.log('Total candidates:', candidates.length);
}

export function getAllCandidates(): Candidate[] {
  // Always load fresh data from file to ensure consistency
  candidates = getCandidatesFromFile();
  console.log('Getting all candidates from file, count:', candidates.length);
  return candidates;
}

export function removeCandidate(candidateId: number): boolean {
  // Remove from in-memory array
  const index = candidates.findIndex(c => c.id === candidateId);
  if (index > -1) {
    candidates.splice(index, 1);
  }
  
  // Remove from persistent storage
  const success = deleteCandidateFromFile(candidateId);
  
  if (success) {
    console.log('Removed candidate from both memory and file:', candidateId);
  }
  
  return success;
}
