import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { Palette } from 'lucide-react';

export const RebrandPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) { navigate('/'); return null; }

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
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/15 rounded-2xl flex items-center justify-center mb-4">
              <Palette className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-blue-400 font-semibold text-2xl mb-2">Coming Soon!</h2>
            <p className="text-blue-300/40 text-sm max-w-xs">ETA: 1 Month</p>
          </div>
        </div>
      </main>
    </div>
  );
};
