import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <Header />
      <main className="max-w-[85%] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}