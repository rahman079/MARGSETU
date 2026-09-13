/**
 * MargSetu (मार्गसेतु) - Unified Citizen & Government Authentication Hub
 * Supports Citizen & Government Official Logins and Sign Ups with role switching,
 * fast simulated OTP login, official clearance registration, and 1-click instant demo profiles.
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth, NER_STATES, GOV_DEPARTMENTS } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Car, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  KeyRound, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Radio, 
  Building2, 
  MapPin, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Zap, 
  AlertCircle,
  Truck,
  Compass
} from 'lucide-react';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, signup, demoLogin, DEMO_PROFILES, user, enableGuestAccess } = useAuth();
  const { t } = useLanguage();

  // Parse query params (e.g. /login?role=govt&mode=signup&redirect=/govt)
  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get('role') === 'govt' ? 'govt' : 'citizen';
  const initialMode = location.pathname.includes('signup') || queryParams.get('mode') === 'signup' ? 'signup' : 'login';
  const redirectTarget = queryParams.get('redirect');

  const [role, setRole] = useState(initialRole); // 'citizen' | 'govt'
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [authMethod, setAuthMethod] = useState('password'); // 'password' | 'otp' (for citizen)
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP Simulation State
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('482910');

  // Form Fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up Form Fields
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    state: 'Assam',
    district: '',
    category: 'Daily Commuter',
    vehicleNumber: '',
    // Gov specific
    badgeId: '',
    department: 'Border Roads Organisation (BRO)',
    division: 'Project Vartak (NER Corridor)',
    designation: 'Executive Engineer / Dispatcher',
    clearanceLevel: 'Level 2 - Regional Dispatch'
  });

  // Sync with URL params if they change
  useEffect(() => {
    const pRole = queryParams.get('role');
    if (pRole === 'govt' || pRole === 'citizen') {
      setRole(pRole);
    }
    if (location.pathname.includes('signup') || queryParams.get('mode') === 'signup') {
      setMode('signup');
    } else if (location.pathname.includes('login') || queryParams.get('mode') === 'login') {
      setMode('login');
    }
  }, [location]);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setOtpSent(false);
    setOtpCode('');
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!loginIdentifier || loginIdentifier.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    const genOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOtp(genOtp);
    setOtpSent(true);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isOtp = role === 'citizen' && authMethod === 'otp';
    const res = await login({
      identifier: loginIdentifier,
      password: isOtp ? simulatedOtp : loginPassword,
      role: role,
      isOtp: isOtp
    });

    setIsSubmitting(false);
    if (res.success) {
      navigate(redirectTarget || (role === 'govt' ? '/govt' : '/citizen'));
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    const res = await signup(signupData, role);
    setIsSubmitting(false);

    if (res.success) {
      navigate(redirectTarget || (role === 'govt' ? '/govt' : '/citizen'));
    }
  };

  const handleQuickDemo = (profileKey) => {
    const target = DEMO_PROFILES[profileKey];
    demoLogin(target.role, profileKey);
    navigate(redirectTarget || (target.role === 'govt' ? '/govt' : '/citizen'));
  };

  const handleGuestBypass = () => {
    enableGuestAccess(role);
    navigate(redirectTarget || (role === 'govt' ? '/govt' : '/citizen'));
  };

  const isGov = role === 'govt';

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/70 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Background Decor Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-30 transition-colors duration-700 ${
          isGov ? 'bg-slate-700' : 'bg-emerald-400'
        }`} />
        <div className={`absolute top-1/2 -right-32 w-96 h-96 rounded-full blur-3xl opacity-30 transition-colors duration-700 ${
          isGov ? 'bg-indigo-700' : 'bg-teal-400'
        }`} />
      </div>

      <div className="max-w-xl w-full mx-auto">
        
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-glass-hover overflow-hidden"
        >

          {/* Top Role Selector Tabs */}
          <div className="p-2 sm:p-2.5 bg-slate-100/90 border-b border-slate-200/80 grid grid-cols-2 gap-2">
            
            {/* Citizen Tab */}
            <button
              type="button"
              onClick={() => handleRoleChange('citizen')}
              className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
                role === 'citizen'
                  ? 'bg-white text-emerald-700 shadow-md border border-emerald-200/70'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                role === 'citizen' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
              }`}>
                <Car className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="leading-tight">Citizen / Driver</div>
                <div className="text-[10px] font-medium text-slate-500 hidden sm:block">Public Highway Access</div>
              </div>
            </button>

            {/* Gov Official Tab */}
            <button
              type="button"
              onClick={() => handleRoleChange('govt')}
              className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
                role === 'govt'
                  ? 'bg-slate-900 text-white shadow-md border border-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                role === 'govt' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-200 text-slate-500'
              }`}>
                <Shield className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="leading-tight">Govt Official</div>
                <div className="text-[10px] font-medium text-slate-400 hidden sm:block">Command & Dispatch</div>
              </div>
            </button>

          </div>

          {/* Form Header */}
          <div className="p-6 sm:p-8 pb-4 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider mb-2 border ${
              isGov 
                ? 'bg-slate-900 text-emerald-400 border-slate-800' 
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }">
              {isGov ? <Shield className="w-3 h-3" /> : <Car className="w-3 h-3" />}
              <span>{isGov ? 'Government Authority Portal' : 'Public Highway Sentinel'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {mode === 'login' 
                ? (isGov ? 'Government Officer Sign In' : 'Citizen Traveler Sign In')
                : (isGov ? 'Register Official ID' : 'Create Citizen Account')
              }
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              {mode === 'login'
                ? (isGov ? 'Access real-time highway dispatch, slope sensors, and corridor alerts.' : 'View live road statuses, report incidents, and plan safe mountain journeys.')
                : (isGov ? 'Official registration for BRO, SDMA, SDRF, NHAI, and Police command.' : 'Join the NER real-time highway sentinel for personalized travel alerts.')
              }
            </p>

            {/* Mode Switch Pills (Sign In vs Sign Up) */}
            <div className="mt-5 p-1 bg-slate-100 rounded-xl inline-flex border border-slate-200/80">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account (Sign Up)
              </button>
            </div>
          </div>

          {/* Quick 1-Click Demo Logins Strip */}
          <div className="px-6 sm:px-8 py-3 bg-gradient-to-r from-slate-50 to-indigo-50/40 border-y border-slate-100">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant 1-Click Demo Profiles</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">For Evaluators</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {isGov ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('govt_bro')}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-left transition-all border border-slate-800 shadow-xs flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-bold text-xs group-hover:text-emerald-400 transition-colors">
                        Commandant S. K. Nair
                      </div>
                      <div className="text-[10px] text-slate-400">BRO Project Vartak &bull; #BRO-VARTAK-409</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-400 opacity-75 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('govt_sdrf')}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-left transition-all border border-slate-800 shadow-xs flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-bold text-xs group-hover:text-emerald-400 transition-colors">
                        Dr. T. R. Sangma
                      </div>
                      <div className="text-[10px] text-slate-400">Meghalaya SDRF &bull; #SDRF-ML-108</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-400 opacity-75 group-hover:translate-x-1 transition-transform" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('citizen_assam')}
                    className="p-2.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-900 text-left transition-all border border-emerald-200/80 shadow-xs flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-bold text-xs text-emerald-800">
                        Shayan (Assam)
                      </div>
                      <div className="text-[10px] text-slate-500">Guwahati &bull; Commuter</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-600 opacity-75 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('citizen_mizoram')}
                    className="p-2.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-900 text-left transition-all border border-emerald-200/80 shadow-xs flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-bold text-xs text-emerald-800">
                        Arham (Mizoram)
                      </div>
                      <div className="text-[10px] text-slate-500">Aizawl &bull; Freight Logistics</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-600 opacity-75 group-hover:translate-x-1 transition-transform" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">

            {/* LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                
                {/* Citizen Auth Method Tabs (Password vs Fast OTP) */}
                {!isGov && (
                  <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-600 pb-2 border-b border-slate-100">
                    <button
                      type="button"
                      onClick={() => { setAuthMethod('password'); setOtpSent(false); }}
                      className={`pb-1 border-b-2 transition-all ${
                        authMethod === 'password'
                          ? 'border-emerald-600 text-emerald-700'
                          : 'border-transparent text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      Login with Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMethod('otp')}
                      className={`pb-1 border-b-2 transition-all flex items-center gap-1 ${
                        authMethod === 'otp'
                          ? 'border-emerald-600 text-emerald-700'
                          : 'border-transparent text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Fast Mobile OTP</span>
                    </button>
                  </div>
                )}

                {/* Identifier Input */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                    {isGov ? 'Official Service Badge ID or Gov Email' : (authMethod === 'otp' ? '10-Digit Mobile Number' : 'Mobile Number or Email')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      {isGov ? <Shield className="w-4 h-4" /> : (authMethod === 'otp' ? <Phone className="w-4 h-4" /> : <Mail className="w-4 h-4" />)}
                    </div>
                    <input
                      type={authMethod === 'otp' ? 'tel' : 'text'}
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder={
                        isGov 
                          ? 'e.g. BRO-VARTAK-409 or sk.nair@bro.gov.in'
                          : (authMethod === 'otp' ? '+91 98640 12345' : 'shayan07@gmail.com')
                      }
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900"
                    />
                  </div>
                </div>

                {/* Citizen OTP Flow */}
                {!isGov && authMethod === 'otp' && (
                  <div className="space-y-3 pt-1">
                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Send 6-Digit Verification OTP</span>
                      </button>
                    ) : (
                      <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-900 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>OTP Sent to {loginIdentifier}</span>
                          </span>
                          <span className="text-[11px] font-mono font-black text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
                            Code: {simulatedOtp}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            placeholder="Enter 6-digit OTP"
                            className="flex-1 px-3 py-2 bg-white border border-emerald-300 rounded-lg text-sm text-center font-mono font-bold tracking-widest text-slate-900"
                          />
                          <button
                            type="button"
                            onClick={() => setOtpCode(simulatedOtp)}
                            className="px-3 py-2 bg-emerald-700 text-white text-xs font-bold rounded-lg hover:bg-emerald-800"
                          >
                            Auto Fill
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Password Input (if not in OTP mode) */}
                {(isGov || authMethod === 'password') && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                        {isGov ? 'Officer Security Key / Passcode' : 'Password'}
                      </label>
                      <button
                        type="button"
                        onClick={() => alert('For instant evaluator testing, use the 1-Click Demo profiles above or enter any 4+ char password.')}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        Forgot Passcode?
                      </button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                    isGov
                      ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                  }`}
                >
                  {isSubmitting ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>{isGov ? 'Access Command Center' : 'Launch Citizen Sentinel'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>
            )}

            {/* SIGN UP FORM */}
            {mode === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                    {isGov ? 'Officer Full Name & Title' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      placeholder={isGov ? 'e.g. Commandant S. K. Nair' : 'e.g. Shayan'}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Contact: Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                      {isGov ? 'Gov Email (.gov.in)' : 'Email Address'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="email"
                        required
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        placeholder={isGov ? 'officer@bro.gov.in' : 'name@email.com'}
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                      Mobile / Duty Phone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={signupData.phone}
                        onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                        placeholder="+91 98640 12345"
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Gov Specific Fields */}
                {isGov ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                          Service / Badge ID
                        </label>
                        <input
                          type="text"
                          required
                          value={signupData.badgeId}
                          onChange={(e) => setSignupData({ ...signupData, badgeId: e.target.value })}
                          placeholder="e.g. BRO-VARTAK-409"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                          Designation / Rank
                        </label>
                        <input
                          type="text"
                          required
                          value={signupData.designation}
                          onChange={(e) => setSignupData({ ...signupData, designation: e.target.value })}
                          placeholder="e.g. Senior Highway Engineer"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                        Department / Agency
                      </label>
                      <select
                        value={signupData.department}
                        onChange={(e) => setSignupData({ ...signupData, department: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {GOV_DEPARTMENTS.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                          NER Jurisdiction State
                        </label>
                        <select
                          value={signupData.state}
                          onChange={(e) => setSignupData({ ...signupData, state: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {NER_STATES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                          Clearance Level
                        </label>
                        <select
                          value={signupData.clearanceLevel}
                          onChange={(e) => setSignupData({ ...signupData, clearanceLevel: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="Level 1 - Field Observer">Level 1 - Field Observer</option>
                          <option value="Level 2 - Regional Dispatch">Level 2 - Regional Dispatch</option>
                          <option value="Level 3 - Highway Command">Level 3 - Highway Command</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Citizen Specific Fields */
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                          Home State in NER
                        </label>
                        <select
                          value={signupData.state}
                          onChange={(e) => setSignupData({ ...signupData, state: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {NER_STATES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                          District / City
                        </label>
                        <input
                          type="text"
                          required
                          value={signupData.district}
                          onChange={(e) => setSignupData({ ...signupData, district: e.target.value })}
                          placeholder="e.g. Guwahati / Silchar / Shillong"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                          Primary Travel Category
                        </label>
                        <select
                          value={signupData.category}
                          onChange={(e) => setSignupData({ ...signupData, category: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="Daily Commuter">Daily Commuter</option>
                          <option value="Freight & Commercial Logistics">Freight & Commercial Logistics</option>
                          <option value="Mountain Tourist / Passenger">Mountain Tourist / Passenger</option>
                          <option value="Emergency Driver / Ambulance">Emergency Driver / Ambulance</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                          Vehicle Reg. (Optional)
                        </label>
                        <input
                          type="text"
                          value={signupData.vehicleNumber}
                          onChange={(e) => setSignupData({ ...signupData, vehicleNumber: e.target.value })}
                          placeholder="e.g. AS-01-EA-4492"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                      {isGov ? 'Create Officer Key' : 'Create Password'}
                    </label>
                    <input
                      type="password"
                      required
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Submit Sign Up Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4 ${
                    isGov
                      ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                  }`}
                >
                  {isSubmitting ? (
                    <span>Registering Profile...</span>
                  ) : (
                    <>
                      <span>{isGov ? 'Register Official Authority' : 'Create Verified Citizen Profile'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>
            )}

            {/* Bottom Guest Mode Skip */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={handleGuestBypass}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1"
              >
                <span>Continue browsing as Guest</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

          </div>

        </motion.div>

      </div>
    </div>
  );
}
