import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const PatientLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { patientLogin, patient, patientLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (!patientLoading && patient) {
      navigate('/patient');
    }
  }, [patient, patientLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await patientLogin(email, password);

    if (success) {
      navigate('/patient');
    } else {
      setError('Invalid email or password');
    }

    setLoading(false);
  };

  if (patientLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="login-container" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
      <div className="login-card">
        <h2>👤 Patient Portal</h2>
        <p style={{ textAlign: 'center', marginBottom: '20px', color: '#7f8c8d' }}>
          Sign in to view your appointments
        </p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
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
          <p>Test accounts:</p>
          <p>alice@example.com / password123</p>
          <p>bob@example.com / password123</p>
        </div>
      </div>
    </div>
  );
};
