import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from '../../components/PublicHeader';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <PublicHeader />
      <Outlet />
    </div>
  );
}
