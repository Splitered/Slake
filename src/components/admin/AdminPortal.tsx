import React from 'react';
import { useCms } from '../../context/CmsContext';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

interface AdminPortalProps {
  onBackToSite: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToSite }) => {
  const { isAuthenticated } = useCms();

  if (!isAuthenticated) {
    return <AdminLogin onBackToSite={onBackToSite} />;
  }

  return <AdminDashboard onBackToSite={onBackToSite} />;
};
