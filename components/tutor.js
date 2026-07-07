// Cubaze Academy — Tutor Dashboard v4.0 (components/tutor.js)
// Tutors are content contributors ONLY. They cannot create courses.
// Admin assigns courses to tutors. Tutors manage lesson content inside assigned courses.

const TutorComponent = {
  _activeTab: 'dashboard',
  _openCourseId: null,
  _addingLesson: null, // { modIdx }

  render: function () {
    const cu = window.db.getCurrentUser();
    if (!cu) return `<div class="container" style="text-align:center;padding:100px 0;"><h2>Please Login</h2><button class="btn btn-primary" onclick="window.app.showAuthModal(true)" style="margin-top:16px;">Login</button></div>`;
    if (cu.role !== 'instructor' && cu.role !== 'admin') return `<div class="container" style="text-align:center;padding:100px 0;"><h2>Access Restricted</h2><p style="margin:16px 0;">This dashboard is for tutors only.</p><a href="#/dashboard" class="btn btn-primary">Student Dashboard</a></div>`;

    const assignedCourses = window.db.getTutorAssignedCourses(cu.username);

    return `
      <style>
        /* =====================================================
           TUTOR DASHBOARD — Premium SaaS Design
        ===================================================== */
        .tutor-shell {
          display: flex;
          min-height: calc(100vh - var(--header-height));
          background: #F4F6FB;
          font-family: 'Inter', 'Outfit', sans-serif;
        }

        /* ---- SIDEBAR ---- */
        .tutor-sidebar {
          width: 260px;
          flex-shrink: 0;
          background: #0F172A;
          display: flex;
          flex-direction: column;
          height: calc(100vh - var(--header-height));
          position: sticky;
          top: var(--header-height);
          overflow-y: auto;
        }

        .tutor-sidebar-brand {
          padding: 28px 24px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .tutor-sidebar-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3D46D8, #6366F1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 12px;
        }

        .tutor-sidebar-name {
          font-weight: 700;
          font-size: 0.92rem;
          color: #F1F5F9;
          margin-bottom: 2px;
        }

        .tutor-sidebar-role {
          font-size: 0.73rem;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 600;
        }

        .tutor-nav-group {
          padding: 16px 12px 8px;
        }

        .tutor-nav-label {
          font-size: 0.68rem;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          padding: 0 12px;
          margin-bottom: 6px;
        }

        .tutor-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
          cursor: pointer;
          color: #94A3B8;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.18s;
          margin-bottom: 2px;
          user-select: none;
        }

        .tutor-nav-item i {
          width: 18px;
          text-align: center;
          font-size: 0.88rem;
        }

        .tutor-nav-item:hover {
          background: rgba(255,255,255,0.05);
          color: #E2E8F0;
        }

        .tutor-nav-item.active {
          background: rgba(61,70,216,0.25);
          color: #818CF8;
          font-weight: 700;
        }

        .tutor-nav-item.active i {
          color: #6366F1;
        }

        .tutor-sidebar-footer {
          margin-top: auto;
          padding: 16px 12px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tutor-sidebar-footer a,
        .tutor-sidebar-footer button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
          color: #94A3B8;
          font-size: 0.83rem;
          font-weight: 500;
          text-decoration: none;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.18s;
          width: 100%;
          font-family: inherit;
        }

        .tutor-sidebar-footer a:hover,
        .tutor-sidebar-footer button:hover {
          background: rgba(255,255,255,0.05);
          color: #E2E8F0;
        }

        /* ---- MAIN CONTENT ---- */
        .tutor-main {
          flex: 1;
          padding: 36px 40px;
          overflow-y: auto;
          min-height: calc(100vh - var(--header-height));
        }

        .tutor-page-header {
          margin-bottom: 28px;
        }

        .tutor-page-header h1 {
          font-size: 1.6rem;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 4px;
        }

        .tutor-page-header p {
          font-size: 0.85rem;
          color: #64748B;
        }

        /* ---- STAT CARDS ---- */
        .tutor-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }

        .tutor-stat-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 20px 22px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.04);
        }

        .tutor-stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .tutor-stat-icon.blue  { background: #EFF2FE; color: #3D46D8; }
        .tutor-stat-icon.green { background: #ECFDF5; color: #059669; }
        .tutor-stat-icon.gold  { background: #FFFBEB; color: #D97706; }
        .tutor-stat-icon.purple{ background: #F5F3FF; color: #7C3AED; }

        .tutor-stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0F172A;
          line-height: 1;
          margin-bottom: 4px;
        }

        .tutor-stat-label {
          font-size: 0.75rem;
          color: #64748B;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        /* ---- COURSE CARDS ---- */
        .tutor-course-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .tutor-course-card {
          background: #FFFFFF;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.05);
          border: 1px solid rgba(0,0,0,0.04);
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }

        .tutor-course-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.1);
        }

        .tutor-course-thumb {
          width: 100%;
          height: 160px;
          object-fit: cover;
          display: block;
          background: #E2E8F0;
        }

        .tutor-course-body {
          padding: 18px 20px;
        }

        .tutor-course-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 10px;
          line-height: 1.35;
        }

        .tutor-course-meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 16px;
        }

        .tutor-course-meta-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .tutor-course-meta-val {
          font-size: 1rem;
          font-weight: 800;
          color: #0F172A;
        }

        .tutor-course-meta-lbl {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94A3B8;
          font-weight: 600;
        }

        .tutor-open-btn {
          width: 100%;
          padding: 10px 0;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #3D46D8, #6366F1);
          color: #fff;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: inherit;
          transition: opacity 0.2s;
        }

        .tutor-open-btn:hover { opacity: 0.88; }

        /* ---- LESSON MANAGER ---- */
        .lesson-manager-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .lesson-back-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1.5px solid #E2E8F0;
          background: #FFFFFF;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          transition: all 0.18s;
          flex-shrink: 0;
        }

        .lesson-back-btn:hover {
          background: #F1F5F9;
          border-color: #CBD5E1;
          color: #0F172A;
        }

        .lesson-manager-course-info {
          flex: 1;
        }

        .lesson-manager-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 2px;
        }

        .lesson-manager-subtitle {
          font-size: 0.8rem;
          color: #64748B;
        }

        /* Read-only course info banner */
        .course-readonly-banner {
          background: linear-gradient(135deg, #EFF2FE, #F5F3FF);
          border: 1.5px solid #C7D2FE;
          border-radius: 14px;
          padding: 16px 20px;
          margin-bottom: 24px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 12px;
        }

        .banner-field {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .banner-field-label {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #6366F1;
        }

        .banner-field-value {
          font-size: 0.85rem;
          font-weight: 600;
          color: #0F172A;
        }

        .readonly-lock {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.68rem;
          color: #6366F1;
          background: rgba(99,102,241,0.1);
          border-radius: 20px;
          padding: 1px 8px;
          font-weight: 700;
          margin-left: 6px;
        }

        /* Module & Lesson list */
        .lesson-module-card {
          background: #FFFFFF;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.04);
          margin-bottom: 20px;
          overflow: hidden;
        }

        .lesson-module-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 22px;
          background: #F8FAFC;
          border-bottom: 1px solid #F1F5F9;
        }

        .lesson-module-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: #0F172A;
        }

        .lesson-count-badge {
          background: #EFF2FE;
          color: #3D46D8;
          border-radius: 20px;
          padding: 3px 12px;
          font-size: 0.72rem;
          font-weight: 700;
        }

        .lesson-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 22px;
          border-bottom: 1px solid #F8FAFC;
          transition: background 0.15s;
        }

        .lesson-item:last-child { border-bottom: none; }
        .lesson-item:hover { background: #FAFBFF; }

        .lesson-item-num {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #EFF2FE;
          color: #3D46D8;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .lesson-item-info {
          flex: 1;
          min-width: 0;
        }

        .lesson-item-title {
          font-size: 0.88rem;
          font-weight: 600;
          color: #0F172A;
          margin-bottom: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .lesson-item-meta {
          font-size: 0.75rem;
          color: #94A3B8;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .lesson-item-actions {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
        }

        .lesson-action-btn {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          border: 1.5px solid #E2E8F0;
          background: #FFFFFF;
          color: #475569;
          font-size: 0.78rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }

        .lesson-action-btn:hover { background: #F1F5F9; color: #0F172A; }
        .lesson-action-btn.danger:hover { background: #FEF2F2; border-color: #FECACA; color: #DC2626; }

        /* Add lesson form */
        .add-lesson-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          color: #3D46D8;
          font-size: 0.83rem;
          font-weight: 600;
          cursor: pointer;
          border-top: 1.5px dashed #C7D2FE;
          background: #FAFBFF;
          transition: background 0.15s;
        }

        .add-lesson-trigger:hover { background: #EFF2FE; }

        .add-lesson-form-wrap {
          padding: 20px 22px;
          background: #FAFBFF;
          border-top: 1.5px dashed #C7D2FE;
          display: none;
        }

        .add-lesson-form-wrap.open { display: block; }

        .add-lesson-form-wrap label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #374151;
          display: block;
          margin-bottom: 6px;
        }

        .add-lesson-form-wrap input,
        .add-lesson-form-wrap textarea,
        .add-lesson-form-wrap select {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          font-size: 0.85rem;
          color: #0F172A;
          background: #FFFFFF;
          font-family: inherit;
          outline: none;
          transition: border-color 0.18s;
          box-sizing: border-box;
        }

        .add-lesson-form-wrap input:focus,
        .add-lesson-form-wrap textarea:focus {
          border-color: #3D46D8;
        }

        /* Profile / Settings tabs */
        .tutor-form-card {
          background: #FFFFFF;
          border-radius: 18px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.04);
          padding: 28px 32px;
        }

        /* Notifications / Messages */
        .notif-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px 20px;
          border-bottom: 1px solid #F1F5F9;
        }

        .notif-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #3D46D8;
          margin-top: 6px;
          flex-shrink: 0;
        }

        @media (max-width: 900px) {
          .tutor-sidebar { display: none; }
          .tutor-main { padding: 20px; }
        }
      </style>

      <div class="tutor-shell">
        <!-- SIDEBAR -->
        <aside class="tutor-sidebar">
          <div class="tutor-sidebar-brand">
            <div class="tutor-sidebar-avatar">${cu.name.charAt(0).toUpperCase()}</div>
            <div class="tutor-sidebar-name">${cu.name}</div>
            <div class="tutor-sidebar-role">Content Instructor</div>
          </div>

          <div class="tutor-nav-group">
            <div class="tutor-nav-label">Main</div>
            ${[
              ['dashboard', 'fa-gauge-simple-high', 'Dashboard'],
              ['courses', 'fa-book-open', 'My Assigned Courses'],
              ['lessons', 'fa-list-check', 'Lesson Manager'],
              ['upload', 'fa-cloud-arrow-up', 'Upload Content'],
            ].map(([tab, icon, label]) =>
              `<div class="tutor-nav-item ${TutorComponent._activeTab === tab ? 'active' : ''}" data-tutor-tab="${tab}">
                <i class="fa-solid ${icon}"></i>${label}
              </div>`
            ).join('')}
          </div>

          <div class="tutor-nav-group">
            <div class="tutor-nav-label">Account</div>
            ${[
              ['messages', 'fa-envelope', 'Messages'],
              ['notifications', 'fa-bell', 'Notifications'],
              ['profile', 'fa-circle-user', 'Profile'],
              ['settings', 'fa-gear', 'Settings'],
            ].map(([tab, icon, label]) =>
              `<div class="tutor-nav-item ${TutorComponent._activeTab === tab ? 'active' : ''}" data-tutor-tab="${tab}">
                <i class="fa-solid ${icon}"></i>${label}
              </div>`
            ).join('')}
          </div>

          <div class="tutor-sidebar-footer">
            <a href="#/">
              <i class="fa-solid fa-globe"></i>View Website
            </a>
            <button onclick="window.db.logoutUser(); window.location.hash='/';">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>Logout
            </button>
          </div>
        </aside>

        <!-- MAIN CONTENT -->
        <main class="tutor-main" id="tutor-main-content">
          ${TutorComponent._renderTab(TutorComponent._activeTab, cu, assignedCourses)}
        </main>
      </div>
    `;
  },

  _renderTab: function (tab, cu, assignedCourses) {
    switch (tab) {
      case 'dashboard':      return TutorComponent._renderDashboard(cu, assignedCourses);
      case 'courses':        return TutorComponent._renderCourses(assignedCourses);
      case 'lessons':
        if (TutorComponent._openCourseId) {
          const c = assignedCourses.find(x => x.id === TutorComponent._openCourseId)
                 || window.db.getCourseById(TutorComponent._openCourseId);
          return TutorComponent._renderLessonManager(c, cu);
        }
        return TutorComponent._renderCourses(assignedCourses);
      case 'upload':         return TutorComponent._renderUpload(assignedCourses, cu);
      case 'messages':       return TutorComponent._renderMessages();
      case 'notifications':  return TutorComponent._renderNotifications();
      case 'profile':        return TutorComponent._renderProfile(cu);
      case 'settings':       return TutorComponent._renderSettings(cu);
      default:               return TutorComponent._renderDashboard(cu, assignedCourses);
    }
  },

  // =====================================================
  // DASHBOARD OVERVIEW
  // =====================================================
  _renderDashboard: function (cu, assignedCourses) {
    const totalLessons = assignedCourses.reduce((s, c) =>
      s + (c.modules || []).reduce((ms, m) => ms + (m.lessons || []).length, 0), 0);

    return `
      <div class="tutor-page-header">
        <h1>Welcome back, ${cu.name.split(' ')[0]}! 👋</h1>
        <p>Here's a summary of your assigned courses and lesson activity.</p>
      </div>

      <!-- Stats -->
      <div class="tutor-stats-grid">
        <div class="tutor-stat-card">
          <div class="tutor-stat-icon blue"><i class="fa-solid fa-book-open"></i></div>
          <div>
            <div class="tutor-stat-value">${assignedCourses.length}</div>
            <div class="tutor-stat-label">Assigned Courses</div>
          </div>
        </div>
        <div class="tutor-stat-card">
          <div class="tutor-stat-icon green"><i class="fa-solid fa-circle-play"></i></div>
          <div>
            <div class="tutor-stat-value">${totalLessons}</div>
            <div class="tutor-stat-label">Total Lessons</div>
          </div>
        </div>
        <div class="tutor-stat-card">
          <div class="tutor-stat-icon gold"><i class="fa-solid fa-users"></i></div>
          <div>
            <div class="tutor-stat-value">${assignedCourses.reduce((s, c) => s + (c.studentsCount || 0), 0).toLocaleString('en-IN')}</div>
            <div class="tutor-stat-label">Total Students</div>
          </div>
        </div>
        <div class="tutor-stat-card">
          <div class="tutor-stat-icon purple"><i class="fa-solid fa-star"></i></div>
          <div>
            <div class="tutor-stat-value">${assignedCourses.length > 0 ? (assignedCourses.reduce((s,c)=>s+c.rating,0)/assignedCourses.length).toFixed(1) : '—'}</div>
            <div class="tutor-stat-label">Avg. Rating</div>
          </div>
        </div>
      </div>

      <!-- Notice Banner -->
      <div style="background:linear-gradient(135deg,#EFF2FE,#F5F3FF);border:1.5px solid #C7D2FE;border-radius:16px;padding:20px 24px;margin-bottom:28px;display:flex;align-items:flex-start;gap:16px;">
        <div style="width:40px;height:40px;background:#6366F1;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff;font-size:1.1rem;"><i class="fa-solid fa-shield-halved"></i></div>
        <div>
          <div style="font-weight:700;color:#312E81;margin-bottom:4px;">Your Role: Content Contributor</div>
          <div style="font-size:0.83rem;color:#4338CA;line-height:1.55;">You can <strong>add, edit, and manage lessons</strong> inside the courses assigned to you by your Admin. You cannot create new courses, change course details, pricing, or publishing settings — those are managed by the Admin.</div>
        </div>
      </div>

      <!-- Assigned Courses Quick View -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <div style="font-size:1.05rem;font-weight:700;color:#0F172A;">Your Assigned Courses</div>
        <div data-tutor-tab="courses" style="font-size:0.83rem;color:#3D46D8;font-weight:600;cursor:pointer;">View All →</div>
      </div>
      ${assignedCourses.length === 0
        ? `<div style="background:#FFFFFF;border-radius:16px;padding:48px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.04);">
            <div style="font-size:3rem;margin-bottom:16px;">📚</div>
            <h3 style="color:#0F172A;margin-bottom:8px;">No Courses Assigned Yet</h3>
            <p style="color:#64748B;font-size:0.85rem;">Your admin will assign you to one or more courses. Check back later or contact your Admin.</p>
          </div>`
        : `<div class="tutor-course-grid">
            ${assignedCourses.slice(0, 3).map(c => TutorComponent._courseMiniCard(c)).join('')}
          </div>`
      }
    `;
  },

  // =====================================================
  // MY ASSIGNED COURSES
  // =====================================================
  _renderCourses: function (assignedCourses) {
    return `
      <div class="tutor-page-header">
        <h1>My Assigned Courses</h1>
        <p>These are the courses assigned to you by your Admin. Click a course to manage its lesson content.</p>
      </div>

      ${assignedCourses.length === 0
        ? `<div style="background:#FFFFFF;border-radius:18px;padding:72px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.04);">
            <div style="font-size:4rem;margin-bottom:16px;">📭</div>
            <h2 style="margin-bottom:10px;color:#0F172A;">No Courses Assigned</h2>
            <p style="color:#64748B;max-width:380px;margin:0 auto;line-height:1.6;font-size:0.88rem;">Your Admin hasn't assigned any courses to you yet. Once assigned, they'll appear here and you can start uploading lesson content.</p>
          </div>`
        : `<div class="tutor-course-grid">
            ${assignedCourses.map(c => TutorComponent._courseMiniCard(c)).join('')}
          </div>`
      }
    `;
  },

  _courseMiniCard: function (c) {
    const totalLessons = (c.modules || []).reduce((s, m) => s + (m.lessons || []).length, 0);
    const modules = (c.modules || []).length;
    const lastUpdated = c.updatedDate || c.createdDate || 'Recently';

    return `
      <div class="tutor-course-card" onclick="TutorComponent._openCourse('${c.id}')">
        <img src="${c.image}" alt="${c.title}" class="tutor-course-thumb">
        <div class="tutor-course-body">
          <div class="tutor-course-title">${c.title}</div>
          <div class="tutor-course-meta">
            <div class="tutor-course-meta-item">
              <div class="tutor-course-meta-val">${totalLessons}</div>
              <div class="tutor-course-meta-lbl">Total Lessons</div>
            </div>
            <div class="tutor-course-meta-item">
              <div class="tutor-course-meta-val">${modules}</div>
              <div class="tutor-course-meta-lbl">Modules</div>
            </div>
            <div class="tutor-course-meta-item">
              <div class="tutor-course-meta-val">${(c.studentsCount||0).toLocaleString('en-IN')}</div>
              <div class="tutor-course-meta-lbl">Students</div>
            </div>
            <div class="tutor-course-meta-item">
              <div class="tutor-course-meta-val">★ ${c.rating}</div>
              <div class="tutor-course-meta-lbl">Rating</div>
            </div>
          </div>
          <button class="tutor-open-btn">
            <i class="fa-solid fa-pen-to-square"></i> Manage Lessons
          </button>
        </div>
      </div>
    `;
  },

  // =====================================================
  // LESSON MANAGER — full course curriculum editor
  // =====================================================
  _renderLessonManager: function (course, cu) {
    if (!course) return `<div style="padding:40px;text-align:center;color:#64748B;">Course not found.</div>`;

    const modulesHtml = (course.modules || []).map((mod, modIdx) => {
      const lessonsHtml = (mod.lessons || []).map((les, lesIdx) => `
        <div class="lesson-item">
          <div class="lesson-item-num">${lesIdx + 1}</div>
          <div class="lesson-item-info">
            <div class="lesson-item-title">${les.title}</div>
            <div class="lesson-item-meta">
              <span><i class="fa-regular fa-clock"></i> ${les.duration || '—'}</span>
              ${les.videoUrl
                ? `<a href="${les.videoUrl}" target="_blank" style="color:#EF4444;font-weight:600;text-decoration:none;"><i class="fa-brands fa-youtube"></i> Video</a>`
                : `<span style="color:#94A3B8;font-style:italic;">No video URL</span>`
              }
              ${les.description ? `<span style="color:#94A3B8;">• ${les.description.slice(0,40)}${les.description.length>40?'...':''}</span>` : ''}
            </div>
          </div>
          <div class="lesson-item-actions">
            <button class="lesson-action-btn danger btn-del-lesson" data-course-id="${course.id}" data-lesson-id="${les.id}" title="Delete Lesson">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      `).join('');

      const formId = `add-form-${modIdx}`;
      return `
        <div class="lesson-module-card">
          <div class="lesson-module-header">
            <div class="lesson-module-name"><i class="fa-solid fa-layer-group" style="color:#6366F1;margin-right:8px;"></i>${mod.title}</div>
            <span class="lesson-count-badge">${(mod.lessons||[]).length} lessons</span>
          </div>
          ${lessonsHtml || `<div style="padding:16px 22px;color:#94A3B8;font-size:0.83rem;font-style:italic;">No lessons in this module yet. Add one below.</div>`}

          <!-- Add Lesson Trigger -->
          <div class="add-lesson-trigger btn-show-add-form" data-form-id="${formId}">
            <i class="fa-solid fa-plus-circle"></i> Add New Lesson
          </div>

          <!-- Add Lesson Form -->
          <div class="add-lesson-form-wrap" id="${formId}">
            <form class="form-add-lesson" data-course-id="${course.id}" data-mod-idx="${modIdx}">
              <div style="display:grid;grid-template-columns:2fr 1fr;gap:14px;margin-bottom:14px;">
                <div>
                  <label>Lesson Title *</label>
                  <input type="text" class="l-title" required placeholder="e.g. Introduction to Blender Interface">
                </div>
                <div>
                  <label>Duration (MM:SS)</label>
                  <input type="text" class="l-duration" placeholder="e.g. 12:45">
                </div>
              </div>
              <div style="margin-bottom:14px;">
                <label>YouTube Video URL *</label>
                <input type="url" class="l-url" required placeholder="https://www.youtube.com/watch?v=...">
              </div>
              <div style="margin-bottom:16px;">
                <label>Lesson Description (optional)</label>
                <textarea class="l-desc" rows="2" placeholder="Brief description of what this lesson covers..."></textarea>
              </div>
              <div style="display:flex;gap:10px;">
                <button type="submit" style="padding:10px 20px;background:linear-gradient(135deg,#3D46D8,#6366F1);color:#fff;border:none;border-radius:10px;font-size:0.85rem;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:8px;font-family:inherit;">
                  <i class="fa-solid fa-plus"></i> Add Lesson
                </button>
                <button type="button" class="btn-cancel-add-form" data-form-id="${formId}" style="padding:10px 20px;background:#F1F5F9;color:#475569;border:none;border-radius:10px;font-size:0.85rem;font-weight:600;cursor:pointer;font-family:inherit;">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      `;
    }).join('');

    return `
      <!-- Header with back button -->
      <div class="lesson-manager-header">
        <button class="lesson-back-btn" id="btn-back-to-courses">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <div class="lesson-manager-course-info">
          <div class="lesson-manager-title">Lesson Manager</div>
          <div class="lesson-manager-subtitle"><i class="fa-solid fa-book-open" style="color:#6366F1;margin-right:4px;"></i>${course.title}</div>
        </div>
        <a href="#/course/${course.id}" target="_blank" style="display:flex;align-items:center;gap:8px;padding:9px 16px;background:#FFFFFF;border:1.5px solid #E2E8F0;border-radius:10px;color:#475569;text-decoration:none;font-size:0.83rem;font-weight:600;">
          <i class="fa-solid fa-eye"></i> Preview
        </a>
      </div>

      <!-- Read-only course info -->
      <div class="course-readonly-banner">
        <div class="banner-field">
          <div class="banner-field-label">Course Name <span class="readonly-lock"><i class="fa-solid fa-lock"></i> Admin Only</span></div>
          <div class="banner-field-value">${course.title}</div>
        </div>
        <div class="banner-field">
          <div class="banner-field-label">Price <span class="readonly-lock"><i class="fa-solid fa-lock"></i> Admin Only</span></div>
          <div class="banner-field-value">₹${course.price.toLocaleString('en-IN')}</div>
        </div>
        <div class="banner-field">
          <div class="banner-field-label">Level <span class="readonly-lock"><i class="fa-solid fa-lock"></i> Admin Only</span></div>
          <div class="banner-field-value">${course.level || '—'}</div>
        </div>
        <div class="banner-field">
          <div class="banner-field-label">Students <span class="readonly-lock"><i class="fa-solid fa-lock"></i> Admin Only</span></div>
          <div class="banner-field-value">${(course.studentsCount||0).toLocaleString('en-IN')}</div>
        </div>
        <div class="banner-field">
          <div class="banner-field-label">Rating <span class="readonly-lock"><i class="fa-solid fa-lock"></i> Admin Only</span></div>
          <div class="banner-field-value">★ ${course.rating}</div>
        </div>
      </div>

      <!-- Modules -->
      ${modulesHtml || `<div style="background:#FFFFFF;border-radius:16px;padding:48px;text-align:center;">
        <p style="color:#64748B;">This course has no modules yet. Modules are created by the Admin.</p>
      </div>`}
    `;
  },

  // =====================================================
  // UPLOAD CONTENT
  // =====================================================
  _renderUpload: function (assignedCourses, cu) {
    return `
      <div class="tutor-page-header">
        <h1>Upload Content</h1>
        <p>Select a course and module to add a new lesson with your video, description, and resources.</p>
      </div>

      <div class="tutor-form-card">
        <form id="form-quick-upload">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
            <div>
              <label style="font-size:0.78rem;font-weight:700;color:#374151;display:block;margin-bottom:8px;">Select Course *</label>
              <select id="upload-course" required style="width:100%;padding:10px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:0.85rem;color:#0F172A;background:#fff;font-family:inherit;outline:none;">
                <option value="">-- Choose a Course --</option>
                ${assignedCourses.map(c => `<option value="${c.id}">${c.title}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="font-size:0.78rem;font-weight:700;color:#374151;display:block;margin-bottom:8px;">Select Module *</label>
              <select id="upload-module" required style="width:100%;padding:10px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:0.85rem;color:#0F172A;background:#fff;font-family:inherit;outline:none;">
                <option value="">-- Choose a Module --</option>
              </select>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px;margin-bottom:20px;">
            <div>
              <label style="font-size:0.78rem;font-weight:700;color:#374151;display:block;margin-bottom:8px;">Lesson Title *</label>
              <input type="text" id="upload-title" required placeholder="e.g. Introduction to UV Unwrapping" style="width:100%;padding:10px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:0.85rem;color:#0F172A;font-family:inherit;outline:none;box-sizing:border-box;">
            </div>
            <div>
              <label style="font-size:0.78rem;font-weight:700;color:#374151;display:block;margin-bottom:8px;">Duration (MM:SS)</label>
              <input type="text" id="upload-duration" placeholder="e.g. 18:30" style="width:100%;padding:10px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:0.85rem;color:#0F172A;font-family:inherit;outline:none;box-sizing:border-box;">
            </div>
          </div>

          <div style="margin-bottom:20px;">
            <label style="font-size:0.78rem;font-weight:700;color:#374151;display:block;margin-bottom:8px;">YouTube Video URL *</label>
            <input type="url" id="upload-url" required placeholder="https://www.youtube.com/watch?v=..." style="width:100%;padding:10px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:0.85rem;color:#0F172A;font-family:inherit;outline:none;box-sizing:border-box;">
          </div>

          <div style="margin-bottom:24px;">
            <label style="font-size:0.78rem;font-weight:700;color:#374151;display:block;margin-bottom:8px;">Lesson Description</label>
            <textarea id="upload-desc" rows="4" placeholder="Describe what students will learn in this lesson..." style="width:100%;padding:10px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:0.85rem;color:#0F172A;font-family:inherit;outline:none;box-sizing:border-box;resize:vertical;"></textarea>
          </div>

          <!-- PDF / ZIP attachments (UI only) -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:28px;">
            <div>
              <label style="font-size:0.78rem;font-weight:700;color:#374151;display:block;margin-bottom:8px;"><i class="fa-solid fa-file-pdf" style="color:#DC2626;"></i> Upload PDF Resources</label>
              <div style="border:2px dashed #CBD5E1;border-radius:12px;padding:20px;text-align:center;cursor:pointer;background:#FAFBFF;transition:border-color 0.18s;" onclick="window.app.showToast('PDF upload available in full backend version.','info')">
                <i class="fa-solid fa-file-pdf" style="font-size:1.8rem;color:#CBD5E1;display:block;margin-bottom:8px;"></i>
                <span style="font-size:0.78rem;color:#94A3B8;">Click to upload PDF</span>
              </div>
            </div>
            <div>
              <label style="font-size:0.78rem;font-weight:700;color:#374151;display:block;margin-bottom:8px;"><i class="fa-solid fa-file-zipper" style="color:#F59E0B;"></i> Upload ZIP / Assets</label>
              <div style="border:2px dashed #CBD5E1;border-radius:12px;padding:20px;text-align:center;cursor:pointer;background:#FAFBFF;" onclick="window.app.showToast('ZIP upload available in full backend version.','info')">
                <i class="fa-solid fa-file-zipper" style="font-size:1.8rem;color:#CBD5E1;display:block;margin-bottom:8px;"></i>
                <span style="font-size:0.78rem;color:#94A3B8;">Click to upload ZIP</span>
              </div>
            </div>
          </div>

          <div style="display:flex;gap:12px;">
            <button type="submit" style="padding:12px 28px;background:linear-gradient(135deg,#3D46D8,#6366F1);color:#fff;border:none;border-radius:12px;font-size:0.9rem;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:8px;font-family:inherit;">
              <i class="fa-solid fa-plus-circle"></i> Add Lesson
            </button>
            <button type="button" onclick="window.app.showToast('Saved as draft.','info')" style="padding:12px 28px;background:#F1F5F9;color:#475569;border:none;border-radius:12px;font-size:0.9rem;font-weight:600;cursor:pointer;font-family:inherit;">
              Save Draft
            </button>
          </div>
        </form>
      </div>
    `;
  },

  // =====================================================
  // MESSAGES
  // =====================================================
  _renderMessages: function () {
    return `
      <div class="tutor-page-header">
        <h1>Messages</h1>
        <p>Direct messages from your Admin and students.</p>
      </div>
      <div class="tutor-form-card" style="text-align:center;padding:72px;">
        <div style="font-size:3.5rem;margin-bottom:16px;">💬</div>
        <h3 style="margin-bottom:8px;color:#0F172A;">No messages yet</h3>
        <p style="color:#64748B;font-size:0.85rem;">When your Admin or students send you a message, it will appear here.</p>
      </div>
    `;
  },

  // =====================================================
  // NOTIFICATIONS
  // =====================================================
  _renderNotifications: function () {
    const items = [
      { icon: 'fa-graduation-cap', color: '#6366F1', title: 'You have been assigned a new course', time: '2 hours ago', body: 'The Admin has assigned "Blender Premium Course" to you. You can now upload lessons.' },
      { icon: 'fa-star', color: '#F59E0B', title: 'New review on your lesson', time: 'Yesterday', body: 'A student left a 5-star review on your lesson "Introduction to Blender".' },
      { icon: 'fa-circle-check', color: '#10B981', title: 'Your lesson has been published', time: '2 days ago', body: 'The Admin reviewed and published your lesson "Workspace Setup".' },
    ];
    return `
      <div class="tutor-page-header">
        <h1>Notifications</h1>
        <p>Your latest activity updates and alerts.</p>
      </div>
      <div class="tutor-form-card" style="padding:0;overflow:hidden;">
        ${items.map(n => `
          <div class="notif-item">
            <div style="width:38px;height:38px;border-radius:12px;background:${n.color}1A;color:${n.color};display:flex;align-items:center;justify-content:center;font-size:0.95rem;flex-shrink:0;"><i class="fa-solid ${n.icon}"></i></div>
            <div>
              <div style="font-size:0.88rem;font-weight:700;color:#0F172A;margin-bottom:3px;">${n.title}</div>
              <div style="font-size:0.78rem;color:#64748B;margin-bottom:4px;">${n.body}</div>
              <div style="font-size:0.72rem;color:#94A3B8;">${n.time}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // =====================================================
  // PROFILE
  // =====================================================
  _renderProfile: function (cu) {
    return `
      <div class="tutor-page-header">
        <h1>My Profile</h1>
        <p>Manage your public tutor profile and bio.</p>
      </div>
      <div class="tutor-form-card">
        <div style="display:flex;align-items:center;gap:20px;padding-bottom:24px;margin-bottom:24px;border-bottom:1px solid #F1F5F9;">
          <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#3D46D8,#6366F1);display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:800;color:#fff;flex-shrink:0;">${cu.name.charAt(0)}</div>
          <div>
            <div style="font-weight:800;font-size:1.15rem;color:#0F172A;">${cu.name}</div>
            <div style="color:#6366F1;font-weight:600;font-size:0.83rem;">@${cu.username} · Content Instructor</div>
            <div style="font-size:0.78rem;color:#94A3B8;margin-top:4px;">Member since ${cu.registeredDate || 'N/A'}</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
          <div>
            <label style="font-size:0.75rem;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Full Name</label>
            <input type="text" value="${cu.name}" id="prof-name" style="width:100%;padding:10px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:0.85rem;font-family:inherit;outline:none;box-sizing:border-box;">
          </div>
          <div>
            <label style="font-size:0.75rem;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Username <span style="color:#94A3B8;">(cannot change)</span></label>
            <input type="text" value="${cu.username}" disabled style="width:100%;padding:10px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:0.85rem;font-family:inherit;outline:none;box-sizing:border-box;opacity:0.6;background:#F8FAFC;">
          </div>
        </div>
        <div style="margin-bottom:20px;">
          <label style="font-size:0.75rem;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Bio / Expertise</label>
          <textarea id="prof-bio" rows="3" style="width:100%;padding:10px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:0.85rem;font-family:inherit;outline:none;box-sizing:border-box;resize:vertical;">${cu.authorBio || ''}</textarea>
        </div>
        <button onclick="window.app.showToast('Profile updated!','success')" style="padding:11px 24px;background:linear-gradient(135deg,#3D46D8,#6366F1);color:#fff;border:none;border-radius:10px;font-size:0.88rem;font-weight:700;cursor:pointer;font-family:inherit;">
          <i class="fa-solid fa-save"></i> Save Changes
        </button>
      </div>
    `;
  },

  // =====================================================
  // SETTINGS
  // =====================================================
  _renderSettings: function (cu) {
    return `
      <div class="tutor-page-header">
        <h1>Settings</h1>
        <p>Manage your account preferences and notifications.</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div class="tutor-form-card">
          <h3 style="margin-bottom:20px;font-size:0.95rem;"><i class="fa-solid fa-bell" style="color:#6366F1;margin-right:8px;"></i>Notification Preferences</h3>
          ${[
            ['Email me when Admin assigns a new course', true],
            ['Email me when a lesson is approved', true],
            ['Email me when a student leaves a review', false],
            ['Weekly summary emails', false],
          ].map(([label, checked]) => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid #F1F5F9;">
              <span style="font-size:0.85rem;color:#374151;">${label}</span>
              <label style="position:relative;display:inline-block;width:40px;height:22px;cursor:pointer;">
                <input type="checkbox" ${checked?'checked':''} style="opacity:0;width:0;height:0;" onchange="window.app.showToast('Preference saved','success')">
                <span style="position:absolute;inset:0;background:${checked?'#6366F1':'#CBD5E1'};border-radius:22px;transition:background 0.2s;"></span>
                <span style="position:absolute;top:3px;left:${checked?'21':'3'}px;width:16px;height:16px;background:#fff;border-radius:50%;transition:left 0.2s;"></span>
              </label>
            </div>
          `).join('')}
        </div>
        <div class="tutor-form-card">
          <h3 style="margin-bottom:20px;font-size:0.95rem;"><i class="fa-solid fa-key" style="color:#6366F1;margin-right:8px;"></i>Change Password</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
            <div>
              <label style="font-size:0.75rem;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Current Password</label>
              <input type="password" placeholder="••••••••" style="width:100%;padding:10px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:0.85rem;font-family:inherit;outline:none;box-sizing:border-box;">
            </div>
            <div>
              <label style="font-size:0.75rem;font-weight:700;color:#374151;display:block;margin-bottom:6px;">New Password</label>
              <input type="password" placeholder="••••••••" style="width:100%;padding:10px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:0.85rem;font-family:inherit;outline:none;box-sizing:border-box;">
            </div>
          </div>
          <button onclick="window.app.showToast('Password changed!','success')" style="padding:11px 24px;background:#F1F5F9;color:#374151;border:none;border-radius:10px;font-size:0.88rem;font-weight:700;cursor:pointer;font-family:inherit;">
            Update Password
          </button>
        </div>
      </div>
    `;
  },

  // =====================================================
  // OPEN COURSE — navigate into lesson manager
  // =====================================================
  _openCourse: function (courseId) {
    TutorComponent._openCourseId = courseId;
    TutorComponent._activeTab = 'lessons';
    const cu = window.db.getCurrentUser();
    const assignedCourses = window.db.getTutorAssignedCourses(cu.username);
    const course = assignedCourses.find(c => c.id === courseId) || window.db.getCourseById(courseId);

    document.getElementById('tutor-main-content').innerHTML =
      TutorComponent._renderLessonManager(course, cu);

    // Update sidebar active
    document.querySelectorAll('.tutor-nav-item').forEach(el => el.classList.remove('active'));
    document.querySelector('[data-tutor-tab="lessons"]')?.classList.add('active');

    TutorComponent._bindLessonManagerEvents(courseId);
  },

  // =====================================================
  // INIT
  // =====================================================
  init: function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    TutorComponent._openCourseId = null;
    TutorComponent._activeTab = 'dashboard';

    TutorComponent._bindSidebar();
    TutorComponent._bindCourseCards();
    TutorComponent._bindUploadForm();
  },

  _bindSidebar: function () {
    document.querySelectorAll('.tutor-nav-item[data-tutor-tab]').forEach(item => {
      item.addEventListener('click', () => {
        const tab = item.getAttribute('data-tutor-tab');
        TutorComponent._activeTab = tab;
        if (tab !== 'lessons') TutorComponent._openCourseId = null;

        document.querySelectorAll('.tutor-nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const cu = window.db.getCurrentUser();
        const assignedCourses = window.db.getTutorAssignedCourses(cu.username);

        document.getElementById('tutor-main-content').innerHTML =
          TutorComponent._renderTab(tab, cu, assignedCourses);

        TutorComponent._bindCourseCards();
        TutorComponent._bindUploadForm();
        if (TutorComponent._openCourseId) {
          TutorComponent._bindLessonManagerEvents(TutorComponent._openCourseId);
        }
      });
    });

    // Quick links in dashboard
    document.querySelectorAll('[data-tutor-tab]').forEach(el => {
      el.addEventListener('click', () => {
        const tab = el.getAttribute('data-tutor-tab');
        document.querySelector(`.tutor-nav-item[data-tutor-tab="${tab}"]`)?.click();
      });
    });
  },

  _bindCourseCards: function () {
    // Course card clicks already use onclick="TutorComponent._openCourse(...)"
    // Back button inside lesson manager
    document.getElementById('btn-back-to-courses')?.addEventListener('click', () => {
      TutorComponent._openCourseId = null;
      TutorComponent._activeTab = 'courses';
      const cu = window.db.getCurrentUser();
      const assignedCourses = window.db.getTutorAssignedCourses(cu.username);
      document.getElementById('tutor-main-content').innerHTML =
        TutorComponent._renderCourses(assignedCourses);

      document.querySelectorAll('.tutor-nav-item').forEach(i => i.classList.remove('active'));
      document.querySelector('[data-tutor-tab="courses"]')?.classList.add('active');
      TutorComponent._bindCourseCards();
    });
  },

  _bindLessonManagerEvents: function (courseId) {
    // Back button
    TutorComponent._bindCourseCards();

    // Show add-lesson form toggle
    document.querySelectorAll('.btn-show-add-form').forEach(btn => {
      btn.addEventListener('click', () => {
        const formId = btn.getAttribute('data-form-id');
        const wrap = document.getElementById(formId);
        wrap.classList.toggle('open');
      });
    });

    // Cancel add lesson form
    document.querySelectorAll('.btn-cancel-add-form').forEach(btn => {
      btn.addEventListener('click', () => {
        const formId = btn.getAttribute('data-form-id');
        document.getElementById(formId)?.classList.remove('open');
      });
    });

    // Submit add lesson
    document.querySelectorAll('.form-add-lesson').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const cId = form.getAttribute('data-course-id');
        const modIdx = parseInt(form.getAttribute('data-mod-idx'));
        const title = form.querySelector('.l-title').value.trim();
        const duration = form.querySelector('.l-duration').value.trim() || '10:00';
        const url = form.querySelector('.l-url').value.trim();
        const desc = form.querySelector('.l-desc').value.trim();
        const cu = window.db.getCurrentUser();

        const res = window.db.addLessonToCourseModule(cId, modIdx, title, duration, url, desc, cu.username);
        if (res.success) {
          window.app.showToast('Lesson added successfully! ✅', 'success');
          const assignedCourses = window.db.getTutorAssignedCourses(cu.username);
          const course = assignedCourses.find(c => c.id === cId) || window.db.getCourseById(cId);
          document.getElementById('tutor-main-content').innerHTML =
            TutorComponent._renderLessonManager(course, cu);
          TutorComponent._bindLessonManagerEvents(cId);
        } else {
          window.app.showToast(res.error || 'Failed to add lesson.', 'danger');
        }
      });
    });

    // Delete lesson
    document.querySelectorAll('.btn-del-lesson').forEach(btn => {
      btn.addEventListener('click', () => {
        const cId = btn.getAttribute('data-course-id');
        const lesId = btn.getAttribute('data-lesson-id');
        if (!confirm('Delete this lesson? This cannot be undone.')) return;
        const res = window.db.deleteLessonFromCourseModule(cId, lesId);
        if (res.success) {
          window.app.showToast('Lesson deleted.', 'success');
          const cu = window.db.getCurrentUser();
          const assignedCourses = window.db.getTutorAssignedCourses(cu.username);
          const course = assignedCourses.find(c => c.id === cId) || window.db.getCourseById(cId);
          document.getElementById('tutor-main-content').innerHTML =
            TutorComponent._renderLessonManager(course, cu);
          TutorComponent._bindLessonManagerEvents(cId);
        } else {
          window.app.showToast(res.error || 'Failed to delete.', 'danger');
        }
      });
    });
  },

  _bindUploadForm: function () {
    const courseSelect = document.getElementById('upload-course');
    const moduleSelect = document.getElementById('upload-module');

    courseSelect?.addEventListener('change', () => {
      const cId = courseSelect.value;
      moduleSelect.innerHTML = '<option value="">-- Choose a Module --</option>';
      if (cId) {
        const course = window.db.getCourseById(cId);
        (course?.modules || []).forEach((mod, i) => {
          const opt = document.createElement('option');
          opt.value = i;
          opt.textContent = mod.title;
          moduleSelect.appendChild(opt);
        });
      }
    });

    document.getElementById('form-quick-upload')?.addEventListener('submit', e => {
      e.preventDefault();
      const cId = document.getElementById('upload-course').value;
      const modIdx = parseInt(document.getElementById('upload-module').value);
      const title = document.getElementById('upload-title').value.trim();
      const duration = document.getElementById('upload-duration').value.trim() || '10:00';
      const url = document.getElementById('upload-url').value.trim();
      const desc = document.getElementById('upload-desc').value.trim();
      const cu = window.db.getCurrentUser();

      if (!cId || isNaN(modIdx)) {
        window.app.showToast('Please select a course and module.', 'danger');
        return;
      }

      const res = window.db.addLessonToCourseModule(cId, modIdx, title, duration, url, desc, cu.username);
      if (res.success) {
        window.app.showToast('Lesson uploaded successfully! 🎉', 'success');
        e.target.reset();
        moduleSelect.innerHTML = '<option value="">-- Choose a Module --</option>';
      } else {
        window.app.showToast(res.error || 'Upload failed.', 'danger');
      }
    });
  }
};
window.TutorComponent = TutorComponent;
