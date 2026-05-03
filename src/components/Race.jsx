import { useEffect, useRef } from 'react';
import { useF1Season } from '../context/F1SeasonContext.jsx';

const Race = () => {
  const { seasonData, selectedYear, selectCircuit } = useF1Season();
  const countdownRefs = useRef({
    d: null,
    h: null,
    m: null,
    s: null,
  });

  useEffect(() => {
    const target = seasonData?.nextRace?.startTime ?? null;
    const pad = (n) => String(n).padStart(2, '0');

    function tick() {
      if (!target) {
        if (countdownRefs.current.d) countdownRefs.current.d.textContent = '00';
        if (countdownRefs.current.h) countdownRefs.current.h.textContent = '00';
        if (countdownRefs.current.m) countdownRefs.current.m.textContent = '00';
        if (countdownRefs.current.s) countdownRefs.current.s.textContent = '00';
        return;
      }

      const diff = target - Date.now();
      if (diff <= 0) {
        if (countdownRefs.current.d) countdownRefs.current.d.textContent = '00';
        if (countdownRefs.current.h) countdownRefs.current.h.textContent = '00';
        if (countdownRefs.current.m) countdownRefs.current.m.textContent = '00';
        if (countdownRefs.current.s) countdownRefs.current.s.textContent = '00';
        return;
      }

      if (countdownRefs.current.d) countdownRefs.current.d.textContent = pad(Math.floor(diff / 86400000));
      if (countdownRefs.current.h) countdownRefs.current.h.textContent = pad(Math.floor((diff % 86400000) / 3600000));
      if (countdownRefs.current.m) countdownRefs.current.m.textContent = pad(Math.floor((diff % 3600000) / 60000));
      if (countdownRefs.current.s) countdownRefs.current.s.textContent = pad(Math.floor((diff % 60000) / 1000));
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [seasonData]);

  const nextRace = seasonData?.nextRace || null;
  const countdownLabel = nextRace ? 'Lights Out In' : 'Season Complete';
  const raceRoundLabel = nextRace ? `◆ Round ${nextRace.round} · Up Next` : `◆ Season Complete · ${selectedYear}`;
  const raceFlag = nextRace?.flag || '🏁';
  const raceCircuit = nextRace?.circuitName || 'Season data';
  const raceLocation = nextRace?.locality || 'Jolpica / OpenF1';

  return (
    <section className="race-hero">
      <div className="race-block">
        <div className="race-grid">
          <div className="race-left">
            <div className="race-meta-row">
              <span className="race-round">{raceRoundLabel}</span>
              <span className="race-flag-big">{raceFlag}</span>
            </div>
            <h2 className="race-name">
              {nextRace?.raceName || 'Season'} <em>{nextRace ? 'Grand Prix' : 'Complete'}</em>
            </h2>
            <div className="race-circuit">
              {nextRace?.circuitId ? (
                <button
                  type="button"
                  onClick={() => selectCircuit(nextRace)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    padding: 0,
                    color: 'inherit',
                    font: 'inherit',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <strong>{raceCircuit}</strong> · {raceLocation}
                </button>
              ) : (
                <>
                  <strong>{raceCircuit}</strong> · {raceLocation}
                </>
              )}
            </div>
            <div className="race-circuit">
              {nextRace
                ? `Round ${nextRace.round} of ${seasonData?.totalRounds || '—'}`
                : `Selected season ${selectedYear}`}
            </div>

            <div className="race-stats">
              <div className="race-stat">
                <div className="race-stat-label">Lap Record</div>
                <div className="race-stat-val">1:29.708</div>
              </div>
              <div className="race-stat">
                <div className="race-stat-label">Pole 2025</div>
                <div className="race-stat-val">M. Verstappen</div>
              </div>
              <div className="race-stat">
                <div className="race-stat-label">Dates</div>
                <div className="race-stat-val">{nextRace?.date || 'May 1 – 3'}</div>
              </div>
            </div>
          </div>

          <div className="race-right">
            <div className="countdown-label">{countdownLabel}</div>
            <div className="countdown">
              <div className="cd-cell">
                <div className="cd-num" ref={(node) => { countdownRefs.current.d = node; }}>00</div>
                <div className="cd-label">Days</div>
              </div>
              <div className="cd-cell">
                <div className="cd-num" ref={(node) => { countdownRefs.current.h = node; }}>00</div>
                <div className="cd-label">Hours</div>
              </div>
              <div className="cd-cell">
                <div className="cd-num" ref={(node) => { countdownRefs.current.m = node; }}>00</div>
                <div className="cd-label">Mins</div>
              </div>
              <div className="cd-cell">
                <div className="cd-num" ref={(node) => { countdownRefs.current.s = node; }}>00</div>
                <div className="cd-label">Secs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Race;
