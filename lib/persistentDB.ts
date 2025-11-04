import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { Candidate } from './inMemoryDB';

const DB_FILE = join(process.cwd(), 'data', 'candidates.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = join(process.cwd(), 'data');
  if (!existsSync(dataDir)) {
    try {
      require('fs').mkdirSync(dataDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create data directory:', error);
    }
  }
}

// Load candidates from file
export function loadCandidates(): Candidate[] {
  try {
    ensureDataDir();
    if (existsSync(DB_FILE)) {
      const data = readFileSync(DB_FILE, 'utf8');
      const candidates = JSON.parse(data);
      // Convert date strings back to Date objects
      return candidates.map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt)
      }));
    }
  } catch (error) {
    console.error('Failed to load candidates:', error);
  }
  
  // Return default candidates if file doesn't exist or error occurred
  return [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      contact: '+1234567890',
      tier: 2,
      knowsHtmlCssJs: true,
      knowsReactNext: true,
      canBuildCrud: true,
      canBuildAuth: true,
      knowsBackendFrameworks: false,
      knowsGolang: false,
      knowsCloudInfra: false,
      knowsSystemDesign: false,
      createdAt: new Date(),
    }
  ];
}

// Save candidates to file
export function saveCandidates(candidates: Candidate[]): void {
  try {
    ensureDataDir();
    writeFileSync(DB_FILE, JSON.stringify(candidates, null, 2), 'utf8');
    console.log('Candidates saved to file:', candidates.length);
  } catch (error) {
    console.error('Failed to save candidates:', error);
  }
}

// Add a single candidate and save immediately
export function addCandidateToFile(candidate: Candidate): void {
  const candidates = loadCandidates();
  candidates.unshift(candidate); // Add to beginning (newest first)
  saveCandidates(candidates);
  console.log('Added candidate to persistent storage:', candidate.name);
}

// Get all candidates from file
export function getCandidatesFromFile(): Candidate[] {
  return loadCandidates();
}

// Delete candidate from file
export function deleteCandidateFromFile(candidateId: number): boolean {
  const candidates = loadCandidates();
  const index = candidates.findIndex(c => c.id === candidateId);
  if (index > -1) {
    candidates.splice(index, 1);
    saveCandidates(candidates);
    return true;
  }
  return false;
}