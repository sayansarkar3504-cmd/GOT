import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hero from './components/Hero'
import Section1 from './components/Section1'
import GamesHall from './components/GamesHall'
import { HOUSES } from './data/houses'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'world', label: 'The World' },
  { id: 'houses', label: 'Great Houses' },
  { id: 'characters', label: 'Characters' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'creatures', label: 'Dragons & Beasts' },
  { id: 'battles', label: 'Battles' },
  { id: 'throne', label: 'The Throne' },
  { id: 'games', label: 'Games' },
  { id: 'about', label: 'About' },
]

const CHARACTERS = [
  {
    name: 'Jon Snow',
    house: 'House Stark',
    houseId: 'stark',
    role: 'The North',
    description: 'Raised at Winterfell, Jon joins the Night’s Watch and finds his path drawn toward the lands beyond the Wall.',
  },
  {
    name: 'Daenerys Targaryen',
    house: 'House Targaryen',
    houseId: 'targaryen',
    role: 'The Dragon Queen',
    description: 'An exiled Targaryen who sets out to reclaim her family’s legacy, accompanied by the return of dragons.',
  },
  {
    name: 'Tyrion Lannister',
    house: 'House Lannister',
    houseId: 'lannister',
    role: 'The Westerlands',
    description: 'A sharp-witted member of House Lannister whose political instincts carry him through the shifting courts of Westeros.',
  },
  {
    name: 'Arya Stark',
    house: 'House Stark',
    houseId: 'stark',
    role: 'Winterfell',
    description: 'A Stark who rejects the narrow path expected of her and sets out to make her own way through a dangerous realm.',
  },
  {
    name: 'Cersei Lannister',
    house: 'House Lannister',
    houseId: 'lannister',
    role: 'The Red Keep',
    description: 'A formidable Lannister whose ambitions and fierce devotion to her children shape the politics of the capital.',
  },
  {
    name: 'Jaime Lannister',
    house: 'House Lannister',
    houseId: 'lannister',
    role: 'The Kingsguard',
    description: 'A celebrated swordsman of the Kingsguard, remembered across the realm by the name Kingslayer.',
  },
  {
    name: 'Sansa Stark',
    house: 'House Stark',
    houseId: 'stark',
    role: 'The North',
    description: 'Eldest daughter of House Stark, Sansa learns to navigate courtly danger and finds strength in her Northern roots.',
  },
  {
    name: 'Ned Stark',
    house: 'House Stark',
    houseId: 'stark',
    role: 'Lord of Winterfell',
    description: 'Lord of Winterfell and Warden of the North, Eddard Stark is guided by duty, family, and a stern code of honour.',
  },
]

const REGIONS = [
  { name: 'The North', note: 'Vast northern lands, with Winterfell at their heart.', position: 'north' },
  { name: "King's Landing", note: 'The capital of the Seven Kingdoms, where the Iron Throne stands in the Red Keep.', position: 'king' },
  { name: 'Dragonstone', note: 'A dark island stronghold in Blackwater Bay, long associated with House Targaryen.', position: 'dragonstone' },
  { name: 'The Vale', note: 'A mountain-guarded realm beneath the heights of the Eyrie.', position: 'vale' },
  { name: 'The Riverlands', note: 'A crossroads of rivers and roads at the center of the realm.', position: 'riverlands' },
  { name: 'The Iron Islands', note: 'A rugged archipelago shaped by the sea.', position: 'iron' },
  { name: 'The Westerlands', note: 'Western shores and hills, home to Casterly Rock.', position: 'west' },
  { name: 'The Reach', note: 'A fertile southern expanse surrounding Highgarden.', position: 'reach' },
  { name: 'Dorne', note: 'The southernmost principality, known for its arid landscapes.', position: 'dorne' },
]

