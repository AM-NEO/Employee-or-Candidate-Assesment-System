'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { registerCandidate, FormState } from '@/app/actions';

// The submit button component that shows a pending state
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="px-12 py-4 rounded-2xl font-semibold text-xl transition-all duration-200 disabled:cursor-not-allowed hover:opacity-90 hover:scale-105 shadow-lg"
      style={{
        backgroundColor: pending ? 'var(--accent-200)' : 'var(--primary-200)',
        color: 'var(--primary-300)'
      }}
    >
      {pending ? 'Submitting...' : 'Register me'}
    </button>
  );
}

export function RegistrationForm() {
  const router = useRouter();
  const initialState: FormState = { message: '' };
  const [state, formAction] = useActionState(registerCandidate, initialState);

  // Handle successful registration
  useEffect(() => {
    if (state.success) {
      // Small delay to show success message, then redirect
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);

  return (
    <form action={formAction} className="space-y-8">
      {state.message && (
        <div className={`px-4 py-3 rounded-md ${
          state.success 
            ? 'border' 
            : 'border'
        }`} style={{
          backgroundColor: state.success ? 'var(--bg-200)' : 'var(--accent-200)',
          borderColor: state.success ? 'var(--accent-100)' : 'var(--primary-200)',
          color: state.success ? 'var(--text-100)' : 'var(--text-100)'
        }}>
          {state.message}
        </div>
      )}
      
      <fieldset className="space-y-6">
        <legend>
          <h3 className='text-2xl font-semibold mb-4' style={{ color: 'var(--text-100)' }}>Personal Information</h3>
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-100)' }}>
              Full Name
            </label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200"
              style={{ 
                borderColor: 'var(--accent-200)', 
                backgroundColor: 'var(--bg-100)',
                color: 'var(--text-100)'
              }}
            />
            {state.errors?.name && (
              <p className="mt-1 text-sm" style={{ color: 'var(--primary-200)' }}>{state.errors.name.join(', ')}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-100)' }}>
              Email Address
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200"
              style={{ 
                borderColor: 'var(--accent-200)', 
                backgroundColor: 'var(--bg-100)',
                color: 'var(--text-100)'
              }}
            />
            {state.errors?.email && (
              <p className="mt-1 text-sm" style={{ color: 'var(--primary-200)' }}>{state.errors.email.join(', ')}</p>
            )}
          </div>
          <div>
            <label htmlFor="contact" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-100)' }}>
              Contact Number (Optional)
            </label>
            <input 
              type="text" 
              id="contact" 
              name="contact" 
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200"
              style={{ 
                borderColor: 'var(--accent-200)', 
                backgroundColor: 'var(--bg-100)',
                color: 'var(--text-100)'
              }}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend>
          <h3 className='text-2xl font-semibold mb-4' style={{ color: 'var(--text-100)' }}>Your Skills Assessment</h3>
        </legend>
        <p className="mb-6" style={{ color: 'var(--text-200)' }}>Please check all the statements that apply to you best.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[
            { id: 'knowsHtmlCssJs', label: 'I know HTML, CSS, and basic JavaScript.' },
            { id: 'knowsReactNext', label: 'I have basic knowledge of Next.js or React.' },
            { id: 'canBuildCrud', label: 'I can build a CRUD app with a database (e.g., using Next.js Server Actions or API routes).' },
            { id: 'canBuildAuth', label: 'I can build an authenticated (password + Auth) CRUD App and deploy it.' },
            { id: 'knowsBackendFrameworks', label: 'I can build an authenticated CRUD API with Express/Hono/Laravel, including API documentation.' },
            { id: 'knowsGolang', label: 'I know Golang and can build a simple API with it.' },
            { id: 'knowsCloudInfra', label: 'I have experience with cloud infrastructure (e.g., AWS, GCP) and containerization (Docker).' },
            { id: 'knowsSystemDesign', label: 'I can design complex, scalable systems and have knowledge of system design principles.' },
          ].map((skill) => (
            <div key={skill.id} className="flex items-start space-x-3 p-4 rounded-xl transition-all duration-200 cursor-pointer hover:opacity-80 hover:scale-[1.02]" 
                 style={{ backgroundColor: 'var(--bg-200)' }}>
              <input 
                type="checkbox" 
                id={skill.id} 
                name={skill.id} 
                value="true" 
                className="mt-1 h-5 w-5 rounded focus:outline-none"
                style={{ accentColor: 'var(--accent-100)' }}
              />
              <label htmlFor={skill.id} className="text-sm leading-relaxed cursor-pointer font-medium" style={{ color: 'var(--text-100)' }}>
                {skill.label}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
      
      <div className="flex justify-center pt-8">
        <SubmitButton />
      </div>
    </form>
  );
}