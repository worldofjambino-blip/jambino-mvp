import React, { useState, useMemo, useEffect } from 'react';
import { fetchSpielplaetze } from '../api/googleSheets';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './JambinoMVP.css';

export const MOCK_PLAYGROUNDS = [
  {
    id: 1,
    name: 'Seeplatz Konstanz',
    latitude: 47.6560,
    longitude: 8.9545,
    city: 'Konstanz',
    country: 'DE',
    description: 'Wunderbar gelegener Spielplatz direkt am Bodensee mit Wasserspielbereich.',
    rating: 4.7,
    reviews: 23,
    equipment: { slide: true, swing: true, sandbox: true, climbing: false, water: true },
    amenities: { shade: true, toilets: true, parking: true, restaurant: false },
    ageGroups: ['3-6', '6-12'],
    coverImage: 'https://images.unsplash.com/photo-1552810309-ed75afc4a9ad?w=600',
  },
  {
    id: 2,
    name: 'Kinderpark Schaffhausen',
    latitude: 47.6965,
    longitude: 8.6372,
    city: 'Schaffhausen',
    country: 'CH',
    description: 'Großzügiger Spielplatz mit Wiese und Klettergerüsten.',
    rating: 4.5,
    reviews: 18,
    equipment: { slide: true, swing: true, sandbox: false, climbing: true, water: false },
    amenities: { shade: true, toilets: false, parking: true, restaurant: false },
    ageGroups: ['6-12', '12+'],
    coverImage: 'https://images.unsplash.com/photo-1566216898276-a8ef6a961b27?w=600',
  },
  {
    id: 3,
    name: 'Hohentwiel Spielplatz',
    latitude: 47.7438,
    longitude: 8.8494,
    city: 'Singen',
    country: 'DE',
    description: 'Abenteuerspielplatz mit Naturelementen.',
    rating: 4.9,
    reviews: 31,
    equipment: { slide: true, swing: false, sandbox: true, climbing: true, water: false },
    amenities: { shade: true, toilets: true, parking: true, restaurant: false },
    ageGroups: ['3-6', '6-12', '12+'],
    coverImage: 'https://images.unsplash.com/photo-1552810309-ed75afc4a9ad?w=600',
  },
  {
    id: 4,
    name: 'Seeufer-Park Stockach',
    latitude: 47.8125,
    longitude: 9.0267,
    city: 'Stockach',
    country: 'DE',
    description: 'Idyllischer Spielplatz an der Aach mit Picknickbereich.',
    rating: 4.3,
    reviews: 14,
    equipment: { slide: false, swing: true, sandbox: true, climbing: false, water: true },
    amenities: { shade: false, toilets: true, parking: true, restaurant: true },
    ageGroups: ['0-3', '3-6'],
    coverImage: 'https://images.unsplash.com/photo-1566216898276-a8ef6a961b27?w=600',
  },
];

const FALLBACK_IMAGE = '/jambino-placeholder.png';

// Zahlenbereiche der Filter-Chips
const CHIP_RANGES = {
  '0-3': [0, 3],
  '3-6': [3, 6],
  '6-12': [6, 12],
  '12+': [12, 99],
};

// Wandelt Altersangaben aus dem Sheet in Zahlenbereiche um,
// z.B. "Bis 14 Jahre" -> [0,14], "Ab 3 Jahren" -> [3,99], "6-12" -> [6,12]
const parseAgeRange = (text) => {
  if (!text) return null;
  const t = String(text).toLowerCase();
  const nums = (t.match(/\d+/g) || []).map(Number);
  if (nums.length === 0) return null;
  if (t.includes('bis')) return [0, nums[0]];
  if (t.includes('ab') || t.includes('+')) return [nums[0], 99];
  if (nums.length >= 2) return [Math.min(...nums), Math.max(...nums)];
  return [nums[0], nums[0]];
};

// Prüft, ob sich zwei Bereiche überschneiden
const rangesOverlap = (a, b) => a[0] <= b[1] && b[0] <= a[1];

// Solange die Bild-Links im Sheet noch nicht gepflegt sind, zeigen wir
// überall den Platzhalter. Später wieder aktivieren: USE_SHEET_IMAGES = true
const USE_SHEET_IMAGES = false;

const SafeImage = ({ src, alt, className }) => {
  const initial = USE_SHEET_IMAGES && src && src.startsWith('http') ? src : FALLBACK_IMAGE;
  const [imgSrc, setImgSrc] = useState(initial);

  useEffect(() => {
    setImgSrc(USE_SHEET_IMAGES && src && src.startsWith('http') ? src : FALLBACK_IMAGE);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setImgSrc(FALLBACK_IMAGE)}
    />
  );
};

const FilterPanel = ({ filters, onFilterChange }) => {
  return (
    <div className="filter-panel">
      <h3 className="filter-title">Filter</h3>
      <div className="filter-section">
        <label className="section-title">Altersgruppen</label>
        <div className="filter-buttons">
          {['0-3', '3-6', '6-12', '12+'].map(age => (
            <button
              key={age}
              className={`filter-btn ${filters.ageGroups.includes(age) ? 'active' : ''}`}
              onClick={() => {
                const newAges = filters.ageGroups.includes(age)
                  ? filters.ageGroups.filter(a => a !== age)
                  : [...filters.ageGroups, age];
                onFilterChange({ ...filters, ageGroups: newAges });
              }}
            >
              {age} Jahre
            </button>
          ))}
        </div>
      </div>
      <button
        className="filter-reset"
        onClick={() => onFilterChange({ ageGroups: [], equipment: [], amenities: [] })}
      >
        ✕ Alle Filter zurücksetzen
      </button>
    </div>
  );
};