const TIMELINE = [
  {
    era: 'The Age of Heroes',
    marker: 'Before recorded years',
    detail: 'A distant age of legendary figures and ancient peoples. Its stories survive in songs, tales, and the oldest traditions of Westeros.',
  },
  {
    era: 'The Long Night',
    marker: 'The first great winter',
    detail: 'A darkness remembered in the oldest histories, when the peoples of Westeros faced the threat of the Others and the cold.',
  },
  {
    era: 'Aegon’s Conquest',
    marker: 'Three centuries before the War of the Five Kings',
    detail: 'Aegon Targaryen and his sister-wives crossed the sea with dragons and brought much of Westeros beneath one crown.',
  },
  {
    era: 'The Targaryen Dynasty',
    marker: 'The years of the dragon kings',
    detail: 'For generations, Targaryen rulers held the Iron Throne, until conflict within the dynasty weakened its hold on the realm.',
  },
  {
    era: 'Robert’s Rebellion',
    marker: 'The end of the dragon dynasty',
    detail: 'A rebellion led by Robert Baratheon brought the Targaryen rule in Westeros to an end and began a new reign.',
  },
  {
    era: 'The War of the Five Kings',
    marker: 'A realm divided',
    detail: 'After the death of King Robert, rival claimants fought for power as alliances shifted across the Seven Kingdoms.',
  },
]

const CREATURES = [
  {
    name: 'Balerion',
    kind: 'The Black Dread',
    detail: 'The great dragon ridden by Aegon the Conqueror, whose shadow became part of the story of the Targaryen dynasty.',
  },
  {
    name: 'Vhagar',
    kind: 'The ancient dragon',
    detail: 'One of the oldest dragons in Westerosi history, Vhagar carried generations of riders through an age of conquest and conflict.',
  },
  {
    name: 'Direwolves',
    kind: 'The North remembers',
    detail: 'Rare beyond the lands north of the Wall, direwolves became inseparable from the Stark children and their Northern identity.',
  },
  {
    name: 'The Others',
    kind: 'Winter’s oldest fear',
    detail: 'Mysterious beings of ice from the oldest tales, whose return gives new meaning to the warnings beyond the Wall.',
  },
]

const BATTLES = [
  {
    name: 'The Blackwater',
    place: 'King’s Landing',
    sides: 'The crown against Stannis Baratheon',
    detail: 'A struggle for the capital where wildfire, the city walls, and a last-minute alliance turned the tide.',
  },
  {
    name: 'The Battle of the Bastards',
    place: 'Winterfell',
    sides: 'Jon Snow and Sansa Stark against House Bolton',
    detail: 'A brutal fight for the North, remembered for the terrible cost of reclaiming Winterfell.',
  },
  {
    name: 'The Long Night',
    place: 'The North',
    sides: 'The living against the army of the dead',
    detail: 'The defenders of Winterfell stood together against the darkness and the ancient threat advancing from beyond the Wall.',
  },
]

