import { useF1Season } from '../context/F1SeasonContext.jsx';

const News = () => {
  const { seasonData } = useF1Season();
  const newsItems = seasonData?.newsItems || [];

  return (
    <div className="news-block">
      {newsItems.map((item, index) => (
        <article key={`${item.kicker}-${index}`} className={`news-item ${item.type}`}>
          <div className="news-meta">
            <span className="news-kicker">{item.kicker}</span>
            <span className="news-num">{item.num}</span>
          </div>
          <h3 className="news-headline">{item.headline}</h3>
          <p className="news-body">{item.body}</p>
        </article>
      ))}
    </div>
  );
};

export default News;
