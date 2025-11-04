import { getCandidates, addTestCandidate } from '@/app/actions';

export default async function TestPage() {
  const candidates = await getCandidates();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Test Page - Candidate Management</h1>
      
      <div className="mb-6">
        <form action={async () => {
          'use server';
          await addTestCandidate();
        }}>
          <button 
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Test Candidate
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Current Candidates ({candidates.length})</h2>
        
        {candidates.length > 0 ? (
          <div className="space-y-2">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="border p-3 rounded">
                <p><strong>ID:</strong> {candidate.id}</p>
                <p><strong>Name:</strong> {candidate.name}</p>
                <p><strong>Email:</strong> {candidate.email}</p>
                <p><strong>Tier:</strong> {candidate.tier}</p>
                <p><strong>Created:</strong> {candidate.createdAt.toISOString()}</p>
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