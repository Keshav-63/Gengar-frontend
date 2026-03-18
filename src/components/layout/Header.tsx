import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

export const Header = () => {
  const { toggleSidebar } = useUIStore();
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <button className="header-toggle-sidebar" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="header-logo">
          <div className="header-logo-icon">☁️</div>
          <h1 className="header-title">CloudVault</h1>
        </div>
      </div>

      <div className="header-right">
        <button className="header-icon-button" title="Notifications">
          <Bell size={20} />
        </button>

        <div className="header-user">
          <button className="header-user-button">
            <div className="header-user-avatar">
              {user?.full_name.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="header-user-name">{user?.full_name || 'User'}</span>
          </button>

          <div className="header-user-menu">
            <Link to="/settings" className="header-user-menu-item">
              <User size={16} />
              Settings
            </Link>
            <button onClick={logout} className="header-user-menu-item header-user-menu-logout">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
