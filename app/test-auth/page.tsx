import { getServerSession } from 'next-auth';
import Link from 'next/link';

export default async function TestAuth() {
  const session = await getServerSession();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Session Status</h2>
        
        {session ? (
          <div className="space-y-2">
            <p className="text-green-600 font-medium">✅ Signed In</p>
            <p><strong>Name:</strong> {session.user?.name}</p>
            <p><strong>Email:</strong> {session.user?.email}</p>
            <p><strong>ID:</strong> {(session.user as any)?.id || 'Not available'}</p>
            
            <div className="mt-4 space-x-4">
              <Link 
                href="/admin" 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Go to Admin Dashboard
              </Link>
              <Link 
                href="/auth/signin" 
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Sign In Page
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-red-600 font-medium">❌ Not Signed In</p>
            <Link 
              href="/auth/signin" 
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}