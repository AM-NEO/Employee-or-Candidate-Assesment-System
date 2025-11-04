import { getAllAdmins } from '@/lib/persistentAdminDB';

export default async function DebugAdminPage() {
  const admins = await getAllAdmins();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Debug Page</h1>
      <p className="mb-4">Total admins: {admins.length}</p>
      
      <div className="space-y-4">
        {admins.map((admin) => (
          <div key={admin.id} className="border p-4 rounded">
            <p><strong>ID:</strong> {admin.id}</p>
            <p><strong>Name:</strong> {admin.name}</p>
            <p><strong>Email:</strong> {admin.email}</p>
            <p><strong>Username:</strong> {admin.username || 'N/A'}</p>
            <p><strong>Provider:</strong> {admin.provider}</p>
            <p><strong>Has Password:</strong> {admin.password ? 'Yes' : 'No'}</p>
            <p><strong>Created:</strong> {admin.createdAt.toISOString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}