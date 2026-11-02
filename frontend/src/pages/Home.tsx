
import { Link } from 'react-router'

function Home() {
  return (
    <div className="home-page luxury-home">
      <section className="luxury-hero">
        <div className="luxury-hero-content">
          <span className="luxury-eyebrow">
            THE FRAUD HOTEL · WYJĄTKOWE DOŚWIADCZENIA
          </span>

          <div className="luxury-divider" />

          <h1>
            Odkryj sztukę
            <br />
            <em>luksusowego wypoczynku.</em>
          </h1>

          <p>
            Miejsce, w którym ponadczasowa elegancja
            spotyka się z najwyższym komfortem.
            Pozwól sobie na niezapomniany pobyt.
          </p>

          <Link to="/user" className="luxury-button">
            ZAPLANUJ SWÓJ POBYT
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="luxury-hero-bottom">
          <span>THE FRAUD HOTEL</span>
          <span>ELEGANCJA · KOMFORT · WYJĄTKOWOŚĆ</span>
        </div>
      </section>

      <section className="luxury-intro">
        <span className="luxury-section-label">
          O NASZYM HOTELU
        </span>

        <h2>
          Luksus tkwi
          <br />
          <em>w każdym detalu.</em>
        </h2>

        <p>
          Odkryj wyjątkową atmosferę, starannie
          zaprojektowane wnętrza i przestrzeń,
          w której każda chwila nabiera znaczenia.
        </p>

        <Link to="/user" className="luxury-text-link">
          PRZEJDŹ DO PANELU GOŚCIA <span aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  )
}

export default Home
