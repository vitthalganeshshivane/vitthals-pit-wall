import { useF1Season } from '../context/F1SeasonContext.jsx';

const Stats = () => {
  const { seasonData } = useF1Season();
  const drivers = seasonData?.driverRows || [];
  const leader = drivers[0];
  const second = drivers[1];
  const verstappen = drivers.find((driver) => driver.code === 'VER');
  const leadGap =
    leader && second ? `+${Math.max(0, Number(leader.pts || 0) - Number(second.pts || 0))}` : '+9';
  const verstappenGap = verstappen
    ? `P${verstappen.pos} · ${verstappen.gapText || '−60'}`
    : 'P9 · −60';

  return (
    <section className="stats-ribbon">
      <div className="stats-grid">
        <div className="stat">
          <div className="stat-label">Championship Lead</div>
          <div className="stat-big">
            <em>{leadGap}</em> pts
          </div>
          <div className="stat-sub">Antonelli over Russell</div>
        </div>
        <div className="stat">
          <div className="stat-label">Fastest Lap {seasonData?.year || '2026'}</div>
          <div className="stat-big">1:28.411</div>
          <div className="stat-sub">Russell · Japan Q3</div>
        </div>
        <div className="stat">
          <div className="stat-label">Fastest Pit Stop</div>
          <div className="stat-big">
            1.94<em>s</em>
          </div>
          <div className="stat-sub">McLaren · Japanese GP</div>
        </div>
        <div className="stat">
          <div className="stat-label">Verstappen Gap</div>
          <div className="stat-big">
            {verstappenGap.split(' · ')[0]} <em>·</em> {verstappenGap.split(' · ')[1]}
          </div>
          <div className="stat-sub">Worst start since 2017</div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
