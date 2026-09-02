import React, { useState, useEffect } from 'react';
import { fetchSpielplaetze } from '../api/googleSheets';
import { MOCK_PLAYGROUNDS } from './JambinoMVP';
import bgMobile from '../assets/jambino-background.jpg';
import bgDesktop from '../assets/jambino-background-desktop.jpg';

const INITIAL_UPDATES = [
  {
    id: 1,
    playgroundId: 1,
    playgroundName: 'Ettenbergstrasse',
    playgroundOrt: 'Schaffhausen',
    author: 'Mama_Mia',
    time: 'Heute, 10:32',
    text: 'Der Spielplatz an der Ettenbergstrasse ist heute ziemlich voll 😅',
    tag: 'Voll',
    tagType: 'voll',
    likes: 12,
    comments: [
      { id: 11, author: 'Papa_Bear', text: 'Danke für die Info! Dann gehen wir später.' },
      { id: 12, author: 'Lena_M', text: 'Bei uns war es heute Morgen noch ruhig.' },
    ],
  },
  {
    id: 2,
    playgroundId: 2,
    playgroundName: 'Schulstrasse 5',
    playgroundOrt: 'Schaffhausen',
    author: 'Papa_Bear',
    time: 'Heute, 09:15',
    text: 'Die Schaukel wurde repariert! Danke an alle fleißigen Helfer 🙌',
    tag: 'Info',
    tagType: 'info',
    likes: 8,
    comments: [
      { id: 21, author: 'Mama_Mia', text: 'Super, endlich! 🎉' },
    ],
  },
];

