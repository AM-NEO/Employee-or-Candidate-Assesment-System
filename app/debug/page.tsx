import { getCandidates } from '@/app/actions';
import Link from 'next/link';

export default async function DebugPage() {
  const candidates = await getCandidates();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-4">Debug - Current Candidates</h1>
      
      <div className="mb-4">
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Total Candidates: {candidates.length}</h2>
        
        {candidates.length > 0 ? (
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="border p-4 rounded">
                <h3 className="font-semibold">ID: {candidate.id} - {candidate.name}</h3>
                <p>Email: {candidate.email}</p>
                <p>Tier: {candidate.tier}</p>
                <p>Created: {candidate.createdAt.toISOString()}</p>
                <Link 
                  href={`/dashboard/${candidate.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No candidates found</p>
        )}
      </div>
    </div>
  );
}