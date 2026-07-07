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
      { title: 'People', items: [['students','fa-users','Students'],['tutors','fa-chalkboard-user','Tutors']] },
      { title: 'Content', items: [['courses','fa-book-open','Courses'],['submissions','fa-inbox','Submissions'],['blog','fa-newspaper','Blog'],['reviews','fa-star','Reviews'],['coupons','fa-tag','Coupons']] },
      { title: 'Finance', items: [['payments','fa-credit-card','Payments']] },
      { title: 'System', items: [['settings','fa-gear','Settings']] }
    ];

    return `
    <style>
      /* ─── ADMIN SHELL ─── */
      .adm-shell { display:flex; min-height:calc(100vh - var(--header-height)); background:#F1F5F9; font-family:'Inter','Outfit',sans-serif; }

      /* Sidebar */
      .adm-sidebar { width:240px; flex-shrink:0; background:#0F172A; display:flex; flex-direction:column; height:calc(100vh - var(--header-height)); position:sticky; top:var(--header-height); overflow-y:auto; }
      .adm-sb-brand { padding:24px 20px 16px; border-bottom:1px solid rgba(255,255,255,0.06); }
      .adm-sb-brand h4 { color:#F1F5F9; font-size:0.92rem; font-weight:800; margin-bottom:2px; }
      .adm-sb-brand p { color:#64748B; font-size:0.72rem; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; }
      .adm-nav-group { padding:12px 10px 4px; }
      .adm-nav-label { font-size:0.67rem; font-weight:700; color:#475569; text-transform:uppercase; letter-spacing:0.09em; padding:0 10px; margin-bottom:4px; }
      .adm-nav-item { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:9px; cursor:pointer; color:#94A3B8; font-size:0.83rem; font-weight:500; transition:all 0.18s; margin-bottom:2px; user-select:none; }
      .adm-nav-item i { width:16px; text-align:center; font-size:0.82rem; }
      .adm-nav-item:hover { background:rgba(255,255,255,0.05); color:#E2E8F0; }
      .adm-nav-item.active { background:rgba(61,70,216,0.22); color:#818CF8; font-weight:700; }
      .adm-sb-foot { margin-top:auto; padding:14px 10px; border-top:1px solid rgba(255,255,255,0.06); display:flex; flex-direction:column; gap:4px; }
      .adm-sb-foot a, .adm-sb-foot button { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:9px; color:#94A3B8; font-size:0.82rem; font-weight:500; text-decoration:none; background:transparent; border:none; cursor:pointer; transition:all 0.18s; width:100%; font-family:inherit; }
      .adm-sb-foot a:hover, .adm-sb-foot button:hover { background:rgba(255,255,255,0.05); color:#E2E8F0; }

      /* Main area */
      .adm-main { flex:1; overflow-y:auto; padding:32px 36px; }
      .adm-page-header { margin-bottom:24px; }
      .adm-page-header h1 { font-size:1.5rem; font-weight:800; color:#0F172A; margin-bottom:4px; }
      .adm-page-header p { font-size:0.83rem; color:#64748B; }

      /* Cards */
      .adm-stat-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:14px; margin-bottom:24px; }
      .adm-stat { background:#fff; border-radius:14px; padding:18px 20px; display:flex; align-items:center; gap:14px; box-shadow:0 1px 6px rgba(0,0,0,0.04); border:1px solid rgba(0,0,0,0.03); }
      .adm-stat-ico { width:40px; height:40px; border-radius:11px; display:flex; align-items:center; justify-content:center; font-size:1.05rem; flex-shrink:0; }
      .ico-blue{background:#EFF2FE;color:#3D46D8;} .ico-green{background:#ECFDF5;color:#059669;} .ico-gold{background:#FFFBEB;color:#D97706;} .ico-red{background:#FEF2F2;color:#DC2626;} .ico-purple{background:#F5F3FF;color:#7C3AED;} .ico-gray{background:#F1F5F9;color:#475569;}
      .adm-stat-val { font-size:1.4rem; font-weight:800; color:#0F172A; line-height:1; margin-bottom:3px; }
      .adm-stat-lbl { font-size:0.7rem; text-transform:uppercase; letter-spacing:0.05em; color:#94A3B8; font-weight:700; }

      /* Panel */
      .adm-panel { background:#fff; border-radius:16px; box-shadow:0 1px 6px rgba(0,0,0,0.04); border:1px solid rgba(0,0,0,0.03); overflow:hidden; margin-bottom:20px; }
      .adm-panel-head { display:flex; align-items:center; justify-content:space-between; padding:16px 22px; border-bottom:1px solid #F1F5F9; flex-wrap:wrap; gap:10px; }
      .adm-panel-title { font-size:0.9rem; font-weight:700; color:#0F172A; }
      .adm-panel-actions { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }

      /* Tables */
      .adm-table { width:100%; border-collapse:collapse; font-size:0.82rem; }
      .adm-table thead th { background:#F8FAFC; padding:11px 16px; text-align:left; font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:#64748B; white-space:nowrap; border-bottom:1px solid #F1F5F9; }
      .adm-table tbody td { padding:13px 16px; border-bottom:1px solid #F8FAFC; color:#374151; vertical-align:middle; }
      .adm-table tbody tr:hover td { background:#FAFBFF; }
      .adm-table tbody tr:last-child td { border-bottom:none; }

      /* Inputs */
      .adm-input { padding:8px 12px; border:1.5px solid #E2E8F0; border-radius:9px; font-size:0.83rem; color:#0F172A; background:#fff; font-family:inherit; outline:none; transition:border-color 0.18s; }
      .adm-input:focus { border-color:#3D46D8; }
      .adm-select { padding:8px 12px; border:1.5px solid #E2E8F0; border-radius:9px; font-size:0.83rem; color:#0F172A; background:#fff; font-family:inherit; outline:none; cursor:pointer; }
      .adm-textarea { width:100%; padding:10px 12px; border:1.5px solid #E2E8F0; border-radius:9px; font-size:0.83rem; color:#0F172A; background:#fff; font-family:inherit; outline:none; resize:vertical; box-sizing:border-box; }
      .adm-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
      .adm-form-group { display:flex; flex-direction:column; gap:5px; }
      .adm-form-group label { font-size:0.73rem; font-weight:700; color:#374151; }

      /* Buttons */
      .adm-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:9px; font-size:0.82rem; font-weight:700; cursor:pointer; border:none; font-family:inherit; transition:all 0.18s; white-space:nowrap; }
      .adm-btn-primary { background:linear-gradient(135deg,#3D46D8,#6366F1); color:#fff; }
      .adm-btn-primary:hover { opacity:0.88; }
      .adm-btn-secondary { background:#F1F5F9; color:#374151; border:1.5px solid #E2E8F0; }
      .adm-btn-secondary:hover { background:#E2E8F0; }
      .adm-btn-danger { background:#FEF2F2; color:#DC2626; border:1.5px solid #FECACA; }
      .adm-btn-danger:hover { background:#DC2626; color:#fff; }
      .adm-btn-success { background:#ECFDF5; color:#059669; border:1.5px solid #A7F3D0; }
      .adm-btn-success:hover { background:#059669; color:#fff; }
      .adm-btn-sm { padding:5px 11px; font-size:0.75rem; border-radius:7px; }
      .adm-btn-xs { padding:3px 9px; font-size:0.72rem; border-radius:6px; }
      .adm-btn-icon { width:30px; height:30px; border-radius:8px; padding:0; display:inline-flex; align-items:center; justify-content:center; }

      /* Status badges */
      .adm-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:20px; font-size:0.72rem; font-weight:700; white-space:nowrap; }
      .badge-success { background:#ECFDF5; color:#059669; }
      .badge-pending { background:#FFFBEB; color:#D97706; animation:pulse-gold 2s infinite; }
      .badge-denied  { background:#FEF2F2; color:#DC2626; }
      .badge-draft   { background:#F1F5F9; color:#64748B; }
      .badge-active  { background:#ECFDF5; color:#059669; }
      .badge-suspended { background:#FEF2F2; color:#DC2626; }
      .badge-published { background:#EFF2FE; color:#3D46D8; }
      .badge-archived  { background:#F1F5F9; color:#94A3B8; }
      @keyframes pulse-gold { 0%,100%{opacity:1} 50%{opacity:0.6} }

      /* Action dropdown */
      .adm-action-wrap { position:relative; display:inline-block; }
      .adm-action-menu { display:none; position:absolute; right:0; top:calc(100% + 4px); background:#fff; border:1.5px solid #E2E8F0; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.12); z-index:999; min-width:160px; padding:6px; }
      .adm-action-wrap:hover .adm-action-menu,
      .adm-action-menu.open { display:block; }
      .adm-action-menu button { display:flex; align-items:center; gap:9px; width:100%; padding:8px 12px; border:none; background:transparent; text-align:left; font-size:0.8rem; color:#374151; font-family:inherit; cursor:pointer; border-radius:8px; transition:background 0.15s; }
      .adm-action-menu button:hover { background:#F8FAFC; }
      .adm-action-menu button.danger { color:#DC2626; }
      .adm-action-menu button.danger:hover { background:#FEF2F2; }
      .adm-action-menu .adm-menu-divider { height:1px; background:#F1F5F9; margin:4px 0; }

      /* Payment status inline selector */
      .pay-status-select { padding:4px 8px; border-radius:20px; font-size:0.72rem; font-weight:700; border:none; cursor:pointer; font-family:inherit; outline:none; }
      .pss-approved { background:#ECFDF5; color:#059669; }
      .pss-pending  { background:#FFFBEB; color:#D97706; }
      .pss-denied   { background:#FEF2F2; color:#DC2626; }

      /* Revenue mini chart */
      .adm-chart-bars { display:flex; align-items:flex-end; gap:4px; height:64px; }
      .adm-chart-bar { flex:1; background:linear-gradient(180deg,#6366F1,#3D46D8); border-radius:4px 4px 0 0; min-height:4px; transition:height 0.3s; cursor:pointer; }
      .adm-chart-bar:hover { opacity:0.75; }

      /* Modal */
      .adm-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.4); z-index:2000; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(4px); }
      .adm-modal { background:#fff; border-radius:20px; padding:32px; max-width:600px; width:100%; max-height:80vh; overflow-y:auto; box-shadow:0 24px 64px rgba(0,0,0,0.18); }
      .adm-modal h3 { font-size:1.1rem; font-weight:800; color:#0F172A; margin-bottom:20px; }

      @media(max-width:900px){.adm-sidebar{display:none;}.adm-main{padding:20px;}}
    </style>

    <div class="adm-shell">
      <aside class="adm-sidebar">
        <div class="adm-sb-brand">
          <h4>⚙️ Admin Panel</h4>
          <p>${cu.name}</p>
        </div>
        ${nav.map(g => `
          <div class="adm-nav-group">
            <div class="adm-nav-label">${g.title}</div>
            ${g.items.map(([tab, icon, label]) =>
              `<div class="adm-nav-item ${AdminComponent._sec === tab ? 'active' : ''}" data-adm-tab="${tab}">
                <i class="fa-solid ${icon}"></i>${label}
              </div>`
            ).join('')}
          </div>`).join('')}
        <div class="adm-sb-foot">
          <a href="#/tutor"><i class="fa-solid fa-chalkboard-user"></i>Tutor View</a>
          <a href="#/"><i class="fa-solid fa-globe"></i>View Website</a>
        </div>
      </aside>
      <main class="adm-main" id="adm-main">
        ${AdminComponent._renderSection(AdminComponent._sec)}
      </main>
    </div>`;
  },

  _renderSection: function(s) {
    switch(s) {
      case 'dashboard':   return AdminComponent._renderDashboard();
      case 'students':    return AdminComponent._renderStudents();
      case 'tutors':      return AdminComponent._renderTutors();
      case 'courses':     return AdminComponent._renderCourses();
      case 'payments':    return AdminComponent._renderPayments();
      case 'submissions': return AdminComponent._renderSubmissions();
      case 'coupons':     return AdminComponent._renderCoupons();
      case 'blog':        return AdminComponent._renderBlog();
      case 'reviews':     return AdminComponent._renderReviews();
      case 'activity':    return AdminComponent._renderActivity();
      case 'settings':    return AdminComponent._renderSettings();
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

    const stats = [
      { ico:'ico-blue',  icon:'fa-indian-rupee-sign', val:`₹${a.todayRevenue.toLocaleString('en-IN')}`,  lbl:"Today's Revenue" },
      { ico:'ico-green', icon:'fa-sack-dollar',        val:`₹${a.monthRevenue.toLocaleString('en-IN')}`,  lbl:"Total Revenue" },
      { ico:'ico-gold',  icon:'fa-hourglass-half',     val:a.pendingPayments,  lbl:"Pending Payments" },
      { ico:'ico-green', icon:'fa-circle-check',       val:a.approvedPayments, lbl:"Approved Payments" },
      { ico:'ico-red',   icon:'fa-circle-xmark',       val:a.deniedPayments,   lbl:"Denied Payments" },
      { ico:'ico-blue',  icon:'fa-users',              val:a.totalStudents,    lbl:"Total Students" },
      { ico:'ico-purple',icon:'fa-chalkboard-user',    val:a.totalTutors,      lbl:"Total Tutors" },
      { ico:'ico-gold',  icon:'fa-book-open',          val:a.totalCourses,     lbl:"Total Courses" },
      { ico:'ico-green', icon:'fa-bullseye',           val:a.publishedCourses, lbl:"Published" },
    ];

    return `
      <div class="adm-page-header">
        <h1>Admin Dashboard</h1>
        <p>${new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
      </div>

      ${a.pendingPayments > 0 ? `
        <div style="background:#FFFBEB;border:1.5px solid #FDE68A;border-radius:12px;padding:14px 20px;margin-bottom:20px;display:flex;align-items:center;gap:12px;">
          <i class="fa-solid fa-triangle-exclamation" style="color:#D97706;font-size:1.1rem;"></i>
          <div style="flex:1;font-size:0.85rem;color:#92400E;font-weight:600;">${a.pendingPayments} payment(s) awaiting your review.</div>
          <button class="adm-btn adm-btn-sm" style="background:#D97706;color:#fff;" onclick="AdminComponent._nav('payments')">Review Now</button>
        </div>` : ''}

      <div class="adm-stat-grid">
        ${stats.map(s => `
          <div class="adm-stat">
            <div class="adm-stat-ico ${s.ico}"><i class="fa-solid ${s.icon}"></i></div>
            <div><div class="adm-stat-val">${s.val}</div><div class="adm-stat-lbl">${s.lbl}</div></div>
          </div>`).join('')}
      </div>

      <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px;margin-bottom:20px;">
        <div class="adm-panel">
          <div class="adm-panel-head"><div class="adm-panel-title"><i class="fa-solid fa-chart-bar" style="color:#3D46D8;margin-right:7px;"></i>Revenue Chart (2026)</div></div>
          <div style="padding:20px 22px;">
            <div class="adm-chart-bars">
              ${revenueData.map((v,i) => `<div class="adm-chart-bar" style="height:${Math.round((v/maxR)*100)}%" title="${months[i]}: ₹${v.toLocaleString('en-IN')}"></div>`).join('')}
            </div>
            <div style="display:flex;gap:4px;margin-top:6px;">
              ${months.map(m => `<div style="flex:1;text-align:center;font-size:0.62rem;color:#94A3B8;font-weight:600;">${m}</div>`).join('')}
            </div>
          </div>
        </div>
        <div class="adm-panel">
          <div class="adm-panel-head"><div class="adm-panel-title"><i class="fa-solid fa-trophy" style="color:#D97706;margin-right:7px;"></i>Top Course</div></div>
          <div style="padding:20px 22px;">
            <div style="font-weight:700;font-size:0.88rem;color:#0F172A;margin-bottom:8px;">${a.popularCourse}</div>
            <div style="font-size:0.78rem;color:#64748B;margin-bottom:16px;">Most purchased this period</div>
            <div style="background:#EFF2FE;border-radius:10px;padding:10px 14px;font-size:0.78rem;color:#3D46D8;font-weight:600;"><i class="fa-solid fa-fire"></i> Best Seller</div>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
        <div class="adm-panel">
          <div class="adm-panel-head">
            <div class="adm-panel-title"><i class="fa-solid fa-credit-card" style="color:#3D46D8;margin-right:7px;"></i>Recent Payments</div>
            <button class="adm-btn adm-btn-secondary adm-btn-sm" onclick="AdminComponent._nav('payments')">View All</button>
          </div>
          <table class="adm-table">
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
        <div class="adm-panel">
          <div class="adm-panel-head">
            <div class="adm-panel-title"><i class="fa-solid fa-scroll" style="color:#3D46D8;margin-right:7px;"></i>Activity Log</div>
            <button class="adm-btn adm-btn-secondary adm-btn-sm" onclick="AdminComponent._nav('activity')">View All</button>
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
    return `
      <div class="adm-page-header">
        <h1>Students <span style="font-size:1rem;font-weight:500;color:#64748B;">(${users.length})</span></h1>
        <p>Manage all registered students.</p>
      </div>
      <div class="adm-panel">
        <div class="adm-panel-head">
          <div class="adm-panel-actions">
            <input id="stu-search" class="adm-input" placeholder="🔍 Search students..." value="${search}" style="width:220px;">
            <select id="stu-filter" class="adm-select">
              <option value="" ${!filter?'selected':''}>All Students</option>
              <option value="active" ${filter==='active'?'selected':''}>Active</option>
              <option value="suspended" ${filter==='suspended'?'selected':''}>Suspended</option>
            </select>
          </div>
          <div class="adm-panel-actions">
            <button class="adm-btn adm-btn-secondary adm-btn-sm" onclick="AdminComponent._exportCSV('students')"><i class="fa-solid fa-download"></i> Export CSV</button>
          </div>
        </div>
        <table class="adm-table">
          <thead><tr><th><input type="checkbox" id="stu-check-all"></th><th>Student</th><th>Username</th><th>Enrolled</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td><input type="checkbox" class="stu-check" data-username="${u.username}"></td>
                <td>
                  <div style="display:flex;align-items:center;gap:10px;">
                    <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#3D46D8,#6366F1);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.82rem;color:#fff;flex-shrink:0;">${u.name.charAt(0)}</div>
                    <div><div style="font-weight:700;color:#0F172A;font-size:0.85rem;">${u.name}</div></div>
                  </div>
                </td>
                <td style="color:#64748B;">@${u.username}</td>
                <td><span style="background:#EFF2FE;color:#3D46D8;padding:2px 9px;border-radius:20px;font-size:0.72rem;font-weight:700;">${(u.enrolledCourses||[]).length} courses</span></td>
                <td>${u.suspended ? '<span class="adm-badge badge-suspended">⚫ Suspended</span>' : '<span class="adm-badge badge-active">🟢 Active</span>'}</td>
                <td style="color:#94A3B8;font-size:0.78rem;">${u.registeredDate||'—'}</td>
                <td>
                  <div class="adm-action-wrap">
                    <button class="adm-btn adm-btn-secondary adm-btn-sm adm-btn-icon" onclick="this.nextElementSibling.classList.toggle('open')"><i class="fa-solid fa-ellipsis"></i></button>
                    <div class="adm-action-menu">
                      <button onclick="AdminComponent._viewStudent('${u.username}')"><i class="fa-solid fa-eye" style="color:#3D46D8;"></i> View Profile</button>
                      <button onclick="AdminComponent._showResetModal('${u.username}','${u.name}')"><i class="fa-solid fa-key" style="color:#D97706;"></i> Reset Password</button>
                      <div class="adm-menu-divider"></div>
                      ${u.suspended
                        ? `<button onclick="AdminComponent._activateUser('${u.username}')"><i class="fa-solid fa-circle-check" style="color:#059669;"></i> Activate</button>`
                        : `<button onclick="AdminComponent._suspendUser('${u.username}')"><i class="fa-solid fa-ban" style="color:#D97706;"></i> Suspend</button>`}
                      <button class="danger" onclick="AdminComponent._deleteUser('${u.username}','student')"><i class="fa-solid fa-trash-can"></i> Delete</button>
                    </div>
                  </div>
                </td>
              </tr>`).join('')}
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
      <div class="adm-page-header">
        <h1>Tutors <span style="font-size:1rem;font-weight:500;color:#64748B;">(${users.length})</span></h1>
        <p>Manage instructors and their assigned courses.</p>
      </div>
      <div class="adm-panel" style="margin-bottom:20px;">
        <div class="adm-panel-head">
          <div class="adm-panel-actions">
            <input id="tut-search" class="adm-input" placeholder="🔍 Search tutors..." value="${search}" style="width:220px;">
          </div>
          <div class="adm-panel-actions">
            <button class="adm-btn adm-btn-primary adm-btn-sm" onclick="AdminComponent._showAddTutorForm()"><i class="fa-solid fa-plus"></i> Add Tutor</button>
            <button class="adm-btn adm-btn-secondary adm-btn-sm" onclick="AdminComponent._exportCSV('tutors')"><i class="fa-solid fa-download"></i> CSV</button>
          </div>
        </div>
        <table class="adm-table">
          <thead><tr><th>Name</th><th>Username</th><th>Assigned Courses</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            ${users.map(u => {
              const assigned = (u.assignedCourses||[]);
              const names = assigned.map(id=>{const c=allCourses.find(x=>x.id===id);return c?c.title:id;});
              return `
              <tr>
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
                <td style="max-width:220px;">
                  ${names.length===0?`<span style="color:#94A3B8;font-style:italic;font-size:0.78rem;">None assigned</span>`:
                    names.slice(0,2).map(n=>`<span style="display:inline-block;background:#EFF2FE;color:#3D46D8;padding:2px 8px;border-radius:20px;font-size:0.7rem;font-weight:600;margin:2px;">${n.slice(0,22)}</span>`).join('')+(names.length>2?`<span style="font-size:0.72rem;color:#94A3B8;">+${names.length-2} more</span>`:'')}
                </td>
                <td>${u.suspended?'<span class="adm-badge badge-suspended">⚫ Suspended</span>':'<span class="adm-badge badge-active">🟢 Active</span>'}</td>
                <td style="color:#94A3B8;font-size:0.78rem;">${u.registeredDate||'—'}</td>
                <td>
                  <div class="adm-action-wrap">
                    <button class="adm-btn adm-btn-secondary adm-btn-sm adm-btn-icon" onclick="this.nextElementSibling.classList.toggle('open')"><i class="fa-solid fa-ellipsis"></i></button>
                    <div class="adm-action-menu">
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
            ${users.length===0?`<tr><td colspan="6" style="text-align:center;color:#94A3B8;padding:32px;">No tutors found.</td></tr>`:''}
          </tbody>
        </table>
      </div>
      <!-- Register Tutor Panel -->
      <div class="adm-panel" id="add-tutor-panel" style="display:none;">
        <div class="adm-panel-head">
          <div class="adm-panel-title"><i class="fa-solid fa-user-plus" style="color:#3D46D8;margin-right:7px;"></i>Register New Tutor</div>
          <button class="adm-btn adm-btn-secondary adm-btn-sm" onclick="document.getElementById('add-tutor-panel').style.display='none'"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div style="padding:24px;">
          <p style="font-size:0.82rem;color:#64748B;margin-bottom:20px;">Tutors are content contributors. Assign courses below to grant them lesson management access.</p>
          <form id="form-create-tutor">
            <div class="adm-form-grid" style="margin-bottom:14px;">
              <div class="adm-form-group"><label>Full Name *</label><input class="adm-input" type="text" id="t-name" required placeholder="e.g. John Smith"></div>
              <div class="adm-form-group"><label>Username *</label><input class="adm-input" type="text" id="t-username" required placeholder="e.g. johnsmith"></div>
              <div class="adm-form-group"><label>Password *</label><input class="adm-input" type="password" id="t-password" required placeholder="Min 6 characters"></div>
              <div class="adm-form-group"><label>Expertise / Bio</label><input class="adm-input" type="text" id="t-bio" placeholder="e.g. 3D Artist with 5+ years..."></div>
            </div>
            <div style="margin-bottom:20px;">
              <label style="font-size:0.73rem;font-weight:700;color:#374151;display:block;margin-bottom:10px;"><i class="fa-solid fa-graduation-cap" style="color:#3D46D8;margin-right:5px;"></i>Assign Courses</label>
              <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:8px;" id="new-tutor-courses">
                ${window.db.getCourses().map(c=>`
                  <label style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1.5px solid #E2E8F0;border-radius:10px;cursor:pointer;background:#F8FAFC;">
                    <input type="checkbox" class="new-tutor-cb" data-course-id="${c.id}" style="accent-color:#3D46D8;width:15px;height:15px;">
                    <img src="${c.image}" style="width:38px;height:26px;object-fit:cover;border-radius:5px;flex-shrink:0;">
                    <span style="font-size:0.8rem;font-weight:600;color:#0F172A;">${c.title.slice(0,28)}${c.title.length>28?'...':''}</span>
                  </label>`).join('')}
              </div>
            </div>
            <button type="submit" class="adm-btn adm-btn-primary"><i class="fa-solid fa-plus"></i> Register Tutor</button>
          </form>
        </div>
      </div>`;
  },

  /* ============================================================
     COURSES
  ============================================================ */
  _renderCourses: function(search='',filter='') {
    let courses = window.db.getCourses();
    if (search) courses = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
    if (filter === 'published') courses = courses.filter(c => c.published && !c.archived);
    else if (filter === 'draft') courses = courses.filter(c => !c.published && !c.archived);
    else if (filter === 'archived') courses = courses.filter(c => c.archived);
    else courses = courses.filter(c => !c.archived);

    const statusBadge = c => {
      if (c.archived) return '<span class="adm-badge badge-archived">📦 Archived</span>';
      if (c.published) return '<span class="adm-badge badge-published">🟢 Published</span>';
      return '<span class="adm-badge badge-draft">⚪ Draft</span>';
    };

    return `
      <div class="adm-page-header">
        <h1>Courses <span style="font-size:1rem;font-weight:500;color:#64748B;">(${courses.length})</span></h1>
        <p>Create, edit, publish and manage all courses.</p>
      </div>
      <div class="adm-panel" style="margin-bottom:20px;">
        <div class="adm-panel-head">
          <div class="adm-panel-actions">
            <input id="crs-search" class="adm-input" placeholder="🔍 Search courses..." value="${search}" style="width:220px;">
            <select id="crs-filter" class="adm-select">
              <option value="">All Active</option>
              <option value="published" ${filter==='published'?'selected':''}>Published</option>
              <option value="draft" ${filter==='draft'?'selected':''}>Draft</option>
              <option value="archived" ${filter==='archived'?'selected':''}>Archived</option>
            </select>
          </div>
          <div class="adm-panel-actions">
            <button class="adm-btn adm-btn-primary adm-btn-sm" onclick="AdminComponent._showCreateCourse()"><i class="fa-solid fa-plus"></i> New Course</button>
            <button class="adm-btn adm-btn-secondary adm-btn-sm" onclick="AdminComponent._exportCSV('courses')"><i class="fa-solid fa-download"></i> CSV</button>
          </div>
        </div>
        <table class="adm-table">
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
                    <button class="adm-btn adm-btn-secondary adm-btn-sm adm-btn-icon" onclick="this.nextElementSibling.classList.toggle('open')"><i class="fa-solid fa-ellipsis"></i></button>
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
      <div id="course-form-panel" style="display:none;"></div>
      <div id="modules-panel" style="display:none;"></div>`;
  },

  _renderCourseForm: function(course) {
    const isEdit = !!course;
    const tutors = window.db.getUsers().filter(u => u.role==='instructor');
    return `
      <div class="adm-panel">
        <div class="adm-panel-head">
          <div class="adm-panel-title"><i class="fa-solid ${isEdit?'fa-pen-to-square':'fa-plus'}" style="color:#3D46D8;margin-right:7px;"></i>${isEdit?'Edit Course':'Create New Course'}</div>
          <button class="adm-btn adm-btn-secondary adm-btn-sm" onclick="document.getElementById('course-form-panel').style.display='none'"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div style="padding:24px;">
          <form id="form-course">
            <input type="hidden" id="cf-id" value="${course?course.id:''}">
            <div class="adm-form-grid" style="margin-bottom:14px;">
              <div class="adm-form-group"><label>Course Title *</label><input class="adm-input" type="text" id="cf-title" required placeholder="e.g. Blender Premium Course" value="${course?course.title:''}"></div>
              <div class="adm-form-group"><label>Price (₹) *</label><input class="adm-input" type="number" id="cf-price" required placeholder="1999" value="${course?course.price:''}"></div>
              <div class="adm-form-group"><label>Level</label>
                <select id="cf-level" class="adm-select">
                  ${['Beginner','Intermediate','Advanced','Beginner to Advanced','All Levels'].map(l=>`<option ${course&&course.level===l?'selected':''}>${l}</option>`).join('')}
                </select>
              </div>
              <div class="adm-form-group"><label>Duration</label><input class="adm-input" type="text" id="cf-duration" placeholder="e.g. 28 Hours" value="${course?course.duration:''}"></div>
              <div class="adm-form-group"><label>Category</label><input class="adm-input" type="text" id="cf-category" placeholder="e.g. 3D Design" value="${course?course.category:''}"></div>
              <div class="adm-form-group"><label>Assign Tutor</label>
                <select id="cf-tutor" class="adm-select">
                  <option value="admin">Cubaze Academy (Admin)</option>
                  ${tutors.map(t=>`<option value="${t.username}" ${course&&course.author===t.username?'selected':''}>${t.name}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="adm-form-group" style="margin-bottom:14px;"><label>Short Description *</label><input class="adm-input" type="text" id="cf-sdesc" required placeholder="One-line course summary" value="${course?course.shortDescription:''}"></div>
            <div class="adm-form-group" style="margin-bottom:14px;"><label>Full Description</label><textarea class="adm-textarea" id="cf-desc" rows="4" placeholder="Detailed course description...">${course?course.description:''}</textarea></div>
            <div class="adm-form-group" style="margin-bottom:14px;"><label>Thumbnail URL</label><input class="adm-input" type="url" id="cf-image" placeholder="https://..." value="${course?course.image:''}"></div>
            <div class="adm-form-group" style="margin-bottom:20px;"><label>Preview Video URL</label><input class="adm-input" type="url" id="cf-preview" placeholder="https://youtube.com/embed/..." value="${course?course.previewVideo:''}"></div>
            <div style="display:flex;gap:10px;">
              <button type="submit" class="adm-btn adm-btn-primary"><i class="fa-solid fa-save"></i> ${isEdit?'Save Changes':'Create Course'}</button>
              <button type="button" class="adm-btn adm-btn-secondary" onclick="document.getElementById('course-form-panel').style.display='none'">Cancel</button>
            </div>
          </form>
        </div>
      </div>`;
  },

  _renderModulesPanel: function(courseId) {
    const course = window.db.getCourseById(courseId);
    if (!course) return '<div style="padding:20px;">Course not found.</div>';
    return `
      <div class="adm-panel">
        <div class="adm-panel-head">
          <div class="adm-panel-title"><i class="fa-solid fa-list-check" style="color:#3D46D8;margin-right:7px;"></i>Manage Lessons — ${course.title}</div>
          <button class="adm-btn adm-btn-secondary adm-btn-sm" onclick="document.getElementById('modules-panel').style.display='none'"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div style="padding:24px;">
          <!-- Add Module -->
          <div style="display:flex;gap:10px;margin-bottom:20px;align-items:center;">
            <input id="new-mod-title" class="adm-input" placeholder="New Module Title..." style="flex:1;">
            <button class="adm-btn adm-btn-primary adm-btn-sm" onclick="AdminComponent._addModule('${courseId}')"><i class="fa-solid fa-plus"></i> Add Module</button>
          </div>
          ${(course.modules||[]).map((mod,modIdx) => `
            <div style="background:#F8FAFC;border-radius:12px;margin-bottom:16px;overflow:hidden;border:1px solid #E2E8F0;">
              <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:#F1F5F9;">
                <div style="font-weight:700;font-size:0.88rem;color:#0F172A;"><i class="fa-solid fa-layer-group" style="color:#6366F1;margin-right:7px;"></i>${mod.title}</div>
                <button class="adm-btn adm-btn-danger adm-btn-xs" onclick="AdminComponent._deleteModule('${courseId}',${modIdx})"><i class="fa-solid fa-trash-can"></i></button>
              </div>
              <div style="padding:12px 18px;">
                ${(mod.lessons||[]).map((les,lesIdx) => `
                  <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #E2E8F0;">
                    <div style="width:24px;height:24px;background:#EFF2FE;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;color:#3D46D8;flex-shrink:0;">${lesIdx+1}</div>
                    <div style="flex:1;font-size:0.83rem;font-weight:600;color:#0F172A;">${les.title}</div>
                    <span style="font-size:0.72rem;color:#94A3B8;">${les.duration||'—'}</span>
                    ${les.videoUrl?`<a href="${les.videoUrl}" target="_blank" style="color:#EF4444;font-size:0.78rem;"><i class="fa-brands fa-youtube"></i></a>`:''}
                    <button class="adm-btn adm-btn-danger adm-btn-xs" onclick="AdminComponent._deleteLesson('${courseId}','${les.id}')"><i class="fa-solid fa-xmark"></i></button>
                  </div>`).join('')}
                <!-- Add Lesson Form -->
                <form class="form-add-lesson" data-course-id="${courseId}" data-mod-idx="${modIdx}" style="display:grid;grid-template-columns:2fr 1fr;gap:8px;margin-top:12px;">
                  <input class="adm-input l-title" type="text" required placeholder="Lesson Title..." style="grid-column:1/-1;">
                  <input class="adm-input l-url" type="url" required placeholder="YouTube URL...">
                  <input class="adm-input l-duration" type="text" placeholder="MM:SS">
                  <button type="submit" class="adm-btn adm-btn-primary adm-btn-sm" style="grid-column:1/-1;width:fit-content;"><i class="fa-solid fa-plus"></i> Add Lesson</button>
                </form>
              </div>
            </div>`).join('')}
          ${(course.modules||[]).length===0?`<div style="text-align:center;padding:24px;color:#94A3B8;">No modules yet. Add one above.</div>`:''}
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
      <div class="adm-page-header">
        <h1>Payment Management <span style="font-size:1rem;font-weight:500;color:#64748B;">(${txns.length})</span></h1>
        <p>Manually review and approve/deny student payments. Approving automatically enrolls the student.</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px;">
        ${[['PENDING','#D97706','fa-hourglass-half','Pending'],['APPROVED','#059669','fa-circle-check','Approved'],['DENIED','#DC2626','fa-circle-xmark','Denied']].map(([st,c,ic,lbl])=>`
          <div style="background:#fff;border-radius:14px;padding:18px 20px;display:flex;align-items:center;gap:14px;box-shadow:0 1px 6px rgba(0,0,0,0.04);border:1px solid rgba(0,0,0,0.03);cursor:pointer;" onclick="AdminComponent._filterPayments('${st}')">
            <div style="width:40px;height:40px;border-radius:11px;background:${c}1A;color:${c};display:flex;align-items:center;justify-content:center;font-size:1.05rem;"><i class="fa-solid ${ic}"></i></div>
            <div>
              <div style="font-size:1.4rem;font-weight:800;color:#0F172A;">${window.db.getTransactions().filter(t=>{const s=t.adminStatus||t.status;return st==='APPROVED'?s==='APPROVED'||t.status==='SUCCESS':st==='PENDING'?s==='PENDING'||t.status==='PENDING':s==='DENIED'||t.status==='FAILED';}).length}</div>
              <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#94A3B8;">${lbl}</div>
            </div>
          </div>`).join('')}
      </div>
      <div class="adm-panel">
        <div class="adm-panel-head">
          <div class="adm-panel-actions">
            <input id="pay-search" class="adm-input" placeholder="🔍 Search payments..." value="${search}" style="width:220px;">
            <select id="pay-filter" class="adm-select">
              <option value="">All Payments</option>
              <option value="PENDING" ${filter==='PENDING'?'selected':''}>Pending</option>
              <option value="APPROVED" ${filter==='APPROVED'?'selected':''}>Approved</option>
              <option value="DENIED" ${filter==='DENIED'?'selected':''}>Denied</option>
            </select>
          </div>
          <button class="adm-btn adm-btn-secondary adm-btn-sm" onclick="AdminComponent._exportCSV('payments')"><i class="fa-solid fa-download"></i> Export CSV</button>
        </div>
        <table class="adm-table">
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
                    <button class="adm-btn adm-btn-secondary adm-btn-xs" onclick="AdminComponent._viewPayment('${t.id}')"><i class="fa-solid fa-eye"></i> View</button>
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
    if (!t) return `<div style="padding:40px;text-align:center;color:#94A3B8;">Transaction not found. <button class="adm-btn adm-btn-secondary adm-btn-sm" onclick="AdminComponent._nav('payments')">Back</button></div>`;
    const adminSt = t.adminStatus || (t.status==='SUCCESS'?'APPROVED':'PENDING');
    const course = window.db.getCourseById(t.courseId);
    const student = window.db.getUsers().find(u=>u.username===t.username);
    const stColors = { APPROVED:['#059669','#ECFDF5'], PENDING:['#D97706','#FFFBEB'], DENIED:['#DC2626','#FEF2F2'] };
    const [stColor, stBg] = stColors[adminSt] || ['#64748B','#F1F5F9'];
    return `
      <div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
          <button class="adm-btn adm-btn-secondary adm-btn-sm" onclick="AdminComponent._nav('payments')"><i class="fa-solid fa-arrow-left"></i> Back</button>
          <h1 style="font-size:1.3rem;font-weight:800;color:#0F172A;">Payment Detail</h1>
        </div>
        <div style="display:grid;grid-template-columns:1fr 340px;gap:20px;align-items:start;">
          <!-- Detail card -->
          <div class="adm-panel">
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
          <div class="adm-panel">
            <div class="adm-panel-head"><div class="adm-panel-title">Actions</div></div>
            <div style="padding:20px;display:flex;flex-direction:column;gap:10px;">
              <button class="adm-btn adm-btn-success" style="justify-content:center;" onclick="AdminComponent._changePaymentStatus('${t.id}','APPROVED')"><i class="fa-solid fa-circle-check"></i> Approve Payment</button>
              <button class="adm-btn" style="background:#FFFBEB;color:#D97706;border:1.5px solid #FDE68A;justify-content:center;" onclick="AdminComponent._changePaymentStatus('${t.id}','PENDING')"><i class="fa-solid fa-hourglass-half"></i> Mark as Pending</button>
              <button class="adm-btn adm-btn-danger" style="justify-content:center;" onclick="AdminComponent._changePaymentStatus('${t.id}','DENIED')"><i class="fa-solid fa-circle-xmark"></i> Deny Payment</button>
              <div style="height:1px;background:#F1F5F9;margin:4px 0;"></div>
              <button class="adm-btn adm-btn-secondary" style="justify-content:center;" onclick="window.app.showToast('Invoice download available in full backend version.','info')"><i class="fa-solid fa-file-invoice"></i> Download Invoice</button>
            </div>
            ${course ? `
              <div class="adm-panel-head" style="border-top:1px solid #F1F5F9;"><div class="adm-panel-title" style="font-size:0.82rem;">Course Details</div></div>
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
      <div class="adm-page-header"><h1>Reviews (${allReviews.length})</h1><p>All student reviews across all courses.</p></div>
      <div class="adm-panel">
        <table class="adm-table">
          <thead><tr><th>Student</th><th>Course</th><th>Rating</th><th>Review</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            ${allReviews.map(r=>`
              <tr>
                <td style="font-weight:700;">${r.name||r.username}</td>
                <td style="font-size:0.8rem;color:#64748B;">${r.courseTitle}</td>
                <td style="color:#D97706;font-weight:700;">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</td>
                <td style="font-size:0.8rem;max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${r.comment}</td>
                <td style="color:#94A3B8;font-size:0.78rem;">${r.date||'—'}</td>
                <td><button class="adm-btn adm-btn-danger adm-btn-xs" onclick="window.app.showToast('Review deleted (demo).','success')"><i class="fa-solid fa-trash-can"></i></button></td>
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
      <div class="adm-page-header"><h1>Course Submissions (${subs.length})</h1><p>Review and approve/reject instructor-submitted courses.</p></div>
      ${subs.length===0?`<div class="adm-panel" style="padding:60px;text-align:center;"><div style="font-size:3rem;margin-bottom:12px;">📥</div><p style="color:#64748B;">No pending submissions.</p></div>`:''}
      ${subs.map(sub=>`
        <div class="adm-panel" style="margin-bottom:16px;">
          <div style="padding:20px 24px;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;">
              <div style="flex:1;">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                  <h3 style="font-size:0.95rem;font-weight:800;color:#0F172A;">${sub.title}</h3>
                  <span class="adm-badge ${sub.status==='PENDING'?'badge-pending':sub.status==='APPROVED'?'badge-success':'badge-denied'}">${sub.status}</span>
                </div>
                <p style="font-size:0.82rem;color:#64748B;margin-bottom:8px;">${(sub.shortDescription||sub.description||'').slice(0,120)}</p>
                <div style="font-size:0.78rem;color:#94A3B8;">By: <strong>${sub.author}</strong> · ₹${(sub.price||0).toLocaleString('en-IN')} · ${sub.submittedDate}</div>
              </div>
              ${sub.status==='PENDING'?`
                <div style="display:flex;gap:8px;flex-shrink:0;">
                  <button class="adm-btn adm-btn-success adm-btn-sm" onclick="AdminComponent._approveSub('${sub.id}')"><i class="fa-solid fa-check"></i> Approve</button>
                  <button class="adm-btn adm-btn-danger adm-btn-sm" onclick="AdminComponent._rejectSub('${sub.id}')"><i class="fa-solid fa-xmark"></i> Reject</button>
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
      <div class="adm-page-header"><h1>Coupons (${coupons.length})</h1></div>
      <div class="adm-panel" style="margin-bottom:20px;">
        <table class="adm-table">
          <thead><tr><th>Code</th><th>Type</th><th>Discount</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${coupons.map(c=>`
              <tr>
                <td><code style="background:#F1F5F9;padding:3px 10px;border-radius:6px;font-weight:700;color:#3D46D8;">${c.code}</code></td>
                <td style="text-transform:capitalize;">${c.type}</td>
                <td style="font-weight:700;">${c.type==='percentage'?c.discount+'%':'₹'+c.discount}</td>
                <td><span class="adm-badge ${c.active?'badge-active':'badge-denied'}">${c.active?'Active':'Inactive'}</span></td>
                <td><div style="display:flex;gap:6px;">
                  <button class="adm-btn adm-btn-secondary adm-btn-xs" onclick="window.app.showToast('Edit coupon in full backend.','info')"><i class="fa-solid fa-pen-to-square"></i></button>
                  <button class="adm-btn adm-btn-danger adm-btn-xs" onclick="window.app.showToast('Coupon deleted (demo).','success')"><i class="fa-solid fa-trash-can"></i></button>
                </div></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div class="adm-panel">
        <div class="adm-panel-head"><div class="adm-panel-title">Add Coupon</div></div>
        <div style="padding:20px;display:flex;gap:12px;flex-wrap:wrap;">
          <input class="adm-input" placeholder="Coupon Code" style="flex:1;min-width:150px;">
          <select class="adm-select"><option>percentage</option><option>flat</option></select>
          <input class="adm-input" type="number" placeholder="Discount Amount" style="width:160px;">
          <button class="adm-btn adm-btn-primary" onclick="window.app.showToast('Coupon added (demo)!','success')"><i class="fa-solid fa-plus"></i> Add</button>
        </div>
      </div>`;
  },

  /* ============================================================
     BLOG
  ============================================================ */
  _renderBlog: function() {
    const posts = window.db.getBlogPosts();
    return `
      <div class="adm-page-header"><h1>Blog Posts (${posts.length})</h1></div>
      <div class="adm-panel">
        <div class="adm-panel-head">
          <div class="adm-panel-title">All Posts</div>
          <button class="adm-btn adm-btn-secondary adm-btn-sm" onclick="window.location.hash='/blog'"><i class="fa-solid fa-eye"></i> View Blog</button>
        </div>
        ${posts.map(p=>`
          <div style="display:flex;align-items:center;gap:16px;padding:14px 20px;border-bottom:1px solid #F8FAFC;">
            <img src="${p.image}" style="width:64px;height:44px;object-fit:cover;border-radius:8px;flex-shrink:0;">
            <div style="flex:1;">
              <div style="font-weight:700;font-size:0.88rem;color:#0F172A;">${p.title}</div>
              <div style="font-size:0.75rem;color:#94A3B8;margin-top:2px;">${p.category} · ${p.date} · ${p.readTime}</div>
            </div>
            <div style="display:flex;gap:6px;">
              <a href="#/blog/${p.id}" class="adm-btn adm-btn-secondary adm-btn-xs"><i class="fa-solid fa-eye"></i></a>
              <button class="adm-btn adm-btn-danger adm-btn-xs" onclick="window.app.showToast('Post deleted (demo).','success')"><i class="fa-solid fa-trash-can"></i></button>
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
      <div class="adm-page-header"><h1>Activity Log</h1><p>Full audit trail of all admin actions.</p></div>
      <div class="adm-panel">
        <table class="adm-table">
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
      <div class="adm-page-header"><h1>Settings</h1><p>System configuration and API settings.</p></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
        <div class="adm-panel">
          <div class="adm-panel-head"><div class="adm-panel-title"><i class="fa-solid fa-palette" style="color:#3D46D8;margin-right:7px;"></i>Academy Details</div></div>
          <div style="padding:24px;">
            <div class="adm-form-group" style="margin-bottom:14px;"><label>Academy Name</label><input class="adm-input" value="Cubaze Academy" style="width:100%;box-sizing:border-box;"></div>
            <div class="adm-form-group" style="margin-bottom:14px;"><label>Support Email</label><input class="adm-input" type="email" value="support@cubazeacademy.com" style="width:100%;box-sizing:border-box;"></div>
            <div class="adm-form-group" style="margin-bottom:14px;"><label>WhatsApp</label><input class="adm-input" value="+91 75103 37087" style="width:100%;box-sizing:border-box;"></div>
            <div class="adm-form-group" style="margin-bottom:20px;"><label>Revenue Split (Tutor %)</label><input class="adm-input" type="number" value="70" style="width:100%;box-sizing:border-box;"></div>
            <button class="adm-btn adm-btn-primary" onclick="window.app.showToast('Settings saved!','success')"><i class="fa-solid fa-save"></i> Save</button>
          </div>
        </div>
        <div class="adm-panel">
          <div class="adm-panel-head"><div class="adm-panel-title"><i class="fa-solid fa-credit-card" style="color:#3D46D8;margin-right:7px;"></i>PhonePe API</div></div>
          <div style="padding:24px;">
            <div class="adm-form-group" style="margin-bottom:14px;"><label>Merchant ID</label><input class="adm-input" value="M_CUBAZE_2026" style="width:100%;box-sizing:border-box;"></div>
            <div class="adm-form-group" style="margin-bottom:14px;"><label>API Secret Key</label><input class="adm-input" type="password" value="***********************" style="width:100%;box-sizing:border-box;"></div>
            <div class="adm-form-group" style="margin-bottom:20px;"><label>Environment</label><select class="adm-select" style="width:100%;"><option>Sandbox (Testing)</option><option>Production</option></select></div>
            <button class="adm-btn adm-btn-primary" onclick="window.app.showToast('API settings saved!','success')"><i class="fa-solid fa-save"></i> Save</button>
          </div>
        </div>
        <div class="adm-panel">
          <div class="adm-panel-head"><div class="adm-panel-title"><i class="fa-solid fa-lock" style="color:#3D46D8;margin-right:7px;"></i>Maintenance Mode</div></div>
          <div style="padding:20px;display:flex;align-items:center;justify-content:space-between;">
            <div><div style="font-weight:600;margin-bottom:3px;">Maintenance Mode</div><div style="font-size:0.78rem;color:#64748B;">Show maintenance page to visitors</div></div>
            <button class="adm-btn adm-btn-secondary adm-btn-sm" onclick="window.app.showToast('Maintenance mode toggled!','warning')">Toggle</button>
          </div>
        </div>
        <div class="adm-panel">
          <div class="adm-panel-head"><div class="adm-panel-title"><i class="fa-solid fa-database" style="color:#3D46D8;margin-right:7px;"></i>Supabase Connection</div></div>
          <div style="padding:24px;">
            <div class="adm-form-group" style="margin-bottom:14px;">
              <label>Supabase URL</label>
              <input class="adm-input" id="sb-url" placeholder="https://your-project.supabase.co" value="${localStorage.getItem('cubaze_supabase_url') || 'https://aqvtbtfospccfwpbqycx.supabase.co'}" style="width:100%;box-sizing:border-box;">
            </div>
            <div class="adm-form-group" style="margin-bottom:14px;">
              <label>Supabase Anon Key</label>
              <input class="adm-input" id="sb-key" type="password" placeholder="eyJhbGciOi..." value="${localStorage.getItem('cubaze_supabase_key') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxdnRidGZvc3BjY2Z3cGJxeWN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MzE2MDQsImV4cCI6MjA5OTAwNzYwNH0.rwTdM4F8LZevcTyCanQb3eVyzrPMliYMuHyMKcP5QA8'}" style="width:100%;box-sizing:border-box;">
            </div>
            <div style="display:flex;gap:10px;margin-bottom:12px;">
              <button class="adm-btn adm-btn-primary adm-btn-sm" onclick="AdminComponent._saveSupabaseSettings()"><i class="fa-solid fa-save"></i> Save & Connect</button>
              <button class="adm-btn adm-btn-secondary adm-btn-sm" onclick="AdminComponent._testSupabaseConnection()"><i class="fa-solid fa-vial"></i> Test</button>
            </div>
            <div id="sb-status-msg" style="font-size:0.75rem;font-weight:600;color:${window.db.sb ? '#059669' : '#64748B'};">
              Status: ${window.db.sb ? '🟢 Connected' : '⚪ Not Connected'}
            </div>
          </div>
        </div>
        <div class="adm-panel">
          <div class="adm-panel-head"><div class="adm-panel-title"><i class="fa-solid fa-database" style="color:#3D46D8;margin-right:7px;"></i>Data Management</div></div>
          <div style="padding:20px;display:flex;flex-direction:column;gap:10px;">
            <button class="adm-btn adm-btn-secondary adm-btn-sm" onclick="AdminComponent._exportCSV('all')"><i class="fa-solid fa-download"></i> Export All Data</button>
            <button class="adm-btn adm-btn-danger adm-btn-sm" onclick="window.app.showToast('Clear cache functionality in full version.','info')"><i class="fa-solid fa-broom"></i> Clear Cache</button>
          </div>
        </div>
      </div>`;
  },

  /* ============================================================
     HELPERS — payment badge
  ============================================================ */
  _payBadge: function(status) {
    if (!status || status==='SUCCESS' || status==='APPROVED') return '<span class="adm-badge badge-success">🟢 Approved</span>';
    if (status==='PENDING') return '<span class="adm-badge badge-pending">🟡 Pending</span>';
    if (status==='DENIED' || status==='FAILED') return '<span class="adm-badge badge-denied">🔴 Denied</span>';
    return `<span class="adm-badge badge-draft">${status}</span>`;
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
    document.querySelectorAll('.adm-nav-item').forEach(i=>i.classList.remove('active'));
    document.querySelector(`[data-adm-tab="${tab}"]`)?.classList.add('active');
    document.getElementById('adm-main').innerHTML = AdminComponent._renderSection(tab);
    AdminComponent._bindSection(tab);
  },

  _changePaymentStatus: function(txnId, newStatus, selectEl) {
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
    panel.style.display = '';
    panel.innerHTML = AdminComponent._renderCourseForm(null);
    panel.scrollIntoView({behavior:'smooth'});
    AdminComponent._bindCourseForm();
  },

  _showEditCourse: function(courseId) {
    const course = window.db.getCourseById(courseId);
    const panel = document.getElementById('course-form-panel');
    panel.style.display = '';
    panel.innerHTML = AdminComponent._renderCourseForm(course);
    panel.scrollIntoView({behavior:'smooth'});
    AdminComponent._bindCourseForm();
  },

  _manageModules: function(courseId) {
    const panel = document.getElementById('modules-panel');
    panel.style.display = '';
    panel.innerHTML = AdminComponent._renderModulesPanel(courseId);
    panel.scrollIntoView({behavior:'smooth'});
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
  _viewStudent: function(username) {
    const u = window.db.getUsers().find(x=>x.username===username);
    if (!u) return;
    const enrolled = (u.enrolledCourses||[]).map(id=>{const c=window.db.getCourseById(id);return c?c.title:id;});
    window.app.showToast(`${u.name} — ${enrolled.length} course(s): ${enrolled.slice(0,2).join(', ')}`,'info');
  },

  _showResetModal: function(username, name) {
    const newPass = prompt(`Reset password for ${name} (@${username}).\nEnter new password (min 6 chars):`);
    if (!newPass) return;
    if (newPass.length < 6) { window.app.showToast('Password must be at least 6 characters.','danger'); return; }
    const res = window.db.resetUserPassword(username, newPass);
    if (res.success) window.app.showToast(`Password reset for @${username}.`,'success');
  },

  _showAddTutorForm: function() {
    const panel = document.getElementById('add-tutor-panel');
    panel.style.display = panel.style.display==='none'?'':'none';
    if (panel.style.display!=='none') {
      panel.scrollIntoView({behavior:'smooth'});
      AdminComponent._bindTutorForm();
    }
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
          <button class="adm-btn adm-btn-primary" onclick="AdminComponent._saveAssignments('${username}')"><i class="fa-solid fa-save"></i> Save</button>
          <button class="adm-btn adm-btn-secondary" onclick="document.getElementById('assign-modal').remove()">Cancel</button>
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
    if (type==='students') {
      headers = ['Name','Username','Enrolled Courses','Status','Joined'];
      rows = window.db.getUsers().filter(u=>u.role==='student'&&!u.deleted).map(u=>[u.name,u.username,(u.enrolledCourses||[]).length,u.suspended?'Suspended':'Active',u.registeredDate||'']);
    } else if (type==='tutors') {
      headers = ['Name','Username','Assigned Courses','Status','Joined'];
      rows = window.db.getUsers().filter(u=>u.role==='instructor'&&!u.deleted).map(u=>[u.name,u.username,(u.assignedCourses||[]).length,u.suspended?'Suspended':'Active',u.registeredDate||'']);
    } else if (type==='courses') {
      headers = ['Title','Price','Students','Rating','Status','Updated'];
      rows = window.db.getCourses().map(c=>[c.title,c.price,c.studentsCount||0,c.rating,c.archived?'Archived':c.published?'Published':'Draft',c.updatedDate||'']);
    } else if (type==='payments') {
      headers = ['Invoice','Student','Course','Amount','Method','Status','Date'];
      rows = window.db.getTransactions().map(t=>[t.invoiceNumber||'',t.username,t.courseTitle,t.amount,t.paymentMethod||'',t.adminStatus||t.status,new Date(t.timestamp).toLocaleDateString('en-IN')]);
    } else {
      window.app.showToast('CSV export initiated!','success'); return;
    }
    const csv = [headers.join(','),...rows.map(r=>r.map(v=>`"${v}"`).join(','))].join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
    a.download = `cubaze-${type}-${Date.now()}.csv`; a.click();
    window.app.showToast(`${type} data exported!`,'success');
  },

  /* ============================================================
     INIT & BINDING
  ============================================================ */
  init: function() {
    window.scrollTo({top:0,behavior:'smooth'});
    AdminComponent._sec = 'dashboard';
    AdminComponent._bindSidebar();
    AdminComponent._bindSection('dashboard');
  },

  _bindSidebar: function() {
    document.querySelectorAll('.adm-nav-item[data-adm-tab]').forEach(item => {
      item.addEventListener('click', () => AdminComponent._nav(item.getAttribute('data-adm-tab')));
    });
  },

  _bindSection: function(sec) {
    if (sec==='students') {
      document.getElementById('stu-search')?.addEventListener('input', e => {
        document.getElementById('adm-main').innerHTML = AdminComponent._renderStudents(e.target.value, document.getElementById('stu-filter')?.value||'');
        AdminComponent._bindSection('students');
      });
      document.getElementById('stu-filter')?.addEventListener('change', e => {
        document.getElementById('adm-main').innerHTML = AdminComponent._renderStudents(document.getElementById('stu-search')?.value||'', e.target.value);
        AdminComponent._bindSection('students');
      });
    }
    if (sec==='tutors') {
      document.getElementById('tut-search')?.addEventListener('input', e => {
        document.getElementById('adm-main').innerHTML = AdminComponent._renderTutors(e.target.value);
        AdminComponent._bindSection('tutors');
      });
      AdminComponent._bindTutorForm();
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
  }
};

window.AdminComponent = AdminComponent;
