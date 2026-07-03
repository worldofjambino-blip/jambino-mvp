import React, { useState } from 'react';
import './App.css';
import JambinoMVP from './components/JambinoMVP';
import BottomNavigation from './components/BottomNavigation';
import FavoritesPage from './components/FavoritesPage';
import ProfilePage from './components/ProfilePage';

function App() {
  const [activeTab, setActiveTab] = useState('discover');

  return (
    <div className="app-container">
      {activeTab === 'discover' && (
        <div className="page-content">
          <JambinoMVP />
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="page-content">
          <FavoritesPage />
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="page-content">
          <ProfilePage />
        </div>
      )}

      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;