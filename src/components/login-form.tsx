import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onLoginSuccess: (token: string) => void;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const GUEST_EMAIL = import.meta.env.VITE_GUEST_EMAIL;
const GUEST_PASSWORD = import.meta.env.VITE_GUEST_PASSWORD;

function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function loginUser(email: string, password: string) {
    setError('');
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Invalid credentials');
      if (localStorage.getItem('token') != null) localStorage.removeItem("token");
      const data = await response.json();
      localStorage.setItem('token', data.token);
      onLoginSuccess(data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    loginUser(email, password);
  }

  function loginAsGuest() {
    loginUser(GUEST_EMAIL, GUEST_PASSWORD);
  }

  return (
    <div className="form-div">
      <img src="/whitelogo.png" alt="Upskeel Logo" className="h-10 mb-8" />
      <div className="login-container">
        <form onSubmit={handleSubmit} className='login-form'>
          <div className="login-header">
            <h2 className="h2">Welcome Back</h2>
            <p className="login-subtitle">Sign in to your account</p>
          </div>
          
          {error && (
            <div className="error-banner">
              <p className="error-text">{error}</p>
            </div>
          )}
          
          <div className="form-group">
            <label className="input-title">Email Address</label>
            <input
              type="email"
              aria-label='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="text-input modern"
            />
          </div>

          <div className="form-group">
            <div className="password-header">
              <label className="input-title">Password</label>
              <p
                onClick={() => navigate('/forgot-password')}
                className="forgot-password-link"
              >
                Forgot?
              </p>
            </div>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                aria-label='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="text-input modern"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c2.292 5.118 7.288 8.5 12.064 8.5a13.483 13.483 0 005.024-1.236M9.27 6.063A7.5 7.5 0 0112 6c4.418 0 8.134 3.134 9.263 7.325A7.478 7.478 0 0115.21 13M6.63 6.63a.75.75 0 11-1.06-1.06M17.25 17.25a.75.75 0 11-1.06-1.06" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.107.424.107.639a1.012 1.012 0 01-.11.638c-1.387 4.172-5.33 7.18-9.95 7.18-4.638 0-8.573-3.006-9.964-7.178a1.012 1.012 0 01-.102-.639z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary modern">
            Sign In
          </button>

          <div className="login-divider">
            <span>or</span>
          </div>

          <button 
            type="button"
            onClick={loginAsGuest}
            className="btn-guest"
          >
            Continue as Guest
          </button>

          <div className='login-footer'>
            <p>Don't have an account? <Link to="/signup" className='link-primary'>Create one</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
