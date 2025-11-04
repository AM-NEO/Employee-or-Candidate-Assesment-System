'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Candidate } from '@/lib/inMemoryDB';
import { TIER_DEFINITIONS } from '@/lib/tiering';
import { deleteCandidate } from '@/app/actions';

interface Analytics {
  totalCandidates: number;
  tierDistribution: Array<{
    tier: number;
    count: number;
    title: string;
  }>;
  recentRegistrations: Candidate[];
}

interface AdminDashboardProps {
  candidates: Candidate[];
  analytics: Analytics;
}

export default function AdminDashboard({ candidates, analytics }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<number | undefined>();
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  // Filter candidates based on search and tier
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === undefined || candidate.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Contact', 'Tier', 'HTML/CSS/JS', 'React/Next', 'CRUD', 'Auth', 'Backend', 'Golang', 'Cloud', 'System Design', 'Created At'];
    const csvData = filteredCandidates.map(candidate => [
      candidate.name,
      candidate.email,
      candidate.contact || '',
      candidate.tier,
      candidate.knowsHtmlCssJs ? 'Yes' : 'No',
      candidate.knowsReactNext ? 'Yes' : 'No',
      candidate.canBuildCrud ? 'Yes' : 'No',
      candidate.canBuildAuth ? 'Yes' : 'No',
      candidate.knowsBackendFrameworks ? 'Yes' : 'No',
      candidate.knowsGolang ? 'Yes' : 'No',
      candidate.knowsCloudInfra ? 'Yes' : 'No',
      candidate.knowsSystemDesign ? 'Yes' : 'No',
      candidate.createdAt.toISOString(),
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidates-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    // Create Excel-compatible CSV with UTF-8 BOM
    const headers = ['Name', 'Email', 'Contact', 'Tier', 'Tier Description', 'HTML/CSS/JS', 'React/Next', 'CRUD', 'Auth', 'Backend', 'Golang', 'Cloud', 'System Design', 'Created At'];
    const csvData = filteredCandidates.map(candidate => [
      candidate.name,
      candidate.email,
      candidate.contact || '',
      candidate.tier,
      TIER_DEFINITIONS[candidate.tier].title,
      candidate.knowsHtmlCssJs ? 'Yes' : 'No',
      candidate.knowsReactNext ? 'Yes' : 'No',
      candidate.canBuildCrud ? 'Yes' : 'No',
      candidate.canBuildAuth ? 'Yes' : 'No',
      candidate.knowsBackendFrameworks ? 'Yes' : 'No',
      candidate.knowsGolang ? 'Yes' : 'No',
      candidate.knowsCloudInfra ? 'Yes' : 'No',
      candidate.knowsSystemDesign ? 'Yes' : 'No',
      candidate.createdAt.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      }),
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    // Add UTF-8 BOM for Excel compatibility
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidates-${new Date().toISOString().split('T')[0]}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDeleteCandidate = async (candidateId: number, candidateName: string) => {
    if (confirm(`Are you sure you want to delete ${candidateName}? This action cannot be undone.`)) {
      try {
        const result = await deleteCandidate(candidateId);
        if (result.success) {
          window.location.reload(); // Refresh to show updated list
        } else {
          alert('Failed to delete candidate');
        }
      } catch (error) {
        alert('Error deleting candidate');
      }
    }
  };

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
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ color: 'var(--text-100)' }}>
                  Admin Dashboard
                </h1>
                <p className="text-lg sm:text-xl" style={{ color: 'var(--text-200)' }}>
                  Manage candidates, view analytics, and export data.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={async () => {
                    await signOut({ redirect: false });
                    window.location.href = '/dashboard';
                  }}
                  className="inline-flex items-center px-6 py-3 rounded-2xl text-sm font-semibold hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-lg"
                  style={{ backgroundColor: 'var(--primary-200)', color: 'var(--primary-300)' }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Content section - takes remaining space */}
          <div className="flex-1 flex flex-col">
            {/* Analytics and Controls Section */}
            <div className="space-y-8 mb-8">
              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                <div className="p-8 rounded-2xl shadow-xl" style={{ backgroundColor: 'var(--bg-100)' }}>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-100)' }}>Total Candidates</h3>
                  <p className="text-4xl font-bold" style={{ color: 'var(--accent-100)' }}>{analytics.totalCandidates}</p>
                </div>
                
                {analytics.tierDistribution.slice(0, 3).map(tier => (
                  <div key={tier.tier} className="p-8 rounded-2xl shadow-xl" style={{ backgroundColor: 'var(--bg-100)' }}>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-100)' }}>Tier {tier.tier}</h3>
                    <p className="text-4xl font-bold mb-2" style={{ color: 'var(--primary-200)' }}>{tier.count}</p>
                    <p className="text-sm" style={{ color: 'var(--text-200)' }}>{tier.title.split(' - ')[1]}</p>
                  </div>
                ))}
              </div>

              {/* Tier Distribution Chart */}
              <div className="p-8 rounded-2xl shadow-xl" style={{ backgroundColor: 'var(--bg-100)' }}>
                <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-100)' }}>Tier Distribution</h3>
                <div className="space-y-4">
                  {analytics.tierDistribution.map(tier => (
                    <div key={tier.tier} className="flex items-center">
                      <div className="w-24 text-sm font-medium" style={{ color: 'var(--text-100)' }}>Tier {tier.tier}</div>
                      <div className="flex-1 rounded-full h-5 mx-6" style={{ backgroundColor: 'var(--bg-200)' }}>
                        <div
                          className="h-5 rounded-full transition-all duration-500"
                          style={{
                            backgroundColor: 'var(--accent-100)',
                            width: `${analytics.totalCandidates > 0 ? (tier.count / analytics.totalCandidates) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                      <div className="w-16 text-sm font-medium" style={{ color: 'var(--text-200)' }}>{tier.count}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Search and Filter */}
              <div className="p-8 rounded-2xl shadow-xl" style={{ backgroundColor: 'var(--bg-100)' }}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search candidates by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border-2 focus:outline-none focus:ring-2 transition-all duration-200"
                      style={{ 
                        backgroundColor: 'var(--bg-200)', 
                        borderColor: 'var(--accent-200)', 
                        color: 'var(--text-100)'
                      }}
                    />
                  </div>
                  <select
                    value={filterTier ?? ''}
                    onChange={(e) => setFilterTier(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="px-4 py-3 rounded-2xl border-2 focus:outline-none focus:ring-2 transition-all duration-200"
                    style={{ 
                      backgroundColor: 'var(--bg-200)', 
                      borderColor: 'var(--accent-200)', 
                      color: 'var(--text-100)'
                    }}
                  >
                    <option value="">All Tiers</option>
                    {Object.keys(TIER_DEFINITIONS).map(tier => (
                      <option key={tier} value={tier}>Tier {tier}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowAddAdmin(!showAddAdmin)}
                    className="px-6 py-3 rounded-2xl font-semibold hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-lg whitespace-nowrap"
                    style={{ backgroundColor: 'var(--accent-100)', color: 'var(--primary-300)' }}
                  >
                    Add Admin
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="px-4 py-3 rounded-2xl font-semibold hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-lg whitespace-nowrap text-sm"
                    style={{ backgroundColor: 'var(--primary-200)', color: 'var(--primary-300)' }}
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={exportToExcel}
                    className="px-4 py-3 rounded-2xl font-semibold hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-lg whitespace-nowrap text-sm"
                    style={{ backgroundColor: 'var(--primary-200)', color: 'var(--primary-300)' }}
                  >
                    Export Excel
                  </button>
                </div>
              </div>

              {/* Add Admin Form */}
              {showAddAdmin && (
                <div className="p-8 rounded-2xl shadow-xl" style={{ backgroundColor: 'var(--bg-100)' }}>
                  <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-100)' }}>Add New Admin</h3>
                  <form action={async (formData) => {
                    const { addAdminUser } = await import('@/app/actions');
                    const result = await addAdminUser(formData);
                    if (result.success) {
                      setShowAddAdmin(false);
                      alert('Admin added successfully!');
                    } else {
                      alert(`Error: ${result.error}`);
                    }
                  }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-100)' }}>Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-4 py-4 rounded-2xl border-2 focus:outline-none focus:ring-2 transition-all duration-200"
                        style={{ 
                          backgroundColor: 'var(--bg-200)', 
                          borderColor: 'var(--accent-200)', 
                          color: 'var(--text-100)'
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-100)' }}>Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-4 rounded-2xl border-2 focus:outline-none focus:ring-2 transition-all duration-200"
                        style={{ 
                          backgroundColor: 'var(--bg-200)', 
                          borderColor: 'var(--accent-200)', 
                          color: 'var(--text-100)'
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-100)' }}>Provider</label>
                      <input
                        type="text"
                        name="provider"
                        value="credentials"
                        readOnly
                        className="w-full px-4 py-4 rounded-2xl border-2 focus:outline-none transition-all duration-200"
                        style={{ 
                          backgroundColor: 'var(--bg-200)', 
                          borderColor: 'var(--accent-200)', 
                          color: 'var(--text-200)',
                          opacity: 0.7
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-100)' }}>Username (for credentials)</label>
                      <input
                        type="text"
                        name="username"
                        className="w-full px-4 py-4 rounded-2xl border-2 focus:outline-none focus:ring-2 transition-all duration-200"
                        style={{ 
                          backgroundColor: 'var(--bg-200)', 
                          borderColor: 'var(--accent-200)', 
                          color: 'var(--text-100)'
                        }}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-100)' }}>Password (for credentials)</label>
                      <input
                        type="password"
                        name="password"
                        className="w-full px-4 py-4 rounded-2xl border-2 focus:outline-none focus:ring-2 transition-all duration-200"
                        style={{ 
                          backgroundColor: 'var(--bg-200)', 
                          borderColor: 'var(--accent-200)', 
                          color: 'var(--text-100)'
                        }}
                      />
                    </div>
                    <div className="md:col-span-2 flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="px-6 py-4 rounded-2xl font-semibold hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-lg"
                        style={{ backgroundColor: 'var(--accent-100)', color: 'var(--primary-300)' }}
                      >
                        Add Admin
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddAdmin(false)}
                        className="px-6 py-4 rounded-2xl font-semibold hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-lg"
                        style={{ backgroundColor: 'var(--bg-200)', color: 'var(--text-100)' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Candidates Table - Takes remaining space */}
            <div className="flex-1 min-h-0">
              <div className="h-full rounded-2xl shadow-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-100)' }}>
                <div className="overflow-x-auto h-full">
                  <table className="min-w-full divide-y" style={{ borderColor: 'var(--accent-200)' }}>
                    <thead style={{ backgroundColor: 'var(--bg-200)' }}>
                      <tr>
                        <th className="px-8 py-6 text-left text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-100)' }}>
                          Candidate
                        </th>
                        <th className="px-8 py-6 text-left text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-100)' }}>
                          Contact
                        </th>
                        <th className="px-8 py-6 text-left text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-100)' }}>
                          Tier
                        </th>
                        <th className="px-8 py-6 text-left text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-100)' }}>
                          Registered
                        </th>
                        <th className="px-8 py-6 text-left text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-100)' }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ backgroundColor: 'var(--bg-100)', borderColor: 'var(--accent-200)' }}>
                      {filteredCandidates.map((candidate) => (
                        <tr key={candidate.id} className="hover:opacity-80 hover:scale-[1.005] transition-all duration-200">
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div>
                              <div className="text-base font-medium mb-1" style={{ color: 'var(--text-100)' }}>{candidate.name}</div>
                              <div className="text-sm" style={{ color: 'var(--text-200)' }}>{candidate.email}</div>
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap text-sm" style={{ color: 'var(--text-100)' }}>
                            {candidate.contact || 'Not provided'}
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold" 
                                  style={{ backgroundColor: 'var(--accent-100)', color: 'var(--primary-300)' }}>
                              Tier {candidate.tier}
                            </span>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap text-sm" style={{ color: 'var(--text-200)' }}>
                            {candidate.createdAt.toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: '2-digit', 
                              day: '2-digit' 
                            })}
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-3">
                              <Link
                                href={`/admin/candidate/${candidate.id}`}
                                className="px-4 py-2 rounded-xl hover:opacity-90 hover:scale-105 transition-all duration-200 font-semibold"
                                style={{ backgroundColor: 'var(--accent-100)', color: 'var(--primary-300)' }}
                              >
                                View
                              </Link>
                              <button
                                onClick={async () => {
                                  try {
                                    const { sendEmailToCandidate } = await import('@/app/actions');
                                    const result = await sendEmailToCandidate(candidate.id);
                                    if (result.success) {
                                      alert('Email sent successfully!');
                                    } else {
                                      alert(`Failed to send email: ${result.error}`);
                                    }
                                  } catch (error) {
                                    alert('Failed to send email. Please check your email configuration.');
                                  }
                                }}
                                className="px-4 py-2 rounded-xl hover:opacity-90 hover:scale-105 transition-all duration-200 font-semibold"
                                style={{ backgroundColor: 'var(--primary-200)', color: 'var(--primary-300)' }}
                              >
                                Email
                              </button>
                              <button
                                onClick={() => handleDeleteCandidate(candidate.id, candidate.name)}
                                className="px-4 py-2 rounded-xl hover:opacity-90 hover:scale-105 transition-all duration-200 font-semibold text-red-600"
                                style={{ backgroundColor: 'var(--bg-200)' }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {filteredCandidates.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center py-16">
                      <p className="text-2xl font-medium" style={{ color: 'var(--text-200)' }}>
                        No candidates found matching your criteria.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}