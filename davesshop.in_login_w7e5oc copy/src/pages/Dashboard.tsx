import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfileStore } from '../hooks/useProfileStore';
import { Sidebar } from '../components/Sidebar';
import { Key, Download, Info, BadgeCheck } from 'lucide-react';
import { loadAnnouncements, Announcement } from '../lib/storageHelpers';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useProfileStore();
  const navigate = useNavigate();

  const redeemedKeyCount = profile?.redeemedKeys?.length ?? 0;
  const userProductCount = redeemedKeyCount;

  const announcements: Announcement[] = loadAnnouncements()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const quickActions = [
    { icon: BadgeCheck, title: 'Get License', desc: 'Activate your license key', path: '/license' },
    { icon: Key, title: 'Redeem a key', desc: 'Activate your purchased products', path: '/redeem' },
    { icon: Download, title: 'Downloads', desc: 'Access your purchased software', path: '/downloads' },
  ];

  const username = profile?.username || user?.username || 'User';
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
      <main className="flex-1 p-8 overflow-y-auto relative">
        {/* Blue ambient glow blobs */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-full overflow-hidden">
          <div
            style={{
              position: 'absolute',
              top: '-80px',
              left: '60px',
              width: '420px',
              height: '300px',
              background: 'radial-gradient(ellipse,rgba(37,99,235,0.13) 0%,transparent 70%)',
              borderRadius: '50%',
            }}
          ></div>
          <div
            style={{
              position: 'absolute',
              bottom: '120px',
              right: '40px',
              width: '360px',
              height: '260px',
              background: 'radial-gradient(ellipse,rgba(59,130,246,0.10) 0%,transparent 70%)',
              borderRadius: '50%',
            }}
          ></div>
          <div
            style={{
              position: 'absolute',
              top: '40%',
              left: '35%',
              width: '280px',
              height: '200px',
              background: 'radial-gradient(ellipse,rgba(96,165,250,0.07) 0%,transparent 70%)',
              borderRadius: '50%',
            }}
          ></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-1">
            Welcome back, <span className="text-blue-400">{username}</span>
          </h1>
          <p className="text-blue-300/40 text-sm mb-7">
            Manage your Discord tools and services from your personal dashboard.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Active subs', value: userProductCount },
              { label: 'Total subs', value: userProductCount },
              { label: 'Keys used', value: redeemedKeyCount },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-5 border border-blue-500/10"
                style={{ background: 'rgba(15,25,60,0.7)', backdropFilter: 'blur(8px)' }}
              >
                <p className="text-blue-300/50 text-sm mb-2">{stat.label}</p>
                <p className="text-white text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="grid grid-cols-3 gap-5">
            {/* Quick actions + updates (2 cols) */}
            <div
              className="col-span-2 rounded-xl p-5 border border-blue-500/10"
              style={{ background: 'rgba(10,18,50,0.75)', backdropFilter: 'blur(10px)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold">Quick actions</h2>
                <span className="text-blue-400/40 text-xs">Do more with fewer clicks</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action.title}
                    onClick={() => navigate(action.path)}
                    className="flex flex-col gap-3 p-4 rounded-xl border border-blue-500/10 hover:border-blue-500/25 transition-all text-left"
                    style={{ background: 'rgba(17,30,75,0.7)' }}
                  >
                    <div className="w-10 h-10 bg-blue-500/15 rounded-xl flex items-center justify-center border border-blue-500/20">
                      <action.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{action.title}</p>
                      <p className="text-blue-300/40 text-xs mt-0.5">{action.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Latest updates */}
              <div
                className="mt-5 rounded-xl p-4 border border-blue-500/10"
                style={{ background: 'rgba(17,30,75,0.6)' }}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 bg-blue-500/15 rounded-full flex items-center justify-center border border-blue-500/20">
                    <Info className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">Latest updates</p>
                    <p className="text-blue-300/40 text-xs">Stay up to date with the latest changes</p>
                  </div>
                </div>
                {announcements.length === 0 ? (
                  <p className="text-blue-300/30 text-sm">No updates yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {announcements.map((a) => (
                      <li key={a.id} className="border-l-2 border-blue-500/50 pl-3">
                        <p className="text-white text-sm font-medium">{a.title}</p>
                        {a.body && <p className="text-blue-300/40 text-xs mt-0.5 leading-relaxed">{a.body}</p>}
                        <p className="text-blue-400/30 text-xs mt-1">{new Date(a.createdAt).toLocaleString()}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Right col */}
            <div className="flex flex-col gap-4">
              {/* Account overview */}
              <div
                className="rounded-xl p-5 border border-blue-500/10"
                style={{ background: 'rgba(10,18,50,0.75)', backdropFilter: 'blur(10px)' }}
              >
                <h2 className="text-white font-semibold mb-4">Account overview</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Username', value: username },
                    { label: 'User ID', value: user ? user.id.slice(0, 12) + '...' : '—' },
                    { label: 'Member since', value: memberSince },
                    { label: 'Admin', value: profile?.isAdmin ? 'Yes' : 'No' },
                    { label: 'Rebrand access', value: profile?.rebrandAccess ? 'Yes' : 'No' },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-start justify-between gap-2 border-b border-blue-300/50 pb-2 last:border-0 last:pb-0"
                    >
                      <span className="text-blue-300/50 text-xs shrink-0">{label}</span>
                      <span
                        className={`text-xs font-medium text-right truncate max-w-[130px] ${
                          (label === 'Admin' || label === 'Rebrand access') && value === 'Yes'
                            ? 'text-blue-400'
                            : 'text-neutral-200'
                        }`}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rebrand tools shortcut */}
              {profile?.rebrandAccess && (
                <div
                  className="rounded-xl p-5 border border-blue-500/10"
                  style={{ background: 'rgba(10,18,50,0.75)', backdropFilter: 'blur(10px)' }}
                >
                  <h2 className="text-white font-semibold mb-3">Rebrand tools</h2>
                  <button
                    onClick={() => navigate('/rebrand')}
                    className="px-3 py-1.5 bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-medium rounded-lg hover:bg-blue-500/25 transition-all"
                  >
                    Rebrands Haven't Came Out Yet
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
