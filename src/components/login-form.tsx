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
    <>
      <div className="form-div">
        <img src="/whitelogo.png" alt="Upskeel Logo" className="h-8 mb-5 block md:hidden" />
        <form onSubmit={handleSubmit} className='form'>
          <h2 className="h2">Login</h2>
          {error && <p className=" text-xs text-red-500 mb-2">{error}</p>}
          <p className="input-title">Email</p>
          <input
            type="email"
            aria-label='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="text-input"
          />
          <p className="input-title">Password</p>
          <input
            type="password"
            aria-label='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="text-input"
          />
          <p
            onClick={() => navigate('/forgot-password')}
            className="flex justify-end underline pb-3 text-[10px] cursor-pointer"
          >
            Forgot password?
          </p>
          <button type="submit" className="btn-primary border-1 border-[#4e8ccf63]">Login</button>
          <div className='text-xs p-6 text-center'>
            <p>Don't have an account? <Link to="/signup" className='underline text-blue-400'>Sign up</Link></p>
            <p>Or</p>
            <p onClick={loginAsGuest} className='underline text-blue-400 cursor-pointer'> View project as a guest </p>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginForm;
