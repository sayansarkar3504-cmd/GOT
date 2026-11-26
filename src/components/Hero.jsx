import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './Hero.css'

function Hero() {
  const heroRef = useRef(null)

  useEffect(() => {
    const hero = heroRef.current
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const context = gsap.context(() => {
      gsap.fromTo(
        '.hero-reveal',
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.14, ease: 'power3.out', delay: 0.2 },
      )
    }, hero)

    return () => context.revert()
  }, [])

  return (
    <section className="hero" id="home" ref={heroRef} aria-labelledby="hero-title">
      <video
        className="hero__video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/one.jpg"
        aria-hidden="true"
      >
        <source src="/video/one.mp4" type="video/mp4" />
      </video>
      <div className="hero__shade" aria-hidden="true" />
      <div className="hero__grain" aria-hidden="true" />
      <div className="hero__frame" aria-hidden="true" />

      <div className="hero__content">
        <p className="eyebrow hero-reveal">A realm of ice, fire &amp; legacy</p>
        <h1 className="hero__title hero-reveal" id="hero-title">
          <span className="hero__line">THE CHRONICLES</span>
          <span className="hero__line hero__line--gold">OF WESTEROS</span>
        </h1>
        <p className="hero__tagline hero-reveal">When Kings Rise, Legends Are Born.</p>
        <div className="hero__actions hero-reveal">
          <a className="button button--gold" href="#introduction">Explore Westeros</a>
          <a className="button button--outline" href="#houses">Discover the Great Houses</a>
        </div>
      </div>

      <a className="hero__scroll" href="#introduction" aria-label="Scroll to explore Westeros">
        <span>Scroll to explore</span>
        <i aria-hidden="true" />
      </a>
      <span className="hero__edition">An illustrated guide to the Seven Kingdoms</span>
    </section>
  )
}

export default Hero
