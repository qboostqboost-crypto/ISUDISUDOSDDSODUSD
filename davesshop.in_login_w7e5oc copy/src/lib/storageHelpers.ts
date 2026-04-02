const PRODUCTS_KEY = 'oss_products';
const KEYS_KEY = 'oss_keys';
const ANNOUNCEMENTS_KEY = 'oss_announcements';
const LICENSE_KEYS_KEY = 'oss_license_keys';

export type Product = {
  id: string;
  name: string;
  description: string;
  fileUrl: string;
  /** KeyAuth Owner ID for this product */
  keyAuthOwnerId?: string;
  /** KeyAuth Seller Key for this product */
  keyAuthSellerKey?: string;
  /** Optional: legacy/application secret that can be used as a fallback for seller key
   *  WARNING: storing application secrets in client-side storage is insecure. Prefer server-side use.
   */
  keyAuthAppSecret?: string;
  createdAt: string;
};

export type RedeemKey = {
  id: string;
  key: string;
  productId: string;
  isRedeemed: boolean;
  redeemedByUserId?: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

export function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (raw) return JSON.parse(raw) as Product[];
  } catch {}
  return [];
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function loadKeys(): RedeemKey[] {
  try {
    const raw = localStorage.getItem(KEYS_KEY);
    if (raw) return JSON.parse(raw) as RedeemKey[];
  } catch {}
  return [];
}

export function saveKeys(keys: RedeemKey[]): void {
  localStorage.setItem(KEYS_KEY, JSON.stringify(keys));
}

export function loadAnnouncements(): Announcement[] {
  try {
    const raw = localStorage.getItem(ANNOUNCEMENTS_KEY);
    if (raw) return JSON.parse(raw) as Announcement[];
  } catch {}
  return [];
}

export function saveAnnouncements(items: Announcement[]): void {
  localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(items));
}

export function generateKeyString(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const parts: string[] = [];
  for (let i = 0; i < 4; i++) {
    let part = '';
    for (let j = 0; j < 4; j++) {
      part += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    parts.push(part);
  }
  return parts.join('-');
}

export function genId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export type LicenseDuration = { value: number; unit: 'days' | 'months' | 'years' };

export type LicenseKey = {
  id: string;
  /** The internal redemption key the admin sends to the user */
  key: string;
  /** The KeyAuth-issued license key shown to the user after redemption */
  keyAuthKey?: string;
  productId: string;
  productName: string;
  isRedeemed: boolean;
  redeemedByUserId?: string;
  redeemedAt?: string;
  expiresAt?: string; // ISO string
  createdAt: string;
};

export function loadLicenseKeys(): LicenseKey[] {
  try {
    const raw = localStorage.getItem(LICENSE_KEYS_KEY);
    if (raw) return JSON.parse(raw) as LicenseKey[];
  } catch {}
  return [];
}

export function saveLicenseKeys(keys: LicenseKey[]): void {
  localStorage.setItem(LICENSE_KEYS_KEY, JSON.stringify(keys));
}

export function computeExpiry(duration: LicenseDuration): string {
  const d = new Date();
  if (duration.unit === 'days') d.setDate(d.getDate() + duration.value);
  if (duration.unit === 'months') d.setMonth(d.getMonth() + duration.value);
  if (duration.unit === 'years') d.setFullYear(d.getFullYear() + duration.value);
  return d.toISOString();
}

export function formatExpiry(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
