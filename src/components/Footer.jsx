const Footer = () => {
  return (
    <>
      <div className="footer-wrap">
        <footer className="footer">
          <div className="f-note">
            For Myself · eyes only<span className="f-dot"></span>Lights out and
            away we go
          </div>
          <div className="f-brand">
            The <em>Pit Wall</em>
          </div>
        </footer>
        {/* TEMPLATE ATTRIBUTION · DO NOT MODIFY */}
        <div className="f-colophon-row">
          <button
            type="button"
            className="f-colophon-btn"
            id="openColophon"
            aria-haspopup="dialog"
            aria-controls="colophon-modal"
          >
            <span>Credits</span>
          </button>
        </div>
        {/* END TEMPLATE ATTRIBUTION */}
      </div>
    </>
  );
};

export default Footer;
