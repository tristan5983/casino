import React, { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { authAPI } from '../utils/api';

const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      if (isLogin) {
        response = await authAPI.login(formData.username, formData.password);
      } else {
        response = await authAPI.register(formData.username, formData.email, formData.password);
      }

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      onAuthSuccess(user);
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg flex items-center justify-center px-4">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-2 neon-purple">CASINO</h1>
        <p className="text-center text-gray-400 mb-8">Simulation Platform</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              disabled={loading}
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                disabled={loading}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              disabled={loading}
              required
            />
          </div>

          {error && (
            <div className="bg-red-900 border border-red-500 text-red-100 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-neon-purple to-neon-pink hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLogin ? (
              <>
                <LogIn className="w-5 h-5" />
                Login
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Register
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ username: '', email: '', password: '' });
                setError('');
              }}
              className="text-neon-cyan hover:text-neon-green font-semibold"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>

        <div className="mt-8 p-4 bg-dark-input rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400 text-center">
            Demo Credentials: <br />
            <span className="text-neon-cyan">Username: demo</span> <br />
            <span className="text-neon-cyan">Password: demo123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
