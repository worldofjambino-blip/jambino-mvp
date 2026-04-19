import React, { useState, useMemo, useEffect } from 'react';
import { fetchSpielplaetze } from '../api/googleSheets';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './JambinoMVP.css';

const MOCK_PLAYGROUNDS = [
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

const FilterPanel = ({ filters, onFilterChange }) => {
  return (
    <div className="filter-panel">
      <h3 className="filter-title">🎪 Filter</h3>
      <div className="filter-section">
        <label className="section-title">📍 Altersgruppen</label>
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

const PlaygroundList = ({ playgrounds, onSelectPlayground }) => {
  return (
    <div className="list-container">
      <h3 className="list-title">📍 Spielplätze ({playgrounds.length})</h3>
      <div className="list">
        {playgrounds.map(pg => (
          <div
            key={pg.id}
            className="list-item"
            onClick={() => onSelectPlayground(pg)}
          >
            <img src={pg.coverImage || 'https://images.unsplash.com/photo-1552810309-ed75afc4a9ad?w=600'} alt={pg.name} className="list-item-image" />
            <div className="list-item-content">
              <h4 className="list-item-title">{pg.name}</h4>
              <p className="list-item-location">{pg.city}</p>
              <div className="list-item-rating">
                <span>{'⭐'.repeat(Math.floor(pg.rating || 4))}</span>
              </div>
            </div>
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
        <img src={playground.coverImage || 'https://images.unsplash.com/photo-1552810309-ed75afc4a9ad?w=600'} alt={playground.name} className="modal-image" />
        <div className="modal-body">
          <h2 className="modal-title">{playground.name}</h2>
          <p className="modal-description">{playground.description}</p>
          <p className="modal-location">📍 {playground.city}</p>
          <div className="modal-rating">⭐ {playground.rating} ({playground.reviews} Bewertungen)</div>
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

  useEffect(() => {
    fetchSpielplaetze()
      .then(data => {
        if (data && data.length > 0) setPlaygrounds(data);
      })
      .catch(() => {});
  }, []);

  const filteredPlaygrounds = useMemo(() => {
    return playgrounds.filter(pg => {
      const matchesSearch =
        pg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pg.city && pg.city.toLowerCase().includes(searchTerm.toLowerCase()));
      if (!matchesSearch) return false;
      if (filters.ageGroups.length > 0) {
        const hasMatchingAge = filters.ageGroups.some(age => pg.ageGroups && pg.ageGroups.includes(age));
        if (!hasMatchingAge) return false;
      }
      return true;
    });
  }, [filters, searchTerm, playgrounds]);

  return (
    <div className="jambino-app">
      <header className="app-header">
        <h1 className="app-title">🎪 Jambino</h1>
        <p className="app-subtitle">Spielplätze am Bodensee</p>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Spielplatz suchen..."
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
                  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41]
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
