import { useF1Season } from '../context/F1SeasonContext.jsx';

const Podium = () => {
  const { seasonData } = useF1Season();
  const podium = seasonData?.podium || [];
  const latestRace = seasonData?.latestCompletedRace;
  const title = latestRace?.raceName
    ? `${latestRace.raceName.replace(/ Grand Prix$/i, ' GP')} · Result`
    : 'Japanese GP · Suzuka · Result';

  return (
    <div className="podium-block">
      <div className="podium-head">{title}</div>
      <div className="podium-list">
        {podium.map((item, index) => (
          <div className={`pod-row p${index + 1}`} key={`${item.badge}-${item.driver}-${index}`}>
            <div className="pod-badge">{item.badge}</div>
            <div>
              <div className="pod-driver-name">{item.driver}</div>
              <div className="pod-driver-team">{item.team}</div>
            </div>
            <div className="pod-time">{item.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Podium;
