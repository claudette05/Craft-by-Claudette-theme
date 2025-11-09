import React from 'react';
import { motion } from 'framer-motion';
import { Page } from '../types';

interface LoginPageProps {
  onLogin: () => void;
  onNavigate: (page: Page) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle form data and API calls here
    onLogin();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-pink-50 pt-20"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white p-8 sm:p-12 rounded-2xl shadow-lg w-full max-w-md"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-amber-600">Welcome Back!</h1>
          <p className="text-zinc-500 mt-2">Log in to continue your shopping.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-zinc-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-4 py-3 rounded-lg border-zinc-300 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password"className="text-sm font-medium text-zinc-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full px-4 py-3 rounded-lg border-zinc-300 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
              placeholder="Your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <button type="button" onClick={() => onNavigate('forgotPassword')} className="text-sm font-medium text-amber-600 hover:text-amber-500">
              Forgot your password?
            </button>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
            >
              Log in
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-600">
          Don't have an account?{' '}
          <button onClick={() => onNavigate('signup')} className="font-medium text-amber-600 hover:text-amber-500">
            Sign up
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;