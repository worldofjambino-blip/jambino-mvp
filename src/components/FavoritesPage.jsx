import React, { useState, useEffect } from 'react';
import './FavoritesPage.css';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('jambino_favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const removeFavorite = (id) => {
    const updated = favorites.filter((fav) => fav.id !== id);
    setFavorites(updated);
    localStorage.setItem('jambino_favorites', JSON.stringify(updated));
  };

  return (
    <div className="favorites-page">
      <div className="page-header">
        <h1>❤️ Meine Lieblingsspielplätze</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <p>😢 Noch keine Favoriten hinzugefügt!</p>
          <p>Klick auf das Herz bei einem Spielplatz um ihn hinzuzufügen.</p>
        </div>
      ) : (
        <div className="favorites-list">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="favorite-card">
              <div className="favorite-info">
                <h2>{favorite.name}</h2>
                {favorite.description && <p>{favorite.description}</p>}
              </div>
              <button
                type="button"
                className="remove-favorite-button"
                onClick={() => removeFavorite(favorite.id)}
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
