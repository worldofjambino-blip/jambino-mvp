import React, { useState } from 'react';
import bgMobile from '../assets/jambino-background.jpg';
import bgDesktop from '../assets/jambino-background-desktop.jpg';

const INITIAL_UPDATES = [
  { id: 1, author: 'Mama_Mia', time: 'Heute, 10:32', text: 'Der Spielplatz an der Ettenbergstrasse ist heute ziemlich voll 😅', tag: 'Voll', tagType: 'voll', likes: 12, comments: 3 },
  { id: 2, author: 'Papa_Bear', time: 'Heute, 09:15', text: 'Die Schaukel wurde repariert! Danke an alle fleißigen Helfer 🙌', tag: 'Info', tagType: 'info', likes: 8, comments: 2 },
];

const INITIAL_DATES = [
  { id: 101, author: 'Kita_Sonnenschein', time: 'Gestern, 16:45', text: 'Wir planen ein Spielfest nächsten Samstag um 15 Uhr im Stadtpark. Wer kommt mit? 📍', tag: 'Treffen', tagType: 'treffen', likes: 15, comments: 7 },
];

const SK_STYLES = `
  .sandkasten-page {
    min-height: 100vh;
    padding: 16px;
    padding-bottom: 120px;
    background-image: url(${bgMobile});
    background-size: cover;
    background-position: center bottom;
    background-repeat: no-repeat;
  }
  @media (min-width: 769px) {
    .sandkasten-page {
      background-image: url(${bgDesktop});
      background-position: center;
      background-attachment: fixed;
    }
  }
  .sk-hero { display: flex; align-items: center; gap: 12px; max-width: 600px; margin: 0 auto 16px auto; }
  .sk-hero-logo { width: 56px; height: 56px; object-fit: contain; }
  .sk-hero-title { color: var(--jambino-orange, #f97316); font-size: 1.5rem; margin: 0; }
  .sk-hero-subtitle { color: var(--text-medium, #555); font-size: 0.9rem; margin: 2px 0 0 0; }

  .sk-tabs { max-width: 600px; margin: 0 auto 12px auto; display: flex; gap: 8px; }
  .sk-tab {
    flex: 1; padding: 10px 12px; border: none; cursor: pointer;
    border-radius: var(--radius-pill, 999px);
    background: rgba(255, 255, 255, 0.7); color: var(--text-medium, #555);
    font-weight: 700; font-size: 0.9rem;
  }
  .sk-tab.active { background: var(--jambino-orange, #f97316); color: #fff; box-shadow: var(--shadow-soft, 0 2px 8px rgba(0,0,0,0.1)); }

  .sk-list { max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }

  .sk-post {
    background: rgba(255, 255, 255, 0.94);
    border-radius: var(--radius-lg, 16px);
    padding: 14px 16px;
    box-shadow: var(--shadow-soft, 0 2px 8px rgba(0,0,0,0.1));
  }
  .sk-post-head { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .sk-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: var(--jambino-cream, #fff7ed);
    display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex: 0 0 auto;
  }
  .sk-meta { display: flex; flex-direction: column; flex: 1 1 auto; min-width: 0; }
  .sk-author { font-weight: 700; color: var(--text-dark, #222); }
  .sk-time { font-size: 0.8rem; color: var(--text-medium, #777); }
  .sk-tag { font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: var(--radius-pill, 999px); flex: 0 0 auto; }
  .sk-tag.voll { background: #fee2e2; color: #b91c1c; }
  .sk-tag.info { background: #dbeafe; color: #1d4ed8; }
  .sk-tag.treffen { background: #ede9fe; color: #6d28d9; }
  .sk-text { color: var(--text-dark, #222); margin: 0 0 10px 0; line-height: 1.4; }
  .sk-post-foot { display: flex; gap: 16px; align-items: center; }
  .sk-action {
    background: none; border: none; cursor: pointer;
    font-size: 0.9rem; color: var(--text-medium, #555);
    display: inline-flex; align-items: center; gap: 5px; padding: 0;
  }
  .sk-action.liked { color: var(--jambino-pink, #ec4899); }

  .sk-empty {
    max-width: 600px; margin: 0 auto; text-align: center;
    background: rgba(255, 255, 255, 0.92); border-radius: var(--radius-lg, 16px);
    padding: 28px 20px; color: var(--text-medium, #555);
  }

  .sk-composer {
    max-width: 600px; margin: 12px auto 0 auto;
    background: rgba(255, 255, 255, 0.96); border-radius: var(--radius-lg, 16px);
    padding: 12px; box-shadow: var(--shadow-soft, 0 2px 8px rgba(0,0,0,0.1));
  }
  .sk-textarea {
    width: 100%; box-sizing: border-box; resize: vertical;
    border: 2px solid var(--jambino-orange-soft, #fed7aa); border-radius: var(--radius-md, 12px);
    padding: 10px 12px; font-size: 1rem; font-family: inherit; color: var(--text-dark, #222);
  }
  .sk-textarea:focus { outline: none; border-color: var(--jambino-orange, #f97316); }
  .sk-composer-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
  .sk-cancel {
    background: transparent; border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: var(--radius-pill, 999px); padding: 8px 14px; cursor: pointer; color: var(--text-medium, #555);
  }
  .sk-submit {
    background: var(--jambino-orange, #f97316); color: #fff; border: none;
    border-radius: var(--radius-pill, 999px); padding: 8px 18px; font-weight: 700; cursor: pointer;
  }
  .sk-submit:disabled { background: var(--jambino-orange-soft, #fed7aa); cursor: not-allowed; }

  .sk-compose-btn {
    display: block; max-width: 600px; width: 100%; margin: 14px auto 0 auto;
    background: var(--jambino-orange, #f97316); color: #fff; border: none;
    border-radius: var(--radius-pill, 999px); padding: 12px; font-weight: 700; font-size: 1rem; cursor: pointer;
    box-shadow: var(--shadow-soft, 0 2px 8px rgba(0,0,0,0.1));
  }
  .sk-compose-btn:hover { transform: translateY(-1px); }
`;

