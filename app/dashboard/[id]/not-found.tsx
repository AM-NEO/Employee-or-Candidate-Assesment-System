import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h2>Candidate Not Found</h2>
      <p>The candidate you're looking for doesn't exist or may have been removed.</p>
      <Link href="/dashboard">&larr; Back to Dashboard</Link>
    </div>
  );
}