import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'var(--gray-50)',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <FiAlertTriangle size={64} color="var(--error)" style={{ marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '4rem', fontWeight: '700', marginBottom: '1rem' }}>404</h1>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--gray-700)' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard" className="btn btn-primary">
          <FiHome /> Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
