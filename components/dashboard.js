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

    const navItems = [['overview','fa-gauge','Overview'],['mycourses','fa-book-open','My Courses'],['wishlist','fa-heart','Wishlist'],['certificates','fa-certificate','Certificates'],['orders','fa-receipt','Orders'],['profile','fa-user','Profile']];
    const totalProgress = enrolledCourses.length > 0
      ? Math.round(enrolledCourses.reduce((sum, c) => {
          const p = window.db.getUserProgress(cu.username, c.id);
          const total = c.modules.reduce((a, m) => a + m.lessons.length, 0);
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
              <div class="sidebar-avatar">${cu.name.charAt(0).toUpperCase()}</div>
              <div class="sidebar-name">${cu.name}</div>
              <div class="sidebar-role">@${cu.username} · Student</div>
            </div>
            <div class="sidebar-nav">
              ${navItems.map(([tab, icon, label]) => `
                <div class="sidebar-nav-item ${DashboardComponent._activeTab === tab ? 'active' : ''}" data-tab="${tab}">
                  <i class="fa-solid ${icon}"></i>${label}
                  ${tab === 'wishlist' && wishlist.length > 0 ? `<span class="nav-badge">${wishlist.length}</span>` : ''}
                  ${tab === 'certificates' ? `<span class="nav-badge" style="background:var(--success);">${enrolledCourses.filter(c => { const p = window.db.getUserProgress(cu.username, c.id); return p.certificateEarned; }).length}</span>` : ''}
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
      case 'wishlist': return DashboardComponent._renderWishlist(cu, wishlist);
      case 'certificates': return DashboardComponent._renderCertificates(cu, enrolledCourses);
      case 'orders': return DashboardComponent._renderOrders(txns);
      case 'profile': return DashboardComponent._renderProfile(cu);
      default: return DashboardComponent._renderOverview(cu, enrolledCourses, totalProgress);
    }
  },

  _renderOverview: function (cu, enrolledCourses, totalProgress) {
    const certsEarned = enrolledCourses.filter(c => window.db.getUserProgress(cu.username, c.id).certificateEarned).length;
    const totalHoursLearned = enrolledCourses.reduce((sum, c) => {
      const p = window.db.getUserProgress(cu.username, c.id);
      const total = c.modules.reduce((a, m) => a + m.lessons.length, 0);
      const done = (p.completedLessons || []).length;
      return sum + (total > 0 ? (done / total) * parseFloat(c.duration) : 0);
    }, 0);

    return `
      <div style="display:flex;flex-direction:column;gap:24px;">
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
    `;
  },

  _renderEnrolledCard: function (cu, c) {
    const p = window.db.getUserProgress(cu.username, c.id);
    const total = c.modules.reduce((a, m) => a + m.lessons.length, 0);
    const done = (p.completedLessons || []).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const firstLesson = c.modules[0].lessons[0];
    return `
      <div class="enrolled-course-card">
        <div class="enrolled-course-thumb"><img src="${c.image}" alt="${c.title}" loading="lazy"></div>
        <div class="enrolled-course-body">
          <div class="enrolled-course-title">${c.title}</div>
          <div class="enrolled-course-meta">${done} of ${total} lessons completed · ${c.duration}</div>
          <div class="progress-bar-wrapper"><div class="progress-bar" style="width:${pct}%;"></div></div>
          <div style="font-size:0.78rem;color:var(--brand-blue);font-weight:600;margin-top:4px;">${pct}% Complete</div>
          <div class="enrolled-course-actions">
            <a href="#/lesson/${c.id}/${firstLesson.id}" class="btn btn-primary btn-sm"><i class="fa-solid fa-play"></i> Continue</a>
            <a href="#/quiz/${c.id}" class="btn btn-secondary btn-sm"><i class="fa-solid fa-trophy"></i> Take Quiz</a>
            ${p.certificateEarned ? `<a href="#/certificate/${c.id}" class="btn btn-secondary btn-sm"><i class="fa-solid fa-certificate" style="color:var(--warning);"></i> Certificate</a>` : ''}
          </div>
        </div>
      </div>
    `;
  },

  _renderMyCourses: function (cu, enrolledCourses) {
    return `
      <div>
        <h2 style="margin-bottom:24px;">My Courses (${enrolledCourses.length})</h2>
        ${enrolledCourses.length === 0 ? `
          <div style="text-align:center;padding:64px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-xl);">
            <div style="font-size:3rem;margin-bottom:16px;">📚</div>
            <h3>No courses enrolled yet</h3>
            <a href="#/courses" class="btn btn-primary" style="margin-top:16px;">Browse Courses</a>
          </div>
        ` : `
          <div style="display:flex;flex-direction:column;gap:16px;">
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
            ${enrolledCourses.length > 0 ? `<a href="#/lesson/${enrolledCourses[0].id}/${enrolledCourses[0].modules[0].lessons[0].id}" class="btn btn-primary" style="margin-top:8px;">Continue Learning</a>` : ''}
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
            <thead><tr><th>Transaction</th><th>Course</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              ${txns.length === 0 ? '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:32px;">No purchases yet.</td></tr>' : ''}
              ${txns.map(t => `
                <tr>
                  <td style="font-family:monospace;font-size:0.72rem;">${t.id.slice(0, 16)}...</td>
                  <td style="font-weight:600;">${t.courseTitle}</td>
                  <td style="font-weight:700;color:var(--success);">₹${t.amount.toLocaleString('en-IN')}</td>
                  <td>${t.paymentMethod}</td>
                  <td><span class="status-badge ${t.status === 'SUCCESS' ? 'success' : 'pending'}">${t.status}</span></td>
                  <td>${new Date(t.timestamp).toLocaleDateString('en-IN')}</td>
                </tr>
              `).join('')}
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
            <div class="sidebar-avatar" style="width:80px;height:80px;font-size:2rem;">${cu.name.charAt(0).toUpperCase()}</div>
            <div>
              <div style="font-weight:800;font-size:1.2rem;color:var(--text-primary);">${cu.name}</div>
              <div style="color:var(--text-muted);font-size:0.85rem;">@${cu.username}</div>
              <div class="sidebar-role" style="display:inline-block;margin-top:6px;">${cu.role}</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div class="form-group"><label>Full Name</label><input type="text" id="profile-name" value="${cu.name}"></div>
            <div class="form-group"><label>Username</label><input type="text" value="${cu.username}" disabled style="opacity:0.6;"></div>
            <div class="form-group"><label>Role</label><input type="text" value="${cu.role}" disabled style="opacity:0.6;text-transform:capitalize;"></div>
            <div class="form-group"><label>Member Since</label><input type="text" value="${cu.registeredDate || new Date().toLocaleDateString('en-IN')}" disabled style="opacity:0.6;"></div>
          </div>
          <div class="form-group"><label>New Password</label><input type="password" id="profile-password" placeholder="Leave blank to keep current password"></div>
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
    if (newName) cu.name = newName;
    if (newPwd && newPwd.length >= 6) cu.password = newPwd;
    const users = window.db.getUsers();
    const idx = users.findIndex(u => u.username === cu.username);
    if (idx !== -1) { users[idx] = cu; localStorage.setItem('cubaze_users', JSON.stringify(users)); localStorage.setItem('cubaze_current_user', JSON.stringify(cu)); }
    window.app.showToast('Profile updated successfully!', 'success');
    window.app.updateNavbarAuth();
    window.app.renderRoute();
  },

  init: function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    DashboardComponent._activeTab = 'overview';

    document.querySelectorAll('.sidebar-nav-item[data-tab]').forEach(item => {
      item.addEventListener('click', () => {
        DashboardComponent._activeTab = item.getAttribute('data-tab');
        document.querySelectorAll('.sidebar-nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const cu = window.db.getCurrentUser();
        if (!cu) return;
        const courses = window.db.getCourses();
        const enrolledCourses = courses.filter(c => (cu.enrolledCourses || []).includes(c.id));
        const wishlist = (cu.wishlist || []).map(id => courses.find(c => c.id === id)).filter(Boolean);
        const txns = window.db.getTransactions().filter(t => t.username === cu.username);
        const totalProgress = enrolledCourses.length > 0
          ? Math.round(enrolledCourses.reduce((sum, c) => {
              const p = window.db.getUserProgress(cu.username, c.id);
              const total = c.modules.reduce((a, m) => a + m.lessons.length, 0);
              const done = (p.completedLessons || []).length;
              return sum + (total > 0 ? (done / total) * 100 : 0);
            }, 0) / enrolledCourses.length)
          : 0;
        document.getElementById('student-tab-content').innerHTML = DashboardComponent._renderTab(DashboardComponent._activeTab, cu, enrolledCourses, wishlist, txns, totalProgress);
      });
    });
  }
};
window.DashboardComponent = DashboardComponent;