export default function SandkastenPage() {
  const [section, setSection] = useState('updates');
  const [updates, setUpdates] = useState(INITIAL_UPDATES);
  const [dates, setDates] = useState(INITIAL_DATES);
  const [likedIds, setLikedIds] = useState([]);
  const [showComposer, setShowComposer] = useState(false);
  const [draft, setDraft] = useState('');

  const posts = section === 'updates' ? updates : dates;
  const setPosts = section === 'updates' ? setUpdates : setDates;

  const toggleLike = (id) => {
    const liked = likedIds.includes(id);
    setLikedIds(liked ? likedIds.filter((x) => x !== id) : [...likedIds, id]);
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, likes: p.likes + (liked ? -1 : 1) } : p)));
  };

  const addPost = () => {
    const text = draft.trim();
    if (!text) return;
    const newPost = {
      id: Date.now(),
      author: 'Du',
      time: 'gerade eben',
      text,
      tag: section === 'dates' ? 'Treffen' : 'Neu',
      tagType: section === 'dates' ? 'treffen' : 'info',
      likes: 0,
      comments: 0,
    };
    setPosts((prev) => [newPost, ...prev]);
    setDraft('');
    setShowComposer(false);
  };

  return (
    <div className="sandkasten-page">
      <style>{SK_STYLES}</style>

      <div className="sk-hero">
        <img src="/jambino-logo.png" alt="Jambino Fuchs" className="sk-hero-logo" />
        <div>
          <h1 className="sk-hero-title">Sandkasten</h1>
          <p className="sk-hero-subtitle">Neuigkeiten & Verabredungen von anderen Eltern</p>
        </div>
      </div>

      <div className="sk-tabs">
        <button className={`sk-tab ${section === 'updates' ? 'active' : ''}`} onClick={() => setSection('updates')}>
          Updates
        </button>
        <button className={`sk-tab ${section === 'dates' ? 'active' : ''}`} onClick={() => setSection('dates')}>
          Verabredungen
        </button>
      </div>

      <div className="sk-list">
        {posts.length === 0 ? (
          <div className="sk-empty">Noch keine Beiträge hier. Mach den Anfang!</div>
        ) : (
          posts.map((p) => (
            <div key={p.id} className="sk-post">
              <div className="sk-post-head">
                <span className="sk-avatar">🦊</span>
                <div className="sk-meta">
                  <span className="sk-author">{p.author}</span>
                  <span className="sk-time">{p.time}</span>
                </div>
                {p.tag && <span className={`sk-tag ${p.tagType}`}>{p.tag}</span>}
              </div>
              <p className="sk-text">{p.text}</p>
              <div className="sk-post-foot">
                <button
                  className={`sk-action ${likedIds.includes(p.id) ? 'liked' : ''}`}
                  onClick={() => toggleLike(p.id)}
                >
                  {likedIds.includes(p.id) ? '❤️' : '🤍'} {p.likes}
                </button>
                <span className="sk-action">💬 {p.comments}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {showComposer && (
        <div className="sk-composer">
          <textarea
            className="sk-textarea"
            placeholder={section === 'dates' ? 'Eine Verabredung vorschlagen…' : 'Was gibt es Neues?'}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
          />
          <div className="sk-composer-actions">
            <button className="sk-cancel" onClick={() => { setShowComposer(false); setDraft(''); }}>
              Abbrechen
            </button>
            <button className="sk-submit" onClick={addPost} disabled={!draft.trim()}>
              Posten
            </button>
          </div>
        </div>
      )}

      <button className="sk-compose-btn" onClick={() => setShowComposer((s) => !s)}>
        + Neuer Beitrag
      </button>
    </div>
  );
}