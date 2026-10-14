import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, LogOut, LayoutDashboard, Menu, X, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/95 border-b border-slate-200 sticky top-0 z-40 no-print backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand: QuickVitae */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl brand-btn flex items-center justify-center text-white shadow-brand">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex items-baseline">
                <span className="text-lg font-black text-slate-900 tracking-tight">
                  Quick<span className="brand-text">Vitae</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <div className="h-5 w-px bg-slate-200 mx-1"></div>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-xs text-slate-700 bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200 px-3 py-1.5 rounded-full transition"
                  title="Buka Profil & Pengaturan Akun"
                >
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-semibold text-slate-800">{user?.name || 'User'}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-lg transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-600 hover:text-blue-600 px-4 py-2 transition"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold text-white brand-btn px-4 py-2 rounded-xl transition"
                >
                  Daftar Sekarang
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="py-2 text-xs font-semibold text-slate-500 border-b border-slate-100">
                Masuk sebagai: <span className="text-slate-800 font-bold">{user?.name}</span>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-xs font-semibold text-slate-700"
              >
                <LayoutDashboard className="w-4 h-4 text-blue-600" />
                <span>Dashboard CV</span>
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-xs font-semibold text-slate-700"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span>Profil & Akun</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2 py-2 text-xs font-semibold text-rose-600"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Akun</span>
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-xs font-semibold text-white brand-btn rounded-xl"
              >
                Daftar Akun Baru
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
