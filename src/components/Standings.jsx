import { useF1Season } from '../context/F1SeasonContext.jsx';
import Podium from './Podium.jsx';
import News from './News.jsx';
import DriverDossier from './DriverDossier.jsx';
import CircuitDossier from './CircuitDossier.jsx';

const Standings = () => {
  const { seasonData, selectedDriver, selectedCircuit, selectDriver } = useF1Season();
  const driverData = seasonData?.driverRows || [];
  const constructorData = seasonData?.constructorRows || [];

  return (
    <section className="main-section">
      <div className="main-grid">
        <div className="col">
          <div className="col-head">
            <div className="col-num">§ 01</div>
            <div className="col-name">
              Drivers' <em>Championship</em>
            </div>
            <div className="col-sub">Top 10 · After {seasonData?.completedRounds || 3} Rounds</div>
          </div>
          {driverData.map((driver, index) => (
            <div
              key={`${driver.pos}-${driver.code}`}
              className={`driver-row ${driver.leader ? 'leader' : ''}`}
              role="button"
              tabIndex={0}
              aria-pressed={selectedDriver?.driverId === driver.driverId}
              onClick={() => selectDriver(driver)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  selectDriver(driver);
                }
              }}
              style={{
                '--team-color': `var(${driver.teamColor})`,
                animationDelay: `${4.5 + index * 0.08}s`,
                cursor: 'pointer',
                background:
                  selectedDriver?.driverId === driver.driverId ? 'rgba(10, 10, 10, 0.06)' : undefined,
              }}
            >
              <div className="driver-pos">{driver.pos}</div>
              <div className="driver-info">
                <div className="driver-line">
                  <span className="driver-name">{driver.name}</span>
                  <span
                    className="driver-code"
                    style={{
                      background: driver.teamColor.includes('mercedes')
                        ? 'var(--mercedes)'
                        : driver.teamColor.includes('ferrari')
                          ? 'var(--ferrari)'
                          : driver.teamColor.includes('mclaren')
                            ? 'var(--mclaren)'
                            : driver.teamColor.includes('haas')
                              ? '#4a4a4a'
                              : driver.teamColor.includes('alpine')
                                ? 'var(--alpine)'
                                : driver.teamColor.includes('redbull')
                                  ? 'var(--redbull)'
                                  : driver.teamColor.includes('racingbulls')
                                    ? 'var(--racingbulls)'
                                    : '#000',
                      color: driver.teamColor.includes('haas') ? '#000' : '#fff',
                    }}
                  >
                    {driver.code}
                  </span>
                </div>
                <div className="driver-team">
                  {driver.team}
                  {driver.gapText ? <span className="gap">{driver.gapText}</span> : null}
                </div>
              </div>
              <div className="driver-pts-wrap">
                <div className="driver-pts">{driver.pts}</div>
                <div className="driver-pts-sub">pts</div>
              </div>
            </div>
          ))}
        </div>

        <div className="col">
          <div className="col-head">
            <div className="col-num">§ 02</div>
            <div className="col-name">
              Constructors' <em>Cup</em>
            </div>
            <div className="col-sub">All teams · {seasonData?.year || '2026'}</div>
          </div>
          {constructorData.map((constructor, index) => (
            <div
              key={`${constructor.pos}-${constructor.name}`}
              className="con-row"
              style={{
                '--team-color': `var(${constructor.teamColor})`,
                animationDelay: `${4.5 + index * 0.08}s`,
              }}
            >
              <div className="con-top">
                <div className="con-pos">{constructor.pos}</div>
                <div>
                  <div className="con-name">{constructor.name}</div>
                  <div className="con-engine">{constructor.engine}</div>
                </div>
                <div className="con-pts">{constructor.pts}</div>
              </div>
              <div className="con-bar">
                <div
                  className="con-bar-fill"
                  style={{
                    width: constructor.width,
                    animationDelay: `${5.5 + index * 0.05}s`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="col">
          <div className="col-head">
            <div className="col-num">§ 03</div>
            <div className="col-name">
              {selectedDriver ? (
                <>
                  Driver <em>Dossier</em>
                </>
              ) : (
                <>
                  Paddock <em>Intel</em>
                </>
              )}
            </div>
            <div className="col-sub">
              {selectedCircuit
                ? 'Circuit notes · Wikipedia history'
                : selectedDriver
                  ? 'Career notes · Wikipedia bio'
                  : 'Last Race · Top Stories'}
            </div>
          </div>

          {selectedCircuit ? (
            <CircuitDossier />
          ) : selectedDriver ? (
            <DriverDossier />
          ) : (
            <>
              <Podium />
              <News />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Standings;
