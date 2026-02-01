'use client';

import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import ImagePanel from '../components/ImagePanel';
import styles from '../components/Module/login.module.css';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
  };

  return (
    <div className={styles.authContainer}>
      {/* Panel Gambar - Animasi dengan transform */}
      <div className={`${styles.imagePanel} ${mode === 'login' ? styles['login-position'] : styles['register-position']}`}>
        <ImagePanel mode={mode} />
      </div>
      
      {/* Panel Form - Animasi dengan transform */}
      <div className={`${styles.formPanel} ${mode === 'login' ? styles['login-position'] : styles['register-position']}`}>
        <div className={styles.formContainer}>
          <LoginForm 
            mode={mode} 
            onToggleMode={toggleMode}
          />
        </div>
      </div>
    </div>
  );
}