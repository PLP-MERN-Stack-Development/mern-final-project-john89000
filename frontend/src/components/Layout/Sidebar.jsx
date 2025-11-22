import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiFolder, 
  FiCheckSquare, 
  FiUser,
  FiBarChart2 
} from 'react-icons/fi';
import './Layout.css';

const Sidebar = () => {
  const navItems = [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/projects', icon: FiFolder, label: 'Projects' },
    { to: '/tasks', icon: FiCheckSquare, label: 'Tasks' },
    { to: '/profile', icon: FiUser, label: 'Profile' },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <item.icon className="sidebar-icon" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
