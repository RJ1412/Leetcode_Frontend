// Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-white">
      <Navbar />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
