import { useF1Season } from "../context/F1SeasonContext.jsx";

const Hero = () => {
  const { selectedYear, setSelectedYear, availableYears, loading } =
    useF1Season();
  const now = new Date();
  const h = now.getHours();
  const greeting = `${h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"}, Vitthal`;
  const D = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const M = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const dateline = `${D[now.getDay()]} · ${String(now.getDate()).padStart(2, "0")} ${M[now.getMonth()]} · ${now.getFullYear()}`;

  return (
    <section className="hero">
      <span className="speed-line"></span>
      <span className="speed-line"></span>
      <span className="speed-line"></span>

      <div className="hero-top">
        <div className="brand-eyebrow">
          <span className="checker-flag"></span>
          <span>Personal Edition · F1 2026</span>
        </div>
        <div
          className="brand-right"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <div className="greeting">{greeting}</div>
          <div className="dateline">{dateline}</div>
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "8px",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "10px",
              letterSpacing: ".18em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
            }}
          >
            <span>Season</span>
            <select
              aria-label="Select F1 season"
              value={selectedYear}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
              style={{
                appearance: "none",
                background: "var(--paper)",
                color: "var(--ink)",
                border: "1px solid var(--ink)",
                padding: "6px 10px",
                borderRadius: 0,
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "10px",
                letterSpacing: ".16em",
                textTransform: "uppercase",
                cursor: "pointer",
                outline: "none",
                minWidth: "88px",
                opacity: loading ? 0.78 : 1,
              }}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="title-wrap">
        <h1 className="hero-title">
          <span className="line1">
            <span>Vitthal&apos;s</span>
          </span>
          <span className="line2">
            <span>Pit Wall.</span>
          </span>
        </h1>
        <div className="title-underline"></div>
      </div>

      <div className="hero-sub">
        <span className="live-badge">Live Edition</span>
        <span>Drivers · Constructors · Paddock · Calendar</span>
      </div>
    </section>
  );
};

export default Hero;
