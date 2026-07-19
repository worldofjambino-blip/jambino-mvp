import React, { useState } from 'react';
import './ProfilePage.css';
import fuchsMama from '../assets/Jambino_Fuchsmama.png';
import fuchsPapa from '../assets/Jambino_Fuchspapa.png';
import fuchsJunge from '../assets/Jambino_Fuchsjunge.png';
import fuchsMaedchen from '../assets/Jambino_Fuchsmaedchen.png';

const EMPTY_PROFILE = { adults: [], children: [] };
const STORAGE_KEY = 'jambino_profile';

function normalizePerson(p) {
  return {
    id: p.id != null ? p.id : Date.now() + Math.floor(Math.random() * 100000),
    name: p.name || '',
    age: p.age != null ? String(p.age) : '',
    gender: p.gender === 'maennlich' ? 'maennlich' : 'weiblich',
    active: p.active !== false,
  };
}

function migrateProfile(raw) {
  if (!raw || typeof raw !== 'object') return EMPTY_PROFILE;
  if (Array.isArray(raw.adults)) {
    return {
      adults: raw.adults.map(normalizePerson),
      children: Array.isArray(raw.children) ? raw.children.map(normalizePerson) : [],
    };
  }
  const adults = raw.parentName
    ? [normalizePerson({ name: raw.parentName, gender: 'weiblich', active: true })]
    : [];
  const children = Array.isArray(raw.children)
    ? raw.children.map((c) => normalizePerson({ ...c, active: true }))
    : [];
  return { adults, children };
}

