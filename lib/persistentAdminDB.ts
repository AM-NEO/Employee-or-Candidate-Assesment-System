import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

export interface Admin {
  id: number;
  name: string;
  email: string;
  username?: string;
  password?: string; // hashed
  provider: 'credentials';
  createdAt: Date;
}

const ADMIN_DB_PATH = path.join(process.cwd(), 'data', 'admins.json');

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(ADMIN_DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Default admin that should always exist
const DEFAULT_ADMIN: Admin = {
  id: 1,
  name: 'Sir NEO',
  email: 'neo@dessishub.com',
  username: 'sirneo',
  password: bcrypt.hashSync('Neo@2025', 10),
  provider: 'credentials',
  createdAt: new Date('2024-01-01'),
};

// Load admins from file
function loadAdmins(): Admin[] {
  try {
    ensureDataDirectory();
    
    if (!fs.existsSync(ADMIN_DB_PATH)) {
      // Create initial file with default admin
      const initialData = [DEFAULT_ADMIN];
      saveAdmins(initialData);
      return initialData;
    }
    
    const data = fs.readFileSync(ADMIN_DB_PATH, 'utf8');
    const parsedData = JSON.parse(data) as Array<Omit<Admin, 'createdAt'> & { createdAt: string }>;
    const admins = parsedData.map((admin) => ({
      ...admin,
      createdAt: new Date(admin.createdAt),
    }));
    
    // Ensure default admin exists
    const hasDefaultAdmin = admins.some(admin => admin.email === DEFAULT_ADMIN.email);
    if (!hasDefaultAdmin) {
      admins.unshift(DEFAULT_ADMIN);
      saveAdmins(admins);
    }
    
    return admins;
  } catch (error) {
    console.error('Error loading admins:', error);
    // Return default admin if there's an error
    const defaultData = [DEFAULT_ADMIN];
    try {
      saveAdmins(defaultData);
    } catch (saveError) {
      console.error('Error saving default admin:', saveError);
    }
    return defaultData;
  }
}

// Save admins to file
function saveAdmins(admins: Admin[]): void {
  try {
    ensureDataDirectory();
    fs.writeFileSync(ADMIN_DB_PATH, JSON.stringify(admins, null, 2));
  } catch (error) {
    console.error('Error saving admins:', error);
    throw error;
  }
}

// Get all admins
export async function getAllAdmins(): Promise<Admin[]> {
  return loadAdmins();
}

// Get admin by email
export async function getAdminByEmail(email: string): Promise<Admin | null> {
  const admins = loadAdmins();
  return admins.find(admin => admin.email === email) || null;
}

// Get admin by credentials
export async function getAdminByCredentials(username: string, password: string): Promise<Admin | null> {
  const admins = loadAdmins();
  const admin = admins.find(admin => admin.username === username && admin.provider === 'credentials');
  
  if (admin && admin.password && await bcrypt.compare(password, admin.password)) {
    return admin;
  }
  return null;
}

// Add new admin
export async function addAdmin(adminData: Omit<Admin, 'id' | 'createdAt'>): Promise<Admin> {
  const admins = loadAdmins();
  
  // Check if admin with same email already exists
  const existingAdmin = admins.find(admin => admin.email === adminData.email);
  if (existingAdmin) {
    throw new Error('Admin with this email already exists');
  }
  
  // Check if username already exists for credentials provider
  if (adminData.provider === 'credentials' && adminData.username) {
    const existingUsername = admins.find(admin => 
      admin.username === adminData.username && admin.provider === 'credentials'
    );
    if (existingUsername) {
      throw new Error('Username already exists');
    }
  }
  
  // Generate new ID
  const maxId = admins.length > 0 ? Math.max(...admins.map(a => a.id)) : 0;
  
  const newAdmin: Admin = {
    ...adminData,
    id: maxId + 1,
    createdAt: new Date(),
  };
  
  // Hash password if provided
  if (adminData.password) {
    newAdmin.password = await bcrypt.hash(adminData.password, 10);
  }
  
  admins.push(newAdmin);
  saveAdmins(admins);
  
  return newAdmin;
}

// Delete admin
export async function deleteAdmin(id: number): Promise<boolean> {
  const admins = loadAdmins();
  
  // Prevent deletion of default admin
  if (id === DEFAULT_ADMIN.id) {
    throw new Error('Cannot delete default admin');
  }
  
  const index = admins.findIndex(admin => admin.id === id);
  if (index > -1) {
    admins.splice(index, 1);
    saveAdmins(admins);
    return true;
  }
  return false;
}

// Update admin
export async function updateAdmin(id: number, updates: Partial<Omit<Admin, 'id' | 'createdAt'>>): Promise<Admin | null> {
  const admins = loadAdmins();
  const index = admins.findIndex(admin => admin.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Hash password if being updated
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }
  
  admins[index] = { ...admins[index], ...updates };
  saveAdmins(admins);
  
  return admins[index];
}