const PlaygroundList = ({ playgrounds, onSelectPlayground, favorites, onToggleFavorite }) => {
  return (
    <div className="list-container">
      <h3 className="list-title">In deiner Nähe ({playgrounds.length})</h3>
      <div className="list">
        {playgrounds.map(pg => (
          <div
            key={pg.id}
            className="list-item"
            onClick={() => onSelectPlayground(pg)}
          >
            <SafeImage
              src={pg.coverImage}
              alt={pg.name}
              className="list-item-image"
            />
            <div className="list-item-content">
              <h4 className="list-item-title">{pg.name}</h4>
              {pg.city && <p className="list-item-location">📍 {pg.city}</p>}
              <div className="list-item-rating">
                <span className="stars">{'⭐'.repeat(Math.round(pg.rating || 4))}</span>
                {pg.rating && <span className="rating-value">{pg.rating}</span>}
              </div>
              {pg.ageGroups && pg.ageGroups.length > 0 && (
                <div className="age-badges">
                  {pg.ageGroups.map(age => (
                    <span key={age} className="age-badge">{age}</span>
                  ))}
                </div>
              )}
            </div>
            <button
              className={`favorite-btn ${favorites.includes(pg.id) ? 'is-favorite' : ''}`}
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(pg.id); }}
              aria-label="Favorit umschalten"
            >
              {favorites.includes(pg.id) ? '❤️' : '🤍'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const PlaygroundModal = ({ playground, onClose }) => {
  if (!playground) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <SafeImage
          src={playground.coverImage}
          alt={playground.name}
          className="modal-image"
        />
        <div className="modal-body">
          <h2 className="modal-title">{playground.name}</h2>
          {playground.description && <p className="modal-description">{playground.description}</p>}
          {playground.city && <p className="modal-location">📍 {playground.city}</p>}
          {playground.rating && (
            <div className="modal-rating">
              ⭐ {playground.rating}{playground.reviews ? ` (${playground.reviews} Bewertungen)` : ''}
            </div>
          )}
          {playground.ageGroups && playground.ageGroups.length > 0 && (
            <div className="age-badges modal-badges">
              {playground.ageGroups.map(age => (
                <span key={age} className="age-badge">{age}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function JambinoMVP() {
  const [playgrounds, setPlaygrounds] = useState(MOCK_PLAYGROUNDS);
  const [filters, setFilters] = useState({ ageGroups: [], equipment: [], amenities: [] });
  const [selectedPlayground, setSelectedPlayground] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('jambino_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Fehler beim Laden der Favoriten:', err);
      return [];
    }
  });

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  useEffect(() => {
    fetchSpielplaetze()
      .then(data => {
        if (data && data.length > 0) setPlaygrounds(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem('jambino_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const filteredPlaygrounds = useMemo(() => {
    return playgrounds.filter(pg => {
      const matchesSearch =
        pg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pg.city && pg.city.toLowerCase().includes(searchTerm.toLowerCase()));
      if (!matchesSearch) return false;
      if (filters.ageGroups.length > 0) {
        const selectedRanges = filters.ageGroups.map(a => CHIP_RANGES[a]).filter(Boolean);
        const pgRanges = (pg.ageGroups || []).map(parseAgeRange).filter(Boolean);
        // Spielplätze ohne auswertbare Altersangabe bleiben sichtbar
        if (pgRanges.length > 0) {
          const matches = selectedRanges.some(sel =>
            pgRanges.some(pgr => rangesOverlap(sel, pgr))
          );
          if (!matches) return false;
        }
      }
      return true;
    });
  }, [filters, searchTerm, playgrounds]);

  return (
    <div className="jambino-app">
      <header className="app-header">
        <img src="/jambino-logo.png" alt="Jambino Fuchs" className="app-logo" />
        <div className="header-text">
          <h1 className="app-title">Jambino</h1>
          <p className="app-subtitle">Dein Spielplatz-Kompass</p>
        </div>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Finde deinen nächsten Lieblingsspielplatz..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="main-layout">
        <div className="sidebar">
          <FilterPanel filters={filters} onFilterChange={setFilters} />
          <PlaygroundList
            playgrounds={filteredPlaygrounds}
            onSelectPlayground={setSelectedPlayground}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        </div>

        <div className="map-container">
          <MapContainer center={[47.75, 8.95]} zoom={9} className="leaflet-map">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap'
            />
            {filteredPlaygrounds.map(pg => (
              <Marker
                key={pg.id}
                position={[pg.latitude, pg.longitude]}
                icon={L.icon({
                  iconUrl: '/jambino-pin.svg',
                  iconSize: [28, 40],
                  iconAnchor: [14, 40],
                  popupAnchor: [0, -40],
                })}
                eventHandlers={{
                  click: () => setSelectedPlayground(pg),
                }}
              >
                <Popup>
                  <h3>{pg.name}</h3>
                  <p>{pg.city}</p>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <PlaygroundModal
        playground={selectedPlayground}
        onClose={() => setSelectedPlayground(null)}
      />
    </div>
  );
}
