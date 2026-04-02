import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfileStore } from '../hooks/useProfileStore';
import { getAllUsers, updateUser } from '../store/authStore';
import { Sidebar } from '../components/Sidebar';
import { Plus, Trash2, Key, Package, Copy, CheckCircle, XCircle, Users, Bell, ShieldCheck, Palette, Loader2, BadgeCheck, Clock } from 'lucide-react';
import {
  Product,
  RedeemKey,
  Announcement,
  LicenseKey,
  LicenseDuration,
  loadProducts,
  saveProducts,
  loadKeys,
  saveKeys,
  loadAnnouncements,
  saveAnnouncements,
  loadLicenseKeys,
  saveLicenseKeys,
  generateKeyString,
  computeExpiry,
  formatExpiry,
  genId,
} from '../lib/storageHelpers';

type Tab = 'products' | 'keys' | 'licenses' | 'users' | 'announcements';

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useProfileStore();

  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>(() => loadProducts());
  const [keys, setKeys] = useState<RedeemKey[]>(() => loadKeys());
  const [allUsers, setAllUsers] = useState(() => getAllUsers());

  // Licenses
  const [licenseKeys, setLicenseKeys] = useState<LicenseKey[]>(() => loadLicenseKeys());
  const [licSelectedProductId, setLicSelectedProductId] = useState('');
  const [licDurationValue, setLicDurationValue] = useState(1);
  const [licDurationUnit, setLicDurationUnit] = useState<'days' | 'months' | 'years'>('months');
  const [licCopiedKey, setLicCopiedKey] = useState<string | null>(null);

  // Announcements — localStorage
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    loadAnnouncements().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  );
  const [annMutating, setAnnMutating] = useState(false);

  const [showAnnForm, setShowAnnForm] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annBody, setAnnBody] = useState('');

  const [showProductForm, setShowProductForm] = useState(false);
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [productOwnerId, setProductOwnerId] = useState('');
  const [productSellerKey, setProductSellerKey] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddProduct = () => {
    if (!productName.trim() || !productDesc.trim() || !productUrl.trim()) {
      showMsg('error', 'Please fill in all fields');
      return;
    }
    const newProduct: Product = {
      id: genId(),
      name: productName.trim(),
      description: productDesc.trim(),
      fileUrl: productUrl.trim(),
      keyAuthOwnerId: productOwnerId.trim() || undefined,
      keyAuthSellerKey: productSellerKey.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    const next = [...products, newProduct];
    saveProducts(next);
    setProducts(next);
    setProductName('');
    setProductDesc('');
    setProductUrl('');
    setProductOwnerId('');
    setProductSellerKey('');
    setShowProductForm(false);
    showMsg('success', 'Product added!');
  };

  const handleRemoveProduct = (id: string) => {
    if (!confirm('Remove this product?')) return;
    const next = products.filter((p) => p.id !== id);
    saveProducts(next);
    setProducts(next);
    showMsg('success', 'Product removed');
  };

  const handleGenerateKey = () => {
    if (!selectedProductId) { showMsg('error', 'Select a product first'); return; }
    const keyStr = generateKeyString();
    const newKey: RedeemKey = { id: genId(), key: keyStr, productId: selectedProductId, isRedeemed: false };
    const next = [...keys, newKey];
    saveKeys(next);
    setKeys(next);
    navigator.clipboard.writeText(keyStr).catch(() => {});
    setCopiedKey(keyStr);
    setTimeout(() => setCopiedKey(null), 3000);
    showMsg('success', `Key generated: ${keyStr}`);
  };

  const handleRemoveKey = (id: string) => {
    const next = keys.filter((k) => k.id !== id);
    saveKeys(next);
    setKeys(next);
  };

  const handleCopyKey = (k: string) => {
    navigator.clipboard.writeText(k).catch(() => {});
    setCopiedKey(k);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateLicense = () => {
    if (!licSelectedProductId) { showMsg('error', 'Select a product first'); return; }
    const product = products.find((p) => p.id === licSelectedProductId);
    if (!product) { showMsg('error', 'Product not found'); return; }
    const keyStr = generateKeyString();
    const expiresAt = computeExpiry({ value: licDurationValue, unit: licDurationUnit });
    const newLic: LicenseKey = {
      id: genId(),
      key: keyStr,
      productId: licSelectedProductId,
      productName: product.name,
      isRedeemed: false,
      expiresAt,
      createdAt: new Date().toISOString(),
    };
    const next = [...licenseKeys, newLic];
    saveLicenseKeys(next);
    setLicenseKeys(next);
    navigator.clipboard.writeText(keyStr).catch(() => {});
    setLicCopiedKey(keyStr);
    setTimeout(() => setLicCopiedKey(null), 3000);
    showMsg('success', `License key generated: ${keyStr}`);
  };

  const handleRemoveLicense = (id: string) => {
    const next = licenseKeys.filter((k) => k.id !== id);
    saveLicenseKeys(next);
    setLicenseKeys(next);
  };

  const handleCopyLicenseKey = (k: string) => {
    navigator.clipboard.writeText(k).catch(() => {});
    setLicCopiedKey(k);
    setTimeout(() => setLicCopiedKey(null), 2000);
  };

  const handleToggleAdmin = (userId: string, current: boolean) => {
    updateUser(userId, { isAdmin: !current });
    setAllUsers(getAllUsers());
    showMsg('success', `Admin access ${!current ? 'granted' : 'revoked'}`);
  };

  const handleToggleRebrand = (userId: string, current: boolean) => {
    updateUser(userId, { rebrandAccess: !current });
    setAllUsers(getAllUsers());
    showMsg('success', `Rebrand access ${!current ? 'granted' : 'revoked'}`);
  };

  const handleAddAnnouncement = () => {
    if (!annTitle.trim() || !annBody.trim()) { showMsg('error', 'Title and body are required'); return; }
    setAnnMutating(true);
    const newAnn: Announcement = {
      id: genId(),
      title: annTitle.trim(),
      body: annBody.trim(),
      createdAt: new Date().toISOString(),
    };
    const next = [newAnn, ...announcements];
    saveAnnouncements(next);
    setAnnouncements(next);
    setAnnTitle('');
    setAnnBody('');
    setShowAnnForm(false);
    showMsg('success', 'Announcement posted!');
    setAnnMutating(false);
  };

  const handleDeleteAnnouncement = (id: string) => {
    const next = announcements.filter((a) => a.id !== id);
    saveAnnouncements(next);
    setAnnouncements(next);
    showMsg('success', 'Announcement deleted');
  };

  if (!user || !profile?.isAdmin) return null;

  const tabs: { id: Tab; label: string; icon: React.FC<{ className?: string }>; count: number }[] = [
    { id: 'products', label: 'Products', icon: Package, count: products.length },
    { id: 'keys', label: 'Keys', icon: Key, count: keys.length },
    { id: 'licenses', label: 'Licenses', icon: BadgeCheck, count: licenseKeys.length },
    { id: 'users', label: 'Users', icon: Users, count: allUsers.length },
    { id: 'announcements', label: 'Announcements', icon: Bell, count: announcements.length },
  ];

  return (
    <div className="flex min-h-screen font-inter" style={{background: 'radial-gradient(ellipse 80% 50% at 20% -10%, rgba(29,78,216,0.25) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(37,99,235,0.18) 0%, transparent 55%), #060b18'}}>
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto relative">
        {/* Blue ambient glow blobs */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-full overflow-hidden">
          <div style={{position:'absolute',top:'-80px',left:'60px',width:'420px',height:'300px',background:'radial-gradient(ellipse,rgba(37,99,235,0.13) 0%,transparent 70%)',borderRadius:'50%'}}></div>
          <div style={{position:'absolute',bottom:'120px',right:'40px',width:'360px',height:'260px',background:'radial-gradient(ellipse,rgba(59,130,246,0.10) 0%,transparent 70%)',borderRadius:'50%'}}></div>
        </div>
        <div className="relative z-10">
        <h1 className="text-2xl font-bold text-white mb-1">Admin Panel</h1>
        <p className="text-blue-300/40 text-sm mb-6">Manage products, keys, and users.</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-blue-500/10 pb-4">
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                  : 'text-blue-200/40 hover:text-white hover:bg-blue-500/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-md ${activeTab === id ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500/10 text-blue-300/40'}`}>{count}</span>
            </button>
          ))}
        </div>

        {message && (
          <div className={`flex items-center gap-2 p-3 rounded-xl mb-5 text-sm border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {message.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
            {message.text}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <button
              onClick={() => setShowProductForm(!showProductForm)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/15 border border-blue-500/25 text-blue-400 text-sm font-medium rounded-xl hover:bg-blue-500/25 transition-all mb-5"
            >
              <Plus className="w-4 h-4" />Add Product
            </button>

            {showProductForm && (
              <div className="rounded-xl p-5 mb-5 space-y-3 border border-blue-500/10" style={{background:'rgba(10,18,50,0.75)', backdropFilter:'blur(10px)'}}>
                <h3 className="text-white font-semibold text-sm">New Product</h3>
                {[
                  { label: 'Name', val: productName, set: setProductName, placeholder: 'e.g. Premium Bot v2' },
                  { label: 'Description', val: productDesc, set: setProductDesc, placeholder: 'Short description' },
                  { label: 'Download URL', val: productUrl, set: setProductUrl, placeholder: 'https://...' },
                ].map(({ label, val, set, placeholder }) => (
                  <div key={label}>
                    <label className="block text-blue-300/50 text-xs mb-1">{label}</label>
                    <input
                      value={val}
                      onChange={(e) => set(e.target.value)}
                      placeholder={placeholder}
                      className="w-full border border-blue-500/15 rounded-lg px-3 py-2.5 text-white text-sm placeholder-blue-300/20 outline-none focus:border-blue-500/40 transition-all"
                      style={{background:'rgba(15,25,60,0.7)'}}
                    />
                  </div>
                ))}
                {/* KeyAuth credentials */}
                <div className="pt-1 border-t border-blue-500/10">
                  <p className="text-blue-400/50 text-xs font-medium mb-2 flex items-center gap-1.5">
                    <Key className="w-3 h-3" />KeyAuth Credentials <span className="text-blue-300/25">(optional — used to auto-generate licenses on redeem)</span>
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-blue-300/50 text-xs mb-1">Owner ID</label>
                      <input
                        value={productOwnerId}
                        onChange={(e) => setProductOwnerId(e.target.value)}
                        placeholder="e.g. 123456"
                        className="w-full border border-blue-500/15 rounded-lg px-3 py-2.5 text-white text-sm placeholder-blue-300/20 outline-none focus:border-blue-500/40 transition-all"
                        style={{background:'rgba(15,25,60,0.7)'}}
                      />
                    </div>
                    <div>
                      <label className="block text-blue-300/50 text-xs mb-1">Seller Key</label>
                      <input
                        value={productSellerKey}
                        onChange={(e) => setProductSellerKey(e.target.value)}
                        placeholder="Seller API key"
                        type="password"
                        className="w-full border border-blue-500/15 rounded-lg px-3 py-2.5 text-white text-sm placeholder-blue-300/20 outline-none focus:border-blue-500/40 transition-all"
                        style={{background:'rgba(15,25,60,0.7)'}}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={handleAddProduct} className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium rounded-lg transition-all">Add</button>
                  <button onClick={() => setShowProductForm(false)} className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-sm font-medium rounded-lg transition-all">Cancel</button>
                </div>
              </div>
            )}

            {products.length === 0 ? (
              <div className="text-center py-16 text-blue-300/30">
                <Package className="w-10 h-10 mx-auto mb-3" />
                <p className="text-sm">No products yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((p) => (
                  <div key={p.id} className="rounded-xl p-4 flex items-center justify-between border border-blue-500/10 hover:border-blue-500/20 transition-all" style={{background:'rgba(10,18,50,0.75)', backdropFilter:'blur(8px)'}}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/15">
                        <Package className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{p.name}</p>
                        <p className="text-blue-300/40 text-xs">{p.description}</p>
                        {p.keyAuthOwnerId && (
                          <p className="text-blue-400/30 text-xs mt-0.5 flex items-center gap-1">
                            <Key className="w-2.5 h-2.5" />KeyAuth OwnerID: {p.keyAuthOwnerId}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveProduct(p.id)}
                      className="p-2 text-blue-300/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Keys Tab */}
        {activeTab === 'keys' && (
          <div>
            <div className="rounded-xl p-5 mb-5 border border-blue-500/10" style={{background:'rgba(10,18,50,0.75)', backdropFilter:'blur(10px)'}}>
              <h3 className="text-white font-semibold text-sm mb-3">Generate Key</h3>
              <div className="flex gap-3">
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="flex-1 border border-blue-500/15 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-blue-500/40 transition-all"
                  style={{background:'rgba(15,25,60,0.7)'}}
                >
                  <option value="" style={{background:'#060b18'}}>Select a product...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} style={{background:'#060b18'}}>{p.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleGenerateKey}
                  disabled={!selectedProductId}
                  className="px-5 bg-blue-500 hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all flex items-center gap-2 text-sm"
                >
                  <Key className="w-4 h-4" />Generate
                </button>
              </div>
            </div>

            {keys.length === 0 ? (
              <div className="text-center py-16 text-blue-300/30">
                <Key className="w-10 h-10 mx-auto mb-3" />
                <p className="text-sm">No keys yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {keys.map((k) => {
                  const product = products.find((p) => p.id === k.productId);
                  return (
                    <div key={k.id} className={`rounded-xl p-3.5 flex items-center justify-between border transition-all ${k.isRedeemed ? 'border-blue-500/05 opacity-50' : 'border-blue-500/10 hover:border-blue-500/20'}`} style={{background:'rgba(10,18,50,0.75)', backdropFilter:'blur(8px)'}}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${k.isRedeemed ? 'bg-blue-500/05' : 'bg-blue-500/10'}`}>
                          <Key className={`w-4 h-4 ${k.isRedeemed ? 'text-blue-300/20' : 'text-blue-400'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <code className="text-white text-sm font-mono">{k.key}</code>
                            {k.isRedeemed && <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-300/30 text-xs rounded-md">Used</span>}
                          </div>
                          <p className="text-blue-300/30 text-xs">{product?.name || 'Unknown'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleCopyKey(k.key)} className="p-1.5 text-blue-300/40 hover:text-white hover:bg-blue-500/10 rounded-lg transition-all">
                          {copiedKey === k.key ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleRemoveKey(k.id)} className="p-1.5 text-blue-300/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div>
            <button
              onClick={() => setShowAnnForm(!showAnnForm)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/15 border border-blue-500/25 text-blue-400 text-sm font-medium rounded-xl hover:bg-blue-500/25 transition-all mb-5"
            >
              <Plus className="w-4 h-4" />Post Announcement
            </button>

            {showAnnForm && (
              <div className="rounded-xl p-5 mb-5 space-y-3 border border-blue-500/10" style={{background:'rgba(10,18,50,0.75)', backdropFilter:'blur(10px)'}}>
                <h3 className="text-white font-semibold text-sm">New Announcement</h3>
                <div>
                  <label className="block text-blue-300/50 text-xs mb-1">Title</label>
                  <input
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="e.g. Maintenance on Friday"
                    className="w-full border border-blue-500/15 rounded-lg px-3 py-2.5 text-white text-sm placeholder-blue-300/20 outline-none focus:border-blue-500/40 transition-all"
                    style={{background:'rgba(15,25,60,0.7)'}}
                  />
                </div>
                <div>
                  <label className="block text-blue-300/50 text-xs mb-1">Body</label>
                  <textarea
                    value={annBody}
                    onChange={(e) => setAnnBody(e.target.value)}
                    placeholder="Announcement details..."
                    rows={3}
                    className="w-full border border-blue-500/15 rounded-lg px-3 py-2.5 text-white text-sm placeholder-blue-300/20 outline-none focus:border-blue-500/40 transition-all resize-none"
                    style={{background:'rgba(15,25,60,0.7)'}}
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleAddAnnouncement}
                    disabled={annMutating}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2"
                  >
                    {annMutating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Post
                  </button>
                  <button onClick={() => setShowAnnForm(false)} className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-sm font-medium rounded-lg transition-all">Cancel</button>
                </div>
              </div>
            )}

            {announcements.length === 0 ? (
              <div className="text-center py-16 text-blue-300/30">
                <Bell className="w-10 h-10 mx-auto mb-3" />
                <p className="text-sm">No announcements yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {announcements.map((a) => (
                    <div key={a.id} className="rounded-xl p-4 flex items-start justify-between border border-blue-500/10 hover:border-blue-500/20 transition-all" style={{background:'rgba(10,18,50,0.75)', backdropFilter:'blur(8px)'}}>
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/15">
                          <Bell className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{a.title}</p>
                          {a.body && <p className="text-blue-300/40 text-xs mt-0.5 leading-relaxed">{a.body}</p>}
                          <p className="text-blue-400/30 text-xs mt-1.5">{new Date(a.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAnnouncement(a.id)}
                        className="p-2 text-blue-300/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all shrink-0 ml-3"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Licenses Tab */}
        {activeTab === 'licenses' && (
          <div>
            {/* Generate form */}
            <div className="rounded-xl p-5 mb-5 border border-blue-500/10" style={{background:'rgba(10,18,50,0.75)', backdropFilter:'blur(10px)'}}>
              <h3 className="text-white font-semibold text-sm mb-4">Generate License Key</h3>
              <div className="flex gap-3 flex-wrap">
                <select
                  value={licSelectedProductId}
                  onChange={(e) => setLicSelectedProductId(e.target.value)}
                  className="flex-1 min-w-[160px] border border-blue-500/15 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-blue-500/40 transition-all"
                  style={{background:'rgba(15,25,60,0.7)'}}
                >
                  <option value="" style={{background:'#060b18'}}>Select product...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} style={{background:'#060b18'}}>{p.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={licDurationValue}
                  onChange={(e) => setLicDurationValue(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 border border-blue-500/15 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-blue-500/40 transition-all text-center"
                  style={{background:'rgba(15,25,60,0.7)'}}
                />
                <select
                  value={licDurationUnit}
                  onChange={(e) => setLicDurationUnit(e.target.value as 'days' | 'months' | 'years')}
                  className="border border-blue-500/15 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-blue-500/40 transition-all"
                  style={{background:'rgba(15,25,60,0.7)'}}
                >
                  <option value="days" style={{background:'#060b18'}}>Days</option>
                  <option value="months" style={{background:'#060b18'}}>Months</option>
                  <option value="years" style={{background:'#060b18'}}>Years</option>
                </select>
                <button
                  onClick={handleGenerateLicense}
                  disabled={!licSelectedProductId}
                  className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all flex items-center gap-2 text-sm"
                >
                  <BadgeCheck className="w-4 h-4" />Generate
                </button>
              </div>
            </div>

            {licenseKeys.length === 0 ? (
              <div className="text-center py-16 text-blue-300/30">
                <BadgeCheck className="w-10 h-10 mx-auto mb-3" />
                <p className="text-sm">No license keys yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {licenseKeys.map((k) => {
                  const expired = k.expiresAt && new Date(k.expiresAt) < new Date();
                  return (
                    <div key={k.id} className={`rounded-xl p-3.5 flex items-center justify-between border transition-all ${k.isRedeemed ? 'border-blue-500/05 opacity-60' : 'border-blue-500/10 hover:border-blue-500/20'}`} style={{background:'rgba(10,18,50,0.75)', backdropFilter:'blur(8px)'}}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${k.isRedeemed ? 'bg-blue-500/05' : 'bg-blue-500/10'}`}>
                          <BadgeCheck className={`w-4 h-4 ${k.isRedeemed ? 'text-blue-300/20' : 'text-blue-400'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <code className="text-white text-sm font-mono">{k.key}</code>
                            {k.isRedeemed && <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-300/30 text-xs rounded-md">Redeemed</span>}
                            {!k.isRedeemed && expired && <span className="px-1.5 py-0.5 bg-red-500/10 text-red-400/60 text-xs rounded-md">Expired</span>}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-blue-300/30 text-xs flex items-center gap-1"><Package className="w-3 h-3" />{k.productName}</span>
                            {k.expiresAt && <span className="text-blue-300/30 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />Expires {formatExpiry(k.expiresAt)}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleCopyLicenseKey(k.key)} className="p-1.5 text-blue-300/40 hover:text-white hover:bg-blue-500/10 rounded-lg transition-all">
                          {licCopiedKey === k.key ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleRemoveLicense(k.id)} className="p-1.5 text-blue-300/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-2">
            {allUsers.map((u) => (
              <div key={u.id} className="rounded-xl p-4 flex items-center justify-between border border-blue-500/10 hover:border-blue-500/20 transition-all" style={{background:'rgba(10,18,50,0.75)', backdropFilter:'blur(8px)'}}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-xs font-bold border border-blue-500/25">
                    {u.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{u.username}</p>
                    <p className="text-blue-300/40 text-xs">ID: {u.id.slice(0, 12)}... · Since {new Date(u.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleAdmin(u.id, u.isAdmin)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${u.isAdmin ? 'bg-purple-500/15 text-purple-400 border-purple-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20' : 'bg-blue-500/10 text-blue-300/50 border-blue-500/15 hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/20'}`}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    {u.isAdmin ? 'Admin' : 'Make Admin'}
                  </button>
                  <button
                    onClick={() => handleToggleRebrand(u.id, u.rebrandAccess)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${u.rebrandAccess ? 'bg-blue-500/15 text-blue-400 border-blue-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20' : 'bg-blue-500/10 text-blue-300/50 border-blue-500/15 hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/25'}`}
                  >
                    <Palette className="w-3 h-3" />
                    {u.rebrandAccess ? 'Rebrand' : 'Grant Rebrand'}
                  </button>
                </div>
              </div>
            ))}
            {allUsers.length === 0 && (
              <div className="text-center py-16 text-blue-300/30">
                <Users className="w-10 h-10 mx-auto mb-3" />
                <p className="text-sm">No users yet</p>
              </div>
            )}
          </div>
        )}
        </div>
      </main>
    </div>
  );
};
