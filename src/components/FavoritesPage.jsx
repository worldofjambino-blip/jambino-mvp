import React, { useState, useEffect } from 'react';
import { fetchSpielplaetze } from '../api/googleSheets';
import { MOCK_PLAYGROUNDS } from './JambinoMVP';
import './FavoritesPage.css';

const EQUIPMENT_LABELS = {
  slide: 'Rutsche',
  swing: 'Schaukel',
  sandbox: 'Sandkasten',
  climbing: 'Klettern',
  water: 'Wasserspiel',
};

const featureBadges = (pg) => {
  const eq = pg.equipment || {};
  return Object.keys(EQUIPMENT_LABELS)
    .filter((k) => eq[k])
    .slice(0, 2)
    .map((k) => ({ key: k, label: EQUIPMENT_LABELS[k] }));
};

const FAVORITES_STYLES = `
  .fav-hero {
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: 600px;
    margin: 0 auto 16px auto;
    padding: 4px 2px;
  }
  .fav-hero-logo { width: 56px; height: 56px; object-fit: contain; }
  .fav-hero-title { color: var(--jambino-orange); font-size: 1.5rem; margin: 0; }
  .fav-hero-subtitle { color: var(--text-medium); font-size: 0.9rem; margin: 2px 0 0 0; }

  .fav-tabs { max-width: 600px; margin: 0 auto 12px auto; display: flex; gap: 8px; }
  .fav-tab {
    background: var(--jambino-orange);
    color: #fff;
    font-weight: 700;
    font-size: 0.9rem;
    padding: 8px 16px;
    border-radius: var(--radius-pill, 999px);
    box-shadow: var(--shadow-soft);
  }

  .fav-list { max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }

  .fav-card {
    display: flex;
    gap: 12px;
    background: rgba(255, 255, 255, 0.94);
    border-radius: var(--radius-lg, 16px);
    padding: 10px;
    box-shadow: var(--shadow-soft);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .fav-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-card, 0 8px 24px rgba(0,0,0,0.12)); }

  .fav-card-media { position: relative; flex: 0 0 auto; }
  .fav-card-image {
    width: 96px;
    height: 96px;
    object-fit: cover;
    border-radius: var(--radius-md, 12px);
    background: var(--jambino-cream, #fff7ed);
    display: block;
  }
  .fav-heart {
    position: absolute;
    top: 6px;
    left: 6px;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    font-size: 0.95rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  }
  .fav-heart:hover { transform: scale(1.08); }

  .fav-card-body { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
  .fav-card-title { font-size: 1.05rem; color: var(--text-dark); margin: 0; }
  .fav-card-location { font-size: 0.85rem; color: var(--text-medium); margin: 0; }
  .fav-card-rating { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; }
  .fav-rating-value { color: var(--text-medium); }

  .fav-badges { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px; }
  .fav-badge { font-size: 0.75rem; font-weight: 600; padding: 3px 10px; border-radius: var(--radius-pill, 999px); }
  .fav-badge.age { background: var(--jambino-green-soft, #dcfce7); color: #166534; }
  .fav-badge.feature { background: #ffedd5; color: #9a3412; }

  .fav-empty {
    max-width: 600px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.92);
    border-radius: var(--radius-lg, 16px);
    padding: 32px 20px;
    text-align: center;
    box-shadow: var(--shadow-soft);
  }
  .fav-empty-icon { font-size: 2.6rem; margin-bottom: 8px; }
  .fav-empty-title { font-size: 1.15rem; font-weight: 700; color: var(--text-dark); margin: 0 0 6px 0; }
  .fav-empty-text { color: var(--text-medium); font-size: 0.92rem; margin: 0 0 16px 0; }
  .fav-cta {
    background: var(--jambino-orange, #f97316);
    color: #fff;
    border: none;
    border-radius: var(--radius-pill, 999px);
    padding: 10px 20px;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
  }
  .fav-cta:hover { transform: translateY(-1px); }

  .fav-tip {
    max-width: 600px;
    margin: 16px auto 0 auto;
    display: flex;
    gap: 10px;
    align-items: flex-start;
    background: var(--jambino-cream, #fff7ed);
    border-radius: var(--radius-lg, 16px);
    padding: 14px 16px;
    box-shadow: var(--shadow-soft);
  }
  .fav-tip-icon { font-size: 1.3rem; }
  .fav-tip-title { font-weight: 700; color: var(--text-dark); margin: 0 0 2px 0; font-size: 0.95rem; }
  .fav-tip-text { color: var(--text-medium); font-size: 0.88rem; margin: 0; }

  @media (max-width: 480px) {
    .fav-card-image { width: 80px; height: 80px; }
  }
`;