function Navigation({ activeSection, isScrolled, menuOpen, setMenuOpen }) {
  return (
    <header className={`site-header ${isScrolled ? 'site-header--scrolled' : ''}`}>
      <a className="brand" href="#home" aria-label="Chronicles of Westeros home" onClick={() => setMenuOpen(false)}>
        <span className="brand__mark" aria-hidden="true">✦</span>
        <span>Chronicles <i>of</i> Westeros</span>
      </a>
      <button
        className={`menu-toggle ${menuOpen ? 'menu-toggle--open' : ''}`}
        type="button"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span /><span /><span />
      </button>
      <nav className={`site-nav ${menuOpen ? 'site-nav--open' : ''}`} id="primary-navigation" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <a
            className={activeSection === item.id ? 'is-active' : ''}
            key={item.id}
            href={`#${item.id}`}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}

function SectionHeading({ eyebrow, title, intro, titleId }) {
  return (
    <div className="section-heading reveal">
      <p className="eyebrow">{eyebrow}</p>
      <span className="ornament" aria-hidden="true">✦</span>
      <h2 className="section-title" id={titleId}>{title}</h2>
      {intro && <p className="section-intro">{intro}</p>}
    </div>
  )
}

function WorldSection() {
  const [selectedRegion, setSelectedRegion] = useState(REGIONS[0])

  return (
    <section className="world-section section-shell" id="world" aria-labelledby="world-title">
      <SectionHeading
        eyebrow="Beyond the narrow sea"
        title={<>A realm of <em>many</em> kingdoms.</>}
        intro="From the frozen North to the sunlit sands of Dorne, every region holds its own history."
        titleId="world-title"
      />
      <div className="world-layout">
        <div className="realm-map reveal" aria-label="Stylized map-inspired arrangement of Westeros regions">
          <div className="realm-map__spine" aria-hidden="true" />
          {REGIONS.map((region, index) => (
            <button
              className={`region-pin region-pin--${region.position} ${selectedRegion.name === region.name ? 'region-pin--selected' : ''}`}
              key={region.name}
              type="button"
              onClick={() => setSelectedRegion(region)}
              aria-pressed={selectedRegion.name === region.name}
              aria-label={`Explore ${region.name}`}
              style={{ '--region-order': index }}
            >
              <span className="region-pin__dot" aria-hidden="true" />
              <span>{region.name}</span>
            </button>
          ))}
          <span className="realm-map__label" aria-hidden="true">Westeros</span>
        </div>
        <aside className="region-detail reveal" aria-live="polite">
          <p className="eyebrow">Selected region</p>
          <span className="region-detail__rule" aria-hidden="true" />
          <h3>{selectedRegion.name}</h3>
          <p>{selectedRegion.note}</p>
          <a className="text-link" href="#timeline">Trace its history <span aria-hidden="true">→</span></a>
        </aside>
      </div>
      <p className="map-caption">A map-inspired guide, not a geographic map.</p>
    </section>
  )
}

function IntroductionSection() {
  return (
    <section className="introduction-section section-shell" id="introduction" aria-labelledby="introduction-title">
      <div className="introduction__copy reveal">
        <p className="eyebrow">A land shaped by legend</p>
        <h2 className="section-title" id="introduction-title">
          Seven kingdoms.<br /><em>Countless stories.</em>
        </h2>
        <p>
          Westeros is a realm of old bloodlines, shifting alliances, and landscapes as
          varied as the people who call them home. Here, history is never far from
          the present — and every promise carries a price.
        </p>
        <a className="text-link" href="#world">Find your place in the realm <span aria-hidden="true">→</span></a>
      </div>
      <div className="introduction__seal reveal" aria-hidden="true">
        <span className="introduction__seal-ring" />
        <span className="introduction__seal-star">✦</span>
        <span className="introduction__seal-label">Westeros<br />A realm in stories</span>
      </div>
    </section>
  )
}

function CharactersSection({ onSelectCharacter }) {
  return (
    <section className="characters-section section-shell" id="characters" aria-labelledby="characters-title">
      <SectionHeading
        eyebrow="The lives behind the legends"
        title={<>Faces of the <em>realm.</em></>}
        intro="A few of the names whose choices changed the course of Westeros."
        titleId="characters-title"
      />
      <div className="characters-grid">
        {CHARACTERS.map((character, index) => {
          const house = HOUSES.find((item) => item.id === character.houseId)
          return (
            <article
              className="character-card reveal"
              key={character.name}
              style={{ '--character-accent': house.accent, '--reveal-order': index }}
            >
              <div className="character-card__image">
                <img
                  src={house.image}
                  alt={`${character.house} emblem`}
                  loading="lazy"
                />
                <span className="character-card__image-shade" aria-hidden="true" />
                <span className="character-card__image-label">{character.role}</span>
              </div>
              <div className="character-card__content">
                <p className="character-card__house">{character.house}</p>
                <h3>{character.name}</h3>
                <button className="text-link" type="button" onClick={() => onSelectCharacter({ ...character, image: house.image, accent: house.accent })}>
                  View details <span aria-hidden="true">↗</span>
                </button>
              </div>
            </article>
          )
        })}
      </div>
      <p className="asset-note">Character panels use the matching house emblems available in this project’s art collection.</p>
    </section>
  )
}

function TimelineSection() {
  const [activeEra, setActiveEra] = useState(0)
  const active = TIMELINE[activeEra]

  return (
    <section className="timeline-section section-shell" id="timeline" aria-labelledby="timeline-title">
      <SectionHeading
        eyebrow="A history written in fire and ice"
        title={<>Echoes through <em>time.</em></>}
        intro="An overview of the eras and conflicts that shaped the realm."
        titleId="timeline-title"
      />
      <div className="timeline">
        <ol className="timeline__list" aria-label="Westeros historical eras">
          {TIMELINE.map((item, index) => (
            <li
              className={`timeline__item ${activeEra === index ? 'timeline__item--active' : ''}`}
              key={item.era}
            >
              <button
                className="timeline__button"
                type="button"
                onClick={() => setActiveEra(index)}
                aria-pressed={activeEra === index}
              >
                <span className="timeline__dot" aria-hidden="true" />
                <span className="timeline__index">0{index + 1}</span>
                <span className="timeline__text">
                  <strong>{item.era}</strong>
                  <small>{item.marker}</small>
                </span>
              </button>
            </li>
          ))}
        </ol>
        <article className="timeline-detail reveal" aria-live="polite">
          <p className="eyebrow">Chapter {String(activeEra + 1).padStart(2, '0')}</p>
          <span className="ornament" aria-hidden="true">✦</span>
          <h3>{active.era}</h3>
          <p>{active.detail}</p>
        </article>
      </div>
      <p className="fiction-note">This timeline describes fictional events within the world of Westeros; it is not real-world history.</p>
    </section>
  )
}

function CreaturesSection() {
  const [activeCreature, setActiveCreature] = useState(0)
  const creature = CREATURES[activeCreature]

  return (
    <section className="creatures-section section-shell" id="creatures" aria-labelledby="creatures-section-title">
      <SectionHeading
        eyebrow="Beyond the songs of men"
        title={<>Old magic. <em>Older fears.</em></>}
        intro="Dragons, direwolves, and the beings woven into Westeros’s oldest stories."
        titleId="creatures-section-title"
      />
      <div className="creature-feature">
        <div className="creature-feature__art reveal">
          <img
            src="/images/three.png"
            alt="Three-headed dragon sigil of House Targaryen"
            loading="lazy"
            width="2048"
            height="2048"
          />
          <span className="creature-feature__caption">The dragon sigil of House Targaryen</span>
        </div>
        <div className="creature-feature__story reveal" aria-live="polite">
          <p className="eyebrow">{creature.kind}</p>
          <h3>{creature.name}</h3>
          <p>{creature.detail}</p>
          <div className="creature-list" aria-label="Choose a creature to discover">
            {CREATURES.map((item, index) => (
              <button
                className={`creature-list__item ${activeCreature === index ? 'creature-list__item--active' : ''}`}
                key={item.name}
                type="button"
                onClick={() => setActiveCreature(index)}
                aria-pressed={activeCreature === index}
              >
                <span>0{index + 1}</span>{item.name}<span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="asset-note">The illustration is a house sigil; it is not a portrait of a specific dragon.</p>
    </section>
  )
}

function BattlesSection() {
  const [activeBattle, setActiveBattle] = useState(0)
  const battle = BATTLES[activeBattle]

  return (
    <section className="battles-section section-shell" id="battles" aria-labelledby="battles-section-title">
      <SectionHeading
        eyebrow="When the realm takes up arms"
        title={<>The turning points of <em>war.</em></>}
        intro="Conflicts remembered not only for who prevailed, but for what the realm lost."
        titleId="battles-section-title"
      />
      <div className="battle-layout">
        <div className="battle-picker" role="group" aria-label="Choose an iconic battle">
          {BATTLES.map((item, index) => (
            <button
              className={`battle-picker__item ${activeBattle === index ? 'battle-picker__item--active' : ''}`}
              key={item.name}
              type="button"
              onClick={() => setActiveBattle(index)}
              aria-pressed={activeBattle === index}
            >
              <span className="battle-picker__index">0{index + 1}</span>
              <span className="battle-picker__name">{item.name}</span>
              <span className="battle-picker__place">{item.place}</span>
              <span className="battle-picker__arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <article className="battle-detail reveal" aria-live="polite">
          <span className="battle-detail__ornament" aria-hidden="true">✦</span>
          <p className="eyebrow">{battle.place}</p>
          <h3>{battle.name}</h3>
          <p className="battle-detail__sides">{battle.sides}</p>
          <span className="detail-dialog__rule" aria-hidden="true" />
          <p>{battle.detail}</p>
        </article>
      </div>
    </section>
  )
}

function ThroneSection() {
  return (
    <section className="throne-section section-shell" id="throne" aria-labelledby="throne-title">
      <div className="throne-panel reveal">
        <div className="throne-art" aria-hidden="true">
          <span className="throne-art__back" />
          <span className="throne-art__seat" />
          <span className="throne-art__base" />
          <span className="throne-art__glow" />
        </div>
        <div className="throne-copy">
          <p className="eyebrow">A seat forged from surrender</p>
          <span className="ornament" aria-hidden="true">✦</span>
          <h2 className="section-title" id="throne-title">The Iron <em>Throne.</em></h2>
          <p>
            More than a crown’s resting place, the throne is the realm’s most
            enduring symbol of power — and of the lives spent reaching for it.
            Every ruler inherits its history along with its burden.
          </p>
          <div className="throne-actions">
            <a className="button button--gold" href="#timeline">Trace its legacy</a>
            <a className="button button--outline" href="#houses">Meet the claimants</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function DetailsDialog({ detail, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!detail) return undefined

    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')
        if (!focusable?.length) {
          event.preventDefault()
          return
        }

        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus()
    }
  }, [detail, onClose])

  if (!detail) return null

  const { item, kind } = detail
  const title = kind === 'house' ? `House ${item.name}` : item.name
  const eyebrow = kind === 'house' ? item.region : item.house
  const subline = kind === 'house' ? item.seat : item.role

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section
        className="detail-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-dialog-title"
        ref={dialogRef}
        tabIndex={-1}
        style={{ '--dialog-accent': item.accent }}
      >
        <button className="dialog-close" type="button" aria-label="Close details" onClick={onClose}>×</button>
        <div className="detail-dialog__image">
          <img src={item.image} alt={kind === 'house' ? `${item.name} house emblem` : `${item.house} emblem`} />
        </div>
        <div className="detail-dialog__content">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="detail-dialog-title">{title}</h2>
          <p className="detail-dialog__subline">{kind === 'house' ? item.words : subline}</p>
          <span className="detail-dialog__rule" aria-hidden="true" />
          <p>{item.description}</p>
          {kind === 'house' && <p className="detail-dialog__sigil">Sigil: {item.sigil}</p>}
        </div>
      </section>
    </div>
  )
}

function App() {
  const appRef = useRef(null)
  const [activeSection, setActiveSection] = useState('home')
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [detail, setDetail] = useState(null)
  const [showTop, setShowTop] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const context = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.fromTo(element, { y: 22, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: .8,
          ease: 'power2.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        })
      })

      gsap.to('.hero__video', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
      })
    }, appRef)

    return () => context.revert()
  }, [])

  useEffect(() => {
    let frame = 0
    const updateScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight
        const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0
        document.documentElement.style.setProperty('--scroll-progress', `${progress}%`)
        setIsScrolled(window.scrollY > 24)
        setShowTop(window.scrollY > window.innerHeight * .7)
        frame = 0
      })
    }

    window.addEventListener('scroll', updateScroll, { passive: true })
    updateScroll()
    return () => {
      window.removeEventListener('scroll', updateScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean)
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      if (visible[0]) setActiveSection(visible[0].target.id)
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, .1, .25, .5] })

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const openHouse = (item) => setDetail({ kind: 'house', item })
  const openCharacter = (item) => setDetail({ kind: 'character', item })
  const closeDetail = useCallback(() => setDetail(null), [])

  return (
    <div className="app-shell" ref={appRef}>
      <div className="scroll-progress" aria-hidden="true" />
      <div className={`loading-screen ${loading ? '' : 'loading-screen--hidden'}`} aria-hidden={!loading}>
        <span className="loading-screen__sigil" aria-hidden="true">✦</span>
        <p>Opening the chronicles</p>
        <span className="loading-screen__line" />
      </div>
      <Navigation
        activeSection={activeSection}
        isScrolled={isScrolled}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      <main>
        <Hero />
        <IntroductionSection />
        <WorldSection />
        <Section1 onSelectHouse={openHouse} />
        <CharactersSection onSelectCharacter={openCharacter} />
        <TimelineSection />
        <CreaturesSection />
        <BattlesSection />
        <ThroneSection />
        <GamesHall />
        <section className="about-section section-shell" id="about" aria-labelledby="about-title">
          <div className="about-panel reveal">
            <p className="eyebrow">A living legend</p>
            <span className="ornament" aria-hidden="true">✦</span>
            <h2 className="section-title" id="about-title">Every crown casts <em>a shadow.</em></h2>
            <p className="about-copy">
              Across ancient forests, mountain strongholds, and the halls of power, the story of Westeros is carried by its people, their loyalties, and the choices they make.
            </p>
            <a className="button button--outline" href="#home">Return to the beginning</a>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <a className="brand brand--footer" href="#home"><span className="brand__mark" aria-hidden="true">✦</span><span>Chronicles <i>of</i> Westeros</span></a>
        <p>A fan-made, fictional world guide. Not affiliated with the rights holders.</p>
        <a className="footer-top" href="#home" aria-label="Back to top">Back to top ↑</a>
      </footer>
      {showTop && <a className="back-to-top" href="#home" aria-label="Back to top">↑</a>}
      <DetailsDialog detail={detail} onClose={closeDetail} />
    </div>
  )
}

export default App
