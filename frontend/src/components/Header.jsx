/**
 * MargSetu (मार्गसेतु) - Header Navigation & Real-Time Network Sentinel (Phase 1, 2, 3, 4, & Auth)
 * Fully responsive across Mobile, Tablet, Laptop, and Desktop.
 * Features animated Network Status Indicator (Live / Offline Sentinel Mode),
 * offline simulation toggle for evaluators, portal navigation, and User Profile / Auth Hub.
 */

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRoads } from '../context/RoadContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import UserProfileModal from './UserProfileModal';
import { 
  Shield, 
  Car, 
  Navigation, 
  Radio, 
  Wifi, 
  WifiOff, 
  Zap, 
  Layers,
  Menu,
  X,
  User,
  LogIn,
  LogOut,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const { isOnline, isSimulatedOffline, toggleOfflineSimulation, offlineQueue } = useRoads();
  const { t } = useLanguage();
  const { user, isAuthenticated, isGovAuthenticated, logout } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);

  const citizenNavTarget = user?.role === 'citizen' ? '/citizen' : '/login?role=citizen&redirect=/citizen';
  const govtNavTarget = user?.role === 'govt' ? '/govt' : '/login?role=govt&redirect=/govt';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/90 transition-all font-sans">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md border border-slate-200/80 transition-transform group-hover:scale-105">
            <img 
              src="/logo.svg" 
              alt="MargSetu Logo" 
              className="w-full h-full object-contain" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/favicon.svg';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-extrabold text-sm sm:text-base md:text-lg tracking-tight text-slate-900">
                MargSetu
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1 sm:px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60 hidden xs:inline">
                v4.0
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-500 hidden md:block">
              North Eastern Regional Highway Sentinel
            </p>
          </div>
        </Link>

        {/* Feature A: Network Status Indicator & Offline Simulator (Desktop / Tablet) */}
        <div className="hidden sm:flex items-center gap-2">
          
          {/* Animated Network Indicator */}
          <div className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
            isOnline
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80 shadow-xs'
              : 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs animate-pulse'
          }`}>
            <span className="relative flex h-2 w-2">
              {isOnline ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </>
              ) : (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
                </>
              )}
            </span>

            {isOnline ? (
              <div className="flex items-center gap-1">
                <Wifi className="w-3 h-3 text-emerald-600 hidden md:inline" />
                <span className="hidden md:inline">{t('liveConnected', 'Live Connected')}</span>
                <span className="md:hidden">Online</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <WifiOff className="w-3 h-3 text-amber-600 hidden md:inline" />
                <span>{t('offlineMode', 'Offline Mode')}</span>
              </div>
            )}

            {offlineQueue.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-600 text-white text-[9px] font-black" title="Pending Offline Reports">
                {offlineQueue.length}
              </span>
            )}
          </div>

          {/* Quick Evaluator Toggle for Offline Simulation */}
          <button
            onClick={toggleOfflineSimulation}
            id="network-simulator-btn"
            title="Simulate Remote Mountain Dead Zone (Zero Internet)"
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1 shadow-xs ${
              isSimulatedOffline
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span className="hidden lg:inline">
              {isSimulatedOffline ? t('restoreNetwork', 'Restore Network') : t('simulateOffline', 'Simulate Offline')}
            </span>
            <span className="lg:hidden">
              {isSimulatedOffline ? 'Online' : 'Offline'}
            </span>
          </button>

        </div>

        {/* Right Nav: Portals + Auth + Language Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          
          {/* Desktop/Tablet Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 sm:gap-2">
            <Link
              to={citizenNavTarget}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                path === '/citizen'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Citizen</span>
            </Link>

            <Link
              to={govtNavTarget}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                path === '/govt'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Govt</span>
            </Link>
          </nav>

          {/* Quick Citizen / Govt icon pills on smaller screens */}
          <div className="flex md:hidden items-center gap-1">
            <Link
              to={citizenNavTarget}
              title="Citizen Map"
              className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                path === '/citizen'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Car className="w-4 h-4" />
            </Link>

            <Link
              to={govtNavTarget}
              title="Govt Control Room"
              className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                path === '/govt'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Shield className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>

          {/* User Profile Pill / Auth Hub */}
          {isAuthenticated && user ? (
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${
                isGovAuthenticated
                  ? 'bg-slate-900 text-white border-slate-800 hover:bg-slate-800'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
              }`}
              title="View Profile & Credentials"
            >
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-5 h-5 rounded-full object-cover border border-white/40" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%2310b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
                  }}
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  {isGovAuthenticated ? <Shield className="w-3 h-3 text-emerald-400" /> : <User className="w-3 h-3 text-emerald-700" />}
                </div>
              )}
              <span className="hidden sm:inline max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase ${
                isGovAuthenticated ? 'bg-emerald-400/20 text-emerald-400' : 'bg-emerald-200/80 text-emerald-800'
              }`}>
                {isGovAuthenticated ? 'Gov' : 'Cit'}
              </span>
            </button>
          ) : (
            <div className="relative">
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/login"
                className="sm:hidden p-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center"
                title="Sign In / Register"
              >
                <LogIn className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Regional Language Switcher Dropdown */}
          <LanguageSwitcher variant="header" align="right" />

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            aria-label="Toggle Mobile Controls"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer / Quick Controls */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white/95 px-4 py-3 space-y-2.5 animate-fade-in shadow-lg">
          <div className="flex items-center justify-between gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              isOnline
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{isOnline ? 'Network: Online' : 'Network: Offline / SMS'}</span>
            </div>

            <button
              onClick={() => {
                toggleOfflineSimulation();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 border border-slate-300 text-slate-700 flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-amber-500" />
              <span>{isSimulatedOffline ? 'Restore Online' : 'Test Offline'}</span>
            </button>
          </div>

          {/* Mobile Auth Status Strip */}
          {isAuthenticated && user ? (
            <div className="p-2.5 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${
                  isGovAuthenticated ? 'bg-slate-900' : 'bg-emerald-600'
                }`}>
                  {isGovAuthenticated ? <Shield className="w-4 h-4 text-emerald-400" /> : <User className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 leading-tight">{user.name}</div>
                  <div className="text-[10px] text-slate-500">
                    {isGovAuthenticated ? `Official (${user.badgeId || 'Gov'})` : `${user.state || 'Citizen'}`}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsProfileModalOpen(true);
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Profile
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                to="/login?role=citizen"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"
              >
                <Car className="w-3.5 h-3.5" />
                <span>Citizen Login</span>
              </Link>
              <Link
                to="/login?role=govt"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gov Sign In</span>
              </Link>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              to={citizenNavTarget}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold ${
                path === '/citizen' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Citizen Portal</span>
            </Link>

            <Link
              to={govtNavTarget}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold ${
                path === '/govt' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800'
              }`}
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Govt Dispatch</span>
            </Link>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      <UserProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />

    </header>
  );
}