function avatarFor(person, kind) {
  if (kind === 'adult') {
    return person.gender === 'maennlich' ? fuchsPapa : fuchsMama;
  }
  return person.gender === 'maennlich' ? fuchsJunge :
cat > src/components/ProfilePage.jsx << 'EOF'
import React, { useState } from 'react';
import './ProfilePage.css';
import fuchsMama from '../assets/Jambino_Fuchsmama.png';
import fuchsPapa from '../assets/Jambino_Fuchspapa.png';
import fuchsJunge from '../assets/Jambino_Fuchsjunge.png';
import fuchsMaedchen from '../assets/Jambino_Fuchsmaedchen.png';

const EMPTY_PROFILE = { adults: [], children: [] };
const STORAGE_KEY = 'jambino_profile';

function normalizePerson(p) {
  return {
    id: p.id != null ? p.id : Date.now() + Math.floor(Math.random() * 100000),
    name: p.name || '',
    age: p.age != null ? String(p.age) : '',
    gender: p.gender === 'maennlich' ? 'maennlich' : p.gender === 'divers' ? 'divers' : 'weiblich',
    active: p.active !== false,
  };
}

function migrateProfile(raw) {
  if (!raw || typeof raw !== 'object') return EMPTY_PROFILE;
  if (Array.isArray(raw.adults)) {
    return {
      adults: raw.adults.map(normalizePerson),
      children: Array.isArray(raw.children) ? raw.children.map(normalizePerson) : [],
    };
  }
  const adults = raw.parentName
    ? [normalizePerson({ name: raw.parentName, gender: 'weiblich', active: true })]
    : [];
  const children = Array.isArray(raw.children)
    ? raw.children.map((c) => normalizePerson({ ...c, active: true }))
    : [];
  return { adults, children };
}

function avatarSrc(person, kind) {
  if (person.gender === 'divers') return null;
  if (kind === 'adult') {
    return person.gender === 'maennlich' ? fuchsPapa : fuchsMama;
  }
  return person.gender === 'maennlich' ? fuchsJunge : fuchsMaedchen;
}

function genderSymbol(gender) {
  if (gender === 'maennlich') return '\u2642';
  if (gender === 'divers') return '\u26A7';
  return '\u2640';
}
function genderLabel(gender) {
  if (gender === 'maennlich') return 'Männlich';
  if (gender === 'divers') return 'Divers';
  return 'Weiblich';
}
function adultRole(gender) {
  if (gender === 'maennlich') return 'Papa';
  if (gender === 'divers') return 'Elternteil';
  return 'Mama';
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? migrateProfile(JSON.parse(saved)) : EMPTY_PROFILE;
    } catch (err) {
      console.error('Fehler beim Laden des Profils:', err);
      return EMPTY_PROFILE;
    }
  });

  const [savedMessage, setSavedMessage] = useState(false);

  const [newAdultName, setNewAdultName] = useState('');
  const [newAdultAge, setNewAdultAge] = useState('');
  const [newAdultGender, setNewAdultGender] = useState('weiblich');

  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState('');
  const [newChildGender, setNewChildGender] = useState('weiblich');

  const persist = (updated) => {
    setProfile(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2000);
    } catch (err) {
      console.error('Fehler beim Speichern des Profils:', err);
    }
  };

  const addAdult = () => {
    const name = newAdultName.trim();
    if (!name) return;
    const adult = normalizePerson({ name, age: newAdultAge.trim(), gender: newAdultGender, active: true });
    persist({ ...profile, adults: [...profile.adults, adult] });
    setNewAdultName('');
    setNewAdultAge('');
    setNewAdultGender('weiblich');
  };

  const addChild = () => {
    const name = newChildName.trim();
    if (!name) return;
    const child = normalizePerson({ name, age: newChildAge.trim(), gender: newChildGender, active: true });
    persist({ ...profile, children: [...profile.children, child] });
    setNewChildName('');
    setNewChildAge('');
    setNewChildGender('weiblich');
  };

  const removePerson = (kind, id) => {
    if (kind === 'adult') {
      persist({ ...profile, adults: profile.adults.filter((a) => a.id !== id) });
    } else {
      persist({ ...profile, children: profile.children.filter((c) => c.id !== id) });
    }
  };

  const toggleActive = (kind, id) => {
    const key = kind === 'adult' ? 'adults' : 'children';
    persist({
      ...profile,
      [key]: profile[key].map((p) => (p.id === id ? { ...p, active: !p.active } : p)),
    });
  };

  const activeAdults = profile.adults.filter((a) => a.active);
  const activeChildren = profile.children.filter((c) => c.active);
  const hasActive = activeAdults.length > 0 || activeChildren.length > 0;

  const renderAvatar = (person, kind, cls) => {
    const src = avatarSrc(person, kind);
    if (src) return <img className={cls} src={src} alt="" />;
    return (
      <span className={cls + ' avatar-placeholder ' + person.gender} aria-hidden="true">
        {genderSymbol(person.gender)}
      </span>
    );
  };

  const renderCard = (person, kind) => (
    <div key={person.id} className="person-card">
      {renderAvatar(person, kind, 'person-avatar')}
      <span className="person-name">{person.name}</span>
      <span className="person-age">{person.age ? person.age + ' Jahre' : '\u2014'}</span>
      <span className={'person-gender ' + person.gender}>
        <span className="gender-symbol">{genderSymbol(person.gender)}</span>
        <span className="gender-word">{genderLabel(person.gender)}</span>
      </span>
      <label className="person-check">
        <input type="checkbox" checked={person.active} onChange={() => toggleActive(kind, person.id)} />
      </label>
      <button type="button" className="person-remove" aria-label="Entfernen" onClick={() => removePerson(kind, person.id)}>
        {'\u2715'}
      </button>
    </div>
  );

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>🦊 Mein Profil</h1>
      </div>

      {savedMessage && <div className="save-toast">✅ Gespeichert!</div>}

      <div className="profile-section">
        <h2>👤 Über mich</h2>
        <div className="person-form">
          <div className="field field-name">
            <label className="profile-label">Mein Name</label>
            <input type="text" className="profile-input" placeholder="z.B. Steffy" value={newAdultName} onChange={(e) => setNewAdultName(e.target.value)} />
          </div>
          <div className="field field-age">
            <label className="profile-label">Alter</label>
            <input type="number" className="profile-input" placeholder="Alter" min="0" max="120" value={newAdultAge} onChange={(e) => setNewAdultAge(e.target.value)} />
          </div>
          <div className="field field-gender">
            <label className="profile-label">Geschlecht</label>
            <select className="profile-select" value={newAdultGender} onChange={(e) => setNewAdultGender(e.target.value)}>
              <option value="weiblich">{'\u2640 Weiblich'}</option>
              <option value="maennlich">{'\u2642 Männlich'}</option>
              <option value="divers">{'\u26A7 Divers'}</option>
            </select>
          </div>
          <button type="button" className="profile-button" onClick={addAdult} disabled={!newAdultName.trim()}>+ Hinzufügen</button>
        </div>

        {profile.adults.length > 0 && (
          <div className="person-list">
            {profile.adults.map((a) => renderCard(a, 'adult'))}
          </div>
        )}
      </div>

      <div className="profile-section">
        <h2>🧒 Meine Kinder</h2>
        <div className="person-form">
          <div className="field field-name">
            <label className="profile-label">Name des Kindes</label>
            <input type="text" className="profile-input" placeholder="Name des Kindes" value={newChildName} onChange={(e) => setNewChildName(e.target.value)} />
          </div>
          <div className="field field-age">
            <label className="profile-label">Alter</label>
            <input type="number" className="profile-input" placeholder="Alter" min="0" max="18" value={newChildAge} onChange={(e) => setNewChildAge(e.target.value)} />
          </div>
          <div className="field field-gender">
            <label className="profile-label">Geschlecht</label>
            <select className="profile-select" value={newChildGender} onChange={(e) => setNewChildGender(e.target.value)}>
              <option value="weiblich">{'\u2640 Weiblich'}</option>
              <option value="maennlich">{'\u2642 Männlich'}</option>
              <option value="divers">{'\u26A7 Divers'}</option>
            </select>
          </div>
          <button type="button" className="profile-button" onClick={addChild} disabled={!newChildName.trim()}>+ Hinzufügen</button>
        </div>

        {profile.children.length === 0 ? (
          <p className="empty-hint">Noch keine Kinder hinzugefügt. Trag sie oben ein!</p>
        ) : (
          <div className="person-list">
            {profile.children.map((c) => renderCard(c, 'child'))}
          </div>
        )}
      </div>

      <div className="profile-section profile-summary">
        <h2>❤️ Mein Profil</h2>
        <p className="summary-hint">Wer ist heute dabei? (oben anhaken)</p>
        {!hasActive ? (
          <p className="empty-hint">Hake oben an, wer heute mitkommt — dann erscheint eure Auswahl hier.</p>
        ) : (
          <>
            {activeAdults.map((a) => (
              <div key={a.id} className={'summary-row ' + a.gender}>
                {renderAvatar(a, 'adult', 'summary-avatar')}
                <div className="summary-info">
                  <span className="summary-name">{a.name}</span>
                  <span className="summary-sub">{adultRole(a.gender)}</span>
                </div>
              </div>
            ))}
            {activeChildren.length > 0 && <div className="summary-divider">Meine Kinder</div>}
            {activeChildren.map((c) => (
              <div key={c.id} className={'summary-row ' + c.gender}>
                {renderAvatar(c, 'child', 'summary-avatar')}
                <div className="summary-info">
                  <span className="summary-name">{c.name}</span>
                  <span className="summary-sub">{c.age ? c.age + ' Jahre' : ''}</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
