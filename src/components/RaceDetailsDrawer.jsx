import { useEffect, useState } from 'react';
import { useF1Season } from '../context/F1SeasonContext.jsx';

function formatOpenF1Time(value) {
  if (!value) {
    return 'TBD';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'TBD';
  }

  return `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')} UTC`;
}

function SessionTable({ title, session, rows, headers, renderRow, columns, emptyText, accent }) {
  return (
    <section
      style={{
        borderTop: '1px solid var(--rule-light)',
        paddingTop: '14px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '12px',
        }}
      >
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '18px',
            fontStyle: 'italic',
            fontWeight: 600,
            color: 'var(--ink)',
            margin: 0,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--ink-3)',
          }}
        >
          {session ? `${session.session_name || session.session_type || 'Session'} · ${session.country_name || 'OpenF1'}` : 'No session found'}
        </div>
      </div>

      {session ? (
        <div
          style={{
            display: 'grid',
            gap: '4px',
            marginBottom: '12px',
            color: 'var(--ink-2)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          <div>
            {session.session_name || session.session_type || 'Session'} · {session.country_name || 'TBD'}
          </div>
          <div>{formatOpenF1Time(session.date_start)}</div>
        </div>
      ) : null}

      {rows.length ? (
        <div style={{ display: 'grid', gap: '6px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: columns,
              gap: '8px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '9px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--ink-3)',
              paddingBottom: '4px',
              borderBottom: '1px solid var(--rule-light)',
            }}
          >
            {headers.map((header) => (
              <div key={header}>{header}</div>
            ))}
          </div>

          {rows.map((row) => (
            <div
              key={`${row.position || row.grid || row.driver}-${row.team}`}
              style={{
                display: 'grid',
                gridTemplateColumns: columns,
                gap: '8px',
                alignItems: 'baseline',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                color: 'var(--ink)',
                padding: '2px 0',
              }}
            >
              {renderRow(row).map((cell, index) => (
                <div key={index} style={index === 1 ? { color: accent || 'var(--ink)' } : undefined}>
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
            lineHeight: 1.5,
            color: 'var(--ink-2)',
            fontStyle: 'italic',
          }}
        >
          {emptyText || 'No data available for this session.'}
        </div>
      )}
    </section>
  );
}

const RaceDetailsDrawer = () => {
  const { raceDrawer, closeRaceDetails, seasonData, weekendDetailsByRound } = useF1Season();
  const [rendered, setRendered] = useState(false);
  const [visible, setVisible] = useState(false);

  const weekend = raceDrawer.round ? weekendDetailsByRound[raceDrawer.round] : null;
  const race = weekend?.race || seasonData?.races?.find((item) => item.round === raceDrawer.round) || null;

  useEffect(() => {
    if (raceDrawer.open) {
      const frame = requestAnimationFrame(() => {
        setRendered(true);
        setVisible(true);
        document.body.classList.add('colo-open');
      });

      const onKeyDown = (event) => {
        if (event.key === 'Escape') {
          closeRaceDetails();
        }
      };

      document.addEventListener('keydown', onKeyDown);

      return () => {
        cancelAnimationFrame(frame);
        document.removeEventListener('keydown', onKeyDown);
      };
    }

    if (!rendered) {
      document.body.classList.remove('colo-open');
      return undefined;
    }

    const frame = requestAnimationFrame(() => {
      setVisible(false);
      document.body.classList.remove('colo-open');
    });
    const timer = setTimeout(() => {
      setRendered(false);
    }, 260);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [closeRaceDetails, raceDrawer.open, rendered]);

  if (!rendered) {
    return null;
  }

  const qualifyingRows = weekend?.qualifying || [];
  const sprintRows = weekend?.sprint || [];
  const raceRows = weekend?.raceRows || [];

  const qualifyingColumns = '56px minmax(120px, 1.1fr) minmax(120px, 1fr) 56px 56px 56px';
  const sprintColumns = '56px minmax(120px, 1.2fr) minmax(120px, 1fr) 84px 54px';
  const raceColumns = '56px minmax(120px, 1.2fr) minmax(120px, 1fr) 84px 54px';

  return (
    <div
      className={`colophon-modal${visible ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="race-drawer-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        overflow: 'hidden',
        display: 'block',
      }}
    >
      <button
        type="button"
        aria-label="Close race details"
        onClick={closeRaceDetails}
        style={{
          position: 'absolute',
          inset: 0,
          border: 'none',
          padding: 0,
          margin: 0,
          background: 'rgba(10, 10, 10, 0.58)',
          cursor: 'pointer',
        }}
      />

      <aside
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: '100%',
          width: 'min(860px, 100vw)',
          background: 'linear-gradient(180deg, var(--paper) 0%, #efe8d8 100%)',
          borderLeft: '1px solid rgba(10, 10, 10, 0.15)',
          boxShadow: '-28px 0 70px rgba(10, 10, 10, 0.2)',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          opacity: visible ? 1 : 0,
          transition: 'transform 260ms ease',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 2,
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px',
            padding: '22px 24px 16px',
            borderBottom: '1px solid var(--rule-light)',
            background: 'rgba(242, 236, 224, 0.94)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--ink-3)',
                marginBottom: '6px',
              }}
            >
              Full Weekend · Round {race?.round || raceDrawer.round || '--'}
            </div>
            <h2
              id="race-drawer-title"
              style={{
                margin: 0,
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(28px, 3vw, 40px)',
                lineHeight: 0.96,
                fontWeight: 600,
                color: 'var(--ink)',
              }}
            >
              {race?.flagName || race?.raceName || 'Race Weekend'}
            </h2>
            <div
              style={{
                marginTop: '8px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px',
                lineHeight: 1.45,
                color: 'var(--ink-2)',
              }}
            >
              {race ? `${race.country || 'TBD'} · ${race.date || 'Dates TBD'}` : 'Selected weekend details'}
            </div>
          </div>

          <button
            type="button"
            onClick={closeRaceDetails}
            aria-label="Close drawer"
            style={{
              alignSelf: 'start',
              border: '1px solid var(--rule-light)',
              background: 'transparent',
              color: 'var(--ink)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '10px 12px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>

        <div
          style={{
            padding: '18px 24px 28px',
            overflowY: 'auto',
            display: 'grid',
            gap: '18px',
          }}
        >
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '10px',
            }}
          >
            {[
              ['Qualifying', weekend?.sessions?.qualifying, qualifyingRows.length],
              ['Sprint', weekend?.sessions?.sprint, sprintRows.length],
              ['Race', weekend?.sessions?.race, raceRows.length],
            ].map(([label, session, count]) => (
              <div
                key={label}
                style={{
                  border: '1px solid var(--rule-light)',
                  background: 'rgba(255,255,255,0.18)',
                  padding: '12px 12px 11px',
                  minHeight: '88px',
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-3)',
                    marginBottom: '10px',
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '22px',
                    lineHeight: 0.95,
                    fontWeight: 600,
                    color: 'var(--ink)',
                    marginBottom: '8px',
                  }}
                >
                  {session ? session.session_name || session.session_type || label : 'TBD'}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                    lineHeight: 1.45,
                    color: 'var(--ink-2)',
                  }}
                >
                  {session ? formatOpenF1Time(session.date_start) : 'Session time unavailable'}
                </div>
                <div
                  style={{
                    marginTop: '10px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-3)',
                  }}
                >
                  {count} entries
                </div>
              </div>
            ))}
          </section>

          {raceDrawer.status === 'loading' && !weekend ? (
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--ink-3)',
                padding: '10px 0 4px',
              }}
            >
              Loading weekend data...
            </div>
          ) : null}

          {raceDrawer.status === 'error' ? (
            <div
              style={{
                border: '1px solid rgba(180, 4, 0, 0.24)',
                background: 'rgba(225, 6, 0, 0.05)',
                padding: '14px 16px',
                color: 'var(--ink)',
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px',
                lineHeight: 1.5,
              }}
            >
              Weekend data could not be loaded. The drawer stays usable, but one or more session files were unavailable.
            </div>
          ) : null}

          <SessionTable
            title="Qualifying"
            session={weekend?.sessions?.qualifying || null}
            rows={raceDrawer.status === 'ready' ? qualifyingRows : []}
            headers={['Pos', 'Driver', 'Team', 'Q1', 'Q2', 'Q3']}
            columns={qualifyingColumns}
            emptyText="No qualifying session available."
            accent="var(--ferrari)"
            renderRow={(row) => [row.position, row.driver, row.team, row.q1, row.q2, row.q3]}
          />

          <SessionTable
            title="Sprint"
            session={weekend?.sessions?.sprint || null}
            rows={raceDrawer.status === 'ready' ? sprintRows : []}
            headers={['Pos', 'Driver', 'Team', 'Time', 'Laps']}
            columns={sprintColumns}
            emptyText={weekend?.hasSprint ? 'Sprint results are unavailable.' : 'No sprint weekend for this round.'}
            accent="var(--mclaren)"
            renderRow={(row) => [row.position, row.driver, row.team, row.time, row.laps]}
          />

          <SessionTable
            title="Race"
            session={weekend?.sessions?.race || null}
            rows={raceDrawer.status === 'ready' ? raceRows : []}
            headers={['Pos', 'Driver', 'Team', 'Time', 'Gap']}
            columns={raceColumns}
            emptyText="Race results are unavailable."
            accent="var(--mercedes)"
            renderRow={(row) => [row.position, row.driver, row.team, row.time, row.gap || row.laps]}
          />
        </div>
      </aside>
    </div>
  );
};

export default RaceDetailsDrawer;
