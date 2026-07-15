// Cubaze Academy — Courses Catalog & Detail v2.0 (components/courses.js)

const CoursesComponent = {

  _renderStars: function (rating) {
    let h = '';
    const f = Math.floor(rating), hf = rating % 1 >= 0.5 ? 1 : 0, e = 5 - f - hf;
    for (let i = 0; i < f; i++) h += '<i class="fa-solid fa-star" style="color:var(--warning)"></i>';
    if (hf) h += '<i class="fa-solid fa-star-half-stroke" style="color:var(--warning)"></i>';
    for (let i = 0; i < e; i++) h += '<i class="fa-regular fa-star" style="color:var(--text-muted)"></i>';
    return h;
  },

  renderList: function () {
    const courses = window.db.getCourses();
    const cu = window.db.getCurrentUser();
    const enrolled = cu ? (cu.enrolledCourses || []) : [];
    const wishlist = cu ? (cu.wishlist || []) : [];

    const cards = courses.map(c => {
      const isEnrolled = enrolled.includes(c.id);
      const isWished = wishlist.includes(c.id);
      const badgeColor = c.badgeColor || '#3D46D8';
      const priceHtml = isEnrolled
        ? `<div class="course-price enrolled"><i class="fa-solid fa-circle-check"></i> Enrolled</div>`
        : `<div class="course-price-group"><div class="course-price">₹${c.price.toLocaleString('en-IN')}</div><div class="course-price-original">₹${Math.floor(c.price * 2.5).toLocaleString('en-IN')}</div></div>`;
      const hasLessons = c.modules && c.modules.length > 0 && c.modules[0].lessons && c.modules[0].lessons.length > 0;
      const actionBtn = isEnrolled
        ? (hasLessons
            ? `<a href="#/lesson/${c.id}/${c.modules[0].lessons[0].id}" class="btn btn-success btn-sm"><i class="fa-solid fa-play"></i> Continue</a>`
            : `<a href="#/course/${c.id}" class="btn btn-outline-white btn-sm">No Lessons Yet</a>`
          )
        : `<a href="#/course/${c.id}" class="btn btn-primary btn-sm">View Course</a>`;

      return `
        <div class="course-card" data-title="${c.title.toLowerCase()}" data-level="${c.level.toLowerCase()}" data-price="${c.price}">
          <div class="course-img-wrapper">
            <img src="${c.image}" alt="${c.title}" loading="lazy">
            <div class="course-badge-wrapper">
              <span class="badge" style="background:${badgeColor};color:#fff;">${c.badge}</span>
            </div>
            <div class="course-level-pill"><i class="fa-solid fa-signal"></i> ${c.level}</div>
          </div>
          <div class="course-body">
            <div class="course-rating">
              ${CoursesComponent._renderStars(c.rating)}
              <span>${c.rating}</span>
              <span>(${c.reviews ? c.reviews.length : 0})</span>
            </div>
            <div class="course-title">${c.title}</div>
            <div class="course-desc">${c.shortDescription}</div>
            <div class="course-meta-row">
              <span><i class="fa-solid fa-clock"></i> ${c.duration}</span>
              <span><i class="fa-solid fa-book-open"></i> ${c.lessonsCount} Modules</span>
              <span><i class="fa-solid fa-users"></i> ${(c.studentsCount || 0).toLocaleString('en-IN')}+</span>
            </div>
            <div class="course-footer">${priceHtml}${actionBtn}</div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <!-- Page Hero -->
      <div class="page-hero">
        <div class="container">
          <div class="breadcrumb"><a href="#/">Home</a><span class="sep">/</span><span>Courses</span></div>
          <h1>Our Courses</h1>
          <p>Professional, industry-standard courses built for real-world creative careers.</p>
        </div>
      </div>

      <section class="section">
        <div class="container">
          <!-- Search & Filters -->
          <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:36px;">
            <div class="search-input-wrapper" style="flex:1;min-width:220px;max-width:400px;">
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
              <input type="text" id="course-search-input" placeholder="Search courses..." style="width:100%;padding:11px 16px 11px 42px;background:var(--bg-card);border:1.5px solid var(--border-color);border-radius:var(--radius-lg);font-size:0.9rem;color:var(--text-primary);outline:none;transition:var(--transition);">
            </div>
            <select id="filter-level" class="search-filter-select">
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <select id="filter-price" class="search-filter-select">
              <option value="">Any Price</option>
              <option value="500">Under ₹500</option>
              <option value="1000">Under ₹1,000</option>
              <option value="3000">Under ₹3,000</option>
            </select>
          </div>

          <div class="courses-grid" id="all-courses-grid">${cards}</div>
          <p id="no-results" style="text-align:center;color:var(--text-muted);padding:40px 0;display:none;">No courses match your search. Try different keywords.</p>
        </div>
      </section>
    `;
  },

  renderDetail: function (courseId) {
    const course = window.db.getCourseById(courseId);
    if (!course) return `<div class="container" style="text-align:center;padding:100px 0;"><h2>Course Not Found</h2><p style="margin:16px 0;">The course "${courseId}" does not exist.</p><a href="#/courses" class="btn btn-primary">Browse Courses</a></div>`;

    const cu = window.db.getCurrentUser();
    const enrolled = cu ? (cu.enrolledCourses || []) : [];
    const wishlist = cu ? (cu.wishlist || []) : [];
    const isEnrolled = enrolled.includes(course.id);
    const isWished = wishlist.includes(course.id);
    const originalPrice = Math.floor(course.price * 2.5);
    const savings = originalPrice - course.price;
    const discountPct = Math.round((savings / originalPrice) * 100);
    const stars = CoursesComponent._renderStars(course.rating);
    const reviews = course.reviews || [];

    // Curriculum HTML
    const modulesHtml = (course.modules || []).map((mod, idx) => {
      const lessonsHtml = (mod.lessons || []).map(les => `
        <div class="lesson-row">
          <div class="lesson-left"><i class="fa-regular fa-circle-play"></i><span>${les.title}</span></div>
          <span class="lesson-duration">${les.duration}</span>
        </div>
      `).join('');
      return `
        <div class="module-accordion" data-idx="${idx}">
          <div class="module-header"><span>${mod.title}</span><i class="fa-solid fa-chevron-down"></i></div>
          <div class="lessons-list">${lessonsHtml}</div>
        </div>
      `;
    }).join('');

    // Requirements
    const reqHtml = (course.requirements || []).map(r => `<li style="list-style:none;display:flex;align-items:flex-start;gap:10px;font-size:0.88rem;color:var(--text-secondary);margin-bottom:10px;"><i class="fa-solid fa-circle-check" style="color:var(--success);margin-top:2px;flex-shrink:0;"></i><span>${r}</span></li>`).join('');

    // Projects
    const projHtml = (course.projects || []).map(p => `<div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:var(--bg-primary);border-radius:var(--radius-md);font-size:0.88rem;color:var(--text-primary);font-weight:500;"><i class="fa-solid fa-folder-open" style="color:var(--brand-blue);"></i>${p}</div>`).join('');

    // Reviews
    const reviewsHtml = reviews.length === 0
      ? `<p style="text-align:center;color:var(--text-muted);padding:24px 0;">No reviews yet. Be the first to review!</p>`
      : reviews.slice(0, 5).map(r => `
          <div style="background:var(--bg-primary);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:20px;margin-bottom:14px;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
              <div>
                <div style="font-weight:700;font-size:0.9rem;color:var(--text-primary);display:flex;align-items:center;gap:8px;">
                  <div style="width:32px;height:32px;background:var(--brand-blue-pale);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;color:var(--brand-blue);">${r.name.charAt(0)}</div>
                  ${r.name}
                </div>
                <div style="font-size:0.8rem;margin-top:4px;">${CoursesComponent._renderStars(r.rating)}</div>
              </div>
              <span style="font-size:0.75rem;color:var(--text-muted);">${r.date}</span>
            </div>
            <p style="font-size:0.87rem;color:var(--text-secondary);line-height:1.7;">${r.comment}</p>
          </div>
        `).join('');

    // Rating breakdown
    const breakdownHtml = [5, 4, 3, 2, 1].map(stars => {
      const count = reviews.filter(r => Math.round(r.rating) === stars).length;
      const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
      return `
        <div style="display:flex;align-items:center;gap:10px;font-size:0.82rem;margin-bottom:8px;">
          <span style="width:42px;text-align:right;color:var(--text-muted);">${stars} ★</span>
          <div style="flex:1;height:6px;background:var(--bg-primary);border-radius:3px;overflow:hidden;">
            <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,var(--brand-blue),var(--brand-blue-light));border-radius:3px;"></div>
          </div>
          <span style="width:36px;color:var(--text-muted);">${pct}%</span>
        </div>
      `;
    }).join('');

    const hasLessons = course.modules && course.modules.length > 0 && course.modules[0].lessons && course.modules[0].lessons.length > 0;
    const buyBtnHtml = isEnrolled
      ? (hasLessons
          ? `<a href="#/lesson/${course.id}/${course.modules[0].lessons[0].id}" class="btn btn-success btn-block btn-lg"><i class="fa-solid fa-play"></i> Continue Learning</a>`
          : `<button class="btn btn-outline-white btn-block btn-lg" disabled><i class="fa-solid fa-ban"></i> No Lessons Available</button>`
        )
      : `<button id="btn-enroll-course" class="btn btn-primary btn-block btn-lg"><i class="fa-solid fa-lock-open"></i> Enroll Now — ₹${course.price.toLocaleString('en-IN')}</button>`;

    const wishBtn = cu
      ? `<button id="btn-wishlist" class="btn btn-secondary btn-block" style="margin-top:10px;">
           <i class="fa-${isWished ? 'solid' : 'regular'} fa-heart" style="color:var(--danger);"></i>
           ${isWished ? 'Remove from Wishlist' : 'Add to Wishlist'}
         </button>`
      : '';

    return `
      <!-- Course Hero -->
      <div style="background:linear-gradient(135deg,#0A0B1A 0%,#141828 100%);padding:56px 0;margin-bottom:0;">
        <div class="container">
          <div class="breadcrumb" style="margin-bottom:20px;">
            <a href="#/" style="color:rgba(255,255,255,0.5);">Home</a>
            <span class="sep" style="color:rgba(255,255,255,0.3);">/</span>
            <a href="#/courses" style="color:rgba(255,255,255,0.5);">Courses</a>
            <span class="sep" style="color:rgba(255,255,255,0.3);">/</span>
            <span style="color:#fff;">${course.title}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 380px;gap:48px;align-items:start;">
            <div>
              <span class="badge" style="background:${course.badgeColor};color:#fff;margin-bottom:16px;">${course.badge}</span>
              <h1 style="color:#fff;margin-bottom:16px;font-size:clamp(1.8rem,3vw,2.4rem);">${course.title}</h1>
              <p style="color:rgba(255,255,255,0.7);font-size:1rem;margin-bottom:24px;line-height:1.75;">${course.shortDescription}</p>
              <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;font-size:0.85rem;color:rgba(255,255,255,0.6);">
                <span style="color:var(--warning);font-weight:700;">${CoursesComponent._renderStars(course.rating)} ${course.rating}</span>
                <span>(${reviews.length} reviews)</span>
                <span><i class="fa-solid fa-users"></i> ${(course.studentsCount || 0).toLocaleString('en-IN')} students</span>
                <span><i class="fa-solid fa-clock"></i> ${course.duration}</span>
                <span><i class="fa-solid fa-globe"></i> ${course.language}</span>
                <span><i class="fa-solid fa-signal"></i> ${course.level}</span>
              </div>
              <div style="margin-top:20px;display:flex;align-items:center;gap:12px;">
                <div style="width:42px;height:42px;background:var(--brand-blue);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:1rem;">${(course.authorName || course.author).charAt(0)}</div>
                <div>
                  <div style="font-weight:700;color:#fff;font-size:0.88rem;">Instructor: ${course.authorName || course.author}</div>
                  <div style="color:rgba(255,255,255,0.55);font-size:0.78rem;">${course.authorBio || ''}</div>
                </div>
              </div>
            </div>
            <!-- Sidebar stays below on desktop hero -->
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="container" style="padding-top:40px;padding-bottom:80px;">
        <div class="course-detail-layout">
          <!-- LEFT COLUMN -->
          <div>
            <!-- Description -->
            <div class="glass-panel" style="margin-bottom:28px;">
              <h3 style="margin-bottom:14px;"><i class="fa-solid fa-book-open" style="color:var(--brand-blue);margin-right:8px;"></i>About This Course</h3>
              <p style="font-size:0.92rem;color:var(--text-secondary);line-height:1.85;white-space:pre-line;">${course.description}</p>
            </div>

            <!-- Requirements -->
            ${reqHtml ? `
            <div class="glass-panel" style="margin-bottom:28px;">
              <h3 style="margin-bottom:14px;"><i class="fa-solid fa-list-check" style="color:var(--brand-blue);margin-right:8px;"></i>Requirements</h3>
              <ul>${reqHtml}</ul>
            </div>
            ` : ''}

            <!-- Projects -->
            ${projHtml ? `
            <div class="glass-panel" style="margin-bottom:28px;">
              <h3 style="margin-bottom:16px;"><i class="fa-solid fa-folder-open" style="color:var(--brand-blue);margin-right:8px;"></i>Projects You'll Build</h3>
              <div style="display:flex;flex-direction:column;gap:8px;">${projHtml}</div>
            </div>
            ` : ''}

            <!-- Curriculum -->
            <div style="margin-bottom:28px;">
              <h3 style="margin-bottom:4px;"><i class="fa-solid fa-list" style="color:var(--brand-blue);margin-right:8px;"></i>Course Curriculum</h3>
              <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:16px;">${(course.modules || []).length} modules · ${(course.modules || []).reduce((a, m) => a + (m.lessons || []).length, 0)} lessons · ${course.duration} total</p>
              ${modulesHtml}
            </div>

            <!-- Reviews -->
            <div class="glass-panel" style="margin-bottom:28px;">
              <h3 style="margin-bottom:20px;"><i class="fa-solid fa-comments" style="color:var(--brand-blue);margin-right:8px;"></i>Student Reviews</h3>
              <div style="display:grid;grid-template-columns:auto 1fr;gap:24px;align-items:center;margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid var(--border-color);">
                <div style="text-align:center;background:var(--bg-primary);border:1px solid var(--border-color);border-radius:var(--radius-xl);padding:24px 32px;">
                  <div style="font-size:3rem;font-weight:900;color:var(--text-primary);line-height:1;">${course.rating}</div>
                  <div style="color:var(--warning);margin:8px 0;">${CoursesComponent._renderStars(course.rating)}</div>
                  <div style="font-size:0.78rem;color:var(--text-muted);">${reviews.length} reviews</div>
                </div>
                <div>${breakdownHtml}</div>
              </div>
              ${isEnrolled ? `
              <div style="background:var(--brand-blue-pale);border:1px solid rgba(61,70,216,0.2);border-radius:var(--radius-lg);padding:20px;margin-bottom:24px;">
                <h4 style="margin-bottom:14px;"><i class="fa-solid fa-pen-to-square"></i> Share Your Review</h4>
                <form id="form-course-review">
                  <div class="form-group">
                    <label>Rating</label>
                    <select id="review-stars-select" required style="background:var(--bg-card);border:1.5px solid var(--border-color);border-radius:var(--radius-md);padding:10px 14px;color:var(--text-primary);outline:none;">
                      <option value="5">5 Stars — Excellent</option>
                      <option value="4">4 Stars — Good</option>
                      <option value="3">3 Stars — Average</option>
                      <option value="2">2 Stars — Below Average</option>
                      <option value="1">1 Star — Poor</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="review-comment-textarea">Your Review</label>
                    <textarea id="review-comment-textarea" rows="3" required placeholder="What did you learn? What did you like?"></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary btn-sm">Submit Review <i class="fa-solid fa-paper-plane"></i></button>
                </form>
              </div>
              ` : ''}
              <div>${reviewsHtml}</div>
            </div>
          </div>

          <!-- RIGHT SIDEBAR -->
          <div class="course-detail-sticky">
            <div class="course-sidebar-card">
              <div class="sidebar-video-preview" id="preview-thumb-btn">
                <img src="${course.image}" alt="${course.title}">
                <div class="sidebar-play-btn">
                  <div class="sidebar-play-icon"><i class="fa-solid fa-play"></i></div>
                </div>
              </div>
              <div class="sidebar-body">
                ${isEnrolled ? `<div style="background:var(--success-bg);color:var(--success);border-radius:var(--radius-md);padding:10px 14px;font-size:0.85rem;font-weight:600;margin-bottom:12px;"><i class="fa-solid fa-circle-check"></i> You're enrolled in this course</div>` : ''}
                <div class="sidebar-price">₹${course.price.toLocaleString('en-IN')}</div>
                ${!isEnrolled ? `
                <div class="sidebar-price-original">₹${originalPrice.toLocaleString('en-IN')}</div>
                <div class="sidebar-discount"><i class="fa-solid fa-tag"></i> ${discountPct}% off — Limited time offer!</div>
                ` : ''}
                ${buyBtnHtml}
                ${wishBtn}
                <div class="course-includes">
                  <div class="course-include-item"><i class="fa-solid fa-infinity"></i><span>Lifetime access</span></div>
                  <div class="course-include-item"><i class="fa-solid fa-clock"></i><span>${course.duration} of HD content</span></div>
                  <div class="course-include-item"><i class="fa-solid fa-book-open"></i><span>${(course.modules || []).reduce((a, m) => a + (m.lessons || []).length, 0)} lessons across ${(course.modules || []).length} modules</span></div>
                  <div class="course-include-item"><i class="fa-solid fa-mobile-screen"></i><span>Access on mobile & desktop</span></div>
                  <div class="course-include-item"><i class="fa-solid fa-certificate"></i><span>Completion certificate</span></div>
                  <div class="course-include-item"><i class="fa-solid fa-file-download"></i><span>Downloadable resources</span></div>
                  <div class="course-include-item"><i class="fa-solid fa-globe"></i><span>${course.language}</span></div>
                </div>
                <div class="sidebar-guarantee"><i class="fa-solid fa-shield-halved" style="color:var(--success);margin-right:6px;"></i>7-day money-back guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  initList: function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const searchInput = document.getElementById('course-search-input');
    const levelFilter = document.getElementById('filter-level');
    const priceFilter = document.getElementById('filter-price');
    const grid = document.getElementById('all-courses-grid');
    const noResults = document.getElementById('no-results');

    const applyFilters = () => {
      const q = searchInput?.value.toLowerCase().trim() || '';
      const level = levelFilter?.value.toLowerCase() || '';
      const maxPrice = priceFilter?.value ? parseInt(priceFilter.value) : Infinity;
      let visible = 0;
      document.querySelectorAll('#all-courses-grid .course-card').forEach(card => {
        const title = card.getAttribute('data-title') || '';
        const cardLevel = card.getAttribute('data-level') || '';
        const price = parseInt(card.getAttribute('data-price') || '0');
        const show = title.includes(q) && (!level || cardLevel.includes(level)) && price <= maxPrice;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
    };

    searchInput?.addEventListener('input', applyFilters);
    levelFilter?.addEventListener('change', applyFilters);
    priceFilter?.addEventListener('change', applyFilters);

    // Focus search
    searchInput?.addEventListener('focus', () => { searchInput.style.borderColor = 'var(--brand-blue)'; searchInput.style.boxShadow = '0 0 0 3px var(--brand-blue-glow)'; });
    searchInput?.addEventListener('blur', () => { searchInput.style.borderColor = ''; searchInput.style.boxShadow = ''; });
  },

  initDetail: function (courseId) {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Module accordions
    document.querySelectorAll('.module-accordion').forEach(acc => {
      acc.querySelector('.module-header')?.addEventListener('click', () => {
        const isActive = acc.classList.contains('active');
        document.querySelectorAll('.module-accordion').forEach(a => a.classList.remove('active'));
        if (!isActive) acc.classList.add('active');
      });
    });

    // Enroll button
    const enrollBtn = document.getElementById('btn-enroll-course');
    enrollBtn?.addEventListener('click', () => {
      if (!window.db.getCurrentUser()) {
        window.app.showAuthModal(true);
        window.app.showToast('Please login to purchase this course.', 'warning');
      } else {
        window.location.hash = `#/pay/${courseId}`;
      }
    });

    // Wishlist button
    const wishBtn = document.getElementById('btn-wishlist');
    wishBtn?.addEventListener('click', () => {
      const cu = window.db.getCurrentUser();
      if (!cu) { window.app.showAuthModal(true); return; }
      const added = window.db.toggleWishlist(cu.username, courseId);
      window.app.showToast(added ? 'Added to wishlist!' : 'Removed from wishlist', added ? 'success' : 'info');
      window.app.renderRoute();
    });

    // Preview video
    document.getElementById('preview-thumb-btn')?.addEventListener('click', () => {
      const course = window.db.getCourseById(courseId);
      if (!course) return;
      window.app.showToast('Preview video opens here in production!', 'info');
    });

    // Review form
    const reviewForm = document.getElementById('form-course-review');
    reviewForm?.addEventListener('submit', e => {
      e.preventDefault();
      const cu = window.db.getCurrentUser();
      if (!cu) return;
      const rating = document.getElementById('review-stars-select').value;
      const comment = document.getElementById('review-comment-textarea').value;
      const res = window.db.addCourseReview(courseId, cu.username, cu.name, rating, comment);
      if (res.success) { window.app.showToast('Review submitted!', 'success'); window.app.renderRoute(); }
      else window.app.showToast(res.error, 'danger');
    });

    // Open first module
    document.querySelector('.module-accordion')?.classList.add('active');
  }
};

window.CoursesComponent = CoursesComponent;
