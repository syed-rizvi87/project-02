import React, { useState } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { INITIAL_USER } from '../data/mockData';
import { Lock, Mail, User, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { loginUser, navigateTo, showToast } = useEcommerce();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');

  // Form states
  const [email, setEmail] = useState('eleanor.vance@atelier-arch.com');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(INITIAL_USER);
    navigateTo('account');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({
      ...INITIAL_USER,
      name: fullName || 'New Patron',
      email: email,
      totalOrders: 0,
      rewardPoints: 100,
      tier: 'Club Silver'
    });
    showToast('Welcome to AURA Atelier. 100 welcome reward points added.', 'success');
    navigateTo('account');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(`A secure verification code has been dispatched to ${email}.`);
    setMode('reset');
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Your security credentials have been updated.', 'success');
    setMode('login');
  };

  const handleQuickDemoClient = () => {
    loginUser(INITIAL_USER);
    navigateTo('account');
  };

  const handleQuickDemoAdmin = () => {
    loginUser(INITIAL_USER);
    navigateTo('admin');
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16">
      <div className="bg-white hairline-border rounded-2xl p-8 sm:p-10 shadow-sm space-y-6">
        
        {/* Top Wordmark & Tab Header */}
        <div className="text-center space-y-1">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#9B6B43]">
            Client Portal
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#1A1A1A]">
            {mode === 'login' && 'Sign In to Your Atelier'}
            {mode === 'register' && 'Apply for Client Privilege'}
            {mode === 'forgot' && 'Account Recovery'}
            {mode === 'reset' && 'Create New Credentials'}
          </h1>
          <p className="text-xs text-[#7A746B]">
            {mode === 'login' && 'Access curated allocations, order tracking, and private benefits.'}
            {mode === 'register' && 'Join an exclusive community of design and tailoring patrons.'}
            {mode === 'forgot' && 'Enter your registered email to receive access instructions.'}
            {mode === 'reset' && 'Set a modern secure password for your account.'}
          </p>
        </div>

        {/* 1-Click Fast Demo Switchers */}
        <div className="p-3 bg-[#FAF9F6] border border-black/5 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#7A746B]">
            <span>Fast Evaluation Access:</span>
            <span className="text-emerald-700 font-semibold">Ready</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleQuickDemoClient}
              className="px-2 py-1.5 bg-[#1C1C1E] text-white rounded text-[11px] font-semibold tracking-wider uppercase hover:bg-black transition-colors"
            >
              Sign In Client
            </button>
            <button
              onClick={handleQuickDemoAdmin}
              className="px-2 py-1.5 bg-[#9B6B43] text-white rounded text-[11px] font-semibold tracking-wider uppercase hover:bg-[#835630] transition-colors"
            >
              Staff Admin
            </button>
          </div>
        </div>

        {/* 1. Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#4A453E] font-medium mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A857D] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[#4A453E] font-medium">Password</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-[#9B6B43] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8A857D] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input type="checkbox" id="remember" defaultChecked className="rounded accent-[#1C1C1E]" />
              <label htmlFor="remember" className="text-[#7A746B] text-[11px] cursor-pointer">
                Keep my session active on this workstation
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1C1C1E] text-white rounded font-semibold text-xs tracking-wider uppercase hover:bg-black transition-colors flex items-center justify-center gap-2"
            >
              <span>Sign In to Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="pt-2 text-center text-xs text-[#7A746B]">
              <span>New to the Atelier? </span>
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-semibold text-[#1A1A1A] hover:underline"
              >
                Register an account
              </button>
            </div>
          </form>
        )}

        {/* 2. Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#4A453E] font-medium mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8A857D] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Julian Mercer"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#4A453E] font-medium mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A857D] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#4A453E] font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8A857D] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1 text-[11px] text-[#7A746B]">
              <input type="checkbox" required className="mt-0.5 rounded accent-[#1C1C1E]" />
              <span>I agree to receive private releases and accept the terms of patronage.</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1C1C1E] text-white rounded font-semibold text-xs tracking-wider uppercase hover:bg-black transition-colors"
            >
              Create Account
            </button>

            <div className="pt-2 text-center text-xs text-[#7A746B]">
              <span>Already registered? </span>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-semibold text-[#1A1A1A] hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* 3. Forgot Password */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#4A453E] font-medium mb-1">Registered Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1C1C1E] text-white rounded font-semibold text-xs tracking-wider uppercase hover:bg-black transition-colors"
            >
              Send Recovery Code
            </button>

            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full py-2 text-center text-xs text-[#7A746B] hover:text-[#1A1A1A]"
            >
              Return to Sign In
            </button>
          </form>
        )}

        {/* 4. Reset Password */}
        {mode === 'reset' && (
          <form onSubmit={handleResetSubmit} className="space-y-4 text-xs">
            {statusMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800">
                {statusMessage}
              </div>
            )}

            <div>
              <label className="block text-[#4A453E] font-medium mb-1">Verification Code (Sent to Email)</label>
              <input
                type="text"
                required
                placeholder="e.g. AUR-7849"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                className="w-full px-3 py-2.5 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A] font-mono"
              />
            </div>

            <div>
              <label className="block text-[#4A453E] font-medium mb-1">New Password</label>
              <input
                type="password"
                required
                placeholder="New secure passphrase"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2.5 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1C1C1E] text-white rounded font-semibold text-xs tracking-wider uppercase hover:bg-black transition-colors"
            >
              Update Credentials
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
