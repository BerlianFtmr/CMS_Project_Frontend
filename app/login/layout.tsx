'use client';

import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import '../components/Module/login.module.css';

interface LoginLayoutProps {
  children: React.ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  // Cek jika user sudah login
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Jika sudah login, redirect ke home
      if (window.confirm('Anda sudah login. Ingin logout?')) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_email');
        window.dispatchEvent(new Event('storage'));
      } else {
        window.location.href = '/';
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>Login & Register | BookShop ED</title>
        <meta name="description" content="Login atau daftar untuk mengakses BookShop ED" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      
      {/* Back to Home Button */}
      <div className="fixed top-6 left-6 z-50">
        <Link 
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 hover:text-purple-600 hover:bg-white rounded-lg shadow-md transition-all duration-300"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          <span className="font-medium">Kembali ke Beranda</span>
        </Link>
      </div>
      
      <div className="authReset">
        <div className="authBody">
          {children}
        </div>
      </div>
    </>
  );
}