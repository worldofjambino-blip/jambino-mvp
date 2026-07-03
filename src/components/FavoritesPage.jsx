import React, { useState, useEffect } from 'react';
import { fetchSpielplaetze } from '../api/googleSheets';
import { MOCK_PLAYGROUNDS } from './JambinoMVP';
import './FavoritesPage.css';

export default function FavoritesPage() {
  // Gespeicherte Favoriten-IDs aus localStorage laden
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const saved = localStorage.getItem('jambino_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Fehler beim Laden der Favoriten:', err);
      return [];
    }
  });

  // Spielplatz-Daten laden (Google Sheets, Fallback: Mock-Daten)
  const [playgrounds, setPlaygrounds] = useState(MOCK_PLAYGROUNDS);

  useEffect(() => {
    fetchSpielplaetze()
      .then(data => {
        if (data && data.length > 0) setPlaygrounds(data);
      })
      .catch(() => {});
  }, []);

  const removeFavorite = (id) => {
    const updated = favoriteIds.filter(favId => String(favId) !== String(id));
    setFavoriteIds(updated);
    localStorage.setItem('jambino_favorites', JSON.stringify(updated));
  };

  // IDs mit den vollständigen Spielplatz-Daten zusammenführen
  const favoritePlaygrounds = playgrounds.filter(pg =>
    favoriteIds.some(favId => String(favId) === String(pg.id))
  );

  return (
    <div className="favorites-page">
      <div className="page-header">
        <h1>❤️ Meine Lieblingsspielplätze</h1>
      </div>

      {favoritePlaygrounds.length === 0 ? (
        <div className="empty-state">
          <p>😢 Noch keine Favoriten hinzugefügt!</p>
          <p>Klick auf das Herz bei einem Spielplatz um ihn hinzuzufügen.</p>
        </div>
      ) : (
        <div className="favorites-list">
          {favoritePlaygrounds.map((pg) => (
            <div key={pg.id} className="favorite-card">
              <div className="favorite-info">
                <h2>{pg.name}</h2>
                {pg.city && <p className="favorite-location">📍 {pg.city}</p>}
                {pg.description && <p>{pg.description}</p>}
              </div>
              <button
                type="button"
                className="remove-favorite-button"
                onClick={() => removeFavorite(pg.id)}
              >
                Entfernen
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
