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

// Pre-hashed password for default admin (Neo@2025 hashed with bcrypt)
const DEFAULT_ADMIN_PASSWORD_HASH = '$2b$10$YZ6BpTMtHOubVz4AtioABeHtoAvB8o3tK3pSfcg1ejHfUM4TOcd.m';

// Default admin that should always exist
const DEFAULT_ADMIN: Admin = {
  id: 1,
  name: 'Sir NEO',
  email: 'neo@dessishub.com',
  username: 'sirneo',
  password: DEFAULT_ADMIN_PASSWORD_HASH,
  provider: 'credentials',
  createdAt: new Date('2024-01-01'),
};

// In-memory storage for serverless environments
let inMemoryAdmins: Admin[] = [DEFAULT_ADMIN];

// Check if we're in a serverless environment
const isServerless = process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.NODE_ENV === 'production';

// Ensure data directory exists (only for local development)
function ensureDataDirectory() {
  if (isServerless) return;
  
  try {
    const fs = require('fs');
    const path = require('path');
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  } catch (error) {
    console.error('Failed to create data directory:', error);
  }
}

// Load admins from file or memory
function loadAdmins(): Admin[] {
  if (isServerless) {
    console.log('Using in-memory admin storage for serverless environment');
    return inMemoryAdmins;
  }

  try {
    const fs = require('fs');
    const path = require('path');
    const ADMIN_DB_PATH = path.join(process.cwd(), 'data', 'admins.json');
    
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
    console.error('Error loading admins, using in-memory fallback:', error);
    return inMemoryAdmins;
  }
}

// Save admins to file or memory
function saveAdmins(admins: Admin[]): void {
  if (isServerless) {
    inMemoryAdmins = [...admins];
    console.log('Admins saved to memory:', admins.length);
    return;
  }

  try {
    const fs = require('fs');
    const path = require('path');
    const ADMIN_DB_PATH = path.join(process.cwd(), 'data', 'admins.json');
    
    ensureDataDirectory();
    fs.writeFileSync(ADMIN_DB_PATH, JSON.stringify(admins, null, 2));
    console.log('Admins saved to file:', admins.length);
  } catch (error) {
    console.error('Error saving admins, using memory fallback:', error);
    inMemoryAdmins = [...admins];
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
  
  if (admin && admin.password) {
    try {
      const isValid = await bcrypt.compare(password, admin.password);
      return isValid ? admin : null;
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return null;
    }
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
    try {
      newAdmin.password = await bcrypt.hash(adminData.password, 10);
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Failed to process password');
    }
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
    try {
      updates.password = await bcrypt.hash(updates.password, 10);
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Failed to process password');
    }
  }
  
  admins[index] = { ...admins[index], ...updates };
  saveAdmins(admins);
  
  return admins[index];
}