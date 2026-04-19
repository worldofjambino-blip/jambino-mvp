import React, { useState, useEffect } from 'react';
import JambinoMVP from './components/JambinoMVP';
import { fetchSpielplaetze,  } from './api/googleSheets.js';
import './App.css';

function App() {
  const [playgrounds, setPlaygrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPlaygrounds = async () => {
      try {
        setLoading(true);
        const data = await fetchSpielplaetze();
        setPlaygrounds(data);
        setError(null);
      } catch (err) {
        console.error('Fehler beim Laden:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPlaygrounds();

    const stopSync = (setPlaygrounds, 5);

    return stopSync;
  }, []);

  return (
    <div className="App">
      {loading && (
        <div className="loading-screen">
          <h1>🎪 Jambino wird geladen...</h1>
          <div className="spinner"></div>
        </div>
      )}

      {error && (
        <div className="error-screen">
          <h2>❌ Fehler beim Laden</h2>
          <p>{error}</p>
          <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: '#999' }}>
            Überprüfe:<br/>
            1. API Key in .env.local richtig?<br/>
            2. Google Sheets öffentlich freigegeben?<br/>
            3. Google Sheets API aktiviert?
          </p>
        </div>
      )}

      {!loading && !error && playgrounds.length > 0 && (
        <JambinoMVP initialPlaygrounds={playgrounds} />
      )}

      {!loading && !error && playgrounds.length === 0 && (
        <div className="empty-screen">
          <h2>📭 Keine Spielplätze gefunden</h2>
          <p>Überprüfe dein Google Sheet - sind dort Daten eingetragen?</p>
        </div>
      )}
    </div>
  );
}

export default App;