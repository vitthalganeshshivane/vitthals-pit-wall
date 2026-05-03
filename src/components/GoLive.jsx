const GoLive = () => {
  return (
    <>
      <section className="golive-section">
        <div className="golive-card">
          <div className="golive-stripe" aria-hidden="true"></div>
          <div className="golive-left">
            <div className="golive-eyebrow">§ 04 · Go Live</div>
            <h2 className="golive-title">Make it <em>auto-update</em>.</h2>
            <p className="golive-lede">
              Right now this dashboard is a snapshot — you update the numbers after each race. When you're ready, there are three paths to real-time data pulled straight from the F1 API after every checkered flag.
            </p>
          </div>
          <div className="golive-right">
            <div className="golive-step">
              <div className="golive-step-num">01</div>
              <div>
                <div className="golive-step-head">Manual <em>· 2 min after each race</em></div>
                <div className="golive-step-body">
                  Open <code>index.html</code> in any text editor. Find a driver's name (e.g. <code>Antonelli</code>), update the number a few lines below it (e.g. <code>72</code> &rarr; <code>97</code>). Save. Redeploy. Good for fans who only watch the majors.
                </div>
              </div>
            </div>

            <div className="golive-step">
              <div className="golive-step-num">02</div>
              <div>
                <div className="golive-step-head">Semi-auto <em>· 30 sec via AI</em></div>
                <div className="golive-step-body">
                  Paste the file into Claude or ChatGPT with this prompt &mdash; it does the rest.
                </div>
                <details className="golive-details">
                  <summary>show the prompt</summary>
                  <pre className="golive-pre">{`Update my F1 dashboard after the [RACE NAME] GP.

New driver standings (top 10):
1. Antonelli &mdash; 97
2. Russell &mdash; 84
3. Leclerc &mdash; 68
&hellip;

New constructor totals:
Mercedes 181, Ferrari 124, McLaren &hellip;

New podium for "Last Race":
P1 [Driver] &mdash; [Team] &mdash; [Time]
P2 &hellip; (gap)
P3 &hellip; (gap)

Update the countdown to the next race.
Return the COMPLETE HTML in one code block. Preserve every
&lt;!-- DO NOT MODIFY --&gt; block exactly as-is.`}</pre>
                </details>
              </div>
            </div>

            <div className="golive-step">
              <div className="golive-step-num">03</div>
              <div>
                <div className="golive-step-head">Full auto <em>· public API, no manual edits</em></div>
                <div className="golive-step-body">
                  Hook the dashboard to a public F1 data API. Standings update on their own once a race is over &mdash; no touching the file again for the rest of the season.
                </div>
                <details className="golive-details">
                  <summary>show the setup</summary>
                  <p className="golive-detail-p"><strong>Easiest path &middot; Jolpica F1 (Ergast successor, CORS-enabled).</strong> Add this script tag near the bottom of the file, just before the closing <code>&lt;/body&gt;</code>. It fetches once on load and overwrites the hardcoded driver points in place:</p>
                  <pre className="golive-pre">{`<script>
(async function () {
  try {
    const r = await fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json');
    const j = await r.json();
    const list = j.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
    document.querySelectorAll('.driver-row').forEach((row, i) => {
      const d = list[i];
      if (!d) return;
      const pts = row.querySelector('.driver-pts');
      if (pts) pts.textContent = d.points;
    });
  } catch (e) { /* network blip &mdash; keep the static template */ }
})();
</script>`}</pre>
                  <p className="golive-detail-p"><strong>More powerful &middot; OpenF1 + a tiny proxy.</strong> OpenF1 has live timing data (laps, pit stops, positions during a session) but doesn't expose CORS. A 30-line Cloudflare Worker fixes that and adds a 10-minute cache. The Worker quickstart link below has everything; the transformation logic mirrors the snippet above.</p>
                  <p className="golive-detail-p"><strong>Python path &middot; FastF1 + GitHub Actions.</strong> Prefer Python? Use the FastF1 library to write a JSON snapshot, commit it via a GitHub Action on a daily cron, and have the dashboard fetch the JSON. Same idea, different stack.</p>
                </details>
              </div>
            </div>

            <div className="golive-cta-row">
              <a className="golive-cta golive-cta-ghost" href="https://api.jolpi.ca/ergast/" target="_blank" rel="noopener noreferrer">
                Jolpica F1 API
              </a>
              <a className="golive-cta golive-cta-ghost" href="https://openf1.org/" target="_blank" rel="noopener noreferrer">
                OpenF1 docs
              </a>
              <a className="golive-cta golive-cta-ghost" href="https://docs.fastf1.dev/" target="_blank" rel="noopener noreferrer">
                FastF1 (Python)
              </a>
              <a className="golive-cta golive-cta-ghost" href="https://developers.cloudflare.com/workers/get-started/quickstarts/" target="_blank" rel="noopener noreferrer">
                Cloudflare Workers
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GoLive;
