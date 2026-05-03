import { useEffect, useRef } from "react";

const ColophonModal = () => {
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    const modal = modalRef.current;
    const openBtn = document.getElementById("openColophon");
    const closeBtn = closeBtnRef.current;
    const backdrop = backdropRef.current;

    if (!modal || !openBtn) return;

    function open() {
      modal.hidden = false;
      requestAnimationFrame(() => modal.classList.add("open"));
      document.body.classList.add("colo-open");
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      modal.classList.remove("open");
      document.body.classList.remove("colo-open");
      setTimeout(() => {
        modal.hidden = true;
      }, 300);
    }

    openBtn.addEventListener("click", open);
    closeBtn && closeBtn.addEventListener("click", close);
    backdrop && backdrop.addEventListener("click", close);

    const handleKeyDown = function (event) {
      if (event.key === "Escape" && !modal.hidden) close();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      openBtn.removeEventListener("click", open);
      closeBtn && closeBtn.removeEventListener("click", close);
      backdrop && backdrop.removeEventListener("click", close);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <div
        className="colophon-modal"
        id="colophon-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="colo-title"
        ref={modalRef}
        hidden
      >
        <div className="colo-backdrop" data-close ref={backdropRef}></div>
        <div className="colo-card" role="document">
          <button
            type="button"
            className="colo-close"
            aria-label="Close"
            ref={closeBtnRef}
          >
            ✕
          </button>
          <div className="colo-scroll">
            <header className="colo-head">
              <div className="colo-eyebrow">◆ Credits</div>
              <h2 className="colo-title" id="colo-title">
                The <em>Pit Wall</em>
              </h2>
              <p className="colo-sub">
                First made for my myself its like little gift for myself. Now
                yours, too.
              </p>
            </header>

            <div className="colo-rule" aria-hidden="true"></div>

            <section className="colo-author-sec">
              <p className="colo-author-bio">
                I&apos;m <strong>Vitthal</strong>. I can make dashboards for the
                things I love like Formula 1 or whatever my friends fall asleep
                scrolling. If this one made your weekend better, that&apos;s
                enough.
              </p>
              <div className="colo-links">
                <a
                  className="colo-btn"
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=vitthalganeshshivane@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  vitthalganeshshivane@gmail.com{" "}
                  <span className="colo-arr">→</span>
                </a>
                <a
                  className="colo-btn"
                  href="https://instagram.com/pankaj_shivane_45"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @pankaj_shivane_45 <span className="colo-arr">→</span>
                </a>
              </div>
            </section>

            <div className="colo-rule" aria-hidden="true"></div>

            <section className="colo-tip-sec">
              <div className="colo-author-label">Pit Crew Support</div>
              <h3 className="colo-tip-head">
                If this made your race weekend, <em>pit us in</em>.
              </h3>
              <p className="colo-tip-body">
                No ads, no subscriptions, no accounts — that&apos;s the promise,
                and I want to keep it. A small tip keeps the garage lights on
                and tells me it&apos;s worth building more of these.
              </p>

              {/* <div className="colo-podium">
                <div className="colo-p" data-pos="p10">
                  <div className="colo-p-pos">P10</div>
                  <div className="colo-p-val">₹100</div>
                  <div className="colo-p-lbl">Points finish</div>
                </div>
                <div className="colo-p" data-pos="p3">
                  <div className="colo-p-pos">P3</div>
                  <div className="colo-p-val">₹300</div>
                  <div className="colo-p-lbl">Podium</div>
                </div>
                <div className="colo-p" data-pos="p1">
                  <div className="colo-p-pos">P1</div>
                  <div className="colo-p-val">₹500</div>
                  <div className="colo-p-lbl">Race winner</div>
                </div>
                <div className="colo-p-any">
                  or whatever feels right — every contribution helps
                </div>
              </div> */}

              {/* <div className="colo-upi">
                <div className="colo-upi-left">
                  <span className="colo-upi-label">UPI</span>
                  <code className="colo-upi-id">7814769892@yescred</code>
                  <div className="colo-upi-scan">
                    Paste into any UPI app · PhonePe · GPay · Paytm · BHIM
                  </div>
                </div>
                <div className="colo-upi-qr" id="colo-upi-qr">
                  <img
                    src="https://pavilion.anirudhgoyal55.workers.dev/assets/upi-qr.png"
                    alt="UPI QR code — Anirudh Goel"
                    loading="lazy"
                    decoding="async"
                    onError={(event) => {
                      const wrapper =
                        event.currentTarget.closest("#colo-upi-qr");
                      if (wrapper) {
                        wrapper.classList.add("colo-upi-qr-empty");
                      }
                      event.currentTarget.remove();
                    }}
                  />
                </div>
              </div> */}
              {/* <p className="colo-intl">
                Outside India?{" "}
                <a
                  href="https://ko-fi.com/anirudhgoel"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  tip via Ko-fi
                </a>{" "}
                &mdash; cards, PayPal, any currency.
              </p>
              <p className="colo-tip-sig">
                Every tip gets a thank-you in the next commit message. No joke.
              </p> */}
            </section>

            <div className="colo-rule" aria-hidden="true"></div>

            <p className="colo-disclaimer">
              The Pit Wall is an unofficial fan project. Not affiliated with,
              endorsed by, or associated with Formula 1, the FIA, FOM, or any
              team. Driver and team names used for identification only.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ColophonModal;
