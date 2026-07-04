import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Shield, Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotifications } from '../context/NotificationContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: 'admin@threatintel.soc',
      password: '••••••••',
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    // Simulate auth verification
    setTimeout(() => {
      setLoading(false);
      addNotification('Authentication Successful. Access granted.', 'success', 3000);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-soc-bg text-soc-text flex items-center justify-center p-4 overflow-hidden">
      {/* Background Cyber Illustration and Glowing Grids */}
      <div className="absolute inset-0 z-0">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        
        {/* Glowing cyber blobs */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-soc-primary/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        {/* Main Glassmorphic Wrapper */}
        <div className="glass-panel rounded-3xl p-8 shadow-2xl shadow-black/40 border border-slate-700/50">
          {/* Header Logo and Brand */}
          <div className="flex flex-col items-center text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-14 h-14 bg-soc-primary/10 border border-soc-primary/30 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-soc-primary/10"
            >
              <Shield className="w-8 h-8 text-soc-primary fill-soc-primary/5" />
            </motion.div>
            <h1 className="text-2xl font-bold tracking-tight">Cyber Threat Intelligence</h1>
            <p className="text-xs text-soc-secondary mt-1 max-w-[280px]">
              AI-Powered Security Intelligence for Faster Threat Detection and Response
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-soc-secondary tracking-wide uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-soc-secondary" />
                <input
                  type="email"
                  placeholder="admin@threatintel.soc"
                  {...register('email', { 
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`w-full bg-slate-900/80 border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-soc-primary focus:ring-1 focus:ring-soc-primary transition-all placeholder:text-slate-600 ${
                    errors.email ? 'border-soc-danger/60' : 'border-slate-800'
                  }`}
                />
              </div>
              {errors.email && (
                <span className="text-[11px] text-soc-danger font-medium mt-0.5 block">{errors.email.message}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-soc-secondary tracking-wide uppercase">Password</label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    addNotification('Password reset links are disabled in demo mode.', 'info');
                  }}
                  className="text-xs text-soc-primary hover:text-blue-400 font-medium transition-colors"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-soc-secondary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                  className={`w-full bg-slate-900/80 border rounded-xl py-3 pl-11 pr-11 text-sm focus:outline-none focus:border-soc-primary focus:ring-1 focus:ring-soc-primary transition-all placeholder:text-slate-600 ${
                    errors.password ? 'border-soc-danger/60' : 'border-slate-800'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-soc-secondary hover:text-white p-0.5 rounded-lg hover:bg-white/5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-[11px] text-soc-danger font-medium mt-0.5 block">{errors.password.message}</span>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-soc-primary focus:ring-soc-primary focus:ring-offset-0 transition-colors"
              />
              <label htmlFor="remember_me" className="ml-2 text-xs text-soc-secondary font-medium select-none cursor-pointer">
                Remember this workstation
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-soc-primary hover:bg-blue-600 active:bg-blue-700 text-white rounded-xl py-3 text-sm font-semibold tracking-wide shadow-lg shadow-soc-primary/20 hover:shadow-soc-primary/30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying Secure Token...
                </>
              ) : (
                'Sign In to SOC Core'
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-[10px] text-soc-secondary tracking-widest uppercase">
          SECURE LOG INTERFACE // CLASSIFICATION ENGINE v1.4
        </div>
      </motion.div>
    </div>
  );
}
