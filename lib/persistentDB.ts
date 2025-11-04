import { Candidate } from './inMemoryDB';

// In-memory storage for serverless environments
let inMemoryCandidates: Candidate[] = [
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

// Check if we're in a serverless environment
const isServerless = process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.NODE_ENV === 'production';

// Ensure data directory exists (only for local development)
function ensureDataDir() {
  if (isServerless) return;
  
  try {
    const { join } = require('path');
    const { existsSync, mkdirSync } = require('fs');
    const dataDir = join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }
  } catch (error) {
    console.error('Failed to create data directory:', error);
  }
}

// Load candidates from file or memory
export function loadCandidates(): Candidate[] {
  if (isServerless) {
    console.log('Using in-memory storage for serverless environment');
    return inMemoryCandidates;
  }

  try {
    const { join } = require('path');
    const { readFileSync, existsSync } = require('fs');
    const DB_FILE = join(process.cwd(), 'data', 'candidates.json');
    
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
    console.error('Failed to load candidates, using in-memory fallback:', error);
  }
  
  return inMemoryCandidates;
}

// Save candidates to file or memory
export function saveCandidates(candidates: Candidate[]): void {
  if (isServerless) {
    inMemoryCandidates = [...candidates];
    console.log('Candidates saved to memory:', candidates.length);
    return;
  }

  try {
    const { join } = require('path');
    const { writeFileSync } = require('fs');
    const DB_FILE = join(process.cwd(), 'data', 'candidates.json');
    
    ensureDataDir();
    writeFileSync(DB_FILE, JSON.stringify(candidates, null, 2), 'utf8');
    console.log('Candidates saved to file:', candidates.length);
  } catch (error) {
    console.error('Failed to save candidates, using memory fallback:', error);
    inMemoryCandidates = [...candidates];
  }
}

// Add a single candidate and save immediately
export function addCandidateToFile(candidate: Candidate): void {
  const candidates = loadCandidates();
  candidates.unshift(candidate); // Add to beginning (newest first)
  saveCandidates(candidates);
  console.log('Added candidate to storage:', candidate.name);
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