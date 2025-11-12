

import * as React from 'react';
import { motion } from 'framer-motion';
import { Page } from '../types';
import { useAppContext } from '../context/AppContext';

interface ForgotPasswordPageProps {
  onNavigate: (page: Page) => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const { sendResetLink } = useAppContext();
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsLoading(true);
    try {
      await sendResetLink(email);
      onNavigate('login');
    } catch (error) {
      console.error('Send reset link failed on page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-bg-primary pt-20"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-bg-secondary p-8 sm:p-12 rounded-2xl shadow-lg w-full max-w-md"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-accent-primary">Forgot Your Password?</h1>
          <p className="text-text-secondary mt-2">No worries! Enter your email below and we'll send you a link to reset it.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-text-primary">
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
              className="mt-1 block w-full px-4 py-3 rounded-lg border-zinc-300 dark:border-zinc-600 bg-bg-tertiary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/80 focus:border-accent-primary/80 transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-medium text-accent-text bg-accent-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-text-secondary">
          Remembered your password?{' '}
          <button onClick={() => onNavigate('login')} className="font-medium text-accent-primary hover:opacity-80">
            Back to Login
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPasswordPage;