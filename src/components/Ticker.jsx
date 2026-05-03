import { Fragment } from 'react';
import { useF1Season } from '../context/F1SeasonContext.jsx';

const Ticker = () => {
  const { seasonData } = useF1Season();
  const items = seasonData?.tickerItems || [];
  const trackItems = [...items, ...items];

  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {trackItems.map((item, index) => (
          <Fragment key={`${item.sym}-${item.val}-${index}`}>
            <span className="tick">
              <span className="sym">{item.sym}</span> <span className="val">{item.val}</span>{' '}
              <span className="pts">{item.pts}</span>
            </span>
            <span className="tick tick-dot">◆</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
