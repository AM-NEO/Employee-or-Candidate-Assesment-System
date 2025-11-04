'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading('credentials');

    const result = await signIn('credentials', {
      username: credentials.username,
      password: credentials.password,
      redirect: false,
    });

    setLoading('');
    if (result?.error) {
      setError('Invalid credentials');
    } else if (result?.ok) {
      // Force redirect to admin page
      window.location.href = '/admin';
    }
  };



  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <div 
          className="h-full rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-16 flex flex-col items-center justify-center"
          style={{ backgroundColor: 'var(--primary-300)' }}
        >
          {/* Header section */}
          <div className="w-full max-w-md mb-8 lg:mb-12">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ color: 'var(--text-100)' }}>
                Admin Login
              </h1>
              <p className="text-lg sm:text-xl" style={{ color: 'var(--text-200)' }}>
                Sign in to access the admin dashboard
              </p>
            </div>
          </div>

          {/* Sign-in Form */}
          <div className="w-full max-w-md">
            <div className="p-8 rounded-2xl shadow-xl" style={{ backgroundColor: 'var(--bg-100)' }}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="px-6 py-4 rounded-2xl text-sm border-2" 
                       style={{ 
                         backgroundColor: 'var(--accent-200)', 
                         borderColor: 'var(--primary-200)', 
                         color: 'var(--text-100)' 
                       }}>
                    {error}
                  </div>
                )}
                
                <div>
                  <label htmlFor="username" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-100)' }}>
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="w-full px-4 py-4 rounded-2xl border-2 focus:outline-none focus:ring-2 transition-all duration-200"
                    style={{ 
                      borderColor: 'var(--accent-200)', 
                      backgroundColor: 'var(--bg-200)',
                      color: 'var(--text-100)'
                    }}
                    placeholder="Enter your username"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-100)' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full px-4 py-4 rounded-2xl border-2 focus:outline-none focus:ring-2 transition-all duration-200"
                    style={{ 
                      borderColor: 'var(--accent-200)', 
                      backgroundColor: 'var(--bg-200)',
                      color: 'var(--text-100)'
                    }}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading === 'credentials'}
                  className="w-full py-4 px-6 rounded-2xl font-semibold disabled:opacity-50 hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-lg"
                  style={{
                    backgroundColor: loading === 'credentials' ? 'var(--accent-200)' : 'var(--accent-100)',
                    color: 'var(--primary-300)'
                  }}
                >
                  {loading === 'credentials' ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              {/* Back to Dashboard Link */}
              <div className="mt-8 text-center">
                <a 
                  href="/dashboard" 
                  className="text-sm font-medium hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--accent-100)' }}
                >
                  ← Back to Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}