import React from 'react';
import './Layout.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>📋 Task Manager</h1>
          <p>Organize your work, achieve your goals</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
