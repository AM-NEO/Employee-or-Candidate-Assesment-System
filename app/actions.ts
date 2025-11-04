'use server';

import { z } from 'zod';
import { calculateTier } from '@/lib/tiering';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { candidates, Candidate, addCandidate, getAllCandidates, removeCandidate } from '@/lib/inMemoryDB';

const candidateSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  contact: z.string().optional(),
  knowsHtmlCssJs: z.coerce.boolean(),
  knowsReactNext: z.coerce.boolean(),
  canBuildCrud: z.coerce.boolean(),
  canBuildAuth: z.coerce.boolean(),
  knowsBackendFrameworks: z.coerce.boolean(),
  knowsGolang: z.coerce.boolean(),
  knowsCloudInfra: z.coerce.boolean(),
  knowsSystemDesign: z.coerce.boolean(),
});

export type FormState = {
  message: string;
  errors?: Record<string, string[] | undefined>;
  success?: boolean;
  candidateId?: number;
};

export async function registerCandidate(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = candidateSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check the fields.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, contact, ...skills } = validatedFields.data;
  const tier = calculateTier(skills);

  // Generate a unique ID
  const maxId = candidates.length > 0 ? Math.max(...candidates.map(c => c.id)) : 0;
  const newCandidate: Candidate = {
    id: maxId + 1,
    name,
    email,
    contact,
    tier,
    ...skills,
    createdAt: new Date(),
  };

  // Add candidate to persistent storage immediately
  addCandidate(newCandidate);
  
  console.log('✅ Candidate successfully registered and saved:', {
    id: newCandidate.id,
    name: newCandidate.name,
    email: newCandidate.email,
    tier: newCandidate.tier
  });

  // Send tier result email (only if email is configured)
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const { sendTierResultEmail } = await import('@/lib/email');
      await sendTierResultEmail(newCandidate);
    } catch (error) {
      console.error('Failed to send email:', error);
      // Continue with registration even if email fails
    }
  }

  // Revalidate both dashboard pages to show new candidate
  revalidatePath('/dashboard');
  revalidatePath('/admin');
  
  return { 
    message: 'Registration successful! Redirecting to dashboard...', 
    success: true,
    candidateId: newCandidate.id 
  };
}

export async function getCandidates(filterTier?: number) {
  const allCandidates = getAllCandidates();
  
  let result = allCandidates;
  if (filterTier !== undefined && !isNaN(filterTier)) {
    result = allCandidates.filter(c => c.tier === filterTier);
  }
  return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getCandidateById(id: number) {
  return candidates.find(c => c.id === id);
}
export async function sendEmailToCandidate(candidateId: number) {
  const candidate = candidates.find(c => c.id === candidateId);
  if (!candidate) {
    return { success: false, error: 'Candidate not found' };
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return { success: false, error: 'Email not configured. Please set SMTP credentials in environment variables.' };
  }

  try {
    const { sendTierResultEmail } = await import('@/lib/email');
    const result = await sendTierResultEmail(candidate);
    revalidatePath('/admin');
    return result;
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deleteCandidate(candidateId: number) {
  const success = removeCandidate(candidateId);
  if (success) {
    revalidatePath('/admin');
    revalidatePath('/dashboard');
    return { success: true };
  }
  return { success: false, error: 'Candidate not found' };
}

export async function addAdminUser(formData: FormData) {
  const { addAdmin } = await import('@/lib/persistentAdminDB');
  
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const provider = 'credentials' as const;

  if (!name || !email || !username || !password) {
    return { success: false, error: 'Name, email, username, and password are required' };
  }

  try {
    await addAdmin({
      name,
      email,
      username,
      password,
      provider,
    });
    
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error adding admin:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to add admin' 
    };
  }
}

// Debug function to check candidates
export async function debugCandidates() {
  console.log('Current candidates:', candidates);
  return candidates;
}

// Test function to add a candidate manually
export async function addTestCandidate() {
  const testCandidate: Candidate = {
    id: Date.now(), // Use timestamp as unique ID
    name: 'Test User ' + Date.now(),
    email: 'test@example.com',
    contact: '123-456-7890',
    tier: 1,
    knowsHtmlCssJs: true,
    knowsReactNext: false,
    canBuildCrud: false,
    canBuildAuth: false,
    knowsBackendFrameworks: false,
    knowsGolang: false,
    knowsCloudInfra: false,
    knowsSystemDesign: false,
    createdAt: new Date(),
  };
  
  addCandidate(testCandidate);
  revalidatePath('/dashboard');
  
  return { success: true, candidate: testCandidate };
}