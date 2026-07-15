// Cubaze Academy — PhonePe Payment v2.0 (components/phonepe.js)
const PhonePeComponent = {
  _couponApplied: null,
  _activeMethod: 'upi',

  render: function (courseId) {
    const course = window.db.getCourseById(courseId);
    if (!course) return `<div class="container" style="text-align:center;padding:80px 0;"><h2>Course Not Found</h2><a href="#/courses" class="btn btn-primary" style="margin-top:16px;">Browse Courses</a></div>`;

    const cu = window.db.getCurrentUser();
    if (!cu) return `<div class="container" style="text-align:center;padding:80px 0;"><h2>Please Login</h2><p style="margin:16px 0;">You need to login to purchase this course.</p><button class="btn btn-primary" onclick="window.app.showAuthModal(true)">Login to Continue</button></div>`;

    const enrolled = cu.enrolledCourses || [];
    if (enrolled.includes(courseId)) return `
      <div class="container" style="text-align:center;padding:80px 0;">
        <div style="font-size:4rem;margin-bottom:16px;">🎉</div>
        <h2>Already Enrolled!</h2>
        <p style="margin:16px 0;color:var(--text-secondary);">You already have access to <strong>${course.title}</strong>.</p>
        ${(() => {
          const hasLes = course.modules && course.modules.length > 0 && course.modules[0].lessons && course.modules[0].lessons.length > 0;
          if (hasLes) {
            return `<a href="#/lesson/${course.id}/${course.modules[0].lessons[0].id}" class="btn btn-primary">Start Learning</a>`;
          }
          return `<a href="#/course/${course.id}" class="btn btn-primary">View Course Details</a>`;
        })()}
      </div>
    `;

    const originalPrice = Math.floor(course.price * 2.5);
    const discountPct = Math.round(((originalPrice - course.price) / originalPrice) * 100);

    return `
      <div style="background:var(--bg-primary);min-height:calc(100vh - var(--header-height));padding:48px 0;">
        <div class="payment-layout container">
          <!-- LEFT: Payment Form -->
          <div>
            <div class="payment-card">
              <!-- PhonePe Header -->
              <div class="phonepe-logo-bar">
                <div class="phonepe-brand">
                  <i class="fa-solid fa-shield-halved"></i>
                  <span>Secure Checkout</span>
                </div>
                <div class="secure-badge">
                  <i class="fa-solid fa-lock"></i> 256-bit SSL Encrypted
                </div>
              </div>

              <h3 style="margin-bottom:6px;">Choose Payment Method</h3>
              <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:20px;">All payments are secure and encrypted via PhonePe</p>

              <!-- Payment Method Tabs -->
              <div class="payment-method-tabs">
                <div class="payment-tab active" data-method="upi"><i class="fa-solid fa-mobile-screen"></i> UPI</div>
                <div class="payment-tab" data-method="card"><i class="fa-solid fa-credit-card"></i> Card</div>
                <div class="payment-tab" data-method="netbanking"><i class="fa-solid fa-building-columns"></i> Net Banking</div>
                <div class="payment-tab" data-method="wallet"><i class="fa-solid fa-wallet"></i> Wallet</div>
              </div>

              <!-- UPI Panel -->
              <div id="panel-upi" class="payment-panel">
                <div class="form-group">
                  <label><i class="fa-solid fa-at"></i> UPI ID</label>
                  <input type="text" id="upi-id" placeholder="e.g. yourname@paytm or @upi">
                </div>
                <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;">
                  ${['GPay','PhonePe','Paytm','BHIM'].map(app => `
                    <button class="btn btn-secondary btn-sm upi-app-btn" data-app="${app}">
                      <i class="fa-solid fa-mobile-screen"></i> ${app}
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Card Panel -->
              <div id="panel-card" class="payment-panel" style="display:none;">
                <div class="form-group"><label>Card Number</label><input type="text" placeholder="1234 5678 9012 3456" maxlength="19"></div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                  <div class="form-group"><label>Expiry (MM/YY)</label><input type="text" placeholder="MM/YY" maxlength="5"></div>
                  <div class="form-group"><label>CVV</label><input type="password" placeholder="•••" maxlength="3"></div>
                </div>
                <div class="form-group"><label>Name on Card</label><input type="text" placeholder="As on card"></div>
              </div>

              <!-- Net Banking Panel -->
              <div id="panel-netbanking" class="payment-panel" style="display:none;">
                <div class="form-group">
                  <label>Select Your Bank</label>
                  <select><option>SBI</option><option>HDFC Bank</option><option>ICICI Bank</option><option>Axis Bank</option><option>Kotak Mahindra</option><option>Bank of Baroda</option><option>Other Banks</option></select>
                </div>
              </div>

              <!-- Wallet Panel -->
              <div id="panel-wallet" class="payment-panel" style="display:none;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                  ${['PhonePe Wallet','Paytm Wallet','Amazon Pay','MobiKwik'].map(w => `
                    <button class="btn btn-secondary wallet-btn" data-wallet="${w}" style="padding:14px;"><i class="fa-solid fa-wallet"></i> ${w}</button>
                  `).join('')}
                </div>
              </div>

              <!-- Coupon Code -->
              <div style="padding-top:16px;border-top:1px solid var(--border-color);margin-top:4px;">
                <div class="coupon-row">
                  <div class="form-group">
                    <label><i class="fa-solid fa-tag"></i> Coupon Code</label>
                    <input type="text" id="coupon-code" placeholder="e.g. CUBAZE50, LAUNCH2026">
                  </div>
                  <button id="btn-apply-coupon" class="btn btn-outline" style="height:44px;margin-bottom:0;align-self:flex-end;flex-shrink:0;">Apply</button>
                </div>
                <div id="coupon-result" style="font-size:0.83rem;margin-top:-8px;margin-bottom:12px;display:none;"></div>
                <p style="font-size:0.75rem;color:var(--text-muted);">Try: CUBAZE50 · LAUNCH2026 · BLENDER200 · STUDENT25</p>
              </div>

              <!-- Pay Button -->
              <div style="margin-top:20px;">
                <button id="btn-pay-now" class="btn btn-primary btn-block btn-xl" style="background:linear-gradient(135deg,#5f259f,#3d0e70);font-size:1rem;">
                  <i class="fa-solid fa-lock"></i>
                  <span>Pay ₹<span id="final-price-display">${course.price.toLocaleString('en-IN')}</span> Securely</span>
                </button>
                <div style="text-align:center;margin-top:12px;font-size:0.78rem;color:var(--text-muted);">
                  <i class="fa-solid fa-shield-halved" style="color:var(--success);"></i>
                  Secured by PhonePe · SSL Encrypted · 7-Day Refund Guaranteed
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT: Order Summary -->
          <div>
            <div class="payment-card">
              <h3 style="margin-bottom:20px;border-bottom:1px solid var(--border-color);padding-bottom:16px;">Order Summary</h3>
              <img src="${course.image}" alt="${course.title}" style="width:100%;border-radius:var(--radius-lg);margin-bottom:16px;aspect-ratio:16/9;object-fit:cover;">
              <div style="font-weight:700;font-size:0.95rem;color:var(--text-primary);margin-bottom:6px;">${course.title}</div>
              <div style="display:flex;gap:12px;font-size:0.8rem;color:var(--text-muted);margin-bottom:16px;flex-wrap:wrap;">
                <span><i class="fa-solid fa-clock"></i> ${course.duration}</span>
                <span><i class="fa-solid fa-book-open"></i> ${course.lessonsCount} Modules</span>
                <span><i class="fa-solid fa-certificate"></i> Certificate</span>
              </div>

              <div style="border-top:1px solid var(--border-color);padding-top:16px;display:flex;flex-direction:column;gap:10px;font-size:0.88rem;">
                <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary);">Original Price</span><span style="text-decoration:line-through;color:var(--text-muted);">₹${originalPrice.toLocaleString('en-IN')}</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:var(--success);">Discount (${discountPct}%)</span><span style="color:var(--success);">-₹${(originalPrice - course.price).toLocaleString('en-IN')}</span></div>
                <div id="coupon-discount-row" style="display:none;justify-content:space-between;"><span style="color:var(--brand-blue);">Coupon Discount</span><span id="coupon-discount-val" style="color:var(--brand-blue);">-₹0</span></div>
              </div>

              <div style="border-top:1px solid var(--border-color);margin-top:16px;padding-top:16px;display:flex;justify-content:space-between;align-items:center;">
                <span style="font-weight:700;font-size:1rem;color:var(--text-primary);">Total</span>
                <span class="sidebar-price" id="order-total-price" style="font-size:1.5rem;">₹${course.price.toLocaleString('en-IN')}</span>
              </div>

              <div style="margin-top:20px;display:flex;flex-direction:column;gap:8px;font-size:0.82rem;color:var(--text-secondary);">
                ${[['fa-infinity','Lifetime access'],['fa-certificate','Completion certificate'],['fa-mobile-screen','Access on all devices'],['fa-shield-halved','7-day money-back guarantee']].map(([icon, text]) =>
                  `<div style="display:flex;align-items:center;gap:10px;"><i class="fa-solid ${icon}" style="color:var(--brand-blue);width:16px;text-align:center;"></i>${text}</div>`
                ).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  _renderSuccess: function (txn, course) {
    return `
      <div class="container" style="max-width:600px;margin:0 auto;text-align:center;padding:64px 0;">
        <div style="width:100px;height:100px;background:linear-gradient(135deg,var(--success),#059669);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;box-shadow:0 12px 40px rgba(16,185,129,0.4);">
          <i class="fa-solid fa-check" style="color:#fff;font-size:2.5rem;"></i>
        </div>
        <h2 style="font-size:1.8rem;margin-bottom:8px;">Payment Successful! 🎉</h2>
        <p style="color:var(--text-secondary);margin-bottom:32px;">Your course is now unlocked and ready to learn!</p>

        <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-xl);padding:24px;text-align:left;margin-bottom:24px;">
          <h4 style="margin-bottom:16px;display:flex;align-items:center;gap:8px;"><i class="fa-solid fa-receipt" style="color:var(--brand-blue);"></i> Payment Receipt</h4>
          ${[['Transaction ID', txn.id],['Course', course.title],['Amount Paid', '₹' + txn.amount.toLocaleString('en-IN')],['Payment Method', txn.paymentMethod],['Status', '✅ SUCCESS'],['Date', new Date(txn.timestamp).toLocaleString('en-IN')]].map(([label, val]) => `
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border-color);font-size:0.85rem;">
              <span style="color:var(--text-muted);">${label}</span>
              <span style="font-weight:600;color:var(--text-primary);">${val}</span>
            </div>
          `).join('')}
        </div>

        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          ${(() => {
            const hasLes = course.modules && course.modules.length > 0 && course.modules[0].lessons && course.modules[0].lessons.length > 0;
            if (hasLes) {
              return `<a href="#/lesson/${course.id}/${course.modules[0].lessons[0].id}" class="btn btn-primary btn-lg"><i class="fa-solid fa-play"></i> Start Learning Now</a>`;
            }
            return `<a href="#/course/${course.id}" class="btn btn-primary btn-lg"><i class="fa-solid fa-book-open"></i> View Course Curriculum</a>`;
          })()}
          <a href="#/dashboard" class="btn btn-secondary">Go to Dashboard</a>
        </div>
        <p style="margin-top:20px;font-size:0.8rem;color:var(--text-muted);">A confirmation email has been sent to your registered email address.</p>
      </div>
    `;
  },

  init: function (courseId) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    PhonePeComponent._couponApplied = null;
    const course = window.db.getCourseById(courseId);
    if (!course) return;

    let finalPrice = course.price;

    // Payment method tabs
    document.querySelectorAll('.payment-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.payment-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const method = tab.getAttribute('data-method');
        document.querySelectorAll('.payment-panel').forEach(p => p.style.display = 'none');
        const panel = document.getElementById(`panel-${method}`);
        if (panel) panel.style.display = 'block';
      });
    });

    // UPI app buttons
    document.querySelectorAll('.upi-app-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.upi-app-btn').forEach(b => b.classList.remove('btn-primary'));
        btn.classList.add('btn-primary');
        document.getElementById('upi-id').placeholder = `Your ${btn.getAttribute('data-app')} UPI ID`;
      });
    });

    // Coupon
    document.getElementById('btn-apply-coupon')?.addEventListener('click', () => {
      const code = document.getElementById('coupon-code')?.value;
      if (!code) return;
      const result = window.db.validateCoupon(code, finalPrice);
      const resultEl = document.getElementById('coupon-result');
      const couponRow = document.getElementById('coupon-discount-row');
      const couponVal = document.getElementById('coupon-discount-val');
      const finalDisplay = document.getElementById('final-price-display');
      const totalDisplay = document.getElementById('order-total-price');
      if (result.valid) {
        PhonePeComponent._couponApplied = result;
        finalPrice = result.finalPrice;
        if (resultEl) { resultEl.style.display = 'block'; resultEl.innerHTML = `<span style="color:var(--success);font-weight:600;"><i class="fa-solid fa-check-circle"></i> Coupon applied! You save ₹${result.discount.toLocaleString('en-IN')}</span>`; }
        if (couponRow) couponRow.style.display = 'flex';
        if (couponVal) couponVal.textContent = '-₹' + result.discount.toLocaleString('en-IN');
        if (finalDisplay) finalDisplay.textContent = finalPrice.toLocaleString('en-IN');
        if (totalDisplay) totalDisplay.textContent = '₹' + finalPrice.toLocaleString('en-IN');
      } else {
        if (resultEl) { resultEl.style.display = 'block'; resultEl.innerHTML = `<span style="color:var(--danger);"><i class="fa-solid fa-xmark-circle"></i> ${result.error}</span>`; }
      }
    });

    // Pay Now
    document.getElementById('btn-pay-now')?.addEventListener('click', () => {
      const btn = document.getElementById('btn-pay-now');
      const cu = window.db.getCurrentUser();
      if (!cu) { window.app.showAuthModal(true); return; }

      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Payment...';

      setTimeout(() => {
        const txn = window.db.addTransaction(cu.username, courseId, finalPrice, 'UPI - PhonePe', 'SUCCESS');
        document.getElementById('app-view').innerHTML = PhonePeComponent._renderSuccess(txn, course);
        window.app.updateNavbarAuth();
        window.app.showToast('Payment successful! Course unlocked! 🎉', 'success');
      }, 2200);
    });
  }
};
window.PhonePeComponent = PhonePeComponent;
