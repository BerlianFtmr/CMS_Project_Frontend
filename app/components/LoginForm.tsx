'use client';

import React, { useState } from 'react';
import styles from './Module/login.module.css';

interface LoginFormProps {
  mode: 'login' | 'register';
  onToggleMode: () => void;
}

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ mode, onToggleMode }) => {
  // State untuk form data
  const [loginData, setLoginData] = useState<LoginData>({
    username: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState<RegisterData>({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  // State untuk error messages
  const [loginErrors, setLoginErrors] = useState<Partial<LoginData>>({});
  const [registerErrors, setRegisterErrors] = useState<Partial<RegisterData>>({});

  // State untuk loading dan password visibility
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Handler untuk login form
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    
    // Clear error saat user mulai mengetik
    if (loginErrors[name as keyof LoginData]) {
      setLoginErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handler untuk register form
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
    
    // Clear error saat user mulai mengetik
    if (registerErrors[name as keyof RegisterData]) {
      setRegisterErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validasi email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validasi form login
  const validateLoginForm = (): boolean => {
    const errors: Partial<LoginData> = {};

    if (!loginData.username.trim()) {
      errors.username = 'Username/Email harus diisi';
    }

    if (!loginData.password.trim()) {
      errors.password = 'Password harus diisi';
    }

    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validasi form register
  const validateRegisterForm = (): boolean => {
    const errors: Partial<RegisterData> = {};

    if (!registerData.name.trim()) {
      errors.name = 'Nama lengkap harus diisi';
    }

    if (!registerData.email.trim()) {
      errors.email = 'Email harus diisi';
    } else if (!isValidEmail(registerData.email)) {
      errors.email = 'Format email tidak valid';
    }

    if (!registerData.username.trim()) {
      errors.username = 'Username harus diisi';
    } else if (registerData.username.length < 3) {
      errors.username = 'Username minimal 3 karakter';
    }

    if (!registerData.password.trim()) {
      errors.password = 'Password harus diisi';
    } else if (registerData.password.length < 8) {
      errors.password = 'Password minimal 8 karakter';
    }

    if (!registerData.confirmPassword.trim()) {
      errors.confirmPassword = 'Konfirmasi password harus diisi';
    } else if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = 'Password tidak cocok';
    }

    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handler untuk submit login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLoginForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulasi API call untuk login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulasi data user yang berhasil login
      const mockUser = {
        token: 'mock-jwt-token-' + Date.now(),
        name: 'John Doe',
        email: loginData.username.includes('@') ? loginData.username : `${loginData.username}@example.com`
      };
      
      // Simpan ke localStorage (dalam aplikasi real, gunakan proper auth)
      localStorage.setItem('auth_token', mockUser.token);
      localStorage.setItem('user_name', mockUser.name);
      localStorage.setItem('user_email', mockUser.email);
      
      // Kirim event untuk update Navbar
      window.dispatchEvent(new Event('storage'));
      
      alert(`Login berhasil! Selamat datang, ${mockUser.name}.`);
      
      // Reset form
      setLoginData({ username: '', password: '' });
      
      // Redirect ke home setelah 1 detik
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
      
    } catch (error) {
      console.error('Login error:', error);
      alert('Login gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler untuk submit register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulasi API call untuk register
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulasi data user yang berhasil register
      const mockUser = {
        token: 'mock-jwt-token-' + Date.now(),
        name: registerData.name,
        email: registerData.email
      };
      
      // Simpan ke localStorage (dalam aplikasi real, gunakan proper auth)
      localStorage.setItem('auth_token', mockUser.token);
      localStorage.setItem('user_name', mockUser.name);
      localStorage.setItem('user_email', mockUser.email);
      
      // Kirim event untuk update Navbar
      window.dispatchEvent(new Event('storage'));
      
      alert('Pendaftaran berhasil! Anda telah login secara otomatis.');
      
      // Reset form
      setRegisterData({
        name: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
      });
      
      // Switch to login mode
      onToggleMode();
      
    } catch (error) {
      console.error('Register error:', error);
      alert('Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render form login
  const renderLoginForm = () => (
    <form className={`${styles.authForm} ${styles.active}`} onSubmit={handleLoginSubmit}>
      <div className={styles.authLogo}>
        <i className={`fas fa-user-circle ${styles.authLogoIcon}`}></i>
        <span>BookShop ED</span>
      </div>
      
      <h2 className={styles.authTitle}>Login to continue</h2>
      <p className={styles.authSubtitle}>Masukkan kredensial Anda untuk mengakses akun</p>
      
      <div className={styles.formGroup}>
        <label htmlFor="loginUsername" className={styles.formLabel}>Username/Email</label>
        <div className={styles.inputWithIcon}>
          <i className={`fas fa-user ${styles.inputIcon}`}></i>
          <input
            type="text"
            id="loginUsername"
            name="username"
            value={loginData.username}
            onChange={handleLoginChange}
            className={`${styles.formInput} ${loginErrors.username ? styles.inputError : ''}`}
            placeholder="Masukkan username atau email"
            required
          />
        </div>
        {loginErrors.username && (
          <div className={styles.errorMessage}>{loginErrors.username}</div>
        )}
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="loginPassword" className={styles.formLabel}>Password</label>
        <div className={styles.inputWithIcon}>
          <i className={`fas fa-lock ${styles.inputIcon}`}></i>
          <input
            type={showLoginPassword ? "text" : "password"}
            id="loginPassword"
            name="password"
            value={loginData.password}
            onChange={handleLoginChange}
            className={`${styles.formInput} ${loginErrors.password ? styles.inputError : ''}`}
            placeholder="Masukkan password"
            required
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowLoginPassword(!showLoginPassword)}
            aria-label={showLoginPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            <i className={`fas fa-${showLoginPassword ? 'eye-slash' : 'eye'}`}></i>
          </button>
        </div>
        {loginErrors.password && (
          <div className={styles.errorMessage}>{loginErrors.password}</div>
        )}
      </div>
      
      <div className={styles.formGroup}>
        <button 
          type="submit" 
          className={styles.authButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className={styles.loadingSpinner}></span>
              Memproses...
            </>
          ) : 'Login'}
        </button>
      </div>
      
      <div className={styles.toggleContainer}>
        <span>Tidak punya akun?</span>
        <button 
          type="button" 
          className={styles.toggleLink}
          onClick={onToggleMode}
        >
          Daftar di sini
        </button>
      </div>
    </form>
  );

  // Render form register
  const renderRegisterForm = () => (
    <form className={`${styles.authForm} ${styles.active}`} onSubmit={handleRegisterSubmit}>
      <div className={styles.authLogo}>
        <i className={`fas fa-user-plus ${styles.authLogoIcon}`}></i>
        <span>BookShop ED</span>
      </div>
      
      <h2 className={styles.authTitle}>Buat Akun Baru</h2>
      <p className={styles.authSubtitle}>Isi data berikut untuk membuat akun baru</p>
      
      <div className={styles.formGroup}>
        <label htmlFor="registerName" className={styles.formLabel}>Nama Lengkap</label>
        <div className={styles.inputWithIcon}>
          <i className={`fas fa-user ${styles.inputIcon}`}></i>
          <input
            type="text"
            id="registerName"
            name="name"
            value={registerData.name}
            onChange={handleRegisterChange}
            className={`${styles.formInput} ${registerErrors.name ? styles.inputError : ''}`}
            placeholder="Masukkan nama lengkap"
            required
          />
        </div>
        {registerErrors.name && (
          <div className={styles.errorMessage}>{registerErrors.name}</div>
        )}
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="registerEmail" className={styles.formLabel}>Email</label>
        <div className={styles.inputWithIcon}>
          <i className={`fas fa-envelope ${styles.inputIcon}`}></i>
          <input
            type="email"
            id="registerEmail"
            name="email"
            value={registerData.email}
            onChange={handleRegisterChange}
            className={`${styles.formInput} ${registerErrors.email ? styles.inputError : ''}`}
            placeholder="Masukkan email"
            required
          />
        </div>
        {registerErrors.email && (
          <div className={styles.errorMessage}>{registerErrors.email}</div>
        )}
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="registerUsername" className={styles.formLabel}>Username</label>
        <div className={styles.inputWithIcon}>
          <i className={`fas fa-at ${styles.inputIcon}`}></i>
          <input
            type="text"
            id="registerUsername"
            name="username"
            value={registerData.username}
            onChange={handleRegisterChange}
            className={`${styles.formInput} ${registerErrors.username ? styles.inputError : ''}`}
            placeholder="Masukkan username"
            required
          />
        </div>
        {registerErrors.username && (
          <div className={styles.errorMessage}>{registerErrors.username}</div>
        )}
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="registerPassword" className={styles.formLabel}>Password</label>
        <div className={styles.inputWithIcon}>
          <i className={`fas fa-lock ${styles.inputIcon}`}></i>
          <input
            type={showRegisterPassword ? "text" : "password"}
            id="registerPassword"
            name="password"
            value={registerData.password}
            onChange={handleRegisterChange}
            className={`${styles.formInput} ${registerErrors.password ? styles.inputError : ''}`}
            placeholder="Masukkan password"
            required
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
            aria-label={showRegisterPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            <i className={`fas fa-${showRegisterPassword ? 'eye-slash' : 'eye'}`}></i>
          </button>
        </div>
        {registerErrors.password && (
          <div className={styles.errorMessage}>{registerErrors.password}</div>
        )}
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="registerConfirmPassword" className={styles.formLabel}>Konfirmasi Password</label>
        <div className={styles.inputWithIcon}>
          <i className={`fas fa-lock ${styles.inputIcon}`}></i>
          <input
            type="password"
            id="registerConfirmPassword"
            name="confirmPassword"
            value={registerData.confirmPassword}
            onChange={handleRegisterChange}
            className={`${styles.formInput} ${registerErrors.confirmPassword ? styles.inputError : ''}`}
            placeholder="Ulangi password"
            required
          />
        </div>
        {registerErrors.confirmPassword && (
          <div className={styles.errorMessage}>{registerErrors.confirmPassword}</div>
        )}
      </div>
      
      <div className={styles.formGroup}>
        <button 
          type="submit" 
          className={styles.authButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className={styles.loadingSpinner}></span>
              Mendaftarkan...
            </>
          ) : 'Daftar'}
        </button>
      </div>
      
      <div className={styles.toggleContainer}>
        <span>Sudah punya akun?</span>
        <button 
          type="button" 
          className={styles.toggleLink}
          onClick={onToggleMode}
        >
          Login di sini
        </button>
      </div>
    </form>
  );

  return mode === 'login' ? renderLoginForm() : renderRegisterForm();
};

export default LoginForm;