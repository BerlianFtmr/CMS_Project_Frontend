'use client';

import React from 'react';
import styles from './Module/login.module.css';

interface ImagePanelProps {
  mode: 'login' | 'register';
}

const ImagePanel: React.FC<ImagePanelProps> = ({ mode }) => {
  const loginContent = {
    title: 'Selamat Datang Kembali',
    description: 'Masuk ke akun Anda untuk mengakses semua fitur dan layanan kami. Kami senang melihat Anda kembali!',
  };

  const registerContent = {
    title: 'Bergabunglah Dengan Kami',
    description: 'Daftarkan diri Anda untuk mendapatkan akses ke semua fitur kami dan Mulai perjalanan digital Anda sekarang!',
  };

  const content = mode === 'login' ? loginContent : registerContent;

  return (
    <div className={styles.imageContent}>
      <h2 className={styles.imageTitle}>{content.title}</h2>
      <p className={styles.imageText}>{content.description}</p>
    </div>
  );
};

export default ImagePanel;