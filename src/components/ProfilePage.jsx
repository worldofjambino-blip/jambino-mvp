import React, { useState } from 'react';
import './ProfilePage.css';

const EMPTY_PROFILE = { parentName: '', children: [] };

export default function ProfilePage() {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('jambino_profile');
      return saved ? JSON.parse(saved) : EMPTY_PROFILE;
    } catch (err) {
      console.error('Fehler beim Laden des Profils:', err);
      return EMPTY_PROFILE;
    }
  });

  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState('');
  const [savedMessage, setSavedMessage] = useState(false);

  const saveProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('jambino_profile', JSON.stringify(updatedProfile));
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  const addChild = () => {
    const name = newChildName.trim();
    const age = newChildAge.trim();
    if (!name || !age) return;
    const newChild = { id: Date.now(), name: name, age: age };
    saveProfile({ ...profile, children: [...profile.children, newChild] });
    setNewChildName('');
    setNewChildAge('');
  };

  const removeChild = (id) => {
    saveProfile({
      ...profile,
      children: profile.children.filter((child) => child.id !== id),
    });
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>🦊 Mein Profil</h1>
      </div>

      {savedMessage && <div className="save-toast">✅ Gespeichert!</div>}

      <div className="profile-section">
        <h2>👤 Über mich</h2>
        <label className="profile-label" htmlFor="parent-name">Mein Name</label>
        <div className="input-row">
          <input
            id="parent-name"
            type="text"
            className="profile-input"
            placeholder="z.B. Steffy"
            value={profile.parentName}
            onChange={(e) => setProfile({ ...profile, parentName: e.target.value })}
          />
          <button type="button" className="profile-button" onClick={() => saveProfile(profile)}>
            Speichern
          </button>
        </div>
      </div>

      <div className="profile-section">
        <h2>🧒 Meine Kinder</h2>

        {profile.children.length === 0 ? (
          <p className="empty-hint">Noch keine Kinder hinzugefügt. Trag sie unten ein!</p>
        ) : (
          <div className="children-list">
            {profile.children.map((child) => (
              <div key={child.id} className="child-card">
                <div className="child-info">
                  <span className="child-name">{child.name}</span>
                  <span className="child-age">{child.age} Jahre</span>
                </div>
                <button type="button" className="remove-child-button" onClick={() => removeChild(child.id)}>
                  Entfernen
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="add-child-form">
          <input
            type="text"
            className="profile-input"
            placeholder="Name des Kindes"
            value={newChildName}
            onChange={(e) => setNewChildName(e.target.value)}
          />
          <input
            type="number"
            className="profile-input age-input"
            placeholder="Alter"
            min="0"
            max="18"
            value={newChildAge}
            onChange={(e) => setNewChildAge(e.target.value)}
          />
          <button type="button" className="profile-button" onClick={addChild} disabled={!newChildName.trim() || !newChildAge.trim()}>
            + Hinzufügen
          </button>
        </div>
      </div>
    </div>
  );
}
