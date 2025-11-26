




import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Page } from '../types';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import { useAppContext } from '../context/AppContext';

interface SignupPageProps {
  onNavigate: (page: Page) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  const { signup } = useAppContext();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setIsLoading(true);
    try {
        await signup(email, password, name);
        // Navigation is typically handled by the auth state change in App.tsx, 
        // but we can explicitly redirect if needed for smoother UX in mock mode
        // onNavigate('shop'); 
    } catch (error) {
        console.error('Signup failed on page:', error);
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
          <h1 className="text-3xl font-bold text-accent-primary">Create an Account</h1>
          <p className="text-text-secondary mt-2">Join us and start collecting your favorites.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-text-primary">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-lg border-zinc-300 dark:border-zinc-600 bg-bg-tertiary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/80 focus:border-accent-primary/80 transition"
              placeholder="Your Name"
            />
          </div>

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
            <label htmlFor="password" className="text-sm font-medium text-text-primary">
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
              className="mt-1 block w-full px-4 py-3 rounded-lg border-zinc-300 dark:border-zinc-600 bg-bg-tertiary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/80 focus:border-accent-primary/80 transition"
              placeholder="Create a password"
            />
            <AnimatePresence>
                {password && <PasswordStrengthMeter password={password} />}
            </AnimatePresence>
          </div>

           <div>
            <label htmlFor="confirm-password" className="text-sm font-medium text-text-primary">
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
              className="mt-1 block w-full px-4 py-3 rounded-lg border-zinc-300 dark:border-zinc-600 bg-bg-tertiary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/80 focus:border-accent-primary/80 transition"
              placeholder="Confirm your password"
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
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <button onClick={() => onNavigate('login')} className="font-medium text-accent-primary hover:opacity-80">
            Log in
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SignupPage;
