import React, { useState } from 'react';
import './App.css';
import JambinoMVP from './components/JambinoMVP';
import BottomNavigation from './components/BottomNavigation';

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
          <h1>❤️ Lieblinge</h1>
          <p>Hier werden deine Lieblingsspielplätze angezeigt...</p>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="page-content">
          <h1>🦊 Profil</h1>
          <p>Hier kannst du dein Profil verwalten...</p>
        </div>
      )}

      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
