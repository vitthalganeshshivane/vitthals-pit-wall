import { useEffect, useRef } from 'react';
import { useF1Season } from '../context/F1SeasonContext.jsx';

const Calendar = () => {
  const { seasonData, selectedYear, openRaceDetails, raceDrawer, selectCircuit } = useF1Season();
  const calStripRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = document.querySelector('.cal-round.next');
      if (next && calStripRef.current) {
        const strip = calStripRef.current;
        strip.scrollTo({ left: next.offsetLeft - 60, behavior: 'smooth' });
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [seasonData]);

  const races = seasonData?.races || [];
  const roundsLabel = `${seasonData?.totalRounds || races.length || 0} Rounds`;

  return (
    <section className="cal-section">
      <div className="cal-head">
        <div className="cal-title">
          Season <em>Calendar</em>
        </div>
        <div className="cal-meta">
          {roundsLabel} · {selectedYear}
        </div>
      </div>

      <div className="cal-strip-wrap">
        <div className="cal-progress-track">
          <div className="cal-progress-fill" style={{ width: '13.6%' }}></div>
        </div>
        <div className="cal-strip" id="calStrip" ref={calStripRef}>
          {races.map((race) => {
            const isActive = raceDrawer.round === race.round && raceDrawer.open;
            const roundContent = (
              <>
                <div className="cal-rnum">
                  R{race.round}
                  {race.next ? ' · NEXT' : ''}
                  <span className="cal-status-dot"></span>
                </div>
                <div className="cal-flag-emoji">{race.flag}</div>
                <div className="cal-country">{race.country}</div>
                <div className="cal-flag-name">{race.flagName || race.raceName || 'TBD'}</div>
                <div className="cal-date">{race.date || 'TBD'}</div>
                <div className="cal-winner">{race.winner || (race.done ? 'TBD' : '')}</div>
                <span
                  onClick={(event) => {
                    event.stopPropagation();
                    selectCircuit(race);
                  }}
                  style={{
                    display: 'inline-block',
                    marginTop: '8px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-3)',
                    cursor: 'pointer',
                  }}
                >
                  Circuit Info
                </span>
              </>
            );

            if (!race.done) {
              return (
                <div
                  key={race.round}
                  className={`cal-round${race.done ? ' done' : ''}${race.next ? ' next' : ''}`}
                  data-active={isActive ? 'true' : 'false'}
                >
                  {roundContent}
                </div>
              );
            }

            return (
              <button
                key={race.round}
                type="button"
                className={`cal-round${race.done ? ' done' : ''}${race.next ? ' next' : ''}`}
                data-active={isActive ? 'true' : 'false'}
                onClick={() => openRaceDetails(race)}
                style={{
                  appearance: 'none',
                  background: 'transparent',
                  border: 'none',
                  color: 'inherit',
                  font: 'inherit',
                  margin: 0,
                  padding: 0,
                  textAlign: 'left',
                  width: '100%',
                  cursor: 'pointer',
                }}
                aria-label={`Open full weekend results for round ${race.round} ${race.flagName || race.raceName || race.country}`}
              >
                {roundContent}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Calendar;
