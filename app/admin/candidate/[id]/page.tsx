import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { getCandidateById } from '@/app/actions';
import { TIER_DEFINITIONS } from '@/lib/tiering';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface AdminCandidateDetailProps {
  params: {
    id: string;
  };
}

export default async function AdminCandidateDetail({ params }: AdminCandidateDetailProps) {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/auth/signin');
  }

  const id = parseInt(params.id, 10);
  
  if (isNaN(id)) {
    notFound();
  }

  let candidate = null;
  try {
    candidate = await getCandidateById(id);
  } catch (error) {
    console.error('Error loading candidate:', error);
    notFound();
  }

  if (!candidate) {
    notFound();
  }

  const tierInfo = TIER_DEFINITIONS[candidate.tier];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/admin" className="text-blue-600 hover:text-blue-800">
              ← Back to Admin Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
            <p className="text-gray-600">Candidate Details</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{candidate.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Contact Number</label>
                    <p className="text-gray-900">{candidate.contact || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Registration Date</label>
                    <p className="text-gray-900">{candidate.createdAt.toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: '2-digit', 
                      day: '2-digit' 
                    })}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Assessment</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold">Tier {candidate.tier}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {tierInfo.title.split(' - ')[1]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{tierInfo.description}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Self-Declared Skills</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'knowsHtmlCssJs', label: 'HTML, CSS, JavaScript' },
                  { key: 'knowsReactNext', label: 'React/Next.js' },
                  { key: 'canBuildCrud', label: 'CRUD Applications' },
                  { key: 'canBuildAuth', label: 'Authentication' },
                  { key: 'knowsBackendFrameworks', label: 'Backend Frameworks' },
                  { key: 'knowsGolang', label: 'Golang' },
                  { key: 'knowsCloudInfra', label: 'Cloud Infrastructure' },
                  { key: 'knowsSystemDesign', label: 'System Design' },
                ].map(skill => (
                  <div key={skill.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">{skill.label}</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      candidate[skill.key as keyof typeof candidate] 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {candidate[skill.key as keyof typeof candidate] ? '✅ Yes' : '❌ No'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <form action={async () => {
                'use server';
                const { sendEmailToCandidate } = await import('@/app/actions');
                await sendEmailToCandidate(candidate.id);
              }}>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                  Send Tier Results Email
                </button>
              </form>
              <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
                Export to PDF
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}