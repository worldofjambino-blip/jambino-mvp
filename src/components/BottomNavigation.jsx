import React from 'react';
import './BottomNavigation.css';

export default function BottomNavigation({ activeTab, setActiveTab }) {
  return (
    <div className="bottom-navigation">
      <button 
        className={`nav-item ${activeTab === 'discover' ? 'active' : ''}`}
        onClick={() => setActiveTab('discover')}
      >
        <span className="nav-icon">🎈</span>
        <span className="nav-label">Entdecken</span>
      </button>
      
      <button 
        className={`nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
        onClick={() => setActiveTab('favorites')}
      >
        <span className="nav-icon">❤️</span>
        <span className="nav-label">Lieblinge</span>
      </button>
      
      <button 
        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => setActiveTab('profile')}
      >
        <span className="nav-icon">🦊</span>
        <span className="nav-label">Profil</span>
      </button>
    </div>
  );
}
