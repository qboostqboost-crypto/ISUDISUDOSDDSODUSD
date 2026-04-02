import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfileStore } from '../hooks/useProfileStore';
import { Sidebar } from '../components/Sidebar';
import { Download, Package, Key } from 'lucide-react';
import { loadKeys, loadProducts } from '../lib/storageHelpers';

export const DownloadsPage: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useProfileStore();
  const navigate = useNavigate();

  const products = React.useMemo(() => {
    if (!user || !profile) return [];
    const redeemedKeyIds = profile.redeemedKeys ?? [];
    const keys = loadKeys();
    const allProducts = loadProducts();
    const seen = new Set<string>();
    const result = [];
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
  }, [user, profile]);

  return (
    <div className="flex min-h-screen font-inter" style={{background: 'radial-gradient(ellipse 80% 50% at 20% -10%, rgba(29,78,216,0.25) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(37,99,235,0.18) 0%, transparent 55%), #060b18'}}>
      <Sidebar />
      <main className="flex-1 p-8 relative">
        {/* Blue ambient glow blobs */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-full overflow-hidden">
          <div style={{position:'absolute',top:'-80px',left:'60px',width:'420px',height:'300px',background:'radial-gradient(ellipse,rgba(37,99,235,0.13) 0%,transparent 70%)',borderRadius:'50%'}}></div>
          <div style={{position:'absolute',bottom:'120px',right:'40px',width:'360px',height:'260px',background:'radial-gradient(ellipse,rgba(59,130,246,0.10) 0%,transparent 70%)',borderRadius:'50%'}}></div>
        </div>
        <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
            <Download className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Downloads</h1>
            <p className="text-blue-300/40 text-sm">Access your purchased software</p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/15 rounded-2xl flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-blue-300/30" />
            </div>
            <h2 className="text-white font-semibold mb-2">No downloads yet</h2>
            <p className="text-blue-300/40 text-sm mb-5 max-w-xs">Redeem a product key to unlock your downloads.</p>
            <button
              onClick={() => navigate('/redeem')}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/15 border border-blue-500/25 text-blue-400 text-sm font-medium rounded-xl hover:bg-blue-500/25 transition-all"
            >
              <Key className="w-4 h-4" />
              Redeem a Key
            </button>
          </div>
        ) : (
          <div className="space-y-3 max-w-2xl">
            {products.map((product) => (
              <div key={product.id} className="rounded-xl p-5 flex items-center justify-between border border-blue-500/10 hover:border-blue-500/20 transition-all" style={{background:'rgba(10,18,50,0.75)', backdropFilter:'blur(8px)'}}>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-blue-500/10 border border-blue-500/15 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-400" />
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
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
        </div>
      </main>
    </div>
  );
};
