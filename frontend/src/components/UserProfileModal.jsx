/**
 * MargSetu (मार्गसेतु) - User Profile & Identity Modal
 * Displays active credentials, government badge clearances, citizen travel profile,
 * and quick-switch account / role options.
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Car, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  LogOut, 
  CheckCircle2, 
  ExternalLink, 
  X,
  Radio,
  Building2,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function UserProfileModal({ isOpen, onClose }) {
  const { user, isGovAuthenticated, logout, demoLogin, DEMO_PROFILES } = useAuth();
  const navigate = useNavigate();

  if (!isOpen || !user) return null;

  const isGov = user.role === 'govt';

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleSwitchPortal = (targetPath) => {
    onClose();
    navigate(targetPath);
  };

  const handleSwitchDemoAccount = (profileKey) => {
    const target = DEMO_PROFILES[profileKey];
    demoLogin(target.role, profileKey);
    onClose();
    if (target.role === 'govt') {
      navigate('/govt');
    } else {
      navigate('/citizen');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        
        {/* Backdrop click to close */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0" 
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative z-10 w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden font-sans"
        >
          
          {/* Header Banner */}
          <div className={`p-6 text-white relative overflow-hidden ${
            isGov 
              ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950' 
              : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700'
          }`}>
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
            
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white/80 shadow-md"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/80 flex items-center justify-center text-white shadow-md">
                      <User className="w-7 h-7" />
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-slate-900 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-slate-950" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                      isGov ? 'bg-emerald-400 text-slate-950' : 'bg-white/25 text-white'
                    }`}>
                      {isGov ? <Shield className="w-3 h-3" /> : <Car className="w-3 h-3" />}
                      {isGov ? 'Official Authority' : 'Verified Citizen'}
                    </span>
                    {user.badgeId && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-[10px] font-mono font-bold">
                        {user.badgeId}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-white mt-1 leading-tight tracking-tight">
                    {user.name}
                  </h3>
                  <p className="text-xs text-white/80 mt-0.5">
                    {isGov ? (user.designation || user.department) : (user.category || 'Citizen Traveler')}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                aria-label="Close Profile"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Profile Details Body */}
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            
            {/* Gov Official Detailed Clearance Info */}
            {isGov ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-500 pb-1 border-b border-slate-200/60">
                    <span className="font-bold uppercase tracking-wider text-[10px]">Agency / Ministry</span>
                    <span className="font-bold text-slate-900">{user.department}</span>
                  </div>
                  {user.division && (
                    <div className="flex items-center justify-between text-slate-500 pb-1 border-b border-slate-200/60">
                      <span className="font-bold uppercase tracking-wider text-[10px]">Division Command</span>
                      <span className="font-medium text-slate-800">{user.division}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-slate-500 pb-1 border-b border-slate-200/60">
                    <span className="font-bold uppercase tracking-wider text-[10px]">Jurisdiction</span>
                    <span className="font-bold text-indigo-700">{user.jurisdiction || user.state}</span>
                  </div>
                  {user.clearanceLevel && (
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="font-bold uppercase tracking-wider text-[10px]">Clearance Level</span>
                      <span className="font-extrabold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                        {user.clearanceLevel}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div className="truncate">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Official Email</div>
                      <div className="text-slate-800 font-medium truncate">{user.email}</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Duty Phone</div>
                      <div className="text-slate-800 font-medium">{user.phone}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Citizen Detailed Info */
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-500 pb-1 border-b border-slate-200/60">
                    <span className="font-bold uppercase tracking-wider text-[10px]">Resident State</span>
                    <span className="font-bold text-slate-900">{user.state} ({user.city})</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 pb-1 border-b border-slate-200/60">
                    <span className="font-bold uppercase tracking-wider text-[10px]">Travel Profile</span>
                    <span className="font-bold text-emerald-700">{user.category || 'Daily Commuter'}</span>
                  </div>
                  {user.vehicleNumber && (
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="font-bold uppercase tracking-wider text-[10px]">Registered Vehicle</span>
                      <span className="font-mono font-bold text-slate-800 bg-slate-200/70 px-2 py-0.5 rounded">
                        {user.vehicleNumber}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div className="truncate">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Email Address</div>
                      <div className="text-slate-800 font-medium truncate">{user.email}</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Mobile Number</div>
                      <div className="text-slate-800 font-medium">{user.phone}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Demo Switcher Strip for Reviewers */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Switch Demo Profile</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Instant Test</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSwitchDemoAccount('govt_bro')}
                  className={`p-2 rounded-xl text-left border transition-all text-[11px] ${
                    user.badgeId === 'BRO-VARTAK-409'
                      ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="font-bold truncate">Off. S. K. Nair</div>
                  <div className="text-[9px] opacity-75 truncate">BRO Vartak</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitchDemoAccount('govt_sdrf')}
                  className={`p-2 rounded-xl text-left border transition-all text-[11px] ${
                    user.badgeId === 'SDRF-ML-108'
                      ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="font-bold truncate">Dr. Sangma</div>
                  <div className="text-[9px] opacity-75 truncate">Meghalaya SDRF</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitchDemoAccount('citizen_assam')}
                  className={`p-2 rounded-xl text-left border transition-all text-[11px] ${
                    user.email === 'priyan.sharma@gmail.com'
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="font-bold truncate">Priyan S.</div>
                  <div className="text-[9px] opacity-75 truncate">Assam Citizen</div>
                </button>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 border border-transparent hover:border-rose-200 transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSwitchPortal('/citizen')}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-xs transition-all flex items-center gap-1.5"
              >
                <Car className="w-3.5 h-3.5 text-indigo-600" />
                <span>Citizen Map</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchPortal('/govt')}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gov Command</span>
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