const INITIAL_DATES = [
  {
    id: 101,
    playgroundId: 3,
    playgroundName: 'Rheinuferpark',
    playgroundOrt: 'Schaffhausen',
    author: 'Kita_Sonnenschein',
    time: 'Gestern, 16:45',
    text: 'Wir planen ein Spielfest nächsten Samstag um 15 Uhr. Wer kommt mit? 📍',
    tag: 'Treffen',
    tagType: 'treffen',
    likes: 15,
    comments: [
      { id: 111, author: 'Mama_Mia', text: 'Wir sind dabei! 🙌' },
      { id: 112, author: 'Papa_Bear', text: 'Klingt super, wir kommen auch.' },
    ],
  },
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
  .sk-post-head { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
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
  .sk-post-place { font-size: 0.8rem; color: var(--jambino-orange, #f97316); font-weight: 600; margin: 0 0 8px 0; }
  .sk-text { color: var(--text-dark, #222); margin: 0 0 10px 0; line-height: 1.4; }
  .sk-post-foot { display: flex; gap: 16px; align-items: center; }
  .sk-action {
    background: none; border: none; cursor: pointer;
    font-size: 0.9rem; color: var(--text-medium, #555);
    display: inline-flex; align-items: center; gap: 5px; padding: 0;
  }
  .sk-action.liked { color: var(--jambino-pink, #ec4899); }

  .sk-comments {
    margin-top: 10px;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    padding-top: 10px;
    display: flex; flex-direction: column; gap: 8px;
  }
  .sk-comment { display: flex; gap: 8px; align-items: flex-start; }
  .sk-comment-avatar {
    width: 26px; height: 26px; border-radius: 50%;
    background: var(--jambino-cream, #fff7ed);
    display: flex; align-items: center; justify-content: center; font-size: 0.8rem; flex: 0 0 auto;
  }
  .sk-comment-bubble {
    background: var(--jambino-cream, #fff7ed);
    border-radius: var(--radius-md, 12px);
    padding: 6px 10px; flex: 1 1 auto; min-width: 0;
  }
  .sk-comment-author { font-weight: 700; font-size: 0.82rem; color: var(--text-dark, #222); }
  .sk-comment-text { font-size: 0.88rem; color: var(--text-dark, #333); margin: 2px 0 0 0; }

  .sk-comment-form { display: flex; gap: 8px; margin-top: 4px; }
  .sk-comment-input {
    flex: 1 1 auto; min-width: 0;
    border: 2px solid var(--jambino-orange-soft, #fed7aa);
    border-radius: var(--radius-pill, 999px);
    padding: 8px 14px; font-size: 0.92rem; font-family: inherit; color: var(--text-dark, #222);
  }
  .sk-comment-input:focus { outline: none; border-color: var(--jambino-orange, #f97316); }
  .sk-comment-send {
    background: var(--jambino-orange, #f97316); color: #fff; border: none;
    border-radius: var(--radius-pill, 999px); padding: 8px 16px; font-weight: 700; cursor: pointer; flex: 0 0 auto;
  }
  .sk-comment-send:disabled { background: var(--jambino-orange-soft, #fed7aa); cursor: not-allowed; }

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
  .sk-select {
    width: 100%; box-sizing: border-box;
    border: 2px solid var(--jambino-orange-soft, #fed7aa); border-radius: var(--radius-md, 12px);
    padding: 10px 12px; font-size: 1rem; font-family: inherit; color: var(--text-dark, #222);
    background: #fff; margin-bottom: 8px; cursor: pointer;
  }
  .sk-select:focus { outline: none; border-color: var(--jambino-orange, #f97316); }
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

function CommentForm({ onSubmit }) {
  const [value, setValue] = useState('');
  const submit = () => {
    const text = value.trim();
    if (!text) return;
    onSubmit(text);
    setValue('');
  };
  return (
    <div className="sk-comment-form">
      <input
        className="sk-comment-input"
        placeholder="Kommentar schreiben…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
      />
      <button className="sk-comment-send" onClick={submit} disabled={!value.trim()}>
        Senden
      </button>
    </div>
  );
}

export default function SandkastenPage() {
  const [section, setSection] = useState('updates');
  const [updates, setUpdates] = useState(INITIAL_UPDATES);
  const [dates, setDates] = useState(INITIAL_DATES);
  const [likedIds, setLikedIds] = useState([]);
  const [openComments, setOpenComments] = useState([]);
  const [showComposer, setShowComposer] = useState(false);
  const [draft, setDraft] = useState('');
  const [draftPlaygroundId, setDraftPlaygroundId] = useState('');

  const [playgrounds, setPlaygrounds] = useState(MOCK_PLAYGROUNDS);

  useEffect(() => {
    fetchSpielplaetze()
      .then((data) => {
        if (data && data.length > 0) setPlaygrounds(data);
      })
      .catch(() => {});
  }, []);

  const posts = section === 'updates' ? updates : dates;
  const setPosts = section === 'updates' ? setUpdates : setDates;

  const toggleLike = (id) => {
    const liked = likedIds.includes(id);
    setLikedIds(liked ? likedIds.filter((x) => x !== id) : [...likedIds, id]);
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, likes: p.likes + (liked ? -1 : 1) } : p)));
  };

  const toggleComments = (id) => {
    setOpenComments((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const addComment = (postId, text) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: [...p.comments, { id: Date.now(), author: 'Du', text }] }
          : p
      )
    );
  };

  const addPost = () => {
    const text = draft.trim();
    if (!text || !draftPlaygroundId) return;
    const pg = playgrounds.find((p) => String(p.id) === String(draftPlaygroundId));
    const ort = pg ? (pg.city || pg.untergemeinde || '') : '';
    const newPost = {
      id: Date.now(),
      playgroundId: draftPlaygroundId,
      playgroundName: pg ? pg.name : 'Unbekannter Spielplatz',
      playgroundOrt: ort,
      author: 'Du',
      time: 'gerade eben',
      text,
      tag: section === 'dates' ? 'Treffen' : 'Neu',
      tagType: section === 'dates' ? 'treffen' : 'info',
      likes: 0,
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    setDraft('');
    setDraftPlaygroundId('');
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
              {p.playgroundName && (
                <div className="sk-post-place">
                  📍 {p.playgroundName}{p.playgroundOrt ? ', ' + p.playgroundOrt : ''}
                </div>
              )}
              <p className="sk-text">{p.text}</p>
              <div className="sk-post-foot">
                <button
                  className={`sk-action ${likedIds.includes(p.id) ? 'liked' : ''}`}
                  onClick={() => toggleLike(p.id)}
                >
                  {likedIds.includes(p.id) ? '❤️' : '🤍'} {p.likes}
                </button>
                <button className="sk-action" onClick={() => toggleComments(p.id)}>
                  💬 {p.comments.length}
                </button>
              </div>

              {openComments.includes(p.id) && (
                <div className="sk-comments">
                  {p.comments.map((c) => (
                    <div key={c.id} className="sk-comment">
                      <span className="sk-comment-avatar">🦊</span>
                      <div className="sk-comment-bubble">
                        <span className="sk-comment-author">{c.author}</span>
                        <p className="sk-comment-text">{c.text}</p>
                      </div>
                    </div>
                  ))}
                  <CommentForm onSubmit={(text) => addComment(p.id, text)} />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showComposer && (
        <div className="sk-composer">
          <select
            className="sk-select"
            value={draftPlaygroundId}
            onChange={(e) => setDraftPlaygroundId(e.target.value)}
          >
            <option value="">📍 Spielplatz wählen…</option>
            {playgrounds.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <textarea
            className="sk-textarea"
            placeholder={section === 'dates' ? 'Eine Verabredung vorschlagen…' : 'Was gibt es Neues?'}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
          />
          <div className="sk-composer-actions">
            <button className="sk-cancel" onClick={() => { setShowComposer(false); setDraft(''); setDraftPlaygroundId(''); }}>
              Abbrechen
            </button>
            <button className="sk-submit" onClick={addPost} disabled={!draft.trim() || !draftPlaygroundId}>
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