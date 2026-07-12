// Cubaze Academy — Video Player Redesign v4.2 (components/videoplayer.js)
const VideoPlayerComponent = {
  _activeTab: 'overview',
  _focusMode: false,
  _searchQuery: '',
  _expandedModules: {},
  _currentPlaybackTime: 0,
  _playbackRate: 1,
  _notesSearchQuery: '',
  _pinnedNotes: {},

  render: function (courseId, lessonId) {
    const cu = window.db.getCurrentUser();
    if (!cu) return `<div class="container" style="text-align:center;padding:100px 0;"><h2>Please Login</h2><p style="margin:16px 0;">Login to access course lessons.</p><button class="btn btn-primary" onclick="window.app.showAuthModal(true)">Login</button></div>`;

    const course = window.db.getCourseById(courseId);
    if (!course) return `<div class="container" style="text-align:center;padding:100px 0;"><h2>Course Not Found</h2><a href="#/courses" class="btn btn-primary" style="margin-top:16px;">Browse Courses</a></div>`;

    const enrolled = cu.enrolledCourses || [];
    if (!enrolled.includes(courseId)) return `
      <div class="container" style="text-align:center;padding:100px 0;">
        <div style="font-size:4rem;margin-bottom:16px;">🔒</div>
        <h2>Not Enrolled</h2>
        <p style="margin:16px 0;color:var(--text-secondary);">Purchase this course to access all lessons.</p>
        <a href="#/course/${courseId}" class="btn btn-primary">View Course Details</a>
      </div>
    `;

    const progress = window.db.getUserProgress(cu.username, courseId);
    const completedLessons = progress.completedLessons || [];

    // Batch details
    const enrolledBatches = cu.enrolledBatches || {};
    const batchId = enrolledBatches[courseId];
    const batch = batchId ? window.db.getBatchById(batchId) : null;
    const isBatchActive = batch && (batch.status === 'Active' || batch.status === 'Completed');
    
    const announcements = window.db.getAnnouncementsByBatchOrCourse(courseId, batchId);
    const assignments = window.db.getAssignmentsByBatchOrCourse(courseId, batchId);
    const resources = window.db.getResourcesByBatchOrCourse(courseId, batchId);

    const lockedTabHtml = `
      <div style="text-align:center; padding:36px 20px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:16px; max-width:500px; margin:20px auto;">
        <div style="font-size:2.5rem; margin-bottom:12px;">🔒</div>
        <h4 style="font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:6px;">Section Locked</h4>
        <p style="font-size:0.83rem; color:var(--text-secondary); line-height:1.5; margin-bottom:0;">
          This batch is currently in the <strong>${batch ? batch.status : 'Enrollment Open'}</strong> state. Announcements, resources, and assignments will unlock automatically once the batch becomes <strong>Active</strong>.
        </p>
      </div>
    `;

    let batchOverviewHtml = '';
    if (batch) {
      if (isBatchActive) {
        // Calculate attendance
        const studentAtt = window.db.getAttendance(batch.id).filter(a => a.username === cu.username);
        const presentCount = studentAtt.filter(a => a.status === 'Present' || a.status === 'PRESENT' || a.status === 'LATE').length;
        const totalAtt = studentAtt.length;
        const attPct = totalAtt > 0 ? Math.round((presentCount / totalAtt) * 100) : 100;

        batchOverviewHtml = `
          <div style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:12px; padding:16px; margin-bottom:20px; display:flex; flex-direction:column; gap:10px; text-align:left;">
            <h4 style="margin:0; font-size:0.9rem; font-weight:700; color:var(--text-primary); display:flex; align-items:center; gap:6px;"><i class="fa-solid fa-circle-check" style="color:var(--success);"></i> Active Batch: ${batch.name}</h4>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:0.8rem; color:var(--text-secondary);">
              <div>Schedule: <strong>${batch.classTime || '—'} (${(batch.classDays || []).join(', ') || '—'})</strong></div>
              <div>Attendance: <strong>${totalAtt > 0 ? `${presentCount}/${totalAtt} (${attPct}%)` : 'No classes recorded yet'}</strong></div>
              <div>Start Date: <strong>${batch.startDate}</strong></div>
              <div>End Date: <strong>${batch.endDate}</strong></div>
            </div>
            ${batch.whatsappLink ? `
              <a href="${batch.whatsappLink}" target="_blank" style="align-self:flex-start; background:#25D366; color:#fff; border:none; padding:8px 14px; border-radius:8px; font-size:0.8rem; font-weight:700; text-decoration:none; display:flex; align-items:center; gap:6px;">
                <i class="fa-brands fa-whatsapp" style="font-size:0.95rem;"></i> Join WhatsApp Group
              </a>
            ` : ''}
          </div>
        `;
      } else {
        const availableSeats = batch.maxStudents - (batch.currentEnrollment || 0);
        batchOverviewHtml = `
          <div style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:12px; padding:16px; margin-bottom:20px; text-align:left;">
            <h4 style="margin:0; font-size:0.9rem; font-weight:700; color:var(--text-primary); display:flex; align-items:center; gap:6px; margin-bottom:6px;"><i class="fa-solid fa-lock" style="color:var(--warning);"></i> Batch: ${batch.name} (${batch.status})</h4>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:6px;">Available Seats: <strong>${availableSeats} available</strong> (Enrolled: ${batch.currentEnrollment || 0} / ${batch.maxStudents})</div>
            <p style="margin:0; font-size:0.78rem; color:var(--text-secondary); line-height:1.4;">
              Your batch is currently in <strong>${batch.status}</strong> status. Schedule, tutor, assignments, and WhatsApp group will be available once the batch is Activated.
            </p>
          </div>
        `;
      }
    }

    // Find current lesson and module
    let currentLesson = null, currentModule = null;
    let allLessons = [];
    course.modules.forEach(mod => {
      mod.lessons.forEach(les => {
        allLessons.push({ ...les, moduleTitle: mod.title, moduleId: mod.id });
        if (les.id === lessonId) {
          currentLesson = les;
          currentModule = mod;
        }
      });
    });
    if (!currentLesson) {
      currentLesson = allLessons[0];
      currentModule = course.modules[0];
    }

    // Expand current module by default
    if (this._expandedModules[currentModule.id] === undefined) {
      this._expandedModules[currentModule.id] = true;
    }

    const currentIdx = allLessons.findIndex(l => l.id === currentLesson.id);
    const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
    const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;
    const isCompleted = completedLessons.includes(currentLesson.id);

    const totalCount = allLessons.length;
    const completedCount = completedLessons.length;
    const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Course Right Sidebar curriculum accordion HTML
    const rightCurriculumHtml = course.modules.map((mod, modIdx) => {
      const isExpanded = this._expandedModules[mod.id] !== false;
      
      // Calculate module duration
      let modMinutes = 0;
      mod.lessons.forEach(les => {
        const parts = (les.duration || "10:00").split(":");
        modMinutes += parseInt(parts[0]) || 10;
      });
      const modDurationStr = modMinutes >= 60 
        ? `${Math.floor(modMinutes/60)}h ${modMinutes%60}m` 
        : `${modMinutes}m`;

      const lessonsHtml = mod.lessons.map(les => {
        const done = completedLessons.includes(les.id);
        const active = les.id === currentLesson.id;
        return `
          <div class="crs-right-lesson-item ${active ? 'active' : ''} ${done ? 'completed' : ''}" data-lesson-id="${les.id}">
            <div class="crs-r-li-left">
              <i class="fa-solid ${done ? 'fa-circle-check checked-icon' : active ? 'fa-circle-play active-icon' : 'fa-play play-icon'}"></i>
              <span class="crs-r-lesson-title">${les.title}</span>
            </div>
            <span class="crs-r-lesson-duration">${les.duration}</span>
          </div>
        `;
      }).join('');

      return `
        <div class="crs-right-module-card ${isExpanded ? 'expanded' : ''}" data-module-id="${mod.id}">
          <div class="crs-right-module-header">
            <div class="crs-r-mh-left">
              <span class="crs-r-module-prefix">${(modIdx+1).toString().padStart(2,'0')}:</span>
              <span class="crs-r-module-title">${mod.title}</span>
            </div>
            <div class="crs-r-mh-right">
              <span class="crs-r-module-dur">${modDurationStr}</span>
              <i class="fa-solid fa-chevron-down crs-r-chevron"></i>
            </div>
          </div>
          <div class="crs-right-lessons-list">
            ${lessonsHtml}
          </div>
        </div>
      `;
    }).join('');

    const fallbackVideo = course.previewVideo || "https://www.youtube.com/embed/dQw4w9WgXcQ";
    const embedUrl = this._getYouTubeEmbedUrl(currentLesson.videoUrl, fallbackVideo);

    // Notes HTML
    const savedNotes = JSON.parse(localStorage.getItem(`cubaze_sticky_notes_${courseId}_${currentLesson.id}`)) || [];
    const filteredNotes = savedNotes.filter(n => 
      n.text.toLowerCase().includes(this._notesSearchQuery.toLowerCase())
    );
    filteredNotes.sort((a, b) => (this._pinnedNotes[b.id] ? 1 : 0) - (this._pinnedNotes[a.id] ? 1 : 0));

    const notesCardsHtml = filteredNotes.map(n => {
      const isPinned = this._pinnedNotes[n.id] === true;
      return `
        <div class="sticky-note-card ${isPinned ? 'pinned' : ''}" style="background:${n.color || '#FFF9C4'}; text-align: left;">
          <div class="sticky-note-header">
            <span class="sticky-note-timestamp" onclick="VideoPlayerComponent.seekToTime(${n.seconds})">
              <i class="fa-regular fa-clock"></i> ${n.timestamp}
            </span>
            <div style="display:flex; gap:6px;">
              <button class="btn-note-action" onclick="VideoPlayerComponent.togglePinNote('${n.id}')" title="${isPinned ? 'Unpin' : 'Pin'}">
                <i class="fa-${isPinned ? 'solid' : 'regular'} fa-thumbtack"></i>
              </button>
              <button class="btn-note-action" onclick="VideoPlayerComponent.deleteNote('${courseId}','${currentLesson.id}','${n.id}')" title="Delete">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
          <div class="sticky-note-body">${n.text}</div>
        </div>
      `;
    }).join('');

    return `
      <style>
        /* ─── 3-COLUMN LMS WORKSPACE ─── */
        .lms-workspace {
          display: grid;
          grid-template-columns: 240px 1fr 360px;
          background: var(--bg-primary);
          min-height: calc(100vh - var(--header-height));
          color: var(--text-primary);
          font-family: 'Inter', 'Plus Jakarta Sans', sans-serif;
          max-width: 1600px;
          margin: 0 auto;
          padding: 24px;
          gap: 24px;
          box-sizing: border-box;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .lms-workspace.focus-mode {
          grid-template-columns: 0px 1fr 0px;
          gap: 0px;
          padding: 24px 0;
        }

        /* ─── LEFT SIDEBAR (Navigation Card) ─── */
        .lms-left-sidebar {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          height: calc(100vh - var(--header-height) - 48px);
          position: sticky;
          top: calc(var(--header-height) + 24px);
          padding: 24px 16px;
          box-sizing: border-box;
          z-index: 100;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          transition: all 0.3s ease;
        }

        .lms-brand-box {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          padding: 0 8px;
        }

        .lms-brand-logo {
          height: 28px;
          object-fit: contain;
        }
        .lms-brand-name {
          font-weight: 800;
          font-size: 1.1rem;
          color: var(--text-primary);
        }

        /* Profile card */
        .lms-profile-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          margin-bottom: 24px;
          cursor: pointer;
        }
        .lms-profile-info {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .lms-profile-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--brand-blue), var(--brand-blue-light));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 0.8rem;
          flex-shrink: 0;
        }
        .lms-profile-name {
          font-weight: 700;
          font-size: 0.83rem;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Left sidebar links */
        .lms-nav-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }
        .lms-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 10px;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.18s;
          cursor: pointer;
        }
        .lms-nav-item i {
          width: 16px;
          text-align: center;
          font-size: 0.88rem;
        }
        .lms-nav-item:hover {
          background: var(--bg-primary);
          color: var(--brand-blue);
        }
        .lms-nav-item.active {
          background: var(--brand-blue-pale);
          color: var(--brand-blue);
        }

        .lms-left-foot {
          display: flex;
          flex-direction: column;
          gap: 4px;
          border-top: 1px solid var(--border-color);
          padding-top: 16px;
        }

        /* ─── CENTER VIDEO WORKSPACE CARD ─── */
        .lms-center-content {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 28px 32px;
          overflow-y: auto;
          height: calc(100vh - var(--header-height) - 48px);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          position: sticky;
          top: calc(var(--header-height) + 24px);
        }

        /* Breadcrumbs */
        .lms-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .lms-breadcrumbs a {
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.15s;
        }
        .lms-breadcrumbs a:hover {
          color: var(--brand-blue);
        }

        /* Center header info row */
        .lms-center-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 16px;
        }
        .lms-ch-left {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .lms-course-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .lms-course-title-wrap h1 {
          font-size: 1.55rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
          letter-spacing: -0.02em;
        }
        .lms-level-badge {
          background: var(--brand-blue-pale);
          color: var(--brand-blue);
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .lms-stats-row {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 0.78rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .lms-stats-row span {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .lms-stats-row i {
          color: var(--brand-blue);
        }

        .lms-ch-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Large Video player wrapper with collapse protection */
        .lms-player-wrapper {
          width: 100%;
          aspect-ratio: 16/9;
          background: #000;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
          position: relative;
          flex-shrink: 0;
          min-height: 380px;
        }

        /* Tabs below video */
        .lms-tabs-nav {
          display: flex;
          gap: 8px;
          border-bottom: 1.5px solid var(--border-color);
          padding-bottom: 2px;
          margin-top: 10px;
        }
        .lms-tab-btn {
          padding: 10px 16px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
          background: transparent;
          border: none;
          cursor: pointer;
          position: relative;
          transition: color 0.2s;
        }
        .lms-tab-btn:hover {
          color: var(--brand-blue);
        }
        .lms-tab-btn.active {
          color: var(--brand-blue);
        }
        .lms-tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -2.5px;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--brand-blue);
          border-radius: 3px;
        }

        .lms-tab-content-panel {
          padding-top: 8px;
        }

        /* About Course detail contents */
        .lms-about-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
          text-align: left;
        }
        .lms-about-section h3 {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .lms-about-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin: 0;
        }
        .lms-learn-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 10px;
        }
        .lms-learn-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .lms-learn-item i {
          color: var(--success);
        }

        /* ─── RIGHT SIDEBAR (Curriculum Card) ─── */
        .lms-right-sidebar {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          height: calc(100vh - var(--header-height) - 48px);
          position: sticky;
          top: calc(var(--header-height) + 24px);
          padding: 24px 20px;
          box-sizing: border-box;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          transition: all 0.3s ease;
        }

        .lms-right-section-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 14px;
          text-align: left;
        }

        /* Accordion Cards */
        .crs-right-module-card {
          border: 1px solid var(--border-color);
          border-radius: 12px;
          margin-bottom: 10px;
          overflow: hidden;
          background: var(--bg-primary);
          transition: all 0.2s ease;
        }
        .crs-right-module-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          cursor: pointer;
          user-select: none;
          background: var(--bg-secondary);
          transition: background 0.15s;
        }
        .crs-right-module-header:hover {
          background: var(--bg-primary);
        }
        .crs-r-mh-left {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
        }
        .crs-r-module-prefix {
          font-family: monospace;
          font-weight: 700;
          color: var(--brand-blue);
          font-size: 0.85rem;
        }
        .crs-r-module-title {
          font-weight: 700;
          font-size: 0.82rem;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .crs-r-mh-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .crs-r-module-dur {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .crs-r-chevron {
          font-size: 0.72rem;
          color: var(--text-muted);
          transition: transform 0.2s;
        }
        .crs-right-module-card.expanded .crs-r-chevron {
          transform: rotate(180deg);
        }

        /* Lessons List under Module */
        .crs-right-lessons-list {
          display: none;
          border-top: 1px solid var(--border-color);
          background: var(--bg-secondary);
        }
        .crs-right-module-card.expanded .crs-right-lessons-list {
          display: block;
        }
        .crs-right-lesson-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 16px;
          cursor: pointer;
          font-size: 0.8rem;
          color: var(--text-secondary);
          transition: all 0.15s;
          border-bottom: 1px solid var(--bg-primary);
        }
        .crs-right-lesson-item:last-child {
          border-bottom: none;
        }
        .crs-right-lesson-item:hover {
          background: var(--bg-primary);
          color: var(--text-primary);
        }
        .crs-right-lesson-item.active {
          background: var(--brand-blue-pale);
          color: var(--brand-blue);
          font-weight: 700;
        }
        .crs-r-li-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          flex: 1;
        }
        .crs-r-lesson-title {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .crs-r-lesson-duration {
          font-size: 0.7rem;
          color: var(--text-muted);
          flex-shrink: 0;
        }
        .crs-right-lesson-item .checked-icon { color: var(--success); }
        .crs-right-lesson-item .active-icon { color: var(--brand-blue); }
        .crs-right-lesson-item .play-icon { color: var(--text-muted); }

        /* Author profile card */
        .crs-author-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 16px 18px;
          text-align: left;
        }
        .crs-author-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .crs-author-avatar-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .crs-author-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--brand-blue), var(--brand-blue-light));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 800;
          font-size: 0.95rem;
        }
        .crs-author-name {
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--text-primary);
        }
        .crs-author-role {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 1px;
        }
        .crs-author-rating {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--warning);
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .crs-author-bio {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        /* --- Notes Editor Styles --- */
        .glass-notes-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 20px;
        }

        .glass-editor-toolbar {
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .glass-editor-textarea {
          width: 100%;
          min-height: 120px;
          padding: 16px;
          border: none;
          outline: none;
          resize: vertical;
          font-size: 0.88rem;
          color: var(--text-primary);
          background: transparent;
          box-sizing: border-box;
          font-family: inherit;
        }

        .editor-tool-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1.5px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-secondary);
          font-size: 0.82rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          font-family: inherit;
          transition: all 0.2s;
          white-space: nowrap;
          padding: 0 8px;
        }

        .editor-tool-btn:hover {
          background: var(--bg-primary);
          border-color: var(--brand-blue);
          color: var(--brand-blue);
        }

        .notes-grid-layout {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }

        .sticky-note-card {
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.03);
          border: 1px solid rgba(0,0,0,0.02);
          position: relative;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.2s;
        }

        .sticky-note-card.pinned {
          border: 1.5px solid #F59E0B;
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.06);
        }

        .sticky-note-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.05);
        }

        .sticky-note-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.72rem;
          font-weight: 700;
          color: rgba(0,0,0,0.4);
        }

        .sticky-note-timestamp {
          cursor: pointer;
          background: rgba(0,0,0,0.05);
          padding: 2px 8px;
          border-radius: 20px;
        }

        .btn-note-action {
          background: transparent;
          border: none;
          color: rgba(0,0,0,0.3);
          cursor: pointer;
          font-size: 0.8rem;
          transition: color 0.2s;
        }

        .btn-note-action:hover {
          color: var(--brand-blue);
        }

        .sticky-note-body {
          font-size: 0.83rem;
          line-height: 1.5;
          color: #374151;
          flex-grow: 1;
          margin-top: 10px;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .lms-workspace {
            grid-template-columns: 220px 1fr;
          }
          .lms-right-sidebar {
            display: none;
          }
        }
        @media (max-width: 900px) {
          .lms-workspace {
            grid-template-columns: 1fr;
          }
          .lms-left-sidebar {
            display: none;
          }
        }
      </style>

      <div class="lms-workspace">
        <!-- 1. LEFT SIDEBAR (Global Navigation Menu) -->
        <aside class="lms-left-sidebar">
          <div class="lms-brand-box">
            <img src="cubaze-logo.png" alt="Cubaze Logo" class="lms-brand-logo">
            <span class="lms-brand-name">Cubaze</span>
          </div>

          <div class="lms-profile-card">
            <div class="lms-profile-info">
              <div class="lms-profile-avatar">${cu.name.charAt(0).toUpperCase()}</div>
              <div class="lms-profile-name">${cu.name}</div>
            </div>
            <i class="fa-solid fa-chevron-down" style="font-size:0.7rem; color:var(--text-muted);"></i>
          </div>

          <div class="lms-nav-list">
            <a href="#/dashboard" class="lms-nav-item"><i class="fa-solid fa-gauge"></i> Dashboard</a>
            <a href="#/courses" class="lms-nav-item active"><i class="fa-solid fa-graduation-cap"></i> Courses</a>
            <a href="#/blog" class="lms-nav-item"><i class="fa-solid fa-newspaper"></i> Blog</a>
            <a href="#/about" class="lms-nav-item"><i class="fa-solid fa-circle-info"></i> About Us</a>
          </div>

          <div class="lms-left-foot">
            <button class="lms-nav-item" onclick="VideoPlayerComponent._toggleFocusMode()" style="background:none; border:none; width:100%; text-align:left; font-family:inherit;"><i class="fa-solid fa-expand"></i> Focus Mode</button>
            <button class="lms-nav-item" onclick="document.body.classList.toggle('dark-mode'); window.app.showToast('Theme toggled!','info');" style="background:none; border:none; width:100%; text-align:left; font-family:inherit;"><i class="fa-solid fa-moon"></i> Dark Mode</button>
          </div>
        </aside>

        <!-- 2. CENTER CONTENT (Video & Info Workspace) -->
        <main class="lms-center-content">
          <!-- Breadcrumbs -->
          <div class="lms-breadcrumbs">
            <a href="#/">Home</a> / <a href="#/courses">Courses</a> / <a href="#/courses">${course.category || 'LMS'}</a> / <span>${course.title}</span>
          </div>

          <!-- Title & Controls Header -->
          <div class="lms-center-header">
            <div class="lms-ch-left">
              <div class="lms-course-title-wrap">
                <h1>${course.title}</h1>
                <span class="lms-level-badge">${course.level}</span>
              </div>
              <div class="lms-stats-row">
                <span><i class="fa-solid fa-circle-play"></i> ${totalCount} lessons</span>
                <span><i class="fa-solid fa-clock"></i> ${course.duration || '28 Hours'}</span>
                <span><i class="fa-solid fa-star"></i> ${course.rating} (${course.reviews ? course.reviews.length : 12} reviews)</span>
              </div>
            </div>
            <div class="lms-ch-right">
              <button class="btn btn-secondary btn-sm" onclick="window.app.showToast('Copied share link!','success')" style="margin-bottom:0;"><i class="fa-solid fa-share-nodes"></i> Share</button>
              <button id="btn-mark-complete" class="btn ${isCompleted ? 'btn-success' : 'btn-primary'} btn-sm" style="margin-bottom:0; font-weight:700;">
                <i class="fa-solid fa-${isCompleted ? 'circle-check' : 'circle-play'}"></i>
                <span>${isCompleted ? 'Completed' : 'Mark Complete'}</span>
              </button>
            </div>
          </div>

          <!-- Rounded Video Frame with collapse protection -->
          <div class="lms-player-wrapper">
            <iframe id="youtube-iframe-player" width="100%" height="100%" src="${embedUrl}?enablejsapi=1" title="YouTube Video Class" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="border:none; display:block;"></iframe>
          </div>

          <!-- Video playback controls / triggers -->
          <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:12px; padding:10px 16px;">
            ${prevLesson ? `<a href="#/lesson/${course.id}/${prevLesson.id}" class="btn btn-secondary btn-xs" style="margin-bottom:0;"><i class="fa-solid fa-arrow-left"></i> Previous</a>` : '<span></span>'}
            <div style="font-size:0.8rem; font-weight:700; color:var(--text-secondary);"><i class="fa-regular fa-clock"></i> Current Lesson: ${currentLesson.title}</div>
            ${nextLesson ? `<a href="#/lesson/${course.id}/${nextLesson.id}" class="btn btn-secondary btn-xs" style="margin-bottom:0;">Next <i class="fa-solid fa-arrow-right"></i></a>` : `<a href="#/quiz/${course.id}" class="btn btn-success btn-xs" style="margin-bottom:0;"><i class="fa-solid fa-trophy"></i> Start Quiz</a>`}
          </div>

          <!-- Tabs Navigation under player -->
          <div>
            <div class="lms-tabs-nav">
              ${[['overview','Overview'],['announcements',`Announcements (${announcements.length})`],['notes','Notes Editor'],['resources','Resources'],['discussion','QA Discussion'],['assignments','Assignments']].map(([tId, tName]) => `
                <button class="lms-tab-btn ${this._activeTab === tId ? 'active' : ''}" data-target-tab="${tId}">${tName}</button>
              `).join('')}
            </div>

            <!-- TAB VIEWS CONTENT -->
            <div class="lms-tab-content-panel">
              
              <!-- Tab: Overview -->
              <div class="tab-panel-viewport ${this._activeTab === 'overview' ? 'active' : ''}" id="tabpanel-overview">
                ${batchOverviewHtml}
                <div class="lms-about-section">
                  <h3>About Course</h3>
                  <p class="lms-about-desc">${course.description || course.shortDescription}</p>
                  
                  <h3 style="margin-top:12px;">What You'll Learn</h3>
                  <div class="lms-learn-grid">
                    ${(course.requirements || [
                      "Master essential user interface workflow techniques.",
                      "Understand modeling, materials, and rendering pipelines.",
                      "Complete real post-production exercises.",
                      "Build a professional portfolio."
                    ]).map(req => `
                      <div class="lms-learn-item">
                        <i class="fa-solid fa-circle-check"></i>
                        <span>${req}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>

              <!-- Tab: Notes Editor -->
              <div class="tab-panel-viewport ${this._activeTab === 'notes' ? 'active' : ''}" id="tabpanel-notes">
                <div class="glass-notes-card" style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:16px; padding:20px; box-shadow:none;">
                  <div style="background:var(--bg-primary); border:1.5px solid var(--border-color); border-radius:12px; overflow:hidden; margin-bottom:16px;">
                    <div class="glass-editor-toolbar" style="background:var(--bg-secondary); border-bottom:1px solid var(--border-color);">
                      <button class="editor-tool-btn" id="notes-btn-bold" title="Bold"><i class="fa-solid fa-bold"></i></button>
                      <button class="editor-tool-btn" id="notes-btn-italic" title="Italic"><i class="fa-solid fa-italic"></i></button>
                      <button class="editor-tool-btn" id="notes-btn-h1" title="Heading"><i class="fa-solid fa-heading"></i></button>
                      <button class="editor-tool-btn" id="notes-btn-stamp" title="Video Timestamp"><i class="fa-regular fa-clock" style="color:var(--brand-blue);"></i> TimeStamp</button>
                      <div style="flex:1;"></div>
                      <button class="btn btn-primary btn-sm" id="btn-save-glass-note" style="margin-bottom:0;"><i class="fa-solid fa-plus"></i> Save Note</button>
                    </div>
                    <textarea id="notes-editor-ta" class="glass-editor-textarea" style="color:var(--text-primary);" placeholder="Type study notes here... Stamp links to current playback position."></textarea>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; border-bottom:1px solid var(--border-color); padding-bottom:10px; margin-bottom:16px;">
                    <div style="font-weight:700; font-size:0.9rem; text-align: left;"><i class="fa-regular fa-sticky-note" style="color:var(--brand-blue); margin-right:6px;"></i> Lesson Notes (${savedNotes.length})</div>
                    <div style="display:flex; gap:10px;">
                      <input type="text" id="notes-search-input" placeholder="Search notes..." value="${this._notesSearchQuery}" style="padding:6px 12px; font-size:0.8rem; border:1px solid var(--border-color); border-radius:10px; outline:none; background:var(--bg-primary); color:var(--text-primary);">
                      <button class="btn btn-outline btn-sm" onclick="VideoPlayerComponent.exportNotes('${course.title}','${currentLesson.title}')"><i class="fa-solid fa-file-export"></i> Export</button>
                    </div>
                  </div>
                  <div class="notes-grid-layout">
                    ${notesCardsHtml || '<p style="color:var(--text-muted); font-size:0.8rem; font-style:italic; grid-column:1/-1;">No notes recorded for this lesson yet. Type one above to start!</p>'}
                  </div>
                </div>
              </div>

              <!-- Tab: Announcements -->
              <div class="tab-panel-viewport ${this._activeTab === 'announcements' ? 'active' : ''}" id="tabpanel-announcements">
                <h3 style="font-size:0.95rem; font-weight:800; margin-bottom:12px; text-align: left;">Batch Announcements</h3>
                ${!isBatchActive ? lockedTabHtml : `
                <div style="display:flex; flex-direction:column; gap:12px;">
                  ${announcements.map(ann => `
                    <div style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:12px; padding:16px; text-align: left;">
                      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <h4 style="margin:0; font-size:0.9rem; font-weight:700;">${ann.title}</h4>
                        <span style="font-size:0.72rem; color:var(--text-muted);">${new Date(ann.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p style="font-size:0.83rem; color:var(--text-secondary); margin:0; line-height:1.5;">${ann.content}</p>
                    </div>
                  `).join('')}
                  ${announcements.length === 0 ? '<p style="color:var(--text-muted); font-size:0.8rem; font-style:italic;">No announcements yet.</p>' : ''}
                </div>
                `}
              </div>

              <!-- Tab: Resources -->
              <div class="tab-panel-viewport ${this._activeTab === 'resources' ? 'active' : ''}" id="tabpanel-resources">
                <h3 style="font-size:0.95rem; font-weight:800; margin-bottom:12px; text-align: left;">Lesson Reference Material</h3>
                ${!isBatchActive ? lockedTabHtml : `
                <div style="display:flex; flex-direction:column; gap:10px;">
                  ${resources.map(res => `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:12px;">
                      <span style="font-size:0.85rem; font-weight:600; text-align: left;"><i class="fa-solid fa-link" style="color:var(--brand-blue); margin-right:8px;"></i> ${res.title}</span>
                      <a href="${res.url}" target="_blank" class="btn btn-secondary btn-sm" style="text-decoration:none; margin:0; line-height:1.8;">Open</a>
                    </div>
                  `).join('')}
                  ${resources.length === 0 ? '<p style="color:var(--text-muted); font-size:0.8rem; font-style:italic;">No resources shared for this batch yet.</p>' : ''}
                </div>
                `}
              </div>

              <!-- Tab: QA Discussion -->
              <div class="tab-panel-viewport ${this._activeTab === 'discussion' ? 'active' : ''}" id="tabpanel-discussion">
                <h3 style="font-size:0.95rem; font-weight:800; margin-bottom:12px; text-align: left;">QA discussion board</h3>
                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
                  <div style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:12px; padding:12px 16px; text-align: left;">
                    <div style="font-weight:700; font-size:0.82rem;">Aditya Sen</div>
                    <p style="font-size:0.83rem; color:var(--text-secondary); margin-top:4px;">Is there a specific camera viewport layout shortcut configuration for Windows vs Mac?</p>
                  </div>
                </div>
                <div style="display:flex; gap:8px;">
                  <input type="text" placeholder="Submit a question..." style="flex:1; padding:8px 12px; font-size:0.83rem; border:1px solid var(--border-color); border-radius:8px; outline:none; background:var(--bg-secondary); color:var(--text-primary);">
                  <button class="btn btn-primary btn-sm" style="margin-bottom:0;" onclick="window.app.showToast('Question posted!','success')">Submit</button>
                </div>
              </div>

              <!-- Tab: Assignments -->
              <div class="tab-panel-viewport ${this._activeTab === 'assignments' ? 'active' : ''}" id="tabpanel-assignments">
                <h3 style="font-size:0.95rem; font-weight:800; margin-bottom:12px; text-align: left;">Batch Assignments</h3>
                ${!isBatchActive ? lockedTabHtml : `
                <div style="display:flex; flex-direction:column; gap:12px;">
                  ${assignments.map(asg => `
                    <div style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:16px; padding:20px; text-align: left;">
                      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                        <h4 style="font-size:0.95rem; font-weight:800; color:var(--text-primary); margin:0;"><i class="fa-solid fa-tasks" style="color:var(--brand-blue); margin-right:8px;"></i> ${asg.title}</h4>
                        <span style="font-size:0.75rem; background:#EFF2FE; color:#3D46D8; padding:3px 8px; border-radius:20px; font-weight:700;">Due: ${asg.dueDate}</span>
                      </div>
                      <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.6; margin-bottom:16px;">
                        ${asg.description}
                      </p>
                      <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.78rem; color:var(--text-muted);">Max Points: <strong>${asg.maxPoints}</strong></span>
                        <button class="btn btn-outline btn-sm" onclick="window.app.showToast('Uploader triggered!','info')" style="margin:0;"><i class="fa-solid fa-upload"></i> Submit Work</button>
                      </div>
                    </div>
                  `).join('')}
                  ${assignments.length === 0 ? '<p style="color:var(--text-muted); font-size:0.8rem; font-style:italic;">No assignments for this batch yet.</p>' : ''}
                </div>
                `}
              </div>

            </div>
          </div>
        </main>

        <!-- 3. RIGHT SIDEBAR (Curriculum Accordion & Instructor Card) -->
        <aside class="lms-right-sidebar">
          
          <!-- Course Content Section -->
          <div>
            <div class="lms-right-section-title">Course Content</div>
            <div style="display:flex; flex-direction:column; gap:4px;">
              ${rightCurriculumHtml}
            </div>
          </div>

          <!-- Instructor Section -->
          <div>
            <div class="lms-right-section-title">Instructor</div>
            <div class="crs-author-card">
              <div class="crs-author-head">
                <div class="crs-author-avatar-wrap">
                  <div class="crs-author-avatar">${course.authorName ? course.authorName.charAt(0).toUpperCase() : 'C'}</div>
                  <div>
                    <div class="crs-author-name">${course.authorName || 'Instructor'}</div>
                    <div class="crs-author-role">Creative Specialist</div>
                  </div>
                </div>
                <div class="crs-author-rating">
                  <i class="fa-solid fa-star"></i>
                  <span>4.8</span>
                </div>
              </div>
              <p class="crs-author-bio">${course.authorBio || 'Creative specialist with 5+ years of digital creation and professional training experience.'}</p>
            </div>
          </div>
        </aside>
      </div>
    `;
  },

  _toggleFocusMode: function() {
    VideoPlayerComponent._focusMode = !VideoPlayerComponent._focusMode;
    const workspace = document.querySelector('.lms-workspace');
    if (workspace) {
      if (VideoPlayerComponent._focusMode) {
        workspace.classList.add('focus-mode');
        document.querySelector('.lms-left-sidebar').style.display = 'none';
        document.querySelector('.lms-right-sidebar').style.display = 'none';
        window.app.showToast('Focus Mode Enabled (Sidebars Hidden)','info');
      } else {
        workspace.classList.remove('focus-mode');
        document.querySelector('.lms-left-sidebar').style.display = '';
        document.querySelector('.lms-right-sidebar').style.display = '';
        window.app.showToast('Focus Mode Disabled','info');
      }
    }
  },

  saveStickyNote: function (courseId, lessonId) {
    const textEl = document.getElementById('notes-editor-ta');
    const text = textEl?.value.trim();
    if (!text) return;

    const savedNotes = JSON.parse(localStorage.getItem(`cubaze_sticky_notes_${courseId}_${lessonId}`)) || [];
    
    const colors = ['#FFF9C4', '#E1F5FE', '#E8F5E9', '#FCE4EC', '#F3E5F5'];
    const chosenColor = colors[savedNotes.length % colors.length];

    const newNote = {
      id: 'note-' + Date.now(),
      timestamp: this.formatTime(this._currentPlaybackTime),
      seconds: Math.floor(this._currentPlaybackTime),
      text: text,
      color: chosenColor
    };

    savedNotes.unshift(newNote);
    localStorage.setItem(`cubaze_sticky_notes_${courseId}_${lessonId}`, JSON.stringify(savedNotes));
    
    if (textEl) textEl.value = '';
    window.app.showToast('Sticky note saved! 📌', 'success');
    window.app.renderRoute();
  },

  togglePinNote: function (noteId) {
    this._pinnedNotes[noteId] = !this._pinnedNotes[noteId];
    window.app.showToast(this._pinnedNotes[noteId] ? 'Note pinned to top!' : 'Note unpinned.', 'info');
    window.app.renderRoute();
  },

  deleteNote: function (courseId, lessonId, noteId) {
    let savedNotes = JSON.parse(localStorage.getItem(`cubaze_sticky_notes_${courseId}_${lessonId}`)) || [];
    savedNotes = savedNotes.filter(n => n.id !== noteId);
    localStorage.setItem(`cubaze_sticky_notes_${courseId}_${lessonId}`, JSON.stringify(savedNotes));
    delete this._pinnedNotes[noteId];
    window.app.showToast('Note deleted.', 'info');
    window.app.renderRoute();
  },

  exportNotes: function (courseTitle, lessonTitle) {
    const cu = window.db.getCurrentUser();
    const courseId = window.location.hash.split('/')[2];
    const lessonId = window.location.hash.split('/')[3];
    const savedNotes = JSON.parse(localStorage.getItem(`cubaze_sticky_notes_${courseId}_${lessonId}`)) || [];
    
    if (savedNotes.length === 0) {
      window.app.showToast('No notes to export.', 'warning');
      return;
    }

    let fileContent = `CUBAZE ACADEMY — NOTES LOG\n`;
    fileContent += `User: ${cu?.name || 'Student'}\n`;
    fileContent += `Course: ${courseTitle}\n`;
    fileContent += `Lesson: ${lessonTitle}\n\n`;

    savedNotes.forEach((n, idx) => {
      const isPinned = this._pinnedNotes[n.id] ? '[PINNED] ' : '';
      fileContent += `[${n.timestamp}] ${isPinned}Note:\n${n.text}\n----------------------------------\n`;
    });

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Cubaze_StudyNotes_${lessonTitle.replace(/\s+/g, '_')}.txt`;
    link.click();
    window.app.showToast('Notes exported successfully!', 'success');
  },

  formatTime: function (secs) {
    const m = Math.floor(secs / 60), s = Math.floor(secs % 60);
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  },

  seekToTime: function (seconds) {
    const iframe = document.getElementById('youtube-iframe-player');
    if (iframe) {
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'seekTo',
        args: [seconds, true]
      }), '*');
      window.app.showToast(`Seeking to ${this.formatTime(seconds)}`, 'info');
    }
  },

  _getYouTubeEmbedUrl: function (url, fallback) {
    if (!url) return fallback;
    let videoId = "";
    if (url.includes("youtube.com/embed/")) {
      return url;
    } else if (url.includes("youtube.com/watch")) {
      const parts = url.split("v=");
      if (parts[1]) videoId = parts[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      const parts = url.split("youtu.be/");
      if (parts[1]) videoId = parts[1].split("?")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : fallback;
  },

  init: function (courseId, lessonId) {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Focus curriculum sidebar item
    setTimeout(() => {
      document.querySelector('.crs-right-lesson-item.active')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 450);

    // Expand accordion module headers
    document.querySelectorAll('.crs-right-module-header').forEach(header => {
      header.addEventListener('click', () => {
        const card = header.closest('.crs-right-module-card');
        const modId = card.getAttribute('data-module-id');
        VideoPlayerComponent._expandedModules[modId] = !(VideoPlayerComponent._expandedModules[modId] !== false);
        card.classList.toggle('expanded');
      });
    });

    // Mark complete button click listener
    document.getElementById('btn-mark-complete')?.addEventListener('click', () => {
      const cu = window.db.getCurrentUser();
      if (!cu) return;
      window.db.toggleLessonProgress(cu.username, courseId, lessonId);
      window.app.showToast('Lesson progress updated!', 'success');
      window.app.renderRoute();
    });

    // Playlist routing trigger on curriculum item clicks
    document.querySelectorAll('.crs-right-lesson-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-lesson-id');
        window.location.hash = `#/lesson/${courseId}/${id}`;
      });
    });

    // Tab buttons event listeners
    document.querySelectorAll('.lms-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-target-tab');
        VideoPlayerComponent._activeTab = tab;
        document.querySelectorAll('.lms-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tab-panel-viewport').forEach(v => v.classList.remove('active'));
        document.getElementById(`tabpanel-${tab}`).classList.add('active');
      });
    });

    // Save notes trigger
    document.getElementById('btn-save-glass-note')?.addEventListener('click', () => {
      VideoPlayerComponent.saveStickyNote(courseId, lessonId);
    });

    // Search notes input trigger
    document.getElementById('notes-search-input')?.addEventListener('input', e => {
      VideoPlayerComponent._notesSearchQuery = e.target.value;
      const textVal = document.getElementById('notes-editor-ta')?.value;
      window.app.renderRoute();
      VideoPlayerComponent._activeTab = 'notes';
      const ta = document.getElementById('notes-editor-ta');
      if (ta && textVal) ta.value = textVal;
      document.getElementById('notes-search-input')?.focus();
    });

    // Rich Editor formatting triggers
    document.getElementById('notes-btn-bold')?.addEventListener('click', () => {
      const ta = document.getElementById('notes-editor-ta');
      if (ta) {
        const start = ta.selectionStart, end = ta.selectionEnd, val = ta.value;
        ta.value = val.substring(0, start) + '**' + val.substring(start, end) + '**' + val.substring(end);
        ta.focus();
      }
    });
    document.getElementById('notes-btn-italic')?.addEventListener('click', () => {
      const ta = document.getElementById('notes-editor-ta');
      if (ta) {
        const start = ta.selectionStart, end = ta.selectionEnd, val = ta.value;
        ta.value = val.substring(0, start) + '*' + val.substring(start, end) + '*' + val.substring(end);
        ta.focus();
      }
    });
    document.getElementById('notes-btn-h1')?.addEventListener('click', () => {
      const ta = document.getElementById('notes-editor-ta');
      if (ta) {
        const start = ta.selectionStart, val = ta.value;
        ta.value = val.substring(0, start) + '\n# ' + val.substring(start);
        ta.focus();
      }
    });
    document.getElementById('notes-btn-stamp')?.addEventListener('click', () => {
      const ta = document.getElementById('notes-editor-ta');
      if (ta) {
        const start = ta.selectionStart, val = ta.value;
        const stampStr = ` [${VideoPlayerComponent.formatTime(VideoPlayerComponent._currentPlaybackTime)}] `;
        ta.value = val.substring(0, start) + stampStr + val.substring(start);
        ta.focus();
      }
    });

    // Handle Youtube playback currentTime Delivery
    window.addEventListener('message', e => {
      if (e.origin !== "https://www.youtube") {
        if (!e.origin.includes("youtube.com")) return;
      }
      try {
        const data = JSON.parse(e.data);
        if (data.event === "infoDelivery" && data.info) {
          if (data.info.currentTime !== undefined) {
            VideoPlayerComponent._currentPlaybackTime = data.info.currentTime;
            localStorage.setItem(`cubaze_playback_${courseId}_${lessonId}`, data.info.currentTime);
          }
        }
      } catch (err) {}
    });

    // Keyboard navigation triggers
    const keyPressHandler = e => {
      const act = document.activeElement;
      if (act && (act.tagName === 'INPUT' || act.tagName === 'TEXTAREA')) return;
      
      const iframe = document.getElementById('youtube-iframe-player');
      if (!iframe) return;

      if (e.key === ' ') {
        e.preventDefault();
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: VideoPlayerComponent._isPlaying ? 'pauseVideo' : 'playVideo', args: [] }), '*');
        VideoPlayerComponent._isPlaying = !VideoPlayerComponent._isPlaying;
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [VideoPlayerComponent._currentPlaybackTime + 5, true] }), '*');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [VideoPlayerComponent._currentPlaybackTime - 5, true] }), '*');
      }
    };

    window.removeEventListener('keydown', VideoPlayerComponent._keyPressHandler);
    VideoPlayerComponent._keyPressHandler = keyPressHandler;
    window.addEventListener('keydown', VideoPlayerComponent._keyPressHandler);

    // Resume video playback
    setTimeout(() => {
      const savedSecs = parseFloat(localStorage.getItem(`cubaze_playback_${courseId}_${lessonId}`));
      if (savedSecs && savedSecs > 1) {
        VideoPlayerComponent.seekToTime(savedSecs);
        window.app.showToast(`Resumed from last position ⏱️`, 'info');
      }
    }, 1500);
  }
};
window.VideoPlayerComponent = VideoPlayerComponent;
