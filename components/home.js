// Cubaze Academy — Home Page Component v2.0 (components/home.js)

const HomeComponent = {
  render: function () {
    const courses = window.db.getCourses();
    const testimonials = window.db.getTestimonials();
    const faqData = window.db.getFAQ();
    const currentUser = window.db.getCurrentUser();
    const enrolledList = currentUser ? (currentUser.enrolledCourses || []) : [];
    const wishlistList = currentUser ? (currentUser.wishlist || []) : [];

    // Build course cards
    let courseCardsHtml = courses.map(c => {
      const isEnrolled = enrolledList.includes(c.id);
      const isWishlisted = wishlistList.includes(c.id);
      const badgeColor = c.badgeColor || '#3D46D8';
      const stars = HomeComponent._renderStars(c.rating);
      const actionBtn = isEnrolled
        ? `<a href="#/lesson/${c.id}/${c.modules[0].lessons[0].id}" class="btn btn-success btn-sm"><i class="fa-solid fa-play"></i> Continue</a>`
        : `<a href="#/course/${c.id}" class="btn btn-primary btn-sm">Enroll Now</a>`;
      const priceSection = isEnrolled
        ? `<div class="course-price enrolled"><i class="fa-solid fa-circle-check"></i> Enrolled</div>`
        : `<div class="course-price-group"><div class="course-price">₹${c.price.toLocaleString('en-IN')}</div></div>`;

      return `
        <div class="course-card reveal">
          <div class="course-img-wrapper">
            <img src="${c.image}" alt="${c.title}" loading="lazy">
            <div class="course-badge-wrapper">
              <span class="badge" style="background:${badgeColor}; color:#fff;">${c.badge}</span>
            </div>
            <div class="course-level-pill"><i class="fa-solid fa-signal"></i> ${c.level}</div>
          </div>
          <div class="course-body">
            <div class="course-rating">
              ${stars} <span>${c.rating}</span>
              <span>(${c.reviews ? c.reviews.length : 0} reviews)</span>
            </div>
            <div class="course-title">${c.title}</div>
            <div class="course-desc">${c.shortDescription}</div>
            <div class="course-meta-row">
              <span><i class="fa-solid fa-clock"></i> ${c.duration}</span>
              <span><i class="fa-solid fa-book-open"></i> ${c.lessonsCount} Modules</span>
              <span><i class="fa-solid fa-users"></i> ${c.studentsCount ? c.studentsCount.toLocaleString('en-IN') : '0'}+</span>
              <span><i class="fa-solid fa-globe"></i> ${c.language}</span>
            </div>
            <div class="course-footer">
              ${priceSection}
              ${actionBtn}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Build testimonials
    const testimonialsHtml = testimonials.map((t, i) => `
      <div class="testimonial-card">
        <div class="testimonial-stars">
          ${'<i class="fa-solid fa-star"></i>'.repeat(t.rating)}
        </div>
        <p class="testimonial-text">"${t.text}"</p>
        <div class="testimonial-author">
          <img src="${t.image}" alt="${t.name}" class="testimonial-avatar" loading="lazy">
          <div>
            <div class="testimonial-name">${t.name}</div>
            <div class="testimonial-role">${t.role} · ${t.location}</div>
          </div>
        </div>
      </div>
    `).join('');

    // Build home FAQ (first 5 questions)
    const homeFaq = faqData[0].questions.slice(0, 5);
    const faqHtml = homeFaq.map((item, i) => `
      <div class="faq-item" data-faq-idx="${i}">
        <div class="faq-question">
          <span>${item.q}</span>
          <div class="faq-icon"><i class="fa-solid fa-plus"></i></div>
        </div>
        <div class="faq-answer">
          <div class="faq-answer-inner">${item.a}</div>
        </div>
      </div>
    `).join('');

    return `
      <!-- ========== HERO ========== -->
      <section class="hero-section">
        <div class="hero-bg-blob hero-bg-blob-1"></div>
        <div class="hero-bg-blob hero-bg-blob-2"></div>
        <div class="hero-bg-blob hero-bg-blob-3"></div>

        <div class="container">
          <div class="hero-grid">
            <div class="hero-content">
              <div class="hero-badge">
                <i class="fa-solid fa-bolt"></i> India's Most Premium Creative Academy
              </div>
              <h1 class="hero-title">
                Learn Creative Skills That<br>
                <span class="highlight">Build Your Career</span>
              </h1>
              <p class="hero-subtitle">
                Professional online courses designed for students, creators,<br>
                freelancers, and future professionals. Master Blender 3D,<br>
                Adobe Premiere Pro, and more with expert instructors.
              </p>
              <div class="hero-cta-group">
                <a href="#/courses" class="btn btn-primary btn-lg">
                  <i class="fa-solid fa-compass"></i> Explore Courses
                </a>
                <a href="#/about" class="btn btn-secondary btn-lg">
                  <i class="fa-solid fa-play"></i> Watch Demo
                </a>
              </div>
              <div class="hero-trust">
                <div class="hero-trust-avatars">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80" alt="Student">
                  <img src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=80&q=80" alt="Student">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80" alt="Student">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80" alt="Student">
                </div>
                <div class="hero-trust-text">
                  <div class="hero-trust-stars">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <strong style="color:var(--text-primary);margin-left:4px;">4.9</strong>
                  </div>
                  <div><strong>19,000+</strong> students already learning</div>
                </div>
              </div>
            </div>

            <div class="hero-visual">
              <div style="width:100%;max-width:480px;position:relative;">
                <!-- Main Visual Card -->
                <div style="background:linear-gradient(135deg,#3D46D8,#6872e8);border-radius:28px;padding:32px;aspect-ratio:1;display:flex;align-items:center;justify-content:center;box-shadow:0 32px 80px rgba(61,70,216,0.35);">
                  <div style="text-align:center;color:#fff;">
                    <div style="font-size:5rem;margin-bottom:16px;">🎨</div>
                    <h3 style="color:#fff;font-size:1.3rem;margin-bottom:8px;">Start Creating Today</h3>
                    <p style="color:rgba(255,255,255,0.7);font-size:0.9rem;">3D Art · Video Editing · Animation</p>
                  </div>
                </div>
                <!-- Float Cards -->
                <div class="hero-float-card hero-float-card-1">
                  <div class="card-icon blue"><i class="fa-solid fa-cube"></i></div>
                  <div class="card-text">
                    <strong>Blender 3D</strong>
                    <span>4,280 students enrolled</span>
                  </div>
                </div>
                <div class="hero-float-card hero-float-card-2">
                  <div class="card-icon green"><i class="fa-solid fa-certificate"></i></div>
                  <div class="card-text">
                    <strong>Certificate Earned!</strong>
                    <span>Riya completed Blender Basics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========== STATS BAR ========== -->
      <div class="container">
        <div class="stats-bar reveal">
          <div class="stat-item">
            <div class="stat-number"><span class="stat-accent" data-count="19000">0</span>+</div>
            <div class="stat-label">Students Enrolled</div>
          </div>
          <div class="stat-item">
            <div class="stat-number"><span class="stat-accent">4.9</span> <i class="fa-solid fa-star" style="font-size:1.4rem;color:var(--warning)"></i></div>
            <div class="stat-label">Average Rating</div>
          </div>
          <div class="stat-item">
            <div class="stat-number"><span class="stat-accent" data-count="3">0</span></div>
            <div class="stat-label">Premium Courses</div>
          </div>
          <div class="stat-item">
            <div class="stat-number"><span class="stat-accent">100%</span></div>
            <div class="stat-label">Secured by PhonePe</div>
          </div>
        </div>
      </div>

      <!-- ========== FEATURED COURSES ========== -->
      <section class="section">
        <div class="container">
          <div class="section-header text-center">
            <div class="section-label"><i class="fa-solid fa-fire"></i> Featured Courses</div>
            <h2 class="section-title">Learn Skills That Matter</h2>
            <p class="section-subtitle" style="margin:0 auto;">Professionally designed courses built for real-world careers. Start today and transform your creative future.</p>
          </div>
          <div class="courses-grid">
            ${courseCardsHtml}
          </div>
          <div style="text-align:center;margin-top:40px;">
            <a href="#/courses" class="btn btn-secondary btn-lg">View All Courses <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
      </section>

      <!-- ========== WHY CHOOSE US ========== -->
      <section class="section" style="background:var(--bg-card);border-top:1px solid var(--border-color);border-bottom:1px solid var(--border-color);">
        <div class="container">
          <div class="section-header text-center">
            <div class="section-label"><i class="fa-solid fa-crown"></i> Why Cubaze Academy</div>
            <h2 class="section-title">Everything You Need to Succeed</h2>
            <p class="section-subtitle" style="margin:0 auto;">We've built every feature with your success in mind. No fluff — just the best learning experience possible.</p>
          </div>
          <div class="features-grid">
            <div class="feature-card reveal">
              <div class="feature-icon"><i class="fa-solid fa-infinity"></i></div>
              <div class="feature-title">Lifetime Access</div>
              <div class="feature-desc">Pay once and access your course forever — including all future updates and new lessons added to the curriculum.</div>
            </div>
            <div class="feature-card reveal reveal-delay-1">
              <div class="feature-icon"><i class="fa-solid fa-briefcase"></i></div>
              <div class="feature-title">Industry-Level Projects</div>
              <div class="feature-desc">Build a portfolio with real-world projects that impress clients and employers. No toy projects here.</div>
            </div>
            <div class="feature-card reveal reveal-delay-2">
              <div class="feature-icon"><i class="fa-solid fa-certificate"></i></div>
              <div class="feature-title">Professional Certificate</div>
              <div class="feature-desc">Earn a verifiable, QR-coded certificate that you can share on LinkedIn, your resume, and freelancing profiles.</div>
            </div>
            <div class="feature-card reveal reveal-delay-3">
              <div class="feature-icon"><i class="fa-solid fa-chalkboard-user"></i></div>
              <div class="feature-title">Expert Instructor</div>
              <div class="feature-desc">Learn from a professional 3D artist and video editor with 8+ years of industry experience and a proven teaching method.</div>
            </div>
            <div class="feature-card reveal">
              <div class="feature-icon"><i class="fa-solid fa-flask"></i></div>
              <div class="feature-title">Practical Learning</div>
              <div class="feature-desc">Every lesson includes hands-on exercises. You learn by doing, not just watching. Practice makes perfect.</div>
            </div>
            <div class="feature-card reveal reveal-delay-1">
              <div class="feature-icon"><i class="fa-solid fa-users"></i></div>
              <div class="feature-title">Community Support</div>
              <div class="feature-desc">Join our active student community for help, feedback, and inspiration. Never feel stuck or alone in your learning.</div>
            </div>
            <div class="feature-card reveal reveal-delay-2">
              <div class="feature-icon"><i class="fa-solid fa-mobile-screen"></i></div>
              <div class="feature-title">Mobile Friendly</div>
              <div class="feature-desc">Study anywhere, anytime. Cubaze Academy works perfectly on your phone, tablet, and desktop.</div>
            </div>
            <div class="feature-card reveal reveal-delay-3">
              <div class="feature-icon"><i class="fa-solid fa-tags"></i></div>
              <div class="feature-title">Affordable Pricing</div>
              <div class="feature-desc">World-class education starting at just ₹499. We believe quality learning should be accessible to everyone in India.</div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========== LEARNING JOURNEY ========== -->
      <section class="section">
        <div class="container">
          <div class="section-header text-center">
            <div class="section-label"><i class="fa-solid fa-route"></i> Your Learning Journey</div>
            <h2 class="section-title">From Zero to Professional in 5 Steps</h2>
            <p class="section-subtitle" style="margin:0 auto;">A clear, structured path designed to take you from beginner to career-ready professional.</p>
          </div>
          <div class="journey-section reveal">
            <div class="journey-steps">
              <div class="journey-step">
                <div class="journey-step-num"><i class="fa-solid fa-user-plus"></i></div>
                <div class="journey-step-title">Create Account</div>
                <div class="journey-step-desc">Register for free in under 60 seconds</div>
              </div>
              <div class="journey-step">
                <div class="journey-step-num"><i class="fa-solid fa-credit-card"></i></div>
                <div class="journey-step-title">Purchase Course</div>
                <div class="journey-step-desc">Secure checkout via PhonePe</div>
              </div>
              <div class="journey-step">
                <div class="journey-step-num"><i class="fa-solid fa-play"></i></div>
                <div class="journey-step-title">Watch Videos</div>
                <div class="journey-step-desc">HD lessons with lifetime access</div>
              </div>
              <div class="journey-step">
                <div class="journey-step-num"><i class="fa-solid fa-pen-ruler"></i></div>
                <div class="journey-step-title">Complete Projects</div>
                <div class="journey-step-desc">Build real portfolio projects</div>
              </div>
              <div class="journey-step">
                <div class="journey-step-num"><i class="fa-solid fa-award"></i></div>
                <div class="journey-step-title">Get Certified</div>
                <div class="journey-step-desc">Download your verified certificate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========== TESTIMONIALS ========== -->
      <section class="section" style="background:var(--bg-card);border-top:1px solid var(--border-color);border-bottom:1px solid var(--border-color);">
        <div class="container">
          <div class="section-header text-center">
            <div class="section-label"><i class="fa-solid fa-heart"></i> Student Success</div>
            <h2 class="section-title">Loved by 19,000+ Students</h2>
            <p class="section-subtitle" style="margin:0 auto;">Real stories from real students who transformed their skills and careers with Cubaze Academy.</p>
          </div>
          <div class="testimonials-carousel" id="testimonials-carousel">
            <div class="testimonials-track" id="testimonials-track">
              ${testimonialsHtml}
            </div>
          </div>
          <div class="testimonials-nav">
            <button class="testimonials-prev" id="t-prev"><i class="fa-solid fa-arrow-left"></i></button>
            <div class="testimonials-dots" id="t-dots">
              ${testimonials.map((_, i) => `<div class="t-dot ${i === 0 ? 'active' : ''}" data-idx="${i}"></div>`).join('')}
            </div>
            <button class="testimonials-next" id="t-next"><i class="fa-solid fa-arrow-right"></i></button>
          </div>
        </div>
      </section>

      <!-- ========== HOME FAQ ========== -->
      <section class="section">
        <div class="container" style="max-width:760px;margin:0 auto;">
          <div class="section-header text-center">
            <div class="section-label"><i class="fa-solid fa-circle-question"></i> FAQ</div>
            <h2 class="section-title">Frequently Asked Questions</h2>
          </div>
          <div class="faq-list" id="home-faq-list">
            ${faqHtml}
          </div>
          <div style="text-align:center;margin-top:32px;">
            <a href="#/faq" class="btn btn-secondary">View All FAQs <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
      </section>

      <!-- ========== CTA BANNER ========== -->
      <div class="container" style="padding-bottom:96px;">
        <div class="cta-banner reveal">
          <h2 style="font-size:clamp(1.6rem,3.5vw,2.2rem);margin-bottom:16px;">Ready to Start Your Creative Journey?</h2>
          <p>Join 19,000+ students from across India learning world-class skills at affordable prices.</p>
          <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;position:relative;z-index:1;">
            <a href="#/courses" class="btn btn-white btn-lg">Browse Courses <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#/contact" class="btn btn-outline-white btn-lg">Talk to Us <i class="fa-solid fa-headset"></i></a>
          </div>
        </div>
      </div>
    `;
  },

  _renderStars: function (rating) {
    let html = '';
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    for (let i = 0; i < full; i++) html += '<i class="fa-solid fa-star"></i>';
    if (half) html += '<i class="fa-solid fa-star-half-stroke"></i>';
    for (let i = 0; i < empty; i++) html += '<i class="fa-regular fa-star"></i>';
    return html;
  },

  init: function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Scroll reveal
    HomeComponent._initScrollReveal();

    // Counter animation
    HomeComponent._initCounters();

    // Testimonials carousel
    HomeComponent._initTestimonials();

    // FAQ accordion
    HomeComponent._initFAQ();

    // Header scroll effect
    HomeComponent._initHeaderScroll();
  },

  _initScrollReveal: function () {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  },

  _initCounters: function () {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(el => {
      const target = parseInt(el.getAttribute('data-count'));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { el.textContent = target.toLocaleString('en-IN'); clearInterval(timer); }
        else { el.textContent = Math.floor(current).toLocaleString('en-IN'); }
      }, 16);
    });
  },

  _currentSlide: 0,
  _initTestimonials: function () {
    const track = document.getElementById('testimonials-track');
    const dots = document.querySelectorAll('.t-dot');
    const totalSlides = dots.length;
    let current = 0;

    const getSlidesPerView = () => window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;

    const goTo = (idx) => {
      const perView = getSlidesPerView();
      const maxIdx = Math.max(0, totalSlides - perView);
      current = Math.max(0, Math.min(idx, maxIdx));
      const cardWidth = track.querySelector('.testimonial-card').offsetWidth;
      const gap = 24;
      track.style.transform = `translateX(-${current * (cardWidth + gap)}px)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    document.getElementById('t-prev')?.addEventListener('click', () => goTo(current - 1));
    document.getElementById('t-next')?.addEventListener('click', () => goTo(current + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

    // Auto advance
    setInterval(() => goTo((current + 1) % (totalSlides - getSlidesPerView() + 1)), 5000);
  },

  _initFAQ: function () {
    document.querySelectorAll('#home-faq-list .faq-item').forEach(item => {
      item.querySelector('.faq-question').addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        document.querySelectorAll('#home-faq-list .faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    });
  },

  _initHeaderScroll: function () {
    const header = document.getElementById('main-header');
    if (!header) return;
    const handler = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
  }
};

window.HomeComponent = HomeComponent;
