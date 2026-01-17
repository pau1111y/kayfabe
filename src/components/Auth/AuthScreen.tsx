import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

type AuthMode = 'signin' | 'signup';

export const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = mode === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password);

    if (error) {
      setError(error.message);
    } else if (mode === 'signup') {
      setError('Check your email for a confirmation link!');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-kayfabe-black flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="heading-1 mb-4">KAYFABE</h1>
          <p className="text-kayfabe-gray-light">
            {mode === 'signin' ? 'Welcome back to the business' : 'Step into the business'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label htmlFor="email" className="text-kayfabe-gray-light text-sm block mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="text-kayfabe-gray-light text-sm block mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          {error && (
            <div className={`text-sm p-3 border ${
              error.includes('Check your email')
                ? 'border-kayfabe-gold text-kayfabe-gold'
                : 'border-kayfabe-red text-kayfabe-red'
            }`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError(null);
              }}
              className="text-kayfabe-gray-light hover:text-kayfabe-cream text-sm"
              disabled={loading}
            >
              {mode === 'signin'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
