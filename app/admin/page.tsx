import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { getCandidates } from '@/app/actions';
import { TIER_DEFINITIONS } from '@/lib/tiering';
import AdminDashboard from '@/components/AdminDashboard';

export default async function AdminPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/auth/signin');
  }

  let candidates = [];
  try {
    candidates = await getCandidates();
  } catch (error) {
    console.error('Error loading candidates:', error);
    candidates = [];
  }
  
  // Calculate analytics
  const tierStats = candidates.reduce((acc, candidate) => {
    acc[candidate.tier] = (acc[candidate.tier] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const analytics = {
    totalCandidates: candidates.length,
    tierDistribution: Object.keys(TIER_DEFINITIONS).map(tier => ({
      tier: parseInt(tier),
      count: tierStats[parseInt(tier)] || 0,
      title: TIER_DEFINITIONS[parseInt(tier)].title,
    })),
    recentRegistrations: candidates.slice(0, 5),
  };

  return <AdminDashboard candidates={candidates} analytics={analytics} />;
}