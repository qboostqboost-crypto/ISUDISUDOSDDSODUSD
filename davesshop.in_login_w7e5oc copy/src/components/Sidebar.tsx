import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfileStore } from '../hooks/useProfileStore';
import { Home, Key, Download, Palette, MessageCircle, LogOut, ShieldCheck, BadgeCheck, User } from 'lucide-react';

const navItems = [
  { label: 'Home', icon: Home, path: '/dashboard' },
  { label: 'Get License', icon: BadgeCheck, path: '/license' },
  { label: 'Redeem Key', icon: Key, path: '/redeem' },
  { label: 'Downloads', icon: Download, path: '/downloads' },
  { label: 'Rebrand', icon: Palette, path: '/rebrand' },
];

const moreItems = [
  { label: 'Profile', icon: User, path: '/profile' },
  { label: 'Support', icon: MessageCircle, path: '/support' },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth() as any;
  const { profile } = useProfileStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggingOut = React.useRef(false);

  const handleLogout = async () => {
    if (isLoggingOut.current) return;
    isLoggingOut.current = true;
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      isLoggingOut.current = false;
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className="w-[220px] min-w-[220px] h-screen flex flex-col sticky top-0"
      style={{
        background: 'rgba(6,11,30,0.92)',
        borderRight: '1px solid rgba(59,130,246,0.12)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-0.2 px-4 py-5" style={{ borderBottom: '1px solid rgba(59,130,246,0.10)' }}>
        <div className="w-12 h-12 flex items-center justify-center shrink-0">
          <img
            src="https://c.animaapp.com/mmuuezyrLXbx4q/img/uploaded-asset-1773842433902-0.png"
            alt="Logo"
            className="w-8 h-8 object-contain"
          />
        </div>
        <span className="text-white font-semibold text-sm tracking-tight">Bloxify Services</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[10px] text-neutral-600 font-semibold uppercase tracking-widest px-2 mb-2">Overview</p>
        <ul className="space-y-0.5">
          {navItems.map(({ label, icon: Icon, path }) => (
            <li key={path}>
              <button
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(path)
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/25'
                    : 'text-blue-200/50 hover:text-white hover:bg-blue-500/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            </li>
          ))}
        </ul>

        <p className="text-[10px] text-neutral-600 font-semibold uppercase tracking-widest px-2 mb-2 mt-5">More</p>
        <ul className="space-y-0.5">
          {moreItems.map(({ label, icon: Icon, path }) => (
            <li key={path}>
              <button
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(path)
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/25'
                    : 'text-blue-200/50 hover:text-white hover:bg-blue-500/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            </li>
          ))}
          {profile?.isAdmin && (
            <li>
              <button
                onClick={() => navigate('/admin')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/admin')
                    ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
                    : 'text-neutral-400 hover:text-purple-400 hover:bg-purple-500/[0.05]'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Panel
              </button>
            </li>
          )}
          <li>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-blue-200/50 hover:text-white hover:bg-blue-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* User chip */}
      {user && (
        <div className="px-3 py-3" style={{ borderTop: '1px solid rgba(59,130,246,0.10)' }}>
          <div
            className="flex items-center gap-2.5 px-2 py-2 rounded-lg"
            style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(59,130,246,0.12)' }}
          >
            <div className="w-7 h-7 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-400 font-semibold text-xs shrink-0">
              {(profile?.username || user.username || '?')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{profile?.username || user.username || 'User'}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
