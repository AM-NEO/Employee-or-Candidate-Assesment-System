import { getCandidateById } from '@/app/actions';
import { TIER_DEFINITIONS } from '@/lib/tiering';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface CandidateDetailPageProps {
  params: {
    id: string;
  };
}

export default async function CandidateDetailPage({ params }: CandidateDetailPageProps) {
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Dashboard
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
          <p className="text-gray-600">Candidate Profile</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{candidate.name}</p>
                </div>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Tier Assessment</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold">Tier {candidate.tier}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {tierInfo.title.split(' - ')[1]}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3">{tierInfo.description}</p>
                <div className="text-xs text-gray-600">
                  <strong>Tier {candidate.tier}:</strong> {tierInfo.title}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Selected During Registration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'knowsHtmlCssJs', label: 'HTML, CSS, and basic JavaScript' },
                { key: 'knowsReactNext', label: 'Next.js or React knowledge' },
                { key: 'canBuildCrud', label: 'Can build CRUD applications with database' },
                { key: 'canBuildAuth', label: 'Can build authenticated CRUD apps and deploy' },
                { key: 'knowsBackendFrameworks', label: 'Can build authenticated CRUD APIs (Express/Hono/Laravel)' },
                { key: 'knowsGolang', label: 'Knows Golang and can build simple APIs' },
                { key: 'knowsCloudInfra', label: 'Experience with cloud infrastructure and containerization' },
                { key: 'knowsSystemDesign', label: 'Can design complex, scalable systems' },
              ].map(skill => (
                <div key={skill.key} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">
                    {candidate[skill.key as keyof typeof candidate] ? (
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{skill.label}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {candidate[skill.key as keyof typeof candidate] ? 'Selected during registration' : 'Not selected'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Tier Assignment Information
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>This tier was automatically assigned based on the skills selected during registration. The tier reflects the candidate's self-declared technical capabilities and experience level.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}