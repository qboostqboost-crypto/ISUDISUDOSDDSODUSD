import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfileStore } from '../hooks/useProfileStore';
import { Sidebar } from '../components/Sidebar';
import { Key, XCircle, Loader2, PartyPopper, Download, MessageCircle, CheckCircle, RotateCcw, AlertCircle } from 'lucide-react';
import { loadKeys, saveKeys, loadProducts } from '../lib/storageHelpers';

export const RedeemPage: React.FC = () => {
  const { user } = useAuth();
  const { profile, update: updateProfile } = useProfileStore();
  const navigate = useNavigate();
  const [keyInput, setKeyInput] = useState('');
  const [toolType, setToolType] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [redeemedProductName, setRedeemedProductName] = useState('');

  const formatKey = (val: string) => {
    const clean = val.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 16);
    const parts = clean.match(/.{1,4}/g) || [];
    return parts.join('-');
  };

  const handleKeyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyInput(formatKey(e.target.value));
    if (status === 'error') setStatus('idle');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setKeyInput(formatKey(text));
      if (status === 'error') setStatus('idle');
    } catch {}
  };

  const handleRedeem = async () => {
    if (!user || !profile) return;
    const raw = keyInput.replace(/-/g, '');
    if (raw.length < 4) return;

    setLoading(true);
    setStatus('idle');

    try {
      const keys = loadKeys();
      const products = loadProducts();

      const keyObj = keys.find((k) => k.key === keyInput && !k.isRedeemed);

      if (!keyObj) {
        const alreadyUsed = keys.find((k) => k.key === keyInput && k.isRedeemed);
        setStatus('error');
        setMessage(alreadyUsed ? 'This key has already been redeemed.' : 'Invalid key — please double-check and try again.');
        setLoading(false);
        return;
      }

      const product = products.find((p) => p.id === keyObj.productId);

      const updatedKeys = keys.map((k) =>
        k.id === keyObj.id ? { ...k, isRedeemed: true, redeemedByUserId: user.id } : k
      );
      saveKeys(updatedKeys);

      const existing = profile.redeemedKeys ?? [];
      if (!existing.includes(keyObj.id)) {
        updateProfile(user.id, { redeemedKeys: [...existing, keyObj.id] });
      }

      setRedeemedProductName(product?.name || 'Your product');
      setStatus('success');
      setMessage('Key redeemed successfully!');
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || 'Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  const handleReset = () => {
    setKeyInput('');
    setStatus('idle');
    setMessage('');
    setRedeemedProductName('');
    setToolType('');
  };

  const charCount = keyInput.replace(/-/g, '').length;

  const products = loadProducts();

  return (
    <div className="flex min-h-screen font-inter" style={{background: 'radial-gradient(ellipse 80% 50% at 20% -10%, rgba(29,78,216,0.25) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(37,99,235,0.18) 0%, transparent 55%), #060b18'}}>
      <Sidebar />
      <main className="flex-1 flex flex-col p-10 relative overflow-y-auto">
        {/* Ambient glow blobs */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-full overflow-hidden">
          <div style={{position:'absolute',top:'-80px',left:'60px',width:'420px',height:'300px',background:'radial-gradient(ellipse,rgba(37,99,235,0.13) 0%,transparent 70%)',borderRadius:'50%'}}></div>
          <div style={{position:'absolute',bottom:'120px',right:'40px',width:'360px',height:'260px',background:'radial-gradient(ellipse,rgba(59,130,246,0.10) 0%,transparent 70%)',borderRadius:'50%'}}></div>
        </div>

        <div className="relative z-10 max-w-2xl w-full mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Redeem your <span className="text-blue-400">product key</span>
            </h1>
            <p className="text-blue-300/50 text-base">
              Activate your purchased tools and services, {profile?.username || user?.username || 'User'}.
            </p>
          </div>

          {status === 'success' ? (
              <div className="rounded-2xl border border-blue-400/30 p-8" style={{background:'rgba(10,18,50,0.85)', backdropFilter:'blur(14px)'}}>
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PartyPopper className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-white text-2xl font-bold mb-2">Key Redeemed!</h2>
                <p className="text-blue-300/50 text-sm mb-1">{message}</p>
                <div className="mt-4 p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl text-left">
                  <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">Product Unlocked</p>
                  <p className="text-white font-medium">{redeemedProductName}</p>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => navigate('/downloads')}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-medium py-3 rounded-xl text-sm transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Go to Downloads
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 font-medium py-3 rounded-xl text-sm transition-all border border-blue-500/15"
                  >
                    Redeem Another
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Main card */}
              <div className="rounded-2xl border border-blue-400/30 p-7 mb-4" style={{background:'rgba(10,18,50,0.85)', backdropFilter:'blur(14px)'}}>
                {/* Card header */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-blue-500/10">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <Key className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-base">Product key redemption</p>
                    <p className="text-blue-300/45 text-sm">Enter your details to unlock access instantly.</p>
                  </div>
                </div>

                {/* Tool type */}
                <div className="mb-5">
                  <label className="block text-blue-200/70 text-sm font-medium mb-2">Tool type</label>
                  <div className="relative">
                    <select
                      value={toolType}
                      onChange={(e) => setToolType(e.target.value)}
                      className="w-full border border-blue-500/15 rounded-xl px-4 py-3 text-sm appearance-none outline-none transition-all pr-10 cursor-pointer"
                      style={{background:'rgba(15,25,65,0.8)', color: toolType ? 'white' : 'rgba(147,197,253,0.35)'}}
                    >
                      <option value="" disabled hidden>Choose a tool type...</option>
                      {products.length === 0 && <option value="general">General</option>}
                      {products.map((p) => (
                        <option key={p.id} value={p.id} style={{background:'#0f1941', color:'white'}}>{p.name}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-blue-300/40">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                </div>

                {/* Product key input */}
                <div className="mb-4">
                  <label className="block text-blue-200/70 text-sm font-medium mb-2">Product key</label>
                  <div className={`flex items-center border rounded-xl transition-all overflow-hidden ${
                    status === 'error'
                      ? 'border-red-500/40 bg-red-500/5'
                      : charCount > 0
                      ? 'border-blue-500/30'
                      : 'border-blue-500/15'
                  }`} style={{background: status === 'error' ? undefined : 'rgba(15,25,65,0.8)'}}>
                    <div className="pl-4 pr-2 text-blue-300/35 shrink-0">
                      <Key className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={keyInput}
                      onChange={handleKeyInput}
                      onKeyDown={(e) => e.key === 'Enter' && handleRedeem()}
                      placeholder="Enter your key…"
                      className="flex-1 bg-transparent py-3 text-white font-mono tracking-wider placeholder-blue-300/25 outline-none text-sm"
                      maxLength={19}
                      autoFocus
                    />
                    <button
                      onClick={handlePaste}
                      className="mr-2 px-3 py-1.5 text-xs font-medium text-blue-300 border border-blue-500/20 rounded-lg hover:bg-blue-500/10 transition-all shrink-0"
                    >
                      Paste
                    </button>
                  </div>
                  <p className="text-blue-300/35 text-xs mt-2 px-1">Keys are case-sensitive. We'll format as you type.</p>
                </div>

                {/* Error */}
                {status === 'error' && (
                  <div className="flex items-center gap-2 mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {message}
                  </div>
                )}

                {/* Redeem button */}
                <button
                  onClick={handleRedeem}
                  disabled={loading || charCount < 4}
                  className="w-full bg-blue-500 hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                  style={{boxShadow: '0 4px 24px rgba(59,130,246,0.25)'}}
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Checking key...</>
                  ) : (
                    'Redeem key'
                  )}
                </button>
              </div>

              {/* Need help card */}
              <div className="rounded-2xl border border-blue-400/30 px-6 py-4 mb-4 flex items-center justify-between" style={{background:'rgba(10,18,50,0.85)', backdropFilter:'blur(14px)'}}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Need help?</p>
                    <p className="text-blue-300/45 text-xs">Get instant support on Discord</p>
                  </div>
                </div>
                <a
                  href="https://discord.gg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm font-medium text-blue-300 border border-blue-500/25 rounded-xl hover:bg-blue-500/10 transition-all"
                >
                  Open Discord
                </a>
              </div>

              {/* Info cards row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <CheckCircle className="w-5 h-5 text-blue-400" />, title: 'Check format', desc: 'Make Sure To Use The Key Provided To You' },
                  { icon: <RotateCcw className="w-5 h-5 text-blue-400" />, title: 'One-time use', desc: 'Each key works once per account.' },
                  { icon: <XCircle className="w-5 h-5 text-blue-400" />, title: 'Wrong tool?', desc: 'Switch tool type then try again.' },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl border border-blue-400/30 p-4" style={{background:'rgba(10,18,50,0.80)', backdropFilter:'blur(12px)'}}>
                    <div className="w-9 h-9 rounded-lg bg-blue-500/12 border border-blue-500/15 flex items-center justify-center mb-3">
                      {item.icon}
                    </div>
                    <p className="text-white text-sm font-semibold mb-1">{item.title}</p>
                    <p className="text-blue-300/40 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
