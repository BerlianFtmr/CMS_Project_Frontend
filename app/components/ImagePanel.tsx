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
    features: [
      { icon: 'fas fa-shield-alt', text: 'Keamanan terjamin' },
      { icon: 'fas fa-bolt', text: 'Akses cepat dan mudah' },
      { icon: 'fas fa-headset', text: 'Dukungan 24/7' }
    ]
  };

  const registerContent = {
    title: 'Bergabunglah Dengan Kami',
    description: 'Daftarkan diri Anda untuk mendapatkan akses ke semua fitur eksklusif kami. Mulai perjalanan digital Anda sekarang!',
    features: [
      { icon: 'fas fa-gift', text: 'Bonus pendaftaran' },
      { icon: 'fas fa-chart-line', text: 'Akses penuh ke semua fitur' },
      { icon: 'fas fa-users', text: 'Komunitas eksklusif' }
    ]
  };

  const content = mode === 'login' ? loginContent : registerContent;

  return (
    <div className={styles.imageContent}>
      <h2 className={styles.imageTitle}>{content.title}</h2>
      <p className={styles.imageText}>{content.description}</p>
      
      <ul className={styles.featuresList}>
        {content.features.map((feature, index) => (
          <li key={index} className={styles.featureItem}>
            <i className={`${feature.icon} ${styles.featureIcon}`}></i>
            <span>{feature.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImagePanel;