
import * as React from 'react';
import { useAppContext } from '../context/AppContext'; // Corrected Path
import { Page } from '../types';

interface AdminGuardProps {
  children: React.ReactNode;
  onNavigate: (page: Page) => void;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children, onNavigate }) => {
  const { isAdmin, authLoading } = useAppContext();

  React.useEffect(() => {
    if (!authLoading && !isAdmin) {
      onNavigate('login');
    }
  }, [isAdmin, authLoading, onNavigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-secondary">
        Verifying access...
      </div>
    );
  }

  if (!isAdmin) {
    // This will be briefly visible before the useEffect redirect kicks in.
    return (
        <div className="min-h-screen flex items-center justify-center text-text-secondary">
            Redirecting to login...
        </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
