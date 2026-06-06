import React, { useState, useEffect, useRef } from 'react';

const CODES = {
  'TALKREAL2024': true, 'BETA-VIP': true, 'BETA-MARIE': true,
  'BETA-PAUL': true, 'BETA-SOFIA': true, 'BETA-AHMED': true,
  'BETA-LUCAS': true, 'BETA-SARAH': true, 'BETA-YANN': true, 'BETA-AISHA': true,
};

const LEVELS = [
  { id: 'zero', emoji: '🥚', label: 'Niveau Zéro', desc: 'Je ne connais aucun mot anglais', color: '#888', speed: 0.65 },
  { id: 'debutant', emoji: '🌱', label: 'Débutant', desc: 'Je connais quelques mots (hi, yes, no...)', color: '#4ECDC4', speed: 0.75 },
  { id: 'scolaire', emoji: '📚', label: 'Anglais Scolaire', desc: "J'ai appris à l'école mais pas l'accent US", color: '#45B7D1', speed: 0.82 },
  { id: 'intermediaire', emoji: '🚀', label: 'Intermédiaire', desc: "Je comprends mais je bloque à l'oral", color: '#6c5ce7', speed: 0.88 },
  { id: 'avance', emoji: '🎯', label: 'Avancé', desc: 'Je parle mais je veux sonner vraiment américain', color: '#e17055', speed: 0.95 },
];

const TOPICS = [
  { emoji: '👋', title: 'Salutations', prompt: 'Apprends-moi les salutations américaines avec exemples et exercices' },
  { emoji: '☕', title: 'Commander', prompt: 'Apprends-moi à commander dans un café américain' },
  { emoji: '🙋', title: 'Se présenter', prompt: 'Apprends-moi à me présenter en anglais américain' },
  { emoji: '🔥', title: 'Slang 2024', prompt: 'Apprends-moi le vrai slang américain de 2024' },
  { emoji: '😄', title: 'Émotions', prompt: 'Apprends-moi à exprimer mes émotions en américain' },
  { emoji: '🍽️', title: 'Restaurant', prompt: 'Apprends-moi les phrases pour un restaurant américain' },
  { emoji: '🗣️', title: 'Sons difficiles', prompt: 'Apprends-moi les sons américains difficiles pour les Français' },
  { emoji: '💼', title: 'Au travail', prompt: 'Apprends-moi l\'anglais professionnel américain' },
  { emoji: '🎬', title: 'Netflix & Séries', prompt: 'Apprends-moi les expressions des séries américaines' },
  { emoji: '✏️', title: 'Corriger mon écrit', prompt: 'Donne-moi une phrase à traduire en anglais pour commencer !' },
];

function playWelcome() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [440, 554, 659, 880].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = f; o.type = 'sine';
      g.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
      g.gain.linearRampToValueAtTime(0.18, ctx.currentTime + i * 0.15 + 0.06);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.35);
      o.start(ctx.currentTime + i * 0.15);
      o.stop(ctx.currentTime + i * 0.15 + 0.4);
    });
  } catch (e) {}
}

function speakText(text, speed) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const lines = text.split('\n');
  const engLine = lines.find(l => /^[a-zA-Z\s!?.,"'\-()+]+$/.test(l.trim()) && l.trim().length > 5) || lines[0];
  const clean = engLine.replace(/[*[\]]/g, '').trim();
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = 'en-US';
  u.rate = speed || 0.85;
  window.speechSynthesis.speak(u);
}

async function askSam(messages, user) {
  const key = process.env.REACT_APP_ANTHROPIC_KEY;
  const system = 'Tu es Prof Sam, professeur d\'anglais américain chaleureux et motivant. Tu parles a ' + user.name + ', ' + user.age + ' ans, niveau ' + user.level.label + '.\n\nREGLES:\n- Alterne anglais ET francais dans chaque reponse\n- Commence par une phrase en anglais, explique en francais\n- Utilise le prenom ' + user.name + ' souvent\n- Corrige les erreurs positivement\n- Donne la phonetique entre crochets\n- Une question ou exercice a la fin\n- Repenses courtes et percutantes (4-5 lignes max)\n- Si message en francais: traduis en anglais americain et explique\n- Si message en anglais: corrige si besoin et encourage\n- Niveau: ' + user.level.label;
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      system: system,
      messages: messages,
    }),
  });
  const data = await resp.json();
  return data.content && data.content[0] ? data.content[0].text : 'Oops! Try again!';
}

