import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ClinicLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { clinicLogin, clinicUser, clinicLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (!clinicLoading && clinicUser) {
      navigate('/clinic');
    }
  }, [clinicUser, clinicLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await clinicLogin(email, password);

    if (success) {
      navigate('/clinic');
    } else {
      setError('Invalid email or password');
    }

    setLoading(false);
  };

  if (clinicLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🏥 Clinic Login</h2>
        <p style={{ textAlign: 'center', marginBottom: '20px', color: '#7f8c8d' }}>
          Sign in to manage appointments
        </p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@clinic.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', color: '#95a5a6', fontSize: '14px' }}>
          <p>Test account:</p>
          <p>dr.smith@clinic.com / password123</p>
        </div>
      </div>
    </div>
  );
};
