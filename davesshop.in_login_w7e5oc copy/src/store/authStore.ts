// Custom in-browser auth store using localStorage
// Users sign up with username + password — no external SDK

export type User = {
  id: string;
  username: string;
  email?: string;
  isAdmin: boolean;
  rebrandAccess: boolean;
  redeemedKeys: string[];
  createdAt: string;
};

export type AuthStore = {
  users: User[];
  currentUserId: string | null;
};

const STORE_KEY = 'oss_auth_store';
const SESSION_KEY = 'oss_session';

function loadStore(): AuthStore {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AuthStore;
      // Always return a brand-new plain object — never mutate parsed JSON
      return {
        currentUserId: parsed.currentUserId ?? null,
        users: Array.isArray(parsed.users)
              ? parsed.users.map((u) => ({
                  id: u.id,
                  username: u.username,
                  email: u.email ?? undefined,
                  isAdmin: Boolean(u.isAdmin),
                  rebrandAccess: Boolean(u.rebrandAccess),
                  redeemedKeys: Array.isArray(u.redeemedKeys) ? [...u.redeemedKeys] : [],
                  createdAt: u.createdAt,
                }))
          : [],
      };
    }
  } catch {
    // fall through to seed
  }
  const adminUser: User = {
    id: 'admin-seed',
    username: 'admin',
    email: 'admin@local',
    isAdmin: true,
    rebrandAccess: true,
    redeemedKeys: [],
    createdAt: new Date().toISOString(),
  };
  const fresh: AuthStore = { users: [adminUser], currentUserId: null };
  saveStore(fresh);
  return fresh;
}

function saveStore(store: AuthStore): void {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

// ── Passwords ──────────────────────────────────────────────

const PASS_KEY = 'oss_passwords';

function loadPasswords(): Record<string, string> {
  try {
    const raw = localStorage.getItem(PASS_KEY);
    if (raw) return { ...JSON.parse(raw) };
  } catch {
    // fall through to seed
  }
  const seeded: Record<string, string> = { 'admin-seed': hashPassword('admin123') };
  localStorage.setItem(PASS_KEY, JSON.stringify(seeded));
  return seeded;
}

function savePasswords(passwords: Record<string, string>): void {
  localStorage.setItem(PASS_KEY, JSON.stringify(passwords));
}

export function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `h_${Math.abs(hash).toString(36)}_${password.length}`;
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ── Public API ──────────────────────────────────────────────

export function getCurrentUser(): User | null {
  const store = loadStore();
  const session = localStorage.getItem(SESSION_KEY);
  if (!session || !store.currentUserId) return null;
  return store.users.find((u) => u.id === store.currentUserId) ?? null;
}

export function signUp(
  username: string,
  password: string,
  email?: string
): { success: boolean; error?: string } {
  if (!username.trim() || !password) {
    return { success: false, error: 'Username and password required' };
  }
  if (username.trim().length < 3) {
    return { success: false, error: 'Username must be at least 3 characters' };
  }
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  const store = loadStore();
  const passwords = loadPasswords();

  const existing = store.users.find(
    (u) => u.username.toLowerCase() === username.trim().toLowerCase()
  );
  if (existing) return { success: false, error: 'Username already taken' };

  const newUser: User = {
    id: generateId(),
    username: username.trim(),
    email: email?.trim() || undefined,
    isAdmin: false,
    rebrandAccess: false,
    redeemedKeys: [],
    createdAt: new Date().toISOString(),
  };

  // Build entirely new objects — never mutate
  const nextStore: AuthStore = {
    users: [...store.users, newUser],
    currentUserId: newUser.id,
  };
  const nextPasswords: Record<string, string> = {
    ...passwords,
    [newUser.id]: hashPassword(password),
  };

  saveStore(nextStore);
  savePasswords(nextPasswords);
  localStorage.setItem(SESSION_KEY, newUser.id);

  return { success: true };
}

export function changePassword(userId: string, currentPassword: string, newPassword: string): { success: boolean; error?: string } {
  if (!newPassword || newPassword.length < 6) return { success: false, error: 'New password must be at least 6 characters' };
  const passwords = loadPasswords();
  const stored = passwords[userId];
  if (!stored || stored !== hashPassword(currentPassword)) return { success: false, error: 'Current password is incorrect' };
  const next = { ...passwords, [userId]: hashPassword(newPassword) };
  savePasswords(next);
  return { success: true };
}

export function login(
  username: string,
  password: string
): { success: boolean; error?: string } {
  const store = loadStore();
  const passwords = loadPasswords();

  const user = store.users.find(
    (u) => u.username.toLowerCase() === username.trim().toLowerCase()
  );
  if (!user) return { success: false, error: 'Invalid username or password' };

  const stored = passwords[user.id];
  if (!stored || stored !== hashPassword(password)) {
    return { success: false, error: 'Invalid username or password' };
  }

  // Build a new store — never mutate
  const nextStore: AuthStore = { ...store, currentUserId: user.id };
  saveStore(nextStore);
  localStorage.setItem(SESSION_KEY, user.id);

  return { success: true };
}

export function logout(): void {
  const store = loadStore();
  const nextStore: AuthStore = { ...store, currentUserId: null };
  saveStore(nextStore);
  localStorage.removeItem(SESSION_KEY);
}

export function getAllUsers(): User[] {
  return loadStore().users;
}

export function updateUser(
  userId: string,
  updates: Partial<Pick<User, 'isAdmin' | 'rebrandAccess' | 'redeemedKeys' | 'email'>>
): void {
  const store = loadStore();
  const nextUsers = store.users.map((u) =>
    u.id === userId ? { ...u, ...updates } : u
  );
  saveStore({ ...store, users: nextUsers });
}