// ─── ACCESS ───────────────────────────────────────────────────────────────────
function AccessScreen({ onAccess }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (CODES[code.trim().toUpperCase()]) { onAccess(); }
    else { setError('Code invalide. Verifie ton invitation.'); setCode(''); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080810', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px', gap: '16px', textAlign: 'center' }}>
      <div style={{ fontSize: '72px' }}>🎙️</div>
      <h1 style={{ color: '#fff', fontSize: '44px', fontWeight: 900, letterSpacing: '-2px' }}>TalkReal</h1>
      <p style={{ color: '#FF6B6B', fontSize: '13px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' }}>avec Prof Sam</p>
      <p style={{ color: '#333', fontSize: '13px', lineHeight: 1.6 }}>Ton coach americain personnel.<br />Il te parle. Tu reponds. Tu progresses.</p>
      <div style={{ background: '#0f0f1e', borderRadius: '24px', padding: '28px 22px', width: '100%', maxWidth: '340px', border: '1px solid #1a1a30' }}>
        <div style={{ color: '#333', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>Code d'acces beta</div>
        <input
          value={code}
          onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Ex: TALKREAL2024"
          style={{ width: '100%', padding: '15px', fontSize: '18px', fontWeight: 800, borderRadius: '12px', border: error ? '2px solid #d63031' : '2px solid #1a1a30', background: '#080810', color: '#fff', outline: 'none', letterSpacing: '3px', textAlign: 'center', marginBottom: '8px', boxSizing: 'border-box' }}
        />
        {error && <div style={{ color: '#d63031', fontSize: '12px', marginBottom: '8px' }}>{error}</div>}
        <button
          onClick={submit}
          style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #FF6B6B, #fd79a8)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 800, cursor: 'pointer' }}
        >
          Entrer dans TalkReal →
        </button>
      </div>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [level, setLevel] = useState(null);

  const goLevel = () => {
    if (!name.trim() || !age || parseInt(age) < 10) return;
    setStep(1);
  };

  const pickLevel = lv => {
    setLevel(lv);
    setStep(2);
    setTimeout(() => playWelcome(), 300);
  };

  if (step === 0) return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px', gap: '14px' }}>
      <div style={{ fontSize: '52px' }}>👋</div>
      <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#111' }}>Bienvenue sur TalkReal !</h2>
      <p style={{ color: '#888', fontSize: '14px', textAlign: 'center' }}>2 infos et tu rencontres Prof Sam</p>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Ton prenom..." autoFocus
        style={{ width: '100%', maxWidth: '300px', padding: '15px 20px', fontSize: '18px', fontWeight: 700, borderRadius: '16px', border: '2px solid #eee', outline: 'none', textAlign: 'center', color: '#111' }} />
      <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Ton age..." min="10" max="99"
        style={{ width: '150px', padding: '15px 20px', fontSize: '18px', fontWeight: 700, borderRadius: '16px', border: '2px solid #eee', outline: 'none', textAlign: 'center', color: '#111' }} />
      <button onClick={goLevel} disabled={!name.trim() || !age || parseInt(age) < 10}
        style={{ background: name.trim() && age && parseInt(age) >= 10 ? 'linear-gradient(135deg, #FF6B6B, #fd79a8)' : '#eee', color: name.trim() && age && parseInt(age) >= 10 ? '#fff' : '#aaa', border: 'none', borderRadius: '16px', padding: '16px 32px', fontSize: '16px', fontWeight: 800, cursor: name.trim() && age && parseInt(age) >= 10 ? 'pointer' : 'not-allowed', width: '100%', maxWidth: '300px' }}>
        Continuer →
      </button>
    </div>
  );

  if (step === 1) return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', padding: '40px 20px 32px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ fontSize: '32px', fontWeight: 900, color: '#111' }}>Hey {name} !</div>
        <div style={{ color: '#888', fontSize: '14px', marginTop: '6px' }}>Ton niveau d'anglais actuel ?</div>
        <div style={{ color: '#bbb', fontSize: '12px', marginTop: '2px' }}>Sam adapte tout pour toi</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {LEVELS.map(lv => (
          <button key={lv.id} onClick={() => pickLevel(lv)}
            style={{ background: '#fff', border: '2px solid #eee', borderRadius: '20px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', textAlign: 'left', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: lv.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>{lv.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#111' }}>{lv.label}</div>
              <div style={{ color: '#aaa', fontSize: '12px', marginTop: '2px' }}>{lv.desc}</div>
            </div>
            <div style={{ color: '#ddd', fontSize: '18px' }}>→</div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #080810, #12122a)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px', gap: '20px', textAlign: 'center' }}>
      <div style={{ fontSize: '80px' }}>🎙️</div>
      <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '24px 28px', maxWidth: '320px' }}>
        <div style={{ color: '#FF6B6B', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>PROF SAM</div>
        <div style={{ color: '#fff', fontSize: '15px', lineHeight: 1.6, fontStyle: 'italic' }}>
          "Hey {name}! I'm Sam — your personal American English coach. I'm gonna teach you to speak like a real American. The REAL stuff. Ready? Let's go!"
        </div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '16px 20px', maxWidth: '300px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: '#555', fontSize: '12px' }}>Niveau</span>
          <span style={{ color: level ? level.color : '#fff', fontSize: '12px', fontWeight: 700 }}>{level ? level.emoji + ' ' + level.label : ''}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#555', fontSize: '12px' }}>Acces</span>
          <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>10 themes + chat illimite</span>
        </div>
      </div>
      <button onClick={() => onDone({ name, age: parseInt(age), level })}
        style={{ background: 'linear-gradient(135deg, #FF6B6B, #fd79a8)', color: '#fff', border: 'none', borderRadius: '16px', padding: '18px 40px', fontSize: '18px', fontWeight: 900, cursor: 'pointer', boxShadow: '0 8px 30px rgba(255,107,107,0.4)' }}>
        C'est parti avec Sam !
      </button>
    </div>
  );
}

// ─── CHAT ─────────────────────────────────────────────────────────────────────
function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('chat');
  const [listening, setListening] = useState(false);
  const bottomRef = useRef(null);
  const recRef = useRef(null);

  const welcome = 'Bienvenue ' + user.name + ' !\n\nJe suis Sam, ton coach americain. Je parle anglais ET francais.\n\nNiveau: ' + user.level.emoji + ' ' + user.level.label + '\n\nEcris-moi en francais ou en anglais — je corrige et j\'explique tout !\n\nPour commencer: essaie de dire "Bonjour" en americain !';

  useEffect(() => {
    setMessages([{ role: 'assistant', content: welcome, id: Date.now() }]);
  }, []);

  useEffect(() => {
    bottomRef.current && bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    if (!text || !text.trim() || loading) return;
    const userMsg = { role: 'user', content: text, id: Date.now() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);
    try {
      const history = newMsgs.map(m => ({ role: m.role, content: m.content }));
      const reply = await askSam(history, user);
      setMessages(prev => [...prev, { role: 'assistant', content: reply, id: Date.now() }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erreur de connexion. Reessaie !', id: Date.now() }]);
    }
    setLoading(false);
  };

  const toggleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Micro non disponible. Utilise Safari sur iPhone.'); return; }
    if (recRef.current) { recRef.current.stop(); recRef.current = null; setListening(false); return; }
    const r = new SR();
    r.lang = 'fr-FR'; r.continuous = false; r.interimResults = false;
    r.onstart = () => setListening(true);
    r.onresult = e => { const said = e.results[0][0].transcript; recRef.current = null; setListening(false); send(said); };
    r.onerror = r.onend = () => { recRef.current = null; setListening(false); };
    recRef.current = r;
    r.start();
  };

  const QUICK = ['👍 Good!', 'Je comprends pas', 'Encore une fois', 'Donne un exemple', 'Suite'];
  const SUGGS = ['Bonjour en americain ?', 'Comment commander un cafe ?', 'Corrige : I goes to school', 'Apprends-moi le slang US', 'Comment dire merci ?'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f7f7fa' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #080810, #12122a)', padding: '16px 20px 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B6B, #fd79a8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', boxShadow: '0 4px 12px rgba(255,107,107,0.4)' }}>🎙️</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '16px' }}>Prof Sam</div>
            <div style={{ color: '#FF6B6B', fontSize: '11px' }}>En ligne · Coach personnel</div>
          </div>
          <div style={{ background: user.level.color + '25', border: '1px solid ' + user.level.color + '40', borderRadius: '10px', padding: '4px 10px', fontSize: '11px', color: user.level.color, fontWeight: 700 }}>
            {user.level.emoji} {user.level.label}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[['chat', '💬 Parler avec Sam'], ['lessons', '📚 Leçons rapides']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ flex: 1, padding: '8px', background: tab === key ? 'rgba(255,107,107,0.2)' : 'transparent', color: tab === key ? '#FF6B6B' : '#444', border: tab === key ? '1px solid rgba(255,107,107,0.3)' : '1px solid transparent', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      {tab === 'chat' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: '4px' }}>
              {msg.role === 'assistant' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B6B, #fd79a8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>🎙️</div>
                  <span style={{ fontSize: '11px', color: '#FF6B6B', fontWeight: 700 }}>Prof Sam</span>
                </div>
              )}
              <div style={{ maxWidth: '85%', background: msg.role === 'user' ? 'linear-gradient(135deg, #FF6B6B, #fd79a8)' : '#fff', color: msg.role === 'user' ? '#fff' : '#111', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', padding: '13px 16px', fontSize: '14px', lineHeight: 1.6, boxShadow: msg.role === 'user' ? '0 4px 12px rgba(255,107,107,0.3)' : '0 2px 8px rgba(0,0,0,0.06)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {msg.content}
              </div>
              {msg.role === 'assistant' && (
                <button onClick={() => speakText(msg.content, user.level.speed)} style={{ background: 'none', border: 'none', color: '#ccc', fontSize: '12px', cursor: 'pointer', padding: '2px 6px' }}>
                  🔊 Ecouter Sam
                </button>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B6B, #fd79a8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>🎙️</div>
              <div style={{ background: '#fff', borderRadius: '18px 18px 18px 4px', padding: '14px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#FF6B6B', animation: 'pulse 1s infinite', margin: '0 2px' }}>.</span>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#FF6B6B', animation: 'pulse 1s 0.2s infinite', margin: '0 2px' }}>.</span>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#FF6B6B', animation: 'pulse 1s 0.4s infinite', margin: '0 2px' }}>.</span>
              </div>
            </div>
          )}
          {messages.length <= 1 && !loading && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {SUGGS.map(s => (
                <button key={s} onClick={() => send(s)} style={{ background: '#fff', border: '1.5px solid #eee', borderRadius: '20px', padding: '8px 14px', fontSize: '12px', color: '#555', cursor: 'pointer', fontWeight: 600, boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>{s}</button>
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Lessons */}
      {tab === 'lessons' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          <div style={{ background: 'linear-gradient(135deg, #080810, #12122a)', borderRadius: '20px', padding: '16px 18px', marginBottom: '16px', display: 'flex', gap: '10px' }}>
            <div style={{ fontSize: '28px' }}>🎙️</div>
            <div>
              <div style={{ color: '#FF6B6B', fontSize: '11px', fontWeight: 700, marginBottom: '3px' }}>PROF SAM</div>
              <div style={{ color: '#888', fontSize: '13px', fontStyle: 'italic' }}>"Hey {user.name}! Choisis un theme et je t'enseigne tout !"</div>
            </div>
          </div>
          <div style={{ fontWeight: 800, fontSize: '16px', color: '#111', marginBottom: '12px' }}>10 themes avec Sam</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {TOPICS.map((t, i) => (
              <button key={i} onClick={() => { setTab('chat'); setTimeout(() => send(t.prompt), 100); }}
                style={{ background: '#fff', border: '2px solid #eee', borderRadius: '18px', padding: '16px 14px', textAlign: 'center', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '30px', marginBottom: '6px' }}>{t.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#111' }}>{t.title}</div>
                <div style={{ fontSize: '10px', color: '#FF6B6B', fontWeight: 600, marginTop: '4px' }}>Demander a Sam</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '12px 16px 20px', background: '#fff', borderTop: '1px solid #f0f0f0', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', overflowX: 'auto' }}>
          {QUICK.map(q => (
            <button key={q} onClick={() => send(q)} style={{ background: '#f5f5f5', border: 'none', borderRadius: '16px', padding: '6px 12px', fontSize: '12px', color: '#666', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>{q}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={toggleMic} style={{ width: '46px', height: '46px', borderRadius: '50%', background: listening ? 'linear-gradient(135deg, #FF6B6B, #fd79a8)' : '#f5f5f5', border: 'none', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            {listening ? '🔴' : '🎤'}
          </button>
          <div style={{ flex: 1, background: '#f5f5f5', borderRadius: '22px', padding: '10px 16px', display: 'flex', alignItems: 'center' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
              placeholder="Ecris a Sam en francais ou anglais..."
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: '14px', color: '#111', fontFamily: 'inherit' }}
            />
          </div>
          <button onClick={() => send(input)} disabled={!input.trim() || loading}
            style={{ width: '46px', height: '46px', borderRadius: '50%', background: input.trim() && !loading ? 'linear-gradient(135deg, #FF6B6B, #fd79a8)' : '#eee', border: 'none', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', flexShrink: 0 }}>
            ➤
          </button>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1.2)}}`}</style>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('access');
  const [user, setUser] = useState(null);

  if (screen === 'access') return <AccessScreen onAccess={() => setScreen('onboard')} />;
  if (screen === 'onboard') return <Onboarding onDone={u => { setUser(u); setScreen('chat'); }} />;
  if (screen === 'chat' && user) return <Chat user={user} />;
  return null;
}
