// Cubaze Academy — Student Dashboard v2.0 (components/dashboard.js)
const DashboardComponent = {
  _activeTab: 'overview',

  render: function () {
    const cu = window.db.getCurrentUser();
    if (!cu) return `
      <div class="container" style="text-align:center;padding:100px 0;">
        <div style="font-size:4rem;margin-bottom:16px;">🔐</div>
        <h2>Please Login</h2>
        <p style="margin:16px 0;color:var(--text-secondary);">Login to access your student dashboard and continue learning.</p>
        <button class="btn btn-primary btn-lg" onclick="window.app.showAuthModal(true)"><i class="fa-solid fa-sign-in-alt"></i> Login to Dashboard</button>
      </div>
    `;

    const courses = window.db.getCourses();
    const enrolledCourseIds = cu.enrolledCourses || [];
    const enrolledCourses = courses.filter(c => enrolledCourseIds.includes(c.id));
    const wishlist = (cu.wishlist || []).map(id => courses.find(c => c.id === id)).filter(Boolean);
    const txns = window.db.getTransactions().filter(t => t.username === cu.username);

    const navItems = [
      ['overview', 'fa-gauge', 'Overview'],
      ['mycourses', 'fa-book-open', 'My Courses'],
      ['liveclasses', 'fa-video', 'Live Classes'],
      ['common_meeting', 'fa-calendar-days', 'Common Meeting'],
      ['projects', 'fa-tasks', 'Projects'],
      ['wishlist', 'fa-heart', 'Wishlist'],
      ['certificates', 'fa-certificate', 'Certificates'],
      ['orders', 'fa-receipt', 'Orders'],
      ['support', 'fa-comments', 'Talk with Admin'],
      ['tutor_chat', 'fa-chalkboard-user', 'Talk with Tutor'],
      ['profile', 'fa-user', 'Profile']
    ];
    const totalProgress = enrolledCourses.length > 0
      ? Math.round(enrolledCourses.reduce((sum, c) => {
        const p = window.db.getUserProgress(cu.username, c.id);
        const total = (c.modules || []).reduce((a, m) => a + (m.lessons || []).length, 0);
        const done = (p.completedLessons || []).length;
        return sum + (total > 0 ? (done / total) * 100 : 0);
      }, 0) / enrolledCourses.length)
      : 0;

    return `
      <div style="background:var(--bg-primary);min-height:calc(100vh - var(--header-height));">
        <div class="dashboard-layout container">
          <!-- Sidebar -->
          <div class="dashboard-sidebar">
            <div class="sidebar-profile">
              <div class="sidebar-avatar" style="${cu.profilePhoto ? `background-image:url(${cu.profilePhoto});` : ''}">${cu.profilePhoto ? '' : cu.name.charAt(0).toUpperCase()}</div>
              <div class="sidebar-name">${cu.name}</div>
              <div class="sidebar-role">@${cu.username} · Student</div>
            </div>
            <div class="sidebar-nav">
              ${navItems.map(([tab, icon, label]) => `
                <div class="sidebar-nav-item ${DashboardComponent._activeTab === tab ? 'active' : ''}" data-tab="${tab}">
                  <span style="display:flex; align-items:center; gap:10px;"><i class="fa-solid ${icon}" style="width:20px; text-align:center;"></i>${label}</span>
                  ${tab === 'wishlist' && wishlist.length > 0 ? `<span class="nav-badge">${wishlist.length}</span>` : ''}
                  ${tab === 'certificates' ? `<span class="nav-badge" style="background:var(--success);">${enrolledCourses.filter(c => { const p = window.db.getUserProgress(cu.username, c.id); return p.certificateEarned; }).length}</span>` : ''}
                  ${tab === 'support' ? `<span class="support-badge" id="support-unread-badge" style="display:none;"></span>` : ''}
                  ${tab === 'tutor_chat' ? `<span class="support-badge" id="tutor-chat-unread-badge" style="display:none;"></span>` : ''}
                </div>
              `).join('')}
            </div>
            <div style="padding:16px;border-top:1px solid var(--border-color);">
              <a href="#/courses" class="btn btn-primary btn-sm btn-block"><i class="fa-solid fa-plus"></i> Buy New Course</a>
            </div>
          </div>

          <!-- Content -->
          <div class="dashboard-content">
            <div id="student-tab-content">
              ${DashboardComponent._renderTab(DashboardComponent._activeTab, cu, enrolledCourses, wishlist, txns, totalProgress)}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  _renderTab: function (tab, cu, enrolledCourses, wishlist, txns, totalProgress) {
    switch (tab) {
      case 'overview': return DashboardComponent._renderOverview(cu, enrolledCourses, totalProgress);
      case 'mycourses': return DashboardComponent._renderMyCourses(cu, enrolledCourses);
      case 'liveclasses': return DashboardComponent._renderLiveClasses(cu, enrolledCourses);
      case 'common_meeting': return DashboardComponent._renderCommonMeetings(cu);
      case 'projects': return DashboardComponent._renderProjects(cu, enrolledCourses);
      case 'wishlist': return DashboardComponent._renderWishlist(cu, wishlist);
      case 'certificates': return DashboardComponent._renderCertificates(cu, enrolledCourses);
      case 'orders': return DashboardComponent._renderOrders(txns);
      case 'support': return `<div id="support-portal-loading"><div class="spinner"></div></div>`;
      case 'tutor_chat': return `<div id="tutor-chat-portal-loading"><div class="spinner"></div></div>`;
      case 'profile': return DashboardComponent._renderProfile(cu);
      default: return DashboardComponent._renderOverview(cu, enrolledCourses, totalProgress);
    }
  },

  _getPendingTxns: function (cu) {
    const txns = window.db.getTransactions();
    return txns.filter(t => t.username.toLowerCase() === cu.username.toLowerCase() && (t.adminStatus === 'PENDING' || t.adminStatus === 'RE_UPLOAD_REQUESTED'));
  },

  _reuploadScreenshot: null,

  showReuploadModal: function (courseId) {
    const course = window.db.getCourseById(courseId);
    if (!course) return;
    
    const cu = window.db.getCurrentUser();
    if (!cu) return;

    const txn = window.db.getTransactions().find(t => t.username === cu.username && t.courseId === courseId && t.adminStatus === 'RE_UPLOAD_REQUESTED');
    if (!txn) return;

    DashboardComponent._reuploadScreenshot = null;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay show';
    overlay.id = 'reupload-proof-modal';
    overlay.style.zIndex = '9999';
    overlay.innerHTML = `
      <div class="payment-card" style="width:100%; max-width:540px; margin: 80px auto; background:var(--bg-card); border-radius:var(--radius-xl); box-shadow:0 20px 50px rgba(0,0,0,0.25); border:1px solid var(--border-color); overflow:hidden;">
        <div style="background:var(--brand-blue); color:#fff; padding:18px 24px; display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0; font-size:1.15rem; color:#fff;"><i class="fa-solid fa-cloud-arrow-up"></i> Re-upload Payment Proof</h3>
          <button class="btn-close-reupload" style="background:none; border:none; color:#fff; font-size:1.2rem; cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
        </div>
        
        <div style="padding:24px;">
          <div style="background:rgba(220,38,38,0.06); border:1px solid rgba(220,38,38,0.15); border-radius:8px; padding:14px; margin-bottom:20px; font-size:0.82rem; color:#DC2626; line-height:1.5;">
            <i class="fa-solid fa-triangle-exclamation"></i> <strong>Rejection Reason:</strong> ${txn.reuploadReason}
          </div>

          <div class="form-group" style="margin-bottom:16px;">
            <label style="font-weight:700; font-size:0.82rem;">Course</label>
            <div style="font-weight:700; color:var(--text-primary); font-size:0.95rem;">${course.title}</div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:18px;">
            <div class="form-group" style="margin-bottom:0;">
              <label for="reupload-utr"><i class="fa-solid fa-hashtag"></i> 12-Digit UTR Number</label>
              <input type="text" id="reupload-utr" value="${txn.utr || ''}" placeholder="e.g. 629104829104" maxlength="12" style="width:100%;">
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label for="reupload-date"><i class="fa-solid fa-calendar"></i> Transaction Date</label>
              <input type="date" id="reupload-date" value="${txn.paymentDate || new Date().toISOString().split('T')[0]}" style="width:100%;">
            </div>
          </div>

          <div class="form-group" style="margin-bottom:24px;">
            <label><i class="fa-solid fa-image"></i> Payment Screenshot</label>
            <div class="screenshot-dropzone" id="reupload-drop-area" style="padding:24px; border:2px dashed var(--border-color); border-radius:10px; text-align:center; cursor:pointer;">
              <i class="fa-solid fa-cloud-arrow-up" style="font-size:2rem; color:var(--text-muted); margin-bottom:8px;"></i>
              <div style="font-weight:600; font-size:0.85rem; color:var(--text-primary); margin-bottom:4px;">Drag & drop new screenshot here</div>
              <div style="font-size:0.72rem; color:var(--text-muted); margin-bottom:8px;">Supports JPEG, PNG up to 5MB</div>
              <input type="file" id="reupload-screenshot-input" accept="image/*" style="display:none;">
              <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('reupload-screenshot-input').click()">Browse Files</button>
            </div>
            <!-- Preview Container -->
            <div id="reupload-preview-container" style="display:none; margin-top:12px; position:relative; width:120px; height:120px; border-radius:8px; overflow:hidden; border:1px solid var(--border-color);">
              <img id="reupload-preview-img" style="width:100%; height:100%; object-fit:cover;">
              <button type="button" style="position:absolute; top:4px; right:4px; width:24px; height:24px; border-radius:50%; background:rgba(220,38,38,0.85); color:#fff; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:0.72rem;" onclick="DashboardComponent.clearReuploadScreenshot()"><i class="fa-solid fa-xmark"></i></button>
            </div>
          </div>

          <div style="display:flex; gap:12px; justify-content:flex-end;">
            <button class="btn btn-secondary btn-modal-close">Cancel</button>
            <button class="btn btn-primary" id="btn-submit-reupload" onclick="DashboardComponent.submitReupload('${courseId}')"><i class="fa-solid fa-paper-plane"></i> Submit Verification</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Bind inner elements
    overlay.querySelectorAll('.btn-modal-close, .btn-close-reupload').forEach(b => {
      b.addEventListener('click', () => overlay.remove());
    });

    const dropArea = overlay.querySelector('#reupload-drop-area');
    const fileInput = overlay.querySelector('#reupload-screenshot-input');

    if (dropArea && fileInput) {
      ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropArea.style.borderColor = 'var(--brand-blue)';
        }, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropArea.style.borderColor = 'var(--border-color)';
        }, false);
      });

      dropArea.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files[0]) {
          DashboardComponent.handleReuploadFileSelection(files[0]);
        }
      }, false);

      fileInput.addEventListener('change', (e) => {
        if (fileInput.files && fileInput.files[0]) {
          DashboardComponent.handleReuploadFileSelection(fileInput.files[0]);
        }
      });
    }
  },

  handleReuploadFileSelection: function (file) {
    if (!file.type.startsWith('image/')) {
      window.app.showToast('Invalid file format. Please upload an image.', 'danger');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      window.app.showToast('File size exceeds 5MB limit.', 'danger');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      DashboardComponent._reuploadScreenshot = e.target.result;
      const previewImg = document.getElementById('reupload-preview-img');
      if (previewImg) previewImg.src = e.target.result;
      const dropArea = document.getElementById('reupload-drop-area');
      if (dropArea) dropArea.style.display = 'none';
      const previewContainer = document.getElementById('reupload-preview-container');
      if (previewContainer) previewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);
  },

  clearReuploadScreenshot: function () {
    DashboardComponent._reuploadScreenshot = null;
    const dropArea = document.getElementById('reupload-drop-area');
    if (dropArea) dropArea.style.display = 'block';
    const previewContainer = document.getElementById('reupload-preview-container');
    if (previewContainer) previewContainer.style.display = 'none';
    const input = document.getElementById('reupload-screenshot-input');
    if (input) input.value = '';
  },

  submitReupload: function (courseId) {
    const cu = window.db.getCurrentUser();
    if (!cu) return;

    const utr = document.getElementById('reupload-utr')?.value.trim();
    const date = document.getElementById('reupload-date')?.value;
    const screenshot = DashboardComponent._reuploadScreenshot;

    if (!utr || utr.length !== 12 || !/^\d+$/.test(utr)) {
      window.app.showToast('Please enter a valid 12-digit UTR/Transaction Number.', 'danger');
      return;
    }

    if (!date) {
      window.app.showToast('Please select the payment date.', 'danger');
      return;
    }

    if (!screenshot) {
      window.app.showToast('Please upload a screenshot of your payment receipt.', 'danger');
      return;
    }

    const btn = document.getElementById('btn-submit-reupload');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
    }

    setTimeout(() => {
      // Find the old transaction
      const txns = window.db.getTransactions();
      const oldTxn = txns.find(t => t.username === cu.username && t.courseId === courseId && t.adminStatus === 'RE_UPLOAD_REQUESTED');
      
      const details = {
        id: oldTxn ? oldTxn.id : null,
        discount: oldTxn ? oldTxn.discount : 0,
        couponCode: oldTxn ? oldTxn.couponCode : "",
        screenshot: screenshot,
        utr: utr,
        paymentDate: date,
        adminStatus: 'PENDING'
      };

      if (oldTxn) {
        // Remove the old transaction before updating
        let allTxns = window.db.getTransactions();
        allTxns = allTxns.filter(t => t.id !== oldTxn.id);
        localStorage.setItem("cubaze_transactions", JSON.stringify(allTxns));
      }

      window.db.addTransaction(cu.username, courseId, oldTxn ? oldTxn.amount : 0, 'Direct UPI QR Payment', 'PENDING', details);
      
      // Remove modal
      document.getElementById('reupload-proof-modal')?.remove();
      
      window.app.showToast('Payment proof re-submitted successfully! ⏳', 'success');
      
      // Reload Dashboard
      window.location.reload();
    }, 1200);
  },

  _renderOverview: function (cu, enrolledCourses, totalProgress) {
    const certsEarned = enrolledCourses.filter(c => window.db.getUserProgress(cu.username, c.id).certificateEarned).length;
    const totalHoursLearned = enrolledCourses.reduce((sum, c) => {
      const p = window.db.getUserProgress(cu.username, c.id);
      const total = (c.modules || []).reduce((a, m) => a + (m.lessons || []).length, 0);
      const done = (p.completedLessons || []).length;
      return sum + (total > 0 ? (done / total) * parseFloat(c.duration) : 0);
    }, 0);

    const pendingTxns = DashboardComponent._getPendingTxns(cu);
    let pendingAlertsHtml = '';
    
    if (pendingTxns.length > 0) {
      pendingAlertsHtml = `
        <div style="margin-bottom:28px;">
          <h3 style="margin-bottom:16px;display:flex;align-items:center;gap:8px;"><i class="fa-solid fa-circle-exclamation" style="color:var(--brand-blue);"></i> Action Required / Pending Verification</h3>
          <div style="display:flex;flex-direction:column;gap:14px;">
            ${pendingTxns.map(t => {
              const course = window.db.getCourseById(t.courseId);
              if (!course) return '';
              const isReupload = t.adminStatus === 'RE_UPLOAD_REQUESTED';
              
              return `
                <div style="background:var(--bg-card);border:1px solid ${isReupload ? 'rgba(239,68,68,0.2)' : 'var(--border-color)'};border-radius:var(--radius-xl);padding:20px;display:grid;grid-template-columns:auto 1fr auto;gap:20px;align-items:center;">
                  <img src="${course.image}" style="width:100px;height:56px;object-fit:cover;border-radius:6px;border:1px solid var(--border-color);">
                  <div>
                    <h4 style="margin:0 0 6px 0;font-weight:700;color:var(--text-primary);">${course.title}</h4>
                    <div style="font-size:0.78rem;display:flex;gap:12px;color:var(--text-muted);flex-wrap:wrap;">
                      <span>Amount: <strong>₹${t.amount.toLocaleString('en-IN')}</strong></span>
                      <span>UTR: <code>${t.utr || 'N/A'}</code></span>
                      <span>Date: ${new Date(t.timestamp).toLocaleDateString('en-IN')}</span>
                    </div>
                    ${isReupload ? `
                      <div style="margin-top:10px;font-size:0.8rem;background:rgba(239,68,68,0.06);color:#DC2626;border:1px dashed rgba(239,68,68,0.25);padding:10px 14px;border-radius:8px;line-height:1.4;">
                        <i class="fa-solid fa-triangle-exclamation"></i> <strong>Re-upload requested:</strong> ${t.reuploadReason}
                      </div>
                    ` : `
                      <div style="margin-top:10px;font-size:0.8rem;background:rgba(245,158,11,0.06);color:#D97706;padding:8px 12px;border-radius:8px;display:inline-flex;align-items:center;gap:6px;">
                        <i class="fa-solid fa-spinner fa-spin"></i> <span>Verification in progress. Access will be unlocked shortly.</span>
                      </div>
                    `}
                  </div>
                  <div>
                    ${isReupload ? `
                      <button class="btn btn-primary btn-sm" onclick="DashboardComponent.showReuploadModal('${t.courseId}')"><i class="fa-solid fa-cloud-arrow-up"></i> Re-upload Proof</button>
                    ` : `
                      <button class="btn btn-outline btn-sm" disabled style="opacity:0.75;"><i class="fa-solid fa-hourglass"></i> Pending</button>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    return `
      <div class="dashboard-overview-container">
        <div class="dashboard-main-col">
          <div class="dashboard-welcome">
            <h2>Welcome back, ${cu.name.split(' ')[0]}! 👋</h2>
            <p>${enrolledCourses.length > 0 ? `You have ${enrolledCourses.length} course${enrolledCourses.length > 1 ? 's' : ''} in progress. Keep it up!` : 'Start your learning journey today! Browse our courses below.'}</p>
          </div>

          <div class="dashboard-widgets">
            <div class="widget-card"><div class="widget-icon blue"><i class="fa-solid fa-book-open"></i></div><div class="widget-number">${enrolledCourses.length}</div><div class="widget-label">Enrolled Courses</div></div>
            <div class="widget-card"><div class="widget-icon green"><i class="fa-solid fa-chart-simple"></i></div><div class="widget-number">${totalProgress}%</div><div class="widget-label">Avg. Progress</div></div>
            <div class="widget-card"><div class="widget-icon gold"><i class="fa-solid fa-clock"></i></div><div class="widget-number">${Math.round(totalHoursLearned)}h</div><div class="widget-label">Hours Learned</div></div>
            <div class="widget-card"><div class="widget-icon purple"><i class="fa-solid fa-certificate"></i></div><div class="widget-number">${certsEarned}</div><div class="widget-label">Certificates</div></div>
          </div>

          <!-- Pending manual enrollments -->
          ${pendingAlertsHtml}

          ${(() => {
        const nextMeeting = window.db.getCommonMeetingsForUser(cu.username)
          .filter(m => m.status === 'Live Now' || m.status === 'Upcoming')
          .sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`))[0];

        if (nextMeeting) {
          const isLive = nextMeeting.status === 'Live Now';

          setTimeout(() => {
            DashboardComponent._startCommonMeetingTimers();
          }, 100);

          return `
                <div class="glass-panel" style="padding:20px; border:1px solid ${isLive ? '#10B981' : 'var(--border-color)'}; background:${isLive ? 'var(--bg-secondary)' : 'var(--bg-card)'}; border-radius:var(--radius-xl); text-align:left; position:relative; overflow:hidden;">
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

          ${enrolledCourses.length === 0 ? `
            <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-xl);padding:48px;text-align:center;">
              <div style="font-size:3rem;margin-bottom:16px;">📚</div>
              <h3>No Courses Yet</h3>
              <p style="margin:12px 0 24px;color:var(--text-secondary);">Browse our premium courses and start your creative journey today!</p>
              <a href="#/courses" class="btn btn-primary btn-lg">Explore Courses</a>
            </div>
          ` : `
            <div>
              <h3 style="margin-bottom:16px;"><i class="fa-solid fa-book-open" style="color:var(--brand-blue);margin-right:8px;"></i>Continue Learning</h3>
              <div style="display:flex;flex-direction:column;gap:16px;">
                ${enrolledCourses.slice(0, 3).map(c => DashboardComponent._renderEnrolledCard(cu, c)).join('')}
              </div>
            </div>
          `}
        </div>
        ${window.DashboardRightPanel ? window.DashboardRightPanel.render(cu) : ''}
      </div>
    `;
  },

  _renderEnrolledCard: function (cu, c) {
    const p = window.db.getUserProgress(cu.username, c.id);
    const total = (c.modules || []).reduce((a, m) => a + (m.lessons || []).length, 0);
    const done = (p.completedLessons || []).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const hasLessons = c.modules && c.modules.length > 0 && c.modules[0].lessons && c.modules[0].lessons.length > 0;
    const firstLesson = hasLessons ? c.modules[0].lessons[0] : null;

    // Batch details
    const enrolledBatches = cu.enrolledBatches || {};
    const batchId = enrolledBatches[c.id];
    const batch = batchId ? window.db.getBatchById(batchId) : null;

    let batchHtml = '';
    if (batch) {
      const tutors = window.db.getUsers().filter(u => u.role === 'instructor');
      const tutorNames = batch.tutorIds.map(tid => {
        const t = tutors.find(x => x.username === tid);
        return t ? t.name : tid;
      }).join(', ');

      const isBatchActive = batch.status === 'Active' || batch.status === 'Completed';

      if (isBatchActive) {
        // Find next live class for this batch
        const nextClass = window.db.getLiveClasses()
          .filter(lc => lc.status === 'published' && lc.batch_id === batch.id && new Date(`${lc.date}T${lc.start_time}`) > new Date())
          .sort((a, b) => new Date(`${a.date}T${a.start_time}`) - new Date(`${b.date}T${b.start_time}`))[0];

        const nextClassText = nextClass
          ? `${nextClass.date} at ${nextClass.start_time} (${nextClass.title})`
          : 'None scheduled';

        // Calculate attendance
        const studentAtt = window.db.getAttendance(batch.id).filter(a => a.username === cu.username);
        const presentCount = studentAtt.filter(a => a.status === 'Present' || a.status === 'PRESENT' || a.status === 'LATE').length;
        const totalAtt = studentAtt.length;
        const attPct = totalAtt > 0 ? Math.round((presentCount / totalAtt) * 100) : 100;

        const whatsappButton = batch.whatsappLink
          ? `<a href="${batch.whatsappLink}" target="_blank" class="btn btn-success btn-xs" style="margin-top:8px; display:inline-flex; align-items:center; gap:6px; background:#25D366; border-color:#25D366; color:#fff;"><i class="fa-brands fa-whatsapp" style="font-size:0.9rem;"></i> Join WhatsApp Group</a>`
          : '';

        batchHtml = `
          <div class="enrolled-batch-details" style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:16px; margin: 12px 0; font-size:0.83rem; text-align: left;">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid var(--border-color); padding-bottom:8px;">
              <span>My Batch: <strong style="color:var(--text-primary);">${batch.name}</strong></span>
              <span class="status-badge success" style="padding:2px 8px; font-size:0.7rem;">Active</span>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px;">
              <div><span style="color:var(--text-secondary);">Tutor:</span> <strong style="color:var(--text-primary);">${tutorNames || '—'}</strong></div>
              <div><span style="color:var(--text-secondary);">Schedule:</span> <strong style="color:var(--text-primary);">${batch.classTime || '—'} (${(batch.classDays || []).join(', ') || '—'})</strong></div>
              <div><span style="color:var(--text-secondary);">Start Date:</span> <strong style="color:var(--text-primary);">${batch.startDate}</strong></div>
              <div><span style="color:var(--text-secondary);">End Date:</span> <strong style="color:var(--text-primary);">${batch.endDate}</strong></div>
            </div>
            <div style="margin-bottom:8px;"><span style="color:var(--text-secondary);">Attendance:</span> <strong style="color:var(--text-primary);">${totalAtt > 0 ? `${presentCount}/${totalAtt} (${attPct}%)` : 'No classes recorded yet'}</strong></div>
            <div style="margin-bottom:8px;"><span style="color:var(--text-secondary);">Next Live Class:</span> <strong style="color:var(--brand-blue);"><i class="fa-solid fa-video"></i> ${nextClassText}</strong></div>
            ${whatsappButton}
          </div>
        `;
      } else {
        const availableSeats = batch.maxStudents - (batch.currentEnrollment || 0);
        batchHtml = `
          <div class="enrolled-batch-details" style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:16px; margin: 12px 0; font-size:0.83rem; text-align: left; box-shadow:inset 0 1px 3px rgba(0,0,0,0.01);">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid var(--border-color); padding-bottom:8px;">
              <span>My Batch: <strong style="color:var(--text-primary);">${batch.name}</strong></span>
              <span class="status-badge warning" style="padding:2px 8px; font-size:0.7rem;">${batch.status}</span>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px;">
              <div><span style="color:var(--text-secondary);">Enrolled:</span> <strong style="color:var(--text-primary);">${batch.currentEnrollment || 0} / ${batch.maxStudents}</strong></div>
              <div><span style="color:var(--text-secondary);">Available Seats:</span> <strong style="color:#10B981;">${availableSeats} available</strong></div>
            </div>
            <div style="font-size:0.76rem; color:var(--text-secondary); background:var(--brand-blue-pale); border:1px solid var(--brand-blue-light); padding:8px 12px; border-radius:8px; display:flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-lock" style="color:#D97706;"></i>
              <span>Tutor, schedule, Meet, and WhatsApp group will be available once the batch becomes Active.</span>
            </div>
          </div>
        `;
      }
    }

    return `
      <div class="enrolled-course-card">
        <div class="enrolled-course-left">
          <div class="enrolled-course-thumb"><img src="${c.image}" alt="${c.title}" loading="lazy"></div>
          <div style="margin-top: 8px;">
            <div class="progress-bar-wrapper"><div class="progress-bar" style="width:${pct}%;"></div></div>
            <div style="font-size:0.78rem;color:var(--brand-blue);font-weight:600;margin-top:6px;margin-bottom:0;text-align:center;">${pct}% Complete</div>
          </div>
        </div>
        <div class="enrolled-course-body">
          <div class="enrolled-course-title">${c.title}</div>
          <div class="enrolled-course-meta">${done} of ${total} lessons completed · ${c.duration}</div>
          ${batchHtml}
          <div class="enrolled-course-actions">
            ${firstLesson ? `<a href="#/lesson/${c.id}/${firstLesson.id}" class="btn btn-primary btn-sm"><i class="fa-solid fa-play"></i> Continue</a>` : `<button class="btn btn-outline-white btn-sm" disabled><i class="fa-solid fa-ban"></i> No Lessons</button>`}
            <a href="#/quiz/${c.id}" class="btn btn-secondary btn-sm"><i class="fa-solid fa-trophy"></i> Take Quiz</a>
            ${p.certificateEarned ? `<a href="#/certificate/${c.id}" class="btn btn-secondary btn-sm"><i class="fa-solid fa-certificate" style="color:var(--warning);"></i> Certificate</a>` : ''}
          </div>
        </div>
      </div>
    `;
  },

  _renderMyCourses: function (cu, enrolledCourses) {
    const pendingTxns = DashboardComponent._getPendingTxns(cu);
    const pendingHtml = pendingTxns.map(t => {
      const course = window.db.getCourseById(t.courseId);
      if (!course) return '';
      const isReupload = t.adminStatus === 'RE_UPLOAD_REQUESTED';
      
      return `
        <div class="enrolled-course-card" style="opacity:0.85;border-color:${isReupload ? 'rgba(239,68,68,0.3)' : 'var(--border-color)'};">
          <div class="enrolled-course-left" style="position:relative;">
            <div class="enrolled-course-thumb" style="filter:grayscale(60%);">
              <img src="${course.image}" alt="${course.title}">
            </div>
            <div style="position:absolute;top:8px;left:8px;background:${isReupload ? '#EF4444' : '#F59E0B'};color:#fff;padding:4px 8px;font-size:0.68rem;font-weight:800;border-radius:6px;box-shadow:0 2px 6px rgba(0,0,0,0.15);z-index:1;">
              ${isReupload ? '⚠️ Action Required' : '⏳ Pending Approval'}
            </div>
          </div>
          <div class="enrolled-course-body" style="text-align:left;">
            <div class="enrolled-course-title" style="color:var(--text-muted);">${course.title}</div>
            <div class="enrolled-course-meta" style="margin-bottom:12px;">Amount: ₹${t.amount.toLocaleString('en-IN')} · UTR: ${t.utr || 'N/A'}</div>
            
            ${isReupload ? `
              <div style="font-size:0.78rem;background:rgba(239,68,68,0.06);color:#DC2626;padding:10px;border-radius:8px;margin-bottom:14px;border:1px dashed rgba(239,68,68,0.15);line-height:1.4;">
                <strong>Reason:</strong> ${t.reuploadReason}
              </div>
              <button class="btn btn-primary btn-sm" onclick="DashboardComponent.showReuploadModal('${t.courseId}')"><i class="fa-solid fa-cloud-arrow-up"></i> Re-upload Proof</button>
            ` : `
              <div style="font-size:0.78rem;background:rgba(245,158,11,0.06);color:#D97706;padding:10px;border-radius:8px;margin-bottom:14px;display:inline-flex;align-items:center;gap:6px;">
                <i class="fa-solid fa-spinner fa-spin"></i> Pending administrative verification
              </div>
            `}
          </div>
        </div>
      `;
    }).join('');

    const count = enrolledCourses.length + pendingTxns.length;

    return `
      <div>
        <h2 style="margin-bottom:24px;">My Courses (${count})</h2>
        ${count === 0 ? `
          <div style="text-align:center;padding:64px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-xl);">
            <div style="font-size:3rem;margin-bottom:16px;">📚</div>
            <h3>No courses enrolled yet</h3>
            <a href="#/courses" class="btn btn-primary" style="margin-top:16px;">Browse Courses</a>
          </div>
        ` : `
          <div style="display:flex;flex-direction:column;gap:16px;">
            ${pendingHtml}
            ${enrolledCourses.map(c => DashboardComponent._renderEnrolledCard(cu, c)).join('')}
          </div>
        `}
      </div>
    `;
  },

  _renderWishlist: function (cu, wishlist) {
    return `
      <div>
        <h2 style="margin-bottom:24px;">My Wishlist (${wishlist.length})</h2>
        ${wishlist.length === 0 ? `
          <div style="text-align:center;padding:64px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-xl);">
            <div style="font-size:3rem;margin-bottom:16px;">❤️</div>
            <h3>Your wishlist is empty</h3>
            <p style="margin:12px 0;color:var(--text-secondary);">Browse courses and add them to your wishlist!</p>
            <a href="#/courses" class="btn btn-primary" style="margin-top:8px;">Browse Courses</a>
          </div>
        ` : `
          <div class="courses-grid">
            ${wishlist.map(c => `
              <div class="course-card">
                <div class="course-img-wrapper"><img src="${c.image}" alt="${c.title}"></div>
                <div class="course-body">
                  <div class="course-title">${c.title}</div>
                  <div class="course-footer">
                    <div class="course-price">₹${c.price.toLocaleString('en-IN')}</div>
                    <div style="display:flex;gap:8px;">
                      <a href="#/course/${c.id}" class="btn btn-primary btn-sm">Enroll</a>
                      <button class="btn btn-secondary btn-sm" onclick="window.db.toggleWishlist('${cu.username}','${c.id}');window.app.renderRoute()"><i class="fa-solid fa-heart-broken"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  },

  _renderCertificates: function (cu, enrolledCourses) {
    const certsEarned = enrolledCourses.filter(c => window.db.getUserProgress(cu.username, c.id).certificateEarned);
    return `
      <div>
        <h2 style="margin-bottom:24px;">My Certificates (${certsEarned.length})</h2>
        ${certsEarned.length === 0 ? `
          <div style="text-align:center;padding:64px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-xl);">
            <div style="font-size:3rem;margin-bottom:16px;">🎓</div>
            <h3>No certificates yet</h3>
            <p style="margin:12px 0;color:var(--text-secondary);">Complete a course and pass the quiz to earn your first certificate!</p>
            ${(() => {
          if (enrolledCourses.length === 0) return '';
          const firstC = enrolledCourses[0];
          const hasLes = firstC.modules && firstC.modules.length > 0 && firstC.modules[0].lessons && firstC.modules[0].lessons.length > 0;
          if (hasLes) {
            return `<a href="#/lesson/${firstC.id}/${firstC.modules[0].lessons[0].id}" class="btn btn-primary" style="margin-top:8px;">Continue Learning</a>`;
          }
          return `<a href="#/course/${firstC.id}" class="btn btn-primary" style="margin-top:8px;">View Course</a>`;
        })()}
          </div>
        ` : `
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;">
            ${certsEarned.map(c => `
              <div class="glass-card" style="text-align:center;padding:32px;border-radius:var(--radius-xl);overflow:visible;">
                <div style="width:80px;height:80px;background:linear-gradient(135deg,var(--warning),#d97706);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;"><i class="fa-solid fa-award" style="color:#fff;font-size:2rem;"></i></div>
                <div style="font-weight:800;font-size:0.95rem;color:var(--text-primary);margin-bottom:8px;">${c.title}</div>
                <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:16px;">Completed Successfully</div>
                <a href="#/certificate/${c.id}" class="btn btn-primary btn-sm btn-block"><i class="fa-solid fa-download"></i> View Certificate</a>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  },

  _renderOrders: function (txns) {
    return `
      <div>
        <h2 style="margin-bottom:24px;">Purchase History (${txns.length})</h2>
        <div class="glass-panel" style="padding:0;overflow:hidden;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Method</th>
                <th>UTR / Ref</th>
                <th>Status</th>
                <th>Date</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              ${txns.length === 0 ? '<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:32px;">No purchases yet.</td></tr>' : ''}
              ${txns.map(t => {
                let badgeHtml = '';
                if (t.adminStatus === 'APPROVED' || t.status === 'SUCCESS') {
                  badgeHtml = '<span class="status-badge success">Success</span>';
                } else if (t.adminStatus === 'PENDING') {
                  badgeHtml = '<span class="status-badge pending">Pending</span>';
                } else if (t.adminStatus === 'RE_UPLOAD_REQUESTED') {
                  badgeHtml = '<span class="status-badge warning" style="background:#FEF3C7;color:#D97706;border-color:#FDE68A;">Re-upload</span>';
                } else {
                  badgeHtml = '<span class="status-badge danger">Failed</span>';
                }

                const invoiceBtn = (t.status === 'SUCCESS' || t.adminStatus === 'APPROVED')
                  ? `<button class="btn btn-ghost btn-sm" onclick="PhonePeComponent.printInvoice('${t.id}')" style="margin-bottom:0;padding:6px 12px;height:30px;"><i class="fa-solid fa-file-invoice"></i> Receipt</button>`
                  : '—';

                return `
                  <tr>
                    <td style="font-family:monospace;font-size:0.75rem;font-weight:700;">${t.id}</td>
                    <td style="font-weight:600;">${t.courseTitle}</td>
                    <td style="font-weight:700;color:var(--success);">₹${t.amount.toLocaleString('en-IN')}</td>
                    <td style="font-size:0.8rem;">${t.paymentMethod}</td>
                    <td style="font-family:monospace;font-size:0.78rem;">${t.utr || t.gatewayReference || '—'}</td>
                    <td>${badgeHtml}</td>
                    <td style="font-size:0.8rem;color:var(--text-secondary);">${new Date(t.timestamp).toLocaleDateString('en-IN')}</td>
                    <td>${invoiceBtn}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  _renderProfile: function (cu) {
    return `
      <div style="display:flex;flex-direction:column;gap:24px;">
        <h2>My Profile</h2>
        <div class="glass-panel">
          <div style="display:flex;align-items:center;gap:20px;margin-bottom:32px;padding-bottom:24px;border-bottom:1px solid var(--border-color);">
            <div class="sidebar-avatar" style="width:80px;height:80px;font-size:2rem;${cu.profilePhoto ? `background-image:url(${cu.profilePhoto});` : ''}">${cu.profilePhoto ? '' : cu.name.charAt(0).toUpperCase()}</div>
            <div>
              <div style="font-weight:800;font-size:1.2rem;color:var(--text-primary);">${cu.name}</div>
              <div style="color:var(--text-muted);font-size:0.85rem;">@${cu.username}</div>
              <div class="sidebar-role" style="display:inline-block;margin-top:6px;">${cu.role}</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div class="form-group"><label>Full Name</label><input type="text" id="profile-name" value="${cu.name}"></div>
            <div class="form-group"><label>Phone Number</label><input type="text" id="profile-phone" value="${cu.phone || ''}" placeholder="e.g. +91 98765 43210"></div>
            
            <div class="form-group"><label>WhatsApp Number (Optional)</label><input type="text" id="profile-whatsapp" value="${cu.whatsapp || ''}" placeholder="e.g. +91 98765 43210"></div>
            <div class="form-group"><label>Date of Birth (Optional)</label><input type="date" id="profile-dob" value="${cu.dob || ''}"></div>
            
            <div class="form-group">
              <label>Qualification (Optional)</label>
              <select id="profile-qualification" onchange="document.getElementById('qualification-other-wrap').style.display = this.value === 'other' ? 'block' : 'none';" style="width:100%;padding:10px 14px;border:1.5px solid var(--border-color);border-radius:10px;font-size:0.85rem;font-family:inherit;outline:none;box-sizing:border-box;background:var(--bg-card);color:var(--text-primary);">
                <option value="">Select Qualification</option>
                <option value="sslc" ${cu.qualification === 'sslc' ? 'selected' : ''}>SSLC</option>
                <option value="plus two" ${cu.qualification === 'plus two' ? 'selected' : ''}>Plus Two</option>
                <option value="degree" ${cu.qualification === 'degree' ? 'selected' : ''}>Degree</option>
                <option value="pg" ${cu.qualification === 'pg' ? 'selected' : ''}>PG</option>
                <option value="other" ${cu.qualification === 'other' ? 'selected' : ''}>Other</option>
              </select>
            </div>
            
            <div class="form-group" id="qualification-other-wrap" style="display: ${cu.qualification === 'other' ? 'block' : 'none'};">
              <label>Specify Other Qualification</label>
              <input type="text" id="profile-qualification-other" value="${cu.qualificationOther || ''}" placeholder="Enter your qualification">
            </div>

            <div class="form-group"><label>Username</label><input type="text" value="${cu.username}" disabled style="opacity:0.6;"></div>
            <div class="form-group"><label>Role</label><input type="text" value="${cu.role}" disabled style="opacity:0.6;text-transform:capitalize;"></div>
            <div class="form-group"><label>Member Since</label><input type="text" value="${cu.registeredDate || new Date().toLocaleDateString('en-IN')}" disabled style="opacity:0.6;"></div>
            
            <!-- Hidden input to store profile photo Base64 data -->
            <input type="hidden" id="profile-photo-data" value="${cu.profilePhoto || ''}">
            
            <div class="form-group" style="grid-column: span 2;">
              <label>Profile Photo (Aspect Ratio 3:4 - Height 4, Width 3)</label>
              <div style="display:flex;align-items:center;gap:16px;margin-top:8px;">
                <div id="profile-photo-preview" style="width:90px;height:120px;border-radius:8px;border:2px dashed var(--border-color);display:flex;align-items:center;justify-content:center;background-size:cover;background-position:center;background-repeat:no-repeat;background-image:${cu.profilePhoto ? `url(${cu.profilePhoto})` : 'none'};">
                  ${cu.profilePhoto ? '' : '<span style="font-size:0.75rem;color:var(--text-muted);text-align:center;">3:4 Photo</span>'}
                </div>
                <div>
                  <input type="file" id="profile-photo-input" accept="image/*" style="display:none;" onchange="if(this.files[0]){window.resizeAndCropTo3x4(this.files[0], function(base64){document.getElementById('profile-photo-preview').style.backgroundImage = 'url('+base64+')'; document.getElementById('profile-photo-preview').innerHTML = ''; document.getElementById('profile-photo-data').value = base64;})}">
                  <button type="button" onclick="document.getElementById('profile-photo-input').click()" class="btn btn-secondary" style="padding:8px 16px;font-size:0.8rem;">Upload Photo</button>
                  <button type="button" onclick="document.getElementById('profile-photo-preview').style.backgroundImage = 'none'; document.getElementById('profile-photo-preview').innerHTML = '<span style=\'font-size:0.75rem;color:var(--text-muted);text-align:center;\'>3:4 Photo</span>'; document.getElementById('profile-photo-data').value = ''; document.getElementById('profile-photo-input').value = '';" class="btn btn-danger" style="padding:8px 16px;font-size:0.8rem;margin-left:8px;background:none;border:1px solid var(--danger);color:var(--danger);">Remove</button>
                  <div style="font-size:0.72rem;color:var(--text-muted);margin-top:6px;">Upload a portrait image. It will be resized and cropped to 3:4 aspect ratio.</div>
                </div>
              </div>
            </div>

          </div>
          <div class="form-group" style="margin-top:16px;"><label>New Password</label><input type="password" id="profile-password" placeholder="Leave blank to keep current password"></div>
          <button onclick="DashboardComponent._saveProfile()" class="btn btn-primary"><i class="fa-solid fa-save"></i> Save Changes</button>
        </div>

        <div class="glass-panel">
          <h3 style="margin-bottom:16px;color:var(--danger);"><i class="fa-solid fa-right-from-bracket" style="margin-right:8px;"></i>Account Actions</h3>
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <button onclick="window.app.logout()" class="btn btn-danger"><i class="fa-solid fa-sign-out-alt"></i> Logout</button>
          </div>
        </div>
      </div>
    `;
  },

  _saveProfile: function () {
    const cu = window.db.getCurrentUser();
    if (!cu) return;
    const newName = document.getElementById('profile-name')?.value;
    const newPwd = document.getElementById('profile-password')?.value;
    const newPhone = document.getElementById('profile-phone')?.value || '';

    const newWhatsapp = document.getElementById('profile-whatsapp')?.value || '';
    const newDob = document.getElementById('profile-dob')?.value || '';
    const newQual = document.getElementById('profile-qualification')?.value || '';
    const newQualOther = document.getElementById('profile-qualification-other')?.value || '';
    const newPhoto = document.getElementById('profile-photo-data')?.value || '';

    if (newName) cu.name = newName;
    if (newPwd && newPwd.length >= 6) cu.password = newPwd;
    cu.phone = newPhone;
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
    window.app.renderRoute();
  },

  init: function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Preserve active tab, default to 'overview'
    const tab = DashboardComponent._activeTab || 'overview';
    DashboardComponent._activeTab = tab;

    // Initial badge fetch
    DashboardComponent.updateSupportBadge();
    DashboardComponent.updateTutorChatBadge();

    // Periodic badge polling every 30 s (works even when student is on other tabs)
    if (DashboardComponent._badgePollInterval) clearInterval(DashboardComponent._badgePollInterval);
    DashboardComponent._badgePollInterval = setInterval(() => {
      DashboardComponent.updateSupportBadge();
      DashboardComponent.updateTutorChatBadge();
    }, 30000);

    document.querySelectorAll('.sidebar-nav-item[data-tab]').forEach(item => {
      item.addEventListener('click', () => {
        if (DashboardComponent._countdownInterval) {
          clearInterval(DashboardComponent._countdownInterval);
        }
        DashboardComponent._activeTab = item.getAttribute('data-tab');
        document.querySelectorAll('.sidebar-nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        if (DashboardComponent._activeTab === 'support') {
          DashboardComponent._loadAndRenderSupport();
        } else if (DashboardComponent._activeTab === 'tutor_chat') {
          DashboardComponent._loadAndRenderTutorChat();
        } else {
          DashboardComponent._activeConvId = null;
          DashboardComponent._activeTutorConvId = null;
          DashboardComponent._showNewForm = false;
          DashboardComponent._showNewTutorForm = false;
          const cu = window.db.getCurrentUser();
          if (!cu) return;
          const courses = window.db.getCourses();
          const enrolledCourses = courses.filter(c => (cu.enrolledCourses || []).includes(c.id));
          const wishlist = (cu.wishlist || []).map(id => courses.find(c => c.id === id)).filter(Boolean);
          const txns = window.db.getTransactions().filter(t => t.username === cu.username);
          const totalProgress = enrolledCourses.length > 0
            ? Math.round(enrolledCourses.reduce((sum, c) => {
              const p = window.db.getUserProgress(cu.username, c.id);
              const total = (c.modules || []).reduce((a, m) => a + (m.lessons || []).length, 0);
              const done = (p.completedLessons || []).length;
              return sum + (total > 0 ? (done / total) * 100 : 0);
            }, 0) / enrolledCourses.length)
            : 0;
          document.getElementById('student-tab-content').innerHTML = DashboardComponent._renderTab(DashboardComponent._activeTab, cu, enrolledCourses, wishlist, txns, totalProgress);
          if (DashboardComponent._activeTab === 'overview') {
            setTimeout(() => {
              if (window.DashboardRightPanel) window.DashboardRightPanel.bindEvents(cu);
            }, 50);
          }
        }
      });
    });

    // Initial binding on load or route refresh
    const cu = window.db.getCurrentUser();
    if (cu) {
      if (tab === 'support') {
        DashboardComponent._loadAndRenderSupport();
      } else if (tab === 'tutor_chat') {
        DashboardComponent._loadAndRenderTutorChat();
      } else if (tab === 'overview') {
        setTimeout(() => {
          if (window.DashboardRightPanel) window.DashboardRightPanel.bindEvents(cu);
        }, 100);
      }
    }
  },

  // =====================================================
  // LIVE CLASSES METHODS
  // =====================================================
  _renderLiveClasses: function (cu, enrolledCourses) {
    const enrolledBatches = cu.enrolledBatches || {};
    // Check if student has at least one active batch
    const activeBatchCount = Object.keys(enrolledBatches).filter(cid => {
      const bid = enrolledBatches[cid];
      const b = window.db.getBatchById(bid);
      return b && (b.status === 'Active' || b.status === 'Completed');
    }).length;

    if (activeBatchCount === 0) {
      return `
        <div class="glass-panel" style="text-align:center; padding:48px; border-radius:20px; max-width:600px; margin: 40px auto; border: 1px solid var(--border-color); background:var(--bg-secondary);">
          <div style="font-size:3.5rem; margin-bottom:20px;">🔒</div>
          <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-primary); margin-bottom:8px;">Live Classes Locked</h3>
          <p style="color:var(--text-secondary); font-size:0.9rem; line-height:1.6; margin-bottom:24px;">
            Your assigned batch is currently in the <strong>Enrollment Open</strong> state. Live Classes, Calendar, and schedule details will unlock automatically as soon as your batch status becomes <strong>Active</strong>.
          </p>
          <div style="font-size:0.8rem; color:var(--text-muted);">Thank you for your patience!</div>
        </div>
      `;
    }

    const courses = window.db.getCourses();
    const enrolledCourseIds = enrolledCourses.map(c => c.id);
    const enrolledBatchIds = Object.values(enrolledBatches);
    const liveClasses = window.db.getLiveClasses().filter(lc =>
      lc.status === 'published' &&
      (lc.batch_id ? enrolledBatchIds.includes(lc.batch_id) : enrolledCourseIds.includes(lc.course_id))
    );

    const upcoming = [];
    const past = [];

    const now = new Date();
    liveClasses.forEach(lc => {
      const [year, month, day] = lc.date.split('-');
      const [endH, endM] = lc.end_time.split(':');
      const classEnd = new Date(year, month - 1, day, endH, endM);

      if (classEnd > now) {
        upcoming.push(lc);
      } else {
        past.push(lc);
      }
    });

    upcoming.sort((a, b) => new Date(`${a.date}T${a.start_time}`) - new Date(`${b.date}T${b.start_time}`));
    past.sort((a, b) => new Date(`${b.date}T${b.start_time}`) - new Date(`${a.date}T${a.start_time}`));

    setTimeout(() => {
      DashboardComponent._startCountdowns();
    }, 100);

    return `
      <div>
        <h2 style="margin-bottom:24px;">Live Classes</h2>
        
        <div style="margin-bottom:32px;">
          <h3 style="margin-bottom:16px; display:flex; align-items:center; gap:8px;">
            <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:var(--brand-blue); box-shadow:0 0 8px var(--brand-blue);"></span>
            Upcoming Live Classes
          </h3>
          ${upcoming.length === 0 ? `
            <div style="text-align:center;padding:48px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-xl);color:var(--text-muted);">
              <div style="font-size:2.5rem;margin-bottom:12px;">📅</div>
              <p>No upcoming live classes scheduled for your courses.</p>
            </div>
          ` : `
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:20px;">
              ${upcoming.map(lc => {
      const course = courses.find(c => c.id === lc.course_id);
      return `
                  <div class="meet-card widget-card" data-class-date="${lc.date}T${lc.start_time}" data-meet-link="${lc.meet_link}">
                    <div style="font-size:0.75rem; font-weight:700; color:var(--brand-blue); text-transform:uppercase; margin-bottom:8px;">${course ? course.title : lc.course_id}</div>
                    <h4 style="font-size:1.05rem; font-weight:700; margin-bottom:8px; color:var(--text-primary);">${lc.title}</h4>
                    <p style="font-size:0.83rem; color:var(--text-muted); margin-bottom:16px; min-height:40px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${lc.description || 'No description provided.'}</p>
                    
                    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:14px; margin-bottom:14px;">
                      <div>
                        <div style="font-size:0.75rem; color:var(--text-muted);">Date & Time</div>
                        <div style="font-size:0.83rem; font-weight:700; color:var(--text-primary);">${lc.date} · ${lc.start_time}</div>
                      </div>
                      <div style="text-align:right;">
                        <div style="font-size:0.75rem; color:var(--text-muted);">Tutor</div>
                        <div style="font-size:0.83rem; font-weight:700; color:var(--text-primary);">${lc.tutor_id}</div>
                      </div>
                    </div>

                    <div class="countdown-widget" id="cd-${lc.id}" style="margin-bottom:16px;">
                      <div class="cd-unit">
                        <span class="cd-num" id="cd-${lc.id}-d">00</span>
                        <span class="cd-label">Days</span>
                      </div>
                      <div class="cd-unit">
                        <span class="cd-num" id="cd-${lc.id}-h">00</span>
                        <span class="cd-label">Hrs</span>
                      </div>
                      <div class="cd-unit">
                        <span class="cd-num" id="cd-${lc.id}-m">00</span>
                        <span class="cd-label">Min</span>
                      </div>
                      <div class="cd-unit">
                        <span class="cd-num" id="cd-${lc.id}-s">00</span>
                        <span class="cd-label">Sec</span>
                      </div>
                    </div>

                    <div id="btn-container-${lc.id}">
                      <button class="btn btn-sm btn-block btn-secondary" style="height: 40px; font-weight:700;" disabled><i class="fa-solid fa-lock" style="margin-right:6px;"></i>Class Starts Soon</button>
                    </div>
                  </div>
                `;
    }).join('')}
            </div>
          `}
        </div>

        <div>
          <h3 style="margin-bottom:16px; color:var(--text-secondary); display:flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-clock-rotate-left"></i>
            Past Classes & Recordings
          </h3>
          ${past.length === 0 ? `
            <div style="text-align:center;padding:32px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-xl);color:var(--text-muted);">
              <p>No past live classes recorded.</p>
            </div>
          ` : `
            <div class="glass-panel" style="padding:0;">
              <table class="data-table" style="margin-bottom:0;">
                <thead>
                  <tr>
                    <th>Course / Class</th>
                    <th>Date & Time</th>
                    <th>Recording</th>
                  </tr>
                </thead>
                <tbody>
                  ${past.map(lc => {
      const course = courses.find(c => c.id === lc.course_id);
      return `
                      <tr>
                        <td>
                          <div style="font-weight:700; color:var(--text-primary); font-size:0.85rem;">${course ? course.title : lc.course_id}</div>
                          <div style="font-size:0.8rem; color:var(--text-muted);">${lc.title}</div>
                        </td>
                        <td>
                          <div style="font-size:0.83rem; color:var(--text-primary); font-weight:600;">${lc.date}</div>
                          <div style="font-size:0.75rem; color:var(--text-muted);">${lc.start_time} - ${lc.end_time}</div>
                        </td>
                        <td>
                          ${lc.recording_url ? `
                            <button class="btn btn-outline-white btn-sm" onclick="DashboardComponent._showRecording('${lc.title}', '${lc.recording_url}')" style="font-size:0.75rem;"><i class="fa-solid fa-play" style="color:var(--brand-blue); margin-right:6px;"></i>Watch Recording</button>
                          ` : `
                            <span style="color:var(--text-muted); font-size:0.75rem; font-style:italic;">Processing...</span>
                          `}
                        </td>
                      </tr>
                    `;
    }).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </div>
    `;
  },

  _startCountdowns: function () {
    if (DashboardComponent._countdownInterval) {
      clearInterval(DashboardComponent._countdownInterval);
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      let activeTimers = 0;

      document.querySelectorAll('.meet-card[data-class-date]').forEach(card => {
        const idAttr = card.querySelector('.countdown-widget').id;
        const classId = idAttr.replace('cd-', '');
        const targetDateStr = card.getAttribute('data-class-date');
        const meetLink = card.getAttribute('data-meet-link');

        const [datePart, timePart] = targetDateStr.split('T');
        const [y, m, d] = datePart.split('-');
        const [hr, min] = timePart.split(':');
        const targetDate = new Date(y, m - 1, d, hr, min).getTime();

        const diff = targetDate - now;

        const dEl = document.getElementById(`cd-${classId}-d`);
        const hEl = document.getElementById(`cd-${classId}-h`);
        const mEl = document.getElementById(`cd-${classId}-m`);
        const sEl = document.getElementById(`cd-${classId}-s`);
        const btnContainer = document.getElementById(`btn-container-${classId}`);

        if (diff > 0) {
          activeTimers++;
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);

          if (dEl) dEl.textContent = days < 10 ? '0' + days : days;
          if (hEl) hEl.textContent = hours < 10 ? '0' + hours : hours;
          if (mEl) mEl.textContent = minutes < 10 ? '0' + minutes : minutes;
          if (sEl) sEl.textContent = seconds < 10 ? '0' + seconds : seconds;

          if (diff <= 10 * 60 * 1000) {
            if (btnContainer && !btnContainer.querySelector('.btn-primary')) {
              btnContainer.innerHTML = `
                <a href="${meetLink}" target="_blank" class="btn btn-sm btn-block btn-primary live-badge-glow" style="height: 40px; font-weight:700; line-height: 24px;"><i class="fa-solid fa-video" style="margin-right:6px;"></i>Join Live Class</a>
              `;
            }
          } else {
            if (btnContainer && !btnContainer.querySelector('.btn-secondary')) {
              btnContainer.innerHTML = `
                <button class="btn btn-sm btn-block btn-secondary" style="height: 40px; font-weight:700;" disabled><i class="fa-solid fa-lock" style="margin-right:6px;"></i>Class Starts Soon</button>
              `;
            }
          }
        } else {
          const classDuration = 2 * 60 * 60 * 1000;
          if (Math.abs(diff) < classDuration) {
            if (dEl) dEl.textContent = '00';
            if (hEl) hEl.textContent = '00';
            if (mEl) mEl.textContent = '00';
            if (sEl) sEl.textContent = '00';

            if (btnContainer && !btnContainer.querySelector('.btn-success')) {
              btnContainer.innerHTML = `
                <a href="${meetLink}" target="_blank" class="btn btn-sm btn-block btn-primary live-badge-glow" style="height: 40px; font-weight:700; background: #059669; border:none; line-height: 24px;"><i class="fa-solid fa-video" style="margin-right:6px;"></i>Class is Live (Join Now)</a>
              `;
            }
          } else {
            if (DashboardComponent._activeTab === 'liveclasses') {
              clearInterval(DashboardComponent._countdownInterval);
              window.app.renderRoute();
            }
          }
        }
      });

      if (activeTimers === 0) {
        clearInterval(DashboardComponent._countdownInterval);
      }
    };

    updateTimer();
    DashboardComponent._countdownInterval = setInterval(updateTimer, 1000);
  },

  _showRecording: function (title, url) {
    const overlay = document.createElement('div');
    overlay.className = 'tutor-modal-overlay';
    overlay.style.zIndex = '1100';
    overlay.innerHTML = `
      <div class="tutor-modal" style="max-width: 720px; padding:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3 style="margin:0;"><i class="fa-solid fa-play" style="color:var(--brand-blue); margin-right:8px;"></i>${title}</h3>
          <button class="btn btn-outline-white btn-sm btn-modal-close" style="width:32px; height:32px; padding:0; border-radius:50%;"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div style="position:relative; padding-bottom:56.25%; height:0; border-radius:12px; overflow:hidden; background:#000;">
          <iframe src="${url}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;" allowfullscreen></iframe>
        </div>
      </div>
    `;
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    overlay.querySelector('.btn-modal-close').addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  },

  // =====================================================
  // SUPPORT MESSAGING PORTAL METHODS
  // =====================================================
  updateSupportBadge: async function () {
    try {
      const cu = window.db.getCurrentUser();
      if (!cu) return;

      let unreadCount = 0;

      // Count actual unseen messages sent by admin/others to this student
      if (window.db.sb) {
        // Get conversations belonging to this student
        const { data: convs } = await window.db.sb
          .from('cubaze_support_conversations')
          .select('id')
          .eq('student_username', cu.username);

        if (convs && convs.length > 0) {
          const convIds = convs.map(c => c.id);
          const { count } = await window.db.sb
            .from('cubaze_support_messages')
            .select('id', { count: 'exact', head: true })
            .in('conversation_id', convIds)
            .neq('sender', cu.username)
            .eq('seen', false);
          unreadCount = count || 0;
        }
      } else {
        // Fallback: use unread_by_student boolean
        const convs = await window.db.getSupportConversations();
        unreadCount = convs.filter(c => c.unread_by_student && c.student_username === cu.username).length;
      }

      const el = document.getElementById('support-unread-badge');
      if (el) {
        if (unreadCount > 0) {
          el.textContent = unreadCount > 99 ? '99+' : unreadCount;
          el.style.display = 'inline-flex';
        } else {
          el.style.display = 'none';
        }
      }
    } catch (err) {
      console.error("Error updating support badge:", err);
    }
  },

  _loadAndRenderSupport: async function () {
    const container = document.getElementById('student-tab-content');
    if (!container) return;
    container.innerHTML = `<div style="text-align:center;padding:48px;"><div class="spinner"></div><p style="margin-top:12px;color:var(--text-muted);">Loading conversations...</p></div>`;

    DashboardComponent._initRealtime();

    try {
      const convs = await window.db.getSupportConversations();
      container.innerHTML = await DashboardComponent._renderSupportPortalHTML(convs);
      DashboardComponent._bindSupportPortalEvents(convs);
    } catch (err) {
      container.innerHTML = `<div class="alert alert-danger">Error: ${err.message}</div>`;
    }
  },

  _renderSupportPortalHTML: async function (convs) {
    const activeFilter = DashboardComponent._supportFilter || 'all';
    const search = DashboardComponent._supportSearch || '';
    
    let filtered = convs;
    if (activeFilter !== 'all') {
      filtered = convs.filter(c => c.status.toLowerCase() === activeFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(c => c.subject.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
    }

    let rightPaneHtml = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; min-height:400px; color:var(--text-muted); text-align:center; padding:32px;">
        <i class="fa-solid fa-headset" style="font-size:3.5rem; margin-bottom:16px; opacity:0.3; color:#0B5A43;"></i>
        <h3 style="margin:0 0 8px 0; font-weight:700;">No Conversation Selected</h3>
        <p style="margin:0; font-size:0.84rem; max-width:280px;">Select a support ticket from the sidebar list or click "Start New Conversation" to get help.</p>
      </div>
    `;

    if (DashboardComponent._activeConvId) {
      rightPaneHtml = await DashboardComponent._renderChatView(DashboardComponent._activeConvId);
    } else if (DashboardComponent._showNewForm) {
      rightPaneHtml = DashboardComponent._renderNewFormView();
    }

    return `
      <div class="dashboard-welcome">
        <h1>Talk with Admin</h1>
        <p>Need help? Contact the Cubaze Academy Admin directly.</p>
      </div>

      <div class="tutor-chat-layout" style="margin-top: 20px;">
        <div class="tutor-chat-sidebar">
          <div class="tutor-chat-sidebar-header">
            <div style="display:flex; gap:10px; align-items:center; width:100%;">
              <div class="search-input-wrapper" style="flex:1; box-sizing:border-box; margin:0;">
                <i class="fa-solid fa-magnifying-glass search-icon"></i>
                <input id="support-conv-search" placeholder="Search requests..." value="${search}">
              </div>
              <button class="btn btn-primary" id="btn-start-new-conv-icon" title="New Conversation" style="width:38px; height:38px; min-width:38px; padding:0; border-radius:50%; display:flex; align-items:center; justify-content:center;">
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
            <select id="support-conv-status-filter" style="width:100%; height:38px; padding:0 8px; border:1px solid var(--border-color); border-radius:var(--radius-md); background:var(--bg-primary); color:var(--text-primary); cursor:pointer;">
              <option value="all" ${activeFilter === 'all' ? 'selected' : ''}>All Statuses</option>
              <option value="open" ${activeFilter === 'open' ? 'selected' : ''}>Open</option>
              <option value="pending" ${activeFilter === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="resolved" ${activeFilter === 'resolved' ? 'selected' : ''}>Resolved</option>
            </select>
          </div>
          <div class="tutor-chat-list">
            ${filtered.length === 0 ? `
              <div style="text-align:center; padding:32px; color:var(--text-muted); font-size:0.8rem; font-style:italic;">No support tickets found.</div>
            ` : filtered.map(c => {
              const activeClass = DashboardComponent._activeConvId === c.id ? 'active' : '';
              const relativeTime = DashboardComponent._getRelativeTime(c.last_reply_at);
              return `
                <div class="tutor-chat-list-item ${activeClass}" data-conv-id="${c.id}">
                  <div class="tutor-chat-list-item-avatar" style="background:#0B5A43;">
                    <i class="fa-solid fa-headset" style="font-size:0.95rem;"></i>
                  </div>
                  <div class="tutor-chat-list-item-content">
                    <div class="tutor-chat-list-item-meta">
                      <span class="tutor-chat-list-item-name" style="font-weight:700;">${c.category}</span>
                      <span class="tutor-chat-list-item-time">${relativeTime}</span>
                    </div>
                    <div class="tutor-chat-list-item-msg" style="font-size:0.75rem; color:var(--text-muted); margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                      Subject: ${c.subject}
                    </div>
                    <div class="tutor-chat-list-item-badges">
                      <span class="support-prio-badge ${c.priority.toLowerCase()}" style="font-size:0.62rem; padding:1px 6px;">${c.priority}</span>
                      <div style="display:flex; align-items:center; gap:6px;">
                        <span class="status-badge ${c.status === 'Resolved' ? 'success' : c.status === 'Pending' ? 'pending' : 'danger'}" style="font-size:0.62rem; padding:1px 6px;">${c.status}</span>
                        ${c.unread_by_student ? `<span class="tutor-chat-list-item-badge">1</span>` : ''}
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="glass-panel" style="padding:0; overflow:hidden; display:flex; flex-direction:column; height:100%;">
          ${rightPaneHtml}
        </div>
      </div>
    `;
  },

  _bindSupportPortalEvents: function (convs) {
    const searchInput = document.getElementById('support-conv-search');
    searchInput?.addEventListener('input', (e) => {
      DashboardComponent._supportSearch = e.target.value;
      DashboardComponent._loadAndRenderSupport();
    });

    const filterSelect = document.getElementById('support-conv-status-filter');
    filterSelect?.addEventListener('change', (e) => {
      DashboardComponent._supportFilter = e.target.value;
      DashboardComponent._loadAndRenderSupport();
    });

    document.getElementById('btn-start-new-conv-icon')?.addEventListener('click', () => {
      DashboardComponent._showNewForm = true;
      DashboardComponent._activeConvId = null;
      DashboardComponent._loadAndRenderSupport();
    });

    document.querySelectorAll('.tutor-chat-list-item').forEach(item => {
      item.addEventListener('click', () => {
        const convId = item.getAttribute('data-conv-id');
        DashboardComponent._activeConvId = convId;
        DashboardComponent._showNewForm = false;
        DashboardComponent._loadAndRenderSupport();
      });
    });

    if (DashboardComponent._activeConvId) {
      DashboardComponent._bindChatViewEvents(DashboardComponent._activeConvId);
    } else if (DashboardComponent._showNewForm) {
      DashboardComponent._bindNewFormEvents();
    }
  },

  _initRealtime: function () {
    if (DashboardComponent._realtimeChannel) return;
    DashboardComponent._realtimeChannel = window.db.subscribeToSupportRealtime((e) => {
      if (DashboardComponent._activeTab === 'support') {
        const cu = window.db.getCurrentUser();
        if (e.type === 'message' && e.payload.new && e.payload.new.sender !== cu.username) {
          if (DashboardComponent._activeConvId === e.payload.new.conversation_id) {
            DashboardComponent._refreshChatMessagesOnly(DashboardComponent._activeConvId);
            window.db.markMessagesAsSeen(DashboardComponent._activeConvId, 'student');
          } else {
            window.app.showToast(`New message from Admin: "${e.payload.new.message.substring(0, 30)}..."`, 'info');
            DashboardComponent._loadAndRenderSupport();
          }
        } else if (e.type === 'conversation') {
          DashboardComponent._loadAndRenderSupport();
        }
      } else {
        DashboardComponent.updateSupportBadge();
      }
    });
  },

  _renderSupportList: function (convs) {
    const activeFilter = DashboardComponent._supportFilter || 'all';
    let filtered = convs;
    if (activeFilter !== 'all') {
      filtered = convs.filter(c => c.status.toLowerCase() === activeFilter);
    }

    return `
      <div style="display:flex; flex-direction:column; gap:24px;">
        <div class="dashboard-welcome">
          <h2>Talk with Admin</h2>
          <p>Need help? Contact the Cubaze Academy Admin directly.</p>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div class="support-filter-tabs">
            <button class="support-filter-tab ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>
            <button class="support-filter-tab ${activeFilter === 'open' ? 'active' : ''}" data-filter="open">Open</button>
            <button class="support-filter-tab ${activeFilter === 'pending' ? 'active' : ''}" data-filter="pending">Pending</button>
            <button class="support-filter-tab ${activeFilter === 'resolved' ? 'active' : ''}" data-filter="resolved">Resolved</button>
          </div>
          <button class="btn btn-primary" id="btn-start-new-conv"><i class="fa-solid fa-plus" style="margin-right:6px;"></i>Start New Conversation</button>
        </div>

        <div style="display:flex; flex-direction:column; gap:16px;" id="conversations-list-container">
          ${filtered.length === 0 ? `
            <div style="text-align:center; padding:48px; background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-xl); color:var(--text-muted);">
              <i class="fa-solid fa-comments" style="font-size:2.5rem; margin-bottom:12px; color:var(--text-muted);"></i>
              <p>No conversations found under this filter.</p>
            </div>
          ` : filtered.map(c => {
      const relativeTime = DashboardComponent._getRelativeTime(c.last_reply_at);
      return `
              <div class="glass-panel support-conv-card" data-conv-id="${c.id}" style="padding:20px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; gap:16px; transition:border-color 0.2s; border: 1.5px solid ${c.unread_by_student ? 'var(--brand-blue)' : 'var(--border-color)'};">
                <div style="display:flex; flex-direction:column; gap:8px; flex:1;">
                  <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <h4 style="margin:0; font-weight:700; color:var(--text-primary); font-size:0.95rem;">${c.subject}</h4>
                    <span class="support-cat-badge">${c.category}</span>
                    <span class="support-prio-badge ${c.priority.toLowerCase()}">${c.priority}</span>
                    ${c.unread_by_student ? `<span class="badge" style="background:#ef4444; color:#fff; font-size:0.65rem; padding:2px 6px;">New Reply</span>` : ''}
                  </div>
                  <div style="font-size:0.78rem; color:var(--text-muted);">
                    Last reply ${relativeTime} · Created ${new Date(c.created_at).toLocaleDateString('en-IN')}
                  </div>
                </div>
                <div style="display:flex; align-items:center; gap:16px;">
                  <span class="status-badge ${c.status === 'Resolved' ? 'success' : c.status === 'Pending' ? 'pending' : 'danger'}" style="text-transform: capitalize;">${c.status}</span>
                  <button class="btn btn-outline-white btn-sm">Open Chat <i class="fa-solid fa-chevron-right" style="margin-left:6px; font-size:0.7rem;"></i></button>
                </div>
              </div>
            `;
    }).join('')}
        </div>
      </div>
    `;
  },

  _renderNewFormView: function () {
    return `
      <div style="display:flex; flex-direction:column; gap:20px; padding:24px; overflow-y:auto; height:100%; box-sizing:border-box;">
        <div style="display:flex; align-items:center; gap:12px;">
          <button class="btn btn-outline-white btn-sm" id="btn-back-to-list" style="width:36px; height:36px; padding:0; border-radius:50%;"><i class="fa-solid fa-arrow-left"></i></button>
          <h2 style="margin:0; font-weight:800; font-size:1.4rem;">New Support Conversation</h2>
        </div>

        <div class="support-form-card">
          <form id="form-new-support">
            <div class="form-group" style="margin-bottom:18px;">
              <label style="font-weight:600; margin-bottom:6px; display:block;">Subject *</label>
              <input type="text" id="new-support-subject" required placeholder="Brief summary of your request" class="form-control" style="width:100%; box-sizing:border-box;">
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:18px;">
              <div class="form-group">
                <label style="font-weight:600; margin-bottom:6px; display:block;">Category *</label>
                <select id="new-support-category" required style="width:100%; box-sizing:border-box; height:46px; padding: 0 12px; border:1px solid var(--border-color); border-radius:var(--radius-md); background:var(--bg-primary); color:var(--text-primary);">
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Course Access">Course Access</option>
                  <option value="Payment">Payment</option>
                  <option value="Live Class">Live Class</option>
                  <option value="Certificate">Certificate</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Feature Request">Feature Request</option>
                </select>
              </div>
              <div class="form-group">
                <label style="font-weight:600; margin-bottom:6px; display:block;">Priority *</label>
                <select id="new-support-priority" required style="width:100%; box-sizing:border-box; height:46px; padding: 0 12px; border:1px solid var(--border-color); border-radius:var(--radius-md); background:var(--bg-primary); color:var(--text-primary);">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div class="form-group" style="margin-bottom:18px;">
              <label style="font-weight:600; margin-bottom:6px; display:block;">Message *</label>
              <textarea id="new-support-message" required placeholder="Describe your issue in detail..." style="width:100%; min-height:120px; box-sizing:border-box; resize:vertical; padding:12px;" class="form-control"></textarea>
            </div>

            <div class="form-group" style="margin-bottom:18px;">
              <label style="font-weight:600; margin-bottom:6px; display:block;">File Attachment (Optional)</label>
              <input type="file" id="new-support-file" style="display:block; font-size:0.85rem;" accept=".png,.jpg,.jpeg,.webp,.gif,.pdf,.zip,.rar,.mp4,.webm,.mov,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt">
              <span style="font-size:0.72rem; color:var(--text-muted); margin-top:4px; display:block;">Supported types: Images, PDF, ZIP, Videos, Docs (Max 10MB)</span>
            </div>

            <div class="form-group" style="margin-bottom:24px;">
              <label style="font-weight:600; margin-bottom:6px; display:block;">External Cloud Storage Link (Optional)</label>
              <div class="support-link-input-wrapper" style="max-width:100%;">
                <i class="fa-solid fa-link"></i>
                <input type="url" id="new-support-link" placeholder="Google Drive, OneDrive, Dropbox, WeTransfer etc.">
              </div>
            </div>

            <button type="submit" class="btn btn-primary" id="new-support-submit-btn" style="padding:12px 24px;"><i class="fa-solid fa-paper-plane" style="margin-right:8px;"></i>Submit Request</button>
          </form>
        </div>
      </div>
    `;
  },

  _renderChatView: async function (convId) {
    const convs = await window.db.getSupportConversations();
    const conv = convs.find(c => c.id === convId);
    if (!conv) return `<div class="alert alert-danger">Conversation not found.</div>`;

    const messages = await window.db.getSupportMessages(convId);
    const cu = window.db.getCurrentUser();
    const hasBeenRated = conv.rating !== null && conv.rating !== undefined;

    return `
      <div class="support-chat-container">

        <!-- Contact Header Bar -->
        <div class="support-chat-header">
          <div style="display:flex; align-items:center; gap:10px; flex:1; min-width:0;">
            <button class="support-chat-header-back" id="btn-back-to-list-chat" style="margin-right:4px;">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
            <div class="support-chat-header-avatar" style="background:#0b5a43;">
              <i class="fa-solid fa-headset" style="font-size:1rem; color:#fff;"></i>
            </div>
            <div class="support-chat-header-info">
              <div class="support-chat-title">Cubaze Support</div>
              <div class="support-chat-subtitle">${conv.category} · <span style="font-weight:700;">${conv.status}</span></div>
            </div>
          </div>
          <div class="support-chat-header-actions">
            <button title="Search"><i class="fa-solid fa-magnifying-glass"></i></button>
            <button title="More"><i class="fa-solid fa-ellipsis-vertical"></i></button>
          </div>
        </div>

        <!-- Messages -->
        <div class="support-chat-messages" id="support-chat-thread">
          <div class="support-chat-date-label">Today</div>
          <div class="support-chat-encrypt-notice">
            <i class="fa-solid fa-lock" style="margin-right:6px; font-size:0.75rem;"></i>
            Messages and calls are secured with end-to-end encryption. Your admin will respond shortly.
          </div>
          ${messages.map(m => {
            const isOwn = m.sender === cu.username;
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

            return `
                      <div class="support-msg-wrapper ${isOwn ? 'student-align' : 'admin-align'}">
                        <div class="support-msg-bubble">
                          <div style="font-weight:600; font-size:0.75rem; opacity:0.8; margin-bottom:4px; color:${isOwn ? '#3b82f6' : '#0B5A43'};">${isOwn ? 'You' : 'Cubaze Admin'}</div>
                          <div style="font-size:0.86rem; white-space:pre-wrap;">${m.message}</div>
                          ${attachmentHtml}
                          ${linkHtml}
                        </div>
                        <div class="support-msg-meta">
                          <span>${dateStr}</span>
                          ${isOwn ? `<i class="fa-solid ${m.seen ? 'fa-check-double seen' : 'fa-check unseen'} support-msg-seen-icon"></i>` : ''}
                        </div>
                      </div>
                    `;
          }).join('')}
        </div>

        ${conv.status === 'Resolved' ? `
          <div style="padding:24px; background:var(--bg-card); border-top:1px solid var(--border-color); text-align:center;">
            <h4 style="margin:0 0 8px 0; font-weight:700;"><i class="fa-solid fa-circle-check" style="color:var(--success); margin-right:6px;"></i>This ticket has been marked as Resolved</h4>
            
            ${hasBeenRated ? `
              <p style="color:var(--text-muted); font-size:0.83rem; margin:8px 0;">You rated this support session <strong>${conv.rating} Stars</strong></p>
              ${conv.feedback ? `<p style="font-size:0.83rem; color:var(--text-secondary); background:var(--bg-primary); padding:10px; border-radius:6px; display:inline-block; max-width:400px; margin:0; border:1px solid var(--border-color); font-style:italic;">"${conv.feedback}"</p>` : ''}
            ` : `
              <p style="color:var(--text-secondary); font-size:0.85rem; margin-bottom:12px;">How would you rate the support you received?</p>
              <div class="support-star-rating" id="support-rating-stars">
                <i class="fa-regular fa-star" data-val="1"></i>
                <i class="fa-regular fa-star" data-val="2"></i>
                <i class="fa-regular fa-star" data-val="3"></i>
                <i class="fa-regular fa-star" data-val="4"></i>
                <i class="fa-regular fa-star" data-val="5"></i>
              </div>
              <div style="margin-top:12px; display:none;" id="rating-feedback-area">
                <textarea id="rating-feedback-text" placeholder="Share your experience (Optional)..." style="width:100%; max-width:450px; min-height:60px; border-radius:8px; padding:10px; font-size:0.8rem; border:1px solid var(--border-color); background:var(--bg-primary); color:var(--text-primary); resize:vertical; box-sizing:border-box; margin-bottom:12px; font-family:inherit;"></textarea>
                <div>
                  <button class="btn btn-primary btn-sm" id="btn-submit-rating" style="padding:8px 18px;">Submit Feedback</button>
                </div>
              </div>
            `}
          </div>
        ` : `
          <div class="support-chat-input-wrapper">
            <div class="support-chat-attachments-row">
              <div class="support-chat-attach-btn" title="Attach file">
                <i class="fa-solid fa-paperclip"></i>
                <input type="file" id="chat-upload-file">
              </div>
              <div id="chat-file-selected-chip" style="display:none;"></div>

              <div class="support-link-input-wrapper">
                <i class="fa-solid fa-link"></i>
                <input type="url" id="chat-external-link" placeholder="Cloud Storage File Link">
              </div>
            </div>

            <div class="support-chat-input-row">
              <button class="support-chat-emoji-btn" id="btn-support-emoji" title="Emoji">😊</button>
              <textarea class="support-chat-input-textarea" id="chat-message-text" placeholder="Type reply..." rows="1"></textarea>
              <button class="btn btn-primary" id="btn-send-message"><i class="fa-solid fa-paper-plane" style="font-size:1rem;"></i></button>
            </div>
          </div>
        `}
      </div>
    `;
  },

  _refreshChatMessagesOnly: async function (convId) {
    const thread = document.getElementById('support-chat-thread');
    if (!thread) return;

    try {
      const messages = await window.db.getSupportMessages(convId);
      const cu = window.db.getCurrentUser();

      thread.innerHTML = `
        <div class="support-chat-date-label">Today</div>
        <div class="support-chat-encrypt-notice">
          <i class="fa-solid fa-lock" style="margin-right:6px; font-size:0.75rem;"></i>
          Messages and calls are secured with end-to-end encryption. Your admin will respond shortly.
        </div>
      ` + messages.map(m => {
        const isOwn = m.sender === cu.username;
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

        return `
          <div class="support-msg-wrapper ${isOwn ? 'student-align' : 'admin-align'}">
            <div class="support-msg-bubble">
              <div style="font-weight:600; font-size:0.75rem; opacity:0.8; margin-bottom:4px; color:${isOwn ? '#3b82f6' : '#0B5A43'};">${isOwn ? 'You' : 'Cubaze Admin'}</div>
              <div style="font-size:0.86rem; white-space:pre-wrap;">${m.message}</div>
              ${attachmentHtml}
              ${linkHtml}
            </div>
            <div class="support-msg-meta">
              <span>${dateStr}</span>
              ${isOwn ? `<i class="fa-solid ${m.seen ? 'fa-check-double seen' : 'fa-check unseen'} support-msg-seen-icon"></i>` : ''}
            </div>
          </div>
        `;
      }).join('');

      thread.scrollTop = thread.scrollHeight;
    } catch (err) {
      console.error("Error refreshing chat messages:", err);
    }
  },

  _bindSupportListEvents: function () {
    document.querySelectorAll('.support-filter-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        DashboardComponent._supportFilter = btn.getAttribute('data-filter');
        DashboardComponent._loadAndRenderSupport();
      });
    });

    document.getElementById('btn-start-new-conv')?.addEventListener('click', () => {
      DashboardComponent._showNewForm = true;
      DashboardComponent._loadAndRenderSupport();
    });

    document.querySelectorAll('.support-conv-card').forEach(card => {
      card.addEventListener('click', () => {
        DashboardComponent._activeConvId = card.getAttribute('data-conv-id');
        // Immediately hide badge (optimistic clear) when student opens a conversation
        const badge = document.getElementById('support-unread-badge');
        if (badge) badge.style.display = 'none';
        DashboardComponent._loadAndRenderSupport();
      });
    });
  },

  _bindNewFormEvents: function () {
    document.getElementById('btn-back-to-list')?.addEventListener('click', () => {
      DashboardComponent._showNewForm = false;
      DashboardComponent._loadAndRenderSupport();
    });

    const fileInput = document.getElementById('new-support-file');
    let selectedFile = null;
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        selectedFile = e.target.files[0] || null;
      });
    }

    document.getElementById('form-new-support')?.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('new-support-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="margin-right:8px;"></i>Submitting...`;
      }

      const subject = document.getElementById('new-support-subject').value;
      const category = document.getElementById('new-support-category').value;
      const priority = document.getElementById('new-support-priority').value;
      const message = document.getElementById('new-support-message').value;
      const externalLink = document.getElementById('new-support-link').value;

      try {
        let fileData = null;
        if (selectedFile) {
          fileData = await window.db.uploadSupportAttachment(selectedFile);
        }

        const res = await window.db.createSupportConversation(subject, category, priority, message, fileData, externalLink);
        if (res.success) {
          window.app.showToast("Support ticket created successfully!", "success");
          DashboardComponent._showNewForm = false;
          DashboardComponent._activeConvId = res.conversationId;
          DashboardComponent._loadAndRenderSupport();
        } else {
          window.app.showToast(res.error || "Failed to submit request", "danger");
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane" style="margin-right:8px;"></i>Submit Request`;
          }
        }
      } catch (err) {
        window.app.showToast(err.message || "An error occurred", "danger");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane" style="margin-right:8px;"></i>Submit Request`;
        }
      }
    });
  },

  _bindChatViewEvents: function (convId) {
    document.getElementById('btn-back-to-list-chat')?.addEventListener('click', () => {
      DashboardComponent._activeConvId = null;
      DashboardComponent._loadAndRenderSupport();
    });

    const thread = document.getElementById('support-chat-thread');
    if (thread) {
      thread.scrollTop = thread.scrollHeight;
    }

    let chatSelectedFile = null;
    const fileInput = document.getElementById('chat-upload-file');
    const chip = document.getElementById('chat-file-selected-chip');

    if (fileInput && chip) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          chatSelectedFile = file;
          chip.innerHTML = `
            <i class="fa-solid fa-file-lines"></i>
            <span>${file.name.substring(0, 15)}...</span>
            <i class="fa-solid fa-circle-xmark remove-file" style="margin-left:6px; cursor:pointer;" id="chat-remove-attached-file"></i>
          `;
          chip.className = 'support-file-selected-chip';
          chip.style.display = 'flex';

          document.getElementById('chat-remove-attached-file')?.addEventListener('click', () => {
            chatSelectedFile = null;
            fileInput.value = '';
            chip.style.display = 'none';
          });
        }
      });
    }

    const sendBtn = document.getElementById('btn-send-message');
    const msgTextarea = document.getElementById('chat-message-text');
    const extLinkInput = document.getElementById('chat-external-link');

    const handleSend = async () => {
      const text = msgTextarea ? msgTextarea.value.trim() : '';
      const extLink = extLinkInput ? extLinkInput.value.trim() : '';

      if (!text && !chatSelectedFile && !extLink) {
        return;
      }

      if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
      }

      try {
        let fileData = null;
        if (chatSelectedFile) {
          fileData = await window.db.uploadSupportAttachment(chatSelectedFile);
        }

        const res = await window.db.sendSupportMessage(convId, text, fileData, extLink, false);
        if (res.success) {
          if (msgTextarea) msgTextarea.value = '';
          if (extLinkInput) extLinkInput.value = '';
          chatSelectedFile = null;
          if (fileInput) fileInput.value = '';
          if (chip) chip.style.display = 'none';

          DashboardComponent._loadAndRenderSupport();
        } else {
          window.app.showToast(res.error || "Failed to send message", "danger");
        }
      } catch (err) {
        window.app.showToast(err.message || "An error occurred", "danger");
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

    window.initEmojiPicker('btn-support-emoji', 'chat-message-text');

    const stars = document.querySelectorAll('#support-rating-stars i');
    const feedbackArea = document.getElementById('rating-feedback-area');
    let ratingValue = 0;

    stars.forEach(star => {
      star.addEventListener('mouseover', () => {
        const val = parseInt(star.getAttribute('data-val'));
        stars.forEach(s => {
          const sVal = parseInt(s.getAttribute('data-val'));
          s.classList.toggle('hovered', sVal <= val);
        });
      });

      star.addEventListener('mouseout', () => {
        stars.forEach(s => s.classList.remove('hovered'));
      });

      star.addEventListener('click', () => {
        ratingValue = parseInt(star.getAttribute('data-val'));
        stars.forEach(s => {
          const sVal = parseInt(s.getAttribute('data-val'));
          s.classList.toggle('selected', sVal <= ratingValue);
          if (sVal <= ratingValue) {
            s.classList.remove('fa-regular');
            s.classList.add('fa-solid');
          } else {
            s.classList.remove('fa-solid');
            s.classList.add('fa-regular');
          }
        });
        if (feedbackArea) {
          feedbackArea.style.display = 'block';
        }
      });
    });

    document.getElementById('btn-submit-rating')?.addEventListener('click', async () => {
      const comment = document.getElementById('rating-feedback-text').value;
      const res = await window.db.rateSupportConversation(convId, ratingValue, comment);
      if (res.success) {
        window.app.showToast("Thank you for your rating and feedback!", "success");
        DashboardComponent._loadAndRenderSupport();
      } else {
        window.app.showToast(res.error || "Failed to submit rating", "danger");
      }
    });
  },

  _getRelativeTime: function (isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDays === 1) return 'yesterday';
    return `${diffDays} days ago`;
  },

  // ============================================================
  // STUDENT-TUTOR MESSAGING
  // ============================================================
  updateTutorChatBadge: async function () {
    try {
      const cu = window.db.getCurrentUser();
      if (!cu) return;

      let unreadCount = 0;

      if (window.db.sb) {
        // Count actual unseen tutor messages for this student
        const { data: convs } = await window.db.sb
          .from('cubaze_tutor_conversations')
          .select('id')
          .eq('student_username', cu.username);

        if (convs && convs.length > 0) {
          const convIds = convs.map(c => c.id);
          const { count } = await window.db.sb
            .from('cubaze_tutor_messages')
            .select('id', { count: 'exact', head: true })
            .in('conversation_id', convIds)
            .neq('sender', cu.username)
            .eq('seen', false);
          unreadCount = count || 0;
        }
      } else {
        // Fallback: use unread_by_student boolean
        const convs = await window.db.getTutorConversations();
        unreadCount = convs.filter(c => c.unread_by_student).length;
      }

      const el = document.getElementById('tutor-chat-unread-badge');
      if (el) {
        if (unreadCount > 0) {
          el.textContent = unreadCount > 99 ? '99+' : unreadCount;
          el.style.display = 'inline-flex';
        } else {
          el.style.display = 'none';
        }
      }
    } catch (err) {
      console.error("Error updating tutor chat badge:", err);
    }
  },

  _loadAndRenderTutorChat: async function () {
    const content = document.getElementById('student-tab-content');
    if (!content) return;

    DashboardComponent._initTutorRealtime();

    const cu = window.db.getCurrentUser();
    if (!cu) return;

    if (DashboardComponent._showNewTutorForm) {
      content.innerHTML = DashboardComponent._renderNewTutorConvForm();
      DashboardComponent._bindNewTutorFormEvents();
      return;
    }

    content.innerHTML = `<div style="text-align:center;padding:48px;"><div class="spinner"></div><p style="margin-top:12px;color:var(--text-muted);">Loading tutors and chats...</p></div>`;

    try {
      const enrolledBatches = cu.enrolledBatches || {};
      const activeBatchCount = Object.keys(enrolledBatches).filter(cid => {
        const bid = enrolledBatches[cid];
        const b = window.db.getBatchById(bid);
        return b && (b.status === 'Active' || b.status === 'Completed');
      }).length;

      if (activeBatchCount === 0) {
        content.innerHTML = `
          <div class="glass-panel" style="text-align:center; padding:48px; border-radius:20px; max-width:600px; margin: 40px auto; border: 1px solid var(--border-color); background:var(--bg-secondary);">
            <div style="font-size:3.5rem; margin-bottom:20px;">🔒</div>
            <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-primary); margin-bottom:8px;">Tutor Chat Locked</h3>
            <p style="color:var(--text-secondary); font-size:0.9rem; line-height:1.6; margin-bottom:24px;">
              Direct messaging and QA support with your instructors will unlock automatically as soon as your batch status becomes <strong>Active</strong>.
            </p>
            <div style="font-size:0.8rem; color:var(--text-muted);">Thank you for your patience!</div>
          </div>
        `;
        return;
      }

      const tutors = window.db.getTutorsForStudent(cu.username);
      let convs = await window.db.getTutorConversations();
      convs = convs.filter(c => {
        const bid = enrolledBatches[c.course_id];
        const b = bid ? window.db.getBatchById(bid) : null;
        return b && (b.status === 'Active' || b.status === 'Completed');
      });
      content.innerHTML = await DashboardComponent._renderTutorChatPortal(tutors, convs);
      DashboardComponent._bindTutorChatPortalEvents(tutors, convs);

      if (DashboardComponent._activeTutorConvId) {
        await window.db.markTutorMessagesAsSeen(DashboardComponent._activeTutorConvId, 'student');
      }
      DashboardComponent.updateTutorChatBadge();
    } catch (err) {
      content.innerHTML = `<div class="alert alert-danger">Error: ${err.message}</div>`;
    }
  },

  _initTutorRealtime: function () {
    if (DashboardComponent._tutorRealtimeChannel) return;
    DashboardComponent._tutorRealtimeChannel = window.db.subscribeToTutorRealtime((e) => {
      if (DashboardComponent._activeTab === 'tutor_chat') {
        if (e.type === 'message' && e.payload.new) {
          const cu = window.db.getCurrentUser();
          if (e.payload.new.sender !== cu.username) {
            if (DashboardComponent._activeTutorConvId === e.payload.new.conversation_id) {
              DashboardComponent._refreshTutorChatMessagesOnly(DashboardComponent._activeTutorConvId);
              window.db.markTutorMessagesAsSeen(DashboardComponent._activeTutorConvId, 'student');
            } else {
              window.app.showToast(`New reply from @${e.payload.new.sender}!`, 'info');
              DashboardComponent._loadAndRenderTutorChat();
            }
          }
        } else if (e.type === 'conversation') {
          DashboardComponent._loadAndRenderTutorChat();
        }
      } else {
        DashboardComponent.updateTutorChatBadge();
      }
    });
  },

  _refreshTutorChatMessagesOnly: async function (convId) {
    const thread = document.getElementById('tutor-chat-thread');
    if (!thread) return;

    try {
      const messages = await window.db.getTutorMessages(convId);
      const convs = await window.db.getTutorConversations();
      const conv = convs.find(c => c.id === convId);
      const cu = window.db.getCurrentUser();

      thread.innerHTML = `
        <div class="support-chat-date-label">Today</div>
        <div class="support-chat-encrypt-notice">
          <i class="fa-solid fa-lock" style="margin-right:6px; font-size:0.75rem;"></i>
          Messages with your instructor are end-to-end secured. Only you and your tutor can read them.
        </div>
      ` + messages.map(m => {
        const isOwn = m.sender === cu.username;
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

        return `
          <div class="support-msg-wrapper ${isOwn ? 'student-align' : 'admin-align'}">
            <div class="support-msg-bubble">
              <div style="font-weight:600; font-size:0.75rem; opacity:0.8; margin-bottom:4px; color:${isOwn ? '#3b82f6' : '#0B5A43'};">${isOwn ? 'You' : (conv ? `@${conv.tutor_username} (Tutor)` : 'Tutor')}</div>
              <div style="font-size:0.86rem; white-space:pre-wrap;">${m.message}</div>
              ${attachmentHtml}
              ${linkHtml}
            </div>
            <div class="support-msg-meta">
              <span>${dateStr}</span>
              ${isOwn ? `<i class="fa-solid ${m.seen ? 'fa-check-double seen' : 'fa-check unseen'} support-msg-seen-icon"></i>` : ''}
            </div>
          </div>
        `;
      }).join('');

      thread.scrollTop = thread.scrollHeight;
    } catch (err) {
      console.error("Error refreshing tutor chat:", err);
    }
  },

  _renderTutorChatPortal: async function (tutors, convs) {
    const activeSubTab = DashboardComponent._tutorSubTab || 'tutors';
    const search = DashboardComponent._tutorConvSearch || '';

    let filteredConvs = convs;
    if (search) {
      const q = search.toLowerCase();
      filteredConvs = filteredConvs.filter(c => c.tutor_username.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q));
    }

    let chatsContentHtml = '';
    if (activeSubTab === 'chats') {
      let rightPaneHtml = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; min-height:400px; color:var(--text-muted); text-align:center; padding:32px;">
          <i class="fa-solid fa-comments" style="font-size:3.5rem; margin-bottom:16px; opacity:0.3; color:var(--brand-blue);"></i>
          <h3 style="margin:0 0 8px 0; font-weight:700;">No Conversation Selected</h3>
          <p style="margin:0; font-size:0.84rem; max-width:280px;">Select a tutor conversation from the sidebar list to view the message thread and reply.</p>
        </div>
      `;

      if (DashboardComponent._activeTutorConvId) {
        rightPaneHtml = await DashboardComponent._renderTutorConversationView(DashboardComponent._activeTutorConvId);
      }

      chatsContentHtml = `
        <div class="tutor-chat-layout">
          <div class="tutor-chat-sidebar">
            <div class="tutor-chat-sidebar-header">
              <div class="search-input-wrapper" style="width:100%; box-sizing:border-box; margin:0;">
                <i class="fa-solid fa-magnifying-glass search-icon"></i>
                <input id="tutor-conv-search" placeholder="Search chats..." value="${search}">
              </div>
            </div>
            <div class="tutor-chat-list">
              ${filteredConvs.length === 0 ? `
                <div style="text-align:center; padding:32px; color:var(--text-muted); font-size:0.8rem; font-style:italic;">No active chats found.</div>
              ` : filteredConvs.map(c => {
                const activeClass = DashboardComponent._activeTutorConvId === c.id ? 'active' : '';
                const lastActiveStr = DashboardComponent._getRelativeTime(c.last_reply_at);
                const isUnread = c.unread_by_student;
                return `
                  <div class="tutor-chat-list-item ${activeClass}" data-conv-id="${c.id}">
                    <div class="tutor-chat-list-item-avatar" style="background:${window.getAvatarColor(c.tutor_username)};">
                      ${c.tutor_username ? c.tutor_username.charAt(0).toUpperCase() : 'T'}
                    </div>
                    <div class="tutor-chat-list-item-content">
                      <div class="tutor-chat-list-item-meta">
                        <span class="tutor-chat-list-item-name">@${c.tutor_username}</span>
                        <span class="tutor-chat-list-item-time">${lastActiveStr}</span>
                      </div>
                      <div class="tutor-chat-list-item-msg" style="font-size:0.75rem; color:var(--text-muted); margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                        Subject: ${c.subject}
                      </div>
                      <div class="tutor-chat-list-item-badges">
                        <span class="support-cat-badge" style="font-size:0.62rem; padding:1px 6px;">${c.category}</span>
                        <div style="display:flex; align-items:center; gap:6px;">
                          <span class="status-badge ${c.status === 'Resolved' ? 'success' : 'danger'}" style="font-size:0.62rem; padding:1px 6px;">${c.status}</span>
                          ${isUnread ? `<span class="tutor-chat-list-item-badge">1</span>` : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="glass-panel" style="padding:0; overflow:hidden; display:flex; flex-direction:column; height:100%;">
            ${rightPaneHtml}
          </div>
        </div>
      `;
    }

    return `
      <div class="dashboard-welcome">
        <h2>Talk with Tutor</h2>
        <p>Communicate directly with your course instructors.</p>
      </div>

      <div class="support-filter-tabs" style="margin-top: 24px; margin-bottom: 24px;">
        <button class="support-filter-tab ${activeSubTab === 'tutors' ? 'active' : ''}" id="tab-tutor-list">
          <i class="fa-solid fa-chalkboard-user"></i>
          <span>My Tutors (${tutors.length})</span>
        </button>
        <button class="support-filter-tab ${activeSubTab === 'chats' ? 'active' : ''}" id="tab-tutor-chats">
          <i class="fa-solid fa-comments"></i>
          <span>Active Chats (${convs.length})</span>
          ${convs.filter(c => c.unread_by_student).length > 0 ? `<span style="background:#ef4444; width:8px; height:8px; border-radius:50%; display:inline-block;"></span>` : ''}
        </button>
      </div>

      ${activeSubTab === 'tutors' ? `
        ${tutors.length === 0 ? `
          <div class="glass-panel" style="text-align:center; padding:48px;">
            <div style="font-size:3rem; margin-bottom:16px;">🎓</div>
            <h3>No Tutors Assigned</h3>
            <p style="color:var(--text-secondary); margin-top:8px;">No tutor has been assigned to your batch yet.</p>
          </div>
        ` : `
          <div class="tutors-grid">
            ${tutors.map(t => {
              const coursesStr = t.courses.join(', ');
              return `
                <div class="tutor-card-chat">
                  <div class="tutor-avatar-wrapper">
                    ${t.photo ? `
                      <img src="${t.photo}" class="tutor-card-chat-avatar" style="object-fit: cover; border: 2px solid var(--brand-blue-pale);" alt="${t.name}">
                    ` : `
                      <div class="tutor-card-chat-avatar" style="background:${window.getAvatarColor(t.username)};">${t.name.charAt(0).toUpperCase()}</div>
                    `}
                    <span class="tutor-status-indicator ${t.online ? 'online' : 'offline'}"></span>
                  </div>
                  <div style="text-align:center;">
                    <h4 style="margin:0; font-weight:800; font-size:1.05rem; color:var(--text-primary);">${t.name}</h4>
                    <p style="margin:4px 0 0 0; font-size:0.75rem; color:var(--brand-blue); font-weight:700;">${coursesStr}</p>
                    <p style="margin:8px 0 0 0; font-size:0.72rem; color:var(--text-muted);"><i class="fa-regular fa-clock" style="margin-right:4px;"></i>${t.lastActive}</p>
                  </div>
                  <button class="btn btn-primary btn-sm btn-start-tutor-chat" data-tutor-username="${t.username}" data-course-id="${t.courseId}" style="width:100%; margin-top:8px;">
                    <i class="fa-solid fa-paper-plane" style="margin-right:6px;"></i>Start Chat
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        `}
      ` : chatsContentHtml}
    `;
  },

  _bindTutorChatPortalEvents: function (tutors, convs) {
    document.getElementById('tab-tutor-list')?.addEventListener('click', () => {
      DashboardComponent._tutorSubTab = 'tutors';
      DashboardComponent._loadAndRenderTutorChat();
    });

    document.getElementById('tab-tutor-chats')?.addEventListener('click', () => {
      DashboardComponent._tutorSubTab = 'chats';
      DashboardComponent._loadAndRenderTutorChat();
    });

    document.querySelectorAll('.btn-start-tutor-chat').forEach(btn => {
      btn.addEventListener('click', () => {
        const tutorUsername = btn.getAttribute('data-tutor-username');
        const courseId = btn.getAttribute('data-course-id');

        const existing = convs.find(c => c.tutor_username === tutorUsername);
        if (existing) {
          DashboardComponent._activeTutorConvId = existing.id;
          DashboardComponent._tutorSubTab = 'chats';
          DashboardComponent._loadAndRenderTutorChat();
        } else {
          DashboardComponent._newTutorChatData = { tutorUsername, courseId };
          DashboardComponent._showNewTutorForm = true;
          DashboardComponent._loadAndRenderTutorChat();
        }
      });
    });

    const searchInput = document.getElementById('tutor-conv-search');
    searchInput?.addEventListener('input', (e) => {
      DashboardComponent._tutorConvSearch = e.target.value;
      DashboardComponent._loadAndRenderTutorChat();
    });

    document.querySelectorAll('.tutor-chat-list-item').forEach(item => {
      item.addEventListener('click', () => {
        DashboardComponent._activeTutorConvId = item.getAttribute('data-conv-id');
        const badge = document.getElementById('tutor-chat-unread-badge');
        if (badge) badge.style.display = 'none';
        DashboardComponent._loadAndRenderTutorChat();
      });
    });

    if (DashboardComponent._activeTutorConvId && DashboardComponent._tutorSubTab === 'chats') {
      DashboardComponent._bindTutorConversationEvents(DashboardComponent._activeTutorConvId);
    }
  },

  _renderNewTutorConvForm: function () {
    const data = DashboardComponent._newTutorChatData;
    return `
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">
        <button class="btn btn-outline-white btn-sm" id="btn-new-tutor-cancel" style="width:36px; height:36px; padding:0; border-radius:50%;"><i class="fa-solid fa-arrow-left"></i></button>
        <div>
          <h2 style="margin:0; font-weight:800; font-size:1.3rem;">Start Tutor Conversation</h2>
          <p style="margin:0; font-size:0.8rem; color:var(--text-muted);">Instructor: <strong>@${data.tutorUsername}</strong></p>
        </div>
      </div>

      <div class="glass-panel" style="max-width:600px; padding:24px;">
        <form id="form-create-tutor-chat">
          <div class="form-group">
            <label>Subject / Topic *</label>
            <input type="text" id="new-tutor-subject" required placeholder="Briefly describe what you need help with...">
          </div>

          <div style="display:grid; grid-template-columns: 1fr; gap:16px;">
            <div class="form-group">
              <label>Select Category *</label>
              <select id="new-tutor-category" required style="width:100%; height:46px; border:1px solid var(--border-color); border-radius:var(--radius-md); background:var(--bg-primary); color:var(--text-primary); padding:0 12px; cursor:pointer;">
                <option value="Assignment Help">Assignment Help</option>
                <option value="Course Doubt">Course Doubt</option>
                <option value="Project Review">Project Review</option>
                <option value="Live Class Question">Live Class Question</option>
                <option value="Technical Help">Technical Help</option>
                <option value="General Discussion">General Discussion</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Initial Message *</label>
            <textarea id="new-tutor-message" required rows="4" placeholder="Detail your query for the instructor..."></textarea>
          </div>

          <div style="display:flex; gap:12px; margin-top:24px;">
            <button type="submit" class="btn btn-primary" id="btn-submit-tutor-chat">Create Conversation</button>
            <button type="button" class="btn btn-outline-white" id="btn-cancel-tutor-chat">Cancel</button>
          </div>
        </form>
      </div>
    `;
  },

  _bindNewTutorFormEvents: function () {
    const handleCancel = () => {
      DashboardComponent._showNewTutorForm = false;
      DashboardComponent._newTutorChatData = null;
      DashboardComponent._loadAndRenderTutorChat();
    };

    document.getElementById('btn-new-tutor-cancel')?.addEventListener('click', handleCancel);
    document.getElementById('btn-cancel-tutor-chat')?.addEventListener('click', handleCancel);

    document.getElementById('form-create-tutor-chat')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const subject = document.getElementById('new-tutor-subject').value.trim();
      const category = document.getElementById('new-tutor-category').value;
      const text = document.getElementById('new-tutor-message').value.trim();
      const data = DashboardComponent._newTutorChatData;

      if (!subject || !text || !data) return;

      const submitBtn = document.getElementById('btn-submit-tutor-chat');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="margin-right:6px;"></i>Creating...`;
      }

      try {
        const res = await window.db.createTutorConversation(data.tutorUsername, data.courseId, subject, category);
        if (res.success) {
          await window.db.sendTutorMessage(res.conversation.id, text);

          DashboardComponent._showNewTutorForm = false;
          DashboardComponent._newTutorChatData = null;
          DashboardComponent._activeTutorConvId = res.conversation.id;
          window.app.showToast("Conversation started! Send messages now.", "success");
          DashboardComponent._loadAndRenderTutorChat();
        } else {
          window.app.showToast(res.error || "Failed to create conversation", "danger");
        }
      } catch (err) {
        window.app.showToast(err.message, "danger");
      }
    });
  },

  _renderTutorConversationView: async function (convId) {
    const convs = await window.db.getTutorConversations();
    const conv = convs.find(c => c.id === convId);
    if (!conv) return `<div class="alert alert-danger">Conversation not found.</div>`;

    const messages = await window.db.getTutorMessages(convId);
    const cu = window.db.getCurrentUser();

    return `
      <div style="display:grid; grid-template-columns: 2.2fr 1fr; gap:0; align-items: stretch; height:100%;">
        <div class="support-chat-container">

          <!-- Tutor Contact Header -->
          <div class="support-chat-header">
            <div style="display:flex; align-items:center; gap:10px; flex:1; min-width:0;">
              <button class="support-chat-header-back" id="btn-tutor-chat-back" style="margin-right:4px;">
                <i class="fa-solid fa-arrow-left"></i>
              </button>
              <div class="support-chat-header-avatar" style="background:${window.getAvatarColor(conv.tutor_username)};">
                ${conv.tutor_username ? conv.tutor_username.charAt(0).toUpperCase() : 'T'}
              </div>
              <div class="support-chat-header-info">
                <div class="support-chat-title">@${conv.tutor_username}</div>
                <div class="support-chat-subtitle"><span style="color:#a8f0c6;">Online</span> · ${conv.category}</div>
              </div>
            </div>
            <div class="support-chat-header-actions">
              <button title="Video Call"><i class="fa-solid fa-video"></i></button>
              <button title="Voice Call"><i class="fa-solid fa-phone"></i></button>
              <button title="More"><i class="fa-solid fa-ellipsis-vertical"></i></button>
            </div>
          </div>

          <!-- Messages -->
          <div class="support-chat-messages" id="tutor-chat-thread">
            <div class="support-chat-date-label">Today</div>
            <div class="support-chat-encrypt-notice">
              <i class="fa-solid fa-lock" style="margin-right:6px; font-size:0.75rem;"></i>
              Messages with your instructor are end-to-end secured. Only you and your tutor can read them.
            </div>
            ${messages.map(m => {
              const isOwn = m.sender === cu.username;
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

              return `
                        <div class="support-msg-wrapper ${isOwn ? 'student-align' : 'admin-align'}">
                          <div class="support-msg-bubble">
                            <div style="font-weight:600; font-size:0.75rem; opacity:0.8; margin-bottom:4px; color:${isOwn ? '#3b82f6' : '#0B5A43'};">${isOwn ? 'You' : `@${conv.tutor_username} (Tutor)`}</div>
                            <div style="font-size:0.86rem; white-space:pre-wrap;">${m.message}</div>
                            ${attachmentHtml}
                            ${linkHtml}
                          </div>
                          <div class="support-msg-meta">
                            <span>${dateStr}</span>
                            ${isOwn ? `<i class="fa-solid ${m.seen ? 'fa-check-double seen' : 'fa-check unseen'} support-msg-seen-icon"></i>` : ''}
                          </div>
                        </div>
                      `;
            }).join('')}
          </div>

          ${conv.status === 'Resolved' ? `
            <div style="padding: 16px; text-align: center; background: var(--bg-primary); border-top: 1px solid var(--border-color); color: var(--text-muted); font-size: 0.86rem; font-style: italic;">
              This conversation has been marked as Resolved by the Tutor.
            </div>
          ` : `
            <div class="support-chat-input-wrapper">
              <div class="support-chat-attachments-row">
                <div class="support-chat-attach-btn" title="Attach file">
                  <i class="fa-solid fa-paperclip"></i>
                  <input type="file" id="tutor-chat-upload-file">
                </div>
                <div id="tutor-chat-file-selected-chip" style="display:none;"></div>

                <div class="support-link-input-wrapper">
                  <i class="fa-solid fa-link"></i>
                  <input type="url" id="tutor-chat-external-link" placeholder="Cloud Storage File Link">
                </div>
              </div>

              <div class="support-chat-input-row">
                <button class="support-chat-emoji-btn" id="btn-tutor-emoji" title="Emoji">😊</button>
                <textarea class="support-chat-input-textarea" id="tutor-chat-message-text" placeholder="Message" rows="1"></textarea>
                <button class="btn btn-primary" id="btn-tutor-send-message"><i class="fa-solid fa-paper-plane" style="font-size:1rem;"></i></button>
              </div>
            </div>
          `}
        </div>

        <div class="glass-panel" style="padding:20px; display:flex; flex-direction:column; gap:16px; border:none; border-left:1px solid var(--border-color); border-radius:0; background:var(--bg-secondary); margin:0;">
          <h3 style="margin:0 0 8px 0; font-weight:700; font-size:1rem; border-bottom:1px solid var(--border-color); padding-bottom:8px;">Conversation Info</h3>
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:2px;">Instructor</div>
            <div style="font-weight:700; font-size:0.86rem; color:var(--text-primary);">@${conv.tutor_username}</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:2px;">Subject</div>
            <div style="font-weight:600; font-size:0.86rem; color:var(--text-primary);">${conv.subject}</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:2px;">Category</div>
            <div style="display:inline-block;"><span class="support-cat-badge">${conv.category}</span></div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:2px;">Status</div>
            <div style="display:inline-block;"><span class="status-badge ${conv.status === 'Resolved' ? 'success' : 'danger'}">${conv.status}</span></div>
          </div>
        </div>
      </div>
    `;
  },

  _bindTutorConversationEvents: function (convId) {
    document.getElementById('btn-tutor-chat-back')?.addEventListener('click', () => {
      DashboardComponent._activeTutorConvId = null;
      DashboardComponent._loadAndRenderTutorChat();
    });

    const thread = document.getElementById('tutor-chat-thread');
    if (thread) {
      thread.scrollTop = thread.scrollHeight;
    }

    let tutorSelectedFile = null;
    const fileInput = document.getElementById('tutor-chat-upload-file');
    const chip = document.getElementById('tutor-chat-file-selected-chip');

    if (fileInput && chip) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          tutorSelectedFile = file;
          chip.innerHTML = `
            <i class="fa-solid fa-file-lines"></i>
            <span>${file.name.substring(0, 15)}...</span>
            <i class="fa-solid fa-circle-xmark remove-file" style="margin-left:6px; cursor:pointer;" id="tutor-remove-attached-file"></i>
          `;
          chip.className = 'support-file-selected-chip';
          chip.style.display = 'flex';

          document.getElementById('tutor-remove-attached-file')?.addEventListener('click', () => {
            tutorSelectedFile = null;
            fileInput.value = '';
            chip.style.display = 'none';
          });
        }
      });
    }

    const sendBtn = document.getElementById('btn-tutor-send-message');
    const msgTextarea = document.getElementById('tutor-chat-message-text');
    const extLinkInput = document.getElementById('tutor-chat-external-link');

    const handleSend = async () => {
      const text = msgTextarea ? msgTextarea.value.trim() : '';
      const extLink = extLinkInput ? extLinkInput.value.trim() : '';

      if (!text && !tutorSelectedFile && !extLink) {
        return;
      }

      if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
      }

      try {
        let fileData = null;
        if (tutorSelectedFile) {
          fileData = await window.db.uploadTutorAttachment(tutorSelectedFile);
        }

        const res = await window.db.sendTutorMessage(convId, text, fileData, extLink);
        if (res.success) {
          if (msgTextarea) msgTextarea.value = '';
          if (extLinkInput) extLinkInput.value = '';
          tutorSelectedFile = null;
          if (fileInput) fileInput.value = '';
          if (chip) chip.style.display = 'none';

          DashboardComponent._loadAndRenderTutorChat();
        } else {
          window.app.showToast(res.error || "Failed to send message", "danger");
        }
      } catch (err) {
        window.app.showToast(err.message || "An error occurred", "danger");
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

    window.initEmojiPicker('btn-tutor-emoji', 'tutor-chat-message-text');
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
      DashboardComponent._startCommonMeetingTimers();
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
    if (DashboardComponent._cmIntervalId) clearInterval(DashboardComponent._cmIntervalId);

    const updateTimers = () => {
      document.querySelectorAll('.cm-countdown-box').forEach(box => {
        const targetDate = new Date(box.getAttribute('data-date'));
        const now = new Date();
        const diff = targetDate - now;

        const timerSpan = box.querySelector('.cm-timer');
        if (!timerSpan) return;

        if (diff <= 0) {
          timerSpan.innerHTML = '<span style="color:#10B981;">Live Now! Reload page</span>';
          if (DashboardComponent._cmIntervalId) clearInterval(DashboardComponent._cmIntervalId);
          DashboardComponent.refreshActiveTab();
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
    DashboardComponent._cmIntervalId = setInterval(updateTimers, 1000);
  },

  refreshActiveTab: function () {
    const cu = window.db.getCurrentUser();
    if (!cu) return;
    if (DashboardComponent._activeTab === 'support') {
      DashboardComponent._loadAndRenderSupport();
    } else if (DashboardComponent._activeTab === 'tutor_chat') {
      DashboardComponent._loadAndRenderTutorChat();
    } else {
      const courses = window.db.getCourses();
      const enrolledCourses = courses.filter(c => (cu.enrolledCourses || []).includes(c.id));
      const wishlist = (cu.wishlist || []).map(id => courses.find(c => c.id === id)).filter(Boolean);
      const txns = window.db.getTransactions().filter(t => t.username === cu.username);
      const totalProgress = enrolledCourses.length > 0
        ? Math.round(enrolledCourses.reduce((sum, c) => {
          const p = window.db.getUserProgress(cu.username, c.id);
          const total = (c.modules || []).reduce((a, m) => a + (m.lessons || []).length, 0);
          const done = (p.completedLessons || []).length;
          return sum + (total > 0 ? (done / total) * 100 : 0);
        }, 0) / enrolledCourses.length)
        : 0;
      const container = document.getElementById('student-tab-content');
      if (container) {
        container.innerHTML = DashboardComponent._renderTab(DashboardComponent._activeTab, cu, enrolledCourses, wishlist, txns, totalProgress);
      }
      if (DashboardComponent._activeTab === 'overview' && window.DashboardRightPanel) {
        window.DashboardRightPanel.bindEvents(cu);
      }
    }
  },

  _activeProjectSubTab: 'active',
  _viewingProjectId: null,

  selectProjectSubTab: function (subTab) {
    DashboardComponent._activeProjectSubTab = subTab;
    DashboardComponent.refreshActiveTab();
  },

  viewProjectDetail: function (projId) {
    DashboardComponent._viewingProjectId = projId;
    DashboardComponent.refreshActiveTab();
  },

  backToProjects: function () {
    DashboardComponent._viewingProjectId = null;
    DashboardComponent.refreshActiveTab();
  },

  submitProjectLink: function (event, projId) {
    event.preventDefault();
    const link = document.getElementById('student-proj-link').value.trim();
    const notes = document.getElementById('student-proj-notes').value.trim();

    if (!link) {
      window.app.showToast('Please provide a Google Drive submission link!', 'danger');
      return;
    }

    if (!link.includes('drive.google.com') && !link.includes('google.com/drive')) {
      window.app.showToast('Please enter a valid Google Drive sharing link!', 'danger');
      return;
    }

    const cu = window.db.getCurrentUser();
    if (!cu) return;

    const existingSub = window.db.getStudentSubmission(projId, cu.username);
    const subId = existingSub ? existingSub.id : 'SUB-' + Math.floor(100000 + Math.random() * 900000);

    const submissionData = {
      id: subId,
      project_id: projId,
      student_id: cu.username,
      google_drive_submission_link: link,
      notes: notes,
      submission_status: 'Submitted',
      submitted_at: existingSub ? existingSub.submitted_at : new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const res = window.db.saveSubmission(submissionData);
    if (res.success) {
      window.app.showToast('Project submitted successfully! 🚀', 'success');
      
      // Notify tutors of this batch
      const proj = window.db.getProjectById(projId);
      if (proj) {
        const batch = window.db.getBatchById(proj.batch_id);
        if (batch && batch.tutorIds) {
          batch.tutorIds.forEach(tutorId => {
            window.db.addNotification(tutorId, "New Submission 📥", `${cu.name} submitted their project: ${proj.title}`, "info");
          });
        }
        // Log activity
        window.db.addActivity(cu.username, "SUBMIT_PROJECT", "project", projId, `${cu.name} submitted project "${proj.title}"`);
      }

      DashboardComponent.refreshActiveTab();
    } else {
      window.app.showToast('Failed to submit project.', 'danger');
    }
  },

  _projectSearchQuery: '',
  _projectDifficultyFilter: 'All',

  updateProjectSearch: function (query) {
    DashboardComponent._projectSearchQuery = query.toLowerCase();
    DashboardComponent.refreshActiveTab();
  },

  updateProjectDifficulty: function (diff) {
    DashboardComponent._projectDifficultyFilter = diff;
    DashboardComponent.refreshActiveTab();
  },

  _renderProjects: function (cu, enrolledCourses) {
    if (DashboardComponent._viewingProjectId) {
      return DashboardComponent._renderProjectDetail(cu, DashboardComponent._viewingProjectId);
    }

    const allProjects = window.db.getProjects();
    const enrolledBatches = cu.enrolledBatches || {};
    const enrolledBatchIds = Object.values(enrolledBatches);

    const studentProjects = allProjects.filter(p => p.status === 'Published' && enrolledBatchIds.includes(p.batch_id));

    const searchQuery = DashboardComponent._projectSearchQuery || '';
    const difficultyFilter = DashboardComponent._projectDifficultyFilter || 'All';

    let filteredProjects = studentProjects.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery) || p.description.toLowerCase().includes(searchQuery);
      const matchesDiff = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
      return matchesSearch && matchesDiff;
    });

    const activeTab = DashboardComponent._activeProjectSubTab || 'active';
    
    const categorized = {
      active: [],
      upcoming: [],
      submitted: [],
      completed: [],
      grades: []
    };

    filteredProjects.forEach(p => {
      const sub = window.db.getStudentSubmission(p.id, cu.username);
      const status = sub ? sub.submission_status : 'Not Started';

      const isFuture = p.due_date ? (new Date(p.due_date) > new Date()) : true;
      if (isFuture) {
        categorized.upcoming.push(p);
      }

      if (status === 'Completed') {
        categorized.completed.push(p);
      } else if (status === 'Submitted' || status === 'Under Review') {
        categorized.submitted.push(p);
      } else {
        categorized.active.push(p);
      }

      if (sub) {
        const review = window.db.getSubmissionReview(sub.id);
        if (review) {
          categorized.grades.push(p);
        }
      }
    });

    const activeList = categorized[activeTab] || [];

    const subTabs = [
      ['active', `Active Projects (${categorized.active.length})`],
      ['upcoming', `Upcoming Projects (${categorized.upcoming.length})`],
      ['submitted', `Submitted Projects (${categorized.submitted.length})`],
      ['completed', `Completed Projects (${categorized.completed.length})`],
      ['grades', `Grades & Feedback (${categorized.grades.length})`]
    ];

    return `
      <div class="dashboard-welcome">
        <h1>Projects & Submissions</h1>
        <p>Complete your practical assignments, download resource templates, and submit Google Drive project links.</p>
      </div>

      <div style="background:var(--bg-secondary); border:1px solid var(--border-color); padding:16px; border-radius:12px; margin-top:20px; display:flex; gap:16px; align-items:center; flex-wrap:wrap;">
        <div style="flex:1; min-width:200px; position:relative;">
          <input type="text" placeholder="Search projects by title..." value="${DashboardComponent._projectSearchQuery || ''}" oninput="DashboardComponent.updateProjectSearch(this.value)" class="form-control" style="font-family:inherit; font-size:0.8rem; padding-left:36px; margin:0;">
          <i class="fa-solid fa-magnifying-glass" style="position:absolute; left:12px; top:12px; color:var(--text-muted); font-size:0.85rem;"></i>
        </div>
        <div style="width:180px;">
          <select onchange="DashboardComponent.updateProjectDifficulty(this.value)" class="form-control" style="font-family:inherit; font-size:0.8rem; margin:0;">
            <option value="All" ${difficultyFilter === 'All' ? 'selected' : ''}>All Difficulties</option>
            <option value="Beginner" ${difficultyFilter === 'Beginner' ? 'selected' : ''}>Beginner</option>
            <option value="Intermediate" ${difficultyFilter === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
            <option value="Advanced" ${difficultyFilter === 'Advanced' ? 'selected' : ''}>Advanced</option>
          </select>
        </div>
      </div>

      <div class="lms-tabs-nav" style="margin-top: 24px;">
        ${subTabs.map(([tabId, label]) => `
          <button class="lms-tab-btn ${activeTab === tabId ? 'active' : ''}" onclick="DashboardComponent.selectProjectSubTab('${tabId}')">${label}</button>
        `).join('')}
      </div>

      <div class="project-grid">
        ${activeList.map(p => {
          const sub = window.db.getStudentSubmission(p.id, cu.username);
          const status = sub ? sub.submission_status : 'Not Started';
          const course = window.db.getCourseById(p.course_id);
          const batch = window.db.getBatchById(p.batch_id);
          
          let statusClass = 'not_started';
          if (status === 'Submitted') statusClass = 'submitted';
          if (status === 'Under Review') statusClass = 'under_review';
          if (status === 'Revision Required') statusClass = 'revision_required';
          if (status === 'Completed') statusClass = 'completed';

          return `
            <div class="project-card" onclick="DashboardComponent.viewProjectDetail('${p.id}')">
              <div class="project-thumbnail-wrap">
                <img class="project-thumbnail" src="${p.thumbnail || 'cubaze-logo.png'}" onerror="this.src='cubaze-logo.png'">
                <span class="project-diff-badge ${p.difficulty.toLowerCase()}">${p.difficulty}</span>
              </div>
              <div class="project-card-content">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                  <span class="project-status-tag ${statusClass}">${status.replace('_', ' ')}</span>
                  <span style="font-size:0.7rem; color:var(--text-muted); font-weight:700;">Max: ${p.max_marks || p.maxMarks || 100} Marks</span>
                </div>
                <h3 class="project-card-title">${p.title}</h3>
                <p style="font-size:0.8rem; color:var(--text-secondary); line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; margin-bottom:12px;">${p.description}</p>
                <div class="project-card-meta">
                  <div class="project-card-meta-item"><i class="fa-solid fa-graduation-cap"></i> ${course ? course.title : 'Course'}</div>
                  <div class="project-card-meta-item"><i class="fa-solid fa-hourglass-half"></i> ${p.estimated_time || p.estimatedTime || '1h'}</div>
                </div>
                <div style="font-size:0.72rem; color:var(--text-muted); font-weight:600; margin-top:8px; border-top:1px solid var(--border-color); padding-top:8px; text-align:left;">
                  Due: ${p.due_date || p.dueDate}
                </div>
              </div>
            </div>
          `;
        }).join('')}
        ${activeList.length === 0 ? `
          <div style="grid-column: 1 / -1; text-align:center; padding: 48px; color: var(--text-muted);">
            <div style="font-size:3rem; margin-bottom:12px;">📁</div>
            <div style="font-size:0.9rem; font-weight:700;">No projects in this category</div>
          </div>
        ` : ''}
      </div>
    `;
  },

  _renderProjectDetail: function (cu, projId) {
    const p = window.db.getProjectById(projId);
    if (!p) return `<p>Project not found.</p>`;

    const course = window.db.getCourseById(p.course_id);
    const batch = window.db.getBatchById(p.batch_id);
    
    const tutorUser = window.db.getUsers().find(u => u.username === p.tutor_id);
    const tutorName = tutorUser ? tutorUser.name : 'Your Instructor';

    const assets = window.db.getProjectAssets(p.id);
    const sub = window.db.getStudentSubmission(p.id, cu.username);
    const review = sub ? window.db.getSubmissionReview(sub.id) : null;
    const status = sub ? sub.submission_status : 'Not Started';

    let statusClass = 'not_started';
    if (status === 'Submitted') statusClass = 'submitted';
    if (status === 'Under Review') statusClass = 'under_review';
    if (status === 'Revision Required') statusClass = 'revision_required';
    if (status === 'Completed') statusClass = 'completed';

    const isOverdue = p.due_date ? (new Date() > new Date(p.due_date)) : false;
    const allowSubmit = !isOverdue || (sub && status === 'Revision Required');

    return `
      <div style="text-align: left;">
        <button class="btn btn-outline-white btn-sm" onclick="DashboardComponent.backToProjects()" style="margin-bottom:20px; display:inline-flex; align-items:center; gap:6px;"><i class="fa-solid fa-arrow-left"></i> Back to Projects</button>
        
        <div style="display:grid; grid-template-columns: 2fr 1fr; gap: 24px;">
          <!-- Left Column: Details -->
          <div style="display:flex; flex-direction:column; gap:20px;">
            <div class="glass-panel" style="padding:24px; border-radius:16px; position:relative; overflow:hidden;">
              <span class="project-diff-badge ${p.difficulty.toLowerCase()}" style="top:24px; right:24px;">${p.difficulty}</span>
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                <span class="project-status-tag ${statusClass}">${status.replace('_', ' ')}</span>
              </div>
              <h2 style="font-size:1.35rem; font-weight:800; color:var(--text-primary); margin-bottom:12px;">${p.title}</h2>
              <div style="display:flex; gap:16px; flex-wrap:wrap; font-size:0.78rem; color:var(--text-secondary); margin-bottom:20px; border-bottom:1px solid var(--border-color); padding-bottom:12px;">
                <div><i class="fa-solid fa-graduation-cap"></i> Course: <strong>${course ? course.title : 'Course'}</strong></div>
                <div><i class="fa-solid fa-users"></i> Batch: <strong>${batch ? batch.name : 'Batch'}</strong></div>
                <div><i class="fa-solid fa-chalkboard-user"></i> Tutor: <strong>${tutorName}</strong></div>
              </div>
              
              <h4 style="font-size:0.95rem; font-weight:800; color:var(--text-primary); margin-bottom:8px;">Project Description</h4>
              <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.6; margin-bottom:20px; white-space:pre-wrap;">${p.description}</p>
              
              <h4 style="font-size:0.95rem; font-weight:800; color:var(--text-primary); margin-bottom:8px;">Instructions</h4>
              <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.6; margin-bottom:20px; white-space:pre-wrap;">${p.instructions}</p>
              
              ${p.learning_objectives ? `
                <h4 style="font-size:0.95rem; font-weight:800; color:var(--text-primary); margin-bottom:8px;">Learning Objectives</h4>
                <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.6; margin-bottom:0; white-space:pre-wrap;">${p.learning_objectives}</p>
              ` : ''}
            </div>
            
            <!-- Assets Section -->
            <div class="glass-panel" style="padding:20px; border-radius:16px;">
              <h3 style="font-size:1rem; font-weight:800; color:var(--text-primary); margin-bottom:12px;"><i class="fa-solid fa-folder-open" style="color:var(--brand-blue); margin-right:6px;"></i> Provided Resources / Assets</h3>
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${assets.map(a => `
                  <div class="project-asset-item">
                    <div style="display:flex; align-items:center; gap:10px;">
                      <div class="project-asset-icon"><i class="fa-solid fa-file-lines"></i></div>
                      <div style="text-align:left;">
                        <div style="font-size:0.83rem; font-weight:700; color:var(--text-primary);">${a.asset_name}</div>
                        <div style="font-size:0.7rem; color:var(--text-muted);">${a.asset_type || 'Asset Resource'}</div>
                      </div>
                    </div>
                    <a href="${a.google_drive_link}" target="_blank" class="btn btn-outline btn-xs" style="margin:0;"><i class="fa-solid fa-download"></i> Download</a>
                  </div>
                `).join('')}
                ${assets.length === 0 ? '<p style="color:var(--text-muted); font-size:0.8rem; font-style:italic;">No custom assets shared for this project.</p>' : ''}
              </div>
            </div>
          </div>
          
          <!-- Right Column: Submission Status & Action -->
          <div style="display:flex; flex-direction:column; gap:20px;">
            <div class="glass-panel" style="padding:20px; border-radius:16px; text-align:left;">
              <h3 style="font-size:0.95rem; font-weight:800; color:var(--text-primary); margin-bottom:12px; border-bottom:1px solid var(--border-color); padding-bottom:8px;">Project Deadlines</h3>
              <div style="display:flex; flex-direction:column; gap:10px; font-size:0.82rem; color:var(--text-secondary);">
                <div>Due Date: <strong style="color:var(--text-primary);">${p.due_date}</strong></div>
                <div>Time Estimate: <strong style="color:var(--text-primary);">${p.estimated_time || '2h'}</strong></div>
                <div>Max Marks: <strong style="color:var(--brand-blue);">${p.max_marks || 100} Marks</strong></div>
              </div>
            </div>

            <!-- Grades & Feedback -->
            ${review ? `
              <div class="glass-panel" style="padding:20px; border-radius:16px; text-align:left; border: 1.5px solid var(--success-border); background:var(--brand-blue-pale);">
                <h3 style="font-size:0.95rem; font-weight:800; color:var(--text-primary); margin-bottom:10px;"><i class="fa-solid fa-award" style="color:var(--success); margin-right:6px;"></i> Graded Results</h3>
                <div style="font-size:1.5rem; font-weight:900; color:var(--brand-blue); margin-bottom:8px;">${review.marks} <span style="font-size:0.85rem; font-weight:500; color:var(--text-secondary);">/ ${p.max_marks || 100} Marks</span></div>
                <div style="font-size:0.75rem; color:var(--text-secondary); font-weight:700; margin-bottom:4px;">Tutor Feedback:</div>
                <p style="font-size:0.82rem; color:var(--text-secondary); line-height:1.5; margin:0; padding:10px; background:var(--bg-secondary); border-radius:8px; border:1px solid var(--border-color);">${review.feedback || 'Excellent work!'}</p>
              </div>
            ` : ''}

            <!-- Submission Area -->
            <div class="glass-panel" style="padding:20px; border-radius:16px; text-align:left;">
              <h3 style="font-size:0.95rem; font-weight:800; color:var(--text-primary); margin-bottom:12px; border-bottom:1px solid var(--border-color); padding-bottom:8px;"><i class="fa-solid fa-cloud-arrow-up" style="color:var(--brand-blue); margin-right:6px;"></i> Submission</h3>
              
              ${sub ? `
                <div style="background:var(--bg-secondary); border:1px solid var(--border-color); padding:10px 14px; border-radius:10px; margin-bottom:14px; font-size:0.8rem;">
                  <div style="font-weight:700; color:var(--text-secondary); margin-bottom:4px;">Submitted Link:</div>
                  <a href="${sub.google_drive_submission_link}" target="_blank" style="word-break:break-all; font-weight:600; color:var(--brand-blue); text-decoration:none;"><i class="fa-solid fa-link"></i> Open Submitted Work</a>
                  ${sub.notes ? `<div style="margin-top:8px; color:var(--text-secondary); font-style:italic;">Notes: "${sub.notes}"</div>` : ''}
                </div>
              ` : ''}

              ${allowSubmit ? `
                <form onsubmit="DashboardComponent.submitProjectLink(event, '${p.id}')">
                  <div class="form-group" style="margin-bottom:12px;">
                    <label style="font-weight:700; font-size:0.76rem; color:var(--text-secondary); display:block; margin-bottom:4px;">Google Drive Submission Link *</label>
                    <input type="url" id="student-proj-link" value="${sub ? sub.google_drive_submission_link : ''}" class="form-control" placeholder="https://drive.google.com/..." required style="font-family:inherit; font-size:0.8rem;">
                  </div>
                  <div class="form-group" style="margin-bottom:14px;">
                    <label style="font-weight:700; font-size:0.76rem; color:var(--text-secondary); display:block; margin-bottom:4px;">Comments / Notes (Optional)</label>
                    <textarea id="student-proj-notes" class="form-control" rows="3" placeholder="Add some notes for your tutor..." style="font-family:inherit; font-size:0.8rem; resize:vertical;">${sub && sub.notes ? sub.notes : ''}</textarea>
                  </div>
                  <button type="submit" class="btn btn-primary btn-block btn-sm" style="margin:0;"><i class="fa-solid fa-paper-plane"></i> ${sub ? 'Update Submission' : 'Submit Project'}</button>
                </form>
              ` : `
                <div style="text-align:center; padding:12px; background:#fee2e2; color:#ef4444; border-radius:10px; font-size:0.8rem; font-weight:700;">
                  <i class="fa-solid fa-circle-exclamation"></i> Project Deadline Expired
                </div>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
window.DashboardComponent = DashboardComponent;
