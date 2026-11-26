import './Section1.css'
import { HOUSES } from '../data/houses'

function Section1({ onSelectHouse }) {
  return (
    <section className="houses-section section-shell" id="houses" aria-labelledby="houses-title">
      <div className="section-heading reveal">
        <p className="eyebrow">The great houses of Westeros</p>
        <span className="ornament" aria-hidden="true">✦</span>
        <h2 className="section-title" id="houses-title">Oaths. <em>Bloodlines.</em> Banners.</h2>
        <p className="section-intro">Six houses. Six legacies woven into the fate of the realm.</p>
      </div>

      <div className="houses-grid">
        {HOUSES.map((house, index) => (
          <button
            className="house-card reveal"
            key={house.id}
            style={{ '--house-accent': house.accent, '--reveal-order': index }}
            onClick={() => onSelectHouse(house)}
            aria-label={`Discover House ${house.name}`}
          >
            <span className="house-card__number">0{index + 1}</span>
            <span className="house-card__art">
              <img src={house.image} alt={`${house.name} house emblem`} loading="lazy" />
              <span className="house-card__halo" aria-hidden="true" />
            </span>
            <span className="house-card__region">{house.region}</span>
            <span className="house-card__name">House {house.name}</span>
            <span className="house-card__seat">{house.seat}</span>
            <span className="house-card__motto">“{house.words}”</span>
            <span className="house-card__learn">Explore house <span aria-hidden="true">↗</span></span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default Section1
