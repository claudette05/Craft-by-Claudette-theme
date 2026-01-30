
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Page } from '../types';
import { useAppContext } from '../context/AppContext';

const LockClosedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);


interface LoginPageProps {
  onNavigate: (page: Page) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAppContext();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      // On successful login, App's effect will redirect to the admin page
    } catch (error) {
      console.error('Login failed on page:', error);
      // You could show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-bg-tertiary p-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-bg-primary dark:bg-zinc-800 p-8 rounded-2xl shadow-lg w-full max-w-md text-center"
      >
        <AnimatePresence mode="wait">
            {!showLogin ? (
                <motion.div
                    key="restricted-access"
                    exit={{ opacity: 0, scale: 0.9 }}
                >
                    <div className="flex justify-center mb-4">
                        <LockClosedIcon />
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary">Restricted Access</h1>
                    <p className="text-text-secondary mt-2 mb-6">This area is for authorized administrators only.</p>
                    <button
                        onClick={() => setShowLogin(true)}
                        className="font-medium text-sm text-accent-primary hover:opacity-80 transition-opacity"
                    >
                        Admin Login
                    </button>
                </motion.div>
            ) : (
                <motion.div
                    key="login-form"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                     <h1 className="text-2xl font-bold text-accent-primary">Admin Login</h1>
                     <p className="text-text-secondary mt-2">Enter your credentials to access the dashboard.</p>
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6 text-left">
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
                            <label htmlFor="password"className="text-sm font-medium text-text-primary">
                            Password
                            </label>
                            <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-4 py-3 rounded-lg border-zinc-300 dark:border-zinc-600 bg-bg-tertiary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/80 focus:border-accent-primary/80 transition"
                            placeholder="Your password"
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
                                    Logging in...
                                    </>
                                ) : (
                                    'Log in'
                                )}
                            </button>
                        </div>
                    </form>
                     <button
                        onClick={() => setShowLogin(false)}
                        className="mt-6 font-medium text-sm text-zinc-500 hover:opacity-80 transition-opacity"
                    >
                        Cancel
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;
