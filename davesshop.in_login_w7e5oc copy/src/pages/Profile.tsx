import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useProfileStore } from '../hooks/useProfileStore';
import { loadProducts, loadKeys } from '../lib/storageHelpers';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useProfileStore();
  const { changePassword } = useAuth();
  const [showChange, setShowChange] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // (redemption history removed) licenses are no longer used

  // Compute downloadable products based on redeemed key ids (same logic as DownloadsPage)
  const downloadedProducts = React.useMemo(() => {
    if (!profile || !user) return [];
    const redeemedKeyIds = profile.redeemedKeys ?? [];
    const keys = loadKeys();
    const allProducts = loadProducts();
    const seen = new Set<string>();
    const result: typeof allProducts = [] as any;
    for (const keyId of redeemedKeyIds) {
      const keyObj = keys.find((k) => k.id === keyId);
      if (!keyObj) continue;
      const product = allProducts.find((p) => p.id === keyObj.productId);
      if (product && !seen.has(product.id)) {
        seen.add(product.id);
        result.push(product);
      }
    }
    return result;
  }, [profile, user]);

  const memberSince = profile
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
    : '—';

  

  return (
    <div
      className="flex min-h-screen font-inter"
      style={{
        background:
          'radial-gradient(ellipse 80% 50% at 20% -10%, rgba(29,78,216,0.25) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(37,99,235,0.18) 0%, transparent 55%), #060b18',
      }}
    >
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-3xl font-semibold text-white">
              {(profile?.username || user?.username || '?')[0].toUpperCase()}
            </div>
            <div>
              <p className="text-white text-2xl font-semibold">{profile?.username || user?.username || 'User'}</p>
              <p className="text-blue-300/40 mt-1">{user?.email ?? 'No email provided'}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-blue-300/40">Member since</p>
              <p className="font-medium">{memberSince}</p>
            </div>
          </div>

          <div className="rounded-2xl p-6 border border-blue-500/10 mb-6" style={{ background: 'rgba(10,18,50,0.75)', backdropFilter: 'blur(10px)' }}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-blue-300/50 text-xs mb-2">Full Name</p>
                <div className="rounded-md p-3 bg-[#071027] text-white">{profile?.username ?? user?.username ?? '—'}</div>

                <p className="text-blue-300/50 text-xs mt-4 mb-2">Email Address</p>
                <div className="rounded-md p-3 bg-[#071027] text-white">{profile?.email ?? user?.email ?? '—'}</div>
              </div>
              <div>
                <p className="text-blue-300/50 text-xs mb-2">Account Status</p>
                <div className="rounded-md p-3 bg-[#071027] text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-blue-300/40">Status:</p>
                      <p className="font-medium text-green-400">Active</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-blue-300/40">Member Since:</p>
                      <p className="font-medium">{memberSince}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Redemption History removed per user request */}

          {/* My Downloads section (mirrors DownloadsPage) */}
          <div className="rounded-2xl p-6 border border-blue-500/10 mb-6" style={{ background: 'rgba(10,18,50,0.75)', backdropFilter: 'blur(10px)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7v10a2 2 0 0 0 2 2h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 7l-9 6L3 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">My Downloads</h3>
                <p className="text-blue-300/40 text-sm">Files unlocked by your redeemed keys</p>
              </div>
            </div>

            {downloadedProducts.length === 0 ? (
              <div className="text-blue-300/40 text-sm">No downloads available. Redeem a product key to unlock downloads.</div>
            ) : (
              <div className="space-y-3 max-w-2xl">
                {downloadedProducts.map((product) => (
                  <div key={product.id} className="rounded-xl p-5 flex items-center justify-between border border-blue-500/10 hover:border-blue-500/20 transition-all" style={{background:'rgba(10,18,50,0.75)', backdropFilter:'blur(8px)'}}>
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-blue-500/10 border border-blue-500/15 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7v10a2 2 0 0 0 2 2h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 7l-9 6L3 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{product.name}</p>
                        <p className="text-blue-300/40 text-xs mt-0.5">{product.description}</p>
                      </div>
                    </div>
                    <a
                      href={product.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500/15 border border-blue-500/20 text-blue-400 text-xs font-medium rounded-lg hover:bg-blue-500/25 transition-all"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl p-6 border border-blue-500/10" style={{ background: 'rgba(10,18,50,0.75)', backdropFilter: 'blur(10px)' }}>
            <h2 className="text-white font-semibold mb-3">Security</h2>
            {!showChange ? (
              <div>
                <button onClick={() => { setShowChange(true); setPwdMsg(null); }} className="px-4 py-2 bg-blue-500 text-white rounded-md">Change Password</button>
              </div>
            ) : (
              <div className="space-y-3">
                {pwdMsg && (
                  <div className={`p-3 rounded-md text-sm ${pwdMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>{pwdMsg.text}</div>
                )}
                <div>
                  <label className="text-xs text-blue-300/50">Current password</label>
                  <input value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} type="password" className="w-full mt-1 p-3 rounded-md bg-[#071027] text-white" />
                </div>
                <div>
                  <label className="text-xs text-blue-300/50">New password</label>
                  <input value={newPass} onChange={(e) => setNewPass(e.target.value)} type="password" className="w-full mt-1 p-3 rounded-md bg-[#071027] text-white" />
                </div>
                <div>
                  <label className="text-xs text-blue-300/50">Confirm new password</label>
                  <input value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} type="password" className="w-full mt-1 p-3 rounded-md bg-[#071027] text-white" />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={async () => {
                      setPwdMsg(null);
                      if (!currentPass || !newPass) { setPwdMsg({ type: 'error', text: 'Please fill both fields' }); return; }
                      if (newPass !== confirmPass) { setPwdMsg({ type: 'error', text: 'New passwords do not match' }); return; }
                      const res = await changePassword(currentPass, newPass);
                      if (res.success) {
                        setPwdMsg({ type: 'success', text: 'Password changed successfully' });
                        setCurrentPass(''); setNewPass(''); setConfirmPass(''); setTimeout(() => setShowChange(false), 1200);
                      } else {
                        setPwdMsg({ type: 'error', text: res.error || 'Failed to change password' });
                      }
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >Save</button>
                  <button onClick={() => { setShowChange(false); setPwdMsg(null); }} className="px-4 py-2 border border-blue-500/10 text-blue-300 rounded-md">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
