import { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState('tiers')
  const [selectedPlanToast, setSelectedPlanToast] = useState(null)
  const [contactSubmitted, setContactSubmitted] = useState(false)
  const [aiQuery, setAiQuery] = useState('')
  const [aiResponse, setAiResponse] = useState(
    '“38 esteemed members are scheduled for renewal this week. Automated reminders have been dispatched with an anticipated 98.4% retention rate.”'
  )

  // Handle header blur on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-dismiss plan selection toast after 4s
  useEffect(() => {
    if (selectedPlanToast) {
      const timer = setTimeout(() => setSelectedPlanToast(null), 4200)
      return () => clearTimeout(timer)
    }
  }, [selectedPlanToast])

  const simulatedAiAnswers = {
    renewals:
      '“38 esteemed members are scheduled for renewal this week. Personalized concierge notices have been dispatched with an anticipated 98.4% retention rate.”',
    attendance:
      '“Today’s attendance: 214 verified visits across salon & lounge private gates. Peak occupancy occurred at 11:30 AM.”',
    tiers:
      '“Membership Roster: Classic (54%), Royale Reserve (32%), Sovereign Circle (14%). 18 members recently advanced to Royale status.”',
    passes:
      '“Digital pass cryptographic engine: 1,482 verified passes active with rotating 256-bit NFC/QR tokens. Zero security breaches recorded.”'
  }

  const handleAiSimulate = (key) => {
    if (simulatedAiAnswers[key]) {
      setAiResponse(simulatedAiAnswers[key])
    }
  }

  const handleCustomAiSubmit = (e) => {
    e.preventDefault()
    if (!aiQuery.trim()) return

    const q = aiQuery.toLowerCase()
    let response =
      '“MemberPass AI: Platform telemetry is optimal. All membership rosters, bespoke privileges, and automated renewal triggers are operating flawlessly.”'

    if (q.includes('renew') || q.includes('expir')) {
      response = simulatedAiAnswers.renewals
    } else if (q.includes('attend') || q.includes('check') || q.includes('visit') || q.includes('today')) {
      response = simulatedAiAnswers.attendance
    } else if (q.includes('tier') || q.includes('plan') || q.includes('level')) {
      response = simulatedAiAnswers.tiers
    } else if (q.includes('pass') || q.includes('qr') || q.includes('code') || q.includes('card')) {
      response = simulatedAiAnswers.passes
    }

    setAiResponse(response)
    setAiQuery('')
  }

  const handlePlanSelect = (planName) => {
    setSelectedPlanToast(`You have selected the ${planName}. Our private membership director will connect with you within 2 business hours.`)
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    setContactSubmitted(true)
    setTimeout(() => setContactSubmitted(false), 5000)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="royale-app">
      {/* Toast Notification */}
      {selectedPlanToast && (
        <div className="toast-notification" role="status" aria-live="polite">
          <div className="toast-icon">✦</div>
          <div className="toast-body">
            <strong>Membership Privilege Initiated</strong>
            <p>{selectedPlanToast}</p>
          </div>
          <button className="toast-close" onClick={() => setSelectedPlanToast(null)} aria-label="Close notification">×</button>
        </div>
      )}

      {/* =========================================================================
          1. ELEGANT NAVBAR
          ========================================================================= */}
      <header className={`royale-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <a href="#home" className="brand-logo" aria-label="MemberPass Home">
            <span className="crest-mark">
              <span className="crest-monogram">M</span>
              <span className="crest-sparkle">✦</span>
            </span>
            <div className="brand-text">
              <span className="brand-name">Member<span className="highlight-rose">Pass</span></span>
            </div>
          </a>

          <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#plans" onClick={() => setMobileMenuOpen(false)}>Membership Plans</a>
            <a href="#workflow" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>

            <div className="mobile-cta-wrap">
              <a href="#plans" className="btn-primary btn-sm" onClick={() => setMobileMenuOpen(false)}>
                <span>Claim Your Pass</span>
                <span className="btn-arrow">→</span>
              </a>
            </div>
          </nav>

          <div className="nav-actions">
            <a href="#plans" className="btn-primary desktop-cta">
              <span>Claim Your Pass</span>
              <span className="btn-arrow">→</span>
            </a>

            <button
              className={`hamburger-toggle ${mobileMenuOpen ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* =========================================================================
            2. HERO SECTION
            ========================================================================= */}
        <section className="hero-section" id="home">
          <div className="hero-grid">
            <div className="hero-text-content">
              <div className="luxury-eyebrow">
              </div>

              <h1 className="hero-headline">
                Your Membership,
                <br />
                <span className="serif-italic-accent">Elevated to Distinction.</span>
              </h1>

              <p className="hero-subhead">
                Smart Membership Management Powered by AI
              </p>

              <p className="hero-description">
                Imbue your private club, executive association, or luxury wellness collective with peerless distinction.
                MemberPass orchestrates bespoke guest onboarding, automated tier governance, and cryptographic digital passes
                within an impeccably refined digital environment.
              </p>

              <div className="hero-ctas">
                <a href="#plans" className="btn-primary btn-lg">
                  <span>Get Started</span>
                  <span className="btn-arrow">→</span>
                </a>
                <a href="#plans" className="btn-outline btn-lg">
                  <span>Explore Plans</span>
                  <span className="btn-chevron">▾</span>
                </a>
              </div>

              <div className="hero-trust-bar">
                <div className="trust-pill">
                  <span className="pill-check">✓</span>
                  <span>99.8% Access Precision</span>
                </div>
                <div className="trust-divider"></div>
                <div className="trust-pill">
                  <span className="pill-check">✓</span>
                  <span>Sub-Second NFC Validation</span>
                </div>
                <div className="trust-divider"></div>
                <div className="trust-pill">
                  <span className="pill-check">✓</span>
                  <span>Private Cryptographic Pass</span>
                </div>
              </div>
            </div>

            {/* DIGITAL MEMBERSHIP CARD MOCKUP */}
            <div className="hero-card-col">
              <div className="card-stage">
                <div className="digital-pass-card">
                  {/* Subtle Guilloché Watermark */}
                  <div className="card-watermark" aria-hidden="true"></div>

                  {/* Card Top Row */}
                  <div className="pass-card-top">
                    <div className="pass-crest">
                      <span className="crest-symbol">M</span>
                      <div className="crest-details">
                        <span className="crest-title">MEMBERPASS ROYALE</span>
                        <span className="crest-sub">SOVEREIGN ENCLAVE</span>
                      </div>
                    </div>
                    <div className="pass-status-pill">
                      <span className="pulsing-emerald"></span>
                      <span>ACTIVE • VERIFIED</span>
                    </div>
                  </div>

                  {/* Pass Category Chip */}
                  <div className="pass-tier-ribbon">
                    <span className="ribbon-sparkle">✦</span>
                    <span className="ribbon-text">EXECUTIVE ROYALE RESERVE</span>
                  </div>

                  {/* Member Profile Row */}
                  <div className="pass-member-profile">
                    <div className="pass-avatar">
                      <span>SJ</span>
                    </div>
                    <div className="member-meta">
                      <h3 className="member-name">Sarah Jenkins</h3>
                      <p className="member-role">Private Executive Fellow</p>
                      <code className="pass-code">ID: MP-2026-8894X</code>
                    </div>
                  </div>

                  {/* Divider with Central Rose Diamond */}
                  <div className="card-ornament-divider">
                    <div className="divider-line"></div>
                    <span className="divider-diamond">✦</span>
                    <div className="divider-line"></div>
                  </div>

                  {/* Card Footer Details & QR Code */}
                  <div className="pass-card-bottom">
                    <div className="pass-metadata-grid">
                      <div className="meta-block">
                        <span className="meta-label">MEMBERSHIP PLAN</span>
                        <strong className="meta-value">Royale Reserve</strong>
                      </div>
                      <div className="meta-block">
                        <span className="meta-label">VALID THRU</span>
                        <strong className="meta-value">31 DEC 2027</strong>
                      </div>
                      <div className="meta-block">
                        <span className="meta-label">SECURITY KEY</span>
                        <strong className="meta-value font-mono">TOKEN-256B</strong>
                      </div>
                    </div>

                    <div className="pass-qr-container">
                      <div className="qr-frame">
                        <svg viewBox="0 0 80 80" className="qr-svg" role="img" aria-label="Digital pass verification QR code">
                          <rect width="80" height="80" rx="6" fill="#FFF9F5" />
                          <g fill="#451126">
                            {/* Position Detection Squares */}
                            <path d="M7 7h22v22H7zm4 4v14h14V11zM51 7h22v22H51zm4 4v14h14V11zM7 51h22v22H7zm4 4v14h14V55z" />
                            {/* Inner Center Points */}
                            <rect x="14" y="14" width="8" height="8" rx="1" fill="#6D1835" />
                            <rect x="58" y="14" width="8" height="8" rx="1" fill="#6D1835" />
                            <rect x="14" y="58" width="8" height="8" rx="1" fill="#6D1835" />
                            {/* Data Pattern */}
                            <path d="M36 7h8v5h-8zm0 10h8v8h-8zm0 16h6v6h-6zm8 4h8v6h-8zm-14 8h6v6h-6zm14 0h6v6h-6zm12-14h8v6h-8zm0 10h8v8h-8zm-22 14h8v6h-8zm12 0h8v6h-8zm-12 10h8v6h-8zm16-4h6v10h-6zm8-6h6v12h-6z" />
                          </g>
                        </svg>
                        <div className="qr-micro-crest">✦</div>
                      </div>
                      <span className="qr-caption">SCAN PASS</span>
                    </div>
                  </div>

                  <div className="card-bottom-bar">
                    <span className="bar-tag">ENCRYPTED CREDENTIAL IDENTIFICATION</span>
                    <span className="bar-brand">MEMBERPASS</span>
                  </div>
                </div>

                {/* Floating Micro-Widgets */}
                <div className="floating-badge badge-top-right">
                  <div className="badge-icon icon-gold">✦</div>
                  <div className="badge-text">
                    <strong>AI Concierge Active</strong>
                    <p>Retention predicted at 98.4%</p>
                  </div>
                </div>

                <div className="floating-badge badge-bottom-left">
                  <div className="badge-icon icon-emerald">✓</div>
                  <div className="badge-text">
                    <strong>Digital Pass Verified</strong>
                    <p>Salon Privé • Access Granted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            STATS SECTION
            ========================================================================= */}
        <section className="stats-strip">
          <div className="stats-inner">
            <div className="stat-card">
              <span className="stat-number">99.8%</span>
              <span className="stat-label">Automation Precision</span>
              <p className="stat-detail">Seamless renewal forecasting without administrative overhead</p>
            </div>
            <div className="stat-divider-vertical"></div>
            <div className="stat-card">
              <span className="stat-number">3.5×</span>
              <span className="stat-label">Faster Onboarding</span>
              <p className="stat-detail">Instant cryptographic credential distribution to mobile wallets</p>
            </div>
            <div className="stat-divider-vertical"></div>
            <div className="stat-card">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Intelligent Oversight</span>
              <p className="stat-detail">Context-aware AI concierge serving member queries at all hours</p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. ABOUT SECTION
            ========================================================================= */}
        <section className="section-padding about-section" id="about">
          <div className="section-header text-center">
            <span className="section-kicker">ABOUT MEMBERPASS</span>
            <h2 className="section-heading">Where Discretion Meets Intelligent Governance</h2>
            <p className="section-subtext">
              Traditional institutions are encumbered by physical badge losses, fragmented rosters,
              and impersonal reminders. MemberPass creates an uncompromising, centralized ecosystem
              engineered for private clubs, corporate societies, and premier memberships.
            </p>
          </div>

          <div className="about-grid">
            <div className="about-feature-box">
              <div className="box-icon">
                <i className="fa-solid fa-gem"></i>
              </div>
              <h3 className="box-title">Preserving Brand Prestige</h3>
              <p className="box-desc">
                Elevate your member touchpoints from their very first invitation. Deliver high-resolution,
                tamper-proof digital credentials that reflect the bespoke quality of your physical sanctuary.
              </p>
            </div>

            <div className="about-feature-box">
              <div className="box-icon">
                <i className="fa-solid fa-brain"></i>
              </div>
              <h3 className="box-title">Autonomous AI Optimization</h3>
              <p className="box-desc">
                Our embedded machine learning model detects engagement anomalies early, triggers gracious
                renewal invitations, and dynamically adapts access levels according to member participation.
              </p>
            </div>

            <div className="about-feature-box">
              <div className="box-icon">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h3 className="box-title">Cryptographic Data Sovereignty</h3>
              <p className="box-desc">
                Member records, sensitive profile attributes, and private visitation logs are strictly shielded
                with enterprise-grade encryption and granular role-based administrative permissions.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. FEATURES SECTION
            ========================================================================= */}
        <section className="section-padding features-section" id="features">
          <div className="section-header text-center">
            <span className="section-kicker">CURATED CAPABILITIES</span>
            <h2 className="section-heading">Architected for Distinguished Operations</h2>
            <p className="section-subtext">
              Every tool within MemberPass is crafted to reduce friction, eliminate paper dependencies,
              and empower community directors with deep operational clarity.
            </p>
          </div>

          <div className="features-quad-grid">
            {/* Feature 1 */}
            <article className="feature-royal-card">
              <div className="card-header-icon">
                <i className="fa-solid fa-sliders"></i>
              </div>
              <span className="card-sub-tag">CORE PLATFORM</span>
              <h3 className="feature-card-title">Smart Membership Management</h3>
              <p className="feature-card-desc">
                Effortlessly structure bespoke multi-tier privileges, configure subscription validity periods,
                and automate transitions from candidate status to lifetime fellow.
              </p>
              <ul className="feature-checklist">
                <li><span className="check-bullet">✦</span> Custom Tier Hierarchies & Privileges</li>
                <li><span className="check-bullet">✦</span> Automated Expiry & Transition Triggers</li>
                <li><span className="check-bullet">✦</span> Seamless Pass Upgrades & Revocations</li>
              </ul>
            </article>

            {/* Feature 2 */}
            <article className="feature-royal-card">
              <div className="card-header-icon">
                <i className="fa-solid fa-robot"></i>
              </div>
              <span className="card-sub-tag">AI CONCIERGE</span>
              <h3 className="feature-card-title">AI Assistant</h3>
              <p className="feature-card-desc">
                An intelligent conversational co-pilot for administrators and members. Obtain instantaneous
                roster analytics, churn risk assessments, and automatic inquiry resolution.
              </p>
              <ul className="feature-checklist">
                <li><span className="check-bullet">✦</span> Predictive Retention & Churn Alerts</li>
                <li><span className="check-bullet">✦</span> Conversational Query Answering</li>
                <li><span className="check-bullet">✦</span> Proactive VIP Attention Notifications</li>
              </ul>
            </article>

            {/* Feature 3 */}
            <article className="feature-royal-card">
              <div className="card-header-icon">
                <i className="fa-solid fa-address-book"></i>
              </div>
              <span className="card-sub-tag">CONFIDENTIAL REGISTRY</span>
              <h3 className="feature-card-title">Member Information Management</h3>
              <p className="feature-card-desc">
                A unified, encrypted directory. Maintain rich dossiers, emergency contacts, preference nuances,
                and credential histories with rapid semantic filtering.
              </p>
              <ul className="feature-checklist">
                <li><span className="check-bullet">✦</span> Unified Confidential Member Dossiers</li>
                <li><span className="check-bullet">✦</span> Lightning-Fast Tag & Attribute Search</li>
                <li><span className="check-bullet">✦</span> Bank-Grade Data Protection Protocols</li>
              </ul>
            </article>

            {/* Feature 4 */}
            <article className="feature-royal-card">
              <div className="card-header-icon">
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <span className="card-sub-tag">REAL-TIME ACCESS</span>
              <h3 className="feature-card-title">Membership Tracking</h3>
              <p className="feature-card-desc">
                Monitor real-time gate verifications, attendance frequency, dining reservations,
                and forthcoming renewal horizons via an intuitive, live telemetry dashboard.
              </p>
              <ul className="feature-checklist">
                <li><span className="check-bullet">✦</span> Sub-Second QR & NFC Access Logs</li>
                <li><span className="check-bullet">✦</span> Live Facility Occupancy Heatmaps</li>
                <li><span className="check-bullet">✦</span> Automated Renewal Countdown Feeds</li>
              </ul>
            </article>
          </div>

          {/* Interactive Feature Demo Panel */}
          <div className="interactive-console-wrap">
            <div className="console-header">
              <div className="console-title">
                <span className="console-icon">✦</span>
                <span>Interactive MemberPass Preview Console</span>
              </div>
              <div className="console-tabs" role="tablist">
                <button
                  className={`tab-btn ${activeTab === 'tiers' ? 'active' : ''}`}
                  onClick={() => setActiveTab('tiers')}
                  role="tab"
                  aria-selected={activeTab === 'tiers'}
                >
                  Smart Tiers
                </button>
                <button
                  className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
                  onClick={() => setActiveTab('ai')}
                  role="tab"
                  aria-selected={activeTab === 'ai'}
                >
                  AI Assistant
                </button>
                <button
                  className={`tab-btn ${activeTab === 'telemetry' ? 'active' : ''}`}
                  onClick={() => setActiveTab('telemetry')}
                  role="tab"
                  aria-selected={activeTab === 'telemetry'}
                >
                  Live Telemetry
                </button>
              </div>
            </div>

            <div className="console-body">
              {activeTab === 'tiers' && (
                <div className="tab-pane-content fade-in">
                  <div className="pane-split">
                    <div className="pane-narrative">
                      <h4>Dynamic Privilege Governance Engine</h4>
                      <p>
                        Calibrate automated promotion criteria. When fellows achieve visitation milestones,
                        their digital pass seamlessly morphs to unlock heightened access privileges.
                      </p>
                      <div className="console-code-badge">
                        <code>RULE: CheckIns &gt; 30 → Automatically Advance to [Royale Reserve]</code>
                      </div>
                    </div>

                    <div className="pane-widget">
                      <div className="tier-pill-row">
                        <div className="tier-chip chip-classic">
                          <span className="chip-name">Classic</span>
                          <span className="chip-desc">Standard Access</span>
                        </div>
                        <div className="tier-chip chip-royale active-chip">
                          <span className="chip-name">Royale Reserve</span>
                          <span className="chip-desc">Featured Tier</span>
                        </div>
                        <div className="tier-chip chip-sovereign">
                          <span className="chip-name">Sovereign Circle</span>
                          <span className="chip-desc">All-Privilege</span>
                        </div>
                      </div>

                      <div className="progress-box">
                        <div className="progress-header">
                          <span>Milestone Progression: Sarah Jenkins</span>
                          <span className="text-burgundy"><strong>28 / 30 Visits</strong> (93%)</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-bar" style={{ width: '93%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="tab-pane-content fade-in">
                  <div className="pane-split">
                    <div className="pane-narrative">
                      <h4>Conversational Intelligence Co-Pilot</h4>
                      <p>
                        Inquire directly regarding roster health, retention projections, and VIP milestones.
                        Select a prompt below or enter an inquiry:
                      </p>
                      <div className="prompt-chips-wrap">
                        <button className="prompt-pill" onClick={() => handleAiSimulate('renewals')}>
                          &quot;Who expires this week?&quot;
                        </button>
                        <button className="prompt-pill" onClick={() => handleAiSimulate('attendance')}>
                          &quot;Today&#39;s salon attendance&quot;
                        </button>
                        <button className="prompt-pill" onClick={() => handleAiSimulate('tiers')}>
                          &quot;Tier breakdown&quot;
                        </button>
                        <button className="prompt-pill" onClick={() => handleAiSimulate('passes')}>
                          &quot;Cryptographic pass status&quot;
                        </button>
                      </div>
                    </div>

                    <div className="pane-widget chat-container">
                      <div className="chat-message-bubble">
                        <div className="chat-avatar-crest">✦</div>
                        <div className="chat-message-text">
                          <span className="chat-author">MemberPass Intelligence:</span>
                          <p>{aiResponse}</p>
                        </div>
                      </div>

                      <form className="console-chat-input" onSubmit={handleCustomAiSubmit}>
                        <input
                          type="text"
                          value={aiQuery}
                          onChange={(e) => setAiQuery(e.target.value)}
                          placeholder="Ask MemberPass AI (e.g. renewals, attendance, passes)..."
                        />
                        <button type="submit" className="chat-send-btn" aria-label="Submit inquiry">
                          <i className="fa-solid fa-paper-plane"></i>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'telemetry' && (
                <div className="tab-pane-content fade-in">
                  <div className="pane-split">
                    <div className="pane-narrative">
                      <h4>Real-Time Access & Verification Stream</h4>
                      <p>
                        Sub-second telemetry captured across facility portals, private suites,
                        and dining reservations in real time.
                      </p>
                      <div className="status-online-pill">
                        <span className="pulsing-emerald"></span>
                        <span>Stream Live & Encrypted</span>
                      </div>
                    </div>

                    <div className="pane-widget">
                      <div className="telemetry-feed">
                        <div className="feed-row">
                          <span className="feed-status-check">✓</span>
                          <div className="feed-details">
                            <strong>Lord Alistair Sterling (Sovereign Circle)</strong>
                            <p>Verified at Penthouse Salon • 14s ago</p>
                          </div>
                          <span className="feed-badge-ok">VERIFIED</span>
                        </div>

                        <div className="feed-row">
                          <span className="feed-status-check">✓</span>
                          <div className="feed-details">
                            <strong>Sarah Jenkins (Royale Reserve)</strong>
                            <p>Verified at West Wing Spa • 2m ago</p>
                          </div>
                          <span className="feed-badge-ok">VERIFIED</span>
                        </div>

                        <div className="feed-row warning-row">
                          <span className="feed-status-warn">!</span>
                          <div className="feed-details">
                            <strong>Marcus Chen (Classic Privilège)</strong>
                            <p>Annual pass expires in 4 days • Concierge notice queued</p>
                          </div>
                          <span className="feed-badge-warn">EXPIRING</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. MEMBERSHIP PLANS SECTION
            ========================================================================= */}
        <section className="section-padding plans-section" id="plans">
          <div className="section-header text-center">
            <span className="section-kicker">MEMBERSHIP TIERS</span>
            <h2 className="section-heading">Select Your Sovereign Standard</h2>
            <p className="section-subtext">
              Transparent, prestigious membership plans tailored to individual connoisseurs,
              private clubs, and elite organizations.
            </p>
          </div>

          <div className="plans-triptych-grid">
            {/* Plan 1: Classic */}
            <div className="plan-card">
              <div className="plan-header">
                <span className="plan-kicker">TIER I</span>
                <h3 className="plan-name">Classic Privilège</h3>
                <p className="plan-subtitle">Essential access for refined individual patrons</p>
                <div className="plan-price">
                  <span className="currency">$</span>
                  <span className="amount">1,200</span>
                  <span className="period">/ Year</span>
                </div>
              </div>

              <div className="plan-meta-specs">
                <div className="spec-row">
                  <span className="spec-label">VALIDITY</span>
                  <strong className="spec-value">12 Months Dedicated</strong>
                </div>
                <div className="spec-row">
                  <span className="spec-label">CLASSES & SESSIONS</span>
                  <strong className="spec-value">12 Private Masterclasses</strong>
                </div>
              </div>

              <div className="plan-features-list">
                <div className="feature-item">
                  <span className="check-rose">✓</span>
                  <span>Verified Digital Pass with Dynamic QR</span>
                </div>
                <div className="feature-item">
                  <span className="check-rose">✓</span>
                  <span>Primary Facility & Salon Access</span>
                </div>
                <div className="feature-item">
                  <span className="check-rose">✓</span>
                  <span>Standard Concierge Reservations</span>
                </div>
                <div className="feature-item">
                  <span className="check-rose">✓</span>
                  <span>2 Curated Guest Day Invitations / Year</span>
                </div>
              </div>

              <button
                className="btn-plan btn-plan-outline"
                onClick={() => handlePlanSelect('Classic Privilège Plan')}
              >
                Choose Classic Plan
              </button>
            </div>

            {/* Plan 2: Royale Reserve (Featured) */}
            <div className="plan-card featured-plan">
              <div className="featured-ribbon">
                <span>✦ RECOMMENDED TIER ✦</span>
              </div>

              <div className="plan-header">
                <span className="plan-kicker">TIER II</span>
                <h3 className="plan-name">Royale Reserve</h3>
                <p className="plan-subtitle">Our flagship standard for executive connoisseurs</p>
                <div className="plan-price">
                  <span className="currency">$</span>
                  <span className="amount">2,800</span>
                  <span className="period">/ Year</span>
                </div>
              </div>

              <div className="plan-meta-specs">
                <div className="spec-row">
                  <span className="spec-label">VALIDITY</span>
                  <strong className="spec-value">12 Months Priority Uncapped</strong>
                </div>
                <div className="spec-row">
                  <span className="spec-label">CLASSES & SESSIONS</span>
                  <strong className="spec-value">36 Private Executive Sessions</strong>
                </div>
              </div>

              <div className="plan-features-list">
                <div className="feature-item">
                  <span className="check-gold">✓</span>
                  <span>Cryptographic NFC & Dynamic QR Pass</span>
                </div>
                <div className="feature-item">
                  <span className="check-gold">✓</span>
                  <span>Unrestricted Salon, Lounge & Terrace Privileges</span>
                </div>
                <div className="feature-item">
                  <span className="check-gold">✓</span>
                  <span>24/7 Dedicated AI Concierge Oversight</span>
                </div>
                <div className="feature-item">
                  <span className="check-gold">✓</span>
                  <span>Priority Dining & Suite Reservation Guarantees</span>
                </div>
                <div className="feature-item">
                  <span className="check-gold">✓</span>
                  <span>Unlimited Guest Pass Privileges</span>
                </div>
              </div>

              <button
                className="btn-plan btn-plan-featured"
                onClick={() => handlePlanSelect('Royale Reserve Plan')}
              >
                Claim Royale Reserve
              </button>
            </div>

            {/* Plan 3: Sovereign Circle */}
            <div className="plan-card">
              <div className="plan-header">
                <span className="plan-kicker">TIER III</span>
                <h3 className="plan-name">Sovereign Circle</h3>
                <p className="plan-subtitle">The zenith of worldwide institutional distinction</p>
                <div className="plan-price">
                  <span className="currency">$</span>
                  <span className="amount">5,500</span>
                  <span className="period">/ Year</span>
                </div>
              </div>

              <div className="plan-meta-specs">
                <div className="spec-row">
                  <span className="spec-label">VALIDITY</span>
                  <strong className="spec-value">Annual Multi-City Sovereign Access</strong>
                </div>
                <div className="spec-row">
                  <span className="spec-label">CLASSES & SESSIONS</span>
                  <strong className="spec-value">Unlimited Masterclasses & Private Suites</strong>
                </div>
              </div>

              <div className="plan-features-list">
                <div className="feature-item">
                  <span className="check-rose">✓</span>
                  <span>Reciprocal Privileges at 40+ Global Partner Clubs</span>
                </div>
                <div className="feature-item">
                  <span className="check-rose">✓</span>
                  <span>Personal Dedicated Membership Director</span>
                </div>
                <div className="feature-item">
                  <span className="check-rose">✓</span>
                  <span>Lifetime Biometric Member Identification</span>
                </div>
                <div className="feature-item">
                  <span className="check-rose">✓</span>
                  <span>Complete Family & Associate Credential Suite</span>
                </div>
              </div>

              <button
                className="btn-plan btn-plan-outline"
                onClick={() => handlePlanSelect('Sovereign Circle Plan')}
              >
                Choose Sovereign Plan
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. TESTIMONIAL & TRUST SECTION
            ========================================================================= */}
        <section className="section-padding testimonials-section">
          <div className="section-header text-center">
            <span className="section-kicker">PATRON ENDORSEMENTS</span>
            <h2 className="section-heading">Trusted by Prestigious Enclaves</h2>
            <p className="section-subtext">
              Discover how premier clubs and luxury residential communities elevate member retention
              with MemberPass.
            </p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="quote-mark">“</div>
              <p className="testimonial-quote">
                MemberPass brought unprecedented poise to our private member verification.
                Our fellows appreciate having an elegant, contactless digital card in Apple Wallet,
                and our staff saves hundreds of administrative hours each renewal season.
              </p>
              <div className="author-row">
                <div className="author-avatar">EG</div>
                <div className="author-meta">
                  <strong>Eleanor Grosvenor</strong>
                  <span>Managing Director, The Mayfair Society</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="quote-mark">“</div>
              <p className="testimonial-quote">
                The AI predictive renewal mechanism is remarkably nuanced. We noticed a 22% uplift
                in proactive annual membership renewals within our first ninety days of implementation.
              </p>
              <div className="author-row">
                <div className="author-avatar">JW</div>
                <div className="author-meta">
                  <strong>Julian Wright</strong>
                  <span>Director of Membership, Sterling Athletic Club</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="quote-mark">“</div>
              <p className="testimonial-quote">
                The aesthetic refinement of MemberPass aligns impeccably with our brand values.
                Our patrons expect nothing short of perfection, and this platform delivers on every count.
              </p>
              <div className="author-row">
                <div className="author-avatar">CS</div>
                <div className="author-meta">
                  <strong>Claire Sinclair</strong>
                  <span>Founder, Elysian Wellness Sanctum</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. HOW IT WORKS SECTION
            ========================================================================= */}
        <section className="section-padding workflow-section" id="workflow">
          <div className="section-header text-center">
            <span className="section-kicker">THE PROTOCOL</span>
            <h2 className="section-heading">Four Steps to Flawless Orchestration</h2>
            <p className="section-subtext">
              A serene, cloud-native workflow connecting roster synchronization, bespoke digital pass issuance,
              and automated telemetry.
            </p>
          </div>

          <div className="workflow-steps-grid">
            <div className="workflow-step">
              <div className="step-numeral">01</div>
              <div className="step-icon">
                <i className="fa-solid fa-cloud-arrow-up"></i>
              </div>
              <h3 className="step-title">Connect &amp; Onboard</h3>
              <p className="step-desc">
                Seamlessly import existing member rosters or provide tailored digital application forms.
                Profiles are instantly organized in our secure cloud repository.
              </p>
            </div>

            <div className="workflow-step">
              <div className="step-numeral">02</div>
              <div className="step-icon">
                <i className="fa-solid fa-gears"></i>
              </div>
              <h3 className="step-title">Configure AI Rules</h3>
              <p className="step-desc">
                Establish custom access tiers, validity periods, and automated renewal triggers
                aligned with your establishment’s bylaws.
              </p>
            </div>

            <div className="workflow-step">
              <div className="step-numeral">03</div>
              <div className="step-icon">
                <i className="fa-solid fa-id-card"></i>
              </div>
              <h3 className="step-title">Issue Digital MemberPass</h3>
              <p className="step-desc">
                The platform generates encrypted, cryptographic digital passes with rotating QR codes,
                enabling fellows to store passes directly on mobile devices.
              </p>
            </div>

            <div className="workflow-step">
              <div className="step-numeral">04</div>
              <div className="step-icon">
                <i className="fa-solid fa-chart-pie"></i>
              </div>
              <h3 className="step-title">Track &amp; Predict</h3>
              <p className="step-desc">
                Verify passes sub-second at entry portals while our AI monitors visitation cadence,
                flags retention risks, and delivers executive telemetry.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            8. CONTACT SECTION
            ========================================================================= */}
        <section className="section-padding contact-section" id="contact">
          <div className="contact-container">
            <div className="contact-info-col">
              <span className="section-kicker">CONNECT WITH US</span>
              <h2 className="contact-headline">Begin Your Journey to Sovereign Governance</h2>
              <p className="contact-description">
                Our membership advisory specialists are prepared to demonstrate how MemberPass
                can be tailored to your private club, luxury development, or premier association.
              </p>

              <div className="contact-meta-list">
                <div className="contact-meta-item">
                  <div className="meta-icon"><i className="fa-solid fa-envelope"></i></div>
                  <div>
                    <span className="meta-caption">CONCIERGE INQUIRIES</span>
                    <a href="mailto:concierge@memberpass.com" className="meta-link">concierge@memberpass.com</a>
                  </div>
                </div>

                <div className="contact-meta-item">
                  <div className="meta-icon"><i className="fa-solid fa-location-dot"></i></div>
                  <div>
                    <span className="meta-caption">HEADQUARTERS</span>
                    <span className="meta-static">Mayfair Enclave, London &amp; New York</span>
                  </div>
                </div>

                <div className="contact-meta-item">
                  <div className="meta-icon"><i className="fa-solid fa-clock"></i></div>
                  <div>
                    <span className="meta-caption">CONCIERGE HOURS</span>
                    <span className="meta-static">Monday – Friday: 08:00 – 20:00 GMT</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-col">
              <div className="form-card">
                <h3 className="form-card-title">Request Private Consultation</h3>
                <p className="form-card-sub">Inquire regarding bespoke institutional onboarding or request a sandbox walkthrough.</p>

                {contactSubmitted ? (
                  <div className="form-success-banner">
                    <span className="success-icon">✦</span>
                    <div>
                      <strong>Your Inquiry Has Been Received</strong>
                      <p>Our senior membership director will reach out to you discreetly within one business day.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="royale-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name">Full Name <span className="req">*</span></label>
                        <input type="text" id="name" required placeholder="e.g. Lady Vivienne Montgomery" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Official Email <span className="req">*</span></label>
                        <input type="email" id="email" required placeholder="e.g. v.montgomery@enclave.com" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="organization">Organization or Club</label>
                      <input type="text" id="organization" placeholder="e.g. The Sovereign Society of Mayfair" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="interest">Tier of Interest</label>
                      <select id="interest" defaultValue="Royale Reserve Plan">
                        <option value="Classic Privilège Plan">Classic Privilège ($1,200/yr)</option>
                        <option value="Royale Reserve Plan">Royale Reserve ($2,800/yr)</option>
                        <option value="Sovereign Circle Plan">Sovereign Circle ($5,500/yr)</option>
                        <option value="Enterprise / Multi-Club Custom">Enterprise Custom Multi-Club</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Message or Requirements <span className="req">*</span></label>
                      <textarea id="message" rows="3" required placeholder="Share your membership scope or private club requirements..."></textarea>
                    </div>

                    <button type="submit" className="btn-primary btn-block">
                      <span>Submit Inquiries</span>
                      <span className="btn-arrow">→</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================================
          9. REFINED FOOTER
          ========================================================================= */}
      <footer className="royale-footer">
        <div className="footer-inner">
          <div className="footer-top-row">
            <div className="footer-brand-col">
              <a href="#home" className="brand-logo footer-logo">
                <span className="crest-mark">
                  <span className="crest-monogram">M</span>
                  <span className="crest-sparkle">✦</span>
                </span>
                <div className="brand-text">
                  <span className="brand-name">Member<span className="highlight-rose">Pass</span></span>
                  <span className="brand-tag">BURGUNDY ROYALE</span>
                </div>
              </a>
              <p className="footer-tagline">
                The pinnacle of digital identity, tier governance, and membership intelligence for the world’s most distinguished enclaves.
              </p>
              <div className="footer-social-icons">
                <a href="#home" aria-label="LinkedIn" className="social-pill"><i className="fa-brands fa-linkedin-in"></i></a>
                <a href="#home" aria-label="Twitter/X" className="social-pill"><i className="fa-brands fa-x-twitter"></i></a>
                <a href="#home" aria-label="Instagram" className="social-pill"><i className="fa-brands fa-instagram"></i></a>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Navigation</h4>
              <ul className="footer-col-links">
                <li><a href="#home">Home Sanctuary</a></li>
                <li><a href="#about">The Philosophy</a></li>
                <li><a href="#features">Curated Capabilities</a></li>
                <li><a href="#plans">Membership Tiers</a></li>
                <li><a href="#workflow">The Protocol</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Privilege Tiers</h4>
              <ul className="footer-col-links">
                <li><a href="#plans">Classic Privilège</a></li>
                <li><a href="#plans">Royale Reserve (Recommended)</a></li>
                <li><a href="#plans">Sovereign Circle</a></li>
                <li><a href="#contact">Private Bespoke Enclaves</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Distinction Standards</h4>
              <p className="footer-col-text">
                Certified 256-bit rotating token security. Certified zero-friction gate access with full compliance protocols.
              </p>
              <div className="footer-pill-badge">
              </div>
            </div>
          </div>

          <div className="footer-bottom-row">
            <p className="copyright-text">
              © 2026 <strong>MemberPass</strong>. All rights reserved. Sovereign Membership Technologies.
            </p>
            <div className="footer-legal-links">
              <a href="#home">Confidentiality Policy</a>
              <span className="dot-sep">•</span>
              <a href="#home">Terms of Privilege</a>
              <span className="dot-sep">•</span>
              <button onClick={scrollToTop} className="back-top-link">
                Back to Top ↑
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
