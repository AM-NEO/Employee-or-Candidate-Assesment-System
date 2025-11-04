import Link from 'next/link';
import { getCandidates } from '@/app/actions';
import { TIER_DEFINITIONS } from '@/lib/tiering';

interface DashboardPageProps {
  searchParams: {
    tier?: string;
  };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const candidates = await getCandidates();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <div 
          className="h-full rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-16 flex flex-col"
          style={{ backgroundColor: 'var(--primary-300)' }}
        >
          {/* Header section */}
          <div className="mb-8 lg:mb-12">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ color: 'var(--text-100)' }}>
                  Registered Candidates
                </h2>
                <p className="text-lg sm:text-xl" style={{ color: 'var(--text-200)' }}>
                  View all candidates and their skill tier assignments.
                </p>
              </div>
              
              {/* Admin Access Section */}
              <div className="flex space-x-3">
                <Link
                  href="/admin"
                  className="inline-flex items-center px-6 py-3 rounded-2xl text-sm font-semibold hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-lg"
                  style={{ 
                    backgroundColor: 'var(--primary-200)', 
                    color: 'var(--primary-300)' 
                  }}
                >
                  Admin Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Table section - takes remaining space */}
          <div className="flex-1 flex flex-col">
            <div className="rounded-2xl shadow-xl overflow-hidden flex-1" style={{ backgroundColor: 'var(--bg-100)' }}>
              {candidates.length > 0 ? (
                <div className="overflow-x-auto h-full">
                  <table className="min-w-full divide-y" style={{ borderColor: 'var(--accent-200)' }}>
                    <thead style={{ backgroundColor: 'var(--bg-200)' }}>
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-100)' }}>
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-100)' }}>
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-100)' }}>
                          Assigned Tier
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-100)' }}>
                          Profile
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ backgroundColor: 'var(--bg-100)', borderColor: 'var(--accent-200)' }}>
                      {candidates.map(candidate => (
                        <tr key={candidate.id} className="hover:opacity-80 hover:scale-[1.01] transition-all duration-200">
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-medium" style={{ color: 'var(--text-100)' }}>
                            {candidate.name} 
                            <span className="ml-3 inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold" 
                                  style={{ backgroundColor: 'var(--accent-100)', color: 'var(--primary-300)' }}>
                              Tier {candidate.tier}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm" style={{ color: 'var(--text-200)' }}>
                            {candidate.email}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="text-sm font-medium" style={{ color: 'var(--text-200)' }}>
                              {TIER_DEFINITIONS[candidate.tier].title.split(' - ')[1]}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                            <Link 
                              href={`/dashboard/${candidate.id}`}
                              className="px-4 py-2 rounded-xl hover:opacity-90 hover:scale-105 transition-all duration-200 font-semibold"
                              style={{ backgroundColor: 'var(--accent-100)', color: 'var(--primary-300)' }}
                            >
                              View Profile
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center py-12">
                    <p className="text-xl font-medium" style={{ color: 'var(--text-200)' }}>
                      No candidates found for this filter.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

