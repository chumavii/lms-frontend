import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SignUpForm() {
  const [fullName, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [passwordTwo, setPasswordTwo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordTwo, setShowPasswordTwo] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== passwordTwo) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fullName, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Registration failed');
      }

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000); // optional auto-redirect
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="form-div">
      <img src="/whitelogo.png" alt="Upskeel Logo" className="h-10 mb-8" />
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-header">
            <h2 className="h2">Create Account</h2>
            <p className="login-subtitle">Join our learning community</p>
          </div>

          {error && (
            <div className="error-banner">
              <p className="error-text">{error}</p>
            </div>
          )}
          {success && (
            <div className="success-banner">
              <p className="success-text">{success}</p>
            </div>
          )}

          <div className="form-group">
            <label className="input-title">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setName(e.target.value)}
              required
              placeholder=""
              className="text-input modern"
            />
          </div>

          <div className="form-group">
            <label className="input-title">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder=""
              className="text-input modern"
            />
          </div>

          <div className="form-group">
            <label className="input-title">Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              required
              className="text-input modern"
            >
              <option value="">Select your role</option>
              <option value="Student">Student</option>
              <option value="Instructor">Instructor</option>
            </select>
          </div>

          {role === "Instructor" && (
            <div className="instructor-notice">
              <p>Instructor accounts require admin approval before you can log in.</p>
            </div>
          )}

          <div className="form-group">
            <label className="input-title">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder=""
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

          <div className="form-group">
            <label className="input-title">Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswordTwo ? 'text' : 'password'}
                value={passwordTwo}
                onChange={e => setPasswordTwo(e.target.value)}
                required
                placeholder=""
                className="text-input modern"
              />
              <button
                type="button"
                onClick={() => setShowPasswordTwo(!showPasswordTwo)}
                className="password-toggle"
                aria-label={showPasswordTwo ? 'Hide password' : 'Show password'}
              >
                {showPasswordTwo ? (
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

          <button type="submit" className="btn-primary modern" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="login-footer">
            <p>Already have an account? <Link to="/login" className="link-primary">Sign In</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;
