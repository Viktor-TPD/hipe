import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="app-footer">
      <article className="footer-container">
        <section className="footer-section">
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

        <section className="footer-section">
          <div className="footer-item">
            <img src="./../../public/assets/images/fb.svg" alt="" />
          </div>
          <div className="footer-item">
            <img src="./../../public/assets/images/instagram.svg" alt="" />
          </div>
        </section>
      </article>
    </footer>
  );
}

export default Footer;
