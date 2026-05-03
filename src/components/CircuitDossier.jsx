import { useF1Season } from '../context/F1SeasonContext.jsx';

const CircuitDossier = () => {
  const { selectedCircuit, selectedCircuitDossier, closeCircuitDossier } = useF1Season();
  const dossier = selectedCircuitDossier?.data;
  const status = selectedCircuitDossier?.status || 'idle';

  if (!selectedCircuit) {
    return null;
  }

  const circuitName = dossier?.circuitName || selectedCircuit.circuitName || 'DATA UNAVAILABLE';
  const locality = dossier?.locality || selectedCircuit.locality || 'DATA UNAVAILABLE';
  const country = dossier?.country || selectedCircuit.country || 'DATA UNAVAILABLE';
  const totalGrandsPrix = status === 'ready' ? String(dossier?.totalGrandsPrix ?? 0) : '---';
  const firstAppearance = status === 'ready' ? dossier?.firstAppearance || 'DATA UNAVAILABLE' : '---';
  const latestAppearance = status === 'ready' ? dossier?.latestAppearance || 'DATA UNAVAILABLE' : '---';
  const lastWinner = status === 'ready' ? dossier?.lastWinner || 'DATA UNAVAILABLE' : '---';
  const bioText =
    status === 'ready'
      ? dossier?.bio || 'DATA UNAVAILABLE'
      : status === 'loading'
        ? 'Loading circuit dossier...'
        : 'DATA UNAVAILABLE';
  const bioParagraphs = bioText
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  return (
    <div className="news-block" style={{ padding: '18px 24px 22px' }}>
      <div
        className="brand-eyebrow"
        style={{
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: '18px',
          background: 'transparent',
          padding: 0,
        }}
      >
        <span>◆ Circuit dossier</span>
        <button
          type="button"
          onClick={closeCircuitDossier}
          style={{
            border: 'none',
            background: 'transparent',
            color: 'inherit',
            padding: 0,
            cursor: 'pointer',
            font: 'inherit',
          }}
        >
          ✕ CLOSE CIRCUIT
        </button>
      </div>

      <header style={{ marginBottom: '18px' }}>
        <div className="hero-sub" style={{ paddingTop: 0, borderTop: 'none', marginBottom: '12px' }}>
          <span>{selectedCircuit.circuitId?.toUpperCase() || '---'}</span>
          <span>
            {locality} · {country}
          </span>
        </div>
        <h3
          style={{
            margin: 0,
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(30px, 4vw, 44px)',
            lineHeight: 0.96,
            fontWeight: 700,
            color: 'var(--ink)',
          }}
        >
          {circuitName}
        </h3>
        <div
          style={{
            marginTop: '10px',
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
            lineHeight: 1.45,
            color: 'var(--ink-2)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {selectedCircuit.raceName || 'Circuit profile'}
        </div>
      </header>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '10px',
          marginBottom: '18px',
        }}
      >
        {[
          ['Total GPs', totalGrandsPrix],
          ['First GP', firstAppearance],
          ['Latest GP', latestAppearance],
          ['Last Winner', lastWinner],
        ].map(([label, value]) => (
          <div
            key={label}
            style={{
              border: '1px solid var(--rule-light)',
              background: 'rgba(255,255,255,0.18)',
              padding: '14px 12px 12px',
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--ink-3)',
                marginBottom: '10px',
              }}
            >
              {label}
            </div>
            <div className="race-stat-val" style={{ color: 'var(--ink)', fontSize: '28px', lineHeight: 0.92 }}>
              {value}
            </div>
          </div>
        ))}
      </section>

      <section style={{ borderTop: '1px solid var(--rule-light)', paddingTop: '14px' }}>
        <div
          className="brand-eyebrow"
          style={{
            marginBottom: '12px',
            padding: 0,
            background: 'transparent',
          }}
        >
          <span>◆ Wikipedia history</span>
        </div>
        <div
          style={{
            margin: 0,
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            lineHeight: 1.65,
            color: 'var(--ink-2)',
          }}
        >
          {bioParagraphs.length ? (
            bioParagraphs.map((paragraph, index) => (
              <div
                key={`${index}-${paragraph.slice(0, 20)}`}
                style={{
                  margin: index === 0 ? 0 : '10px 0 0',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px',
                  lineHeight: 1.65,
                  color: 'var(--ink-2)',
                }}
              >
                {paragraph}
              </div>
            ))
          ) : (
            <div>{bioText}</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CircuitDossier;
