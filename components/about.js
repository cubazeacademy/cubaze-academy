// Cubaze Academy — About Page (components/about.js)
const AboutComponent = {
  render: function () {
    return `
      <div class="page-hero">
        <div class="container">
          <div class="breadcrumb"><a href="#/">Home</a><span class="sep">/</span><span>About</span></div>
          <h1>About Cubaze Academy</h1>
          <p>India's most premium online creative academy — built with one mission: to make world-class creative education accessible to every Indian student.</p>
        </div>
      </div>

      <!-- Mission Section -->
      <section class="section">
        <div class="container">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;">
            <div>
              <div class="section-label"><i class="fa-solid fa-bullseye"></i> Our Mission</div>
              <h2 class="section-title" style="margin-top:12px;">Empowering India's Creative Generation</h2>
              <p style="font-size:1rem;color:var(--text-secondary);line-height:1.85;margin-bottom:20px;">Cubaze Academy was founded with one simple belief: every aspiring creator in India deserves access to world-class, industry-level education at an affordable price.</p>
              <p style="font-size:1rem;color:var(--text-secondary);line-height:1.85;margin-bottom:24px;">We saw talented students being priced out of quality education and relying on fragmented YouTube tutorials. We built Cubaze Academy to change that — with structured, professional courses that actually get you hired or launch your freelancing career.</p>
              <div style="display:flex;flex-direction:column;gap:12px;">
                ${[['fa-heart','Founded in 2024 by passionate creators'],['fa-map-marker-alt','Based in India — Built for India'],['fa-users','19,000+ students from across the country'],['fa-star','4.9/5 average rating across all courses']].map(([icon, text]) => `
                  <div style="display:flex;align-items:center;gap:12px;font-size:0.9rem;color:var(--text-secondary);">
                    <i class="fa-solid ${icon}" style="color:var(--brand-blue);width:18px;text-align:center;"></i>
                    ${text}
                  </div>
                `).join('')}
              </div>
            </div>
            <div style="position:relative;">
              <div style="background:linear-gradient(135deg,var(--brand-blue),var(--brand-blue-light));border-radius:var(--radius-2xl);padding:48px;text-align:center;box-shadow:var(--shadow-blue);">
                <div style="font-size:4rem;margin-bottom:16px;">🎓</div>
                <h3 style="color:#fff;margin-bottom:12px;">Premium Learning Experience</h3>
                <p style="color:rgba(255,255,255,0.75);font-size:0.9rem;">Professional courses designed with industry standards in mind</p>
              </div>
              <div style="position:absolute;top:-20px;right:-20px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-xl);padding:16px 20px;box-shadow:var(--shadow-lg);white-space:nowrap;">
                <div style="font-size:1.4rem;font-weight:900;color:var(--text-primary);">19K+</div>
                <div style="font-size:0.78rem;color:var(--text-muted);">Students</div>
              </div>
              <div style="position:absolute;bottom:-20px;left:-20px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-xl);padding:16px 20px;box-shadow:var(--shadow-lg);white-space:nowrap;">
                <div style="font-size:1.4rem;font-weight:900;color:var(--text-primary);">4.9 ★</div>
                <div style="font-size:0.78rem;color:var(--text-muted);">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats -->
      <section class="section-sm" style="background:var(--bg-card);border-top:1px solid var(--border-color);border-bottom:1px solid var(--border-color);">
        <div class="container">
          <div class="stats-bar">
            <div class="stat-item"><div class="stat-number"><span class="stat-accent">19K+</span></div><div class="stat-label">Students Enrolled</div></div>
            <div class="stat-item"><div class="stat-number"><span class="stat-accent">3</span></div><div class="stat-label">Premium Courses</div></div>
            <div class="stat-item"><div class="stat-number"><span class="stat-accent">₹2,500+</span></div><div class="stat-label">Avg. Student Earnings/Month</div></div>
            <div class="stat-item"><div class="stat-number"><span class="stat-accent">7-Day</span></div><div class="stat-label">Money-Back Guarantee</div></div>
          </div>
        </div>
      </section>

      <!-- Our Story -->
      <section class="section">
        <div class="container" style="max-width:760px;margin:0 auto;text-align:center;">
          <div class="section-label"><i class="fa-solid fa-book"></i> Our Story</div>
          <h2 class="section-title" style="margin-top:12px;">Built by Creators, For Creators</h2>
          <p style="font-size:1rem;color:var(--text-secondary);line-height:1.85;margin-bottom:20px;">Cubaze Academy started as a small YouTube channel sharing Blender tutorials. The response was overwhelming — thousands of students from tier-2 and tier-3 cities across India were hungry to learn professional 3D and video editing skills.</p>
          <p style="font-size:1rem;color:var(--text-secondary);line-height:1.85;margin-bottom:20px;">We realized that while there were plenty of generic online courses, nothing was specifically designed for Indian creators — in Malayalam, with Indian examples, at Indian-friendly prices, and with real career outcomes in mind.</p>
          <p style="font-size:1rem;color:var(--text-secondary);line-height:1.85;">So we built Cubaze Academy. And today, our students are working as freelancers, at studios, and as YouTube creators. That's the Cubaze success story — and it's still just beginning.</p>
        </div>
      </section>

      <!-- Values -->
      <section class="section" style="background:var(--bg-card);border-top:1px solid var(--border-color);border-bottom:1px solid var(--border-color);">
        <div class="container">
          <div class="section-header text-center">
            <div class="section-label"><i class="fa-solid fa-gem"></i> Our Values</div>
            <h2 class="section-title">What We Stand For</h2>
          </div>
          <div class="features-grid">
            ${[['fa-heart','Student First','Every decision we make is guided by what\'s best for our students. Your success is our success.'],['fa-check-circle','Quality Above All','We never compromise on content quality. Every lesson is planned, recorded, and edited to professional standards.'],['fa-hands-helping','Accessibility','Premium education shouldn\'t require a premium price tag. We keep costs low so more students can access quality learning.'],['fa-shield-alt','Integrity','We are transparent about what our courses cover and don\'t make promises we can\'t keep. Honest education, always.']].map(([icon, title, desc]) => `
              <div class="feature-card">
                <div class="feature-icon"><i class="fa-solid ${icon}"></i></div>
                <div class="feature-title">${title}</div>
                <div class="feature-desc">${desc}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- CTA -->
      <div class="container section">
        <div class="cta-banner">
          <h2>Ready to Be Part of the Cubaze Family?</h2>
          <p>Join 19,000+ students who've already started their creative journey with us.</p>
          <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;position:relative;z-index:1;">
            <a href="#/courses" class="btn btn-white btn-lg">Explore Courses</a>
            <a href="#/contact" class="btn btn-outline-white btn-lg">Get in Touch</a>
          </div>
        </div>
      </div>
    `;
  },
  init: function () { window.scrollTo({ top: 0, behavior: 'smooth' }); }
};
window.AboutComponent = AboutComponent;
