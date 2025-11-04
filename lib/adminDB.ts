import bcrypt from 'bcrypt';

export interface Admin {
  id: number;
  name: string;
  email: string;
  username?: string;
  password?: string; // hashed
  provider: 'credentials' | 'google' | 'github';
  createdAt: Date;
}

// In-memory admin storage (in production, use a real database)
export const admins: Admin[] = [
  {
    id: 1,
    name: 'Sir NEO',
    email: 'neo@dessishub.com',
    username: 'sirneo',
    password: bcrypt.hashSync('Neo@2025', 10),
    provider: 'credentials',
    createdAt: new Date(),
  },
];

export async function getAdminByEmail(email: string): Promise<Admin | null> {
  return admins.find(admin => admin.email === email) || null;
}

export async function getAdminByCredentials(username: string, password: string): Promise<Admin | null> {
  const admin = admins.find(admin => admin.username === username && admin.provider === 'credentials');
  if (admin && admin.password && await bcrypt.compare(password, admin.password)) {
    return admin;
  }
  return null;
}

export async function addAdmin(adminData: Omit<Admin, 'id' | 'createdAt'>): Promise<Admin> {
  const newAdmin: Admin = {
    ...adminData,
    id: admins.length + 1,
    createdAt: new Date(),
  };
  
  if (adminData.password) {
    newAdmin.password = await bcrypt.hash(adminData.password, 10);
  }
  
  admins.push(newAdmin);
  return newAdmin;
}

export async function getAllAdmins(): Promise<Admin[]> {
  return admins;
}

export async function deleteAdmin(id: number): Promise<boolean> {
  const index = admins.findIndex(admin => admin.id === id);
  if (index > -1) {
    admins.splice(index, 1);
    return true;
  }
  return false;
}