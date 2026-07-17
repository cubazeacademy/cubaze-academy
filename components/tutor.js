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
      

      <div class="dashboard-layout container">
        <!-- SIDEBAR -->
        <aside class="dashboard-sidebar">
          <div class="sidebar-profile">
            <div class="sidebar-avatar" style="${cu.profilePhoto ? `background-image:url(${cu.profilePhoto});` : ''}">${cu.profilePhoto ? '' : cu.name.charAt(0).toUpperCase()}</div>
            <div class="sidebar-name">${cu.name}</div>
            <div class="sidebar-role">Content Instructor</div>
          </div>

          <div class="sidebar-nav">
            <div class="admin-nav-section-title">Main</div>
            ${[
        ['dashboard', 'fa-gauge-simple-high', 'Dashboard'],
        ['courses', 'fa-book-open', 'My Assigned Courses'],
        ['batches', 'fa-cubes', 'My Batches'],
        ['common_meeting', 'fa-calendar-days', 'Common Meeting'],
        ['lessons', 'fa-list-check', 'Lesson Manager'],
        ['liveclasses', 'fa-video', 'Live Classes'],
        ['upload', 'fa-cloud-arrow-up', 'Upload Content'],
      ].map(([tab, icon, label]) =>
        `<div class="sidebar-nav-item ${TutorComponent._activeTab === tab ? 'active' : ''}" data-tutor-tab="${tab}">
                <span style="display:flex; align-items:center; gap:10px;"><i class="fa-solid ${icon}" style="width:20px; text-align:center;"></i>${label}</span>
              </div>`
      ).join('')}
          </div>

          <div class="sidebar-nav">
            <div class="admin-nav-section-title">Account</div>
            ${[
        ['messages', 'fa-comments', 'Student Messages'],
        ['notifications', 'fa-bell', 'Notifications'],
        ['profile', 'fa-circle-user', 'Profile'],
        ['settings', 'fa-gear', 'Settings'],
      ].map(([tab, icon, label]) =>
        `<div class="sidebar-nav-item ${TutorComponent._activeTab === tab ? 'active' : ''}" data-tutor-tab="${tab}">
                <span style="display:flex; align-items:center; gap:10px;"><i class="fa-solid ${icon}" style="width:20px; text-align:center;"></i>${label}</span>
                ${tab === 'messages' ? `<span class="support-badge" id="tutor-unread-badge" style="display:none;"></span>` : ''}
              </div>`
      ).join('')}
          </div>

          <div class="sidebar-nav" style="border-top:1px solid var(--border-color); padding: 16px;">
            <a href="#/" class="btn btn-primary btn-sm btn-block">
              <i class="fa-solid fa-globe"></i> View Website
            </a>
            <button onclick="window.db.logoutUser(); window.location.hash='/';" class="btn btn-sm btn-block" style="margin-top:8px;">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>Logout
            </button>
          </div>
        </aside>

        <!-- MAIN CONTENT -->
        <main class="dashboard-content" id="tutor-main-content">
          ${TutorComponent._renderTab(TutorComponent._activeTab, cu, assignedCourses)}
        </main>
      </div>
    `;
  },

  _renderTab: function (tab, cu, assignedCourses) {
    switch (tab) {
      case 'dashboard': return TutorComponent._renderDashboard(cu, assignedCourses);
      case 'courses': return TutorComponent._renderCourses(assignedCourses);
      case 'batches': return TutorComponent._renderBatches(cu);
      case 'common_meeting': return TutorComponent._renderCommonMeetings(cu);
      case 'lessons':
        if (TutorComponent._openCourseId) {
          const c = assignedCourses.find(x => x.id === TutorComponent._openCourseId)
            || window.db.getCourseById(TutorComponent._openCourseId);
          return TutorComponent._renderLessonManager(c, cu);
        }
        return TutorComponent._renderCourses(assignedCourses);
      case 'liveclasses': return TutorComponent._renderLiveClasses(assignedCourses, cu);
      case 'upload': return TutorComponent._renderUpload(assignedCourses, cu);
      case 'messages': return `<div id="tutor-messages-loading"><div class="spinner"></div></div>`;
      case 'notifications': return TutorComponent._renderNotifications();
      case 'profile': return TutorComponent._renderProfile(cu);
      case 'settings': return TutorComponent._renderSettings(cu);
      default: return TutorComponent._renderDashboard(cu, assignedCourses);
    }
  },

  // =====================================================
  // DASHBOARD OVERVIEW
  // =====================================================
  _renderDashboard: function (cu, assignedCourses) {
    const totalLessons = assignedCourses.reduce((s, c) =>
      s + (c.modules || []).reduce((ms, m) => ms + (m.lessons || []).length, 0), 0);

    return `
      <div class="dashboard-overview-container">
        <div class="dashboard-main-col">
          <div class="dashboard-welcome">
            <h1>Welcome back, ${cu.name.split(' ')[0]}! 👋</h1>
            <p>Here's a summary of your assigned courses and lesson activity.</p>
          </div>

          <!-- Stats -->
          <div class="dashboard-widgets">
            <div class="widget-card">
              <div class="widget-icon blue"><i class="fa-solid fa-book-open"></i></div>
              <div>
                <div class="widget-number">${assignedCourses.length}</div>
                <div class="widget-label">Assigned Courses</div>
              </div>
            </div>
            <div class="widget-card">
              <div class="widget-icon green"><i class="fa-solid fa-circle-play"></i></div>
              <div>
                <div class="widget-number">${totalLessons}</div>
                <div class="widget-label">Total Lessons</div>
              </div>
            </div>
            <div class="widget-card">
              <div class="widget-icon gold"><i class="fa-solid fa-users"></i></div>
              <div>
                <div class="widget-number">${assignedCourses.reduce((s, c) => s + (c.studentsCount || 0), 0).toLocaleString('en-IN')}</div>
                <div class="widget-label">Total Students</div>
              </div>
            </div>
            <div class="widget-card">
              <div class="widget-icon purple"><i class="fa-solid fa-star"></i></div>
              <div>
                <div class="widget-number">${assignedCourses.length > 0 ? (assignedCourses.reduce((s, c) => s + c.rating, 0) / assignedCourses.length).toFixed(1) : '—'}</div>
                <div class="widget-label">Avg. Rating</div>
              </div>
            </div>
          </div>

          <!-- Next Common Meeting Widget -->
          ${(() => {
        const nextMeeting = window.db.getCommonMeetingsForUser(cu.username)
          .filter(m => m.status === 'Live Now' || m.status === 'Upcoming')
          .sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`))[0];

        if (nextMeeting) {
          const isLive = nextMeeting.status === 'Live Now';

          setTimeout(() => {
            TutorComponent._startCommonMeetingTimers();
          }, 100);

          return `
                <div class="glass-panel" style="padding:20px; border:1px solid ${isLive ? '#10B981' : 'var(--border-color)'}; background:${isLive ? 'var(--bg-secondary)' : 'var(--bg-card)'}; border-radius:var(--radius-xl); text-align:left; position:relative; overflow:hidden; margin-bottom:28px;">
                  ${isLive ? `<span style="position:absolute; right:16px; top:16px; background:#ef4444; color:#fff; font-size:0.7rem; font-weight:800; padding:4px 10px; border-radius:20px; text-transform:uppercase; animation: pulse 1.5s infinite;"><i class="fa-solid fa-signal" style="margin-right:4px;"></i> LIVE NOW</span>` : ''}
                  <div style="font-size:0.75rem; font-weight:700; color:${isLive ? '#10B981' : 'var(--brand-blue)'}; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">Next Common Meeting</div>
                  <h3 style="margin:0 0 6px 0; font-size:1.15rem; font-weight:800; color:var(--text-primary);">${nextMeeting.title}</h3>
                  <p style="font-size:0.83rem; color:var(--text-secondary); margin:0 0 16px 0; line-height:1.4;">${nextMeeting.description || 'Academy-wide session.'}</p>
                  
                  <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; border-top:1px solid var(--border-color); padding-top:12px; margin-top:12px;">
                    <div style="font-size:0.8rem; color:var(--text-secondary); display:flex; gap:16px;">
                      <span><i class="fa-regular fa-calendar" style="margin-right:4px;"></i> ${nextMeeting.date}</span>
                      <span><i class="fa-regular fa-clock" style="margin-right:4px;"></i> ${nextMeeting.startTime} - ${nextMeeting.endTime}</span>
                      <span><i class="fa-regular fa-user" style="margin-right:4px;"></i> Host: ${nextMeeting.hostName}</span>
                    </div>
                    
                    ${isLive
              ? `<a href="${nextMeeting.meetLink}" target="_blank" class="btn btn-success btn-sm" style="margin:0; background:#10B981; border-color:#10B981; color:#fff; font-weight:700;"><i class="fa-solid fa-video"></i> Join Meeting</a>`
              : `<div class="cm-countdown-box" data-date="${nextMeeting.date}T${nextMeeting.startTime}" style="font-size:0.85rem; font-weight:700; color:var(--brand-blue);"><i class="fa-solid fa-hourglass-start" style="margin-right:4px;"></i>Starts in: <span class="cm-timer">Calculating...</span></div>`
            }
                  </div>
                </div>
              `;
        }
        return '';
      })()}

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
        : `<div style="display:flex;flex-direction:column;gap:16px;">
                ${assignedCourses.slice(0, 3).map(c => TutorComponent._courseMiniCard(c)).join('')}
              </div>`
      }
        </div>
        ${window.DashboardRightPanel ? window.DashboardRightPanel.render(cu) : ''}
      </div>
    `;
  },

  // =====================================================
  // MY ASSIGNED COURSES
  // =====================================================
  _renderCourses: function (assignedCourses) {
    return `
      <div class="dashboard-welcome">
        <h1>My Assigned Courses</h1>
        <p>These are the courses assigned to you by your Admin. Click a course to manage its lesson content.</p>
      </div>

      ${assignedCourses.length === 0
        ? `<div style="background:#FFFFFF;border-radius:18px;padding:72px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.04);">
            <div style="font-size:4rem;margin-bottom:16px;">📭</div>
            <h2 style="margin-bottom:10px;color:#0F172A;">No Courses Assigned</h2>
            <p style="color:#64748B;max-width:380px;margin:0 auto;line-height:1.6;font-size:0.88rem;">Your Admin hasn't assigned any courses to you yet. Once assigned, they'll appear here and you can start uploading lesson content.</p>
          </div>`
        : `<div style="display:flex;flex-direction:column;gap:16px;">
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
      <div class="enrolled-course-card" onclick="TutorComponent._openCourse('${c.id}')" style="cursor:pointer;">
        <div class="enrolled-course-thumb"><img src="${c.image}" alt="${c.title}"></div>
        <div class="enrolled-course-body">
          <div class="enrolled-course-title">${c.title}</div>
          <div class="enrolled-course-meta">
            ${totalLessons} Lessons · ${modules} Modules · ${(c.studentsCount || 0).toLocaleString('en-IN')} Students · ★ ${c.rating}
          </div>
          <div class="enrolled-course-actions" style="margin-top:12px;">
            <button class="btn btn-primary btn-sm">
              <i class="fa-solid fa-pen-to-square"></i> Manage Lessons
            </button>
          </div>
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
              ${les.description ? `<span style="color:#94A3B8;">• ${les.description.slice(0, 40)}${les.description.length > 40 ? '...' : ''}</span>` : ''}
            </div>
          </div>
          <div class="lesson-item-actions">
            <button class="lesson-action-btn edit-btn btn-edit-lesson" data-course-id="${course.id}" data-mod-idx="${modIdx}" data-lesson-id="${les.id}" title="Edit Lesson" style="margin-right:4px;">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="lesson-action-btn danger btn-del-lesson" data-course-id="${course.id}" data-lesson-id="${les.id}" title="Delete Lesson">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      `).join('');

      const formId = `add-form-${modIdx}`;
      return `
        <div class="lesson-module-card">
          <div class="lesson-module-header" style="display:flex; justify-content:space-between; align-items:center;">
            <div class="lesson-module-name"><i class="fa-solid fa-layer-group" style="color:#6366F1;margin-right:8px;"></i>${mod.title}</div>
            <div style="display:flex; gap:8px; align-items:center;">
              <button class="btn btn-outline-white btn-sm" style="padding: 6px 10px; border-radius: 6px; font-size: 0.8rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-secondary); cursor: pointer;" onclick="TutorComponent._showEditModuleModal('${course.id}',${modIdx})" title="Edit Module Title"><i class="fa-solid fa-pen"></i></button>
              <button class="btn btn-danger btn-sm" style="padding: 6px 10px; border-radius: 6px; font-size: 0.8rem; border: 1px solid rgba(239, 68, 68, 0.2); background: var(--danger-bg); color: var(--danger); cursor: pointer;" onclick="TutorComponent._deleteModule('${course.id}',${modIdx})" title="Delete Module"><i class="fa-solid fa-trash-can"></i></button>
              <span class="lesson-count-badge">${(mod.lessons || []).length} lessons</span>
            </div>
          </div>
          ${lessonsHtml || `<div style="padding:16px 22px;color:var(--text-muted);font-size:0.83rem;font-style:italic;">No lessons in this module yet. Add one below.</div>`}

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
                  <input type="text" class="l-title" required placeholder="e.g. Introduction to Blender Interface" style="border:1px solid var(--border-color); background:var(--bg-secondary); color:var(--text-primary); border-radius:8px; padding:10px 14px; width:100%; box-sizing:border-box;">
                </div>
                <div>
                  <label>Duration (MM:SS)</label>
                  <input type="text" class="l-duration" placeholder="e.g. 12:45" style="border:1px solid var(--border-color); background:var(--bg-secondary); color:var(--text-primary); border-radius:8px; padding:10px 14px; width:100%; box-sizing:border-box;">
                </div>
              </div>
              <div style="margin-bottom:14px;">
                <label>YouTube Video URL *</label>
                <input type="url" class="l-url" required placeholder="https://www.youtube.com/watch?v=..." style="border:1px solid var(--border-color); background:var(--bg-secondary); color:var(--text-primary); border-radius:8px; padding:10px 14px; width:100%; box-sizing:border-box;">
              </div>
              <div style="margin-bottom:16px;">
                <label>Lesson Description (optional)</label>
                <textarea class="l-desc" rows="2" placeholder="Brief description of what this lesson covers..." style="border:1px solid var(--border-color); background:var(--bg-secondary); color:var(--text-primary); border-radius:8px; padding:10px 14px; width:100%; box-sizing:border-box; resize:vertical;"></textarea>
              </div>
              <div style="display:flex;gap:10px;">
                <button type="submit" style="padding:10px 20px;background:linear-gradient(135deg,#3D46D8,#6366F1);color:#fff;border:none;border-radius:10px;font-size:0.85rem;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:8px;font-family:inherit;">
                  <i class="fa-solid fa-plus"></i> Add Lesson
                </button>
                <button type="button" class="btn-cancel-add-form" data-form-id="${formId}" style="padding:10px 20px;background:var(--bg-primary);color:var(--text-secondary);border:1px solid var(--border-color);border-radius:10px;font-size:0.85rem;font-weight:600;cursor:pointer;font-family:inherit;">
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
        <button class="lesson-back-btn" id="btn-back-to-courses" style="cursor:pointer;">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <div class="lesson-manager-course-info">
          <div class="lesson-manager-title">Lesson Manager</div>
          <div class="lesson-manager-subtitle"><i class="fa-solid fa-book-open" style="color:var(--brand-blue);margin-right:4px;"></i>${course.title}</div>
        </div>
        <a href="#/course/${course.id}" target="_blank" style="display:flex;align-items:center;gap:8px;padding:9px 16px;background:var(--bg-secondary);border:1.5px solid var(--border-color);border-radius:10px;color:var(--text-primary);text-decoration:none;font-size:0.83rem;font-weight:600;">
          <i class="fa-solid fa-eye"></i> Preview
        </a>
      </div>

      <!-- Read-only course info -->
      <div class="course-readonly-banner" style="border: 1px solid var(--border-color); background: var(--bg-card); box-shadow: var(--shadow-sm); border-radius: var(--radius-lg);">
        <div class="banner-field">
          <div class="banner-field-label">Course Name <span class="readonly-lock" style="color:var(--text-muted);"><i class="fa-solid fa-lock"></i> Admin Only</span></div>
          <div class="banner-field-value" style="color:var(--text-primary);">${course.title}</div>
        </div>
        <div class="banner-field">
          <div class="banner-field-label">Price <span class="readonly-lock" style="color:var(--text-muted);"><i class="fa-solid fa-lock"></i> Admin Only</span></div>
          <div class="banner-field-value" style="color:var(--text-primary);">₹${course.price.toLocaleString('en-IN')}</div>
        </div>
        <div class="banner-field">
          <div class="banner-field-label">Level <span class="readonly-lock" style="color:var(--text-muted);"><i class="fa-solid fa-lock"></i> Admin Only</span></div>
          <div class="banner-field-value" style="color:var(--text-primary);">${course.level || '—'}</div>
        </div>
        <div class="banner-field">
          <div class="banner-field-label">Students <span class="readonly-lock" style="color:var(--text-muted);"><i class="fa-solid fa-lock"></i> Admin Only</span></div>
          <div class="banner-field-value" style="color:var(--text-primary);">${(course.studentsCount || 0).toLocaleString('en-IN')}</div>
        </div>
        <div class="banner-field">
          <div class="banner-field-label">Rating <span class="readonly-lock" style="color:var(--text-muted);"><i class="fa-solid fa-lock"></i> Admin Only</span></div>
          <div class="banner-field-value" style="color:var(--text-primary);">★ ${course.rating}</div>
        </div>
      </div>

      <!-- Add Module Section -->
      <div style="background: var(--bg-card); border-radius: 12px; margin-bottom: 24px; padding: 16px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
        <div style="display:flex; gap:12px; align-items:center;">
          <input id="tutor-new-mod-title" class="form-control" placeholder="New Module Title..." style="flex:1; border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 14px; background: var(--bg-secondary); color: var(--text-primary);">
          <button class="btn btn-primary btn-sm" style="padding: 10px 20px; font-weight: 600; border-radius: 8px; cursor: pointer;" onclick="TutorComponent._addModule('${course.id}')"><i class="fa-solid fa-plus" style="margin-right:6px;"></i> Add Module</button>
        </div>
      </div>

      <!-- Modules -->
      ${modulesHtml || `<div style="background:var(--bg-card);border-radius:16px;padding:48px;text-align:center;border:1px solid var(--border-color);">
        <p style="color:var(--text-muted);">This course has no modules yet. Add one above.</p>
      </div>`}
    `;
  },

  // =====================================================
  // UPLOAD CONTENT
  // =====================================================
  _renderUpload: function (assignedCourses, cu) {
    return `
      <div class="dashboard-welcome">
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
  // ============================================================
  // STUDENT-TUTOR MESSAGING (TUTOR VIEW)
  // ============================================================
  updateTutorBadge: async function () {
    try {
      const convs = await window.db.getTutorConversations();
      const unreadCount = convs.filter(c => c.unread_by_tutor).length;
      const el = document.getElementById('tutor-unread-badge');
      if (el) {
        if (unreadCount > 0) {
          el.textContent = unreadCount;
          el.style.display = 'inline-block';
        } else {
          el.style.display = 'none';
        }
      }
    } catch (err) {
      console.error("Error updating tutor chat badge:", err);
    }
  },

  _loadAndRenderMessages: async function () {
    const main = document.getElementById('tutor-main-content');
    if (!main) return;

    TutorComponent._initRealtime();

    main.innerHTML = `<div style="text-align:center;padding:48px;"><div class="spinner"></div><p style="margin-top:12px;color:var(--text-muted);">Loading student messages...</p></div>`;

    try {
      const convs = await window.db.getTutorConversations();
      const cu = window.db.getCurrentUser();
      const assignedCourses = window.db.getTutorAssignedCourses(cu.username);

      main.innerHTML = await TutorComponent._renderMessagesView(convs, assignedCourses);
      TutorComponent._bindMessagesEvents(convs, assignedCourses);
      TutorComponent.updateTutorBadge();
    } catch (err) {
      main.innerHTML = `<div class="alert alert-danger">Error: ${err.message}</div>`;
    }
  },

  _initRealtime: function () {
    if (TutorComponent._realtimeChannel) return;
    TutorComponent._realtimeChannel = window.db.subscribeToTutorRealtime((e) => {
      if (TutorComponent._activeTab === 'messages') {
        if (e.type === 'message' && e.payload.new) {
          const cu = window.db.getCurrentUser();
          if (e.payload.new.sender !== cu.username) {
            if (TutorComponent._activeConvId === e.payload.new.conversation_id) {
              TutorComponent._refreshChatMessagesOnly(TutorComponent._activeConvId);
              window.db.markTutorMessagesAsSeen(TutorComponent._activeConvId, 'tutor');
            } else {
              window.app.showToast(`New student message from @${e.payload.new.sender}!`, 'info');
              TutorComponent._loadAndRenderMessages();
            }
          }
        } else if (e.type === 'conversation') {
          TutorComponent._loadAndRenderMessages();
        }
      } else {
        TutorComponent.updateTutorBadge();
      }
    });
  },

  _renderMessagesView: async function (convs, assignedCourses) {
    const total = convs.length;
    const unread = convs.filter(c => c.unread_by_tutor).length;
    const active = convs.filter(c => c.status === 'Open').length;
    const resolved = convs.filter(c => c.status === 'Resolved').length;

    const search = TutorComponent._convSearch || '';
    const courseIdFilter = TutorComponent._convCourseFilter || 'all';

    let filtered = convs;
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(c => c.student_username.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q));
    }
    if (courseIdFilter !== 'all') {
      filtered = filtered.filter(c => c.course_id === courseIdFilter);
    }

    let activeChatHtml = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; min-height:400px; color:var(--text-muted); text-align:center; padding:32px;">
        <i class="fa-solid fa-comments" style="font-size:3.5rem; margin-bottom:16px; opacity:0.3; color:var(--brand-blue);"></i>
        <h3 style="margin:0 0 8px 0; font-weight:700;">No Conversation Selected</h3>
        <p style="margin:0; font-size:0.84rem; max-width:280px;">Select a student conversation from the sidebar list to view the message thread and reply.</p>
      </div>
    `;

    if (TutorComponent._activeConvId) {
      activeChatHtml = await TutorComponent._renderActiveChatPane(TutorComponent._activeConvId);
    }

    return `
      <div class="dashboard-welcome">
        <h1>Student Messages</h1>
        <p>Reply to student queries and review doubt requests.</p>
      </div>

      <div class="support-widgets-grid" style="margin-bottom:24px;">
        <div class="widget-card"><div class="widget-icon blue"><i class="fa-solid fa-comments"></i></div><div class="widget-number">${total}</div><div class="widget-label">Total Chats</div></div>
        <div class="widget-card"><div class="widget-icon red"><i class="fa-solid fa-envelope-open"></i></div><div class="widget-number">${unread}</div><div class="widget-label">Unread Messages</div></div>
        <div class="widget-card"><div class="widget-icon gold"><i class="fa-solid fa-hourglass-half"></i></div><div class="widget-number">${active}</div><div class="widget-label">Active Chats</div></div>
        <div class="widget-card"><div class="widget-icon green"><i class="fa-solid fa-circle-check"></i></div><div class="widget-number">${resolved}</div><div class="widget-label">Resolved Chats</div></div>
      </div>

      <div class="tutor-chat-layout">
        <div class="tutor-chat-sidebar">
          <div class="tutor-chat-sidebar-header">
            <div class="search-input-wrapper" style="width:100%; box-sizing:border-box;">
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
              <input id="tutor-conv-search" placeholder="Search students..." value="${search}">
            </div>
            <select id="tutor-conv-course-filter" style="width:100%; height:38px; padding:0 8px; border:1px solid var(--border-color); border-radius:var(--radius-md); background:var(--bg-primary); color:var(--text-primary); cursor:pointer;">
              <option value="all" ${courseIdFilter === 'all' ? 'selected' : ''}>All Assigned Courses</option>
              ${assignedCourses.map(c => `<option value="${c.id}" ${courseIdFilter === c.id ? 'selected' : ''}>${c.title}</option>`).join('')}
            </select>
          </div>
          <div class="tutor-chat-list">
            ${filtered.length === 0 ? `
              <div style="text-align:center; padding:32px; color:var(--text-muted); font-size:0.8rem; font-style:italic;">No messages found.</div>
            ` : filtered.map(c => {
      const activeClass = TutorComponent._activeConvId === c.id ? 'active' : '';
      const course = assignedCourses.find(x => x.id === c.course_id);
      const courseTitle = course ? course.title : 'General Course';
      const lastActive = DashboardComponent._getRelativeTime(c.last_reply_at);

      return `
                <div class="tutor-chat-list-item ${activeClass}" data-conv-id="${c.id}">
                  <div class="tutor-chat-list-item-avatar" style="background:${window.getAvatarColor(c.student_username)};">
                    ${c.student_username.charAt(0).toUpperCase()}
                  </div>
                  <div class="tutor-chat-list-item-content">
                    <div class="tutor-chat-list-item-meta">
                      <span class="tutor-chat-list-item-name">@${c.student_username}</span>
                      <span class="tutor-chat-list-item-time">${lastActive}</span>
                    </div>
                    <div class="tutor-chat-list-item-msg" style="font-size:0.75rem; color:var(--text-muted); margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                      ${courseTitle}
                    </div>
                    <div class="tutor-chat-list-item-msg" style="font-weight:${c.unread_by_tutor ? '700' : '400'}; color:${c.unread_by_tutor ? 'var(--text-primary)' : 'var(--text-secondary)'};">
                      ${c.subject}
                    </div>
                    <div class="tutor-chat-list-item-badges">
                      <span class="support-cat-badge" style="font-size:0.62rem; padding:1px 6px;">${c.category}</span>
                      <div style="display:flex; align-items:center; gap:6px;">
                        <span class="status-badge ${c.status === 'Resolved' ? 'success' : 'danger'}" style="font-size:0.62rem; padding:1px 6px;">${c.status}</span>
                        ${c.unread_by_tutor ? `<span class="tutor-chat-list-item-badge">1</span>` : ''}
                      </div>
                    </div>
                  </div>
                </div>
              `;
    }).join('')}
          </div>
        </div>

        <div class="glass-panel" style="padding:0; overflow:hidden; display:flex; flex-direction:column; height:100%;">
          ${activeChatHtml}
        </div>
      </div>
    `;
  },

  _renderActiveChatPane: async function (convId) {
    const convs = await window.db.getTutorConversations();
    const conv = convs.find(c => c.id === convId);
    if (!conv) return `<div class="alert alert-danger">Conversation not found.</div>`;

    const messages = await window.db.getTutorMessages(convId);
    const cu = window.db.getCurrentUser();

    return `
      <div class="support-chat-header">
        <div style="display:flex; align-items:center; gap:10px; flex:1; min-width:0;">
          <div class="support-chat-header-avatar" style="background:${window.getAvatarColor(conv.student_username)};">
            ${conv.student_username ? conv.student_username.charAt(0).toUpperCase() : 'S'}
          </div>
          <div class="support-chat-header-info">
            <div class="support-chat-title">@${conv.student_username}</div>
            <div class="support-chat-subtitle">
              ${conv.subject} · <span style="font-weight:700;">${conv.status}</span>
            </div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:12px; flex-shrink:0;">
          <button class="${conv.status === 'Resolved' ? 'btn-reopen-pill' : 'btn-resolve-pill'}" id="btn-tutor-toggle-resolve">
            <i class="fa-solid ${conv.status === 'Resolved' ? 'fa-envelope-open' : 'fa-circle-check'}"></i>
            <span>${conv.status === 'Resolved' ? 'Reopen' : 'Resolve'}</span>
          </button>
          <div class="support-chat-header-actions">
            <button title="Search"><i class="fa-solid fa-magnifying-glass"></i></button>
            <button title="More"><i class="fa-solid fa-ellipsis-vertical"></i></button>
          </div>
        </div>
      </div>

      <div class="support-chat-messages" id="tutor-chat-thread">
        <div class="support-chat-date-label">Today</div>
        <div class="support-chat-encrypt-notice">
          <i class="fa-solid fa-lock" style="margin-right:6px; font-size:0.75rem;"></i>
          Messages and calls are secured with end-to-end encryption. Your student will respond shortly.
        </div>
        ${messages.map(m => {
          const isOwn = m.sender === cu.username;
          const isStudent = m.sender === conv.student_username;
          const dateStr = new Date(m.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

          let attachmentHtml = '';
          if (m.file_url) {
            const isImg = /\.(jpg|jpeg|png|webp|gif)$/i.test(m.file_name || '');
            if (isImg) {
              attachmentHtml = `<img src="${m.file_url}" alt="Attachment preview" class="support-chat-img-preview" onclick="window.open('${m.file_url}', '_blank')">`;
            } else {
              attachmentHtml = `
                    <a href="${m.file_url}" target="_blank" class="support-chat-attachment-card">
                      <div class="support-chat-attachment-icon"><i class="fa-solid fa-file-arrow-down"></i></div>
                      <div class="support-chat-attachment-info">
                        <span class="support-chat-attachment-name">${m.file_name || 'Attached File'}</span>
                        <span class="support-chat-attachment-size">Download Attachment</span>
                      </div>
                    </a>
                  `;
            }
          }

          let linkHtml = '';
          if (m.external_link) {
            linkHtml = `
                  <a href="${m.external_link}" target="_blank" class="support-chat-external-link">
                    <i class="fa-solid fa-cloud"></i>
                    <span>Shared File Link</span>
                    <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.65rem; margin-left:4px;"></i>
                  </a>
                `;
          }

          let alignClass = 'admin-align';
          if (m.is_internal) {
            alignClass = 'internal-note-align';
          } else if (isStudent) {
            alignClass = 'admin-align';
          } else {
            alignClass = 'student-align';
          }

          return `
                <div class="support-msg-wrapper ${alignClass}">
                  <div class="support-msg-bubble">
                    <div style="font-weight:600; font-size:0.75rem; opacity:0.8; margin-bottom:4px; color:${m.is_internal ? '#92400e' : isStudent ? '#0B5A43' : '#3b82f6'};">
                      ${m.is_internal ? '<i class="fa-solid fa-lock"></i> Internal Tutor Note' : isStudent ? `@${conv.student_username} (Student)` : 'You (Tutor)'}
                    </div>
                    <div style="font-size:0.86rem; white-space:pre-wrap;">${m.message}</div>
                    ${attachmentHtml}
                    ${linkHtml}
                  </div>
                  <div class="support-msg-meta">
                    <span>${dateStr}</span>
                    ${(!m.is_internal && !isStudent) ? `<i class="fa-solid ${m.seen ? 'fa-check-double seen' : 'fa-check unseen'} support-msg-seen-icon"></i>` : ''}
                  </div>
                </div>
              `;
        }).join('')}
      </div>

      <div class="support-chat-input-wrapper">
        <div class="support-chat-attachments-row">
          <div class="support-chat-attach-btn" title="Attach file">
            <i class="fa-solid fa-paperclip"></i>
            <input type="file" id="tutor-msg-upload-file">
          </div>
          <div id="tutor-msg-file-selected-chip" style="display:none;"></div>

          <div class="support-link-input-wrapper">
            <i class="fa-solid fa-link"></i>
            <input type="url" id="tutor-msg-external-link" placeholder="Cloud Storage File Link">
          </div>

          <label class="admin-note-switch">
            <input type="checkbox" id="tutor-msg-is-internal">
            <span>Internal Note</span>
          </label>
        </div>

        <div class="support-chat-input-row">
          <button class="support-chat-emoji-btn" id="btn-tutor-pane-emoji" title="Emoji">😊</button>
          <textarea class="support-chat-input-textarea" id="tutor-msg-message-text" placeholder="Type reply or internal note..." rows="1"></textarea>
          <button class="btn btn-primary" id="btn-tutor-send-reply"><i class="fa-solid fa-paper-plane" style="font-size:1rem;"></i></button>
        </div>
      </div>
    `;
  },

  _refreshChatMessagesOnly: async function (convId) {
    const thread = document.getElementById('tutor-chat-thread');
    if (!thread) return;

    try {
      const messages = await window.db.getTutorMessages(convId);
      const convs = await window.db.getTutorConversations();
      const conv = convs.find(c => c.id === convId);
      if (!conv) return;

      const cu = window.db.getCurrentUser();

      thread.innerHTML = `
        <div class="support-chat-date-label">Today</div>
        <div class="support-chat-encrypt-notice">
          <i class="fa-solid fa-lock" style="margin-right:6px; font-size:0.75rem;"></i>
          Messages and calls are secured with end-to-end encryption. Your student will respond shortly.
        </div>
      ` + messages.map(m => {
        const isOwn = m.sender === cu.username;
        const isStudent = m.sender === conv.student_username;
        const dateStr = new Date(m.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

        let attachmentHtml = '';
        if (m.file_url) {
          const isImg = /\.(jpg|jpeg|png|webp|gif)$/i.test(m.file_name || '');
          if (isImg) {
            attachmentHtml = `<img src="${m.file_url}" alt="Attachment preview" class="support-chat-img-preview" onclick="window.open('${m.file_url}', '_blank')">`;
          } else {
            attachmentHtml = `
              <a href="${m.file_url}" target="_blank" class="support-chat-attachment-card">
                <div class="support-chat-attachment-icon"><i class="fa-solid fa-file-arrow-down"></i></div>
                <div class="support-chat-attachment-info">
                  <span class="support-chat-attachment-name">${m.file_name || 'Attached File'}</span>
                  <span class="support-chat-attachment-size">Download Attachment</span>
                </div>
              </a>
            `;
          }
        }

        let linkHtml = '';
        if (m.external_link) {
          linkHtml = `
            <a href="${m.external_link}" target="_blank" class="support-chat-external-link">
              <i class="fa-solid fa-cloud"></i>
              <span>Shared File Link</span>
              <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.65rem; margin-left:4px;"></i>
            </a>
          `;
        }

        let alignClass = 'admin-align';
        if (m.is_internal) {
          alignClass = 'internal-note-align';
        } else if (isStudent) {
          alignClass = 'admin-align';
        } else {
          alignClass = 'student-align';
        }

        return `
          <div class="support-msg-wrapper ${alignClass}">
            <div class="support-msg-bubble">
              <div style="font-weight:600; font-size:0.75rem; opacity:0.8; margin-bottom:4px; color:${m.is_internal ? '#92400e' : isStudent ? '#0B5A43' : '#3b82f6'};">
                ${m.is_internal ? '<i class="fa-solid fa-lock"></i> Internal Tutor Note' : isStudent ? `@${conv.student_username} (Student)` : 'You (Tutor)'}
              </div>
              <div style="font-size:0.86rem; white-space:pre-wrap;">${m.message}</div>
              ${attachmentHtml}
              ${linkHtml}
            </div>
            <div class="support-msg-meta">
              <span>${dateStr}</span>
              ${(!m.is_internal && !isStudent) ? `<i class="fa-solid ${m.seen ? 'fa-check-double seen' : 'fa-check unseen'} support-msg-seen-icon"></i>` : ''}
            </div>
          </div>
        `;
      }).join('');

      thread.scrollTop = thread.scrollHeight;
    } catch (err) {
      console.error("Error refreshing tutor messages thread:", err);
    }
  },

  _bindMessagesEvents: function (convs, assignedCourses) {
    const searchInput = document.getElementById('tutor-conv-search');
    const courseSelect = document.getElementById('tutor-conv-course-filter');

    const handleFilterChange = () => {
      TutorComponent._convSearch = searchInput ? searchInput.value : '';
      TutorComponent._convCourseFilter = courseSelect ? courseSelect.value : 'all';
      TutorComponent._loadAndRenderMessages();
    };

    searchInput?.addEventListener('input', handleFilterChange);
    courseSelect?.addEventListener('change', handleFilterChange);

    document.querySelectorAll('.tutor-chat-list-item').forEach(item => {
      item.addEventListener('click', () => {
        TutorComponent._activeConvId = item.getAttribute('data-conv-id');
        TutorComponent._loadAndRenderMessages();
      });
    });

    if (TutorComponent._activeConvId) {
      const convId = TutorComponent._activeConvId;
      const conv = convs.find(c => c.id === convId);

      const thread = document.getElementById('tutor-chat-thread');
      if (thread) thread.scrollTop = thread.scrollHeight;

      document.getElementById('btn-tutor-toggle-resolve')?.addEventListener('click', async () => {
        const nextResolved = conv.status !== 'Resolved';
        const res = await window.db.markTutorConversationResolved(convId, nextResolved);
        if (res.success) {
          window.app.showToast(`Conversation marked as ${nextResolved ? 'Resolved' : 'Reopened'}`, 'success');
          TutorComponent._loadAndRenderMessages();
        } else {
          window.app.showToast(res.error || "Failed to update resolved status", "danger");
        }
      });

      let selectedReplyFile = null;
      const fileInput = document.getElementById('tutor-msg-upload-file');
      const chip = document.getElementById('tutor-msg-file-selected-chip');

      if (fileInput && chip) {
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            selectedReplyFile = file;
            chip.innerHTML = `
              <i class="fa-solid fa-file-lines"></i>
              <span>${file.name.substring(0, 15)}...</span>
              <i class="fa-solid fa-circle-xmark remove-file" style="margin-left:6px; cursor:pointer;" id="tutor-remove-reply-file"></i>
            `;
            chip.className = 'support-file-selected-chip';
            chip.style.display = 'flex';

            document.getElementById('tutor-remove-reply-file')?.addEventListener('click', () => {
              selectedReplyFile = null;
              fileInput.value = '';
              chip.style.display = 'none';
            });
          }
        });
      }

      const sendBtn = document.getElementById('btn-tutor-send-reply');
      const msgTextarea = document.getElementById('tutor-msg-message-text');
      const extLinkInput = document.getElementById('tutor-msg-external-link');
      const internalCheckbox = document.getElementById('tutor-msg-is-internal');

      const handleSend = async () => {
        const text = msgTextarea ? msgTextarea.value.trim() : '';
        const extLink = extLinkInput ? extLinkInput.value.trim() : '';
        const isInternal = internalCheckbox ? internalCheckbox.checked : false;

        if (!text && !selectedReplyFile && !extLink) return;

        if (sendBtn) {
          sendBtn.disabled = true;
          sendBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
        }

        try {
          let fileData = null;
          if (selectedReplyFile) {
            fileData = await window.db.uploadTutorAttachment(selectedReplyFile);
          }

          const res = await window.db.sendTutorMessage(convId, text, fileData, extLink, isInternal);
          if (res.success) {
            if (msgTextarea) msgTextarea.value = '';
            if (extLinkInput) extLinkInput.value = '';
            if (internalCheckbox) internalCheckbox.checked = false;
            selectedReplyFile = null;
            if (fileInput) fileInput.value = '';
            if (chip) chip.style.display = 'none';

            TutorComponent._loadAndRenderMessages();
          } else {
            window.app.showToast(res.error || "Failed to send message", "danger");
          }
        } catch (err) {
          window.app.showToast(err.message, "danger");
        } finally {
          if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i>`;
          }
        }
      };

      sendBtn?.addEventListener('click', handleSend);
      msgTextarea?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      });

      window.initEmojiPicker('btn-tutor-pane-emoji', 'tutor-msg-message-text');
    }
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
      <div class="dashboard-welcome">
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
      <div class="dashboard-welcome">
        <h1>My Profile</h1>
        <p>Manage your public tutor profile and bio.</p>
      </div>
      <div class="tutor-form-card">
        <div style="display:flex;align-items:center;gap:20px;padding-bottom:24px;margin-bottom:24px;border-bottom:1px solid #F1F5F9;">
          <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#3D46D8,#6366F1);display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:800;color:#fff;flex-shrink:0;background-size:cover;background-position:center;background-repeat:no-repeat;${cu.profilePhoto ? `background-image:url(${cu.profilePhoto});` : ''}">${cu.profilePhoto ? '' : cu.name.charAt(0)}</div>
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
          
          <div>
            <label style="font-size:0.75rem;font-weight:700;color:#374151;display:block;margin-bottom:6px;">WhatsApp Number (Optional)</label>
            <input type="text" value="${cu.whatsapp || ''}" id="prof-whatsapp" placeholder="e.g. +91 98765 43210" style="width:100%;padding:10px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:0.85rem;font-family:inherit;outline:none;box-sizing:border-box;">
          </div>
          <div>
            <label style="font-size:0.75rem;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Date of Birth (Optional)</label>
            <input type="date" value="${cu.dob || ''}" id="prof-dob" style="width:100%;padding:10px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:0.85rem;font-family:inherit;outline:none;box-sizing:border-box;color: #374151;">
          </div>
          
          <div>
            <label style="font-size:0.75rem;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Qualification (Optional)</label>
            <select id="prof-qualification" onchange="document.getElementById('prof-qualification-other-wrap').style.display = this.value === 'other' ? 'block' : 'none';" style="width:100%;padding:10px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:0.85rem;font-family:inherit;outline:none;box-sizing:border-box;background:#fff;color:#374151;">
              <option value="">Select Qualification</option>
              <option value="sslc" ${cu.qualification === 'sslc' ? 'selected' : ''}>SSLC</option>
              <option value="plus two" ${cu.qualification === 'plus two' ? 'selected' : ''}>Plus Two</option>
              <option value="degree" ${cu.qualification === 'degree' ? 'selected' : ''}>Degree</option>
              <option value="pg" ${cu.qualification === 'pg' ? 'selected' : ''}>PG</option>
              <option value="other" ${cu.qualification === 'other' ? 'selected' : ''}>Other</option>
            </select>
          </div>
          
          <div id="prof-qualification-other-wrap" style="display: ${cu.qualification === 'other' ? 'block' : 'none'};">
            <label style="font-size:0.75rem;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Specify Other Qualification</label>
            <input type="text" value="${cu.qualificationOther || ''}" id="prof-qualification-other" placeholder="Enter your qualification" style="width:100%;padding:10px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:0.85rem;font-family:inherit;outline:none;box-sizing:border-box;">
          </div>
          
          <!-- Hidden input to store profile photo Base64 data -->
          <input type="hidden" id="prof-photo-data" value="${cu.profilePhoto || ''}">
          
          <div style="grid-column: span 2;">
            <label style="font-size:0.75rem;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Profile Photo (Aspect Ratio 3:4 - Height 4, Width 3)</label>
            <div style="display:flex;align-items:center;gap:16px;margin-top:8px;">
              <div id="prof-photo-preview" style="width:90px;height:120px;border-radius:8px;border:2px dashed #E2E8F0;display:flex;align-items:center;justify-content:center;background-size:cover;background-position:center;background-repeat:no-repeat;background-image:${cu.profilePhoto ? `url(${cu.profilePhoto})` : 'none'};">
                ${cu.profilePhoto ? '' : '<span style="font-size:0.75rem;color:#94A3B8;text-align:center;">3:4 Photo</span>'}
              </div>
              <div>
                <input type="file" id="prof-photo-input" accept="image/*" style="display:none;" onchange="if(this.files[0]){window.resizeAndCropTo3x4(this.files[0], function(base64){document.getElementById('prof-photo-preview').style.backgroundImage = 'url('+base64+')'; document.getElementById('prof-photo-preview').innerHTML = ''; document.getElementById('prof-photo-data').value = base64;})}">
                <button type="button" onclick="document.getElementById('prof-photo-input').click()" class="btn btn-secondary" style="padding:8px 16px;font-size:0.8rem;background:#F1F5F9;color:#374151;border:none;border-radius:10px;cursor:pointer;">Upload Photo</button>
                <button type="button" onclick="document.getElementById('prof-photo-preview').style.backgroundImage = 'none'; document.getElementById('prof-photo-preview').innerHTML = '<span style=\'font-size:0.75rem;color:#94A3B8;text-align:center;\'>3:4 Photo</span>'; document.getElementById('prof-photo-data').value = ''; document.getElementById('prof-photo-input').value = '';" class="btn btn-danger" style="padding:8px 16px;font-size:0.8rem;margin-left:8px;background:none;border:1px solid var(--danger);color:var(--danger);border-radius:10px;cursor:pointer;">Remove</button>
                <div style="font-size:0.72rem;color:#94A3B8;margin-top:6px;">Upload a portrait image. It will be resized and cropped to 3:4 aspect ratio.</div>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-bottom:20px;">
          <label style="font-size:0.75rem;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Bio / Expertise</label>
          <textarea id="prof-bio" rows="3" style="width:100%;padding:10px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:0.85rem;font-family:inherit;outline:none;box-sizing:border-box;resize:vertical;">${cu.authorBio || ''}</textarea>
        </div>
        <button onclick="TutorComponent._saveProfile()" style="padding:11px 24px;background:linear-gradient(135deg,#3D46D8,#6366F1);color:#fff;border:none;border-radius:10px;font-size:0.88rem;font-weight:700;cursor:pointer;font-family:inherit;">
          <i class="fa-solid fa-save"></i> Save Changes
        </button>
      </div>
    `;
  },

  _saveProfile: function () {
    const cu = window.db.getCurrentUser();
    if (!cu) return;
    const newName = document.getElementById('prof-name')?.value;
    const newBio = document.getElementById('prof-bio')?.value || '';

    const newWhatsapp = document.getElementById('prof-whatsapp')?.value || '';
    const newDob = document.getElementById('prof-dob')?.value || '';
    const newQual = document.getElementById('prof-qualification')?.value || '';
    const newQualOther = document.getElementById('prof-qualification-other')?.value || '';
    const newPhoto = document.getElementById('prof-photo-data')?.value || '';

    if (newName) cu.name = newName;
    cu.authorBio = newBio;
    cu.whatsapp = newWhatsapp;
    cu.dob = newDob;
    cu.qualification = newQual;
    cu.qualificationOther = newQualOther;
    cu.profilePhoto = newPhoto;

    const users = window.db.getUsers();
    const idx = users.findIndex(u => u.username === cu.username);
    if (idx !== -1) {
      users[idx] = cu;
      window.db.setItemAndSync('cubaze_users', users);
      localStorage.setItem('cubaze_current_user', JSON.stringify(cu));
    }

    window.app.showToast('Profile updated successfully!', 'success');
    window.app.updateNavbarAuth();

    // Re-render the tutor profile tab content
    const assignedCourses = window.db.getTutorAssignedCourses(cu.username);
    document.getElementById('tutor-main-content').innerHTML = TutorComponent._renderTab('profile', cu, assignedCourses);
  },

  // =====================================================
  // SETTINGS
  // =====================================================
  _renderSettings: function (cu) {
    return `
      <div class="dashboard-welcome">
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
                <input type="checkbox" ${checked ? 'checked' : ''} style="opacity:0;width:0;height:0;" onchange="window.app.showToast('Preference saved','success')">
                <span style="position:absolute;inset:0;background:${checked ? '#6366F1' : '#CBD5E1'};border-radius:22px;transition:background 0.2s;"></span>
                <span style="position:absolute;top:3px;left:${checked ? '21' : '3'}px;width:16px;height:16px;background:#fff;border-radius:50%;transition:left 0.2s;"></span>
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
    document.querySelectorAll('.sidebar-nav-item').forEach(el => el.classList.remove('active'));
    document.querySelector('[data-tutor-tab="lessons"]')?.classList.add('active');

    TutorComponent._bindLessonManagerEvents(courseId);
  },

  // =====================================================
  // SHOW EDIT LESSON MODAL
  // =====================================================
  _showEditLessonModal: function (courseId, modIdx, lessonId) {
    const course = window.db.getCourseById(courseId);
    if (!course) return;
    const lesson = course.modules[modIdx].lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    // Create modal element
    const overlay = document.createElement('div');
    overlay.className = 'tutor-modal-overlay';
    overlay.id = 'edit-lesson-modal';
    overlay.innerHTML = `
      <div class="tutor-modal">
        <h3><i class="fa-solid fa-pen-to-square" style="color:#3D46D8;margin-right:8px;"></i>Edit Lesson</h3>
        <form id="form-edit-lesson">
          <div style="margin-bottom:14px;">
            <label>Lesson Title *</label>
            <input type="text" id="edit-l-title" required value="${lesson.title}">
          </div>
          <div style="margin-bottom:14px;">
            <label>Duration (MM:SS)</label>
            <input type="text" id="edit-l-duration" placeholder="e.g. 12:45" value="${lesson.duration || ''}">
          </div>
          <div style="margin-bottom:14px;">
            <label>YouTube Video URL *</label>
            <input type="url" id="edit-l-url" required value="${lesson.videoUrl || ''}">
          </div>
          <div style="margin-bottom:20px;">
            <label>Lesson Description (optional)</label>
            <textarea id="edit-l-desc" rows="3" placeholder="Brief description of what this lesson covers...">${lesson.description || ''}</textarea>
          </div>
          <div style="display:flex;gap:10px;justify-content:flex-end;">
            <button type="button" class="btn-modal-cancel" style="padding:10px 20px;background:#F1F5F9;color:#475569;border:none;border-radius:10px;font-size:0.85rem;font-weight:600;cursor:pointer;font-family:inherit;">
              Cancel
            </button>
            <button type="submit" style="padding:10px 20px;background:linear-gradient(135deg,#3D46D8,#6366F1);color:#fff;border:none;border-radius:10px;font-size:0.85rem;font-weight:700;cursor:pointer;font-family:inherit;">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    `;

    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });

    overlay.querySelector('.btn-modal-cancel').addEventListener('click', () => {
      overlay.remove();
    });

    overlay.querySelector('#form-edit-lesson').addEventListener('submit', e => {
      e.preventDefault();
      const title = document.getElementById('edit-l-title').value.trim();
      const duration = document.getElementById('edit-l-duration').value.trim() || '10:00';
      const url = document.getElementById('edit-l-url').value.trim();
      const desc = document.getElementById('edit-l-desc').value.trim();

      const res = window.db.updateLessonInCourseModule(courseId, lessonId, {
        title,
        duration,
        videoUrl: url,
        description: desc
      });

      if (res.success) {
        window.app.showToast('Lesson updated successfully! ✅', 'success');
        overlay.remove();
        // Refresh Lesson Manager
        const cu = window.db.getCurrentUser();
        const assignedCourses = window.db.getTutorAssignedCourses(cu.username);
        const updatedCourse = assignedCourses.find(c => c.id === courseId) || window.db.getCourseById(courseId);
        document.getElementById('tutor-main-content').innerHTML =
          TutorComponent._renderLessonManager(updatedCourse, cu);
        TutorComponent._bindLessonManagerEvents(courseId);
      } else {
        window.app.showToast(res.error || 'Failed to update lesson.', 'danger');
      }
    });

    document.body.appendChild(overlay);
  },

  _addModule: function (courseId) {
    const titleInput = document.getElementById('tutor-new-mod-title');
    if (!titleInput) return;
    const title = titleInput.value.trim();
    if (!title) { window.app.showToast('Enter a module title.', 'danger'); return; }

    const res = window.db.addCourseModule(courseId, title);
    if (res.success) {
      window.app.showToast('Module added successfully!', 'success');
      const cu = window.db.getCurrentUser();
      const course = window.db.getCourseById(courseId);
      document.getElementById('tutor-main-content').innerHTML = TutorComponent._renderLessonManager(course, cu);
      TutorComponent._bindLessonManagerEvents(courseId);
    } else {
      window.app.showToast(res.error || 'Failed to add module.', 'danger');
    }
  },

  _showEditModuleModal: function (courseId, modIdx) {
    const course = window.db.getCourseById(courseId);
    if (!course || !course.modules || !course.modules[modIdx]) return;
    const mod = course.modules[modIdx];

    const overlay = document.createElement('div');
    overlay.className = 'tutor-modal-overlay';
    overlay.id = 'edit-module-modal';
    overlay.innerHTML = `
      <div class="tutor-modal">
        <h3><i class="fa-solid fa-layer-group" style="color:#3D46D8;margin-right:8px;"></i>Edit Module</h3>
        <form id="form-edit-module">
          <div style="margin-bottom:20px;">
            <label>Module Title *</label>
            <input type="text" id="edit-m-title" required value="${mod.title}" style="width:100%; box-sizing:border-box;">
          </div>
          <div style="display:flex;gap:10px;justify-content:flex-end;">
            <button type="button" class="btn-modal-cancel" style="padding:10px 20px;background:#F1F5F9;color:#475569;border:none;border-radius:10px;font-size:0.85rem;font-weight:600;cursor:pointer;font-family:inherit;">Cancel</button>
            <button type="submit" style="padding:10px 20px;background:linear-gradient(135deg,#3D46D8,#6366F1);color:#fff;border:none;border-radius:10px;font-size:0.85rem;font-weight:700;cursor:pointer;font-family:inherit;">Save Changes</button>
          </div>
        </form>
      </div>
    `;

    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    overlay.querySelector('.btn-modal-cancel').addEventListener('click', () => overlay.remove());

    overlay.querySelector('#form-edit-module').addEventListener('submit', e => {
      e.preventDefault();
      const newTitle = document.getElementById('edit-m-title').value.trim();
      if (!newTitle) { window.app.showToast('Title is required', 'danger'); return; }

      const res = window.db.updateCourseModule(courseId, modIdx, newTitle);
      if (res.success) {
        window.app.showToast('Module updated!', 'success');
        overlay.remove();
        const cu = window.db.getCurrentUser();
        const updatedCourse = window.db.getCourseById(courseId);
        document.getElementById('tutor-main-content').innerHTML = TutorComponent._renderLessonManager(updatedCourse, cu);
        TutorComponent._bindLessonManagerEvents(courseId);
      } else {
        window.app.showToast(res.error || 'Failed to update module.', 'danger');
      }
    });

    document.body.appendChild(overlay);
  },

  _deleteModule: function (courseId, modIdx) {
    if (!confirm('Are you sure you want to delete this module and all of its lessons? This action cannot be undone.')) return;
    const res = window.db.deleteCourseModule(courseId, modIdx);
    if (res.success) {
      window.app.showToast('Module deleted successfully!', 'success');
      const cu = window.db.getCurrentUser();
      const updatedCourse = window.db.getCourseById(courseId);
      document.getElementById('tutor-main-content').innerHTML = TutorComponent._renderLessonManager(updatedCourse, cu);
      TutorComponent._bindLessonManagerEvents(courseId);
    } else {
      window.app.showToast(res.error || 'Failed to delete module.', 'danger');
    }
  },
  // =====================================================
  // INIT
  // =====================================================
  init: function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Preserve active tab, default to 'dashboard'
    const tab = TutorComponent._activeTab || 'dashboard';
    TutorComponent._activeTab = tab;

    TutorComponent._bindSidebar();
    
    // Bind correct event handlers for active tab
    if (tab === 'messages') {
      TutorComponent._loadAndRenderMessages();
    } else {
      TutorComponent._bindCourseCards();
      TutorComponent._bindUploadForm();
      if (tab === 'liveclasses') {
        TutorComponent._bindLiveClassesEvents();
      }
      if (tab === 'batches') {
        TutorComponent._bindBatchesEvents();
      }
      if (TutorComponent._openCourseId) {
        TutorComponent._bindLessonManagerEvents(TutorComponent._openCourseId);
      }
      const cu = window.db.getCurrentUser();
      if (cu && tab === 'dashboard') {
        setTimeout(() => {
          if (window.DashboardRightPanel) window.DashboardRightPanel.bindEvents(cu);
        }, 100);
      }
    }
    TutorComponent.updateTutorBadge();
  },

  _bindSidebar: function () {
    document.querySelectorAll('.sidebar-nav-item[data-tutor-tab]').forEach(item => {
      item.addEventListener('click', () => {
        const tab = item.getAttribute('data-tutor-tab');
        TutorComponent._activeTab = tab;
        if (tab !== 'lessons') TutorComponent._openCourseId = null;

        document.querySelectorAll('.sidebar-nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const cu = window.db.getCurrentUser();
        const assignedCourses = window.db.getTutorAssignedCourses(cu.username);

        if (tab === 'messages') {
          TutorComponent._loadAndRenderMessages();
        } else {
          TutorComponent._activeConvId = null;
          document.getElementById('tutor-main-content').innerHTML =
            TutorComponent._renderTab(tab, cu, assignedCourses);

          TutorComponent._bindCourseCards();
          TutorComponent._bindUploadForm();
          if (tab === 'liveclasses') {
            TutorComponent._bindLiveClassesEvents();
          }
          if (tab === 'batches') {
            TutorComponent._bindBatchesEvents();
          } else {
            TutorComponent._openBatchId = null;
          }
          if (TutorComponent._openCourseId) {
            TutorComponent._bindLessonManagerEvents(TutorComponent._openCourseId);
          }
          if (tab === 'dashboard') {
            setTimeout(() => {
              if (window.DashboardRightPanel) window.DashboardRightPanel.bindEvents(cu);
            }, 50);
          }
        }
      });
    });

    // Quick links in dashboard
    document.querySelectorAll('[data-tutor-tab]').forEach(el => {
      el.addEventListener('click', () => {
        const tab = el.getAttribute('data-tutor-tab');
        document.querySelector(`.sidebar-nav-item[data-tutor-tab="${tab}"]`)?.click();
      });
    });
  },

  _bindCourseCards: function () {
    // Course card clicks already use onclick="TutorComponent._openCourse(...)"
    // Back button inside lesson manager
    const backBtn = document.getElementById('btn-back-to-courses');
    if (backBtn && !backBtn.hasAttribute('data-bound')) {
      backBtn.setAttribute('data-bound', 'true');
      backBtn.addEventListener('click', () => {
        TutorComponent._openCourseId = null;
        TutorComponent._activeTab = 'courses';
        const cu = window.db.getCurrentUser();
        const assignedCourses = window.db.getTutorAssignedCourses(cu.username);
        document.getElementById('tutor-main-content').innerHTML =
          TutorComponent._renderCourses(assignedCourses);

        document.querySelectorAll('.sidebar-nav-item').forEach(i => i.classList.remove('active'));
        document.querySelector('[data-tutor-tab="courses"]')?.classList.add('active');
        TutorComponent._bindCourseCards();
      });
    }
  },

  _bindLessonManagerEvents: function (courseId) {
    // Back button
    TutorComponent._bindCourseCards();

    // Show add-lesson form toggle
    document.querySelectorAll('.btn-show-add-form:not([data-bound])').forEach(btn => {
      btn.setAttribute('data-bound', 'true');
      btn.addEventListener('click', () => {
        const formId = btn.getAttribute('data-form-id');
        const wrap = document.getElementById(formId);
        wrap.classList.toggle('open');
      });
    });

    // Cancel add lesson form
    document.querySelectorAll('.btn-cancel-add-form:not([data-bound])').forEach(btn => {
      btn.setAttribute('data-bound', 'true');
      btn.addEventListener('click', () => {
        const formId = btn.getAttribute('data-form-id');
        document.getElementById(formId)?.classList.remove('open');
      });
    });

    // Submit add lesson
    document.querySelectorAll('.form-add-lesson:not([data-bound])').forEach(form => {
      form.setAttribute('data-bound', 'true');
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

    // Edit lesson
    document.querySelectorAll('.btn-edit-lesson:not([data-bound])').forEach(btn => {
      btn.setAttribute('data-bound', 'true');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cId = btn.getAttribute('data-course-id');
        const lesId = btn.getAttribute('data-lesson-id');
        const modIdx = parseInt(btn.getAttribute('data-mod-idx'));
        TutorComponent._showEditLessonModal(cId, modIdx, lesId);
      });
    });

    // Delete lesson
    const delBtns = document.querySelectorAll('.btn-del-lesson:not([data-bound])');
    delBtns.forEach(btn => {
      btn.setAttribute('data-bound', 'true');
      let confirmTimeout = null;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();

        const isConfirmActive = btn.classList.contains('confirm-active');
        const now = Date.now();

        if (!isConfirmActive) {
          // Reset all other active confirm buttons in the view
          document.querySelectorAll('.btn-del-lesson.confirm-active').forEach(otherBtn => {
            otherBtn.classList.remove('confirm-active');
            otherBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            otherBtn.title = "Delete Lesson";
          });

          // Set this button to confirm-active state
          btn.classList.add('confirm-active');
          btn.innerHTML = '<i class="fa-solid fa-check"></i>';
          btn.title = "Confirm Deletion";
          btn.dataset.activatedTime = now.toString();
          window.app.showToast('Click the checkmark again to confirm deletion.', 'warning');

          // Auto-reset back to normal trash icon after 60 seconds of inactivity
          confirmTimeout = setTimeout(() => {
            btn.classList.remove('confirm-active');
            btn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            btn.title = "Delete Lesson";
          }, 60000);

        } else {
          // Cooldown check: ignore clicks within 400ms of activation to prevent accidental double-clicks
          const activatedTime = parseInt(btn.dataset.activatedTime || '0');
          if (now - activatedTime < 400) {
            return;
          }

          // Confirm clicked! Clear reset timeout
          if (confirmTimeout) clearTimeout(confirmTimeout);

          const cId = btn.getAttribute('data-course-id');
          const lesId = btn.getAttribute('data-lesson-id');

          const res = window.db.deleteLessonFromCourseModule(cId, lesId);
          if (res.success) {
            window.app.showToast('Lesson deleted successfully! ✅', 'success');
            const cu = window.db.getCurrentUser();
            const assignedCourses = window.db.getTutorAssignedCourses(cu.username);
            const course = assignedCourses.find(c => c.id === cId) || window.db.getCourseById(cId);
            document.getElementById('tutor-main-content').innerHTML =
              TutorComponent._renderLessonManager(course, cu);
            TutorComponent._bindLessonManagerEvents(cId);
          } else {
            window.app.showToast(res.error || 'Failed to delete.', 'danger');
            btn.classList.remove('confirm-active');
            btn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            btn.title = "Delete Lesson";
          }
        }
      });
    });
  },

  _bindUploadForm: function () {
    const courseSelect = document.getElementById('upload-course');
    const moduleSelect = document.getElementById('upload-module');

    if (courseSelect && !courseSelect.hasAttribute('data-bound')) {
      courseSelect.setAttribute('data-bound', 'true');
      courseSelect.addEventListener('change', () => {
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
    }

    const quickUploadForm = document.getElementById('form-quick-upload');
    if (quickUploadForm && !quickUploadForm.hasAttribute('data-bound')) {
      quickUploadForm.setAttribute('data-bound', 'true');
      quickUploadForm.addEventListener('submit', e => {
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
  },

  // =====================================================
  // LIVE CLASSES METHODS
  // =====================================================
  _renderLiveClasses: function (assignedCourses, cu) {
    const liveClasses = window.db.getLiveClasses().filter(lc => lc.tutor_id === cu.username);
    return `
      <div style="display:flex; flex-direction:column; gap:24px;">
        <div class="dashboard-welcome" style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h2>Live Classes</h2>
            <p>Manage scheduled Google Meet sessions for your courses.</p>
          </div>
          <button class="btn btn-primary" id="btn-tutor-add-live" style="background:#fff; color:var(--brand-blue); border:none;"><i class="fa-solid fa-plus"></i> Create Live Class</button>
        </div>

        <div class="glass-panel">
          <div class="table-actions-bar">
            <div class="table-actions-left">
              <div class="search-input-wrapper" style="width: 260px;">
                <i class="fa-solid fa-magnifying-glass search-icon"></i>
                <input id="tutor-live-search" placeholder="Search live classes...">
              </div>
            </div>
          </div>

          <table class="data-table" id="tutor-live-table">
            <thead>
              <tr>
                <th>Course / Module</th>
                <th>Title</th>
                <th>Date & Time</th>
                <th>Meet Link</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${liveClasses.length === 0 ? `
                <tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:32px;">No live classes created yet.</td></tr>
              ` : liveClasses.map(lc => {
      const c = assignedCourses.find(x => x.id === lc.course_id);
      const courseTitle = c ? c.title : lc.course_id;
      const moduleTitle = c && c.modules[lc.module_id] ? c.modules[lc.module_id].title : `Module ${lc.module_id + 1}`;

      let statusClass = "success";
      if (lc.status === 'draft') statusClass = "warning";
      else if (lc.status === 'cancelled') statusClass = "danger";

      return `
                  <tr data-lc-id="${lc.id}">
                    <td>
                      <div style="font-weight:700;color:var(--text-primary);font-size:0.85rem;">${courseTitle}</div>
                      <div style="font-size:0.7rem;color:var(--text-muted);">${moduleTitle}</div>
                    </td>
                    <td>
                      <div style="font-weight:600;color:var(--text-primary);">${lc.title}</div>
                      <div style="font-size:0.72rem;color:var(--text-muted);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${lc.description || ''}</div>
                    </td>
                    <td>
                      <div style="font-weight:600;color:var(--text-primary);"><i class="fa-regular fa-calendar-days" style="margin-right:6px;color:var(--brand-blue);"></i>${lc.date}</div>
                      <div style="font-size:0.72rem;color:var(--text-muted);"><i class="fa-regular fa-clock" style="margin-right:6px;color:var(--brand-blue);"></i>${lc.start_time} - ${lc.end_time}</div>
                    </td>
                    <td>
                      ${lc.meet_link ? `<a href="${lc.meet_link}" target="_blank" style="color:var(--brand-blue);font-weight:700;font-size:0.8rem;text-decoration:none;"><i class="fa-solid fa-video" style="margin-right:4px;"></i>Join Class</a>` : `<span style="color:var(--text-muted);font-style:italic;">None</span>`}
                    </td>
                    <td>
                      <span class="status-badge ${statusClass}">${lc.status}</span>
                    </td>
                    <td>
                      <div class="adm-action-wrap">
                        <button class="btn btn-outline-white btn-sm btn-icon" onclick="TutorComponent._openTutorMenu(this, event)"><i class="fa-solid fa-ellipsis"></i></button>
                        <div class="adm-action-menu">
                          <button onclick="TutorComponent._showEditLiveClass('${lc.id}')"><i class="fa-solid fa-pen-to-square" style="color:#D97706;"></i> Edit</button>
                          <button onclick="TutorComponent._duplicateLiveClass('${lc.id}')"><i class="fa-solid fa-copy" style="color:#64748B;"></i> Duplicate</button>
                          ${lc.status !== 'cancelled' ? `<button onclick="TutorComponent._cancelLiveClass('${lc.id}')"><i class="fa-solid fa-ban" style="color:#DC2626;"></i> Cancel</button>` : ''}
                          <button class="danger" onclick="TutorComponent._deleteLiveClass('${lc.id}')"><i class="fa-solid fa-trash-can"></i> Delete</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                `;
    }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  _openTutorMenu: function (btn, e) {
    if (e) e.stopPropagation();
    const menu = btn.nextElementSibling;
    if (!menu) return;

    const isOpen = menu.classList.contains('open');
    document.querySelectorAll('.adm-action-menu.open').forEach(m => {
      m.classList.remove('open');
    });

    if (!isOpen) {
      menu.classList.add('open');
    }
  },

  _duplicateLiveClass: function (id) {
    const lc = window.db.getLiveClassById(id);
    if (!lc) return;
    const copy = { ...lc, id: undefined, title: `${lc.title} (Copy)`, created_at: undefined, updated_at: undefined };
    const saved = window.db.saveLiveClass(copy);
    if (saved) {
      window.app.showToast('Live class duplicated successfully! 📋', 'success');
      TutorComponent._refreshLiveClassesTab();
    } else {
      window.app.showToast('Failed to duplicate live class.', 'danger');
    }
  },

  _cancelLiveClass: function (id) {
    if (!confirm('Are you sure you want to cancel this live class?')) return;
    const lc = window.db.getLiveClassById(id);
    if (!lc) return;
    lc.status = 'cancelled';
    const saved = window.db.saveLiveClass(lc);
    if (saved) {
      window.app.showToast('Live class cancelled successfully.', 'success');
      TutorComponent._refreshLiveClassesTab();
    } else {
      window.app.showToast('Failed to cancel live class.', 'danger');
    }
  },

  _deleteLiveClass: function (id) {
    if (!confirm('Are you sure you want to permanently delete this live class?')) return;
    if (window.db.deleteLiveClass(id)) {
      window.app.showToast('Live class deleted.', 'success');
      TutorComponent._refreshLiveClassesTab();
    } else {
      window.app.showToast('Failed to delete live class.', 'danger');
    }
  },

  _refreshLiveClassesTab: function () {
    const cu = window.db.getCurrentUser();
    const assignedCourses = window.db.getTutorAssignedCourses(cu.username);
    document.getElementById('tutor-main-content').innerHTML =
      TutorComponent._renderLiveClasses(assignedCourses, cu);
    TutorComponent._bindLiveClassesEvents();
  },

  _showEditLiveClass: function (id) {
    TutorComponent._showLiveClassModal(id);
  },

  _showLiveClassModal: function (id = null) {
    const cu = window.db.getCurrentUser();
    const assignedCourses = window.db.getTutorAssignedCourses(cu.username);
    if (assignedCourses.length === 0) {
      window.app.showToast('You must have at least one assigned course to manage live classes.', 'warning');
      return;
    }

    const lc = id ? window.db.getLiveClassById(id) : null;
    const activeCourseId = lc ? lc.course_id : assignedCourses[0].id;
    const activeCourse = assignedCourses.find(c => c.id === activeCourseId) || assignedCourses[0];
    const modules = activeCourse ? (activeCourse.modules || []) : [];

    const overlay = document.createElement('div');
    overlay.className = 'tutor-modal-overlay';
    overlay.id = 'live-class-modal';

    overlay.innerHTML = `
      <div class="tutor-modal" style="max-width: 540px;">
        <h3><i class="fa-solid fa-video" style="color:var(--brand-blue);margin-right:8px;"></i>${id ? 'Edit Live Class' : 'Create Live Class'}</h3>
        <form id="form-tutor-live-class">
          <div class="form-group" style="margin-bottom:14px;">
            <label>Course *</label>
            <select id="t-lc-course" required ${id ? 'disabled' : ''}>
              ${assignedCourses.map(c => `<option value="${c.id}" ${c.id === activeCourseId ? 'selected' : ''}>${c.title}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="margin-bottom:14px;">
            <label>Module *</label>
            <select id="t-lc-module" required>
              ${modules.map((m, idx) => `<option value="${idx}" ${lc && lc.module_id === idx ? 'selected' : ''}>${m.title}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="margin-bottom:14px;">
            <label>Title *</label>
            <input type="text" id="t-lc-title" required value="${lc ? lc.title : ''}" placeholder="e.g. Rigging Basics Q&A">
          </div>
          <div class="form-group" style="margin-bottom:14px;">
            <label>Description</label>
            <textarea id="t-lc-desc" style="min-height:70px; resize:vertical;">${lc ? lc.description : ''}</textarea>
          </div>
          <div style="display:grid; grid-template-columns: 2fr 1fr 1fr; gap:12px; margin-bottom:14px;">
            <div class="form-group" style="margin-bottom:0;">
              <label>Date *</label>
              <input type="date" id="t-lc-date" required value="${lc ? lc.date : ''}">
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label>Start Time *</label>
              <input type="time" id="t-lc-start" required value="${lc ? lc.start_time : ''}">
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label>End Time *</label>
              <input type="time" id="t-lc-end" required value="${lc ? lc.end_time : ''}">
            </div>
          </div>
          <div class="form-group" style="margin-bottom:14px;">
            <label style="display:flex; justify-content:space-between; align-items:center;">
              <span>Google Meet Link *</span>
              <button type="button" class="btn btn-outline-white btn-sm" id="btn-generate-meet" style="padding: 2px 8px; font-size: 0.72rem; height: auto;"><i class="fa-solid fa-wand-magic-sparkles"></i> Generate Link</button>
            </label>
            <input type="url" id="t-lc-link" required value="${lc ? lc.meet_link : ''}" placeholder="https://meet.google.com/xxx-xxxx-xxx">
          </div>
          <div class="form-group" style="margin-bottom:20px;">
            <label>Status</label>
            <select id="t-lc-status" style="width:100%;">
              <option value="published" ${lc && lc.status === 'published' ? 'selected' : ''}>Published (Visible to students)</option>
              <option value="draft" ${lc && lc.status === 'draft' ? 'selected' : ''}>Draft</option>
            </select>
          </div>
          <div style="display:flex; gap:10px; justify-content:flex-end;">
            <button type="button" class="btn btn-secondary btn-modal-cancel" style="padding:10px 20px;">Cancel</button>
            <button type="submit" class="btn btn-primary" style="padding:10px 20px;">${id ? 'Save Changes' : 'Create Class'}</button>
          </div>
        </form>
      </div>
    `;

    // Bind generation
    overlay.querySelector('#btn-generate-meet').addEventListener('click', () => {
      const code = Math.random().toString(36).substring(2, 5) + "-" + Math.random().toString(36).substring(2, 6) + "-" + Math.random().toString(36).substring(2, 5);
      overlay.querySelector('#t-lc-link').value = `https://meet.google.com/${code}`;
    });

    // Handle course change to update module dropdown
    overlay.querySelector('#t-lc-course').addEventListener('change', e => {
      const courseId = e.target.value;
      const course = assignedCourses.find(c => c.id === courseId);
      const modSelect = overlay.querySelector('#t-lc-module');
      modSelect.innerHTML = (course ? (course.modules || []) : []).map((m, idx) => `<option value="${idx}">${m.title}</option>`).join('');
    });

    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    overlay.querySelector('.btn-modal-cancel').addEventListener('click', () => overlay.remove());

    overlay.querySelector('#form-tutor-live-class').addEventListener('submit', e => {
      e.preventDefault();
      const course_id = overlay.querySelector('#t-lc-course').value;
      const module_id = parseInt(overlay.querySelector('#t-lc-module').value);
      const title = overlay.querySelector('#t-lc-title').value.trim();
      const description = overlay.querySelector('#t-lc-desc').value.trim();
      const date = overlay.querySelector('#t-lc-date').value;
      const start_time = overlay.querySelector('#t-lc-start').value;
      const end_time = overlay.querySelector('#t-lc-end').value;
      const meet_link = overlay.querySelector('#t-lc-link').value;
      const status = overlay.querySelector('#t-lc-status').value;

      const liveClassData = {
        course_id,
        module_id,
        tutor_id: cu.username,
        title,
        description,
        date,
        start_time,
        end_time,
        meet_link,
        status
      };
      if (id) liveClassData.id = id;

      const res = window.db.saveLiveClass(liveClassData);
      if (res) {
        window.app.showToast(id ? 'Live class updated! ✅' : 'Live class created! 🚀', 'success');
        overlay.remove();
        TutorComponent._refreshLiveClassesTab();
      } else {
        window.app.showToast('Failed to save live class.', 'danger');
      }
    });

    document.body.appendChild(overlay);
  },

  _bindLiveClassesEvents: function () {
    document.getElementById('btn-tutor-add-live')?.addEventListener('click', () => {
      TutorComponent._showLiveClassModal();
    });

    document.getElementById('tutor-live-search')?.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      const rows = document.querySelectorAll('#tutor-live-table tbody tr');
      rows.forEach(r => {
        const text = r.textContent.toLowerCase();
        if (text.includes(q)) r.style.display = '';
        else r.style.display = 'none';
      });
    });
  },

  _openBatchId: null,
  _activeBatchSubTab: 'attendance',
  _attendanceDate: new Date().toISOString().split('T')[0],

  _renderBatches: function (cu) {
    const batches = window.db.getBatches().filter(b => b.tutorIds.includes(cu.username));

    let subPanelHtml = '';
    if (TutorComponent._openBatchId) {
      const selectedBatch = batches.find(b => b.id === TutorComponent._openBatchId);
      if (selectedBatch) {
        subPanelHtml = TutorComponent._renderBatchSubPanels(selectedBatch, cu);
      }
    }

    return `
      <div class="dashboard-welcome">
        <h1>My Batches <span style="font-size:1rem;font-weight:500;color:#64748B;">(${batches.length})</span></h1>
        <p>Manage attendance, schedule live classes, post announcements, create assignments, and share resources for your batches.</p>
      </div>

      <div style="display:grid; grid-template-columns: 280px 1fr; gap: 24px; margin-top:20px;">
        <!-- Left Column: Batches List -->
        <div class="glass-panel" style="padding: 16px; height: fit-content; text-align: left;">
          <h3 style="font-size:0.9rem; font-weight:800; margin-bottom:12px;">Assigned Batches</h3>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${batches.map(b => `
              <div class="t-batch-list-item ${TutorComponent._openBatchId === b.id ? 'active' : ''}" 
                   onclick="TutorComponent._selectBatch('${b.id}')"
                   style="padding: 12px; border-radius: 10px; border: 1.5px solid ${TutorComponent._openBatchId === b.id ? '#6366F1' : '#E2E8F0'}; 
                          background: ${TutorComponent._openBatchId === b.id ? '#EFF2FE' : '#F8FAFC'}; cursor: pointer; transition: all 0.2s;">
                <div style="font-weight: 700; font-size: 0.85rem; color: #0F172A;">${b.name}</div>
                <div style="font-size: 0.72rem; color: #64748B; margin-top:4px;">Code: ${b.id}</div>
                <div style="font-size: 0.72rem; color: #64748B;">Time: ${b.classTime}</div>
              </div>
            `).join('')}
            ${batches.length === 0 ? '<p style="color:var(--text-muted); font-size:0.8rem; font-style:italic;">No batches assigned to you yet.</p>' : ''}
          </div>
        </div>

        <!-- Right Column: Batch Controls & Tabs -->
        <div id="batch-sub-panels-container">
          ${subPanelHtml || `
            <div class="glass-panel" style="padding: 48px; text-align: center; color: var(--text-muted);">
              <div style="font-size: 3rem; margin-bottom:16px;">👥</div>
              <h3>Select a Batch</h3>
              <p>Choose a batch from the sidebar to view and manage students, scheduled live classes, announcements, and more.</p>
            </div>
          `}
        </div>
      </div>
    `;
  },

  _selectBatch: function (batchId) {
    TutorComponent._openBatchId = batchId;
    const cu = window.db.getCurrentUser();
    document.getElementById('tutor-main-content').innerHTML = TutorComponent._renderBatches(cu);
    TutorComponent._bindBatchesEvents();
  },

  _renderBatchSubPanels: function (batch, cu) {
    const activeSubTab = TutorComponent._activeBatchSubTab || 'attendance';
    const subTabs = [
      ['attendance', 'fa-calendar-check', 'Attendance'],
      ['live', 'fa-video', 'Live Classes'],
      ['announcements', 'fa-bullhorn', 'Announcements'],
      ['assignments', 'fa-tasks', 'Assignments'],
      ['resources', 'fa-folder-open', 'Resources']
    ];

    let tabContent = '';
    if (activeSubTab === 'attendance') tabContent = TutorComponent._renderBatchAttendance(batch);
    else if (activeSubTab === 'live') tabContent = TutorComponent._renderBatchLiveClasses(batch);
    else if (activeSubTab === 'announcements') tabContent = TutorComponent._renderBatchAnnouncements(batch);
    else if (activeSubTab === 'assignments') tabContent = TutorComponent._renderBatchAssignments(batch);
    else if (activeSubTab === 'resources') tabContent = TutorComponent._renderBatchResources(batch);

    return `
      <div class="glass-panel" style="padding:0; overflow:hidden;">
        <!-- WhatsApp Group link editor for tutor -->
        <div style="background:#EFF2FE; border-bottom:1px solid var(--border-color); padding:16px 24px; text-align:left;">
          <form id="t-whatsapp-form" style="display:flex; align-items:center; justify-content:space-between; gap:16px; margin:0; flex-wrap:wrap;">
            <div style="flex:1; min-width:240px; display:flex; align-items:center; gap:10px;">
              <i class="fa-brands fa-whatsapp" style="font-size:1.5rem; color:#25D366;"></i>
              <div style="flex:1;">
                <label style="font-weight:700; font-size:0.75rem; color:var(--text-secondary); display:block; margin-bottom:2px;">WhatsApp Group Invite Link</label>
                <input type="url" id="t-whatsapp-link-input" placeholder="https://chat.whatsapp.com/..." value="${batch.whatsappLink || ''}" style="width:100%; height:32px; padding:0 8px; border-radius:6px; border:1.5px solid var(--border-color); background:var(--bg-primary); color:var(--text-primary); font-size:0.8rem; outline:none; font-family:inherit; box-sizing:border-box;">
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-sm" style="height:36px; padding:0 16px; margin-bottom:0; font-weight:700; font-size:0.8rem; display:inline-flex; align-items:center; gap:6px;"><i class="fa-solid fa-save"></i> Save Link</button>
          </form>
        </div>

        <!-- Sub-panel Tabs Nav -->
        <div style="display:flex; border-bottom:1px solid var(--border-color); background:var(--bg-secondary); overflow-x:auto;">
          ${subTabs.map(([tab, icon, label]) => `
            <button class="t-batch-sub-tab-btn ${activeSubTab === tab ? 'active' : ''}" 
                    onclick="TutorComponent._selectBatchSubTab('${tab}')"
                    style="padding:14px 20px; font-weight:700; font-size:0.8rem; background:none; border:none; 
                           border-bottom: 2px solid ${activeSubTab === tab ? '#3D46D8' : 'transparent'}; 
                           color: ${activeSubTab === tab ? '#3D46D8' : 'var(--text-secondary)'}; cursor:pointer; 
                           display:flex; align-items:center; gap:8px; white-space:nowrap; outline:none;">
              <i class="fa-solid ${icon}"></i> ${label}
            </button>
          `).join('')}
        </div>
        
        <!-- Tab panel viewport -->
        <div style="padding:24px;">
          ${tabContent}
        </div>
      </div>
    `;
  },

  _selectBatchSubTab: function (tab) {
    TutorComponent._activeBatchSubTab = tab;
    const cu = window.db.getCurrentUser();
    document.getElementById('tutor-main-content').innerHTML = TutorComponent._renderBatches(cu);
    TutorComponent._bindBatchesEvents();
  },

  _renderBatchAttendance: function (batch) {
    const students = window.db.getUsers().filter(u => u.role === 'student' && u.enrolledBatches && u.enrolledBatches[batch.courseId] === batch.id);
    const dateVal = TutorComponent._attendanceDate;
    const attendanceMap = window.db.getAttendance(batch.id, dateVal) || {};

    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:12px;">
        <h3 style="font-size:1rem; font-weight:800; text-align:left; margin:0;">Daily Attendance Tracking</h3>
        <div style="display:flex; align-items:center; gap:8px;">
          <label style="font-size:0.8rem; font-weight:600; color:var(--text-secondary); margin:0;">Date:</label>
          <input type="date" id="att-date-input" value="${dateVal}" style="height:38px; padding:0 12px; border-radius:8px; border:1.5px solid var(--border-color); background:var(--bg-primary); font-size:0.83rem; outline:none; font-family:inherit;">
        </div>
      </div>
      
      <table class="data-table" style="margin-bottom:20px;">
        <thead>
          <tr>
            <th>Student</th>
            <th>Username</th>
            <th style="width:180px; text-align:center;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${students.map(s => {
      const status = attendanceMap[s.username] || 'Absent';
      return `
              <tr>
                <td style="font-weight:700; color:#0F172A; text-align:left;">${s.name}</td>
                <td style="text-align:left;">@${s.username}</td>
                <td style="text-align:center;">
                  <select class="form-control att-student-select" data-student="${s.username}" style="height:36px; padding:0 10px; font-size:0.8rem; font-weight:700; font-family:inherit;">
                    <option value="Present" ${status === 'Present' ? 'selected' : ''}>Present</option>
                    <option value="Absent" ${status === 'Absent' ? 'selected' : ''}>Absent</option>
                    <option value="Excused" ${status === 'Excused' ? 'selected' : ''}>Excused</option>
                  </select>
                </td>
              </tr>
            `;
    }).join('')}
          ${students.length === 0 ? '<tr><td colspan="3" style="text-align:center; color:var(--text-muted); padding:20px;">No students enrolled in this batch yet.</td></tr>' : ''}
        </tbody>
      </table>
      
      ${students.length > 0 ? `
        <div style="display:flex; justify-content:flex-end;">
          <button class="btn btn-primary" id="btn-save-attendance"><i class="fa-solid fa-save"></i> Save Attendance</button>
        </div>
      ` : ''}
    `;
  },

  _renderBatchLiveClasses: function (batch) {
    const liveClasses = window.db.getLiveClasses().filter(lc => lc.batch_id === batch.id);
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h3 style="font-size:1rem; font-weight:800; text-align:left; margin:0;">Scheduled Live Classes</h3>
        <button class="btn btn-primary btn-sm" id="btn-add-batch-live" style="margin:0;"><i class="fa-solid fa-plus"></i> Schedule Class</button>
      </div>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date & Time</th>
            <th>Meet Link</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${liveClasses.map(lc => `
            <tr>
              <td style="font-weight:700; color:#0F172A; text-align:left;">${lc.title}</td>
              <td style="font-size:0.8rem; font-weight:600; text-align:left;">${lc.date} @ ${lc.start_time} - ${lc.end_time}</td>
              <td style="text-align:left;"><a href="${lc.meet_link}" target="_blank" style="color:#3D46D8; text-decoration:none;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open Link</a></td>
              <td><span class="status-badge ${lc.status === 'published' ? 'success' : ''}">${lc.status}</span></td>
              <td>
                <div style="display:flex; gap:6px; justify-content:center;">
                  <button class="btn btn-outline-white btn-xs" onclick="TutorComponent._editBatchLiveClass('${lc.id}')" style="margin:0; padding:6px 10px;"><i class="fa-solid fa-pen"></i></button>
                  <button class="btn btn-danger btn-xs" onclick="TutorComponent._deleteBatchLiveClass('${lc.id}')" style="margin:0; padding:6px 10px;"><i class="fa-solid fa-trash"></i></button>
                </div>
              </td>
            </tr>
          `).join('')}
          ${liveClasses.length === 0 ? '<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:20px;">No live classes scheduled for this batch yet.</td></tr>' : ''}
        </tbody>
      </table>
    `;
  },

  _renderBatchAnnouncements: function (batch) {
    const announcements = window.db.getAnnouncementsByBatchOrCourse(batch.courseId, batch.id).filter(a => a.batchId === batch.id);
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h3 style="font-size:1rem; font-weight:800; text-align:left; margin:0;">Post Announcement</h3>
      </div>
      <form id="form-batch-announcement" style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px; margin-bottom:20px; text-align:left;">
        <div class="form-group" style="margin-bottom:10px;">
          <label style="font-weight:600; font-size:0.8rem;">Title *</label>
          <input type="text" id="ann-title" class="form-control" placeholder="e.g. Schedule Change for Friday" required style="font-family:inherit;">
        </div>
        <div class="form-group" style="margin-bottom:12px;">
          <label style="font-weight:600; font-size:0.8rem;">Content *</label>
          <textarea id="ann-content" class="form-control" rows="3" placeholder="Write announcement details here..." required style="font-family:inherit; resize:vertical;"></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-sm"><i class="fa-solid fa-paper-plane"></i> Post Announcement</button>
      </form>
      
      <h3 style="font-size:0.9rem; font-weight:800; margin-bottom:12px; text-align:left;">Past Announcements</h3>
      <div style="display:flex; flex-direction:column; gap:12px;">
        ${announcements.map(ann => `
          <div style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:12px; padding:16px; text-align:left; position:relative;">
            <button onclick="TutorComponent._deleteBatchAnnouncement('${ann.id}')" style="position:absolute; right:12px; top:12px; background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:0.9rem;"><i class="fa-regular fa-trash-can"></i></button>
            <div style="font-weight:700; font-size:0.88rem; color:#0F172A; margin-bottom:4px;">${ann.title}</div>
            <div style="font-size:0.7rem; color:var(--text-muted); margin-bottom:8px;">${new Date(ann.createdAt).toLocaleDateString()}</div>
            <p style="font-size:0.82rem; color:var(--text-secondary); line-height:1.5; margin:0;">${ann.content}</p>
          </div>
        `).join('')}
        ${announcements.length === 0 ? '<p style="color:var(--text-muted); font-size:0.8rem; font-style:italic; text-align:left;">No announcements posted for this batch yet.</p>' : ''}
      </div>
    `;
  },

  _renderBatchAssignments: function (batch) {
    const assignments = window.db.getAssignmentsByBatchOrCourse(batch.courseId, batch.id).filter(a => a.batchId === batch.id);
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h3 style="font-size:1rem; font-weight:800; text-align:left; margin:0;">Create Assignment</h3>
      </div>
      <form id="form-batch-assignment" style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px; margin-bottom:20px; text-align:left;">
        <div style="display:grid; grid-template-columns:2fr 1fr 1fr; gap:12px; margin-bottom:10px;">
          <div class="form-group" style="margin-bottom:0;">
            <label style="font-weight:600; font-size:0.8rem;">Assignment Title *</label>
            <input type="text" id="asg-title" class="form-control" placeholder="e.g. Sculpting Exercises" required style="font-family:inherit;">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label style="font-weight:600; font-size:0.8rem;">Max Points *</label>
            <input type="number" id="asg-points" class="form-control" value="100" required style="font-family:inherit;">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label style="font-weight:600; font-size:0.8rem;">Due Date *</label>
            <input type="date" id="asg-due" class="form-control" required style="font-family:inherit;">
          </div>
        </div>
        <div class="form-group" style="margin-bottom:12px;">
          <label style="font-weight:600; font-size:0.8rem;">Description *</label>
          <textarea id="asg-desc" class="form-control" rows="3" placeholder="Provide detailed guidelines for submission..." required style="font-family:inherit; resize:vertical;"></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-sm"><i class="fa-solid fa-plus"></i> Create Assignment</button>
      </form>
      
      <h3 style="font-size:0.9rem; font-weight:800; margin-bottom:12px; text-align:left;">Current Assignments</h3>
      <div style="display:flex; flex-direction:column; gap:12px;">
        ${assignments.map(asg => `
          <div style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:12px; padding:16px; text-align:left; position:relative;">
            <button onclick="TutorComponent._deleteBatchAssignment('${asg.id}')" style="position:absolute; right:12px; top:12px; background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:0.9rem;"><i class="fa-regular fa-trash-can"></i></button>
            <div style="font-weight:700; font-size:0.88rem; color:#0F172A; margin-bottom:4px;">${asg.title}</div>
            <div style="font-size:0.72rem; margin-bottom:8px;"><span style="color:var(--text-muted);">Due: ${asg.dueDate}</span> &middot; <span style="font-weight:600; color:#3D46D8;">Max Points: ${asg.maxPoints}</span></div>
            <p style="font-size:0.82rem; color:var(--text-secondary); line-height:1.5; margin:0;">${asg.description}</p>
          </div>
        `).join('')}
        ${assignments.length === 0 ? '<p style="color:var(--text-muted); font-size:0.8rem; font-style:italic; text-align:left;">No assignments posted for this batch yet.</p>' : ''}
      </div>
    `;
  },

  _renderBatchResources: function (batch) {
    const resources = window.db.getResourcesByBatchOrCourse(batch.courseId, batch.id).filter(r => r.batchId === batch.id);
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h3 style="font-size:1rem; font-weight:800; text-align:left; margin:0;">Share Resource Link</h3>
      </div>
      <form id="form-batch-resource" style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px; margin-bottom:20px; text-align:left;">
        <div style="display:grid; grid-template-columns:1fr 2fr; gap:12px; margin-bottom:12px;">
          <div class="form-group" style="margin-bottom:0;">
            <label style="font-weight:600; font-size:0.8rem;">Resource Name *</label>
            <input type="text" id="res-title" class="form-control" placeholder="e.g. Keyboard Shortcuts PDF" required style="font-family:inherit;">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label style="font-weight:600; font-size:0.8rem;">Resource URL *</label>
            <input type="url" id="res-url" class="form-control" placeholder="https://drive.google.com/..." required style="font-family:inherit;">
          </div>
        </div>
        <button type="submit" class="btn btn-primary btn-sm"><i class="fa-solid fa-link"></i> Add Resource Link</button>
      </form>
      
      <h3 style="font-size:0.9rem; font-weight:800; margin-bottom:12px; text-align:left;">Shared Resources</h3>
      <div style="display:flex; flex-direction:column; gap:10px;">
        ${resources.map(res => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:12px; position:relative;">
            <span style="font-size:0.85rem; font-weight:600; text-align:left;"><i class="fa-solid fa-link" style="color:var(--brand-blue); margin-right:8px;"></i> <a href="${res.url}" target="_blank" style="color:inherit; text-decoration:none;">${res.title}</a></span>
            <div style="display:flex; gap:8px; align-items:center;">
              <a href="${res.url}" target="_blank" class="btn btn-outline-white btn-xs" style="text-decoration:none; margin:0;">Open</a>
              <button class="btn btn-danger btn-xs" onclick="TutorComponent._deleteBatchResource('${res.id}')" style="margin:0; padding:6px 10px;"><i class="fa-regular fa-trash-can"></i></button>
            </div>
          </div>
        `).join('')}
        ${resources.length === 0 ? '<p style="color:var(--text-muted); font-size:0.8rem; font-style:italic; text-align:left;">No resources shared for this batch yet.</p>' : ''}
      </div>
    `;
  },

  _bindBatchesEvents: function () {
    document.getElementById('t-whatsapp-form')?.addEventListener('submit', e => {
      e.preventDefault();
      const linkVal = document.getElementById('t-whatsapp-link-input').value.trim();
      const batch = window.db.getBatchById(TutorComponent._openBatchId);
      if (!batch) return;

      if (linkVal !== '') {
        const waRegex = /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+$/;
        if (!waRegex.test(linkVal)) {
          window.app.showToast('Invalid WhatsApp Group invite link. Must start with https://chat.whatsapp.com/', 'danger');
          return;
        }
      }

      batch.whatsappLink = linkVal;
      const res = window.db.saveBatch(batch);
      if (res.success) {
        window.app.showToast('WhatsApp invite link updated successfully! 💬', 'success');
        TutorComponent._refreshBatchesTab();
      } else {
        window.app.showToast(res.error || 'Failed to update WhatsApp link.', 'danger');
      }
    });

    document.getElementById('att-date-input')?.addEventListener('change', e => {
      TutorComponent._attendanceDate = e.target.value;
      TutorComponent._refreshBatchesTab();
    });

    document.getElementById('btn-save-attendance')?.addEventListener('click', () => {
      const records = {};
      document.querySelectorAll('.att-student-select').forEach(select => {
        const student = select.getAttribute('data-student');
        records[student] = select.value;
      });

      const res = window.db.saveAttendance(TutorComponent._openBatchId, TutorComponent._attendanceDate, records);
      if (res.success) {
        window.app.showToast('Attendance records saved! 📝', 'success');
        TutorComponent._refreshBatchesTab();
      } else {
        window.app.showToast(res.error || 'Failed to save attendance.', 'danger');
      }
    });

    document.getElementById('btn-add-batch-live')?.addEventListener('click', () => {
      TutorComponent._showBatchLiveClassModal();
    });

    document.getElementById('form-batch-announcement')?.addEventListener('submit', e => {
      e.preventDefault();
      const title = document.getElementById('ann-title').value.trim();
      const content = document.getElementById('ann-content').value.trim();
      const cu = window.db.getCurrentUser();

      const res = window.db.saveAnnouncement({
        id: `AN-${Math.floor(100000 + Math.random() * 900000)}`,
        batchId: TutorComponent._openBatchId,
        courseId: window.db.getBatchById(TutorComponent._openBatchId).courseId,
        title,
        content,
        author: cu.name,
        createdAt: new Date().toISOString()
      });

      if (res.success) {
        window.app.showToast('Announcement posted! 📢', 'success');
        TutorComponent._refreshBatchesTab();
      } else {
        window.app.showToast(res.error || 'Failed to post announcement.', 'danger');
      }
    });

    document.getElementById('form-batch-assignment')?.addEventListener('submit', e => {
      e.preventDefault();
      const title = document.getElementById('asg-title').value.trim();
      const maxPoints = parseInt(document.getElementById('asg-points').value) || 100;
      const dueDate = document.getElementById('asg-due').value;
      const description = document.getElementById('asg-desc').value.trim();

      const res = window.db.saveAssignment({
        id: `AS-${Math.floor(100000 + Math.random() * 900000)}`,
        batchId: TutorComponent._openBatchId,
        courseId: window.db.getBatchById(TutorComponent._openBatchId).courseId,
        title,
        maxPoints,
        dueDate,
        description,
        createdAt: new Date().toISOString()
      });

      if (res.success) {
        window.app.showToast('Assignment created! 📝', 'success');
        TutorComponent._refreshBatchesTab();
      } else {
        window.app.showToast(res.error || 'Failed to create assignment.', 'danger');
      }
    });

    document.getElementById('form-batch-resource')?.addEventListener('submit', e => {
      e.preventDefault();
      const title = document.getElementById('res-title').value.trim();
      const url = document.getElementById('res-url').value.trim();

      const res = window.db.saveResource({
        id: `RS-${Math.floor(100000 + Math.random() * 900000)}`,
        batchId: TutorComponent._openBatchId,
        courseId: window.db.getBatchById(TutorComponent._openBatchId).courseId,
        title,
        url,
        createdAt: new Date().toISOString()
      });

      if (res.success) {
        window.app.showToast('Resource link shared! 🔗', 'success');
        TutorComponent._refreshBatchesTab();
      } else {
        window.app.showToast(res.error || 'Failed to add resource.', 'danger');
      }
    });
  },

  _refreshBatchesTab: function () {
    const cu = window.db.getCurrentUser();
    document.getElementById('tutor-main-content').innerHTML = TutorComponent._renderBatches(cu);
    TutorComponent._bindBatchesEvents();
  },

  _deleteBatchAnnouncement: function (id) {
    if (!confirm('Delete this announcement?')) return;
    const res = window.db.deleteAnnouncement(id);
    if (res.success) {
      window.app.showToast('Announcement deleted.', 'success');
      TutorComponent._refreshBatchesTab();
    } else {
      window.app.showToast(res.error || 'Failed to delete announcement.', 'danger');
    }
  },

  _deleteBatchAssignment: function (id) {
    if (!confirm('Delete this assignment?')) return;
    const res = window.db.deleteAssignment(id);
    if (res.success) {
      window.app.showToast('Assignment deleted.', 'success');
      TutorComponent._refreshBatchesTab();
    } else {
      window.app.showToast(res.error || 'Failed to delete assignment.', 'danger');
    }
  },

  _deleteBatchResource: function (id) {
    if (!confirm('Delete this resource?')) return;
    const res = window.db.deleteResource(id);
    if (res.success) {
      window.app.showToast('Resource deleted.', 'success');
      TutorComponent._refreshBatchesTab();
    } else {
      window.app.showToast(res.error || 'Failed to delete resource.', 'danger');
    }
  },

  _showBatchLiveClassModal: function (lcId = null) {
    const cu = window.db.getCurrentUser();
    const batch = window.db.getBatchById(TutorComponent._openBatchId);
    if (!batch) return;

    const lc = lcId ? window.db.getLiveClassById(lcId) : null;

    const overlay = document.createElement('div');
    overlay.className = 'tutor-modal-overlay';
    overlay.id = 'batch-live-class-modal';
    overlay.innerHTML = `
      <div class="tutor-modal" style="max-width: 500px; text-align:left;">
        <h3><i class="fa-solid fa-video" style="color:var(--brand-blue);margin-right:8px;"></i>${lcId ? 'Edit Live Class' : 'Schedule Live Class'}</h3>
        <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:14px;">
          For batch: <strong>${batch.name}</strong>
        </p>
        <form id="form-batch-live-class">
          <div class="form-group" style="margin-bottom:14px;">
            <label>Title *</label>
            <input type="text" id="bt-lc-title" required value="${lc ? lc.title : ''}" placeholder="e.g. Sculpting Q&A Session" style="font-family:inherit;">
          </div>
          <div class="form-group" style="margin-bottom:14px;">
            <label>Description</label>
            <textarea id="bt-lc-desc" style="min-height:70px; resize:vertical; font-family:inherit;">${lc ? lc.description : ''}</textarea>
          </div>
          <div style="display:grid; grid-template-columns: 2fr 1fr 1fr; gap:12px; margin-bottom:14px;">
            <div class="form-group" style="margin-bottom:0;">
              <label>Date *</label>
              <input type="date" id="bt-lc-date" required value="${lc ? lc.date : ''}" style="font-family:inherit;">
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label>Start Time *</label>
              <input type="time" id="bt-lc-start" required value="${lc ? lc.start_time : ''}" style="font-family:inherit;">
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label>End Time *</label>
              <input type="time" id="bt-lc-end" required value="${lc ? lc.end_time : ''}" style="font-family:inherit;">
            </div>
          </div>
          <div class="form-group" style="margin-bottom:14px;">
            <label style="display:flex; justify-content:space-between; align-items:center;">
              <span>Google Meet Link *</span>
              <button type="button" class="btn btn-outline-white btn-sm" id="btn-batch-gen-meet" style="padding: 2px 8px; font-size: 0.72rem; height: auto; margin:0;"><i class="fa-solid fa-wand-magic-sparkles"></i> Generate Link</button>
            </label>
            <input type="url" id="bt-lc-link" required value="${lc ? lc.meet_link : (batch.googleMeetLink || '')}" placeholder="https://meet.google.com/xxx-xxxx-xxx" style="font-family:inherit;">
          </div>
          <div class="form-group" style="margin-bottom:20px;">
            <label>Status</label>
            <select id="bt-lc-status" style="width:100%; font-family:inherit;">
              <option value="published" ${lc && lc.status === 'published' ? 'selected' : ''}>Published (Visible to students)</option>
              <option value="draft" ${lc && lc.status === 'draft' ? 'selected' : ''}>Draft</option>
            </select>
          </div>
          <div style="display:flex; gap:10px; justify-content:flex-end;">
            <button type="button" class="btn btn-secondary btn-modal-cancel" onclick="document.getElementById('batch-live-class-modal').remove()" style="margin:0; padding:10px 20px;">Cancel</button>
            <button type="submit" class="btn btn-primary" style="margin:0; padding:10px 20px;">${lcId ? 'Save Changes' : 'Schedule'}</button>
          </div>
        </form>
      </div>
    `;

    overlay.querySelector('#btn-batch-gen-meet').addEventListener('click', () => {
      const code = Math.random().toString(36).substring(2, 5) + "-" + Math.random().toString(36).substring(2, 6) + "-" + Math.random().toString(36).substring(2, 5);
      overlay.querySelector('#bt-lc-link').value = `https://meet.google.com/${code}`;
    });

    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

    overlay.querySelector('#form-batch-live-class').addEventListener('submit', e => {
      e.preventDefault();
      const title = overlay.querySelector('#bt-lc-title').value.trim();
      const description = overlay.querySelector('#bt-lc-desc').value.trim();
      const date = overlay.querySelector('#bt-lc-date').value;
      const start_time = overlay.querySelector('#bt-lc-start').value;
      const end_time = overlay.querySelector('#bt-lc-end').value;
      const meet_link = overlay.querySelector('#bt-lc-link').value;
      const status = overlay.querySelector('#bt-lc-status').value;

      const liveClassData = {
        course_id: batch.courseId,
        batch_id: batch.id,
        module_id: 0,
        tutor_id: cu.username,
        title,
        description,
        date,
        start_time,
        end_time,
        meet_link,
        status
      };
      if (lcId) liveClassData.id = lcId;

      const res = window.db.saveLiveClass(liveClassData);
      if (res) {
        window.app.showToast(lcId ? 'Live class updated! ✅' : 'Live class created! 🚀', 'success');
        overlay.remove();
        TutorComponent._refreshBatchesTab();
      } else {
        window.app.showToast('Failed to save live class.', 'danger');
      }
    });

    document.body.appendChild(overlay);
  },

  _editBatchLiveClass: function (id) {
    TutorComponent._showBatchLiveClassModal(id);
  },

  _deleteBatchLiveClass: function (id) {
    if (!confirm('Delete this live class?')) return;
    const res = window.db.deleteLiveClass(id);
    if (res.success) {
      window.app.showToast('Live class deleted.', 'success');
      TutorComponent._refreshBatchesTab();
    } else {
      window.app.showToast('Failed to delete live class.', 'danger');
    }
  },

  _renderCommonMeetings: function (cu) {
    const meetings = window.db.getCommonMeetingsForUser(cu.username);

    // Group by status
    const live = meetings.filter(m => m.status === 'Live Now');
    const upcoming = meetings.filter(m => m.status === 'Upcoming');
    const completed = meetings.filter(m => m.status === 'Completed');

    // Helper to render meeting cards
    const renderCard = (m) => {
      let actionHtml = '';
      if (m.status === 'Live Now') {
        actionHtml = `
          <a href="${m.meetLink}" target="_blank" class="btn btn-success btn-block" style="background:#10B981; border-color:#10B981; color:#fff; font-weight:800; font-size:1rem; padding:12px; margin-top:16px; display:flex; align-items:center; justify-content:center; gap:8px;">
            <i class="fa-solid fa-video"></i> Join Meeting Now
          </a>
        `;
      } else if (m.status === 'Upcoming') {
        actionHtml = `
          <div class="cm-countdown-box" data-date="${m.date}T${m.startTime}" style="background:var(--bg-secondary); border:1.5px solid var(--border-color); border-radius:10px; padding:10px; margin-top:16px; text-align:center; font-weight:700; color:var(--brand-blue); font-size:0.9rem;">
            Starts in: <span class="cm-timer">Calculating...</span>
          </div>
        `;
      } else if (m.status === 'Completed') {
        actionHtml = m.recordingLink
          ? `<a href="${m.recordingLink}" target="_blank" class="btn btn-outline btn-block" style="margin-top:16px; display:flex; align-items:center; justify-content:center; gap:8px;">
               <i class="fa-solid fa-play"></i> Watch Recording
             </a>`
          : `<div style="font-size:0.75rem; color:var(--text-muted); margin-top:16px; text-align:center; font-style:italic;">No recording available</div>`;
      }

      return `
        <div class="glass-panel" style="padding:20px; display:flex; flex-direction:column; justify-content:space-between; height:100%; border:1px solid var(--border-color); text-align:left; background:var(--bg-card);">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted);">${m.hostName} (Host)</span>
              <span class="status-badge ${m.status === 'Live Now' ? 'success' : (m.status === 'Upcoming' ? 'warning' : 'info')}" style="font-size:0.7rem; padding:2px 8px;">${m.status}</span>
            </div>
            <h3 style="margin:0 0 8px 0; font-size:1.05rem; font-weight:800; color:var(--text-primary); line-height:1.3;">${m.title}</h3>
            <p style="font-size:0.83rem; color:var(--text-secondary); line-height:1.5; margin:0 0 16px 0; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">${m.description || 'No agenda details provided.'}</p>
          </div>
          
          <div style="border-top:1px solid var(--border-color); padding-top:12px; margin-top:auto;">
            <div style="display:flex; align-items:center; gap:8px; font-size:0.8rem; color:var(--text-secondary); margin-bottom:4px;">
              <i class="fa-regular fa-calendar-days" style="color:var(--brand-blue);"></i>
              <span>Date: <strong>${m.date}</strong></span>
            </div>
            <div style="display:flex; align-items:center; gap:8px; font-size:0.8rem; color:var(--text-secondary); margin-bottom:4px;">
              <i class="fa-regular fa-clock" style="color:var(--brand-blue);"></i>
              <span>Time: <strong>${m.startTime} - ${m.endTime}</strong></span>
            </div>
            ${m.password ? `
              <div style="display:flex; align-items:center; gap:8px; font-size:0.8rem; color:var(--text-secondary); margin-bottom:4px;">
                <i class="fa-solid fa-lock" style="color:var(--brand-blue);"></i>
                <span>Password: <strong>${m.password}</strong></span>
              </div>
            ` : ''}
            ${m.googleDriveResources ? `
              <div style="display:flex; align-items:center; gap:8px; font-size:0.8rem; color:var(--text-secondary); margin-bottom:4px;">
                <i class="fa-solid fa-link" style="color:var(--brand-blue);"></i>
                <span>Resources: <a href="${m.googleDriveResources}" target="_blank" style="color:var(--brand-blue); text-decoration:none; font-weight:700;">Open Folder</a></span>
              </div>
            ` : ''}
            ${actionHtml}
          </div>
        </div>
      `;
    };

    // Trigger timer update
    setTimeout(() => {
      TutorComponent._startCommonMeetingTimers();
    }, 100);

    return `
      <div class="dashboard-welcome">
        <h2>Common Meetings</h2>
        <p>Participate in orientation events, webinars, guest lectures, and academy updates.</p>
      </div>

      <!-- Live Meetings Section -->
      ${live.length > 0 ? `
        <div style="margin-top:28px;">
          <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-primary); margin-bottom:16px; display:flex; align-items:center; gap:8px; text-align:left;">
            <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#10B981; box-shadow:0 0 10px #10B981; animation:pulse 1.5s infinite;"></span>
            Live Meetings (${live.length})
          </h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:20px;">
            ${live.map(m => renderCard(m)).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Upcoming Meetings Section -->
      <div style="margin-top:28px;">
        <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-primary); margin-bottom:16px; text-align:left;">Upcoming Meetings (${upcoming.length})</h3>
        ${upcoming.length === 0 ? `
          <div class="glass-panel" style="padding:32px; text-align:center; color:var(--text-muted); background:var(--bg-card); border:1px solid var(--border-color);">No upcoming common meetings scheduled. Check back later!</div>
        ` : `
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:20px;">
            ${upcoming.map(m => renderCard(m)).join('')}
          </div>
        `}
      </div>

      <!-- Completed Meetings Section -->
      <div style="margin-top:28px;">
        <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-primary); margin-bottom:16px; text-align:left;">Completed Meetings (${completed.length})</h3>
        ${completed.length === 0 ? `
          <div class="glass-panel" style="padding:32px; text-align:center; color:var(--text-muted); background:var(--bg-card); border:1px solid var(--border-color);">No completed meetings records found.</div>
        ` : `
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:20px;">
            ${completed.map(m => renderCard(m)).join('')}
          </div>
        `}
      </div>
    `;
  },

  _startCommonMeetingTimers: function () {
    if (TutorComponent._cmIntervalId) clearInterval(TutorComponent._cmIntervalId);

    const updateTimers = () => {
      document.querySelectorAll('.cm-countdown-box').forEach(box => {
        const targetDate = new Date(box.getAttribute('data-date'));
        const now = new Date();
        const diff = targetDate - now;

        const timerSpan = box.querySelector('.cm-timer');
        if (!timerSpan) return;

        if (diff <= 0) {
          timerSpan.innerHTML = '<span style="color:#10B981;">Live Now! Reload page</span>';
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);

          let display = '';
          if (hours > 0) display += `${hours}h `;
          display += `${mins}m ${secs}s`;
          timerSpan.textContent = display;
        }
      });
    };

    updateTimers();
    TutorComponent._cmIntervalId = setInterval(updateTimers, 1000);
  }
};
window.TutorComponent = TutorComponent;
