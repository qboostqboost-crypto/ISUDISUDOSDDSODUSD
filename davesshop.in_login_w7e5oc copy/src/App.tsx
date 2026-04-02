import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { AdminPanel } from './pages/AdminPanel';
import { RedeemPage } from './pages/RedeemPage';
import { DownloadsPage } from './pages/DownloadsPage';
import { RebrandPage } from './pages/RebrandPage';
import { SupportPage } from './pages/SupportPage';
import { GetLicensePage } from './pages/GetLicensePage';
import { Profile } from './pages/Profile';

const Guard: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly = false }) => {
  const { user, isPending } = useAuth();

  if (isPending) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0c] items-center justify-center">
        <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, isPending } = useAuth();

  if (isPending) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0c] items-center justify-center">
        <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
      <Route path="/dashboard" element={<Guard><Dashboard /></Guard>} />
      <Route path="/redeem" element={<Guard><RedeemPage /></Guard>} />
      <Route path="/downloads" element={<Guard><DownloadsPage /></Guard>} />
      <Route path="/rebrand" element={<Guard><RebrandPage /></Guard>} />
      <Route path="/support" element={<Guard><SupportPage /></Guard>} />
  <Route path="/profile" element={<Guard><Profile /></Guard>} />
      <Route path="/license" element={<Guard><GetLicensePage /></Guard>} />
      <Route path="/admin" element={<Guard adminOnly><AdminPanel /></Guard>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export const App = () => (
  <BrowserRouter>
    <div className="font-inter">
      <AppRoutes />
    </div>
  </BrowserRouter>
);