export default function FavoritesPage({ onDiscover }) {
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const saved = localStorage.getItem('jambino_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Fehler beim Laden der Favoriten:', err);
      return [];
    }
  });

  const [playgrounds, setPlaygrounds] = useState(MOCK_PLAYGROUNDS);

  useEffect(() => {
    fetchSpielplaetze()
      .then((data) => {
        if (data && data.length > 0) setPlaygrounds(data);
      })
      .catch(() => {});
  }, []);

  const removeFavorite = (id) => {
    const updated = favoriteIds.filter((favId) => String(favId) !== String(id));
    setFavoriteIds(updated);
    localStorage.setItem('jambino_favorites', JSON.stringify(updated));
  };

  const favoritePlaygrounds = playgrounds.filter((pg) =>
    favoriteIds.some((favId) => String(favId) === String(pg.id))
  );

  return (
    <div className="favorites-page">
      <style>{FAVORITES_STYLES}</style>

      <div className="fav-hero">
        <img src="/jambino-logo.png" alt="Jambino Fuchs" className="fav-hero-logo" />
        <div>
          <h1 className="fav-hero-title">Meine Favoriten</h1>
          <p className="fav-hero-subtitle">Deine Lieblingsspielplätze auf einen Blick</p>
        </div>
      </div>

      <div className="fav-tabs">
        <span className="fav-tab">🛝 Spielplätze</span>
      </div>

      {favoritePlaygrounds.length === 0 ? (
        <div className="fav-empty">
          <div className="fav-empty-icon">🦊</div>
          <p className="fav-empty-title">Noch keine Favoriten</p>
          <p className="fav-empty-text">
            Tippe im Entdecken-Tab auf das 🤍 bei einem Spielplatz, um ihn hier zu speichern.
          </p>
          {typeof onDiscover === 'function' && (
            <button type="button" className="fav-cta" onClick={onDiscover}>
              Lieblingsort entdecken
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="fav-list">
            {favoritePlaygrounds.map((pg) => (
              <div key={pg.id} className="fav-card">
                <div className="fav-card-media">
                  <img
                    src="/jambino-placeholder.png"
                    alt={pg.name}
                    className="fav-card-image"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    className="fav-heart"
                    onClick={() => removeFavorite(pg.id)}
                    aria-label="Aus Favoriten entfernen"
                  >
                    ❤️
                  </button>
                </div>
                <div className="fav-card-body">
                  <h3 className="fav-card-title">{pg.name}</h3>
                  {pg.city && <p className="fav-card-location">📍 {pg.city}</p>}
                  <div className="fav-card-rating">
                    <span className="fav-stars">{'⭐'.repeat(Math.round(pg.rating || 4))}</span>
                    {pg.rating && (
                      <span className="fav-rating-value">
                        {pg.rating}{pg.reviews ? ` (${pg.reviews})` : ''}
                      </span>
                    )}
                  </div>
                  <div className="fav-badges">
                    {(pg.ageGroups || []).map((a) => (
                      <span key={a} className="fav-badge age">{a} Jahre</span>
                    ))}
                    {featureBadges(pg).map((f) => (
                      <span key={f.key} className="fav-badge feature">{f.label}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="fav-tip">
            <span className="fav-tip-icon">💡</span>
            <div>
              <p className="fav-tip-title">Gut zu wissen</p>
              <p className="fav-tip-text">
                Tippe auf das ❤️ auf einer Karte, um einen Spielplatz wieder aus deinen Favoriten zu entfernen.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}