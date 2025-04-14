function Footer() {
  return (
    <footer className="app-footer">
      <article className="footer-container">
        {/* Desktop version */}
        <section className="footer-section" id="desktopOnlyFooter">
          <div className="footer-item">
            <img src="./../../public/assets/images/icon-map-pin.svg" alt="" />
            <p>Visual Arena, Lindholmen</p>
          </div>
          <div className="footer-item">
            <img src="./../../public/assets/images/icon-calendar.svg" alt="" />
            <p>23 April</p>
          </div>
          <div className="footer-item">
            <img src="./../../public/assets/images/icon-clock.svg" alt="" />
            <p>13:00 - 15:00</p>
          </div>
        </section>
        <div className="footer-item" id="footerSocialsDesktop">
          <img src="./../../public/assets/images/fb.svg" alt="Facebook" />
          <img
            src="./../../public/assets/images/instagram.svg"
            alt="Instagram"
          />
        </div>

        {/* Mobile/tablet version - revised structure */}
        <section className="footer-section" id="mobile-only-footer">
          <div className="footer-item">
            <img src="./../../public/assets/images/icon-map-pin.svg" alt="" />
            <p>Visual Arena, Lindholmen</p>
          </div>
          <div className="footer-item">
            <img
              className="footer-logo"
              src="./../../public/assets/images/yrgo-logo-mobile.svg"
              alt="Logo"
            />
          </div>
          <div className="footer-item" id="footerSocials">
            <img src="./../../public/assets/images/fb.svg" alt="Facebook" />
            <img
              src="./../../public/assets/images/instagram.svg"
              alt="Instagram"
            />
          </div>
        </section>
      </article>
    </footer>
  );
}

export default Footer;
