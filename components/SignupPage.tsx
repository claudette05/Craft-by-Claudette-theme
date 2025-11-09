import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Page } from '../types';
import PasswordStrengthMeter from './PasswordStrengthMeter';

interface SignupPageProps {
  onSignup: (email: string, password: string) => void;
  onNavigate: (page: Page) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    onSignup(email, password);
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
          <h1 className="text-3xl font-bold text-amber-600">Create an Account</h1>
          <p className="text-zinc-500 mt-2">Join us and start collecting your favorites.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-zinc-700">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="mt-1 block w-full px-4 py-3 rounded-lg border-zinc-300 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
              placeholder="Your Name"
            />
          </div>

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
            <label htmlFor="password" className="text-sm font-medium text-zinc-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-lg border-zinc-300 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
              placeholder="Create a password"
            />
            <AnimatePresence>
                {password && <PasswordStrengthMeter password={password} />}
            </AnimatePresence>
          </div>

           <div>
            <label htmlFor="confirm-password" className="text-sm font-medium text-zinc-700">
              Confirm Password
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
              placeholder="Confirm your password"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
            >
              Create Account
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-600">
          Already have an account?{' '}
          <button onClick={() => onNavigate('login')} className="font-medium text-amber-600 hover:text-amber-500">
            Log in
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SignupPage;