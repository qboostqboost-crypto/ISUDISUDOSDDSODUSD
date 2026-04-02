import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { loadLicenseKeys, saveLicenseKeys, formatExpiry } from '../lib/storageHelpers';
import type { LicenseKey } from '../lib/storageHelpers';
import { BadgeCheck, Copy, CheckCircle, XCircle, Key, Clock, Package } from 'lucide-react';

export const GetLicensePage: React.FC = () => {
  const { user } = useAuth();
  const [inputKey, setInputKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [redeemedLicense, setRedeemedLicense] = useState<LicenseKey | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const userLicenses: LicenseKey[] = loadLicenseKeys().filter(
    (k) => k.isRedeemed && k.redeemedByUserId === user?.id
  );

  // ---------------------------------------------------------------------------
  // KeyAuth integration — uses the product's Owner ID + Seller Key to call the
  // KeyAuth Seller API and generate a real license key.
  //
  // When a product has ownerKey + sellerKey set, it hits the real API.
  // If credentials are missing it falls back to a placeholder key so the
  // UI flow still works during development.
  // ---------------------------------------------------------------------------
  const callKeyAuth = async (license: LicenseKey): Promise<string> => {
    const { loadProducts } = await import('../lib/storageHelpers');
    const products = loadProducts();
    const product = products.find((p) => p.id === license.productId);

  const ownerId = product?.keyAuthOwnerId;
  // Prefer the explicit seller key; fall back to an application secret field if present.
  // NOTE: falling back to an application secret is insecure for production — keep seller keys on the server.
  const sellerKey = product?.keyAuthSellerKey ?? product?.keyAuthAppSecret;

    if (ownerId && sellerKey) {
      const expiryDays = license.expiresAt
        ? String(Math.max(1, Math.ceil((new Date(license.expiresAt).getTime() - Date.now()) / 86400000)))
        : '30';

      const params = new URLSearchParams({
        type: 'add',
        format: 'JSON',
        sellerkey: sellerKey,
        expiry: expiryDays,
        level: '1',
        amount: '1',
        owner: ownerId,
      });

      const targetUrl = `https://keyauth.win/api/seller/?${params.toString()}`;

      // Try multiple public CORS proxies (some return raw, some wrap the response).
      // Note: browser CORS for KeyAuth can't be guaranteed; using proxies helps in dev.
      const proxies = [
        // allorigins raw will return the proxied content directly (preferred)
        `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
        // thingproxy sometimes works for simple GETs
        `https://thingproxy.freeboard.io/fetch/${targetUrl}`,
        // corsproxy.io also proxies GETs
        `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
      ];

      let lastError = 'No proxy succeeded';

      for (const proxyUrl of proxies) {
        try {
          console.log(`__ANIMA_DBG__ KeyAuth proxy attempt: ${proxyUrl}`);
          const res = await fetch(proxyUrl);
          if (!res.ok) {
            lastError = `HTTP ${res.status} from ${proxyUrl}`;
            console.log(`__ANIMA_DBG__ KeyAuth proxy non-ok: ${lastError}`);
            continue;
          }

          const text = await res.text();
          console.log(`__ANIMA_DBG__ KeyAuth raw response from ${proxyUrl}:`, text);

          // Try parsing the text into JSON. Some proxies return a wrapper like { contents: "..." }
          let data: any = null;
          try {
            const parsed = JSON.parse(text);
            // allorigins GET returns { contents: "..." } for its non-raw endpoint; raw returns the content directly.
            if (parsed && typeof parsed === 'object' && typeof parsed.contents === 'string') {
              data = JSON.parse(parsed.contents);
            } else {
              data = parsed;
            }
          } catch (innerErr) {
            // If parsing failed, maybe the response is a raw JSON string with whitespace — try parsing again
            try {
              data = JSON.parse(text.trim());
            } catch (finalErr) {
              throw new Error(`Failed to parse JSON from proxy ${proxyUrl}: ${finalErr?.message ?? finalErr}`);
            }
          }

          console.log(`__ANIMA_DBG__ KeyAuth parsed from ${proxyUrl}:`, data);

          if (data && data.success === true && data.key) return data.key as string;
          // Some KeyAuth responses return success as boolean, else include a message
          throw new Error(data?.message ?? 'KeyAuth API returned an unexpected response');
        } catch (err: any) {
          console.log(`__ANIMA_DBG__ KeyAuth proxy error (${proxyUrl}):`, err?.message ?? err);
          lastError = err?.message ?? String(err ?? lastError);
        }
      }

      throw new Error(lastError);
    }

    // No credentials set — generate a local placeholder key so the flow still works
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const seg = () => Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `KA-${seg()}-${seg()}-${seg()}-${seg()}`;
  };

  const handleRedeem = () => {
    if (!inputKey.trim()) {
      setMessage({ type: 'error', text: 'Please enter a license key' });
      return;
    }
    setLoading(true);
    setMessage(null);
    setRedeemedLicense(null);

    const all = loadLicenseKeys();
    const match = all.find((k) => k.key.toUpperCase() === inputKey.trim().toUpperCase());

    if (!match) {
      setMessage({ type: 'error', text: 'Invalid license key. Please check and try again.' });
      setLoading(false);
      return;
    }
    if (match.isRedeemed) {
      setMessage({ type: 'error', text: 'This license key has already been redeemed.' });
      setLoading(false);
      return;
    }

    callKeyAuth(match)
      .then((keyAuthKey) => {
        const now = new Date().toISOString();
        // Store the KeyAuth-issued key in the record so the user can copy it
        const updated: LicenseKey = {
          ...match,
          isRedeemed: true,
          redeemedByUserId: user?.id,
          redeemedAt: now,
          keyAuthKey,
        };
        const next = all.map((k) => (k.id === match.id ? updated : k));
        saveLicenseKeys(next);
        setRedeemedLicense(updated);
        setInputKey('');
        setLoading(false);
      })
      .catch((err: any) => {
        const msg = err?.message ?? 'Failed to generate license from KeyAuth. Please try again.';
        setMessage({ type: 'error', text: `Failed to generate license from KeyAuth: ${msg}` });
        setLoading(false);
      });
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key).catch(() => {});
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const isExpired = (isoString?: string) => {
    if (!isoString) return false;
    return new Date(isoString) < new Date();
  };

  return (
    <div
      className="flex min-h-screen font-inter"
      style={{
        background:
          'radial-gradient(ellipse 80% 50% at 20% -10%, rgba(29,78,216,0.25) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(37,99,235,0.18) 0%, transparent 55%), #060b18',
      }}
    >
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto relative">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-full overflow-hidden">
          <div style={{ position: 'absolute', top: '-80px', left: '60px', width: '420px', height: '300px', background: 'radial-gradient(ellipse,rgba(37,99,235,0.13) 0%,transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '120px', right: '40px', width: '360px', height: '260px', background: 'radial-gradient(ellipse,rgba(59,130,246,0.10) 0%,transparent 70%)', borderRadius: '50%' }} />
        </div>

        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold text-white mb-1">Get License</h1>
          <p className="text-blue-300/40 text-sm mb-8">Enter your license key to activate a product.</p>

          {/* Redeem card */}
          <div
            className="rounded-2xl p-6 border border-blue-500/10 mb-6"
            style={{ background: 'rgba(10,18,50,0.75)', backdropFilter: 'blur(10px)' }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-blue-500/15 rounded-xl flex items-center justify-center border border-blue-500/20">
                <BadgeCheck className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-semibold">Redeem License Key</p>
                <p className="text-blue-300/40 text-xs">Paste the key you received after purchase</p>
              </div>
            </div>


            <div className="flex gap-3">
              <input
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRedeem()}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                className="flex-1 border border-blue-500/15 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-blue-300/20 outline-none focus:border-blue-500/40 transition-all"
                style={{ background: 'rgba(15,25,60,0.7)' }}
              />
              <button
                onClick={handleRedeem}
                disabled={loading}
                className="px-5 py-3 bg-blue-500 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all text-sm flex items-center gap-2 shrink-0"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                    Redeeming...
                  </span>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    Redeem
                  </>
                )}
              </button>
            </div>

            {/* Message */}
            {message && (
              <div className={`flex items-center gap-2 mt-4 p-3 rounded-xl text-sm border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                {message.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                {message.text}
              </div>
            )}

            {/* Success result */}
            {redeemedLicense && (
              <div className="mt-5 rounded-xl p-4 border border-emerald-500/20" style={{ background: 'rgba(16,48,30,0.5)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">License Redeemed!</span>
                </div>
                <p className="text-blue-300/50 text-xs mb-1">Your KeyAuth license key</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-white font-mono text-sm bg-blue-500/10 border border-blue-500/15 rounded-lg px-3 py-2">
                    {redeemedLicense.keyAuthKey ?? redeemedLicense.key}
                  </code>
                  <button
                    onClick={() => handleCopy(redeemedLicense.keyAuthKey ?? redeemedLicense.key)}
                    className="p-2 text-blue-300/40 hover:text-white hover:bg-blue-500/10 rounded-lg transition-all"
                  >
                    {copiedKey ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-blue-300/30 text-xs mt-2">Save this key — it&#39;s your license to use the product.</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-blue-300/40">
                  <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" />{redeemedLicense.productName}</span>
                  {redeemedLicense.expiresAt && (
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Expires {formatExpiry(redeemedLicense.expiresAt)}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User's licenses */}
          <div
            className="rounded-2xl p-6 border border-blue-500/10"
            style={{ background: 'rgba(10,18,50,0.75)', backdropFilter: 'blur(10px)' }}
          >
            <h2 className="text-white font-semibold mb-4">Your Licenses</h2>
            {userLicenses.length === 0 ? (
              <div className="text-center py-10 text-blue-300/30">
                <BadgeCheck className="w-9 h-9 mx-auto mb-2" />
                <p className="text-sm">No licenses redeemed yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userLicenses.map((lic) => {
                  const expired = isExpired(lic.expiresAt);
                  return (
                    <div
                      key={lic.id}
                      className="rounded-xl p-4 border border-blue-500/10 hover:border-blue-500/20 transition-all"
                      style={{ background: 'rgba(15,25,60,0.6)' }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/15 shrink-0">
                            <BadgeCheck className="w-4 h-4 text-blue-400" />
                          </div>
                            <div>
                            <p className="text-white text-sm font-medium">{lic.productName}</p>
                            <code className="text-blue-300/50 text-xs font-mono">{lic.keyAuthKey ?? lic.key}</code>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          {lic.expiresAt ? (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${expired ? 'bg-red-500/15 text-red-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
                              {expired ? 'Expired' : 'Active'}
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-500/15 text-emerald-400">Active</span>
                          )}
                          {lic.expiresAt && (
                            <span className="text-blue-300/30 text-xs flex items-center gap-1">
                              <Clock className="w-3 h-3" />{formatExpiry(lic.expiresAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
