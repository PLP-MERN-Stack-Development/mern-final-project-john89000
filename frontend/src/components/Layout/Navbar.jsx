import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { FiLogOut, FiUser } from 'react-icons/fi';
import './Layout.css';

const Navbar = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <span>📋</span> Task Manager
        </Link>
        
        <div className="navbar-menu">
          <Link to="/profile" className="navbar-user">
            <div className="navbar-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user?.name} />
              ) : (
                getInitials(user?.name)
              )}
            </div>
            <div className="navbar-user-info">
              <span className="navbar-username">{user?.name}</span>
              <span className="navbar-email">{user?.email}</span>
            </div>
          </Link>
          
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
            title="Logout"
          >
            <FiLogOut />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
