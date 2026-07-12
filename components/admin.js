// Cubaze Academy — Admin Dashboard v4.0 (components/admin.js)
// Full LMS Super Admin Panel — Complete CRUD, Payment Management, Activity Log
const AdminComponent = {
  _sec: 'dashboard',      // active section
  _courseView: null,      // 'create' | 'edit' | 'modules' | null
  _editingId: null,       // courseId being edited / modules managed
  _paymentView: null,     // txnId being viewed

  /* ============================================================
     RENDER — main shell
  ============================================================ */
  render: function () {
    const cu = window.db.getCurrentUser();
    if (!cu) return `<div class="container" style="text-align:center;padding:100px 0;"><h2>Please Login</h2><button class="btn btn-primary" onclick="window.app.showAuthModal(true)" style="margin-top:16px;">Login</button></div>`;
    if (cu.role !== 'admin') return `<div class="container" style="text-align:center;padding:100px 0;"><h2>Access Denied</h2><a href="#/dashboard" class="btn btn-primary" style="margin-top:16px;">My Dashboard</a></div>`;

    const nav = [
      { title: 'Overview', items: [['dashboard','fa-gauge','Dashboard'],['activity','fa-scroll','Activity Log']] },
      { title: 'People', items: [['students','fa-users','Students'],['tutors','fa-chalkboard-user','Tutors'],['requests','fa-comments','Student Request']] },
      { title: 'Content', items: [['courses','fa-book-open','Courses'],['batches','fa-cubes','Batches'],['common_meeting','fa-calendar-days','Common Meeting'],['submissions','fa-inbox','Submissions'],['blog','fa-newspaper','Blog'],['reviews','fa-star','Reviews'],['coupons','fa-tag','Coupons'],['liveclasses','fa-video','Live Classes'],['posters','fa-image','Dashboard Posters']] },
      { title: 'Finance', items: [['payments','fa-credit-card','Payments']] },
      { title: 'System', items: [['settings','fa-gear','Settings']] }
    ];

    return `
    

    <div class="dashboard-layout container">
      <aside class="dashboard-sidebar">
        <div class="sidebar-profile">
          <div class="sidebar-avatar"><i class="fa-solid fa-crown"></i></div>
          <div class="sidebar-name">${cu.name}</div>
          <div class="sidebar-role">@${cu.username} · Admin</div>
        </div>
        ${nav.map(g => `
          <div class="sidebar-nav">
            <div class="admin-nav-section-title">${g.title}</div>
            ${g.items.map(([tab, icon, label]) =>
              `<div class="sidebar-nav-item ${AdminComponent._sec === tab ? 'active' : ''}" data-adm-tab="${tab}">
                <i class="fa-solid ${icon}"></i>${label}
                ${tab === 'requests' ? `<span class="support-badge" id="admin-unread-badge" style="display:none;"></span>` : ''}
              </div>`
            ).join('')}
          </div>`).join('')}
        <div class="sidebar-nav" style="border-top:1px solid var(--border-color); padding: 16px;">
          <a href="#/tutor" class="btn btn-outline-white btn-sm btn-block" style="margin-bottom:8px;"><i class="fa-solid fa-chalkboard-user"></i>Tutor View</a>
          <a href="#/" class="btn btn-primary btn-sm btn-block"><i class="fa-solid fa-globe"></i>View Website</a>
        </div>
      </aside>
      <main class="dashboard-content" id="adm-main">
        <div style="display:flex; flex-direction:column; gap:28px;">
          ${AdminComponent._renderSection(AdminComponent._sec)}
        </div>
      </main>
    </div>`;
  },

  _renderSection: function(s) {
    switch(s) {
      case 'dashboard':   return AdminComponent._renderDashboard();
      case 'students':    return AdminComponent._renderStudents();
      case 'tutors':      return AdminComponent._renderTutors();
      case 'courses':     return AdminComponent._renderCourses();
      case 'batches':     return AdminComponent._renderBatches();
      case 'payments':    return AdminComponent._renderPayments();
      case 'submissions': return AdminComponent._renderSubmissions();
      case 'coupons':     return AdminComponent._renderCoupons();
      case 'blog':        return AdminComponent._renderBlog();
      case 'reviews':     return AdminComponent._renderReviews();
      case 'activity':    return AdminComponent._renderActivity();
      case 'liveclasses': return AdminComponent._renderLiveClasses();
      case 'common_meeting': return AdminComponent._renderCommonMeetings();
      case 'posters':     return AdminComponent._renderPosters();
      case 'settings':    return AdminComponent._renderSettings();
      case 'requests':    return `<div id="admin-support-loading"><div class="spinner"></div></div>`;
      default:            return AdminComponent._renderDashboard();
    }
  },

  /* ============================================================
     DASHBOARD
  ============================================================ */
  _renderDashboard: function() {
    const a = window.db.getAdminAnalytics();
    const acts = window.db.getActivities().slice(0,6);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const revenueData = [12500,18200,22800,19500,28400,32100,41200,38900,45600,52300,49800,a.monthRevenue];
    const maxR = Math.max(...revenueData, 1);

    // Compute batch analytics
    const batches = window.db.getBatches();
    const activeBatchesCount = batches.filter(b => b.status === 'Active').length;
    const allUsers = window.db.getUsers();
    const tutors = allUsers.filter(u => u.role === 'instructor');
    const students = allUsers.filter(u => u.role === 'student');

    // Calculate students per batch details
    const batchList = batches.map(b => {
      const course = window.db.getCourses().find(c => c.id === b.courseId);
      const enrolledCount = students.filter(s => s.enrolledBatches && s.enrolledBatches[b.courseId] === b.id).length;
      const fillPct = b.maxStudents > 0 ? Math.round((enrolledCount / b.maxStudents) * 100) : 0;
      return {
        id: b.id,
        name: b.name,
        courseTitle: course ? course.title : b.courseId,
        enrolled: enrolledCount,
        maxStudents: b.maxStudents,
        fillPct
      };
    });

    // Calculate tutor performance details
    const tutorPerfList = tutors.map(t => {
      const assignedB = batches.filter(b => b.tutorIds && b.tutorIds.includes(t.username));
      const totalStuds = assignedB.reduce((sum, b) => {
        const count = students.filter(s => s.enrolledBatches && s.enrolledBatches[b.courseId] === b.id).length;
        return sum + count;
      }, 0);
      
      let totalPresents = 0;
      let totalRecords = 0;
      const allAttendance = JSON.parse(localStorage.getItem('cubaze_attendance')) || {};
      assignedB.forEach(b => {
        const batchAtt = allAttendance[b.id];
        if (batchAtt) {
          Object.values(batchAtt).forEach(dateRecord => {
            Object.values(dateRecord).forEach(status => {
              totalRecords++;
              if (status === 'Present') totalPresents++;
            });
          });
        }
      });
      const avgAtt = totalRecords > 0 ? Math.round((totalPresents / totalRecords) * 100) : null;
      const liveClassesCount = window.db.getLiveClasses().filter(lc => lc.tutor_id === t.username && lc.status === 'published').length;

      return {
        name: t.name,
        username: t.username,
        batchesCount: assignedB.length,
        studentsCount: totalStuds,
        avgAttendance: avgAtt !== null ? `${avgAtt}%` : '—',
        liveClassesCount
      };
    });

    const stats = [
      { ico:'blue',  icon:'fa-indian-rupee-sign', val:`₹${a.todayRevenue.toLocaleString('en-IN')}`,  lbl:"Today's Revenue" },
      { ico:'green', icon:'fa-sack-dollar',        val:`₹${a.monthRevenue.toLocaleString('en-IN')}`,  lbl:"Total Revenue" },
      { ico:'gold',  icon:'fa-hourglass-half',     val:a.pendingPayments,  lbl:"Pending Payments" },
      { ico:'green', icon:'fa-circle-check',       val:a.approvedPayments, lbl:"Approved Payments" },
      { ico:'red',   icon:'fa-circle-xmark',       val:a.deniedPayments,   lbl:"Denied Payments" },
      { ico:'blue',  icon:'fa-users',              val:a.totalStudents,    lbl:"Total Students" },
      { ico:'purple',icon:'fa-cubes',              val:batches.length,     lbl:"Total Batches" },
      { ico:'green', icon:'fa-circle-play',        val:activeBatchesCount, lbl:"Active Batches" },
      { ico:'purple',icon:'fa-chalkboard-user',    val:a.totalTutors,      lbl:"Total Tutors" },
    ];

    const cu = window.db.getCurrentUser();
    return `
      <div class="dashboard-overview-container">
        <div class="dashboard-main-col">
          <div class="dashboard-welcome">
            <h1>Admin Dashboard</h1>
            <p>${new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
          </div>

          ${a.pendingPayments > 0 ? `
            <div style="background:#FFFBEB;border:1.5px solid #FDE68A;border-radius:12px;padding:14px 20px;margin-bottom:20px;display:flex;align-items:center;gap:12px;">
              <i class="fa-solid fa-triangle-exclamation" style="color:#D97706;font-size:1.1rem;"></i>
              <div style="flex:1;font-size:0.85rem;color:#92400E;font-weight:600;">${a.pendingPayments} payment(s) awaiting your review.</div>
              <button class="btn btn-sm" style="background:#D97706;color:#fff;" onclick="AdminComponent._nav('payments')">Review Now</button>
            </div>` : ''}

          <div class="dashboard-widgets">
            ${stats.map(s => `
              <div class="widget-card">
                <div class="widget-icon ${s.ico}"><i class="fa-solid ${s.icon}"></i></div>
                <div><div class="widget-number">${s.val}</div><div class="widget-label">${s.lbl}</div></div>
              </div>`).join('')}
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px; margin-bottom:20px;">
            <div class="glass-panel">
              <div class="glass-panel-header"><div class="glass-panel-title"><i class="fa-solid fa-chart-bar" style="color:#3D46D8;margin-right:7px;"></i>Revenue Chart (2026)</div></div>
              <div style="padding:20px 22px;">
                <div class="adm-chart-bars">
                  ${revenueData.map((v,i) => `<div class="adm-chart-bar" style="height:${Math.round((v/maxR)*100)}%" title="${months[i]}: ₹${v.toLocaleString('en-IN')}"></div>`).join('')}
                </div>
                <div style="display:flex;gap:4px;margin-top:6px;">
                  ${months.map(m => `<div style="flex:1;text-align:center;font-size:0.62rem;color:#94A3B8;font-weight:600;">${m}</div>`).join('')}
                </div>
              </div>
            </div>
            <div class="glass-panel">
              <div class="glass-panel-header"><div class="glass-panel-title"><i class="fa-solid fa-trophy" style="color:#D97706;margin-right:7px;"></i>Top Course</div></div>
              <div style="padding:20px 22px;">
                <div style="font-weight:700;font-size:0.88rem;color:#0F172A;margin-bottom:8px;">${a.popularCourse}</div>
                <div style="font-size:0.78rem;color:#64748B;margin-bottom:16px;">Most purchased this period</div>
                <div style="background:#EFF2FE;border-radius:10px;padding:10px 14px;font-size:0.78rem;color:#3D46D8;font-weight:600;"><i class="fa-solid fa-fire"></i> Best Seller</div>
              </div>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:20px; margin-bottom:20px;">
            <div class="glass-panel">
              <div class="glass-panel-header">
                <div class="glass-panel-title"><i class="fa-solid fa-cubes" style="color:#3D46D8;margin-right:7px;"></i>Students per Batch</div>
              </div>
              <div style="max-height: 250px; overflow-y: auto;">
                <table class="data-table">
                  <thead><tr><th>Batch Name</th><th>Course</th><th>Enrollment</th><th>Fill Pct</th></tr></thead>
                  <tbody>
                    ${batchList.map(b => `
                      <tr>
                        <td style="font-weight:700; color:#0F172A; text-align:left;">${b.name}</td>
                        <td style="text-align:left; max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${b.courseTitle}</td>
                        <td><strong style="color:#0F172A;">${b.enrolled}</strong> / <span style="color:#64748B;">${b.maxStudents}</span></td>
                        <td>
                          <div style="display:flex; align-items:center; gap:8px;">
                            <div class="progress-bar-wrapper" style="flex:1; height:6px; margin:0;"><div class="progress-bar" style="width:${Math.min(b.fillPct, 100)}%; background:${b.fillPct >= 90 ? '#EF4444' : '#3D46D8'};"></div></div>
                            <span style="font-size:0.75rem; font-weight:600; color:${b.fillPct >= 90 ? '#EF4444' : '#0F172A'};">${b.fillPct}%</span>
                          </div>
                        </td>
                      </tr>`).join('')}
                    ${batchList.length === 0 ? '<tr><td colspan="4" style="text-align:center; color:#94A3B8; padding:20px;">No batches created yet.</td></tr>' : ''}
                  </tbody>
                </table>
              </div>
            </div>

            <div class="glass-panel">
              <div class="glass-panel-header">
                <div class="glass-panel-title"><i class="fa-solid fa-award" style="color:#3D46D8;margin-right:7px;"></i>Tutor Performance</div>
              </div>
              <div style="max-height: 250px; overflow-y: auto;">
                <table class="data-table">
                  <thead><tr><th>Tutor Name</th><th>Batches</th><th>Total Students</th><th>Avg Attendance</th><th>Live Classes</th></tr></thead>
                  <tbody>
                    ${tutorPerfList.map(t => `
                      <tr>
                        <td style="font-weight:700; color:#0F172A; text-align:left;">${t.name}</td>
                        <td>${t.batchesCount}</td>
                        <td style="font-weight:600; color:#0F172A;">${t.studentsCount}</td>
                        <td style="font-weight:600; color:#059669;">${t.avgAttendance}</td>
                        <td>${t.liveClassesCount}</td>
                      </tr>`).join('')}
                    ${tutorPerfList.length === 0 ? '<tr><td colspan="5" style="text-align:center; color:#94A3B8; padding:20px;">No tutors registered yet.</td></tr>' : ''}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:20px;">
            <div class="glass-panel">
              <div class="glass-panel-header">
                <div class="glass-panel-title"><i class="fa-solid fa-credit-card" style="color:#3D46D8;margin-right:7px;"></i>Recent Payments</div>
                <button class="btn btn-outline-white btn-sm" onclick="AdminComponent._nav('payments')">View All</button>
              </div>
              <table class="data-table">
                <thead><tr><th>Student</th><th>Course</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  ${a.recentTransactions.map(t => `
                    <tr>
                      <td style="font-weight:600;">${t.username}</td>
                      <td style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${t.courseTitle}</td>
                      <td style="font-weight:700;color:#059669;">₹${t.amount.toLocaleString('en-IN')}</td>
                      <td>${AdminComponent._payBadge(t.adminStatus || t.status)}</td>
                    </tr>`).join('')}
                  ${a.recentTransactions.length === 0 ? `<tr><td colspan="4" style="text-align:center;color:#94A3B8;padding:20px;">No transactions yet.</td></tr>` : ''}
                </tbody>
              </table>
            </div>
            <div class="glass-panel">
              <div class="glass-panel-header">
                <div class="glass-panel-title"><i class="fa-solid fa-scroll" style="color:#3D46D8;margin-right:7px;"></i>Activity Log</div>
                <button class="btn btn-outline-white btn-sm" onclick="AdminComponent._nav('activity')">View All</button>
              </div>
              <div style="padding:0 4px;">
                ${acts.length === 0 ? `<div style="padding:20px;text-align:center;color:#94A3B8;font-size:0.83rem;">No activity yet.</div>` :
                  acts.map(act => `
                    <div style="display:flex;gap:12px;align-items:flex-start;padding:12px 18px;border-bottom:1px solid #F8FAFC;">
                      <div style="width:28px;height:28px;border-radius:8px;background:#EFF2FE;color:#3D46D8;display:flex;align-items:center;justify-content:center;font-size:0.72rem;flex-shrink:0;"><i class="fa-solid fa-bolt"></i></div>
                      <div>
                        <div style="font-size:0.8rem;font-weight:600;color:#0F172A;">${act.action.replace(/_/g,' ')}</div>
                        <div style="font-size:0.72rem;color:#94A3B8;">${act.details} · ${new Date(act.timestamp).toLocaleString('en-IN')}</div>
                      </div>
                    </div>`).join('')}
              </div>
            </div>
          </div>
        </div>
        ${window.DashboardRightPanel ? window.DashboardRightPanel.render(cu) : ''}
      </div>`;
  },

  /* ============================================================
     STUDENTS
  ============================================================ */
  _renderStudents: function(search='', filter='') {
    let users = window.db.getUsers().filter(u => u.role === 'student' && !u.deleted);
    if (search) users = users.filter(u => (u.name+u.username).toLowerCase().includes(search.toLowerCase()));
    if (filter === 'suspended') users = users.filter(u => u.suspended);
    else if (filter === 'active') users = users.filter(u => !u.suspended);
    const allCourses = window.db.getCourses();
    return `
      <div class="dashboard-welcome">
        <h1>Students <span style="font-size:1rem;font-weight:500;color:#64748B;">(${users.length})</span></h1>
        <p>Manage all registered students.</p>
      </div>
      <div class="glass-panel">
        <div class="table-actions-bar">
          <div class="table-actions-left">
            <div class="search-input-wrapper" style="width: 240px;">
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
              <input id="stu-search" placeholder="Search students..." value="${search}">
            </div>
            <select id="stu-filter" style="width: 160px; height: 46px;">
              <option value="" ${!filter?'selected':''}>All Students</option>
              <option value="active" ${filter==='active'?'selected':''}>Active</option>
              <option value="suspended" ${filter==='suspended'?'selected':''}>Suspended</option>
            </select>
            <div id="stu-bulk-actions" style="display:none; align-items:center; gap:8px; margin-left:12px;">
              <span id="stu-bulk-count" style="font-size:0.8rem; font-weight:700; color:#475569; margin-right:8px; white-space:nowrap;">0 selected</span>
              <button class="btn btn-outline-white btn-sm" onclick="AdminComponent._bulkSuspendUsers('students', true)" style="height: 46px; padding: 0 16px; border-color:#d97706; color:#d97706;"><i class="fa-solid fa-ban"></i> Suspend</button>
              <button class="btn btn-outline-white btn-sm" onclick="AdminComponent._bulkSuspendUsers('students', false)" style="height: 46px; padding: 0 16px; border-color:#059669; color:#059669;"><i class="fa-solid fa-circle-check"></i> Activate</button>
              <button class="btn btn-outline-white btn-sm" onclick="AdminComponent._bulkDeleteUsers('students')" style="height: 46px; padding: 0 16px; border-color:#dc2626; color:#dc2626;"><i class="fa-solid fa-trash-can"></i> Delete</button>
            </div>
          </div>
          <div class="table-actions-right" style="display:flex; gap:8px;">
            <button class="btn btn-outline-white btn-sm" onclick="AdminComponent._showAddStudentModal()" style="height: 46px; padding: 0 16px; border-color:var(--brand-blue); color:var(--brand-blue);"><i class="fa-solid fa-user-plus"></i> Add Student</button>
            <button class="btn btn-primary btn-sm" onclick="AdminComponent._showEnrollStudentModal()" style="height: 46px; padding: 0 16px;"><i class="fa-solid fa-graduation-cap"></i> Enroll Student</button>
            <button class="btn btn-outline-white btn-sm" onclick="AdminComponent._exportCSV('students')" style="height: 46px; padding: 0 16px;"><i class="fa-solid fa-download"></i> Export CSV</button>
            <button class="btn btn-outline-white btn-sm" onclick="document.getElementById('student-csv-input').click()" style="height: 46px; padding: 0 16px;"><i class="fa-solid fa-upload"></i> Import CSV</button>
            <input type="file" id="student-csv-input" accept=".csv" style="display:none;" onchange="AdminComponent._importCSV(event, 'students')">
          </div>
        </div>
        <table class="data-table">
          <thead><tr><th><input type="checkbox" id="stu-check-all"></th><th>Student</th><th>Username</th><th>Enrolled</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            ${users.map(u => {
              const enrolledIds = u.enrolledCourses || [];
              const enrolledNames = enrolledIds.map(id => {
                const c = allCourses.find(x => x.id === id);
                return c ? c.title : id;
              });
              return `
              <tr>
                <td><input type="checkbox" class="stu-check" data-username="${u.username}"></td>
                <td>
                  <div style="display:flex;align-items:center;gap:10px;">
                    <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#3D46D8,#6366F1);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.82rem;color:#fff;flex-shrink:0;">${u.name.charAt(0)}</div>
                    <div><div style="font-weight:700;color:#0F172A;font-size:0.85rem;">${u.name}</div></div>
                  </div>
                </td>
                <td style="color:#64748B;">@${u.username}</td>
                <td style="max-width:220px;" title="${enrolledNames.join(', ')}">
                  ${enrolledNames.length === 0 ? `<span style="color:#94A3B8;font-style:italic;font-size:0.78rem;">None enrolled</span>` :
                    enrolledNames.slice(0, 2).map(n => `<span style="display:inline-block;background:#EFF2FE;color:#3D46D8;padding:2px 8px;border-radius:20px;font-size:0.7rem;font-weight:600;margin:2px;">${n.slice(0, 22)}${n.length > 22 ? '...' : ''}</span>`).join('') + (enrolledNames.length > 2 ? `<span style="font-size:0.72rem;color:#94A3B8;cursor:help;">+${enrolledNames.length - 2} more</span>` : '')}
                </td>
                <td>${u.suspended ? '<span class="status-badge danger">⚫ Suspended</span>' : '<span class="status-badge success">🟢 Active</span>'}</td>
                <td style="color:#94A3B8;font-size:0.78rem;">${u.registeredDate||'—'}</td>
                <td>
                  <div class="adm-action-wrap">
                    <button class="btn btn-outline-white btn-sm btn-icon" onclick="AdminComponent._openAdmMenu(this, event)"><i class="fa-solid fa-ellipsis"></i></button>
                    <div class="adm-action-menu">
                      <button onclick="AdminComponent._viewStudent('${u.username}')"><i class="fa-solid fa-eye" style="color:#3D46D8;"></i> View Profile</button>
                      <button onclick="AdminComponent._showAssignStudentCoursesModal('${u.username}','${u.name}')"><i class="fa-solid fa-graduation-cap" style="color:#3D46D8;"></i> Assign Courses</button>
                      <button onclick="AdminComponent._showResetModal('${u.username}','${u.name}')"><i class="fa-solid fa-key" style="color:#D97706;"></i> Reset Password</button>
                      <div class="adm-menu-divider"></div>
                      ${u.suspended
                        ? `<button onclick="AdminComponent._activateUser('${u.username}')"><i class="fa-solid fa-circle-check" style="color:#059669;"></i> Activate</button>`
                        : `<button onclick="AdminComponent._suspendUser('${u.username}')"><i class="fa-solid fa-ban" style="color:#D97706;"></i> Suspend</button>`}
                      <button class="danger" onclick="AdminComponent._deleteUser('${u.username}','student')"><i class="fa-solid fa-trash-can"></i> Delete</button>
                    </div>
                  </div>
                </td>
              </tr>`;}).join('')}
            ${users.length === 0 ? `<tr><td colspan="7" style="text-align:center;color:#94A3B8;padding:32px;">No students found.</td></tr>` : ''}
          </tbody>
        </table>
      </div>`;
  },

  /* ============================================================
     TUTORS
  ============================================================ */
  _renderTutors: function(search='') {
    let users = window.db.getUsers().filter(u => u.role === 'instructor' && !u.deleted);
    if (search) users = users.filter(u => (u.name+u.username).toLowerCase().includes(search.toLowerCase()));
    const allCourses = window.db.getCourses();
    return `
      <div class="dashboard-welcome">
        <h1>Tutors <span style="font-size:1rem;font-weight:500;color:#64748B;">(${users.length})</span></h1>
        <p>Manage instructors and their assigned courses.</p>
      </div>
      <div class="glass-panel" style="margin-bottom:20px;">
        <div class="table-actions-bar">
          <div class="table-actions-left">
            <div class="search-input-wrapper" style="width: 240px;">
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
              <input id="tut-search" placeholder="Search tutors..." value="${search}">
            </div>
            <div id="tut-bulk-actions" style="display:none; align-items:center; gap:8px; margin-left:12px;">
              <span id="tut-bulk-count" style="font-size:0.8rem; font-weight:700; color:#475569; margin-right:8px; white-space:nowrap;">0 selected</span>
              <button class="btn btn-outline-white btn-sm" onclick="AdminComponent._bulkSuspendUsers('tutors', true)" style="height: 46px; padding: 0 16px; border-color:#d97706; color:#d97706;"><i class="fa-solid fa-ban"></i> Suspend</button>
              <button class="btn btn-outline-white btn-sm" onclick="AdminComponent._bulkSuspendUsers('tutors', false)" style="height: 46px; padding: 0 16px; border-color:#059669; color:#059669;"><i class="fa-solid fa-circle-check"></i> Activate</button>
              <button class="btn btn-outline-white btn-sm" onclick="AdminComponent._bulkDeleteUsers('tutors')" style="height: 46px; padding: 0 16px; border-color:#dc2626; color:#dc2626;"><i class="fa-solid fa-trash-can"></i> Delete</button>
            </div>
          </div>
          <div class="table-actions-right">
            <button class="btn btn-primary btn-sm" onclick="AdminComponent._showAddTutorForm()" style="height: 46px; padding: 0 16px;"><i class="fa-solid fa-plus"></i> Add Tutor</button>
            <button class="btn btn-outline-white btn-sm" onclick="AdminComponent._exportCSV('tutors')" style="height: 46px; padding: 0 16px;"><i class="fa-solid fa-download"></i> Export CSV</button>
            <button class="btn btn-outline-white btn-sm" onclick="document.getElementById('tutor-csv-input').click()" style="height: 46px; padding: 0 16px;"><i class="fa-solid fa-upload"></i> Import CSV</button>
            <input type="file" id="tutor-csv-input" accept=".csv" style="display:none;" onchange="AdminComponent._importCSV(event, 'tutors')">
          </div>
        </div>
        <table class="data-table">
          <thead><tr><th><input type="checkbox" id="tut-check-all"></th><th>Name</th><th>Username</th><th>Assigned Courses</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            ${users.map(u => {
              const assigned = (u.assignedCourses||[]);
              const names = assigned.map(id=>{const c=allCourses.find(x=>x.id===id);return c?c.title:id;});
              return `
              <tr>
                <td><input type="checkbox" class="tut-check" data-username="${u.username}"></td>
                <td>
                  <div style="display:flex;align-items:center;gap:10px;">
                    <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#7C3AED,#6366F1);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;color:#fff;flex-shrink:0;">${u.name.charAt(0)}</div>
                    <div>
                      <div style="font-weight:700;color:#0F172A;font-size:0.85rem;">${u.name}</div>
                      <div style="font-size:0.72rem;color:#94A3B8;">${u.authorBio?u.authorBio.slice(0,40)+'...':'No bio'}</div>
                    </div>
                  </div>
                </td>
                <td style="color:#64748B;">@${u.username}</td>
                <td style="max-width:220px;" title="${names.join(', ')}">
                  ${names.length===0?`<span style="color:#94A3B8;font-style:italic;font-size:0.78rem;">None assigned</span>`:
                    names.slice(0,2).map(n=>`<span style="display:inline-block;background:#EFF2FE;color:#3D46D8;padding:2px 8px;border-radius:20px;font-size:0.7rem;font-weight:600;margin:2px;">${n.slice(0,22)}</span>`).join('')+(names.length>2?`<span style="font-size:0.72rem;color:#94A3B8;cursor:help;">+${names.length-2} more</span>`:'')}
                </td>
                <td>${u.suspended?'<span class="status-badge danger">⚫ Suspended</span>':'<span class="status-badge success">🟢 Active</span>'}</td>
                <td style="color:#94A3B8;font-size:0.78rem;">${u.registeredDate||'—'}</td>
                <td>
                  <div class="adm-action-wrap">
                    <button class="btn btn-outline-white btn-sm btn-icon" onclick="AdminComponent._openAdmMenu(this, event)"><i class="fa-solid fa-ellipsis"></i></button>
                    <div class="adm-action-menu">
                      <button onclick="AdminComponent._viewTutor('${u.username}')"><i class="fa-solid fa-eye" style="color:#3D46D8;"></i> View Profile</button>
                      <button onclick="AdminComponent._showAssignCoursesModal('${u.username}','${u.name}')"><i class="fa-solid fa-graduation-cap" style="color:#3D46D8;"></i> Assign Courses</button>
                      <button onclick="AdminComponent._showResetModal('${u.username}','${u.name}')"><i class="fa-solid fa-key" style="color:#D97706;"></i> Reset Password</button>
                      <div class="adm-menu-divider"></div>
                      ${u.suspended
                        ?`<button onclick="AdminComponent._activateUser('${u.username}')"><i class="fa-solid fa-circle-check" style="color:#059669;"></i> Activate</button>`
                        :`<button onclick="AdminComponent._suspendUser('${u.username}')"><i class="fa-solid fa-ban" style="color:#D97706;"></i> Suspend</button>`}
                      <button class="danger" onclick="AdminComponent._deleteUser('${u.username}','tutor')"><i class="fa-solid fa-trash-can"></i> Delete</button>
                    </div>
                  </div>
                </td>
              </tr>`;}).join('')}
            ${users.length===0?`<tr><td colspan="7" style="text-align:center;color:#94A3B8;padding:32px;">No tutors found.</td></tr>`:''}
          </tbody>
        </table>
      </div>`;
  },

  /* ============================================================
     COURSES
  ============================================================ */
  _renderBatches: function(search='', courseId='', tutorId='', status='', date='') {
    let batches = window.db.getBatches();
    const courses = window.db.getCourses();
    const tutors = window.db.getUsers().filter(u => u.role==='instructor');
    
    // Filtering
    if (search) {
      batches = batches.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase()));
    }
    if (courseId) {
      batches = batches.filter(b => b.courseId === courseId);
    }
    if (tutorId) {
      batches = batches.filter(b => b.tutorIds && b.tutorIds.includes(tutorId));
    }
    if (status) {
      batches = batches.filter(b => b.status === status);
    }
    if (date) {
      batches = batches.filter(b => b.startDate <= date && b.endDate >= date);
    }

    return `
      <div class="dashboard-welcome">
        <h1>Batch Management <span style="font-size:1rem;font-weight:500;color:#64748B;">(${batches.length})</span></h1>
        <p>Create, edit, duplicate, and archive batches for courses.</p>
      </div>
      <div class="glass-panel" style="margin-bottom:20px;">
        <div class="table-actions-bar" style="flex-wrap: wrap; gap: 12px; height: auto; padding: 16px 20px;">
          <div class="table-actions-left" style="flex-wrap: wrap; gap: 10px; flex: 1;">
            <div class="search-input-wrapper" style="width: 200px;">
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
              <input id="bt-search" placeholder="Search batch name/code..." value="${search}">
            </div>
            <select id="bt-course" style="width: 150px; height: 46px; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-card); font-family: inherit; font-size: 0.85rem; padding: 0 12px;">
              <option value="">All Courses</option>
              ${courses.map(c => `<option value="${c.id}" ${courseId===c.id?'selected':''}>${c.title}</option>`).join('')}
            </select>
            <select id="bt-tutor" style="width: 150px; height: 46px; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-card); font-family: inherit; font-size: 0.85rem; padding: 0 12px;">
              <option value="">All Tutors</option>
              ${tutors.map(t => `<option value="${t.username}" ${tutorId===t.username?'selected':''}>${t.name}</option>`).join('')}
            </select>
            <select id="bt-status" style="width: 150px; height: 46px; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-card); font-family: inherit; font-size: 0.85rem; padding: 0 12px;">
              <option value="">All Status</option>
              ${['Enrollment Open', 'Upcoming', 'Active', 'Completed', 'Archived'].map(s => `<option value="${s}" ${status===s?'selected':''}>${s}</option>`).join('')}
            </select>
            <input type="date" id="bt-date" value="${date}" style="height: 46px; width: 140px; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-card); font-family: inherit; font-size: 0.85rem; padding: 0 12px;">
          </div>
          <div class="table-actions-right">
            <button class="btn btn-primary btn-sm" onclick="AdminComponent._showCreateBatch()" style="height: 46px; padding: 0 16px;"><i class="fa-solid fa-plus"></i> Create Batch</button>
            <button class="btn btn-outline-white btn-sm" onclick="AdminComponent._exportCSV('batches')" style="height: 46px; padding: 0 16px;"><i class="fa-solid fa-download"></i> Export CSV</button>
          </div>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Batch Code</th>
              <th>Batch Name</th>
              <th>Course</th>
              <th>Assigned Tutor</th>
              <th>Enrollment</th>
              <th>Schedule</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${batches.map(b => {
              const course = courses.find(c => c.id === b.courseId);
              const tutorNames = b.tutorIds.map(tid => {
                const t = tutors.find(x => x.username === tid);
                return t ? t.name : tid;
              }).join(', ');
              
              let statusClass = 'status-badge';
              if (b.status === 'Active') statusClass += ' success';
              else if (b.status === 'Enrollment Open') statusClass += ' warning';
              else if (b.status === 'Completed') statusClass += ' info';
              else if (b.status === 'Archived') statusClass += ' danger';
              
              return `
                <tr>
                  <td style="font-family:monospace;font-weight:700;color:#3D46D8;">${b.id}</td>
                  <td style="font-weight:700;color:#0F172A;">${b.name}</td>
                  <td>${course ? course.title : b.courseId}</td>
                  <td>${tutorNames || '—'}</td>
                  <td>
                    <div>Enrolled: <strong>${b.currentEnrollment || 0}</strong></div>
                    <div style="font-size:0.75rem; color:#64748B;">Max: ${b.maxStudents}</div>
                    <div style="font-size:0.75rem; color:${(b.maxStudents - (b.currentEnrollment || 0)) > 0 ? '#10B981' : '#EF4444'}; font-weight:700;">Seats: ${b.maxStudents - (b.currentEnrollment || 0)}</div>
                  </td>
                  <td>
                    <div style="font-size:0.78rem;font-weight:600;">${b.classTime || '—'}</div>
                    <div style="font-size:0.72rem;color:#94A3B8;">${(b.classDays || []).join(', ') || '—'}</div>
                  </td>
                  <td><span class="${statusClass}">${b.status}</span></td>
                  <td>
                    <div class="adm-action-wrap">
                      <button class="btn btn-outline-white btn-sm btn-icon" onclick="AdminComponent._openAdmMenu(this, event)"><i class="fa-solid fa-ellipsis"></i></button>
                      <div class="adm-action-menu">
                        <button onclick="AdminComponent._showEditBatch('${b.id}')"><i class="fa-solid fa-pen-to-square" style="color:#D97706;"></i> Edit</button>
                        <button onclick="AdminComponent._duplicateBatch('${b.id}')"><i class="fa-solid fa-copy" style="color:#64748B;"></i> Duplicate</button>
                        <button onclick="AdminComponent._archiveBatch('${b.id}')"><i class="fa-solid fa-box-archive" style="color:#64748B;"></i> Archive</button>
                        <div class="adm-menu-divider"></div>
                        <button class="danger" onclick="AdminComponent._deleteBatch('${b.id}')"><i class="fa-solid fa-trash-can"></i> Delete</button>
                      </div>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
            ${batches.length === 0 ? `<tr><td colspan="8" style="text-align:center;color:#94A3B8;padding:32px;">No batches found.</td></tr>` : ''}
          </tbody>
        </table>
      </div>
      <div id="batch-form-panel" class="adm-modal-overlay" style="display:none;"></div>
    `;
  },

  _renderBatchForm: function(batch) {
    const isEdit = !!batch;
    const courses = window.db.getCourses();
    const tutors = window.db.getUsers().filter(u => u.role==='instructor');
    const classDaysList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const activeDays = batch ? (batch.classDays || []) : [];
    const activeTutors = batch ? (batch.tutorIds || []) : [];

    return `
      <div class="adm-modal" style="max-width: 800px; width: 100%;">
        <div class="glass-panel-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 20px;">
          <div class="glass-panel-title" style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);"><i class="fa-solid fa-cubes" style="color:#3D46D8;margin-right:7px;"></i>${isEdit?'Edit Batch':'Create New Batch'}</div>
          <button type="button" class="btn btn-outline-white btn-sm btn-icon" style="width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;" onclick="document.getElementById('batch-form-panel').style.display='none'"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div>
          <form id="form-batch">
            <input type="hidden" id="bf-id" value="${batch?batch.id:''}">
            <div class="form-grid" style="margin-bottom:14px; grid-template-columns: repeat(2, 1fr);">
              <div class="form-group">
                <label>Batch Name *</label>
                <input class="form-control" type="text" id="bf-name" required placeholder="e.g. Blender Premium - Batch 3" value="${batch?batch.name:''}">
              </div>
              <div class="form-group">
                <label>Course *</label>
                <select id="bf-course" class="form-control" required>
                  <option value="">-- Select Course --</option>
                  ${courses.map(c => `<option value="${c.id}" ${batch&&batch.courseId===c.id?'selected':''}>${c.title}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>Max Students *</label>
                <input class="form-control" type="number" id="bf-max" required placeholder="50" value="${batch?batch.maxStudents:'50'}">
              </div>
              <div class="form-group">
                <label>Class Time</label>
                <input class="form-control" type="text" id="bf-time" placeholder="e.g. 18:00 - 20:00" value="${batch?batch.classTime:''}">
              </div>
              <div class="form-group">
                <label>Start Date</label>
                <input class="form-control" type="date" id="bf-start" value="${batch?batch.startDate:''}">
              </div>
              <div class="form-group">
                <label>End Date</label>
                <input class="form-control" type="date" id="bf-end" value="${batch?batch.endDate:''}">
              </div>
              <div class="form-group">
                <label>Google Meet Link</label>
                <input class="form-control" type="url" id="bf-meet" placeholder="https://meet.google.com/..." value="${batch?batch.googleMeetLink:''}">
              </div>
              <div class="form-group">
                <label>Google Drive Resource Folder</label>
                <input class="form-control" type="url" id="bf-drive" placeholder="https://drive.google.com/..." value="${batch?batch.googleDriveFolder:''}">
              </div>
              <div class="form-group">
                <label>WhatsApp Group Link</label>
                <input class="form-control" type="url" id="bf-whatsapp" placeholder="https://chat.whatsapp.com/..." value="${batch && batch.whatsappLink ? batch.whatsappLink : ''}">
              </div>
              <div class="form-group">
                <label>Status</label>
                <select id="bf-status" class="form-control">
                  ${['Enrollment Open', 'Upcoming', 'Active', 'Full', 'Completed', 'Archived'].map(s => `<option value="${s}" ${batch&&batch.status===s?'selected':''}>${s}</option>`).join('')}
                </select>
              </div>
            </div>
            
            <div class="form-group" style="margin-bottom:14px;">
              <label>Assign Tutor(s) *</label>
              <div style="display:flex; gap:16px; flex-wrap:wrap; margin-top:8px;">
                ${tutors.map(t => `
                  <label style="display:flex; align-items:center; gap:6px; font-weight:600; cursor:pointer;">
                    <input type="checkbox" class="bf-tutors-cb" value="${t.username}" ${activeTutors.includes(t.username)?'checked':''}> ${t.name}
                  </label>
                `).join('')}
                ${tutors.length === 0 ? '<div style="color:var(--text-muted); font-size:0.85rem;">No tutors registered yet. Create a tutor profile first.</div>' : ''}
              </div>
            </div>

            <div class="form-group" style="margin-bottom:20px;">
              <label>Class Days *</label>
              <div style="display:flex; gap:16px; flex-wrap:wrap; margin-top:8px;">
                ${classDaysList.map(d => `
                  <label style="display:flex; align-items:center; gap:6px; font-weight:600; cursor:pointer;">
                    <input type="checkbox" class="bf-days-cb" value="${d}" ${activeDays.includes(d)?'checked':''}> ${d}
                  </label>
                `).join('')}
              </div>
            </div>

            <div style="display:flex; gap:10px; justify-content:flex-end; border-top: 1px solid var(--border-color); padding-top: 16px; margin-top: 16px;">
              <button type="button" class="btn btn-outline-white" onclick="document.getElementById('batch-form-panel').style.display='none'">Cancel</button>
              <button type="submit" class="btn btn-primary"><i class="fa-solid fa-save"></i> ${isEdit?'Save Changes':'Create Batch'}</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  _showCreateBatch: function() {
    const panel = document.getElementById('batch-form-panel');
    panel.innerHTML = AdminComponent._renderBatchForm(null);
    panel.style.display = 'flex';
    panel.onclick = (e) => { if (e.target === panel) panel.style.display = 'none'; };
    AdminComponent._bindBatchForm();
  },

  _showEditBatch: function(id) {
    const batch = window.db.getBatchById(id);
    if (!batch) return;
    const panel = document.getElementById('batch-form-panel');
    panel.innerHTML = AdminComponent._renderBatchForm(batch);
    panel.style.display = 'flex';
    panel.onclick = (e) => { if (e.target === panel) panel.style.display = 'none'; };
    AdminComponent._bindBatchForm();
  },

  _duplicateBatch: function(id) {
    if (!confirm('Duplicate this batch?')) return;
    const res = window.db.duplicateBatch(id);
    if (res.success) {
      window.app.showToast('Batch duplicated successfully!','success');
      AdminComponent._nav('batches');
    } else {
      window.app.showToast(res.error || 'Failed to duplicate batch.', 'danger');
    }
  },

  _archiveBatch: function(id) {
    if (!confirm('Archive this batch?')) return;
    const res = window.db.archiveBatch(id);
    if (res.success) {
      window.app.showToast('Batch archived!','success');
      AdminComponent._nav('batches');
    } else {
      window.app.showToast(res.error || 'Failed to archive batch.', 'danger');
    }
  },

  _deleteBatch: function(id) {
    if (!confirm('Are you sure you want to permanently delete this batch? This action cannot be undone.')) return;
    const res = window.db.deleteBatch(id);
    if (res.success) {
      window.app.showToast('Batch deleted permanently.','success');
      AdminComponent._nav('batches');
    } else {
      window.app.showToast(res.error || 'Failed to delete batch.', 'danger');
    }
  },

  _renderCourses: function(search='',filter='') {
    let courses = window.db.getCourses();
    if (search) courses = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
    if (filter === 'published') courses = courses.filter(c => c.published && !c.archived);
    else if (filter === 'draft') courses = courses.filter(c => !c.published && !c.archived);
    else if (filter === 'archived') courses = courses.filter(c => c.archived);
    else courses = courses.filter(c => !c.archived);

    const statusBadge = c => {
      if (c.archived) return '<span class="status-badge status-badge">📦 Archived</span>';
      if (c.published) return '<span class="status-badge success">🟢 Published</span>';
      return '<span class="status-badge status-badge">⚪ Draft</span>';
    };

    return `
      <div class="dashboard-welcome">
        <h1>Courses <span style="font-size:1rem;font-weight:500;color:#64748B;">(${courses.length})</span></h1>
        <p>Create, edit, publish and manage all courses.</p>
      </div>
      <div class="glass-panel" style="margin-bottom:20px;">
        <div class="table-actions-bar">
          <div class="table-actions-left">
            <div class="search-input-wrapper" style="width: 240px;">
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
              <input id="crs-search" placeholder="Search courses..." value="${search}">
            </div>
            <select id="crs-filter" style="width: 160px; height: 46px;">
              <option value="">All Status</option>
              <option value="published" ${filter==='published'?'selected':''}>Published</option>
              <option value="draft" ${filter==='draft'?'selected':''}>Draft</option>
              <option value="archived" ${filter==='archived'?'selected':''}>Archived</option>
            </select>
          </div>
          <div class="table-actions-right">
            <button class="btn btn-primary btn-sm" onclick="AdminComponent._showCreateCourse()" style="height: 46px; padding: 0 16px;"><i class="fa-solid fa-plus"></i> New Course</button>
            <button class="btn btn-outline-white btn-sm" onclick="AdminComponent._exportCSV('courses')" style="height: 46px; padding: 0 16px;"><i class="fa-solid fa-download"></i> Export CSV</button>
          </div>
        </div>
        <table class="data-table">
          <thead><tr><th>Course</th><th>Price</th><th>Students</th><th>Rating</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead>
          <tbody>
            ${courses.map(c => `
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:12px;">
                    <img src="${c.image}" style="width:56px;height:38px;object-fit:cover;border-radius:8px;flex-shrink:0;">
                    <div>
                      <div style="font-weight:700;font-size:0.85rem;color:#0F172A;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${c.title}</div>
                      <div style="font-size:0.72rem;color:#94A3B8;">${c.lessonsCount||0} lessons · ${c.level||'—'}</div>
                    </div>
                  </div>
                </td>
                <td style="font-weight:700;color:#0F172A;">₹${c.price.toLocaleString('en-IN')}</td>
                <td style="font-weight:600;">${(c.studentsCount||0).toLocaleString('en-IN')}</td>
                <td style="color:#D97706;font-weight:700;">★ ${c.rating}</td>
                <td>${statusBadge(c)}</td>
                <td style="color:#94A3B8;font-size:0.78rem;">${c.updatedDate||c.createdDate||'—'}</td>
                <td>
                  <div class="adm-action-wrap">
                    <button class="btn btn-outline-white btn-sm btn-icon" onclick="AdminComponent._openAdmMenu(this, event)"><i class="fa-solid fa-ellipsis"></i></button>
                    <div class="adm-action-menu">
                      <button onclick="window.location.hash='/course/${c.id}'"><i class="fa-solid fa-eye" style="color:#3D46D8;"></i> View</button>
                      <button onclick="AdminComponent._showEditCourse('${c.id}')"><i class="fa-solid fa-pen-to-square" style="color:#D97706;"></i> Edit</button>
                      <button onclick="AdminComponent._manageModules('${c.id}')"><i class="fa-solid fa-list-check" style="color:#7C3AED;"></i> Manage Lessons</button>
                      <button onclick="AdminComponent._duplicateCourse('${c.id}')"><i class="fa-solid fa-copy" style="color:#64748B;"></i> Duplicate</button>
                      <div class="adm-menu-divider"></div>
                      ${c.published
                        ? `<button onclick="AdminComponent._unpublishCourse('${c.id}')"><i class="fa-solid fa-eye-slash" style="color:#D97706;"></i> Unpublish</button>`
                        : `<button onclick="AdminComponent._publishCourse('${c.id}')"><i class="fa-solid fa-globe" style="color:#059669;"></i> Publish</button>`}
                      ${c.archived
                        ? `<button onclick="AdminComponent._restoreCourse('${c.id}')"><i class="fa-solid fa-rotate-left" style="color:#64748B;"></i> Restore</button>`
                        : `<button onclick="AdminComponent._archiveCourse('${c.id}')"><i class="fa-solid fa-box-archive" style="color:#64748B;"></i> Archive</button>`}
                      <div class="adm-menu-divider"></div>
                      <button class="danger" onclick="AdminComponent._deleteCourse('${c.id}')"><i class="fa-solid fa-trash-can"></i> Delete</button>
                    </div>
                  </div>
                </td>
              </tr>`).join('')}
            ${courses.length===0?`<tr><td colspan="7" style="text-align:center;color:#94A3B8;padding:32px;">No courses found.</td></tr>`:''}
          </tbody>
        </table>
      </div>
      <div id="course-form-panel" class="adm-modal-overlay" style="display:none;"></div>
      <div id="modules-panel" class="adm-modal-overlay" style="display:none;"></div>`;
  },

  _renderCourseForm: function(course) {
    const isEdit = !!course;
    const tutors = window.db.getUsers().filter(u => u.role==='instructor');
    return `
      <div class="adm-modal" style="max-width: 800px; width: 100%;">
        <div class="glass-panel-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 20px;">
          <div class="glass-panel-title" style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);"><i class="fa-solid ${isEdit?'fa-pen-to-square':'fa-plus'}" style="color:#3D46D8;margin-right:7px;"></i>${isEdit?'Edit Course':'Create New Course'}</div>
          <button type="button" class="btn btn-outline-white btn-sm btn-icon" style="width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;" onclick="document.getElementById('course-form-panel').style.display='none'"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div>
          <form id="form-course">
            <input type="hidden" id="cf-id" value="${course?course.id:''}">
            <div class="form-grid" style="margin-bottom:14px; grid-template-columns: repeat(2, 1fr);">
              <div class="form-group"><label>Course Title *</label><input class="form-control" type="text" id="cf-title" required placeholder="e.g. Blender Premium Course" value="${course?course.title:''}"></div>
              <div class="form-group"><label>Price (₹) *</label><input class="form-control" type="number" id="cf-price" required placeholder="1999" value="${course?course.price:''}"></div>
              <div class="form-group"><label>Level</label>
                <select id="cf-level" class="form-control">
                  ${['Beginner','Intermediate','Advanced','Beginner to Advanced','All Levels'].map(l=>`<option ${course&&course.level===l?'selected':''}>${l}</option>`).join('')}
                </select>
              </div>
              <div class="form-group"><label>Duration</label><input class="form-control" type="text" id="cf-duration" placeholder="e.g. 28 Hours" value="${course?course.duration:''}"></div>
              <div class="form-group"><label>Category</label><input class="form-control" type="text" id="cf-category" placeholder="e.g. 3D Design" value="${course?course.category:''}"></div>
              <div class="form-group"><label>Assign Tutor</label>
                <select id="cf-tutor" class="form-control">
                  <option value="admin">Cubaze Academy (Admin)</option>
                  ${tutors.map(t=>`<option value="${t.username}" ${course&&course.author===t.username?'selected':''}>${t.name}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="form-group" style="margin-bottom:14px;"><label>Short Description *</label><input class="form-control" type="text" id="cf-sdesc" required placeholder="One-line course summary" value="${course?course.shortDescription:''}"></div>
            <div class="form-group" style="margin-bottom:14px;"><label>Full Description</label><textarea class="form-control" id="cf-desc" rows="4" placeholder="Detailed course description...">${course?course.description:''}</textarea></div>
            <div class="form-group" style="margin-bottom:14px;"><label>Thumbnail URL</label><input class="form-control" type="url" id="cf-image" placeholder="https://..." value="${course?course.image:''}"></div>
            <div class="form-group" style="margin-bottom:20px;"><label>Preview Video URL</label><input class="form-control" type="url" id="cf-preview" placeholder="https://youtube.com/embed/..." value="${course?course.previewVideo:''}"></div>
            <div style="display:flex; gap:10px; justify-content:flex-end; border-top: 1px solid var(--border-color); padding-top: 16px; margin-top: 16px;">
              <button type="button" class="btn btn-outline-white" onclick="document.getElementById('course-form-panel').style.display='none'">Cancel</button>
              <button type="submit" class="btn btn-primary"><i class="fa-solid fa-save"></i> ${isEdit?'Save Changes':'Create Course'}</button>
            </div>
          </form>
        </div>
      </div>`;
  },

  _renderModulesPanel: function(courseId) {
    const course = window.db.getCourseById(courseId);
    if (!course) return '<div style="padding:20px;">Course not found.</div>';
    return `
      <div class="adm-modal" style="max-width: 900px; width: 100%; padding: 0; overflow: hidden;">
        <div class="glass-panel-header" style="background: linear-gradient(135deg, #EFF2FE, #ffffff); border-bottom: 1px solid #E2E8F0; padding: 20px 24px; margin-bottom: 0;">
          <div class="glass-panel-title" style="font-size: 1.1rem; font-weight: 800; color: #1E293B;"><i class="fa-solid fa-list-check" style="color:#4F46E5; margin-right: 10px; font-size: 1.2rem;"></i>Manage Lessons — <span style="color:#64748B; font-weight: 600;">${course.title}</span></div>
          <button type="button" class="btn btn-outline-white btn-sm btn-icon" style="background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;" onclick="document.getElementById('modules-panel').style.display='none'"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div style="padding: 28px;">
          <!-- Add Module -->
          <div style="display:flex; gap:12px; margin-bottom:24px; align-items:center; background: #F8FAFC; padding: 12px; border-radius: 12px; border: 1px solid #F1F5F9;">
            <input id="new-mod-title" class="form-control" placeholder="New Module Title..." style="flex:1; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 14px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);">
            <button class="btn btn-primary btn-sm" style="padding: 10px 20px; font-weight: 600; border-radius: 8px;" onclick="AdminComponent._addModule('${courseId}')"><i class="fa-solid fa-plus"></i> Add Module</button>
          </div>
          ${(course.modules||[]).map((mod,modIdx) => `
            <div style="background: #FFFFFF; border-radius: 12px; margin-bottom: 24px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03);">
              <div style="display:flex; justify-content:space-between; align-items:center; padding: 16px 20px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0;">
                <div style="font-weight: 700; font-size: 0.95rem; color: #0F172A; display: flex; align-items: center; gap: 10px;"><i class="fa-solid fa-layer-group" style="color: #6366F1;"></i>${mod.title}</div>
                <div style="display:flex; gap:8px;">
                   <button class="btn btn-outline-white btn-sm" style="padding: 6px 12px; border-radius: 6px;" onclick="AdminComponent._editModule('${courseId}',${modIdx})" title="Edit Module Title"><i class="fa-solid fa-pen"></i></button>
                   <button class="btn btn-danger btn-sm" style="background: white; color: #EF4444; border: 1px solid #FCA5A5; padding: 6px 12px;" onclick="AdminComponent._deleteModule('${courseId}',${modIdx})" title="Delete Module"><i class="fa-solid fa-trash-can"></i></button>
                </div>
              </div>
              <div style="padding: 16px 20px;">
                ${(mod.lessons||[]).map((les,lesIdx) => `
                  <div style="display:flex; align-items:center; gap: 16px; padding: 12px 16px; border-radius: 8px; border: 1px solid transparent; margin-bottom: 8px; background: #FAFAF9; transition: all 0.2s;" onmouseover="this.style.background='#F1F5F9';this.style.borderColor='#E2E8F0'" onmouseout="this.style.background='#FAFAF9';this.style.borderColor='transparent'">
                    <div style="width: 32px; height: 32px; background: #EEF2FF; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 800; color: #4F46E5; flex-shrink: 0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">${lesIdx+1}</div>
                    <div style="flex:1;">
                      <div style="font-size: 0.9rem; font-weight: 700; color: #1E293B; margin-bottom: 4px;">${les.title}</div>
                      <div style="font-size: 0.75rem; color: #64748B; display: flex; gap: 16px; align-items: center;">
                        <span style="display:flex; align-items:center; gap:4px;"><i class="fa-regular fa-clock"></i>${les.duration||'—'}</span>
                        ${les.videoUrl?`<a href="${les.videoUrl}" target="_blank" style="color: #EF4444; text-decoration: none; display:flex; align-items:center; gap:4px; font-weight:600;"><i class="fa-brands fa-youtube"></i>Watch</a>`:''}
                      </div>
                    </div>
                    <div style="display:flex; gap: 8px; opacity: 0.9;">
                      <button class="btn btn-outline-white btn-sm" style="padding: 6px 10px; border-radius: 6px;" onclick="AdminComponent._editLesson('${courseId}',${modIdx},'${les.id}')" title="Edit Lesson"><i class="fa-solid fa-pen"></i></button>
                      <button class="btn btn-danger btn-sm" style="padding: 6px 10px; border-radius: 6px;" onclick="AdminComponent._deleteLesson('${courseId}','${les.id}')" title="Delete Lesson"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                  </div>`).join('')}
                
                <!-- Add Lesson Form -->
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed #E2E8F0;">
                  <form class="form-add-lesson" data-course-id="${courseId}" data-mod-idx="${modIdx}" style="display: grid; grid-template-columns: 2fr 1fr; gap: 10px;">
                    <input class="form-control l-title" type="text" required placeholder="Lesson Title..." style="grid-column: 1/-1; padding: 10px 14px; border-radius: 8px;">
                    <input class="form-control l-url" type="url" required placeholder="YouTube/Video URL..." style="padding: 10px 14px; border-radius: 8px;">
                    <input class="form-control l-duration" type="text" placeholder="Duration (e.g. 15:30)" style="padding: 10px 14px; border-radius: 8px;">
                    <button type="submit" class="btn btn-primary btn-sm" style="grid-column: 1/-1; width: fit-content; padding: 8px 16px; border-radius: 8px; font-weight: 600;"><i class="fa-solid fa-plus" style="margin-right: 6px;"></i>Add Lesson</button>
                  </form>
                </div>
              </div>
            </div>`).join('')}
          ${(course.modules||[]).length===0?`<div style="text-align:center; padding: 40px; color: #64748B; background: #F8FAFC; border-radius: 12px; border: 1px dashed #CBD5E1;">No modules yet. Create your first module above.</div>`:''}
        </div>
      </div>`;
  },

  /* ============================================================
     PAYMENTS
  ============================================================ */
  _renderPayments: function(search='',filter='',viewingId=null) {
    if (viewingId) return AdminComponent._renderPaymentDetail(viewingId);
    let txns = window.db.getTransactions();
    if (search) txns = txns.filter(t=>(t.username+t.courseTitle+t.id).toLowerCase().includes(search.toLowerCase()));
    if (filter==='APPROVED') txns=txns.filter(t=>(t.adminStatus||t.status)==='APPROVED'||t.status==='SUCCESS');
    else if (filter==='PENDING') txns=txns.filter(t=>(t.adminStatus||t.status)==='PENDING'||t.status==='PENDING');
    else if (filter==='DENIED') txns=txns.filter(t=>(t.adminStatus||t.status)==='DENIED'||t.status==='FAILED');

    return `
      <div class="dashboard-welcome">
        <h1>Payment Management <span style="font-size:1rem;font-weight:500;color:#64748B;">(${txns.length})</span></h1>
        <p>Manually review and approve/deny student payments. Approving automatically enrolls the student.</p>
      </div>
      <div class="dashboard-widgets" style="margin-bottom:20px; grid-template-columns: repeat(3, 1fr);">
        ${[['PENDING','gold','fa-hourglass-half','Pending'],['APPROVED','green','fa-circle-check','Approved'],['DENIED','red','fa-circle-xmark','Denied']].map(([st,c,ic,lbl])=>`
          <div class="widget-card" style="cursor:pointer; display:flex; gap:16px; align-items:center;" onclick="AdminComponent._filterPayments('${st}')">
            <div class="widget-icon ${c}" style="margin-bottom:0;"><i class="fa-solid ${ic}"></i></div>
            <div>
              <div class="widget-number">${window.db.getTransactions().filter(t=>{const s=t.adminStatus||t.status;return st==='APPROVED'?s==='APPROVED'||t.status==='SUCCESS':st==='PENDING'?s==='PENDING'||t.status==='PENDING':s==='DENIED'||t.status==='FAILED';}).length}</div>
              <div class="widget-label">${lbl}</div>
            </div>
          </div>`).join('')}
      </div>
      <div class="glass-panel">
        <div class="table-actions-bar">
          <div class="table-actions-left">
            <div class="search-input-wrapper" style="width: 240px;">
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
              <input id="pay-search" placeholder="Search payments..." value="${search}">
            </div>
            <select id="pay-filter" style="width: 160px; height: 46px;">
              <option value="">All Payments</option>
              <option value="PENDING" ${filter==='PENDING'?'selected':''}>Pending</option>
              <option value="APPROVED" ${filter==='APPROVED'?'selected':''}>Approved</option>
              <option value="DENIED" ${filter==='DENIED'?'selected':''}>Denied</option>
            </select>
          </div>
          <div class="table-actions-right">
            <button class="btn btn-outline-white btn-sm" onclick="AdminComponent._exportCSV('payments')" style="height: 46px; padding: 0 16px;"><i class="fa-solid fa-download"></i> Export CSV</button>
          </div>
        </div>
        <table class="data-table">
          <thead><tr><th>Invoice</th><th>Student</th><th>Course</th><th>Amount</th><th>Method</th><th>Txn ID</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${txns.map(t => {
              const adminSt = t.adminStatus || (t.status==='SUCCESS'?'APPROVED':'PENDING');
              return `
              <tr>
                <td style="font-family:monospace;font-size:0.72rem;color:#6366F1;font-weight:700;">${t.invoiceNumber||'—'}</td>
                <td style="font-weight:700;">${t.username}</td>
                <td style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${t.courseTitle}</td>
                <td style="font-weight:700;color:#059669;">₹${t.amount.toLocaleString('en-IN')}</td>
                <td style="font-size:0.78rem;">${t.paymentMethod||'—'}</td>
                <td style="font-family:monospace;font-size:0.68rem;color:#64748B;">${t.id.slice(0,14)}...</td>
                <td style="font-size:0.78rem;color:#94A3B8;">${new Date(t.timestamp).toLocaleDateString('en-IN')}</td>
                <td>
                  <select class="pay-status-select pss-${adminSt.toLowerCase()}" data-txn-id="${t.id}" onchange="AdminComponent._changePaymentStatus('${t.id}',this.value,this)">
                    <option value="PENDING" ${adminSt==='PENDING'?'selected':''}>🟡 Pending</option>
                    <option value="APPROVED" ${adminSt==='APPROVED'?'selected':''}>🟢 Approved</option>
                    <option value="DENIED" ${adminSt==='DENIED'?'selected':''}>🔴 Denied</option>
                  </select>
                </td>
                <td>
                  <div style="display:flex;gap:6px;">
                    <button class="btn btn-outline-white btn-sm" onclick="AdminComponent._viewPayment('${t.id}')"><i class="fa-solid fa-eye"></i> View</button>
                  </div>
                </td>
              </tr>`;}).join('')}
            ${txns.length===0?`<tr><td colspan="9" style="text-align:center;color:#94A3B8;padding:32px;">No transactions found.</td></tr>`:''}
          </tbody>
        </table>
      </div>`;
  },

  _renderPaymentDetail: function(txnId) {
    const t = window.db.getTransactions().find(x=>x.id===txnId);
    if (!t) return `<div style="padding:40px;text-align:center;color:#94A3B8;">Transaction not found. <button class="btn btn-outline-white btn-sm" onclick="AdminComponent._nav('payments')">Back</button></div>`;
    const adminSt = t.adminStatus || (t.status==='SUCCESS'?'APPROVED':'PENDING');
    const course = window.db.getCourseById(t.courseId);
    const student = window.db.getUsers().find(u=>u.username===t.username);
    const stColors = { APPROVED:['#059669','#ECFDF5'], PENDING:['#D97706','#FFFBEB'], DENIED:['#DC2626','#FEF2F2'] };
    const [stColor, stBg] = stColors[adminSt] || ['#64748B','#F1F5F9'];
    return `
      <div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
          <button class="btn btn-outline-white btn-sm" onclick="AdminComponent._nav('payments')"><i class="fa-solid fa-arrow-left"></i> Back</button>
          <h1 style="font-size:1.3rem;font-weight:800;color:#0F172A;">Payment Detail</h1>
        </div>
        <div style="display:grid;grid-template-columns:1fr 340px;gap:20px;align-items:start;">
          <!-- Detail card -->
          <div class="glass-panel">
            <div style="padding:28px;">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
                <div>
                  <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#94A3B8;margin-bottom:4px;">Invoice</div>
                  <div style="font-size:1.1rem;font-weight:800;color:#3D46D8;font-family:monospace;">${t.invoiceNumber||'Not generated'}</div>
                </div>
                <div style="background:${stBg};color:${stColor};padding:8px 18px;border-radius:20px;font-weight:700;font-size:0.88rem;">${adminSt}</div>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;">
                <div>
                  <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;color:#94A3B8;margin-bottom:4px;">Student</div>
                  <div style="font-weight:700;color:#0F172A;">${student?student.name:t.username}</div>
                  <div style="font-size:0.78rem;color:#64748B;">@${t.username}</div>
                </div>
                <div>
                  <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;color:#94A3B8;margin-bottom:4px;">Course</div>
                  <div style="font-weight:700;color:#0F172A;">${t.courseTitle}</div>
                </div>
                <div>
                  <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;color:#94A3B8;margin-bottom:4px;">Amount</div>
                  <div style="font-weight:800;color:#059669;font-size:1.2rem;">₹${t.amount.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;color:#94A3B8;margin-bottom:4px;">Payment Method</div>
                  <div style="font-weight:700;color:#0F172A;">${t.paymentMethod||'—'}</div>
                </div>
                <div>
                  <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;color:#94A3B8;margin-bottom:4px;">Transaction ID</div>
                  <div style="font-family:monospace;font-size:0.82rem;color:#374151;word-break:break-all;">${t.id}</div>
                </div>
                <div>
                  <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;color:#94A3B8;margin-bottom:4px;">Date & Time</div>
                  <div style="font-weight:600;color:#0F172A;">${new Date(t.timestamp).toLocaleString('en-IN')}</div>
                </div>
              </div>
              ${adminSt==='APPROVED' ? `<div style="background:#ECFDF5;border:1.5px solid #A7F3D0;border-radius:12px;padding:16px;font-size:0.83rem;color:#065F46;"><i class="fa-solid fa-circle-check" style="margin-right:6px;"></i><strong>Course Unlocked.</strong> ${t.username} is enrolled in ${t.courseTitle}. Invoice: ${t.invoiceNumber||'—'}.</div>` : ''}
              ${adminSt==='PENDING' ? `<div style="background:#FFFBEB;border:1.5px solid #FDE68A;border-radius:12px;padding:16px;font-size:0.83rem;color:#92400E;"><i class="fa-solid fa-hourglass-half" style="margin-right:6px;"></i><strong>Payment Verification Pending.</strong> Course is locked until approved.</div>` : ''}
              ${adminSt==='DENIED' ? `<div style="background:#FEF2F2;border:1.5px solid #FECACA;border-radius:12px;padding:16px;font-size:0.83rem;color:#991B1B;"><i class="fa-solid fa-circle-xmark" style="margin-right:6px;"></i><strong>Payment Rejected.</strong> Course remains locked. Student may re-upload proof.</div>` : ''}
            </div>
          </div>
          <!-- Actions card -->
          <div class="glass-panel">
            <div class="glass-panel-header"><div class="glass-panel-title">Actions</div></div>
            <div style="padding:20px;display:flex;flex-direction:column;gap:10px;">
              <button class="btn btn-success" style="justify-content:center;" onclick="AdminComponent._changePaymentStatus('${t.id}','APPROVED')"><i class="fa-solid fa-circle-check"></i> Approve Payment</button>
              <button class="btn" style="background:#FFFBEB;color:#D97706;border:1.5px solid #FDE68A;justify-content:center;" onclick="AdminComponent._changePaymentStatus('${t.id}','PENDING')"><i class="fa-solid fa-hourglass-half"></i> Mark as Pending</button>
              <button class="btn btn-danger" style="justify-content:center;" onclick="AdminComponent._changePaymentStatus('${t.id}','DENIED')"><i class="fa-solid fa-circle-xmark"></i> Deny Payment</button>
              <div style="height:1px;background:#F1F5F9;margin:4px 0;"></div>
              <button class="btn btn-outline-white" style="justify-content:center;" onclick="window.app.showToast('Invoice download available in full backend version.','info')"><i class="fa-solid fa-file-invoice"></i> Download Invoice</button>
            </div>
            ${course ? `
              <div class="glass-panel-header" style="border-top:1px solid #F1F5F9;"><div class="glass-panel-title" style="font-size:0.82rem;">Course Details</div></div>
              <div style="padding:16px 20px;display:flex;gap:12px;align-items:center;">
                <img src="${course.image}" style="width:60px;height:42px;object-fit:cover;border-radius:8px;">
                <div>
                  <div style="font-weight:700;font-size:0.83rem;color:#0F172A;">${course.title}</div>
                  <div style="font-size:0.72rem;color:#94A3B8;">₹${course.price.toLocaleString('en-IN')} · ${course.level||'—'}</div>
                </div>
              </div>` : ''}
          </div>
        </div>
      </div>`;
  },

  /* ============================================================
     REVIEWS
  ============================================================ */
  _renderReviews: function() {
    const courses = window.db.getCourses();
    const allReviews = courses.flatMap(c => (c.reviews||[]).map(r=>({...r,courseTitle:c.title,courseId:c.id})));
    return `
      <div class="dashboard-welcome"><h1>Reviews (${allReviews.length})</h1><p>All student reviews across all courses.</p></div>
      <div class="glass-panel">
        <table class="data-table">
          <thead><tr><th>Student</th><th>Course</th><th>Rating</th><th>Review</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            ${allReviews.map(r=>`
              <tr>
                <td style="font-weight:700;">${r.name||r.username}</td>
                <td style="font-size:0.8rem;color:#64748B;">${r.courseTitle}</td>
                <td style="color:#D97706;font-weight:700;">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</td>
                <td style="font-size:0.8rem;max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${r.comment}</td>
                <td style="color:#94A3B8;font-size:0.78rem;">${r.date||'—'}</td>
                <td><button class="btn btn-danger btn-sm" onclick="window.app.showToast('Review deleted (demo).','success')"><i class="fa-solid fa-trash-can"></i></button></td>
              </tr>`).join('')}
            ${allReviews.length===0?`<tr><td colspan="6" style="text-align:center;color:#94A3B8;padding:32px;">No reviews yet.</td></tr>`:''}
          </tbody>
        </table>
      </div>`;
  },

  /* ============================================================
     SUBMISSIONS
  ============================================================ */
  _renderSubmissions: function() {
    const subs = window.db.getSubmittedCourses();
    return `
      <div class="dashboard-welcome"><h1>Course Submissions (${subs.length})</h1><p>Review and approve/reject instructor-submitted courses.</p></div>
      ${subs.length===0?`<div class="glass-panel" style="padding:60px;text-align:center;"><div style="font-size:3rem;margin-bottom:12px;">📥</div><p style="color:#64748B;">No pending submissions.</p></div>`:''}
      ${subs.map(sub=>`
        <div class="glass-panel" style="margin-bottom:16px;">
          <div style="padding:20px 24px;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;">
              <div style="flex:1;">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                  <h3 style="font-size:0.95rem;font-weight:800;color:#0F172A;">${sub.title}</h3>
                  <span class="status-badge ${sub.status==='PENDING'?'badge-pending':sub.status==='APPROVED'?'badge-success':'danger'}">${sub.status}</span>
                </div>
                <p style="font-size:0.82rem;color:#64748B;margin-bottom:8px;">${(sub.shortDescription||sub.description||'').slice(0,120)}</p>
                <div style="font-size:0.78rem;color:#94A3B8;">By: <strong>${sub.author}</strong> · ₹${(sub.price||0).toLocaleString('en-IN')} · ${sub.submittedDate}</div>
              </div>
              ${sub.status==='PENDING'?`
                <div style="display:flex;gap:8px;flex-shrink:0;">
                  <button class="btn btn-success btn-sm" onclick="AdminComponent._approveSub('${sub.id}')"><i class="fa-solid fa-check"></i> Approve</button>
                  <button class="btn btn-danger btn-sm" onclick="AdminComponent._rejectSub('${sub.id}')"><i class="fa-solid fa-xmark"></i> Reject</button>
                </div>`:''}
            </div>
          </div>
        </div>`).join('')}`;
  },

  /* ============================================================
     COUPONS
  ============================================================ */
  _renderCoupons: function() {
    const coupons = window.db.getCoupons();
    return `
      <div class="dashboard-welcome"><h1>Coupons (${coupons.length})</h1></div>
      <div class="glass-panel" style="margin-bottom:20px;">
        <table class="data-table">
          <thead><tr><th>Code</th><th>Type</th><th>Discount</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${coupons.map(c=>`
              <tr>
                <td><code style="background:#F1F5F9;padding:3px 10px;border-radius:6px;font-weight:700;color:#3D46D8;">${c.code}</code></td>
                <td style="text-transform:capitalize;">${c.type}</td>
                <td style="font-weight:700;">${c.type==='percentage'?c.discount+'%':'₹'+c.discount}</td>
                <td><span class="status-badge ${c.active?'success':'danger'}">${c.active?'Active':'Inactive'}</span></td>
                <td><div style="display:flex;gap:6px;">
                  <button class="btn btn-outline-white btn-sm" onclick="AdminComponent._showEditCoupon('${c.code}')"><i class="fa-solid fa-pen-to-square"></i></button>
                  <button class="btn btn-danger btn-sm" onclick="AdminComponent._deleteCoupon('${c.code}')"><i class="fa-solid fa-trash-can"></i></button>
                </div></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div class="glass-panel" style="margin-top: 24px;">
        <div class="glass-panel-header">
          <div class="glass-panel-title"><i class="fa-solid fa-plus-circle" style="color:var(--brand-blue);margin-right:8px;"></i>Create New Coupon</div>
        </div>
        <div style="padding: 24px;">
          <form id="form-add-coupon" style="margin:0;">
            <div class="coupon-form-grid">
              <div class="form-group" style="margin: 0;">
                <label for="coupon-code" style="font-size:0.78rem;font-weight:700;color:var(--text-secondary);display:flex;align-items:center;gap:6px;"><i class="fa-solid fa-tag" style="color:var(--brand-blue);font-size:0.8rem;"></i> Coupon Code</label>
                <input id="coupon-code" required placeholder="e.g. SUMMER50">
              </div>
              <div class="form-group" style="margin: 0;">
                <label for="coupon-type" style="font-size:0.78rem;font-weight:700;color:var(--text-secondary);display:flex;align-items:center;gap:6px;"><i class="fa-solid fa-sliders" style="color:var(--brand-blue);font-size:0.8rem;"></i> Type</label>
                <select id="coupon-type" style="height: 48px;">
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Cash (₹)</option>
                </select>
              </div>
              <div class="form-group" style="margin: 0;">
                <label for="coupon-discount" style="font-size:0.78rem;font-weight:700;color:var(--text-secondary);display:flex;align-items:center;gap:6px;"><i class="fa-solid fa-calculator" style="color:var(--brand-blue);font-size:0.8rem;"></i> Discount Value</label>
                <input id="coupon-discount" type="number" required placeholder="e.g. 50">
              </div>
              <button type="submit" class="btn btn-primary" style="height: 48px; padding: 0 24px; font-weight: 700; display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-plus"></i> Add Coupon
              </button>
            </div>
          </form>
        </div>
      </div>`;
  },

  /* ============================================================
     BLOG
  ============================================================ */
  _renderBlog: function() {
    const posts = window.db.getBlogPosts();
    return `
      <div class="dashboard-welcome"><h1>Blog Posts (${posts.length})</h1></div>
      <div class="glass-panel">
        <div class="glass-panel-header">
          <div class="glass-panel-title">All Posts</div>
          <button class="btn btn-outline-white btn-sm" onclick="window.location.hash='/blog'"><i class="fa-solid fa-eye"></i> View Blog</button>
        </div>
        ${posts.map(p=>`
          <div style="display:flex;align-items:center;gap:16px;padding:14px 20px;border-bottom:1px solid #F8FAFC;">
            <img src="${p.image}" style="width:64px;height:44px;object-fit:cover;border-radius:8px;flex-shrink:0;">
            <div style="flex:1;">
              <div style="font-weight:700;font-size:0.88rem;color:#0F172A;">${p.title}</div>
              <div style="font-size:0.75rem;color:#94A3B8;margin-top:2px;">${p.category} · ${p.date} · ${p.readTime}</div>
            </div>
            <div style="display:flex;gap:6px;">
              <a href="#/blog/${p.id}" class="btn btn-outline-white btn-sm"><i class="fa-solid fa-eye"></i></a>
              <button class="btn btn-danger btn-sm" onclick="window.app.showToast('Post deleted (demo).','success')"><i class="fa-solid fa-trash-can"></i></button>
            </div>
          </div>`).join('')}
      </div>`;
  },

  /* ============================================================
     ACTIVITY LOG
  ============================================================ */
  _renderActivity: function() {
    const acts = window.db.getActivities();
    const icons = { APPROVED_PAYMENT:'fa-circle-check', DENIED_PAYMENT:'fa-circle-xmark', PENDING_PAYMENT:'fa-hourglass-half', CREATED_COURSE:'fa-book-open', UPDATED_COURSE:'fa-pen-to-square', PUBLISHED_COURSE:'fa-globe', ARCHIVED_COURSE:'fa-box-archive', DUPLICATED_COURSE:'fa-copy', SUSPENDED_USER:'fa-ban', ACTIVATED_USER:'fa-circle-check', DELETED_USER:'fa-trash-can', RESET_PASSWORD:'fa-key', CREATED_TUTOR:'fa-user-plus' };
    return `
      <div class="dashboard-welcome"><h1>Activity Log</h1><p>Full audit trail of all admin actions.</p></div>
      <div class="glass-panel">
        <table class="data-table">
          <thead><tr><th>Action</th><th>Resource</th><th>Details</th><th>Date & Time</th></tr></thead>
          <tbody>
            ${acts.map(act=>`
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <div style="width:28px;height:28px;background:#EFF2FE;color:#3D46D8;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:0.72rem;flex-shrink:0;"><i class="fa-solid ${icons[act.action]||'fa-bolt'}"></i></div>
                    <span style="font-size:0.82rem;font-weight:700;color:#0F172A;">${act.action.replace(/_/g,' ')}</span>
                  </div>
                </td>
                <td style="font-size:0.78rem;color:#6366F1;font-weight:600;">${act.resourceType} · <code style="font-size:0.7rem;">${act.resourceId}</code></td>
                <td style="font-size:0.8rem;color:#374151;">${act.details}</td>
                <td style="font-size:0.75rem;color:#94A3B8;white-space:nowrap;">${new Date(act.timestamp).toLocaleString('en-IN')}</td>
              </tr>`).join('')}
            ${acts.length===0?`<tr><td colspan="4" style="text-align:center;color:#94A3B8;padding:32px;">No activity recorded yet.</td></tr>`:''}
          </tbody>
        </table>
      </div>`;
  },

  /* ============================================================
     SETTINGS
  ============================================================ */
  _renderSettings: function() {
    return `
      <div class="dashboard-welcome"><h1>Settings</h1><p>System configuration and API settings.</p></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
        <div class="glass-panel">
          <div class="glass-panel-header"><div class="glass-panel-title"><i class="fa-solid fa-palette" style="color:#3D46D8;margin-right:7px;"></i>Academy Details</div></div>
          <div style="padding:24px;">
            <div class="form-group" style="margin-bottom:14px;"><label>Academy Name</label><input class="form-control" value="Cubaze Academy" style="width:100%;box-sizing:border-box;"></div>
            <div class="form-group" style="margin-bottom:14px;"><label>Support Email</label><input class="form-control" type="email" value="support@cubazeacademy.com" style="width:100%;box-sizing:border-box;"></div>
            <div class="form-group" style="margin-bottom:14px;"><label>WhatsApp</label><input class="form-control" value="+91 75103 37087" style="width:100%;box-sizing:border-box;"></div>
            <div class="form-group" style="margin-bottom:20px;"><label>Revenue Split (Tutor %)</label><input class="form-control" type="number" value="70" style="width:100%;box-sizing:border-box;"></div>
            <button class="btn btn-primary" onclick="window.app.showToast('Settings saved!','success')"><i class="fa-solid fa-save"></i> Save</button>
          </div>
        </div>
        <div class="glass-panel">
          <div class="glass-panel-header"><div class="glass-panel-title"><i class="fa-solid fa-credit-card" style="color:#3D46D8;margin-right:7px;"></i>Payment Management</div></div>
          <div style="padding:24px;">
            <div class="form-group" style="margin-bottom:14px;"><label>PhonePe Merchant ID</label><input class="form-control" value="M_CUBAZE_2026" style="width:100%;box-sizing:border-box;"></div>
            <div class="form-group" style="margin-bottom:14px;"><label>API Secret Key</label><input class="form-control" type="password" value="***********************" style="width:100%;box-sizing:border-box;"></div>
            <div class="form-group" style="margin-bottom:20px;"><label>Environment</label><select class="form-control" style="width:100%;"><option>Sandbox (Testing)</option><option>Production</option></select></div>
            <button class="btn btn-primary" onclick="window.app.showToast('API settings saved!','success')"><i class="fa-solid fa-save"></i> Save</button>
          </div>
        </div>
        <div class="glass-panel">
          <div class="glass-panel-header"><div class="glass-panel-title"><i class="fa-solid fa-key" style="color:#3D46D8;margin-right:7px;"></i>Change Password</div></div>
          <div style="padding:24px;">
            <div class="form-group" style="margin-bottom:14px;"><label>Current Password</label><input class="form-control" type="password" placeholder="••••••••" style="width:100%;box-sizing:border-box;"></div>
            <div class="form-group" style="margin-bottom:20px;"><label>New Password</label><input class="form-control" type="password" placeholder="••••••••" style="width:100%;box-sizing:border-box;"></div>
            <button class="btn btn-primary" onclick="window.app.showToast('Password updated!','success')"><i class="fa-solid fa-save"></i> Update Password</button>
          </div>
        </div>
        <div class="glass-panel">
          <div class="glass-panel-header"><div class="glass-panel-title"><i class="fa-solid fa-database" style="color:#3D46D8;margin-right:7px;"></i>Supabase Connection</div></div>
          <div style="padding:24px;">
            <div class="form-group" style="margin-bottom:14px;">
              <label>Supabase URL</label>
              <input class="form-control" id="sb-url" placeholder="https://your-project.supabase.co" value="${localStorage.getItem('cubaze_supabase_url') || 'https://ayxahneijhskjbadqxoc.supabase.co'}" style="width:100%;box-sizing:border-box;">
            </div>
            <div class="form-group" style="margin-bottom:14px;">
              <label>Supabase Anon Key</label>
              <input class="form-control" id="sb-key" type="password" placeholder="eyJhbGciOi..." value="${localStorage.getItem('cubaze_supabase_key') || 'sb_publishable_8qB2RP83kMetgafrGcizEQ_AZk1Mi7_'}" style="width:100%;box-sizing:border-box;">
            </div>
            <div style="display:flex;gap:10px;margin-bottom:12px;">
              <button class="btn btn-primary btn-sm" onclick="AdminComponent._saveSupabaseSettings()"><i class="fa-solid fa-save"></i> Save & Connect</button>
              <button class="btn btn-outline-white btn-sm" onclick="AdminComponent._testSupabaseConnection()"><i class="fa-solid fa-vial"></i> Test</button>
            </div>
            <div id="sb-status-msg" style="font-size:0.75rem;font-weight:600;color:${window.db.sb ? '#059669' : '#64748B'};">
              Status: ${window.db.sb ? '🟢 Connected' : '⚪ Not Connected'}
            </div>
          </div>
        </div>
        <div class="glass-panel">
          <div class="glass-panel-header"><div class="glass-panel-title"><i class="fa-solid fa-ellipsis" style="color:#3D46D8;margin-right:7px;"></i>More Options</div></div>
          <div style="padding:20px;display:flex;flex-direction:column;gap:10px;">
            <button class="btn btn-outline-white btn-sm" onclick="AdminComponent._exportCSV('all')"><i class="fa-solid fa-download"></i> Export All Data</button>
            <button class="btn btn-danger btn-sm" onclick="window.app.showToast('Clear cache functionality in full version.','info')"><i class="fa-solid fa-broom"></i> Clear Cache</button>
          </div>
        </div>
        <div class="glass-panel">
          <div class="glass-panel-header"><div class="glass-panel-title"><i class="fa-solid fa-lock" style="color:#3D46D8;margin-right:7px;"></i>Maintenance Mode</div></div>
          <div style="padding:20px;display:flex;align-items:center;justify-content:space-between;">
            <div><div style="font-weight:600;margin-bottom:3px;">Maintenance Mode</div><div style="font-size:0.78rem;color:#64748B;">Show maintenance page to visitors</div></div>
            <button class="btn btn-outline-white btn-sm" onclick="window.app.showToast('Maintenance mode toggled!','warning')">Toggle</button>
          </div>
        </div>
      </div>`;
  },

  /* ============================================================
     HELPERS — payment badge
  ============================================================ */
  _payBadge: function(status) {
    if (!status || status==='SUCCESS' || status==='APPROVED') return '<span class="status-badge badge-success">🟢 Approved</span>';
    if (status==='PENDING') return '<span class="status-badge badge-pending">🟡 Pending</span>';
    if (status==='DENIED' || status==='FAILED') return '<span class="status-badge danger">🔴 Denied</span>';
    return `<span class="status-badge status-badge">${status}</span>`;
  },

  /* ============================================================
     ACTION METHODS
  ============================================================ */
  _saveSupabaseSettings: function() {
    const url = document.getElementById('sb-url').value.trim();
    const key = document.getElementById('sb-key').value.trim();
    if (!url || !key) {
      window.app.showToast('Please fill in both URL and key.','danger');
      return;
    }
    localStorage.setItem('cubaze_supabase_url', url);
    localStorage.setItem('cubaze_supabase_key', key);
    
    // Initialize & Sync
    window.db.initSupabase();
    
    if (window.db.sb) {
      window.app.showToast('Supabase settings saved! Syncing data in background...','success');
      document.getElementById('sb-status-msg').innerHTML = '🟢 Connected & Syncing...';
      document.getElementById('sb-status-msg').style.color = '#059669';
    } else {
      window.app.showToast('Could not initialize Supabase. Check configuration.','danger');
      document.getElementById('sb-status-msg').innerHTML = '🔴 Initialisation Failed';
      document.getElementById('sb-status-msg').style.color = '#DC2626';
    }
  },

  _testSupabaseConnection: async function() {
    const url = document.getElementById('sb-url').value.trim();
    const key = document.getElementById('sb-key').value.trim();
    if (!url || !key) {
      window.app.showToast('Please enter URL and key to test connection.','warning');
      return;
    }
    if (!window.supabase) {
      window.app.showToast('Supabase SDK not loaded in browser.','danger');
      return;
    }
    const testMsg = document.getElementById('sb-status-msg');
    testMsg.innerHTML = '⚡ Testing connection...';
    testMsg.style.color = '#D97706';
    try {
      const client = window.supabase.createClient(url, key);
      const { data, error } = await client.from('cubaze_users').select('username').limit(1);
      if (error) {
        window.app.showToast('Connection failed: ' + error.message, 'danger');
        testMsg.innerHTML = '❌ Connection Failed (SQL / Schema Error)';
        testMsg.style.color = '#DC2626';
      } else {
        window.app.showToast('Success! Supabase connection established.', 'success');
        testMsg.innerHTML = '🟢 Connection Successful';
        testMsg.style.color = '#059669';
      }
    } catch (err) {
      window.app.showToast('Network error: ' + err.message, 'danger');
      testMsg.innerHTML = '❌ Network Error';
      testMsg.style.color = '#DC2626';
    }
  },

  _nav: function(tab) {
    AdminComponent._sec = tab;
    AdminComponent._courseView = null;
    AdminComponent._editingId = null;
    AdminComponent._paymentView = null;
    document.querySelectorAll('.sidebar-nav-item').forEach(i=>i.classList.remove('active'));
    document.querySelector(`[data-adm-tab="${tab}"]`)?.classList.add('active');
    
    if (tab === 'requests') {
      AdminComponent._loadAndRenderRequests();
    } else {
      AdminComponent._activeConvId = null;
      document.getElementById('adm-main').innerHTML = AdminComponent._renderSection(tab);
      AdminComponent._bindSection(tab);
      if (tab === 'dashboard') {
        const cu = window.db.getCurrentUser();
        setTimeout(() => {
          if (window.DashboardRightPanel) window.DashboardRightPanel.bindEvents(cu);
        }, 50);
      }
    }
  },

  _changePaymentStatus: function(txnId, newStatus, selectEl) {
    if (newStatus === 'APPROVED') {
      const txn = window.db.getTransactions().find(t => t.id === txnId);
      if (!txn) return;
      
      const batches = window.db.getBatches().filter(b => b.courseId === txn.courseId && b.status !== 'Archived');
      if (batches.length === 0) {
        window.app.showToast('No active batches found for this course. Please create a batch first.', 'danger');
        if (selectEl) selectEl.value = 'PENDING';
        return;
      }

      // Show batch selection modal
      const overlay = document.createElement('div');
      overlay.className = 'adm-modal-overlay';
      overlay.id = 'approve-payment-batch-modal';
      overlay.innerHTML = `
        <div class="adm-modal" style="max-width: 400px; width: 100%;">
          <h3>Select Batch for Enrollment</h3>
          <p style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:14px; text-align:left;">
            Choose which batch to enroll <strong>${txn.username}</strong> in for <strong>${txn.courseTitle}</strong>.
          </p>
          <div style="margin-bottom:20px;">
            <select id="ap-batch-id" class="form-control" style="width:100%;" required>
              ${batches.map(b => `<option value="${b.id}">${b.name} (${b.currentEnrollment}/${b.maxStudents} students)</option>`).join('')}
            </select>
          </div>
          <div style="display:flex; gap:10px; justify-content:flex-end;">
            <button type="button" class="btn btn-outline-white" onclick="document.getElementById('approve-payment-batch-modal').remove();">Cancel</button>
            <button type="button" class="btn btn-primary" id="btn-confirm-approve">Approve & Enroll</button>
          </div>
        </div>
      `;
      overlay.addEventListener('click', e => { if (e.target === overlay) { overlay.remove(); if (selectEl) selectEl.value = 'PENDING'; } });
      document.body.appendChild(overlay);
      
      overlay.querySelector('.btn-outline-white').addEventListener('click', () => {
        if (selectEl) selectEl.value = 'PENDING';
      });

      overlay.querySelector('#btn-confirm-approve').addEventListener('click', () => {
        const batchId = document.getElementById('ap-batch-id').value;
        overlay.remove();
        
        const res = window.db.updatePaymentAdminStatus(txnId, 'APPROVED');
        if (res.success) {
          // Enroll student in batch
          window.db.enrollUserInBatch(txn.username, txn.courseId, batchId);
          window.app.showToast('Payment approved and student enrolled in batch! 🎉', 'success');
          
          if (selectEl) {
            selectEl.className = `pay-status-select pss-approved`;
          } else {
            document.getElementById('adm-main').innerHTML = AdminComponent._renderPaymentDetail(txnId);
            AdminComponent._bindSection('payments');
          }
        } else {
          window.app.showToast(res.error || 'Failed to update payment status.', 'danger');
        }
      });
      return;
    }

    const res = window.db.updatePaymentAdminStatus(txnId, newStatus);
    if (res.success) {
      const msgs = { APPROVED:'✅ Payment approved! Student enrolled automatically.', PENDING:'⏳ Payment marked as pending.', DENIED:'❌ Payment denied. Enrollment removed.' };
      window.app.showToast(msgs[newStatus]||'Status updated.', newStatus==='APPROVED'?'success':newStatus==='DENIED'?'danger':'warning');
      // Update select color class
      if (selectEl) {
        selectEl.className = `pay-status-select pss-${newStatus.toLowerCase()}`;
      } else {
        // Re-render
        document.getElementById('adm-main').innerHTML = AdminComponent._renderPaymentDetail(txnId);
        AdminComponent._bindSection('payments');
      }
    } else {
      window.app.showToast(res.error||'Failed to update status.','danger');
    }
  },

  _viewPayment: function(txnId) {
    document.getElementById('adm-main').innerHTML = AdminComponent._renderPaymentDetail(txnId);
    AdminComponent._bindSection('payments');
  },

  _filterPayments: function(status) {
    document.getElementById('adm-main').innerHTML = AdminComponent._renderPayments('', status);
    AdminComponent._bindSection('payments');
  },

  _showCreateCourse: function() {
    const panel = document.getElementById('course-form-panel');
    panel.style.display = 'flex';
    panel.innerHTML = AdminComponent._renderCourseForm(null);
    panel.onclick = (e) => { if (e.target === panel) panel.style.display = 'none'; };
    AdminComponent._bindCourseForm();
  },

  _showEditCourse: function(courseId) {
    const course = window.db.getCourseById(courseId);
    const panel = document.getElementById('course-form-panel');
    panel.style.display = 'flex';
    panel.innerHTML = AdminComponent._renderCourseForm(course);
    panel.onclick = (e) => { if (e.target === panel) panel.style.display = 'none'; };
    AdminComponent._bindCourseForm();
  },

  _manageModules: function(courseId) {
    const panel = document.getElementById('modules-panel');
    panel.style.display = 'flex';
    panel.innerHTML = AdminComponent._renderModulesPanel(courseId);
    panel.onclick = (e) => { if (e.target === panel) panel.style.display = 'none'; };
    AdminComponent._bindModuleEvents(courseId);
  },

  _publishCourse: function(id) {
    const res = window.db.publishCourse(id);
    if (res.success) { window.app.showToast('Course published! 🌐','success'); AdminComponent._nav('courses'); }
  },
  _unpublishCourse: function(id) {
    const res = window.db.unpublishCourse(id);
    if (res.success) { window.app.showToast('Course unpublished.','warning'); AdminComponent._nav('courses'); }
  },
  _archiveCourse: function(id) {
    if (!confirm('Archive this course?')) return;
    const res = window.db.archiveCourse(id);
    if (res.success) { window.app.showToast('Course archived.','success'); AdminComponent._nav('courses'); }
  },
  _restoreCourse: function(id) {
    const res = window.db.restoreCourse(id);
    if (res.success) { window.app.showToast('Course restored.','success'); AdminComponent._nav('courses'); }
  },
  _duplicateCourse: function(id) {
    const res = window.db.duplicateCourse(id);
    if (res.success) { window.app.showToast('Course duplicated! ✅','success'); AdminComponent._nav('courses'); }
  },
  _deleteCourse: function(id) {
    if (!confirm('Delete this course permanently?')) return;
    window.db.deleteCourse(id);
    window.app.showToast('Course deleted.','success');
    AdminComponent._nav('courses');
  },

  _addModule: function(courseId) {
    const title = document.getElementById('new-mod-title').value.trim();
    if (!title) { window.app.showToast('Enter a module title.','danger'); return; }
    const res = window.db.addCourseModule(courseId, title);
    if (res.success) { window.app.showToast('Module added!','success'); AdminComponent._manageModules(courseId); }
  },
  _deleteModule: function(courseId, modIdx) {
    if (!confirm('Delete this module and all its lessons?')) return;
    const res = window.db.deleteCourseModule(courseId, modIdx);
    if (res.success) { window.app.showToast('Module deleted.','success'); AdminComponent._manageModules(courseId); }
  },
  _deleteLesson: function(courseId, lessonId) {
    if (!confirm('Delete this lesson?')) return;
    const res = window.db.deleteLessonFromCourseModule(courseId, lessonId);
    if (res.success) { window.app.showToast('Lesson deleted.','success'); AdminComponent._manageModules(courseId); }
  },

  _editLesson: function(courseId, modIdx, lessonId) {
    const course = window.db.getCourseById(courseId);
    if (!course || !course.modules || !course.modules[modIdx]) return;
    const lesson = course.modules[modIdx].lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    const overlay = document.createElement('div');
    overlay.className = 'adm-modal-overlay';
    overlay.id = 'edit-lesson-modal';
    overlay.innerHTML = `
      <div class="adm-modal">
        <h3><i class="fa-solid fa-pen-to-square" style="color:#3D46D8;margin-right:8px;"></i>Edit Lesson</h3>
        <form id="form-edit-lesson">
          <div style="margin-bottom:14px;">
            <label>Lesson Title *</label>
            <input type="text" id="edit-l-title" required value="${lesson.title}" style="width:100%; box-sizing:border-box;">
          </div>
          <div style="margin-bottom:14px;">
            <label>YouTube Video URL *</label>
            <input type="url" id="edit-l-url" required value="${lesson.videoUrl || ''}" style="width:100%; box-sizing:border-box;">
          </div>
          <div style="margin-bottom:20px;">
            <label>Duration (MM:SS)</label>
            <input type="text" id="edit-l-duration" placeholder="e.g. 12:45" value="${lesson.duration || ''}" style="width:100%; box-sizing:border-box;">
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

    overlay.querySelector('#form-edit-lesson').addEventListener('submit', e => {
      e.preventDefault();
      const newTitle = document.getElementById('edit-l-title').value.trim();
      const newUrl = document.getElementById('edit-l-url').value.trim();
      const newDuration = document.getElementById('edit-l-duration').value.trim();
      
      if (!newTitle) { window.app.showToast('Title is required','danger'); return; }
      
      const res = window.db.updateLessonInCourseModule(courseId, modIdx, lessonId, {
        title: newTitle,
        videoUrl: newUrl,
        duration: newDuration
      });
      if (res.success) {
        window.app.showToast('Lesson updated!','success');
        overlay.remove();
        AdminComponent._manageModules(courseId);
      } else {
        window.app.showToast(res.error || 'Failed to update lesson.','danger');
      }
    });

    document.body.appendChild(overlay);
  },

  _editModule: function(courseId, modIdx) {
    const course = window.db.getCourseById(courseId);
    if (!course || !course.modules || !course.modules[modIdx]) return;
    const mod = course.modules[modIdx];

    const overlay = document.createElement('div');
    overlay.className = 'adm-modal-overlay';
    overlay.id = 'edit-module-modal';
    overlay.innerHTML = `
      <div class="adm-modal">
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
      if (!newTitle) { window.app.showToast('Title is required','danger'); return; }
      
      const res = window.db.updateCourseModule(courseId, modIdx, newTitle);
      if (res.success) {
        window.app.showToast('Module updated!','success');
        overlay.remove();
        AdminComponent._manageModules(courseId);
      } else {
        window.app.showToast(res.error || 'Failed to update module.','danger');
      }
    });

    document.body.appendChild(overlay);
  },

  _suspendUser: function(username) {
    if (!confirm(`Suspend @${username}?`)) return;
    const res = window.db.suspendUser(username);
    if (res.success) { window.app.showToast(`@${username} suspended.`,'warning'); AdminComponent._nav(AdminComponent._sec); }
  },
  _activateUser: function(username) {
    const res = window.db.activateUser(username);
    if (res.success) { window.app.showToast(`@${username} activated! ✅`,'success'); AdminComponent._nav(AdminComponent._sec); }
  },
  _deleteUser: function(username, role) {
    if (!confirm(`Permanently delete @${username}? This cannot be undone.`)) return;
    const res = window.db.deleteUser(username);
    if (res.success) { window.app.showToast(`@${username} deleted.`,'success'); AdminComponent._nav(role==='tutor'?'tutors':'students'); }
  },

  _bulkDeleteUsers: function(type) {
    const selector = type === 'tutors' ? '.tut-check:checked' : '.stu-check:checked';
    const checked = [...document.querySelectorAll(selector)].map(cb => cb.getAttribute('data-username'));
    if (checked.length === 0) return;
    const typeLabel = type === 'tutors' ? 'tutors' : 'students';
    if (!confirm(`Are you sure you want to permanently delete the ${checked.length} selected ${typeLabel}? This cannot be undone.`)) return;
    
    let count = 0;
    for (const username of checked) {
      const res = window.db.deleteUser(username);
      if (res.success) count++;
    }
    
    window.app.showToast(`Successfully deleted ${count} ${typeLabel}.`, 'success');
    AdminComponent._nav(type);
  },

  _bulkSuspendUsers: function(type, suspend) {
    const selector = type === 'tutors' ? '.tut-check:checked' : '.stu-check:checked';
    const checked = [...document.querySelectorAll(selector)].map(cb => cb.getAttribute('data-username'));
    if (checked.length === 0) return;
    const actionText = suspend ? 'suspend' : 'activate';
    const typeLabel = type === 'tutors' ? 'tutors' : 'students';
    if (!confirm(`Are you sure you want to ${actionText} the ${checked.length} selected ${typeLabel}?`)) return;
    
    let count = 0;
    for (const username of checked) {
      const res = suspend ? window.db.suspendUser(username) : window.db.activateUser(username);
      if (res.success) count++;
    }
    
    window.app.showToast(`Successfully ${actionText}ed ${count} ${typeLabel}.`, 'success');
    AdminComponent._nav(type);
  },
  _showProfileModal: function(user, roleLabel) {
    document.getElementById('adm-profile-modal')?.remove();

    const isStudent = user.role === 'student';
    let detailLines = '';

    if (isStudent) {
      const enrolled = (user.enrolledCourses || []).map(id => {
        const c = window.db.getCourseById(id);
        return c ? c.title : id;
      });
      detailLines = `
        <div style="margin-top:20px;">
          <div style="font-weight:700; font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; margin-bottom:8px; letter-spacing:0.05em;">Enrolled Courses (${enrolled.length})</div>
          ${enrolled.length === 0 
            ? `<div style="font-size:0.85rem; color:var(--text-muted); font-style:italic;">No enrolled courses</div>` 
            : `<div style="display:flex; flex-wrap:wrap; gap:6px;">
                 ${enrolled.map(c => `<span style="background:var(--bg-primary); border:1.5px solid var(--border-color); color:var(--text-primary); padding:6px 12px; border-radius:20px; font-size:0.75rem; font-weight:600;">${c}</span>`).join('')}
               </div>`
          }
        </div>
      `;
    } else {
      const assigned = (user.assignedCourses || []).map(id => {
        const c = window.db.getCourseById(id);
        return c ? c.title : id;
      });
      detailLines = `
        <div style="margin-top:20px;">
          <div style="font-weight:700; font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; margin-bottom:8px; letter-spacing:0.05em;">Bio / Expertise</div>
          <p style="font-size:0.85rem; color:var(--text-primary); line-height:1.5; background:var(--bg-primary); padding:12px 16px; border-radius:12px; border:1.5px solid var(--border-color); margin:0;">${user.authorBio || 'No biography details provided.'}</p>
        </div>
        <div style="margin-top:20px;">
          <div style="font-weight:700; font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; margin-bottom:8px; letter-spacing:0.05em;">Assigned Courses (${assigned.length})</div>
          ${assigned.length === 0 
            ? `<div style="font-size:0.85rem; color:var(--text-muted); font-style:italic;">No assigned courses</div>` 
            : `<div style="display:flex; flex-wrap:wrap; gap:6px;">
                 ${assigned.map(c => `<span style="background:var(--bg-primary); border:1.5px solid var(--border-color); color:var(--text-primary); padding:6px 12px; border-radius:20px; font-size:0.75rem; font-weight:600;">${c}</span>`).join('')}
               </div>`
          }
        </div>
      `;
    }

    const modal = document.createElement('div');
    modal.className = 'adm-modal-overlay';
    modal.id = 'adm-profile-modal';

    // Format DOB nicely
    let formattedDob = '—';
    if (user.dob) {
      try {
        const dobDate = new Date(user.dob);
        if (!isNaN(dobDate.getTime())) {
          formattedDob = dobDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        }
      } catch (e) {
        formattedDob = user.dob;
      }
    }

    // Format Qualification
    let formattedQualification = '—';
    if (user.qualification) {
      if (user.qualification === 'other') {
        formattedQualification = user.qualificationOther || 'Other';
      } else {
        if (['sslc', 'pg'].includes(user.qualification.toLowerCase())) {
          formattedQualification = user.qualification.toUpperCase();
        } else {
          formattedQualification = user.qualification.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
      }
    }

    modal.innerHTML = `
      <div class="glass-panel adm-modal" style="max-width: 520px; width: 90%; padding: 28px; position: relative; border: 1px solid var(--border-color); border-radius: 24px; box-shadow: var(--shadow-2xl); text-align: left; background: var(--bg-card); color: var(--text-primary);">
        <button onclick="document.getElementById('adm-profile-modal').remove()" style="position: absolute; right: 20px; top: 20px; background: none; border: none; font-size: 1.25rem; color: var(--text-secondary); cursor: pointer; transition: color 0.2s;"><i class="fa-solid fa-xmark"></i></button>
        
        <div style="display:flex; gap:20px; margin-bottom:20px; padding-bottom:20px; border-bottom:1px solid var(--border-color); align-items:flex-start;">
          ${user.profilePhoto 
            ? `<div style="width:105px; height:140px; border-radius:12px; border:1.5px solid var(--border-color); background-image:url(${user.profilePhoto}); background-size:cover; background-position:center; background-repeat:no-repeat; box-shadow:var(--shadow-sm); flex-shrink:0;"></div>`
            : `<div style="width:105px; height:140px; border-radius:12px; border:1.5px solid var(--border-color); background:linear-gradient(135deg, var(--brand-blue), #6366F1); display:flex; align-items:center; justify-content:center; font-size:3rem; font-weight:800; color:#fff; flex-shrink:0; box-shadow:var(--shadow-sm);">${user.name.charAt(0).toUpperCase()}</div>`
          }
          <div style="flex:1; padding-top:4px;">
            <span style="display:inline-block; font-size:0.68rem; font-weight:800; padding:3px 10px; border-radius:20px; text-transform:uppercase; background:rgba(61, 70, 216, 0.1); color:var(--brand-blue); border:1px solid rgba(61, 70, 216, 0.2); margin-bottom:8px;">${roleLabel}</span>
            <h3 style="margin:0 0 6px 0; font-size:1.35rem; font-weight:800; color:var(--text-primary); line-height:1.2; display:block;">${user.name}</h3>
            <div style="font-size:0.85rem; color:var(--text-secondary); font-weight:600; margin-bottom:12px;">@${user.username}</div>
            <div style="display:flex; gap:8px; align-items:center;">
              ${user.suspended 
                ? '<span class="status-badge danger" style="padding:4px 10px; font-size:0.72rem; font-weight:700; margin:0;">⚫ Suspended</span>' 
                : '<span class="status-badge success" style="padding:4px 10px; font-size:0.72rem; font-weight:700; margin:0;">🟢 Active</span>'
              }
            </div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px 20px; margin-bottom:20px; background:var(--bg-primary); padding:16px; border-radius:14px; border:1.5px solid var(--border-color);">
          <div>
            <div style="font-weight:700; font-size:0.72rem; color:var(--text-secondary); text-transform:uppercase; margin-bottom:4px; letter-spacing: 0.05em;">Phone Number</div>
            <div style="font-size:0.85rem; font-weight:600; color:var(--text-primary);">${user.phone || '—'}</div>
          </div>
          <div>
            <div style="font-weight:700; font-size:0.72rem; color:var(--text-secondary); text-transform:uppercase; margin-bottom:4px; letter-spacing: 0.05em;">WhatsApp Number</div>
            <div style="font-size:0.85rem; font-weight:600; color:var(--text-primary);">
              ${user.whatsapp 
                ? `<a href="https://wa.me/${user.whatsapp.replace(/\D/g,'')}" target="_blank" style="color:var(--brand-blue); text-decoration:none; display:inline-flex; align-items:center; gap:4px; font-weight:700;"><i class="fa-brands fa-whatsapp" style="color:#25D366; font-size:1rem;"></i> ${user.whatsapp}</a>` 
                : '—'
              }
            </div>
          </div>
          <div>
            <div style="font-weight:700; font-size:0.72rem; color:var(--text-secondary); text-transform:uppercase; margin-bottom:4px; letter-spacing: 0.05em;">Date of Birth</div>
            <div style="font-size:0.85rem; font-weight:600; color:var(--text-primary);">${formattedDob}</div>
          </div>
          <div>
            <div style="font-weight:700; font-size:0.72rem; color:var(--text-secondary); text-transform:uppercase; margin-bottom:4px; letter-spacing: 0.05em;">Qualification</div>
            <div style="font-size:0.85rem; font-weight:600; color:var(--text-primary);">${formattedQualification}</div>
          </div>
          <div style="grid-column: span 2;">
            <div style="font-weight:700; font-size:0.72rem; color:var(--text-secondary); text-transform:uppercase; margin-bottom:4px; letter-spacing: 0.05em;">Member Since</div>
            <div style="font-size:0.85rem; font-weight:600; color:var(--text-primary);">${user.registeredDate || '—'}</div>
          </div>
        </div>

        ${detailLines}

        <div style="margin-top:28px; display:flex; justify-content:flex-end;">
          <button onclick="document.getElementById('adm-profile-modal').remove()" class="btn btn-outline-white" style="border-radius:10px; padding:10px 24px; border:1.5px solid var(--border-color); color:var(--text-secondary); background:var(--bg-card); font-weight:700; cursor:pointer; transition:var(--transition);">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  },

  _viewStudent: function(username) {
    const u = window.db.getUsers().find(x=>x.username===username);
    if (!u) return;
    AdminComponent._showProfileModal(u, 'Student');
  },

  _viewTutor: function(username) {
    const u = window.db.getUsers().find(x=>x.username===username);
    if (!u) return;
    AdminComponent._showProfileModal(u, 'Tutor / Mentor');
  },

  _showResetModal: function(username, name) {
    const newPass = prompt(`Reset password for ${name} (@${username}).\nEnter new password (min 6 chars):`);
    if (!newPass) return;
    if (newPass.length < 6) { window.app.showToast('Password must be at least 6 characters.','danger'); return; }
    const res = window.db.resetUserPassword(username, newPass);
    if (res.success) window.app.showToast(`Password reset for @${username}.`,'success');
  },

  _showAddTutorForm: function() {
    document.getElementById('add-tutor-modal')?.remove();
    
    const courses = window.db.getCourses();
    const overlay = document.createElement('div');
    overlay.className = 'adm-modal-overlay';
    overlay.id = 'add-tutor-modal';
    overlay.innerHTML = `
      <div class="adm-modal" style="max-width: 580px; width: 100%; border-radius: 24px; border: 1px solid var(--border-color); background: var(--bg-card); padding: 28px;">
        <h3 style="margin-top:0; margin-bottom:8px;"><i class="fa-solid fa-user-plus" style="color:var(--brand-blue); margin-right:8px;"></i>Register New Tutor</h3>
        <p style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:20px; line-height:1.4;">Tutors are content contributors. Assign courses below to grant them lesson management access.</p>
        <form id="form-create-tutor" style="text-align:left; margin:0;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div class="form-group" style="margin:0;">
              <label style="margin-bottom:6px;">Full Name *</label>
              <input class="form-control" type="text" id="t-name" required placeholder="e.g. John Smith" style="margin-bottom:0; width:100%; box-sizing:border-box;">
            </div>
            <div class="form-group" style="margin:0;">
              <label style="margin-bottom:6px;">Username *</label>
              <input class="form-control" type="text" id="t-username" required placeholder="e.g. johnsmith" style="margin-bottom:0; width:100%; box-sizing:border-box;">
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div class="form-group" style="margin:0;">
              <label style="margin-bottom:6px;">Password *</label>
              <input class="form-control" type="password" id="t-password" required placeholder="Min 6 characters" style="margin-bottom:0; width:100%; box-sizing:border-box;">
            </div>
            <div class="form-group" style="margin:0;">
              <label style="margin-bottom:6px;">Expertise / Bio</label>
              <input class="form-control" type="text" id="t-bio" placeholder="e.g. 3D Artist with 5+ years..." style="margin-bottom:0; width:100%; box-sizing:border-box;">
            </div>
          </div>
          <div style="margin-bottom:24px;">
            <label style="font-size:0.73rem; font-weight:700; color:var(--text-secondary); display:block; margin-bottom:10px; text-transform:uppercase;"><i class="fa-solid fa-graduation-cap" style="color:var(--brand-blue); margin-right:5px;"></i>Assign Courses</label>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:8px; max-height: 180px; overflow-y: auto; padding: 10px; border: 1.5px solid var(--border-color); border-radius: 12px; background: var(--bg-primary);" id="new-tutor-courses">
              ${courses.map(c => `
                <label style="display:flex; align-items:center; gap:10px; padding:8px 12px; border:1px solid var(--border-color); border-radius:10px; cursor:pointer; background:var(--bg-card); margin:0;">
                  <input type="checkbox" class="new-tutor-cb" data-course-id="${c.id}" style="accent-color:var(--brand-blue); width:16px; height:16px; margin:0; flex-shrink:0;">
                  <img src="${c.image}" style="width:36px; height:24px; object-fit:cover; border-radius:4px; flex-shrink:0;">
                  <span style="font-size:0.8rem; font-weight:600; color:var(--text-primary); text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${c.title}</span>
                </label>`).join('')}
              ${courses.length === 0 ? '<div style="color:var(--text-muted); font-size:0.85rem; padding:10px;">No courses available.</div>' : ''}
            </div>
          </div>
          <div style="display:flex; gap:10px; justify-content:flex-end;">
            <button type="button" class="btn btn-outline-white" onclick="document.getElementById('add-tutor-modal').remove()">Cancel</button>
            <button type="submit" class="btn btn-primary"><i class="fa-solid fa-plus"></i> Register Tutor</button>
          </div>
        </form>
      </div>
    `;

    overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
    document.body.appendChild(overlay);
    AdminComponent._bindTutorForm();
  },

  _showAddStudentModal: function() {
    document.getElementById('add-student-modal')?.remove();
    
    const overlay = document.createElement('div');
    overlay.className = 'adm-modal-overlay';
    overlay.id = 'add-student-modal';
    overlay.innerHTML = `
      <div class="adm-modal" style="max-width: 540px; width: 100%; border-radius: 24px; border: 1px solid var(--border-color); background: var(--bg-card); padding: 28px;">
        <h3 style="margin-top:0; margin-bottom:8px;"><i class="fa-solid fa-user-plus" style="color:var(--brand-blue); margin-right:8px;"></i>Add New Student</h3>
        <p style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:20px; line-height:1.4;">Fill in the profile details below to manually register a student in the academy database.</p>
        <form id="form-create-student" style="margin-top: 15px; text-align:left; margin:0;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div class="form-group" style="margin:0;">
              <label style="margin-bottom:6px;">Full Name *</label>
              <input class="form-control" type="text" id="s-name" required placeholder="e.g. John Doe" style="margin-bottom:0; width:100%; box-sizing:border-box;">
            </div>
            <div class="form-group" style="margin:0;">
              <label style="margin-bottom:6px;">Username *</label>
              <input class="form-control" type="text" id="s-username" required placeholder="e.g. johndoe" style="margin-bottom:0; width:100%; box-sizing:border-box;">
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div class="form-group" style="margin:0;">
              <label style="margin-bottom:6px;">Password *</label>
              <input class="form-control" type="password" id="s-password" required placeholder="Min 6 characters" style="margin-bottom:0; width:100%; box-sizing:border-box;">
            </div>
            <div class="form-group" style="margin:0;">
              <label style="margin-bottom:6px;">Phone Number *</label>
              <input class="form-control" type="text" id="s-phone" required placeholder="e.g. +91 98765 43210" style="margin-bottom:0; width:100%; box-sizing:border-box;">
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div class="form-group" style="margin:0;">
              <label style="margin-bottom:6px;">WhatsApp Number (Optional)</label>
              <input class="form-control" type="text" id="s-whatsapp" placeholder="e.g. +91 98765 43210" style="margin-bottom:0; width:100%; box-sizing:border-box;">
            </div>
            <div class="form-group" style="margin:0;">
              <label style="margin-bottom:6px;">Date of Birth (Optional)</label>
              <input class="form-control" type="date" id="s-dob" style="margin-bottom:0; width:100%; box-sizing:border-box; color:var(--text-primary);">
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:24px;">
            <div class="form-group" style="margin:0;">
              <label style="margin-bottom:6px;">Qualification (Optional)</label>
              <select id="s-qualification" onchange="document.getElementById('s-qualification-other-wrap').style.display = this.value === 'other' ? 'block' : 'none';" style="width:100%; padding:11px 16px; border:1.5px solid var(--border-color); border-radius:var(--radius-lg); font-size:0.88rem; font-family:inherit; outline:none; box-sizing:border-box; background:var(--bg-primary); color:var(--text-primary);">
                <option value="">Select Qualification</option>
                <option value="sslc">SSLC</option>
                <option value="plus two">Plus Two</option>
                <option value="degree">Degree</option>
                <option value="pg">PG</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="form-group" id="s-qualification-other-wrap" style="display:none; margin:0;">
              <label style="margin-bottom:6px;">Specify Qualification</label>
              <input class="form-control" type="text" id="s-qualification-other" placeholder="Specify..." style="margin-bottom:0; width:100%; box-sizing:border-box;">
            </div>
          </div>
          <div style="display:flex; gap:10px; justify-content:flex-end;">
            <button type="button" class="btn btn-outline-white" onclick="document.getElementById('add-student-modal').remove()">Cancel</button>
            <button type="submit" class="btn btn-primary"><i class="fa-solid fa-user-plus"></i> Add Student</button>
          </div>
        </form>
      </div>
    `;

    overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
    document.body.appendChild(overlay);

    overlay.querySelector('#form-create-student').addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('s-name').value.trim();
      const username = document.getElementById('s-username').value.trim().toLowerCase();
      const password = document.getElementById('s-password').value;
      const phone = document.getElementById('s-phone').value.trim();
      const whatsapp = document.getElementById('s-whatsapp').value.trim();
      const dob = document.getElementById('s-dob').value;
      const qualification = document.getElementById('s-qualification').value;
      const qualificationOther = document.getElementById('s-qualification-other').value.trim();

      if (password.length < 6) {
        window.app.showToast('Password must be at least 6 characters.', 'danger');
        return;
      }

      // Check if user already exists
      const exists = window.db.getUsers().some(u => u.username === username);
      if (exists) {
        window.app.showToast('Username already exists.', 'danger');
        return;
      }

      // Add student to DB
      const res = window.db.registerUser(username, password, name, 'student', phone);
      if (res.success) {
        // Update additional fields
        const users = window.db.getUsers();
        const user = users.find(u => u.username === username);
        if (user) {
          user.whatsapp = whatsapp;
          user.dob = dob;
          user.qualification = qualification;
          if (qualification === 'other') user.qualificationOther = qualificationOther;
          localStorage.setItem('cubaze_users', JSON.stringify(users));
        }

        window.app.showToast(`Student "${name}" registered successfully! 🎓`, 'success');
        overlay.remove();
        AdminComponent._nav('students');
      } else {
        window.app.showToast(res.error || 'Failed to register student.', 'danger');
      }
    });
  },

  _showEnrollStudentModal: function() {
    const students = window.db.getUsers().filter(u => u.role === 'student');
    const courses = window.db.getCourses();
    
    const overlay = document.createElement('div');
    overlay.className = 'adm-modal-overlay';
    overlay.id = 'enroll-student-modal';
    overlay.innerHTML = `
      <div class="adm-modal" style="max-width: 500px; width: 100%; border-radius: 24px; border: 1px solid var(--border-color); background: var(--bg-card); padding: 28px;">
        <h3 style="margin-top:0; margin-bottom:8px;"><i class="fa-solid fa-graduation-cap" style="color:var(--brand-blue); margin-right:8px;"></i>Manual Student Enrollment</h3>
        <p style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:20px; line-height:1.4;">Select a registered student, select a course, and choose the active batch to enroll them manually.</p>
        <form id="form-enroll-student" style="margin-top: 15px; text-align:left; margin:0;">
          <div style="margin-bottom:14px;">
            <label style="font-weight:700; font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; margin-bottom:6px; letter-spacing:0.05em;">Step 1: Choose Student *</label>
            <select id="enroll-student-username" class="form-control" required style="width:100%; padding:11px 16px; border:1.5px solid var(--border-color); border-radius:var(--radius-lg); font-size:0.88rem; color:var(--text-primary); background:var(--bg-primary); font-family:inherit; outline:none; box-sizing:border-box; margin-bottom:6px;">
              <option value="">-- Select Student --</option>
              ${students.map(s => `<option value="${s.username}">${s.name} (@${s.username})</option>`).join('')}
            </select>
          </div>
          <div style="margin-bottom:14px;">
            <label style="font-weight:700; font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; margin-bottom:6px; letter-spacing:0.05em;">Step 2: Choose Course *</label>
            <select id="enroll-student-course" class="form-control" required style="width:100%; padding:11px 16px; border:1.5px solid var(--border-color); border-radius:var(--radius-lg); font-size:0.88rem; color:var(--text-primary); background:var(--bg-primary); font-family:inherit; outline:none; box-sizing:border-box; margin-bottom:6px;">
              <option value="">-- Select Course --</option>
              ${courses.map(c => `<option value="${c.id}">${c.title}</option>`).join('')}
            </select>
          </div>
          <div style="margin-bottom:24px;">
            <label style="font-weight:700; font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; margin-bottom:6px; letter-spacing:0.05em;">Step 3: Select Batch *</label>
            <select id="enroll-student-batch" class="form-control" required style="width:100%; padding:11px 16px; border:1.5px solid var(--border-color); border-radius:var(--radius-lg); font-size:0.88rem; color:var(--text-primary); background:var(--bg-primary); font-family:inherit; outline:none; box-sizing:border-box; margin-bottom:6px;" disabled>
              <option value="">-- Select Batch (Choose course first) --</option>
            </select>
          </div>
          <div style="display:flex; gap:10px; justify-content:flex-end;">
            <button type="button" class="btn btn-outline-white" onclick="document.getElementById('enroll-student-modal').remove()">Cancel</button>
            <button type="submit" class="btn btn-primary"><i class="fa-solid fa-save"></i> Enroll Student</button>
          </div>
        </form>
      </div>
    `;

    overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
    document.body.appendChild(overlay);

    // Dynamically show batches when course changes
    const courseSelect = overlay.querySelector('#enroll-student-course');
    const batchSelect = overlay.querySelector('#enroll-student-batch');
    
    courseSelect.addEventListener('change', () => {
      const cid = courseSelect.value;
      if (!cid) {
        batchSelect.disabled = true;
        batchSelect.innerHTML = `<option value="">-- Select Batch (Choose course first) --</option>`;
        return;
      }
      
      const batches = window.db.getBatches().filter(b => b.courseId === cid && b.status !== 'Archived');
      batchSelect.disabled = false;
      if (batches.length === 0) {
        batchSelect.innerHTML = `<option value="">No active batches for this course</option>`;
      } else {
        batchSelect.innerHTML = `
          <option value="">-- Select Batch --</option>
          ${batches.map(b => `<option value="${b.id}">${b.name} (${b.currentEnrollment}/${b.maxStudents} students)</option>`).join('')}
        `;
      }
    });

    overlay.querySelector('#form-enroll-student').addEventListener('submit', e => {
      e.preventDefault();
      const username = document.getElementById('enroll-student-username').value;
      const courseId = document.getElementById('enroll-student-course').value;
      const batchId = document.getElementById('enroll-student-batch').value;
      
      if (!username || !courseId || !batchId) {
        window.app.showToast('Please fill out all fields.', 'danger');
        return;
      }
      
      const res = window.db.enrollUserInBatch(username, courseId, batchId);
      if (res.success) {
        window.app.showToast('Student enrolled successfully! 🎉', 'success');
        overlay.remove();
        AdminComponent._nav('students');
      } else {
        window.app.showToast(res.error || 'Failed to enroll student.', 'danger');
      }
    });
  },

  _showAssignCoursesModal: function(username, name) {
    const courses = window.db.getCourses();
    const users = window.db.getUsers();
    const tutor = users.find(u=>u.username===username);
    const assigned = tutor?.assignedCourses||[];
    const overlay = document.createElement('div');
    overlay.className = 'adm-modal-overlay';
    overlay.id = 'assign-modal';
    overlay.innerHTML = `
      <div class="adm-modal">
        <h3><i class="fa-solid fa-graduation-cap" style="color:#3D46D8;margin-right:8px;"></i>Assign Courses — ${name}</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px;">
          ${courses.map(c=>`
            <label style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1.5px solid ${assigned.includes(c.id)?'#6366F1':'#E2E8F0'};border-radius:10px;cursor:pointer;background:${assigned.includes(c.id)?'#EFF2FE':'#F8FAFC'};">
              <input type="checkbox" class="assign-modal-cb" data-course-id="${c.id}" ${assigned.includes(c.id)?'checked':''} style="accent-color:#3D46D8;width:15px;height:15px;">
              <img src="${c.image}" style="width:38px;height:26px;object-fit:cover;border-radius:5px;flex-shrink:0;">
              <span style="font-size:0.78rem;font-weight:600;color:#0F172A;">${c.title.slice(0,24)}${c.title.length>24?'...':''}</span>
            </label>`).join('')}
        </div>
        <div style="display:flex;gap:10px;">
          <button class="btn btn-primary" onclick="AdminComponent._saveAssignments('${username}')"><i class="fa-solid fa-save"></i> Save</button>
          <button class="btn btn-outline-white" onclick="document.getElementById('assign-modal').remove()">Cancel</button>
        </div>
      </div>`;
    overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
    document.body.appendChild(overlay);
  },

  _saveAssignments: function(username) {
    const ids = [...document.querySelectorAll('.assign-modal-cb:checked')].map(cb=>cb.getAttribute('data-course-id'));
    const res = window.db.updateTutorCourseAssignments(username, ids);
    if (res.success) {
      window.app.showToast(`Updated: ${ids.length} course(s) assigned to @${username}.`,'success');
      document.getElementById('assign-modal')?.remove();
      AdminComponent._nav('tutors');
    }
  },

  _showAssignStudentCoursesModal: function(username, name) {
    const courses = window.db.getCourses();
    const users = window.db.getUsers();
    const student = users.find(u=>u.username===username);
    const enrolled = student?.enrolledCourses||[];
    const overlay = document.createElement('div');
    overlay.className = 'adm-modal-overlay';
    overlay.id = 'assign-student-modal';
    overlay.innerHTML = `
      <div class="adm-modal">
        <h3><i class="fa-solid fa-graduation-cap" style="color:#3D46D8;margin-right:8px;"></i>Assign Courses — ${name}</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px;">
          ${courses.map(c=>`
            <label style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1.5px solid ${enrolled.includes(c.id)?'#6366F1':'#E2E8F0'};border-radius:10px;cursor:pointer;background:${enrolled.includes(c.id)?'#EFF2FE':'#F8FAFC'};">
              <input type="checkbox" class="assign-student-modal-cb" data-course-id="${c.id}" ${enrolled.includes(c.id)?'checked':''} style="accent-color:#3D46D8;width:15px;height:15px;">
              <img src="${c.image}" style="width:38px;height:26px;object-fit:cover;border-radius:5px;flex-shrink:0;">
              <span style="font-size:0.78rem;font-weight:600;color:#0F172A;">${c.title.slice(0,24)}${c.title.length>24?'...':''}</span>
            </label>`).join('')}
        </div>
        <div style="display:flex;gap:10px;">
          <button class="btn btn-primary" onclick="AdminComponent._saveStudentAssignments('${username}')"><i class="fa-solid fa-save"></i> Save</button>
          <button class="btn btn-outline-white" onclick="document.getElementById('assign-student-modal').remove()">Cancel</button>
        </div>
      </div>`;
    overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
    document.body.appendChild(overlay);
  },

  _saveStudentAssignments: function(username) {
    const ids = [...document.querySelectorAll('.assign-student-modal-cb:checked')].map(cb=>cb.getAttribute('data-course-id'));
    const res = window.db.updateStudentCourseEnrollments(username, ids);
    if (res.success) {
      window.app.showToast(`Updated: ${ids.length} course(s) assigned to @${username}.`,'success');
      document.getElementById('assign-student-modal')?.remove();
      AdminComponent._nav('students');
    }
  },

  _approveSub: function(subId) {
    const res = window.db.approveCourse(subId);
    if (res.success) window.app.showToast('Course approved and published! 🎉','success');
    else window.app.showToast('Error approving.','danger');
    AdminComponent._nav('submissions');
  },
  _rejectSub: function(subId) {
    window.db.rejectCourse(subId);
    window.app.showToast('Submission rejected.','warning');
    AdminComponent._nav('submissions');
  },

  _exportCSV: function(type) {
    let rows = [], headers = [];
    const allCourses = window.db.getCourses();
    if (type==='students') {
      headers = ['Name','Username','Enrolled Courses','Status','Joined'];
      rows = window.db.getUsers().filter(u=>u.role==='student'&&!u.deleted).map(u=>{
        const enrolledNames = (u.enrolledCourses||[]).map(id => {
          const c = allCourses.find(x => x.id === id);
          return c ? c.title : id;
        }).join('; ');
        return [u.name, u.username, enrolledNames, u.suspended?'Suspended':'Active', u.registeredDate||''];
      });
    } else if (type==='tutors') {
      headers = ['Name','Username','Assigned Courses','Status','Joined'];
      rows = window.db.getUsers().filter(u=>u.role==='instructor'&&!u.deleted).map(u=>{
        const assignedNames = (u.assignedCourses||[]).map(id => {
          const c = allCourses.find(x => x.id === id);
          return c ? c.title : id;
        }).join('; ');
        return [u.name, u.username, assignedNames, u.suspended?'Suspended':'Active', u.registeredDate||''];
      });
    } else if (type==='courses') {
      headers = ['Title','Price','Students','Rating','Status','Updated'];
      rows = window.db.getCourses().map(c=>[c.title,c.price,c.studentsCount||0,c.rating,c.archived?'Archived':c.published?'Published':'Draft',c.updatedDate||'']);
    } else if (type==='payments') {
      headers = ['Invoice','Student','Course','Amount','Method','Status','Date'];
      rows = window.db.getTransactions().map(t=>[t.invoiceNumber||'',t.username,t.courseTitle,t.amount,t.paymentMethod||'',t.adminStatus||t.status,new Date(t.timestamp).toLocaleDateString('en-IN')]);
    } else if (type==='live_classes') {
      headers = ['ID','Course','Tutor','Title','Date','Start Time','End Time','Status'];
      rows = window.db.getLiveClasses().map(lc=>[lc.id,lc.course_id,lc.tutor_id,lc.title,lc.date,lc.start_time,lc.end_time,lc.status]);
    } else {
      window.app.showToast('CSV export initiated!','success'); return;
    }
    const csv = [headers.join(','),...rows.map(r=>r.map(v=>`"${v}"`).join(','))].join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
    a.download = `cubaze-${type}-${Date.now()}.csv`; a.click();
    window.app.showToast(`${type} data exported!`,'success');
  },

  _importCSV: function(event, type) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target.result;
      
      // Quote-aware CSV parser
      function parseCSV(text) {
        const lines = [];
        let row = [""];
        let insideQuote = false;
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const nextChar = text[i + 1];
          if (char === '"') {
            if (insideQuote && nextChar === '"') {
              row[row.length - 1] += '"';
              i++;
            } else {
              insideQuote = !insideQuote;
            }
          } else if (char === ',' && !insideQuote) {
            row.push("");
          } else if ((char === '\r' || char === '\n') && !insideQuote) {
            if (char === '\r' && nextChar === '\n') i++;
            lines.push(row);
            row = [""];
          } else {
            row[row.length - 1] += char;
          }
        }
        if (row.length > 1 || row[0] !== "") {
          lines.push(row);
        }
        return lines;
      }

      const lines = parseCSV(text);
      if (lines.length < 2) {
        window.app.showToast('CSV file is empty or only contains headers.', 'danger');
        event.target.value = '';
        return;
      }

      const headers = lines[0].map(h => h.trim().toLowerCase().replace(/[\s_\-\/]/g, ''));
      const rows = lines.slice(1);
      
      let successCount = 0;
      let skipCount = 0;
      let errorMessages = [];

      const nameIdx = headers.findIndex(h => h === 'name' || h === 'fullname' || h === 'studentname' || h === 'tutorname' || h === 'student' || h === 'tutor');
      const usernameIdx = headers.findIndex(h => h === 'username' || h === 'user' || h === 'handle');
      const passwordIdx = headers.findIndex(h => h === 'password' || h === 'pass');
      const phoneIdx = headers.findIndex(h => h === 'phone' || h === 'phonenumber' || h === 'mobile' || h === 'contact');
      const bioIdx = headers.findIndex(h => h === 'bio' || h === 'authorbio' || h === 'expertise' || h === 'about' || h === 'expertisebio');
      const coursesIdx = headers.findIndex(h => h === 'assignedcourses' || h === 'courses' || h === 'assignedcourseids' || h === 'courseids');

      if (nameIdx === -1 || usernameIdx === -1) {
        window.app.showToast('CSV must contain "Name" and "Username" columns.', 'danger');
        event.target.value = '';
        return;
      }

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row.length === 1 && row[0] === '') continue; // Skip empty lines

        const name = row[nameIdx] ? row[nameIdx].trim() : '';
        const username = row[usernameIdx] ? row[usernameIdx].trim().toLowerCase().replace(/@/g, '') : '';
        let password = passwordIdx !== -1 && row[passwordIdx] ? row[passwordIdx].trim() : '';

        if (!name || !username) {
          skipCount++;
          errorMessages.push(`Row ${i+2}: Missing Name or Username.`);
          continue;
        }

        if (!password || password.length < 6) {
          password = 'Password123';
        }

        let courseIds = [];
        if (coursesIdx !== -1 && row[coursesIdx]) {
          const courseItems = row[coursesIdx].split(/[;,|]/).map(c => c.trim()).filter(Boolean);
          for (const item of courseItems) {
            const matched = allCourses.find(c => c.title.toLowerCase().trim() === item.toLowerCase().trim() || c.id.toLowerCase().trim() === item.toLowerCase().trim());
            if (matched) {
              courseIds.push(matched.id);
            }
          }
        }

        if (type === 'students') {
          const phone = phoneIdx !== -1 && row[phoneIdx] ? row[phoneIdx].trim() : '';
          const res = window.db.registerUser(username, password, name, 'student', phone);
          if (res.success) {
            successCount++;
            // Enroll student in resolved courses
            for (const cid of courseIds) {
              window.db.handleAutomaticEnrollment(username, cid);
            }
          } else {
            skipCount++;
            errorMessages.push(`Row ${i+2} (@${username}): ${res.error}`);
          }
        } else if (type === 'tutors') {
          const bio = bioIdx !== -1 && row[bioIdx] ? row[bioIdx].trim() : '';
          const res = window.db.addTutor(username, password, name, bio, courseIds);
          if (res.success) {
            successCount++;
          } else {
            skipCount++;
            errorMessages.push(`Row ${i+2} (@${username}): ${res.error}`);
          }
        }
      }

      if (successCount > 0) {
        window.db.addActivity('admin', 'IMPORTED_CSV', 'user', type, `Imported ${successCount} ${type}`);
      }

      if (errorMessages.length > 0) {
        alert(`CSV Import Finished:\n- Successfully imported: ${successCount}\n- Skipped/Failed: ${skipCount}\n\nDetails:\n${errorMessages.join('\n')}`);
      } else {
        window.app.showToast(`Imported ${successCount} ${type} successfully!`, 'success');
      }

      AdminComponent._nav(type);
      event.target.value = '';
    };
    reader.readAsText(file);
  },

  _renderPosters: function () {
    const posters = window.db.getPosters();
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div>
          <h2>Dashboard Posters</h2>
          <p style="color:var(--text-secondary); font-size:0.88rem; margin:4px 0 0 0;">Create and manage sliding banner posters for user dashboards.</p>
        </div>
        <button class="btn btn-primary" id="btn-add-poster"><i class="fa-solid fa-plus"></i> Add Poster</button>
      </div>

      <div class="glass-panel" style="overflow-x:auto; padding:0;">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width:120px;">Poster</th>
              <th>Title</th>
              <th>Target URL</th>
              <th style="width:100px;">Status</th>
              <th style="width:120px; text-align:center;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${posters.map(p => `
              <tr>
                <td>
                  <img src="${p.imageUrl}" alt="${p.title}" style="width:100px; height:50px; border-radius:6px; border:1px solid var(--border-color); object-fit:cover; display:block;">
                </td>
                <td style="font-weight:700; color:var(--text-primary); text-align:left; vertical-align:middle;">
                  ${p.title}
                </td>
                <td style="text-align:left; vertical-align:middle;">
                  ${p.targetUrl ? `<a href="${p.targetUrl}" target="_blank" style="color:var(--brand-blue); text-decoration:none; font-weight:600;"><i class="fa-solid fa-link"></i> Target Link</a>` : '<span style="color:var(--text-muted); font-style:italic;">None</span>'}
                </td>
                <td style="vertical-align:middle;">
                  <label style="position:relative; display:inline-block; width:44px; height:24px; margin:0; cursor:pointer;">
                    <input type="checkbox" class="poster-toggle-status" data-id="${p.id}" ${p.isActive ? 'checked' : ''} style="opacity:0; width:0; height:0;">
                    <span class="poster-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:${p.isActive ? 'var(--brand-blue)' : '#ccc'}; transition:.3s; border-radius:24px;">
                      <span style="position:absolute; height:18px; width:18px; left:3px; bottom:3px; background-color:white; transition:.3s; border-radius:50%; transform:${p.isActive ? 'translateX(20px)' : 'none'};"></span>
                    </span>
                  </label>
                </td>
                <td style="text-align:center; vertical-align:middle;">
                  <button class="btn btn-outline-white btn-xs btn-edit-poster" data-id="${p.id}" style="margin:0 4px 0 0;"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                  <button class="btn btn-danger btn-xs btn-del-poster" data-id="${p.id}" style="margin:0;"><i class="fa-solid fa-trash-can"></i> Delete</button>
                </td>
              </tr>
            `).join('')}
            ${posters.length === 0 ? '<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:32px; font-style:italic;">No posters uploaded yet. Banners on dashboards will show default messages.</td></tr>' : ''}
          </tbody>
        </table>
      </div>
    `;
  },

  _bindPostersEvents: function() {
    document.getElementById('btn-add-poster')?.addEventListener('click', () => {
      AdminComponent._openPosterModal();
    });

    document.querySelectorAll('.btn-edit-poster').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        AdminComponent._openPosterModal(id);
      });
    });

    document.querySelectorAll('.btn-del-poster').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this poster? This action cannot be undone.')) {
          const res = window.db.deletePoster(id);
          if (res) {
            window.app.showToast('Poster deleted successfully! 🗑️', 'success');
            AdminComponent._nav('posters');
          } else {
            window.app.showToast('Failed to delete poster.', 'danger');
          }
        }
      });
    });

    document.querySelectorAll('.poster-toggle-status').forEach(input => {
      input.addEventListener('change', () => {
        const id = input.getAttribute('data-id');
        const posters = window.db.getPosters();
        const p = posters.find(x => x.id === id);
        if (p) {
          p.isActive = input.checked;
          const res = window.db.savePoster(p);
          if (res) {
            window.app.showToast(`Poster status updated!`, 'success');
            AdminComponent._nav('posters');
          } else {
            window.app.showToast('Failed to update poster status.', 'danger');
            input.checked = !input.checked;
          }
        }
      });
    });
  },

  _openPosterModal: function(posterId = null) {
    const poster = posterId ? window.db.getPosters().find(p => p.id === posterId) : null;
    
    const overlay = document.createElement('div');
    overlay.className = 'adm-modal-overlay';
    overlay.id = 'poster-modal-overlay';
    
    overlay.innerHTML = `
      <div class="adm-modal" style="max-width:500px; text-align:left;">
        <h3><i class="fa-solid fa-image" style="color:var(--brand-blue); margin-right:8px;"></i>${posterId ? 'Edit Dashboard Poster' : 'Add Dashboard Poster'}</h3>
        <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:20px;">Upload an image banner to be featured in the sliding dashboard carousels.</p>
        
        <form id="form-manage-poster">
          <div class="form-group" style="margin-bottom:14px;">
            <label>Poster Title *</label>
            <input type="text" id="post-title" required value="${poster ? poster.title : ''}" placeholder="e.g. 50% Off sculpting masterclass" style="font-family:inherit;">
          </div>
          <div class="form-group" style="margin-bottom:14px;">
            <label>Target URL (Optional)</label>
            <input type="url" id="post-url" value="${poster ? (poster.targetUrl || '') : ''}" placeholder="https://cubaze.in/..." style="font-family:inherit;">
          </div>
          
          <div class="form-group" style="margin-bottom:16px;">
            <label>Poster Image *</label>
            <div style="display:flex; flex-direction:column; gap:10px;">
              ${poster ? `<img id="post-img-preview" src="${poster.imageUrl}" style="width:100%; height:120px; object-fit:cover; border-radius:8px; border:1px solid var(--border-color);">` : `<img id="post-img-preview" style="width:100%; height:120px; object-fit:cover; border-radius:8px; border:1px solid var(--border-color); display:none;">`}
              <input type="file" id="post-file" accept="image/*" style="font-size:0.85rem;" ${poster ? '' : 'required'}>
              <div style="font-size:0.75rem; color:var(--text-secondary);">Recommended aspect ratio: 16:9 (e.g. 800x450). Max size 10MB.</div>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('poster-modal-overlay').remove()" style="margin:0; padding:10px 20px;">Cancel</button>
            <button type="submit" class="btn btn-primary" id="btn-save-poster" style="margin:0; padding:10px 20px;">${posterId ? 'Save Changes' : 'Upload & Create'}</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    const fileInput = overlay.querySelector('#post-file');
    const previewImg = overlay.querySelector('#post-img-preview');
    
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          previewImg.src = e.target.result;
          previewImg.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });

    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.remove();
    });

    overlay.querySelector('#form-manage-poster').addEventListener('submit', async e => {
      e.preventDefault();
      
      const saveBtn = overlay.querySelector('#btn-save-poster');
      const originalText = saveBtn.innerText;
      saveBtn.disabled = true;
      saveBtn.innerText = 'Uploading...';

      try {
        const title = overlay.querySelector('#post-title').value.trim();
        const targetUrl = overlay.querySelector('#post-url').value.trim();
        const file = fileInput.files[0];
        
        let imageUrl = poster ? poster.imageUrl : '';
        
        if (file) {
          const uploadRes = await window.db.uploadSupportAttachment(file);
          if (uploadRes && uploadRes.url) {
            imageUrl = uploadRes.url;
          } else {
            throw new Error("Failed to upload image.");
          }
        }
        
        const posterData = {
          title,
          targetUrl,
          imageUrl,
          isActive: poster ? poster.isActive : true
        };
        if (posterId) posterData.id = posterId;

        const res = window.db.savePoster(posterData);
        if (res) {
          window.app.showToast(posterId ? 'Poster updated! ✅' : 'Poster uploaded and created! 🚀', 'success');
          overlay.remove();
          AdminComponent._nav('posters');
        } else {
          window.app.showToast('Failed to save poster info.', 'danger');
        }
      } catch (err) {
        window.app.showToast(err.message || 'An error occurred.', 'danger');
      } finally {
        saveBtn.disabled = false;
        saveBtn.innerText = originalText;
      }
    });
  },

  /* ============================================================
     INIT & BINDING
  ============================================================ */
  init: function() {
    window.scrollTo({top:0,behavior:'smooth'});
    AdminComponent._sec = 'dashboard';
    AdminComponent._activeConvId = null;
    AdminComponent._bindSidebar();
    AdminComponent._bindSection('dashboard');
    AdminComponent.updateAdminBadge();
    const cu = window.db.getCurrentUser();
    if (cu && AdminComponent._sec === 'dashboard') {
      setTimeout(() => {
        if (window.DashboardRightPanel) window.DashboardRightPanel.bindEvents(cu);
      }, 100);
    }
  },

  _bindSidebar: function() {
    document.querySelectorAll('.sidebar-nav-item[data-adm-tab]').forEach(item => {
      item.addEventListener('click', () => AdminComponent._nav(item.getAttribute('data-adm-tab')));
    });
  },

  _bindSection: function(sec) {
    if (sec==='common_meeting') {
      AdminComponent._bindCommonMeetingsEvents();
    }
    if (sec==='students') {
      document.getElementById('stu-search')?.addEventListener('input', e => {
        document.getElementById('adm-main').innerHTML = AdminComponent._renderStudents(e.target.value, document.getElementById('stu-filter')?.value||'');
        AdminComponent._bindSection('students');
      });
      document.getElementById('stu-filter')?.addEventListener('change', e => {
        document.getElementById('adm-main').innerHTML = AdminComponent._renderStudents(document.getElementById('stu-search')?.value||'', e.target.value);
        AdminComponent._bindSection('students');
      });

      // Bulk actions event handlers
      const checkAll = document.getElementById('stu-check-all');
      const checks = document.querySelectorAll('.stu-check');
      const bulkActions = document.getElementById('stu-bulk-actions');
      const bulkCount = document.getElementById('stu-bulk-count');

      function updateBulkActions() {
        const checkedCount = document.querySelectorAll('.stu-check:checked').length;
        if (checkedCount > 0) {
          bulkActions.style.display = 'flex';
          bulkCount.innerText = `${checkedCount} selected`;
        } else {
          bulkActions.style.display = 'none';
        }
      }

      checkAll?.addEventListener('change', e => {
        checks.forEach(cb => cb.checked = e.target.checked);
        updateBulkActions();
      });

      checks.forEach(cb => {
        cb.addEventListener('change', () => {
          if (checkAll) {
            checkAll.checked = [...checks].every(x => x.checked);
          }
          updateBulkActions();
        });
      });
    }
    if (sec==='tutors') {
      document.getElementById('tut-search')?.addEventListener('input', e => {
        document.getElementById('adm-main').innerHTML = AdminComponent._renderTutors(e.target.value);
        AdminComponent._bindSection('tutors');
      });
      AdminComponent._bindTutorForm();

      // Bulk actions event handlers for tutors
      const checkAll = document.getElementById('tut-check-all');
      const checks = document.querySelectorAll('.tut-check');
      const bulkActions = document.getElementById('tut-bulk-actions');
      const bulkCount = document.getElementById('tut-bulk-count');

      function updateBulkActions() {
        const checkedCount = document.querySelectorAll('.tut-check:checked').length;
        if (checkedCount > 0) {
          bulkActions.style.display = 'flex';
          bulkCount.innerText = `${checkedCount} selected`;
        } else {
          bulkActions.style.display = 'none';
        }
      }

      checkAll?.addEventListener('change', e => {
        checks.forEach(cb => cb.checked = e.target.checked);
        updateBulkActions();
      });

      checks.forEach(cb => {
        cb.addEventListener('change', () => {
          if (checkAll) {
            checkAll.checked = [...checks].every(x => x.checked);
          }
          updateBulkActions();
        });
      });
    }
    if (sec==='courses') {
      document.getElementById('crs-search')?.addEventListener('input', e => {
        document.getElementById('adm-main').innerHTML = AdminComponent._renderCourses(e.target.value, document.getElementById('crs-filter')?.value||'');
        AdminComponent._bindSection('courses');
      });
      document.getElementById('crs-filter')?.addEventListener('change', e => {
        document.getElementById('adm-main').innerHTML = AdminComponent._renderCourses(document.getElementById('crs-search')?.value||'', e.target.value);
        AdminComponent._bindSection('courses');
      });
    }
    if (sec==='batches') {
      const reloadBatches = () => {
        const q = document.getElementById('bt-search')?.value || '';
        const course = document.getElementById('bt-course')?.value || '';
        const tutor = document.getElementById('bt-tutor')?.value || '';
        const status = document.getElementById('bt-status')?.value || '';
        const date = document.getElementById('bt-date')?.value || '';
        document.getElementById('adm-main').innerHTML = AdminComponent._renderBatches(q, course, tutor, status, date);
        AdminComponent._bindSection('batches');
      };
      
      document.getElementById('bt-search')?.addEventListener('input', reloadBatches);
      document.getElementById('bt-course')?.addEventListener('change', reloadBatches);
      document.getElementById('bt-tutor')?.addEventListener('change', reloadBatches);
      document.getElementById('bt-status')?.addEventListener('change', reloadBatches);
      document.getElementById('bt-date')?.addEventListener('change', reloadBatches);
      AdminComponent._bindBatchForm();
    }
    if (sec==='payments') {
      document.getElementById('pay-search')?.addEventListener('input', e => {
        document.getElementById('adm-main').innerHTML = AdminComponent._renderPayments(e.target.value, document.getElementById('pay-filter')?.value||'');
        AdminComponent._bindSection('payments');
      });
      document.getElementById('pay-filter')?.addEventListener('change', e => {
        document.getElementById('adm-main').innerHTML = AdminComponent._renderPayments(document.getElementById('pay-search')?.value||'', e.target.value);
        AdminComponent._bindSection('payments');
      });
    }
    if (sec==='coupons') {
      document.getElementById('form-add-coupon')?.addEventListener('submit', e => {
        e.preventDefault();
        const code = document.getElementById('coupon-code').value.trim().toUpperCase();
        const type = document.getElementById('coupon-type').value;
        const discount = parseFloat(document.getElementById('coupon-discount').value);
        if (!code || isNaN(discount)) return;

        const res = window.db.saveCoupon({ code, type, discount, active: true });
        if (res) {
          window.app.showToast('Coupon added successfully! 🎉', 'success');
          AdminComponent._nav('coupons');
        } else {
          window.app.showToast('Failed to add coupon.', 'danger');
        }
      });
    }
    if (sec==='liveclasses') {
      const triggerReload = () => {
        const q = document.getElementById('adm-lc-search')?.value || '';
        const tutor = document.getElementById('adm-lc-tutor')?.value || '';
        const course = document.getElementById('adm-lc-course')?.value || '';
        const date = document.getElementById('adm-lc-date')?.value || '';
        document.getElementById('adm-main').innerHTML = AdminComponent._renderLiveClasses(q, tutor, course, date);
        AdminComponent._bindSection('liveclasses');
      };
      document.getElementById('adm-lc-search')?.addEventListener('input', triggerReload);
      document.getElementById('adm-lc-tutor')?.addEventListener('change', triggerReload);
      document.getElementById('adm-lc-course')?.addEventListener('change', triggerReload);
      document.getElementById('adm-lc-date')?.addEventListener('change', triggerReload);
    }
    if (sec==='posters') {
      AdminComponent._bindPostersEvents();
    }
  },

  _bindTutorForm: function() {
    document.getElementById('form-create-tutor')?.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('t-name').value.trim();
      const username = document.getElementById('t-username').value.trim().toLowerCase();
      const password = document.getElementById('t-password').value;
      const bio = document.getElementById('t-bio').value.trim();
      const selectedCourses = [...document.querySelectorAll('.new-tutor-cb:checked')].map(cb=>cb.getAttribute('data-course-id'));
      if (password.length < 6) { window.app.showToast('Password must be at least 6 characters.','danger'); return; }
      const res = window.db.addTutor(username, password, name, bio, selectedCourses);
      if (res.success) {
        window.app.showToast(`Tutor "${name}" registered with ${selectedCourses.length} course(s)! 🎓`,'success');
        AdminComponent._nav('tutors');
      } else {
        window.app.showToast(res.error||'Failed to add tutor.','danger');
      }
    });
  },

  _bindBatchForm: function() {
    document.getElementById('form-batch')?.addEventListener('submit', e => {
      e.preventDefault();
      const id = document.getElementById('bf-id').value;
      const name = document.getElementById('bf-name').value.trim();
      const courseId = document.getElementById('bf-course').value;
      const maxStudents = parseInt(document.getElementById('bf-max').value) || 50;
      const classTime = document.getElementById('bf-time').value.trim();
      const startDate = document.getElementById('bf-start').value;
      const endDate = document.getElementById('bf-end').value;
      const googleMeetLink = document.getElementById('bf-meet').value.trim();
      const googleDriveFolder = document.getElementById('bf-drive').value.trim();
      const whatsappLink = document.getElementById('bf-whatsapp').value.trim();
      const status = document.getElementById('bf-status').value;
      
      const tutorIds = [...document.querySelectorAll('.bf-tutors-cb:checked')].map(cb => cb.value);
      const classDays = [...document.querySelectorAll('.bf-days-cb:checked')].map(cb => cb.value);

      if (status === 'Active') {
        if (tutorIds.length === 0) {
          window.app.showToast('Assign Tutor/Mentor is required before activating the batch.', 'danger');
          return;
        }
        if (!startDate) {
          window.app.showToast('Start Date is required before activating the batch.', 'danger');
          return;
        }
        if (!endDate) {
          window.app.showToast('End Date is required before activating the batch.', 'danger');
          return;
        }
      }

      if (whatsappLink !== '') {
        const waRegex = /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+$/;
        if (!waRegex.test(whatsappLink)) {
          window.app.showToast('Invalid WhatsApp Group invite link. Must start with https://chat.whatsapp.com/', 'danger');
          return;
        }
      }

      // Check capacity reduction in frontend
      if (id) {
        const oldBatch = window.db.getBatchById(id);
        if (oldBatch && maxStudents < oldBatch.currentEnrollment) {
          window.app.showToast(`Cannot reduce capacity below current enrollment of ${oldBatch.currentEnrollment} students.`, 'danger');
          return;
        }
      }

      const batchData = {
        id: id || `B-${courseId.substring(0,4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        name,
        courseId,
        tutorIds,
        maxStudents,
        classTime,
        startDate,
        endDate,
        classDays,
        googleMeetLink,
        googleDriveFolder,
        whatsappLink,
        status
      };

      const res = window.db.saveBatch(batchData);
      if (res.success) {
        window.app.showToast(id ? 'Batch updated successfully! ✅' : 'Batch created successfully! 🎉', 'success');
        AdminComponent._nav('batches');
      } else {
        window.app.showToast(res.error || 'Failed to save batch.', 'danger');
      }
    });
  },

  _bindCourseForm: function() {
    document.getElementById('form-course')?.addEventListener('submit', e => {
      e.preventDefault();
      const id = document.getElementById('cf-id').value;
      const data = {
        title: document.getElementById('cf-title').value,
        price: document.getElementById('cf-price').value,
        level: document.getElementById('cf-level').value,
        duration: document.getElementById('cf-duration').value,
        category: document.getElementById('cf-category').value,
        author: document.getElementById('cf-tutor').value,
        shortDescription: document.getElementById('cf-sdesc').value,
        description: document.getElementById('cf-desc').value,
        image: document.getElementById('cf-image').value||'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=600',
        previewVideo: document.getElementById('cf-preview').value
      };
      let res;
      if (id) {
        res = window.db.updateCourse(id, data);
        if (res.success) window.app.showToast('Course updated! ✅','success');
      } else {
        res = window.db.createAdminCourse(data);
        if (res.success) window.app.showToast('Course created! 🎉','success');
      }
      if (res && res.success) AdminComponent._nav('courses');
      else window.app.showToast(res?.error||'Error saving course.','danger');
    });
  },

  _bindModuleEvents: function(courseId) {

    document.querySelectorAll('.form-add-lesson').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const cId = form.getAttribute('data-course-id');
        const modIdx = parseInt(form.getAttribute('data-mod-idx'));
        const title = form.querySelector('.l-title').value.trim();
        const url = form.querySelector('.l-url').value.trim();
        const dur = form.querySelector('.l-duration').value.trim();
        const res = window.db.addLessonToCourseModule(cId, modIdx, title, dur, url, '', 'admin');
        if (res.success) { window.app.showToast('Lesson added!','success'); AdminComponent._manageModules(courseId); }
        else window.app.showToast(res.error||'Failed.','danger');
      });
    });
  },

  /* ============================================================
     ACTION MENU — fixed-position dropdown (escapes overflow:hidden)
  ============================================================ */
  _showEditCoupon: function(code) {
    const coupons = window.db.getCoupons();
    const coupon = coupons.find(c => String(c.code).toUpperCase() === String(code).toUpperCase());
    if (!coupon) return;

    const overlay = document.createElement('div');
    overlay.className = 'adm-modal-overlay';
    overlay.id = 'edit-coupon-modal';
    overlay.innerHTML = `
      <div class="adm-modal">
        <h3><i class="fa-solid fa-tag" style="color:#3D46D8;margin-right:8px;"></i>Edit Coupon</h3>
        <form id="form-edit-coupon">
          <div class="form-group" style="margin-bottom:14px;">
            <label>Coupon Code *</label>
            <input type="text" id="edit-c-code" required class="form-control" value="${coupon.code}" disabled style="opacity:0.6;background:#F8FAFC;">
          </div>
          <div class="form-group" style="margin-bottom:14px;">
            <label>Discount Type</label>
            <select id="edit-c-type" class="form-control">
              <option value="percentage" ${coupon.type==='percentage'?'selected':''}>percentage</option>
              <option value="flat" ${coupon.type==='flat'?'selected':''}>flat</option>
            </select>
          </div>
          <div class="form-group" style="margin-bottom:14px;">
            <label>Discount Amount *</label>
            <input type="number" id="edit-c-discount" class="form-control" required value="${coupon.discount}">
          </div>
          <div style="margin-bottom:20px;display:flex;align-items:center;gap:10px;">
            <input type="checkbox" id="edit-c-active" ${coupon.active?'checked':''} style="width:18px;height:18px;accent-color:#3D46D8;">
            <label for="edit-c-active" style="margin:0;cursor:pointer;font-weight:600;font-size:0.875rem;">Active</label>
          </div>
          <div style="display:flex;gap:10px;justify-content:flex-end;">
            <button type="button" class="btn btn-secondary btn-modal-cancel" style="padding:10px 20px;">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" style="padding:10px 20px;">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    `;

    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    overlay.querySelector('.btn-modal-cancel').addEventListener('click', () => overlay.remove());
    overlay.querySelector('#form-edit-coupon').addEventListener('submit', e => {
      e.preventDefault();
      const type = document.getElementById('edit-c-type').value;
      const discount = parseFloat(document.getElementById('edit-c-discount').value);
      const active = document.getElementById('edit-c-active').checked;

      if (isNaN(discount)) return;

      const res = window.db.saveCoupon({ code, type, discount, active });
      if (res) {
        window.app.showToast('Coupon updated successfully! ✅', 'success');
        overlay.remove();
        AdminComponent._nav('coupons');
      } else {
        window.app.showToast('Failed to update coupon.', 'danger');
      }
    });

    document.body.appendChild(overlay);
  },

  _deleteCoupon: function(code) {
    if (confirm(`Are you sure you want to delete coupon ${code}?`)) {
      if (window.db.deleteCoupon(code)) {
        window.app.showToast('Coupon deleted successfully.', 'success');
        AdminComponent._nav('coupons');
      } else {
        window.app.showToast(`Failed to delete coupon ${code}.`, 'error');
      }
    }
  },

  _openAdmMenu: function(btn, e) {
    if (e) e.stopPropagation();
    const menu = btn.nextElementSibling;
    if (!menu) return;

    const isOpen = menu.classList.contains('open');

    // Close any other open menus first
    document.querySelectorAll('.adm-action-menu.open').forEach(m => {
      m.classList.remove('open');
    });

    if (!isOpen) {
      menu.classList.add('open');
    }
  },

  // ============================================================
  // LIVE CLASS MANAGEMENT
  // ============================================================
  _renderLiveClasses: function(search='', filterTutor='', filterCourse='', filterDate='') {
    let classes = window.db.getLiveClasses();
    
    if (search) {
      classes = classes.filter(lc => lc.title.toLowerCase().includes(search.toLowerCase()) || (lc.description || '').toLowerCase().includes(search.toLowerCase()));
    }
    if (filterTutor) {
      classes = classes.filter(lc => lc.tutor_id === filterTutor);
    }
    if (filterCourse) {
      classes = classes.filter(lc => lc.course_id === filterCourse);
    }
    if (filterDate) {
      classes = classes.filter(lc => lc.date === filterDate);
    }

    const tutors = window.db.getUsers().filter(u => u.role === 'instructor');
    const courses = window.db.getCourses();

    return `
      <div class="dashboard-welcome">
        <h1>Live Class Management <span style="font-size:1rem;font-weight:500;color:#64748B;">(${classes.length})</span></h1>
        <p>Monitor, edit, cancel, and view attendance for any live class scheduled by instructors.</p>
      </div>

      <div class="glass-panel">
        <div class="table-actions-bar">
          <div class="table-actions-left">
            <div class="search-input-wrapper" style="width: 200px;">
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
              <input id="adm-lc-search" placeholder="Search live classes..." value="${search}">
            </div>
            
            <select id="adm-lc-tutor" style="width: 140px; height: 46px;">
              <option value="">All Tutors</option>
              ${tutors.map(t => `<option value="${t.username}" ${filterTutor===t.username?'selected':''}>${t.name}</option>`).join('')}
            </select>

            <select id="adm-lc-course" style="width: 140px; height: 46px;">
              <option value="">All Courses</option>
              ${courses.map(c => `<option value="${c.id}" ${filterCourse===c.id?'selected':''}>${c.title}</option>`).join('')}
            </select>

            <input type="date" id="adm-lc-date" value="${filterDate}" style="width: 140px; height: 46px; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 0 12px; background:var(--bg-primary); color:var(--text-primary);">
          </div>
          <div class="table-actions-right">
            <button class="btn btn-outline-white btn-sm" onclick="AdminComponent._exportCSV('live_classes')" style="height: 46px; padding: 0 16px;"><i class="fa-solid fa-download"></i> Export CSV</button>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Course / Tutor</th>
              <th>Live Class Title</th>
              <th>Scheduled Time</th>
              <th>Meet Link</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${classes.length === 0 ? `
              <tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:32px;">No live classes match your filters.</td></tr>
            ` : classes.map(lc => {
              const c = courses.find(x => x.id === lc.course_id);
              const courseTitle = c ? c.title : lc.course_id;
              const tutor = tutors.find(t => t.username === lc.tutor_id);
              const tutorName = tutor ? tutor.name : lc.tutor_id;

              let statusClass = "success";
              if (lc.status === 'draft') statusClass = "warning";
              else if (lc.status === 'cancelled') statusClass = "danger";

              return `
                <tr>
                  <td>
                    <div style="font-weight:700;color:var(--text-primary);font-size:0.85rem;">${courseTitle}</div>
                    <div style="font-size:0.72rem;color:var(--text-muted);">Tutor: ${tutorName}</div>
                  </td>
                  <td>
                    <div style="font-weight:600;color:var(--text-primary);">${lc.title}</div>
                  </td>
                  <td>
                    <div style="font-weight:600;color:var(--text-primary);"><i class="fa-regular fa-calendar-days" style="margin-right:6px;color:var(--brand-blue);"></i>${lc.date}</div>
                    <div style="font-size:0.72rem;color:var(--text-muted);"><i class="fa-regular fa-clock" style="margin-right:6px;color:var(--brand-blue);"></i>${lc.start_time} - ${lc.end_time}</div>
                  </td>
                  <td>
                    ${lc.meet_link ? `<a href="${lc.meet_link}" target="_blank" style="color:var(--brand-blue);font-weight:700;font-size:0.8rem;text-decoration:none;"><i class="fa-solid fa-video" style="margin-right:4px;"></i>Meet Link</a>` : `<span style="color:var(--text-muted);font-style:italic;">None</span>`}
                  </td>
                  <td>
                    <span class="status-badge ${statusClass}">${lc.status}</span>
                  </td>
                  <td>
                    <div class="adm-action-wrap">
                      <button class="btn btn-outline-white btn-sm btn-icon" onclick="AdminComponent._openAdmMenu(this, event)"><i class="fa-solid fa-ellipsis"></i></button>
                      <div class="adm-action-menu">
                        <button onclick="AdminComponent._showEditLiveClass('${lc.id}')"><i class="fa-solid fa-pen-to-square" style="color:#D97706;"></i> Edit</button>
                        ${lc.status !== 'cancelled' ? `<button onclick="AdminComponent._cancelLiveClass('${lc.id}')"><i class="fa-solid fa-ban" style="color:#DC2626;"></i> Cancel</button>` : ''}
                        <button onclick="AdminComponent._showAttendanceReport('${lc.id}')"><i class="fa-solid fa-clipboard-user" style="color:#3D46D8;"></i> Attendance</button>
                        <button class="danger" onclick="AdminComponent._deleteLiveClass('${lc.id}')"><i class="fa-solid fa-trash-can"></i> Delete</button>
                      </div>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  _cancelLiveClass: function(id) {
    if (!confirm('Are you sure you want to cancel this live class?')) return;
    const lc = window.db.getLiveClassById(id);
    if (!lc) return;
    lc.status = 'cancelled';
    if (window.db.saveLiveClass(lc)) {
      window.app.showToast('Live class cancelled.', 'success');
      AdminComponent._refreshLiveClasses();
    } else {
      window.app.showToast('Failed to cancel live class.', 'danger');
    }
  },

  _deleteLiveClass: function(id) {
    if (!confirm('Are you sure you want to delete this live class permanently?')) return;
    if (window.db.deleteLiveClass(id)) {
      window.app.showToast('Live class deleted.', 'success');
      AdminComponent._refreshLiveClasses();
    } else {
      window.app.showToast('Failed to delete live class.', 'danger');
    }
  },

  _refreshLiveClasses: function() {
    const q = document.getElementById('adm-lc-search')?.value || '';
    const tutor = document.getElementById('adm-lc-tutor')?.value || '';
    const course = document.getElementById('adm-lc-course')?.value || '';
    const date = document.getElementById('adm-lc-date')?.value || '';
    document.getElementById('adm-main').innerHTML = AdminComponent._renderLiveClasses(q, tutor, course, date);
    AdminComponent._bindSection('liveclasses');
  },

  _showEditLiveClass: function(id) {
    const lc = window.db.getLiveClassById(id);
    if (!lc) return;

    const tutors = window.db.getUsers().filter(u => u.role === 'instructor');
    const courses = window.db.getCourses();
    const activeCourse = courses.find(c => c.id === lc.course_id) || courses[0];
    const modules = activeCourse ? (activeCourse.modules || []) : [];

    const overlay = document.createElement('div');
    overlay.className = 'tutor-modal-overlay';
    overlay.id = 'live-class-edit-modal';

    overlay.innerHTML = `
      <div class="tutor-modal" style="max-width: 540px;">
        <h3><i class="fa-solid fa-video" style="color:var(--brand-blue);margin-right:8px;"></i>Edit Live Class (Admin)</h3>
        <form id="form-admin-live-class">
          <div class="form-group" style="margin-bottom:14px;">
            <label>Tutor</label>
            <select id="adm-lc-modal-tutor" disabled>
              ${tutors.map(t => `<option value="${t.username}" ${t.username === lc.tutor_id ? 'selected' : ''}>${t.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="margin-bottom:14px;">
            <label>Course</label>
            <select id="adm-lc-modal-course" disabled>
              ${courses.map(c => `<option value="${c.id}" ${c.id === lc.course_id ? 'selected' : ''}>${c.title}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="margin-bottom:14px;">
            <label>Module *</label>
            <select id="adm-lc-modal-module" required>
              ${modules.map((m, idx) => `<option value="${idx}" ${lc.module_id === idx ? 'selected' : ''}>${m.title}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="margin-bottom:14px;">
            <label>Title *</label>
            <input type="text" id="adm-lc-modal-title" required value="${lc.title}">
          </div>
          <div class="form-group" style="margin-bottom:14px;">
            <label>Description</label>
            <textarea id="adm-lc-modal-desc" style="min-height:70px; resize:vertical;">${lc.description || ''}</textarea>
          </div>
          <div style="display:grid; grid-template-columns: 2fr 1fr 1fr; gap:12px; margin-bottom:14px;">
            <div class="form-group" style="margin-bottom:0;">
              <label>Date *</label>
              <input type="date" id="adm-lc-modal-date" required value="${lc.date}">
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label>Start Time *</label>
              <input type="time" id="adm-lc-modal-start" required value="${lc.start_time}">
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label>End Time *</label>
              <input type="time" id="adm-lc-modal-end" required value="${lc.end_time}">
            </div>
          </div>
          <div class="form-group" style="margin-bottom:14px;">
            <label>Google Meet Link *</label>
            <input type="url" id="adm-lc-modal-link" required value="${lc.meet_link}">
          </div>
          <div class="form-group" style="margin-bottom:20px;">
            <label>Status</label>
            <select id="adm-lc-modal-status" style="width:100%;">
              <option value="published" ${lc.status === 'published' ? 'selected' : ''}>Published</option>
              <option value="draft" ${lc.status === 'draft' ? 'selected' : ''}>Draft</option>
              <option value="cancelled" ${lc.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </div>
          <div style="display:flex; gap:10px; justify-content:flex-end;">
            <button type="button" class="btn btn-secondary btn-modal-cancel" style="padding:10px 20px;">Cancel</button>
            <button type="submit" class="btn btn-primary" style="padding:10px 20px;">Save Changes</button>
          </div>
        </form>
      </div>
    `;

    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    overlay.querySelector('.btn-modal-cancel').addEventListener('click', () => overlay.remove());

    overlay.querySelector('#form-admin-live-class').addEventListener('submit', e => {
      e.preventDefault();
      lc.module_id = parseInt(overlay.querySelector('#adm-lc-modal-module').value);
      lc.title = overlay.querySelector('#adm-lc-modal-title').value.trim();
      lc.description = overlay.querySelector('#adm-lc-modal-desc').value.trim();
      lc.date = overlay.querySelector('#adm-lc-modal-date').value;
      lc.start_time = overlay.querySelector('#adm-lc-modal-start').value;
      lc.end_time = overlay.querySelector('#adm-lc-modal-end').value;
      lc.meet_link = overlay.querySelector('#adm-lc-modal-link').value;
      lc.status = overlay.querySelector('#adm-lc-modal-status').value;

      if (window.db.saveLiveClass(lc)) {
        window.app.showToast('Live class updated! ✅', 'success');
        overlay.remove();
        AdminComponent._refreshLiveClasses();
      } else {
        window.app.showToast('Failed to save live class.', 'danger');
      }
    });

    document.body.appendChild(overlay);
  },

  _showAttendanceReport: function(classId) {
    const report = window.db.getAttendanceReport(classId);
    const lc = window.db.getLiveClassById(classId);
    if (!lc) return;

    const overlay = document.createElement('div');
    overlay.className = 'tutor-modal-overlay';
    overlay.id = 'live-class-attendance-modal';

    const presentCount = report.filter(r => r.status === 'PRESENT').length;
    const lateCount = report.filter(r => r.status === 'LATE').length;
    const absentCount = report.filter(r => r.status === 'ABSENT').length;

    overlay.innerHTML = `
      <div class="tutor-modal" style="max-width: 600px; padding: 24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
          <h3 style="margin:0;"><i class="fa-solid fa-clipboard-user" style="color:var(--brand-blue);margin-right:8px;"></i>Attendance Report</h3>
          <button class="btn btn-outline-white btn-sm btn-modal-cancel" style="width:32px; height:32px; padding:0; border-radius:50%;"><i class="fa-solid fa-xmark"></i></button>
        </div>
        
        <div style="margin-bottom:18px;">
          <h4 style="margin:0 0 4px 0; color:var(--text-primary); font-size:1.05rem;">${lc.title}</h4>
          <p style="margin:0; color:var(--text-muted); font-size:0.8rem;">Date: ${lc.date} · Scheduled: ${lc.start_time} - ${lc.end_time}</p>
        </div>

        <div class="dashboard-widgets" style="margin-bottom:20px; grid-template-columns: repeat(3, 1fr); gap:12px;">
          <div class="widget-card" style="padding: 12px 16px; text-align:center;">
            <div class="widget-number" style="font-size:1.4rem; color:var(--success);">${presentCount}</div>
            <div class="widget-label" style="font-size:0.72rem;">Present</div>
          </div>
          <div class="widget-card" style="padding: 12px 16px; text-align:center;">
            <div class="widget-number" style="font-size:1.4rem; color:var(--warning);">${lateCount}</div>
            <div class="widget-label" style="font-size:0.72rem;">Late</div>
          </div>
          <div class="widget-card" style="padding: 12px 16px; text-align:center;">
            <div class="widget-number" style="font-size:1.4rem; color:var(--danger);">${absentCount}</div>
            <div class="widget-label" style="font-size:0.72rem;">Absent</div>
          </div>
        </div>

        <div style="max-height: 280px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
          <table class="data-table" style="margin:0;">
            <thead>
              <tr>
                <th>Student</th>
                <th>Join Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${report.length === 0 ? `
                <tr><td colspan="3" style="text-align:center; color:var(--text-muted); padding:16px;">No students enrolled in this course.</td></tr>
              ` : report.map(r => {
                let badgeClass = "success";
                if (r.status === 'LATE') badgeClass = "warning";
                else if (r.status === 'ABSENT') badgeClass = "danger";

                return `
                  <tr>
                    <td>
                      <div style="font-weight:600; color:var(--text-primary); font-size:0.83rem;">${r.name}</div>
                      <div style="font-size:0.72rem; color:var(--text-muted);">${r.email}</div>
                    </td>
                    <td style="font-size:0.8rem; font-weight:600; color:var(--text-primary);">${r.joinTime}</td>
                    <td>
                      <span class="status-badge ${badgeClass}">${r.status}</span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    overlay.querySelector('.btn-modal-cancel').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
  },

  // ============================================================
  // STUDENT REQUESTS (ADMIN) MANAGEMENT
  // ============================================================
  updateAdminBadge: async function() {
    try {
      const convs = await window.db.getSupportConversations();
      const unreadCount = convs.filter(c => c.unread_by_admin).length;
      const el = document.getElementById('admin-unread-badge');
      if (el) {
        if (unreadCount > 0) {
          el.textContent = unreadCount;
          el.style.display = 'inline-block';
        } else {
          el.style.display = 'none';
        }
      }
    } catch (err) {
      console.error("Error updating admin support badge:", err);
    }
  },

  _loadAndRenderRequests: async function() {
    const main = document.getElementById('adm-main');
    if (!main) return;

    AdminComponent._initRealtime();

    if (AdminComponent._activeConvId) {
      main.innerHTML = await AdminComponent._renderConversationView(AdminComponent._activeConvId);
      AdminComponent._bindConversationEvents(AdminComponent._activeConvId);
      await window.db.markMessagesAsSeen(AdminComponent._activeConvId, 'admin');
      AdminComponent.updateAdminBadge();
      return;
    }

    main.innerHTML = `<div style="text-align:center;padding:48px;"><div class="spinner"></div><p style="margin-top:12px;color:var(--text-muted);">Loading requests dashboard...</p></div>`;

    try {
      const convs = await window.db.getSupportConversations();
      main.innerHTML = AdminComponent._renderRequestsView(convs);
      AdminComponent._bindRequestsEvents(convs);
      AdminComponent.updateAdminBadge();
    } catch(err) {
      main.innerHTML = `<div class="alert alert-danger">Error: ${err.message}</div>`;
    }
  },

  _initRealtime: function() {
    if (AdminComponent._realtimeChannel) return;
    AdminComponent._realtimeChannel = window.db.subscribeToSupportRealtime((e) => {
      if (AdminComponent._sec === 'requests') {
        if (e.type === 'message' && e.payload.new) {
          const cu = window.db.getCurrentUser();
          if (e.payload.new.sender !== cu.username) {
            if (AdminComponent._activeConvId === e.payload.new.conversation_id) {
              AdminComponent._refreshChatMessagesOnly(AdminComponent._activeConvId);
              window.db.markMessagesAsSeen(AdminComponent._activeConvId, 'admin');
            } else {
              window.app.showToast(`New support request message from @${e.payload.new.sender}!`, 'info');
              AdminComponent._loadAndRenderRequests();
            }
          }
        } else if (e.type === 'conversation') {
          AdminComponent._loadAndRenderRequests();
        }
      } else {
        AdminComponent.updateAdminBadge();
      }
    });
  },

  _renderRequestsView: function(convs) {
    const total = convs.length;
    const open = convs.filter(c => c.status === 'Open').length;
    const pending = convs.filter(c => c.status === 'Pending').length;
    const resolved = convs.filter(c => c.status === 'Resolved').length;

    const search = AdminComponent._reqSearch || '';
    const status = AdminComponent._reqStatus || 'all';
    const category = AdminComponent._reqCategory || 'all';
    const priority = AdminComponent._reqPriority || 'all';
    const startDate = AdminComponent._reqStartDate || '';
    const endDate = AdminComponent._reqEndDate || '';

    let filtered = convs;
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(c => c.student_username.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
    }
    if (status !== 'all') {
      filtered = filtered.filter(c => c.status.toLowerCase() === status);
    }
    if (category !== 'all') {
      filtered = filtered.filter(c => c.category === category);
    }
    if (priority !== 'all') {
      filtered = filtered.filter(c => c.priority === priority);
    }
    if (startDate) {
      filtered = filtered.filter(c => new Date(c.created_at) >= new Date(startDate));
    }
    if (endDate) {
      const nextDay = new Date(endDate);
      nextDay.setDate(nextDay.getDate() + 1);
      filtered = filtered.filter(c => new Date(c.created_at) < nextDay);
    }

    return `
      <div class="dashboard-welcome">
        <h1>Student Requests</h1>
        <p>Manage and respond to student support tickets.</p>
      </div>

      <div class="support-widgets-grid">
        <div class="widget-card"><div class="widget-icon blue"><i class="fa-solid fa-inbox"></i></div><div class="widget-number">${total}</div><div class="widget-label">Total Requests</div></div>
        <div class="widget-card"><div class="widget-icon red"><i class="fa-solid fa-envelope-open"></i></div><div class="widget-number">${open}</div><div class="widget-label">Open Requests</div></div>
        <div class="widget-card"><div class="widget-icon gold"><i class="fa-solid fa-hourglass-half"></i></div><div class="widget-number">${pending}</div><div class="widget-label">Pending Requests</div></div>
        <div class="widget-card"><div class="widget-icon green"><i class="fa-solid fa-circle-check"></i></div><div class="widget-number">${resolved}</div><div class="widget-label">Resolved Requests</div></div>
        <div class="widget-card"><div class="widget-icon purple"><i class="fa-solid fa-clock"></i></div><div class="widget-number" id="avg-response-time-val"><i class="fa-solid fa-spinner fa-spin" style="font-size:1.2rem;"></i></div><div class="widget-label">Avg. Response Time</div></div>
      </div>

      <div class="glass-panel" style="padding:20px;">
        <div style="display:grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap:16px; margin-bottom:16px;">
          <div class="form-group">
            <label style="font-size:0.78rem; font-weight:600; margin-bottom:4px; display:block;">Search</label>
            <div class="search-input-wrapper" style="width:100%; box-sizing:border-box;">
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
              <input id="req-search" placeholder="Search by student name or request ID..." value="${search}">
            </div>
          </div>
          <div class="form-group">
            <label style="font-size:0.78rem; font-weight:600; margin-bottom:4px; display:block;">Status</label>
            <select id="req-filter-status" style="width:100%; height:46px; padding:0 12px; border:1px solid var(--border-color); border-radius:var(--radius-md); background:var(--bg-primary); color:var(--text-primary);">
              <option value="all" ${status === 'all' ? 'selected' : ''}>All Statuses</option>
              <option value="open" ${status === 'open' ? 'selected' : ''}>Open</option>
              <option value="pending" ${status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="resolved" ${status === 'resolved' ? 'selected' : ''}>Resolved</option>
            </select>
          </div>
          <div class="form-group">
            <label style="font-size:0.78rem; font-weight:600; margin-bottom:4px; display:block;">Category</label>
            <select id="req-filter-category" style="width:100%; height:46px; padding:0 12px; border:1px solid var(--border-color); border-radius:var(--radius-md); background:var(--bg-primary); color:var(--text-primary);">
              <option value="all" ${category === 'all' ? 'selected' : ''}>All Categories</option>
              <option value="Technical Issue" ${category === 'Technical Issue' ? 'selected' : ''}>Technical Issue</option>
              <option value="Course Access" ${category === 'Course Access' ? 'selected' : ''}>Course Access</option>
              <option value="Payment" ${category === 'Payment' ? 'selected' : ''}>Payment</option>
              <option value="Live Class" ${category === 'Live Class' ? 'selected' : ''}>Live Class</option>
              <option value="Certificate" ${category === 'Certificate' ? 'selected' : ''}>Certificate</option>
              <option value="General Inquiry" ${category === 'General Inquiry' ? 'selected' : ''}>General Inquiry</option>
              <option value="Feature Request" ${category === 'Feature Request' ? 'selected' : ''}>Feature Request</option>
            </select>
          </div>
          <div class="form-group">
            <label style="font-size:0.78rem; font-weight:600; margin-bottom:4px; display:block;">Priority</label>
            <select id="req-filter-priority" style="width:100%; height:46px; padding:0 12px; border:1px solid var(--border-color); border-radius:var(--radius-md); background:var(--bg-primary); color:var(--text-primary);">
              <option value="all" ${priority === 'all' ? 'selected' : ''}>All Priorities</option>
              <option value="Low" ${priority === 'Low' ? 'selected' : ''}>Low</option>
              <option value="Medium" ${priority === 'Medium' ? 'selected' : ''}>Medium</option>
              <option value="High" ${priority === 'High' ? 'selected' : ''}>High</option>
            </select>
          </div>
        </div>

        <div style="display:flex; gap:16px; align-items:center;">
          <div class="form-group" style="display:flex; align-items:center; gap:8px; margin:0;">
            <span style="font-size:0.78rem; font-weight:600;">Date Range:</span>
            <input type="date" id="req-filter-start-date" value="${startDate}" style="padding:8px 12px; border:1px solid var(--border-color); border-radius:var(--radius-md); background:var(--bg-primary); color:var(--text-primary);">
            <span style="font-size:0.78rem; color:var(--text-muted);">to</span>
            <input type="date" id="req-filter-end-date" value="${endDate}" style="padding:8px 12px; border:1px solid var(--border-color); border-radius:var(--radius-md); background:var(--bg-primary); color:var(--text-primary);">
          </div>
          <button class="btn btn-outline-white btn-sm" id="btn-reset-req-filters" style="margin-left:auto;"><i class="fa-solid fa-arrow-rotate-left" style="margin-right:6px;"></i>Reset Filters</button>
        </div>
      </div>

      <div class="glass-panel" style="padding:0; overflow:hidden;">
        <table class="data-table" style="margin-bottom:0;">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Student Name</th>
              <th>Subject</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Last Reply</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length === 0 ? `
              <tr><td colspan="9" style="text-align:center; padding:32px; color:var(--text-muted);">No student requests found matching these filters.</td></tr>
            ` : filtered.map(c => {
              const relativeReply = DashboardComponent._getRelativeTime(c.last_reply_at);
              const createdDateStr = new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
              return `
                <tr style="${c.unread_by_admin ? 'background: rgba(61, 70, 216, 0.04); font-weight: 600;' : ''}">
                  <td style="font-family: monospace; font-size: 0.8rem; color: var(--text-secondary); max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    ${c.id}
                  </td>
                  <td>
                    <div style="font-weight: 700; color: var(--text-primary); font-size: 0.84rem;">@${c.student_username}</div>
                  </td>
                  <td style="max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${c.subject}">
                    ${c.subject}
                  </td>
                  <td>
                    <span class="support-cat-badge">${c.category}</span>
                  </td>
                  <td>
                    <span class="support-prio-badge ${c.priority.toLowerCase()}">${c.priority}</span>
                  </td>
                  <td>
                    <span class="status-badge ${c.status === 'Resolved' ? 'success' : c.status === 'Pending' ? 'pending' : 'danger'}">${c.status}</span>
                  </td>
                  <td style="font-size:0.8rem; color:var(--text-muted);">
                    ${relativeReply} ${c.last_reply_by === 'student' ? 'by Student' : 'by Admin'}
                  </td>
                  <td style="font-size:0.8rem; color:var(--text-muted);">
                    ${createdDateStr}
                  </td>
                  <td>
                    <button class="btn btn-outline-white btn-sm btn-adm-view-conv" data-conv-id="${c.id}" style="padding: 6px 12px; font-size:0.75rem;">
                      <i class="fa-solid fa-comments" style="color:var(--brand-blue); margin-right:6px;"></i>View
                      ${c.unread_by_admin ? `<span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#ef4444; margin-left:6px;"></span>` : ''}
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  _renderConversationView: async function(convId) {
    const convs = await window.db.getSupportConversations();
    const conv = convs.find(c => c.id === convId);
    if (!conv) return `<div class="alert alert-danger">Conversation not found.</div>`;

    const messages = await window.db.getSupportMessages(convId);
    const cu = window.db.getCurrentUser();

    return `
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
        <button class="btn btn-outline-white btn-sm" id="btn-back-to-requests" style="width:36px; height:36px; padding:0; border-radius:50%;"><i class="fa-solid fa-arrow-left"></i></button>
        <div>
          <h2 style="margin:0; font-weight:800; font-size:1.3rem;">Request Details</h2>
          <p style="margin:0; font-size:0.8rem; color:var(--text-muted);">ID: <span style="font-family:monospace;">${conv.id}</span> · Student: <strong>@${conv.student_username}</strong></p>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: 2fr 1fr; gap:24px; align-items: start;">
        <div class="support-chat-container">
          <div class="support-chat-header">
            <div class="support-chat-header-info">
              <h3 class="support-chat-title">${conv.subject}</h3>
              <div class="support-chat-meta">
                <span class="support-cat-badge">${conv.category}</span>
                <span class="support-prio-badge ${conv.priority.toLowerCase()}">${conv.priority}</span>
              </div>
            </div>
            <div>
              <select id="adm-chat-status-select" style="padding:6px 12px; font-size:0.82rem; font-weight:700; border-radius:var(--radius-md); border:1px solid var(--border-color); background:var(--bg-primary); color:var(--text-primary); cursor:pointer;">
                <option value="Open" ${conv.status === 'Open' ? 'selected' : ''}>Open</option>
                <option value="Pending" ${conv.status === 'Pending' ? 'selected' : ''}>Pending</option>
                <option value="Resolved" ${conv.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
              </select>
            </div>
          </div>

          <div class="support-chat-messages" id="support-chat-thread">
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
                    <div style="font-weight:600; font-size:0.75rem; opacity:0.8; margin-bottom:4px;">
                      ${m.is_internal ? '<i class="fa-solid fa-lock"></i> Internal Admin Note' : isStudent ? `@${conv.student_username} (Student)` : 'You (Admin)'}
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
                <input type="file" id="chat-upload-file">
              </div>
              <div id="chat-file-selected-chip" style="display:none;"></div>

              <div class="support-link-input-wrapper">
                <i class="fa-solid fa-link"></i>
                <input type="url" id="chat-external-link" placeholder="Cloud Storage File Link">
              </div>

              <label class="admin-note-switch">
                <input type="checkbox" id="chat-is-internal">
                <span>Internal Note</span>
              </label>
            </div>

            <div class="support-chat-input-row">
              <textarea class="support-chat-input-textarea" id="chat-message-text" placeholder="Type response or internal note..."></textarea>
              <button class="btn btn-primary" id="btn-send-message" style="height:48px; width:48px; padding:0; display:flex; align-items:center; justify-content:center; border-radius:var(--radius-lg); flex-shrink:0;"><i class="fa-solid fa-paper-plane" style="font-size:1rem;"></i></button>
            </div>
          </div>
        </div>

        <div class="glass-panel" style="padding:20px; display:flex; flex-direction:column; gap:16px;">
          <h3 style="margin:0 0 8px 0; font-weight:700; font-size:1rem; border-bottom:1px solid var(--border-color); padding-bottom:8px;">Conversation Info</h3>
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:2px;">Student Username</div>
            <div style="font-weight:700; font-size:0.86rem; color:var(--text-primary);">@${conv.student_username}</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:2px;">Subject</div>
            <div style="font-weight:600; font-size:0.86rem; color:var(--text-primary);">${conv.subject}</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:2px;">Priority</div>
            <div style="display:inline-block;"><span class="support-prio-badge ${conv.priority.toLowerCase()}">${conv.priority}</span></div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:2px;">Created Date</div>
            <div style="font-size:0.84rem; color:var(--text-secondary); font-weight:500;">${new Date(conv.created_at).toLocaleString('en-IN')}</div>
          </div>
          
          ${conv.status === 'Resolved' ? `
            <div style="border-top:1px solid var(--border-color); padding-top:14px; margin-top:8px;">
              <h4 style="margin:0 0 6px 0; font-weight:700; font-size:0.9rem; color:var(--success);">Feedback Summary</h4>
              ${conv.rating !== null && conv.rating !== undefined ? `
                <div style="margin-bottom:8px;">
                  <span style="font-size:0.75rem; color:var(--text-muted);">Rating:</span>
                  <span style="font-weight:700; color:#f59e0b;">${'★'.repeat(conv.rating)}${'☆'.repeat(5 - conv.rating)} (${conv.rating}/5)</span>
                </div>
                ${conv.feedback ? `
                  <div>
                    <span style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:4px;">Comment:</span>
                    <div style="font-size:0.8rem; background:var(--bg-primary); padding:10px; border-radius:6px; border:1px solid var(--border-color); font-style:italic; line-height:1.4;">"${conv.feedback}"</div>
                  </div>
                ` : ''}
              ` : `<span style="font-size:0.8rem; color:var(--text-muted); font-style:italic;">No student rating submitted yet.</span>`}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  _refreshChatMessagesOnly: async function(convId) {
    const thread = document.getElementById('support-chat-thread');
    if (!thread) return;

    try {
      const messages = await window.db.getSupportMessages(convId);
      const convs = await window.db.getSupportConversations();
      const conv = convs.find(c => c.id === convId);
      if (!conv) return;

      const cu = window.db.getCurrentUser();

      thread.innerHTML = messages.map(m => {
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
              <div style="font-weight:600; font-size:0.75rem; opacity:0.8; margin-bottom:4px;">
                ${m.is_internal ? '<i class="fa-solid fa-lock"></i> Internal Admin Note' : isStudent ? `@${conv.student_username} (Student)` : 'You (Admin)'}
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
      console.error("Error refreshing chat messages:", err);
    }
  },

  _calculateAvgResponseTime: async function(convs) {
    const el = document.getElementById('avg-response-time-val');
    if (!el) return;

    try {
      let totalMs = 0;
      let count = 0;
      for (const c of convs) {
        const msgs = await window.db.getSupportMessages(c.id);
        const firstAdminReply = msgs.find(m => m.sender !== c.student_username && !m.is_internal);
        if (firstAdminReply) {
          const diff = new Date(firstAdminReply.created_at) - new Date(c.created_at);
          totalMs += diff;
          count++;
        }
      }
      if (count === 0) {
        el.textContent = 'N/A';
        return;
      }
      const avgHrs = totalMs / (1000 * 60 * 60 * count);
      if (avgHrs < 1) {
        const avgMins = Math.round(avgHrs * 60);
        el.textContent = `${avgMins}m`;
      } else {
        el.textContent = `${avgHrs.toFixed(1)}h`;
      }
    } catch(err) {
      console.error(err);
      el.textContent = 'Error';
    }
  },

  _bindRequestsEvents: function(convs) {
    AdminComponent._calculateAvgResponseTime(convs);

    const searchInput = document.getElementById('req-search');
    const statusSelect = document.getElementById('req-filter-status');
    const categorySelect = document.getElementById('req-filter-category');
    const prioritySelect = document.getElementById('req-filter-priority');
    const startDateInput = document.getElementById('req-filter-start-date');
    const endDateInput = document.getElementById('req-filter-end-date');

    const handleFilterChange = () => {
      AdminComponent._reqSearch = searchInput ? searchInput.value : '';
      AdminComponent._reqStatus = statusSelect ? statusSelect.value : 'all';
      AdminComponent._reqCategory = categorySelect ? categorySelect.value : 'all';
      AdminComponent._reqPriority = prioritySelect ? prioritySelect.value : 'all';
      AdminComponent._reqStartDate = startDateInput ? startDateInput.value : '';
      AdminComponent._reqEndDate = endDateInput ? endDateInput.value : '';
      AdminComponent._loadAndRenderRequests();
    };

    searchInput?.addEventListener('input', handleFilterChange);
    statusSelect?.addEventListener('change', handleFilterChange);
    categorySelect?.addEventListener('change', handleFilterChange);
    prioritySelect?.addEventListener('change', handleFilterChange);
    startDateInput?.addEventListener('change', handleFilterChange);
    endDateInput?.addEventListener('change', handleFilterChange);

    document.getElementById('btn-reset-req-filters')?.addEventListener('click', () => {
      AdminComponent._reqSearch = '';
      AdminComponent._reqStatus = 'all';
      AdminComponent._reqCategory = 'all';
      AdminComponent._reqPriority = 'all';
      AdminComponent._reqStartDate = '';
      AdminComponent._reqEndDate = '';
      AdminComponent._loadAndRenderRequests();
    });

    document.querySelectorAll('.btn-adm-view-conv').forEach(btn => {
      btn.addEventListener('click', () => {
        AdminComponent._activeConvId = btn.getAttribute('data-conv-id');
        AdminComponent._loadAndRenderRequests();
      });
    });
  },

  _bindConversationEvents: function(convId) {
    document.getElementById('btn-back-to-requests')?.addEventListener('click', () => {
      AdminComponent._activeConvId = null;
      AdminComponent._loadAndRenderRequests();
    });

    const thread = document.getElementById('support-chat-thread');
    if (thread) {
      thread.scrollTop = thread.scrollHeight;
    }

    document.getElementById('adm-chat-status-select')?.addEventListener('change', async (e) => {
      const newStatus = e.target.value;
      const res = await window.db.markConversationStatus(convId, newStatus);
      if (res.success) {
        window.app.showToast(`Conversation status marked as ${newStatus}`, 'success');
        AdminComponent._loadAndRenderRequests();
      } else {
        window.app.showToast(res.error || "Failed to update status", "danger");
      }
    });

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
    const internalCheckbox = document.getElementById('chat-is-internal');

    const handleSend = async () => {
      const text = msgTextarea ? msgTextarea.value.trim() : '';
      const extLink = extLinkInput ? extLinkInput.value.trim() : '';
      const isInternal = internalCheckbox ? internalCheckbox.checked : false;

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

        const res = await window.db.sendSupportMessage(convId, text, fileData, extLink, isInternal);
        if (res.success) {
          if (msgTextarea) msgTextarea.value = '';
          if (extLinkInput) extLinkInput.value = '';
          if (internalCheckbox) internalCheckbox.checked = false;
          chatSelectedFile = null;
          if (fileInput) fileInput.value = '';
          if (chip) chip.style.display = 'none';
          
          AdminComponent._loadAndRenderRequests();
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
  },

  _renderCommonMeetings: function(searchQuery = '') {
    const meetings = window.db.getCommonMeetings();
    const courses = window.db.getCourses();
    const batches = window.db.getBatches();
    
    const filtered = meetings.filter(m => {
      if (!searchQuery) return true;
      return m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.hostName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return `
      <div class="dashboard-welcome" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
        <div>
          <h1>Common Meetings</h1>
          <p>Academy-wide events, webinars, orientations, and community announcements.</p>
        </div>
        <button class="btn btn-primary" id="btn-add-common-meeting"><i class="fa-solid fa-plus"></i> Create Common Meeting</button>
      </div>

      <div class="glass-panel" style="padding: 20px;">
        <div style="display:flex; gap:16px; margin-bottom:20px; align-items:center;">
          <div style="position:relative; flex:1;">
            <input type="text" id="cm-search-input" placeholder="Search by title or host..." value="${searchQuery}" style="width:100%; height:42px; padding:0 12px 0 36px; border-radius:10px; border:1.5px solid var(--border-color); background:var(--bg-primary); color:var(--text-primary); outline:none; font-family:inherit;">
            <i class="fa-solid fa-magnifying-glass" style="position:absolute; left:12px; top:13px; color:var(--text-muted);"></i>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Meeting Info</th>
              <th>Host</th>
              <th>Date & Time</th>
              <th>Access Scope</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(m => {
              let scopeText = '';
              const scopeType = m.access.type;
              if (scopeType === 'everyone') scopeText = 'Everyone';
              else if (scopeType === 'all_students') scopeText = 'All Students';
              else if (scopeType === 'all_tutors') scopeText = 'All Tutors';
              else if (scopeType === 'all_students_tutors') scopeText = 'All Students & Tutors';
              else if (scopeType === 'admission_counselors') scopeText = 'Admission Counselors';
              else if (scopeType === 'selected_courses') {
                const cTitles = (m.access.courseIds || []).map(cid => {
                  const c = courses.find(x => x.id === cid);
                  return c ? c.title : cid;
                }).join(', ');
                scopeText = `<span title="${cTitles}">Selected Courses (${(m.access.courseIds || []).length})</span>`;
              } else if (scopeType === 'selected_batches') {
                const bNames = (m.access.batchIds || []).map(bid => {
                  const b = batches.find(x => x.id === bid);
                  return b ? b.name : bid;
                }).join(', ');
                scopeText = `<span title="${bNames}">Selected Batches (${(m.access.batchIds || []).length})</span>`;
              }

              let statusClass = 'warning';
              if (m.status === 'Live Now') statusClass = 'success';
              else if (m.status === 'Completed') statusClass = 'info';
              else if (m.status === 'Cancelled') statusClass = 'danger';

              return `
                <tr>
                  <td style="text-align:left;">
                    <div style="font-weight:700; color:var(--text-primary);">${m.title}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted); max-width:280px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${m.description || 'No description'}</div>
                  </td>
                  <td style="text-align:left; font-weight:600;">${m.hostName}</td>
                  <td style="text-align:left;">
                    <div style="font-weight:600; font-size:0.8rem;">${m.date}</div>
                    <div style="font-size:0.75rem; color:var(--text-secondary);">${m.startTime} - ${m.endTime}</div>
                  </td>
                  <td style="text-align:left; font-size:0.8rem;">${scopeText}</td>
                  <td><span class="status-badge ${statusClass}">${m.status}</span></td>
                  <td>
                    <div class="adm-action-wrap" style="position:relative; display:inline-block;">
                      <button class="btn btn-outline-white btn-xs btn-cm-action-trigger" data-cm-id="${m.id}" style="margin:0; padding:6px 12px;"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                      <div class="adm-action-menu" id="cm-menu-${m.id}" style="position:absolute; right:0; top:32px; background:var(--bg-card); border:1px solid var(--border-color); border-radius:8px; box-shadow:var(--shadow-lg); z-index:100; display:none; flex-direction:column; min-width:140px; padding:4px 0;">
                        <button class="adm-action-item btn-cm-edit" data-cm-id="${m.id}"><i class="fa-solid fa-pen"></i> Edit</button>
                        <button class="adm-action-item btn-cm-duplicate" data-cm-id="${m.id}"><i class="fa-solid fa-copy"></i> Duplicate</button>
                        ${m.status !== 'Completed' ? `<button class="adm-action-item btn-cm-end" data-cm-id="${m.id}" style="color:var(--brand-blue);"><i class="fa-solid fa-circle-stop"></i> End</button>` : ''}
                        <button class="adm-action-item btn-cm-delete" data-cm-id="${m.id}" style="color:var(--danger);"><i class="fa-solid fa-trash"></i> Delete</button>
                      </div>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
            ${filtered.length === 0 ? '<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:30px;">No common meetings found.</td></tr>' : ''}
          </tbody>
        </table>
      </div>
    `;
  },

  _renderCommonMeetingForm: function(meeting = null) {
    const courses = window.db.getCourses();
    const batches = window.db.getBatches();
    const isEdit = !!meeting;
    
    const scopeType = meeting ? meeting.access.type : 'everyone';
    const selectedCourses = meeting ? (meeting.access.courseIds || []) : [];
    const selectedBatches = meeting ? (meeting.access.batchIds || []) : [];

    const overlay = document.createElement('div');
    overlay.className = 'adm-modal-overlay';
    overlay.id = 'common-meeting-modal';
    
    overlay.innerHTML = `
      <div class="adm-modal" style="max-width: 680px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 24px; text-align: left; background:var(--bg-card); color:var(--text-primary); border-radius:var(--radius-xl); border:1px solid var(--border-color);">
        <h3 style="margin-top:0; font-weight:800; font-size:1.2rem; margin-bottom:16px;">
          ${isEdit ? '<i class="fa-solid fa-pen" style="color:var(--brand-blue); margin-right:8px;"></i>Edit Common Meeting' : '<i class="fa-solid fa-plus" style="color:var(--brand-blue); margin-right:8px;"></i>Create Common Meeting'}
        </h3>
        
        <form id="form-common-meeting">
          <input type="hidden" id="cmf-id" value="${meeting ? meeting.id : ''}">
          
          <div class="form-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
            <div class="form-group" style="grid-column: 1 / -1;">
              <label style="font-weight:600; font-size:0.8rem; display:block; margin-bottom:4px;">Meeting Title *</label>
              <input type="text" id="cmf-title" class="form-control" required placeholder="e.g. Orientation & Welcome Webinar" value="${meeting ? meeting.title : ''}" style="width:100%; box-sizing:border-box;">
            </div>
            
            <div class="form-group" style="grid-column: 1 / -1;">
              <label style="font-weight:600; font-size:0.8rem; display:block; margin-bottom:4px;">Description *</label>
              <textarea id="cmf-desc" class="form-control" required rows="3" placeholder="Explain the agenda of this meeting..." style="width:100%; box-sizing:border-box; font-family:inherit; resize:vertical;">${meeting ? meeting.description : ''}</textarea>
            </div>

            <div class="form-group">
              <label style="font-weight:600; font-size:0.8rem; display:block; margin-bottom:4px;">Google Meet Link *</label>
              <input type="url" id="cmf-meet-link" class="form-control" required placeholder="https://meet.google.com/..." value="${meeting ? meeting.meetLink : ''}" style="width:100%; box-sizing:border-box;">
            </div>

            <div class="form-group">
              <label style="font-weight:600; font-size:0.8rem; display:block; margin-bottom:4px;">Host Name *</label>
              <input type="text" id="cmf-host" class="form-control" required placeholder="e.g. Director Admin" value="${meeting ? meeting.hostName : ''}" style="width:100%; box-sizing:border-box;">
            </div>

            <div class="form-group">
              <label style="font-weight:600; font-size:0.8rem; display:block; margin-bottom:4px;">Meeting Date *</label>
              <input type="date" id="cmf-date" class="form-control" required value="${meeting ? meeting.date : ''}" style="width:100%; box-sizing:border-box;">
            </div>

            <div class="form-group" style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <div>
                <label style="font-weight:600; font-size:0.8rem; display:block; margin-bottom:4px;">Start Time *</label>
                <input type="time" id="cmf-start" class="form-control" required value="${meeting ? meeting.startTime : ''}" style="width:100%; box-sizing:border-box;">
              </div>
              <div>
                <label style="font-weight:600; font-size:0.8rem; display:block; margin-bottom:4px;">End Time *</label>
                <input type="time" id="cmf-end" class="form-control" required value="${meeting ? meeting.endTime : ''}" style="width:100%; box-sizing:border-box;">
              </div>
            </div>

            <div class="form-group">
              <label style="font-weight:600; font-size:0.8rem; display:block; margin-bottom:4px;">Banner Image URL (Optional)</label>
              <input type="url" id="cmf-banner" class="form-control" placeholder="https://..." value="${meeting ? (meeting.bannerImage || '') : ''}" style="width:100%; box-sizing:border-box;">
            </div>

            <div class="form-group">
              <label style="font-weight:600; font-size:0.8rem; display:block; margin-bottom:4px;">Meeting Status *</label>
              <select id="cmf-status" class="form-control" required style="width:100%; box-sizing:border-box; cursor:pointer;">
                ${['Upcoming', 'Live Now', 'Completed', 'Cancelled'].map(s => `<option value="${s}" ${meeting && meeting.status === s ? 'selected' : ''}>${s}</option>`).join('')}
              </select>
            </div>
            
            <div class="form-group">
              <label style="font-weight:600; font-size:0.8rem; display:block; margin-bottom:4px;">Target Access *</label>
              <select id="cmf-access-type" class="form-control" required style="width:100%; box-sizing:border-box; cursor:pointer;">
                <option value="everyone" ${scopeType === 'everyone' ? 'selected' : ''}>Everyone</option>
                <option value="all_students" ${scopeType === 'all_students' ? 'selected' : ''}>All Students</option>
                <option value="all_tutors" ${scopeType === 'all_tutors' ? 'selected' : ''}>All Tutors</option>
                <option value="all_students_tutors" ${scopeType === 'all_students_tutors' ? 'selected' : ''}>All Students & Tutors</option>
                <option value="selected_courses" ${scopeType === 'selected_courses' ? 'selected' : ''}>Selected Courses</option>
                <option value="selected_batches" ${scopeType === 'selected_batches' ? 'selected' : ''}>Selected Batches</option>
                <option value="admission_counselors" ${scopeType === 'admission_counselors' ? 'selected' : ''}>Admission Counselors</option>
              </select>
            </div>

            <div class="form-group">
              <label style="font-weight:600; font-size:0.8rem; display:block; margin-bottom:4px;">Meeting Password (Optional)</label>
              <input type="text" id="cmf-password" class="form-control" placeholder="e.g. 123456" value="${meeting ? (meeting.password || '') : ''}" style="width:100%; box-sizing:border-box;">
            </div>

            <div class="form-group">
              <label style="font-weight:600; font-size:0.8rem; display:block; margin-bottom:4px;">Recording Link (Optional)</label>
              <input type="url" id="cmf-recording" class="form-control" placeholder="https://..." value="${meeting ? (meeting.recordingLink || '') : ''}" style="width:100%; box-sizing:border-box;">
            </div>

            <div class="form-group">
              <label style="font-weight:600; font-size:0.8rem; display:block; margin-bottom:4px;">Google Drive Resources (Optional)</label>
              <input type="url" id="cmf-resources" class="form-control" placeholder="https://drive.google.com/..." value="${meeting ? (meeting.googleDriveResources || '') : ''}" style="width:100%; box-sizing:border-box;">
            </div>
            
            <div class="form-group" style="grid-column: 1 / -1;">
              <label style="font-weight:600; font-size:0.8rem; display:block; margin-bottom:4px;">Meeting Notes (Optional)</label>
              <textarea id="cmf-notes" class="form-control" rows="2" placeholder="e.g. Important guidelines, prerequisites..." style="width:100%; box-sizing:border-box; font-family:inherit; resize:vertical;">${meeting ? (meeting.notes || '') : ''}</textarea>
            </div>
          </div>

          <!-- Dynamic selection sections -->
          <div id="cmf-courses-selection" class="glass-panel" style="padding: 16px; margin-bottom:16px; display: ${scopeType === 'selected_courses' ? 'block' : 'none'}; text-align: left; background:var(--bg-secondary); border:1px solid var(--border-color);">
            <h4 style="margin:0 0 10px 0; font-size:0.85rem; font-weight:700;">Select Eligible Courses:</h4>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              ${courses.map(c => `
                <label style="display:flex; align-items:center; gap:6px; font-size:0.8rem; cursor:pointer;">
                  <input type="checkbox" class="cmf-courses-cb" value="${c.id}" ${selectedCourses.includes(c.id) ? 'checked' : ''}>
                  <span>${c.title}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <div id="cmf-batches-selection" class="glass-panel" style="padding: 16px; margin-bottom:16px; display: ${scopeType === 'selected_batches' ? 'block' : 'none'}; text-align: left; background:var(--bg-secondary); border:1px solid var(--border-color);">
            <h4 style="margin:0 0 10px 0; font-size:0.85rem; font-weight:700;">Select Eligible Batches:</h4>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              ${batches.map(b => `
                <label style="display:flex; align-items:center; gap:6px; font-size:0.8rem; cursor:pointer;">
                  <input type="checkbox" class="cmf-batches-cb" value="${b.id}" ${selectedBatches.includes(b.id) ? 'checked' : ''}>
                  <span>${b.name}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:20px;">
            <button type="button" class="btn btn-outline-white" id="btn-cmf-cancel" style="margin-bottom:0;">Cancel</button>
            <button type="submit" class="btn btn-primary" style="margin-bottom:0;">Save Meeting</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    // Bind dynamic display logic
    document.getElementById('cmf-access-type').addEventListener('change', e => {
      const val = e.target.value;
      document.getElementById('cmf-courses-selection').style.display = val === 'selected_courses' ? 'block' : 'none';
      document.getElementById('cmf-batches-selection').style.display = val === 'selected_batches' ? 'block' : 'none';
    });

    document.getElementById('btn-cmf-cancel').addEventListener('click', () => {
      overlay.remove();
    });

    document.getElementById('form-common-meeting').addEventListener('submit', e => {
      e.preventDefault();
      const id = document.getElementById('cmf-id').value;
      const title = document.getElementById('cmf-title').value.trim();
      const description = document.getElementById('cmf-desc').value.trim();
      const meetLink = document.getElementById('cmf-meet-link').value.trim();
      const hostName = document.getElementById('cmf-host').value.trim();
      const date = document.getElementById('cmf-date').value;
      const startTime = document.getElementById('cmf-start').value;
      const endTime = document.getElementById('cmf-end').value;
      const bannerImage = document.getElementById('cmf-banner').value.trim();
      const status = document.getElementById('cmf-status').value;
      const accessType = document.getElementById('cmf-access-type').value;
      const password = document.getElementById('cmf-password').value.trim();
      const recordingLink = document.getElementById('cmf-recording').value.trim();
      const googleDriveResources = document.getElementById('cmf-resources').value.trim();
      const notes = document.getElementById('cmf-notes').value.trim();

      const courseIds = [...document.querySelectorAll('.cmf-courses-cb:checked')].map(cb => cb.value);
      const batchIds = [...document.querySelectorAll('.cmf-batches-cb:checked')].map(cb => cb.value);

      if (accessType === 'selected_courses' && courseIds.length === 0) {
        window.app.showToast('Please select at least one course.', 'danger');
        return;
      }

      if (accessType === 'selected_batches' && batchIds.length === 0) {
        window.app.showToast('Please select at least one batch.', 'danger');
        return;
      }

      const meetingData = {
        id: id || `CM-${Math.floor(100000 + Math.random() * 900000)}`,
        title,
        description,
        meetLink,
        hostName,
        date,
        startTime,
        endTime,
        bannerImage,
        status,
        access: {
          type: accessType,
          courseIds,
          batchIds
        },
        password,
        recordingLink,
        googleDriveResources,
        notes
      };

      const res = window.db.saveCommonMeeting(meetingData);
      if (res.success) {
        window.app.showToast('Common Meeting saved successfully! 🗓️', 'success');
        overlay.remove();
        document.getElementById('adm-main').innerHTML = AdminComponent._renderCommonMeetings();
        AdminComponent._bindSection('common_meeting');
      } else {
        window.app.showToast(res.error || 'Failed to save meeting.', 'danger');
      }
    });
  },

  _bindCommonMeetingsEvents: function() {
    document.getElementById('cm-search-input')?.addEventListener('input', e => {
      document.getElementById('adm-main').innerHTML = AdminComponent._renderCommonMeetings(e.target.value);
      AdminComponent._bindSection('common_meeting');
    });

    document.getElementById('btn-add-common-meeting')?.addEventListener('click', () => {
      AdminComponent._renderCommonMeetingForm();
    });

    document.querySelectorAll('.btn-cm-action-trigger').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const cmId = btn.getAttribute('data-cm-id');
        const menu = document.getElementById(`cm-menu-${cmId}`);
        document.querySelectorAll('.adm-action-menu').forEach(m => {
          if (m.id !== `cm-menu-${cmId}`) {
            m.classList.remove('open');
            m.style.display = 'none';
          }
        });
        if (menu) {
          if (menu.style.display === 'flex') {
            menu.classList.remove('open');
            menu.style.display = 'none';
          } else {
            menu.classList.add('open');
            menu.style.display = 'flex';
          }
        }
      });
    });

    document.querySelectorAll('.btn-cm-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmId = btn.getAttribute('data-cm-id');
        const meeting = window.db.getCommonMeetingById(cmId);
        if (meeting) AdminComponent._renderCommonMeetingForm(meeting);
      });
    });

    document.querySelectorAll('.btn-cm-duplicate').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmId = btn.getAttribute('data-cm-id');
        const res = window.db.duplicateCommonMeeting(cmId);
        if (res.success) {
          window.app.showToast('Meeting duplicated successfully! 📋', 'success');
          document.getElementById('adm-main').innerHTML = AdminComponent._renderCommonMeetings();
          AdminComponent._bindSection('common_meeting');
        } else {
          window.app.showToast(res.error || 'Failed to duplicate meeting.', 'danger');
        }
      });
    });

    document.querySelectorAll('.btn-cm-end').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmId = btn.getAttribute('data-cm-id');
        const meeting = window.db.getCommonMeetingById(cmId);
        if (meeting) {
          meeting.status = 'Completed';
          const res = window.db.saveCommonMeeting(meeting);
          if (res.success) {
            window.app.showToast('Meeting ended successfully! 🛑', 'success');
            document.getElementById('adm-main').innerHTML = AdminComponent._renderCommonMeetings();
            AdminComponent._bindSection('common_meeting');
          } else {
            window.app.showToast(res.error || 'Failed to end meeting.', 'danger');
          }
        }
      });
    });

    document.querySelectorAll('.btn-cm-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmId = btn.getAttribute('data-cm-id');
        if (confirm('Are you sure you want to delete this meeting? This cannot be undone.')) {
          const res = window.db.deleteCommonMeeting(cmId);
          if (res.success) {
            window.app.showToast('Meeting deleted successfully.', 'warning');
            document.getElementById('adm-main').innerHTML = AdminComponent._renderCommonMeetings();
            AdminComponent._bindSection('common_meeting');
          } else {
            window.app.showToast(res.error || 'Failed to delete meeting.', 'danger');
          }
        }
      });
    });
  }
};

window.AdminComponent = AdminComponent;

// Close all admin action menus when clicking outside
document.addEventListener('click', function(e) {
  if (!e.target.closest('.adm-action-wrap')) {
    document.querySelectorAll('.adm-action-menu.open').forEach(m => {
      m.classList.remove('open');
      m.style.transform = '';
    });
  }
});

// Close all admin action menus on scroll to prevent floating detached menus
document.addEventListener('scroll', function() {
  document.querySelectorAll('.adm-action-menu.open').forEach(m => {
    m.classList.remove('open');
    m.style.transform = '';
  });
}, true);

