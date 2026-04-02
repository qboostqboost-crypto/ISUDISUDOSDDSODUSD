import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { MessageCircle, ExternalLink } from 'lucide-react';

export const SupportPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) { navigate('/'); return null; }

  return (
    <div className="flex min-h-screen font-inter" style={{background: 'radial-gradient(ellipse 80% 50% at 20% -10%, rgba(29,78,216,0.25) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(37,99,235,0.18) 0%, transparent 55%), #060b18'}}>
      <Sidebar />
      <main className="flex-1 flex flex-col items-center justify-center p-8 relative">
        {/* Blue ambient glow blobs */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-full overflow-hidden">
          <div style={{position:'absolute',top:'-80px',left:'60px',width:'420px',height:'300px',background:'radial-gradient(ellipse,rgba(37,99,235,0.13) 0%,transparent 70%)',borderRadius:'50%'}}></div>
          <div style={{position:'absolute',bottom:'120px',right:'40px',width:'360px',height:'260px',background:'radial-gradient(ellipse,rgba(59,130,246,0.10) 0%,transparent 70%)',borderRadius:'50%'}}></div>
          <div style={{position:'absolute',top:'40%',left:'35%',width:'280px',height:'200px',background:'radial-gradient(ellipse,rgba(96,165,250,0.07) 0%,transparent 70%)',borderRadius:'50%'}}></div>
        </div>
        <div className="text-center max-w-sm relative z-10">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <MessageCircle className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Support</h1>
          <p className="text-blue-300/40 text-sm mb-6">
            Join our Discord server and open a ticket for instant support from our team.
          </p>
          <a
            href="https://discord.gg/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold rounded-xl transition-all text-sm shadow-lg shadow-blue-500/30"
          >
            <MessageCircle className="w-4 h-4" />
            Join Discord Server
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </main>
    </div>
  );
};
