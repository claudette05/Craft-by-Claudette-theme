
// config.ts

// Attempt to get the key from standard Create React App env vars or Vite env vars
// If neither exist, fall back to the test key.
export const PAYSTACK_PUBLIC_KEY = 
  process.env.REACT_APP_PAYSTACK_KEY || 
  (import.meta as any).env?.VITE_PAYSTACK_KEY || 
  'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
