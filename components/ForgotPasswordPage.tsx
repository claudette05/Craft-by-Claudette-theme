import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Page } from '../types';

interface ForgotPasswordPageProps {
  onSendResetLink: (email: string) => void;
  onNavigate: (page: Page) => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onSendResetLink, onNavigate }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onSendResetLink(email);
    }
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
          <h1 className="text-3xl font-bold text-amber-600">Forgot Your Password?</h1>
          <p className="text-zinc-500 mt-2">No worries! Enter your email below and we'll send you a link to reset it.</p>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-lg border-zinc-300 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
            >
              Send Reset Link
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-600">
          Remembered your password?{' '}
          <button onClick={() => onNavigate('login')} className="font-medium text-amber-600 hover:text-amber-500">
            Back to Login
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPasswordPage;