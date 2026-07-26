// Cubaze Academy — App Engine v2.0 (app.js)
// Central Router, Auth Manager, Toast System, Dark Mode

class CubazeApp {
  constructor() {
    this.view = document.getElementById('app-view');
    this.bindRouter();
    this.bindNavEvents();
    this.bindAuthModal();
    this.bindDarkMode();
    this.initMobileNav();
    this.updateNavbarAuth();
    this.initSessionPulse();
    this.renderRoute();
    this.initCommonMeetingScheduler();
  }

  // ============================================================
  // ROUTER
  // ============================================================
  bindRouter() {
    window.addEventListener('hashchange', () => this.renderRoute());
  }

  getRoute() {
    const hash = window.location.hash.replace('#', '') || '/';
    const parts = hash.split('/').filter(Boolean);
    return { path: '/' + (parts[0] || ''), parts };
  }

  renderRoute() {
    const { path, parts } = this.getRoute();
    if (!this.view) return;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Active nav link
    document.querySelectorAll('.nav-link[data-path]').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-path') === path.replace('/', '') || (path === '/' && link.getAttribute('data-path') === '/'));
    });

    // Route matching
    try {
      if (path === '/') {
        this.view.innerHTML = window.HomeComponent.render();
        window.HomeComponent.init();
      } else if (path === '/courses' && parts.length === 1) {
        this.view.innerHTML = window.CoursesComponent.renderList();
        window.CoursesComponent.initList();
      } else if (path === '/course' && parts[1]) {
        this.view.innerHTML = window.CoursesComponent.renderDetail(parts[1]);
        window.CoursesComponent.initDetail(parts[1]);
      } else if (path === '/about') {
        this.view.innerHTML = window.AboutComponent.render();
        window.AboutComponent.init();
      } else if (path === '/contact') {
        this.view.innerHTML = window.ContactComponent.render();
        window.ContactComponent.init();
      } else if (path === '/blog' && parts.length === 1) {
        this.view.innerHTML = window.BlogComponent.render();
        window.BlogComponent.init();
      } else if (path === '/blog' && parts[1]) {
        this.view.innerHTML = window.BlogComponent.renderPost(parts[1]);
        window.BlogComponent.initPost();
      } else if (path === '/faq') {
        this.view.innerHTML = window.FaqPageComponent.render();
        window.FaqPageComponent.init();
      } else if (path === '/privacy') {
        this.view.innerHTML = window.PrivacyComponent.render();
        window.PrivacyComponent.init();
      } else if (path === '/refund') {
        this.view.innerHTML = window.RefundComponent.render();
        window.RefundComponent.init();
      } else if (path === '/terms') {
        this.view.innerHTML = window.TermsComponent.render();
        window.TermsComponent.init();
      } else if (path === '/pay' && parts[1]) {
        this.view.innerHTML = window.PhonePeComponent.render(parts[1]);
        window.PhonePeComponent.init(parts[1]);
      } else if (path === '/pay-callback' && parts[1] && parts[2]) {
        this.view.innerHTML = window.PhonePeComponent.renderCallback(parts[1], parts[2]);
        window.PhonePeComponent.initCallback(parts[1], parts[2]);
      } else if (path === '/phonepe-simulator' && parts[1]) {
        this.view.innerHTML = window.PhonePeComponent.renderSimulator(parts[1]);
        window.PhonePeComponent.initSimulator(parts[1]);
      } else if (path === '/dashboard') {
        const cu = window.db.getCurrentUser();
        if (parts[1]) {
          const tabMap = {
            'mycourses': 'mycourses',
            'my-courses': 'mycourses',
            'liveclasses': 'liveclasses',
            'projects': 'projects',
            'wishlist': 'wishlist',
            'certificates': 'certificates',
            'orders': 'orders',
            'profile': 'profile'
          };
          if (tabMap[parts[1]]) {
            if (window.DashboardComponent) window.DashboardComponent._activeTab = tabMap[parts[1]];
          }
        }
        if (cu && cu.role === 'admin') {
          this.view.innerHTML = window.AdminComponent.render();
          window.AdminComponent.init();
        } else if (cu && (cu.role === 'instructor')) {
          this.view.innerHTML = window.TutorComponent.render();
          window.TutorComponent.init();
        } else {
          this.view.innerHTML = window.DashboardComponent.render();
          window.DashboardComponent.init();
        }
      } else if (path === '/admin') {
        this.view.innerHTML = window.AdminComponent.render();
        window.AdminComponent.init();
      } else if (path === '/tutor') {
        this.view.innerHTML = window.TutorComponent.render();
        window.TutorComponent.init();
      } else if (path === '/lesson' && parts[1] && parts[2]) {
        this.view.innerHTML = window.VideoPlayerComponent.render(parts[1], parts[2]);
        window.VideoPlayerComponent.init(parts[1], parts[2]);

      } else if (path === '/certificate' && parts[1]) {
        this.view.innerHTML = window.CertificateComponent.render(parts[1]);
        window.CertificateComponent.init(parts[1]);
      } else {
        this.view.innerHTML = this._render404();
      }
    } catch (err) {
      console.error('Route error:', err);
      this.view.innerHTML = this._renderError(err.message);
    }
  }

  _render404() {
    return `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:70vh;text-align:center;padding:48px;">
        <div style="font-size:5rem;margin-bottom:16px;">🔍</div>
        <h1 style="font-size:2.5rem;margin-bottom:12px;">404</h1>
        <h2 style="margin-bottom:12px;">Page Not Found</h2>
        <p style="color:var(--text-secondary);margin-bottom:32px;">The page you're looking for doesn't exist or has been moved.</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">
          <a href="#/" class="btn btn-primary btn-lg">Go Home</a>
          <a href="#/courses" class="btn btn-secondary btn-lg">Browse Courses</a>
        </div>
      </div>
    `;
  }

  _renderError(message) {
    return `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;text-align:center;padding:48px;">
        <div style="font-size:3rem;margin-bottom:16px;">⚠️</div>
        <h2 style="margin-bottom:12px;">Something Went Wrong</h2>
        <p style="color:var(--text-secondary);margin-bottom:8px;font-size:0.9rem;">${message || 'An unexpected error occurred.'}</p>
        <p style="color:var(--text-muted);margin-bottom:24px;font-size:0.8rem;">Please check the browser console for details.</p>
        <a href="#/" class="btn btn-primary">Go Home</a>
      </div>
    `;
  }

  // ============================================================
  // NAVIGATION
  // ============================================================
  bindNavEvents() {
    // Header scroll effect
    window.addEventListener('scroll', () => {
      const header = document.getElementById('main-header');
      if (header) header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // ============================================================
  // AUTH MODAL
  // ============================================================
  bindAuthModal() {
    const overlay = document.getElementById('auth-modal');
    const closeBtn = document.getElementById('auth-modal-close');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');

    // Open triggers
    ['btn-login-trigger', 'btn-login-trigger-mobile'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', () => this.showAuthModal(true));
    });
    ['btn-register-trigger', 'btn-register-trigger-mobile'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', () => this.showAuthModal(false));
    });

    // Close
    closeBtn?.addEventListener('click', () => this.hideAuthModal());
    overlay?.addEventListener('click', e => { if (e.target === overlay) this.hideAuthModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') this.hideAuthModal(); });

    // Tab switch
    tabLogin?.addEventListener('click', () => this._switchAuthTab(true));
    tabRegister?.addEventListener('click', () => this._switchAuthTab(false));

    // Login form
    formLogin?.addEventListener('submit', async e => {
      e.preventDefault();
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value;

      const submitBtn = formLogin.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...`;
      }

      const result = await window.db.loginUserAsync(username, password);

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Login`;
      }

      if (result.success) {
        this.hideAuthModal();
        this.updateNavbarAuth();
        this.showToast(`Welcome back, ${result.user.name}! 🎉`, 'success');
        // Redirect based on role
        let targetHash = '#/dashboard';
        if (result.user.role === 'admin') targetHash = '#/admin';
        else if (result.user.role === 'instructor') targetHash = '#/tutor';

        if (window.location.hash === targetHash) {
          this.renderRoute();
        } else {
          window.location.hash = targetHash;
        }
      } else if (result.isBlocked) {
        this.hideAuthModal();
        this.showBlockedLoginModal(result.activeSession, result.attemptedInfo);
      } else {
        this.showToast(result.error || 'Invalid credentials', 'danger');
      }
    });

    // Register form
    formRegister?.addEventListener('submit', async e => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const username = document.getElementById('reg-username').value.trim().toLowerCase();
      const email = document.getElementById('reg-email')?.value.trim().toLowerCase() || '';
      const password = document.getElementById('reg-password').value;
      const phone = document.getElementById('reg-phone')?.value.trim() || '';
      if (!name || !username || !email || !password || !phone) { this.showToast('All fields are required.', 'danger'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { this.showToast('Please enter a valid email address.', 'danger'); return; }
      if (password.length < 6) { this.showToast('Password must be at least 6 characters.', 'danger'); return; }
      if (!/^[a-z0-9_]+$/.test(username)) { this.showToast('Username can only contain letters, numbers, and underscores.', 'danger'); return; }

      const submitBtn = formRegister.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...`;
      }

      const result = await window.db.registerAsync(name, username, password, phone, email);

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Create Account`;
      }

      if (result.success) {
        this.hideAuthModal();
        this.updateNavbarAuth();
        this.showToast(`Welcome to Cubaze Academy, ${name}! 🎓`, 'success');
        if (window.location.hash === '#/dashboard') {
          this.renderRoute();
        } else {
          window.location.hash = '#/dashboard';
        }
      } else {
        this.showToast(result.error || 'Registration failed', 'danger');
      }
    });
  }

  showBlockedLoginModal(activeSession, attemptedInfo) {
    document.getElementById('blocked-login-modal')?.remove();

    const activeDevice = activeSession ? (activeSession.deviceName || 'Windows Laptop') : 'Active Device';
    const activeBrowser = activeSession ? (activeSession.browser || 'Google Chrome') : 'Browser';
    const activeOs = activeSession ? (activeSession.os || 'Windows 11') : 'Windows';
    const activeLoc = activeSession ? `${activeSession.city || 'Kozhikode'}, ${activeSession.state || 'Kerala'}, ${activeSession.country || 'India'}` : 'India';
    const loginTimeStr = activeSession ? new Date(activeSession.loginTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Recently';
    const lastActStr = activeSession ? new Date(activeSession.lastActivity).toLocaleTimeString('en-IN', { timeStyle: 'short' }) : 'Recently';

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay show';
    overlay.id = 'blocked-login-modal';
    overlay.style.zIndex = '99999';
    overlay.style.background = 'rgba(15, 23, 42, 0.92)';
    overlay.style.backdropFilter = 'blur(8px)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.padding = '20px';

    overlay.innerHTML = `
      <div style="background:var(--bg-card); width:100%; max-width:500px; border-radius:24px; padding:32px; border:1px solid var(--border-color); box-shadow:0 25px 60px rgba(0,0,0,0.4); text-align:left;">
        
        <div style="text-align:center; margin-bottom:20px;">
          <div style="width:64px; height:64px; border-radius:50%; background:rgba(239, 68, 68, 0.12); color:#EF4444; display:inline-flex; align-items:center; justify-content:center; font-size:1.8rem; margin-bottom:12px;">
            <i class="fa-solid fa-shield-cat"></i>
          </div>
          <h2 style="margin:0; font-size:1.4rem; font-weight:800; color:var(--text-primary);">🚫 Account Already Active</h2>
          <p style="margin:8px 0 0; font-size:0.85rem; color:var(--text-secondary); line-height:1.4;">
            This account is currently being used on another device.
          </p>
        </div>

        <div style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:16px; padding:20px; margin-bottom:20px; font-size:0.85rem; line-height:1.8;">
          <div style="font-weight:700; color:var(--brand-blue); text-transform:uppercase; font-size:0.75rem; letter-spacing:0.05em; margin-bottom:6px;">Active Device Details:</div>
          <div><strong>Device:</strong> ${activeDevice}</div>
          <div><strong>Browser:</strong> ${activeBrowser}</div>
          <div><strong>Operating System:</strong> ${activeOs}</div>
          <div><strong>Location:</strong> ${activeLoc}</div>
          <div><strong>Logged In:</strong> ${loginTimeStr}</div>
          <div><strong>Last Activity:</strong> ${lastActStr}</div>
        </div>

        <div style="background:rgba(245, 158, 11, 0.08); border:1px solid rgba(245, 158, 11, 0.2); border-radius:12px; padding:12px 16px; font-size:0.8rem; color:#D97706; margin-bottom:24px; display:flex; align-items:flex-start; gap:8px;">
          <i class="fa-solid fa-circle-info" style="margin-top:2px;"></i>
          <span>Please log out from the active device before logging in here.</span>
        </div>

        <button type="button" class="btn btn-secondary btn-block btn-lg" onclick="document.getElementById('blocked-login-modal').remove()" style="font-weight:700; border-radius:12px; margin:0;">
          Close
        </button>
      </div>
    `;

    document.body.appendChild(overlay);
  }

  showAuthModal(isLogin = true) {
    const overlay = document.getElementById('auth-modal');
    overlay?.classList.add('show');
    this._switchAuthTab(isLogin);
    document.body.style.overflow = 'hidden';
  }

  hideAuthModal() {
    document.getElementById('auth-modal')?.classList.remove('show');
    document.body.style.overflow = '';
  }

  _switchAuthTab(isLogin) {
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');
    if (isLogin) {
      tabLogin?.classList.add('active'); tabRegister?.classList.remove('active');
      formLogin?.classList.add('active'); formRegister?.classList.remove('active');
    } else {
      tabRegister?.classList.add('active'); tabLogin?.classList.remove('active');
      formRegister?.classList.add('active'); formLogin?.classList.remove('active');
    }
  }

  // ============================================================
  // NAVBAR AUTH STATE
  // ============================================================
  updateNavbarAuth() {
    const cu = window.db.getCurrentUser();
    const actionsEl = document.getElementById('nav-auth-actions');
    if (!actionsEl) return;

    if (cu) {
      const dashLink = cu.role === 'admin' ? '#/admin' : cu.role === 'instructor' ? '#/tutor' : '#/dashboard';
      actionsEl.innerHTML = `
        <button class="dark-mode-btn" id="dark-mode-toggle" title="Toggle Dark Mode">
          <i class="fa-solid fa-${document.body.classList.contains('dark-mode') ? 'sun' : 'moon'}" id="dark-mode-icon"></i>
        </button>
        <div class="profile-dropdown-container" id="profile-dropdown-wrap">
          <div class="profile-trigger" id="profile-trigger">
            <div class="profile-avatar" style="${cu.profilePhoto ? `background-image:url(${cu.profilePhoto});` : ''}">${cu.profilePhoto ? '' : cu.name.charAt(0).toUpperCase()}</div>
            <span>${cu.name.split(' ')[0]}</span>
            <i class="fa-solid fa-chevron-down" style="font-size:0.7rem;color:var(--text-muted);"></i>
          </div>
          <div class="profile-dropdown" id="profile-dropdown">
            <div class="dropdown-header">
              <h4>${cu.name}</h4>
              <span>@${cu.username} · ${cu.role}</span>
            </div>
            <a href="${dashLink}" class="dropdown-item" id="btn-dropdown-dashboard"><i class="fa-solid fa-gauge"></i> Dashboard</a>
            ${(cu.role === 'student' || cu.role === 'user') ? `<a href="#/dashboard/mycourses" class="dropdown-item" id="btn-dropdown-mycourses"><i class="fa-solid fa-book-open"></i> My Courses</a>` : ''}
            ${cu.role === 'admin' ? `<a href="#/admin" class="dropdown-item"><i class="fa-solid fa-gear"></i> Admin Panel</a>` : ''}
            ${cu.role === 'instructor' ? `<a href="#/tutor" class="dropdown-item"><i class="fa-solid fa-chalkboard-user"></i> Tutor Panel</a>` : ''}
            <a href="#/courses" class="dropdown-item"><i class="fa-solid fa-layer-group"></i> Browse Courses</a>
            <div style="border-top:1px solid var(--border-color);margin:4px 0;"></div>
            <div class="dropdown-item danger" id="btn-logout"><i class="fa-solid fa-right-from-bracket"></i> Logout</div>
          </div>
        </div>
      `;

      // Profile dropdown toggle
      document.getElementById('profile-trigger')?.addEventListener('click', e => {
        e.stopPropagation();
        document.getElementById('profile-dropdown')?.classList.toggle('show');
      });
      document.addEventListener('click', () => document.getElementById('profile-dropdown')?.classList.remove('show'));

      // Dashboard & My Courses dropdown triggers
      document.getElementById('btn-dropdown-dashboard')?.addEventListener('click', () => {
        if (window.DashboardComponent) window.DashboardComponent._activeTab = 'overview';
      });
      document.getElementById('btn-dropdown-mycourses')?.addEventListener('click', () => {
        if (window.DashboardComponent) window.DashboardComponent._activeTab = 'mycourses';
      });

      // Logout
      document.getElementById('btn-logout')?.addEventListener('click', () => this.logout());

      // Re-bind dark mode
      document.getElementById('dark-mode-toggle')?.addEventListener('click', () => this.toggleDarkMode());

    } else {
      actionsEl.innerHTML = `
        <button class="dark-mode-btn" id="dark-mode-toggle" title="Toggle Dark Mode">
          <i class="fa-solid fa-${document.body.classList.contains('dark-mode') ? 'sun' : 'moon'}" id="dark-mode-icon"></i>
        </button>
        <button class="btn btn-ghost btn-sm" id="btn-login-trigger">Login</button>
        <button class="btn btn-primary btn-sm" id="btn-register-trigger">Get Started</button>
      `;
      document.getElementById('btn-login-trigger')?.addEventListener('click', () => this.showAuthModal(true));
      document.getElementById('btn-register-trigger')?.addEventListener('click', () => this.showAuthModal(false));
      document.getElementById('dark-mode-toggle')?.addEventListener('click', () => this.toggleDarkMode());
    }
  }

  logout() {
    window.db.logout();
    this.updateNavbarAuth();
    this.showToast('Logged out. See you soon! 👋', 'info');
    window.location.hash = '#/';
  }

  // ============================================================
  // MOBILE NAV
  // ============================================================
  initMobileNav() {
    const btn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('mobile-nav');
    const backdrop = document.getElementById('mobile-nav-backdrop');
    const icon = document.getElementById('hamburger-icon');

    const closeNav = () => {
      nav?.classList.remove('open');
      backdrop?.classList.remove('open');
      document.body.classList.remove('mobile-nav-active');
      if (icon) {
        icon.className = 'fa-solid fa-bars';
      }
    };

    const openNav = () => {
      nav?.classList.add('open');
      backdrop?.classList.add('open');
      document.body.classList.add('mobile-nav-active');
      if (icon) {
        icon.className = 'fa-solid fa-xmark';
      }
    };

    btn?.addEventListener('click', e => {
      e.stopPropagation();
      if (nav?.classList.contains('open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    backdrop?.addEventListener('click', () => {
      closeNav();
    });

    // Close on nav link click
    nav?.querySelectorAll('.nav-link, button').forEach(el => {
      el.addEventListener('click', () => {
        closeNav();
      });
    });

    // Close on window resize if expanded to desktop width
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && nav?.classList.contains('open')) {
        closeNav();
      }
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (nav?.classList.contains('open') && !btn?.contains(e.target) && !nav.contains(e.target)) {
        closeNav();
      }
    });
  }

  // ============================================================
  // DARK MODE
  // ============================================================
  bindDarkMode() {
    const saved = localStorage.getItem('cubaze_dark_mode');
    if (saved === 'true') { document.body.classList.add('dark-mode'); }
    document.getElementById('dark-mode-toggle')?.addEventListener('click', () => this.toggleDarkMode());
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('cubaze_dark_mode', isDark);
    const icon = document.getElementById('dark-mode-icon');
    if (icon) { icon.className = `fa-solid fa-${isDark ? 'sun' : 'moon'}`; }
    this.showToast(`${isDark ? 'Dark' : 'Light'} mode enabled`, 'info');
  }

  // ============================================================
  // TOAST NOTIFICATIONS
  // ============================================================
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const icons = { success: 'fa-circle-check', danger: 'fa-circle-xmark', warning: 'fa-triangle-exclamation', info: 'fa-circle-info' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fa-solid ${icons[type] || 'fa-circle-info'}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(20px)'; toast.style.transition = 'all 0.3s ease'; setTimeout(() => toast.remove(), 300); }, 3500);
  }

  initSessionPulse() {
    setInterval(() => {
      const isValid = window.db.updateSessionPulse();
      if (!isValid && window.db.getCurrentUser()) {
        this.logout();
        this.showToast('Your session was ended on another device or by administrator.', 'warning');
      }
    }, 15000);

    window.addEventListener('storage', (e) => {
      if (e.key === 'cubaze_session_token' || e.key === 'cubaze_current_user' || e.key === 'cubaze_sessions') {
        const cu = window.db.getCurrentUser();
        const token = localStorage.getItem('cubaze_session_token');
        if (!cu || !token) {
          this.updateNavbarAuth();
          this.renderRoute();
        } else {
          const isValid = window.db.updateSessionPulse();
          if (!isValid) {
            this.logout();
            this.showToast('Your session was ended on another device or browser.', 'warning');
          }
        }
      }
    });
  }

  initCommonMeetingScheduler() {
    setInterval(() => {
      this.checkCommonMeetingNotifications();
    }, 60000);
    setTimeout(() => {
      this.checkCommonMeetingNotifications();
    }, 3000);
  }

  checkCommonMeetingNotifications() {
    const cu = window.db.getCurrentUser();
    if (!cu) return;

    try {
      const meetings = window.db.getCommonMeetingsForUser(cu.username);
      const now = new Date();

      meetings.forEach(m => {
        const meetingStart = new Date(`${m.date}T${m.startTime}`);
        const diffMs = meetingStart - now;
        const diffMins = diffMs / (1000 * 60);

        // 1. New Meeting Created
        const seenKey = `cm_seen_${m.id}`;
        if (!localStorage.getItem(seenKey)) {
          localStorage.setItem(seenKey, 'true');
          if (m.status !== 'Completed' && m.status !== 'Cancelled') {
            this.showToast(`New Meeting: "${m.title}" has been scheduled! 🗓️`, 'info');
            window.db.addActivity(cu.username, "NEW_MEETING_CREATED", "meeting", m.id, `New Meeting: "${m.title}" scheduled`);
          }
        }

        // Only check upcoming warnings if meeting is upcoming
        if (m.status === 'Upcoming') {
          // 2. Starts in 1 Hour (between 45 and 60 minutes)
          if (diffMins > 45 && diffMins <= 60) {
            const notifKey = `cm_notif_1h_${m.id}`;
            if (!localStorage.getItem(notifKey)) {
              localStorage.setItem(notifKey, 'true');
              this.showToast(`Upcoming Meeting: "${m.title}" starts in 1 hour! ⏳`, 'warning');
            }
          }

          // 3. Starts in 15 Minutes (between 0 and 15 minutes)
          if (diffMins > 0 && diffMins <= 15) {
            const notifKey = `cm_notif_15m_${m.id}`;
            if (!localStorage.getItem(notifKey)) {
              localStorage.setItem(notifKey, 'true');
              this.showToast(`Upcoming Meeting: "${m.title}" starts in 15 minutes! ⏳`, 'warning');
            }
          }
        }

        // 4. Meeting is Live Now
        if (m.status === 'Live Now') {
          const notifKey = `cm_notif_live_${m.id}`;
          if (!localStorage.getItem(notifKey)) {
            localStorage.setItem(notifKey, 'true');
            this.showToast(`Meeting Live: "${m.title}" is Live Now! 🚨`, 'success');
          }
        }

        // 5. Meeting Cancelled
        if (m.status === 'Cancelled') {
          const notifKey = `cm_notif_cancelled_${m.id}`;
          if (!localStorage.getItem(notifKey)) {
            localStorage.setItem(notifKey, 'true');
            this.showToast(`Meeting Cancelled: "${m.title}" has been cancelled. ❌`, 'danger');
          }
        }
      });
    } catch (e) {
      console.error("Error checking common meeting notifications:", e);
    }
  }
}

// Initialize the app
window.app = new CubazeApp();

window.getAvatarColor = function (username) {
  if (!username) return '#3b82f6';
  const colors = [
    '#3b82f6', // blue
    '#6366f1', // indigo
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#f43f5e', // rose
    '#10b981', // emerald
    '#14b8a6', // teal
    '#f59e0b', // amber
    '#0284c7', // sky
    '#059669', // dark emerald
    '#7c3aed'  // violet
  ];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

window.resizeAndCropTo3x4 = function (file, callback) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');

      const targetRatio = 3 / 4;
      const currentRatio = img.width / img.height;
      let sourceX = 0, sourceY = 0, sourceWidth = img.width, sourceHeight = img.height;

      if (currentRatio > targetRatio) {
        sourceWidth = img.height * targetRatio;
        sourceX = (img.width - sourceWidth) / 2;
      } else {
        sourceHeight = img.width / targetRatio;
        sourceY = (img.height - sourceHeight) / 2;
      }

      ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, 300, 400);
      callback(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

window.initEmojiPicker = function (btnId, textareaId) {
  const btn = document.getElementById(btnId);
  const textarea = document.getElementById(textareaId);
  if (!btn || !textarea) return;

  const existingPickerId = `picker-${btnId}`;

  btn.onclick = (e) => {
    e.stopPropagation();
    let picker = document.getElementById(existingPickerId);
    if (picker) {
      picker.remove();
      return;
    }

    // Close any other open pickers
    document.querySelectorAll('.emoji-picker-popover').forEach(p => p.remove());

    // Create picker
    picker = document.createElement('div');
    picker.id = existingPickerId;
    picker.className = 'emoji-picker-popover';

    const emojis = ['😊', '😂', '🤣', '👍', '❤️', '🔥', '😍', '🤔', '😢', '🙌', '👏', '🎉', '🚀', '✨', '🙏', '💯', '👋', '👀'];
    emojis.forEach(emoji => {
      const span = document.createElement('span');
      span.textContent = emoji;
      span.addEventListener('click', (ev) => {
        ev.stopPropagation();

        // Insert emoji at cursor position
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        textarea.value = text.substring(0, start) + emoji + text.substring(end);
        textarea.focus();
        // Move cursor after the emoji
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;

        picker.remove();
      });
      picker.appendChild(span);
    });

    const parentRow = btn.closest('.support-chat-input-row') || btn.parentElement;
    parentRow.style.position = 'relative';
    parentRow.appendChild(picker);
  };

  // Close picker on outside click
  document.addEventListener('click', (e) => {
    const picker = document.getElementById(existingPickerId);
    if (picker && !picker.contains(e.target) && e.target !== btn) {
      picker.remove();
    }
  });
};
