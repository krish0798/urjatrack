import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SlabGuard from '../components/SlabGuard';

const steps = [
  {
    number: '01',
    title: 'Log a reading',
    body: 'Add your latest meter reading in seconds and keep your energy history in one clear place.',
  },
  {
    number: '02',
    title: 'See your projection',
    body: 'UrjaTrack calculates your projected monthly bill with the right telescopic slab logic.',
  },
  {
    number: '03',
    title: 'Get a timely nudge',
    body: 'Know when you are approaching a costlier slab before the next bill arrives.',
  },
];

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

function DashboardMockup() {
  return (
    <div className="mockup-shell" aria-label="Preview of the UrjaTrack energy dashboard">
      <div className="mockup-topbar">
        <div className="mockup-brand"><BrandMark /> urjatrack</div>
        <div className="mockup-top-actions"><span>Overview</span><span>History</span><span className="avatar">U</span></div>
      </div>
      <div className="mockup-content">
        <div className="mockup-heading-row">
          <div><p className="mockup-kicker">GOOD EVENING, USER</p><h3>Your energy overview</h3></div>
          <span className="mockup-date">September 2026 <b>⌄</b></span>
        </div>
        <div className="stat-grid">
          <div className="stat-card featured"><p>UNITS CONSUMED</p><strong>218 <small>kWh</small></strong><span className="positive">↗ 8.4% from last month</span></div>
          <div className="stat-card"><p>PROJECTED BILL</p><strong>₹2,486</strong><span className="muted">Based on current usage</span></div>
          <div className="stat-card"><p>DAYS LEFT</p><strong>12</strong><span className="muted">Until billing cycle resets</span></div>
        </div>
        <div className="chart-card">
          <div className="chart-label"><div><p>DAILY CONSUMPTION</p><strong>7.2 kWh <i>average</i></strong></div><span>Last 14 days　⌄</span></div>
          <div className="chart-area">
            <div className="chart-grid"><i /><i /><i /><i /></div>
            <svg viewBox="0 0 760 150" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ffd60a" stopOpacity=".34" />
                  <stop offset="1" stopColor="#ffd60a" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 116 C32 106 42 81 78 91 S120 120 151 95 S184 78 211 87 S246 67 278 76 S314 112 342 89 S376 56 410 72 S446 101 478 78 S514 50 543 62 S575 88 604 69 S642 35 672 54 S718 62 760 24 V150 H0 Z" fill="url(#chartFill)" />
              <path d="M0 116 C32 106 42 81 78 91 S120 120 151 95 S184 78 211 87 S246 67 278 76 S314 112 342 89 S376 56 410 72 S446 101 478 78 S514 50 543 62 S575 88 604 69 S642 35 672 54 S718 62 760 24" fill="none" stroke="#ffd60a" strokeWidth="3" />
            </svg>
          </div>
          <div className="chart-days"><span>01 Sep</span><span>05 Sep</span><span>09 Sep</span><span>13 Sep</span><span>17 Sep</span></div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="site-shell">
      <div className="star-field" aria-hidden="true" />
      <div className="circuit-grid" aria-hidden="true" />
      <div className="ambient-glow" aria-hidden="true" />

      <header className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <Link className="wordmark" to="/" aria-label="UrjaTrack home"><BrandMark /><span>urjatrack</span></Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#dashboard">Dashboard</a>
        </nav>
        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="login-link">Dashboard</Link>
              <Link to="/profile" className="signup-link">Go to app <span>↗</span></Link>
            </>
          ) : (
            <>
              <Link to="/login" className="login-link">Log in</Link>
              <Link to="/signup" className="signup-link">Start tracking <span>↗</span></Link>
            </>
          )}
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> SMART ENERGY MONITORING</p>
          <h1>Know your bill<br /><span>before it arrives.</span></h1>
          <p className="hero-subtitle">Track your daily consumption, predict your monthly bill with precision, and get a timely alert before you cross into a costlier slab.</p>
          <div className="hero-actions">
            <Link className="button button-primary" to={isAuthenticated ? '/profile' : '/signup'}>Start Tracking <span>↗</span></Link>
            <a className="button button-secondary" href="#how-it-works">Learn more <span>↓</span></a>
          </div>
        </div>
        <div className="hero-floor" aria-hidden="true"><div className="floor-glow" /><div className="perspective-grid" /></div>
        <div className="mockup-wrap" id="dashboard"><DashboardMockup /></div>
      </section>

      <section className="how-section" id="how-it-works">
        <p className="section-eyebrow">A clearer way to use energy</p>
        <h2>Stay one step ahead<br />of your <span>electricity bill.</span></h2>
        <div className="steps-grid">
          {steps.map((step) => (
            <article className="step-card" key={step.number}>
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <span className="step-arrow">↗</span>
            </article>
          ))}
        </div>
      </section>

      {/* ── SlabGuard Preview / Live Section ── */}
      <section className="slabguard-section" id="slabguard">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p className="section-eyebrow">Try it yourself</p>
          <h2>Your slab <span>calculator.</span></h2>
        </div>
        <SlabGuard />
      </section>

      <footer className="site-footer">
        <Link className="wordmark" to="/"><BrandMark /><span>urjatrack</span></Link>
        <span>Make every unit count.</span>
      </footer>
    </main>
  );
}
