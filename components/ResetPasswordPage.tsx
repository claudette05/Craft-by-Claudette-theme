import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Page } from '../types';
import PasswordStrengthMeter from './PasswordStrengthMeter';

interface ResetPasswordPageProps {
  onResetPassword: () => void;
  onNavigate: (page: Page) => void;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onResetPassword, onNavigate }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    // Add logic to check password strength before submitting in a real app
    onResetPassword();
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
          <h1 className="text-3xl font-bold text-amber-600">Reset Your Password</h1>
          <p className="text-zinc-500 mt-2">Create a new, strong password for your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="new-password"className="text-sm font-medium text-zinc-700">
              New Password
            </label>
            <input
              id="new-password"
              name="new-password"
              type="password"
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-lg border-zinc-300 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
              placeholder="Enter your new password"
            />
            <AnimatePresence>
              {newPassword && <PasswordStrengthMeter password={newPassword} />}
            </AnimatePresence>
          </div>

          <div>
            <label htmlFor="confirm-password"className="text-sm font-medium text-zinc-700">
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-lg border-zinc-300 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
              placeholder="Confirm your new password"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
            >
              Set New Password
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

export default ResetPasswordPage;
