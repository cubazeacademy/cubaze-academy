// Cubaze Academy — Checkout, Gateway Simulator & Callback Controller (components/phonepe.js)
const PhonePeComponent = {
  _couponApplied: null,
  _activeCheckoutMethod: 'phonepe', // 'phonepe' | 'direct_upi'
  _uploadedScreenshot: null,

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
        <a href="#/dashboard" class="btn btn-primary">Go to Dashboard</a>
      </div>
    `;

    // Check if there's already a pending transaction for this user & course
    const txns = window.db.getTransactions();
    const pendingTxn = txns.find(t => t.username === cu.username && t.courseId === courseId && t.status === 'PENDING');
    if (pendingTxn) {
      const isReupload = pendingTxn.adminStatus === 'RE_UPLOAD_REQUESTED';
      if (!isReupload) {
        return `
          <div class="container" style="text-align:center;padding:80px 0;max-width:600px;margin:0 auto;">
            <div style="font-size:4rem;margin-bottom:16px;">🟡</div>
            <h2>Verification Pending</h2>
            <p style="margin:16px 0;color:var(--text-secondary);line-height:1.7;">
              You have already submitted a payment verification request for <strong>${course.title}</strong>.<br>
              Our administration team is currently reviewing your payment reference (UTR: <code>${pendingTxn.utr}</code>). This process typically takes 1–2 hours.
            </p>
            <div style="display:flex;gap:12px;justify-content:center;margin-top:24px;">
              <a href="#/dashboard" class="btn btn-primary">Go to Dashboard</a>
              <button class="btn btn-outline" onclick="window.app.showToast('Please wait for administrative verification.', 'info')">Check Status</button>
            </div>
          </div>
        `;
      }
    }

    const settings = window.db.getPaymentSettings();
    const originalPrice = Math.floor(course.price * 2.5);
    const discountPct = Math.round(((originalPrice - course.price) / originalPrice) * 100);

    return `
      <div style="background:var(--bg-primary);min-height:calc(100vh - var(--header-height));padding:48px 0;">
        <div class="payment-layout container">
          <!-- LEFT: Checkout Selection & Methods -->
          <div>
            <div class="payment-card">
              <div class="phonepe-logo-bar" style="margin-bottom:24px;">
                <div class="phonepe-brand">
                  <i class="fa-solid fa-shield-halved" style="color:var(--brand-blue);"></i>
                  <span style="font-weight:800;font-size:1.1rem;color:var(--text-primary);">Cubaze Checkout</span>
                </div>
                <div class="secure-badge">
                  <i class="fa-solid fa-lock" style="color:var(--success);"></i> Secure SSL Gateway
                </div>
              </div>

              <h3 style="margin-bottom:8px;">Select Payment Method</h3>
              <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:24px;">Choose from automated gateway or direct manual transfer</p>

              <!-- Main Checkout Methods Grid -->
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:28px;">
                <div class="checkout-method-card active" id="chk-method-phonepe" onclick="PhonePeComponent.selectCheckoutMethod('phonepe')">
                  <div class="recommended-badge">Recommended</div>
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <span style="font-weight:800;font-size:1rem;color:var(--text-primary);">PhonePe Gateway</span>
                    <i class="fa-solid fa-circle-check select-dot" style="color:var(--brand-blue);"></i>
                  </div>
                  <p style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:12px;line-height:1.4;">Automated instant activation. Supports UPI, Cards, Netbanking, and Wallets.</p>
                  <div style="display:flex;gap:6px;font-size:0.85rem;color:var(--text-muted);">
                    <i class="fa-brands fa-cc-visa"></i>
                    <i class="fa-brands fa-cc-mastercard"></i>
                    <i class="fa-solid fa-building-columns"></i>
                    <i class="fa-solid fa-mobile-screen"></i>
                  </div>
                </div>

                <div class="checkout-method-card ${settings.upi.enabled ? '' : 'disabled'}" id="chk-method-upi" onclick="PhonePeComponent.selectCheckoutMethod('direct_upi')">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <span style="font-weight:800;font-size:1rem;color:var(--text-primary);">Direct UPI Transfer</span>
                    <i class="fa-regular fa-circle select-dot" style="color:var(--text-muted);"></i>
                  </div>
                  <p style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:12px;line-height:1.4;">Manual verification. Scan QR Code & upload screenshot. Enrolled after approval.</p>
                  <div style="display:flex;gap:8px;font-size:0.75rem;font-weight:700;color:var(--brand-blue);">
                    <span>QR CODE</span> · <span>UPI ID</span>
                  </div>
                </div>
              </div>

              <!-- PhonePe Payment Gateway Area -->
              <div id="checkout-panel-phonepe">
                <div style="background:var(--bg-primary);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:18px;margin-bottom:20px;display:flex;align-items:center;gap:14px;">
                  <div style="width:48px;height:48px;background:rgba(95,37,159,0.1);border-radius:10px;display:flex;align-items:center;justify-content:center;color:#5f259f;font-size:1.5rem;"><i class="fa-solid fa-bolt"></i></div>
                  <div>
                    <h4 style="margin-bottom:4px;color:var(--text-primary);">Instant Activation</h4>
                    <p style="font-size:0.78rem;color:var(--text-secondary);margin-bottom:0;">Enrolls you instantly upon completion. No waiting or verification required.</p>
                  </div>
                </div>
                
                <h4 style="margin-bottom:12px;">Supported Gateway Sub-methods:</h4>
                <div class="payment-method-tabs" style="margin-bottom:20px;">
                  <div class="payment-tab active" data-sub="upi"><i class="fa-solid fa-mobile-screen"></i> UPI</div>
                  <div class="payment-tab" data-sub="card"><i class="fa-solid fa-credit-card"></i> Card</div>
                  <div class="payment-tab" data-sub="nb"><i class="fa-solid fa-building-columns"></i> Net Banking</div>
                  <div class="payment-tab" data-sub="wallet"><i class="fa-solid fa-wallet"></i> Wallets</div>
                </div>
                
                <p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:20px;line-height:1.5;background:var(--bg-primary);padding:12px;border-radius:8px;">
                  <i class="fa-solid fa-info-circle" style="color:var(--brand-blue);margin-right:6px;"></i>
                  You will be securely redirected to PhonePe's secure checkout page to finalize payment using the latest checksum-secured API callback redirects.
                </p>
              </div>

              <!-- Direct UPI Manual Payment Area -->
              <div id="checkout-panel-direct-upi" style="display:none;">
                <div style="background:rgba(217,119,6,0.06);border:1px solid rgba(217,119,6,0.15);border-radius:var(--radius-lg);padding:16px;margin-bottom:20px;display:flex;align-items:flex-start;gap:12px;">
                  <i class="fa-solid fa-circle-exclamation" style="color:#D97706;font-size:1.1rem;margin-top:2px;"></i>
                  <div>
                    <h4 style="margin-bottom:4px;color:#D97706;font-size:0.85rem;">Manual Verification Notice</h4>
                    <p style="font-size:0.78rem;color:var(--text-secondary);margin-bottom:0;line-height:1.4;">
                      This method requires administrative approval. Access is granted once the admin verifies your screenshot and UTR. This usually takes 1 to 2 hours.
                    </p>
                  </div>
                </div>

                <!-- QR code and UPI details -->
                <div style="display:grid;grid-template-columns:160px 1fr;gap:20px;margin-bottom:24px;align-items:center;background:var(--bg-primary);padding:18px;border-radius:var(--radius-xl);border:1px solid var(--border-color);">
                  <div style="text-align:center;background:#fff;padding:8px;border-radius:12px;border:1px solid #E2E8F0;display:flex;justify-content:center;align-items:center;">
                    <img id="checkout-qr-img" src="${settings.upi.qrCodeImage || 'https://via.placeholder.com/150?text=Scan+to+Pay'}" style="width:140px;height:140px;object-fit:contain;">
                  </div>
                  <div>
                    <div style="font-size:0.78rem;color:var(--text-muted);font-weight:700;text-transform:uppercase;margin-bottom:4px;">Account Name</div>
                    <div style="font-weight:700;font-size:0.95rem;color:var(--text-primary);margin-bottom:12px;">${settings.upi.accountName}</div>

                    <div style="font-size:0.78rem;color:var(--text-muted);font-weight:700;text-transform:uppercase;margin-bottom:4px;">UPI ID</div>
                    <div style="display:flex;gap:6px;align-items:center;">
                      <code style="font-family:monospace;font-size:0.95rem;background:var(--bg-card);border:1px solid var(--border-color);padding:6px 12px;border-radius:6px;font-weight:700;color:var(--brand-blue);word-break:break-all;" id="checkout-upi-id-txt">${settings.upi.upiId}</code>
                      <button class="btn btn-ghost btn-sm" style="padding:8px 12px;height:34px;margin-bottom:0;" onclick="PhonePeComponent.copyUPI()"><i class="fa-solid fa-copy"></i> Copy</button>
                    </div>
                  </div>
                </div>

                <div class="form-group" style="margin-bottom:16px;">
                  <label style="font-weight:600;font-size:0.83rem;">Instructions:</label>
                  <div style="font-size:0.82rem;line-height:1.5;color:var(--text-secondary);background:var(--bg-card);padding:12px;border-radius:8px;white-space:pre-line;" id="checkout-instructions-box">${settings.upi.instructions}</div>
                </div>

                <!-- Proof input fields -->
                <div style="border-top:1px solid var(--border-color);padding-top:20px;margin-top:20px;">
                  <h4 style="margin-bottom:16px;">Upload Payment Proof</h4>
                  
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px;">
                    <div class="form-group">
                      <label for="upi-utr-number"><i class="fa-solid fa-hashtag"></i> 12-Digit UTR/Transaction ID</label>
                      <input type="text" id="upi-utr-number" placeholder="e.g. 629104829104" maxlength="12" style="width:100%;">
                    </div>
                    <div class="form-group">
                      <label for="upi-payment-date"><i class="fa-solid fa-calendar"></i> Payment Date</label>
                      <input type="date" id="upi-payment-date" style="width:100%;">
                    </div>
                  </div>

                  <div class="form-group">
                    <label><i class="fa-solid fa-image"></i> Payment Screenshot</label>
                    <div class="screenshot-dropzone" id="screenshot-drop-area">
                      <i class="fa-solid fa-cloud-arrow-up" style="font-size:2rem;color:var(--text-muted);margin-bottom:8px;"></i>
                      <div style="font-weight:600;font-size:0.85rem;color:var(--text-primary);margin-bottom:4px;">Drag and drop receipt screenshot here</div>
                      <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:10px;">Supports JPEG, PNG up to 5MB</div>
                      <input type="file" id="upi-screenshot-input" accept="image/*" style="display:none;">
                      <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('upi-screenshot-input').click()">Browse Files</button>
                    </div>
                    <!-- Preview Container -->
                    <div id="screenshot-preview-container" style="display:none;margin-top:12px;position:relative;width:120px;height:120px;border-radius:8px;overflow:hidden;border:1px solid var(--border-color);">
                      <img id="screenshot-preview-img" style="width:100%;height:100%;object-fit:cover;">
                      <button type="button" style="position:absolute;top:4px;right:4px;width:24px;height:24px;border-radius:50%;background:rgba(220,38,38,0.85);color:#fff;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:0.75rem;" onclick="PhonePeComponent.clearScreenshot()"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Coupon Code -->
              <div style="padding-top:20px;border-top:1px solid var(--border-color);margin-top:24px;">
                <div class="coupon-row" style="display:flex;gap:12px;">
                  <div class="form-group" style="flex:1;margin-bottom:0;">
                    <label style="margin-bottom:6px;"><i class="fa-solid fa-tag"></i> Coupon Code</label>
                    <input type="text" id="coupon-code" placeholder="e.g. CUBAZE50, LAUNCH2026" style="width:100%;height:44px;margin-bottom:0;">
                  </div>
                  <button id="btn-apply-coupon" class="btn btn-outline" style="height:44px;margin-bottom:0;align-self:flex-end;flex-shrink:0;padding:0 20px;">Apply</button>
                </div>
                <div id="coupon-result" style="font-size:0.83rem;margin-top:8px;display:none;"></div>
                <p style="font-size:0.75rem;color:var(--text-muted);margin-top:8px;margin-bottom:0;">Try: CUBAZE50 · LAUNCH2026 · BLENDER200 · STUDENT25</p>
              </div>

              <!-- Action buttons -->
              <div style="margin-top:28px;">
                <button id="btn-pay-now" class="btn btn-primary btn-block btn-xl" style="background:linear-gradient(135deg,var(--brand-blue),#2563EB);font-size:1rem;height:52px;">
                  <i class="fa-solid fa-lock"></i>
                  <span>Pay ₹<span id="final-price-display">${course.price.toLocaleString('en-IN')}</span> Securely</span>
                </button>
                <div style="text-align:center;margin-top:14px;font-size:0.78rem;color:var(--text-muted);">
                  <i class="fa-solid fa-shield-halved" style="color:var(--success);margin-right:4px;"></i>
                  Secured & Encrypted Checkout · 7-Day Refund Policy
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT: Order Summary -->
          <div>
            <div class="payment-card">
              <h3 style="margin-bottom:20px;border-bottom:1px solid var(--border-color);padding-bottom:16px;">Order Summary</h3>
              <img src="${course.image}" alt="${course.title}" style="width:100%;border-radius:var(--radius-lg);margin-bottom:16px;aspect-ratio:16/9;object-fit:cover;">
              <div style="font-weight:800;font-size:1rem;color:var(--text-primary);margin-bottom:6px;">${course.title}</div>
              <div style="display:flex;gap:12px;font-size:0.8rem;color:var(--text-muted);margin-bottom:16px;flex-wrap:wrap;">
                <span><i class="fa-solid fa-clock"></i> ${course.duration}</span>
                <span><i class="fa-solid fa-book-open"></i> ${course.lessonsCount} Modules</span>
                <span><i class="fa-solid fa-certificate"></i> Verified Certificate</span>
              </div>

              <div style="border-top:1px solid var(--border-color);padding-top:16px;display:flex;flex-direction:column;gap:10px;font-size:0.88rem;">
                <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary);">Original Price</span><span style="text-decoration:line-through;color:var(--text-muted);">₹${originalPrice.toLocaleString('en-IN')}</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:var(--success);">Discount (${discountPct}%)</span><span style="color:var(--success);">-₹${(originalPrice - course.price).toLocaleString('en-IN')}</span></div>
                <div id="coupon-discount-row" style="display:none;justify-content:space-between;"><span style="color:var(--brand-blue);">Coupon Discount</span><span id="coupon-discount-val" style="color:var(--brand-blue);">-₹0</span></div>
              </div>

              <div style="border-top:1px solid var(--border-color);margin-top:16px;padding-top:16px;display:flex;justify-content:space-between;align-items:center;">
                <span style="font-weight:700;font-size:1rem;color:var(--text-primary);">Total to Pay</span>
                <span class="sidebar-price" id="order-total-price" style="font-size:1.5rem;color:var(--brand-blue);font-weight:900;">₹${course.price.toLocaleString('en-IN')}</span>
              </div>

              <div style="margin-top:20px;display:flex;flex-direction:column;gap:8px;font-size:0.82rem;color:var(--text-secondary);">
                ${[['fa-infinity','Lifetime access'],['fa-certificate','Completion certificate'],['fa-mobile-screen','Access on all devices'],['fa-shield-halved','7-day money-back guarantee']].map(([icon, text]) =>
                  `<div style="display:flex;align-items:center;gap:10px;"><i class="fa-solid ${icon}" style="color:var(--brand-blue);width:16px;text-align:center;"></i>${text}</div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  selectCheckoutMethod: function (method) {
    PhonePeComponent._activeCheckoutMethod = method;
    
    // Toggle active classes on cards
    document.querySelectorAll('.checkout-method-card').forEach(c => c.classList.remove('active'));
    document.getElementById(`chk-method-${method === 'phonepe' ? 'phonepe' : 'upi'}`).classList.add('active');
    
    // Toggle icons
    document.querySelectorAll('.checkout-method-card .select-dot').forEach(el => {
      el.className = 'fa-regular fa-circle select-dot';
      el.style.color = 'var(--text-muted)';
    });
    const activeDot = document.querySelector(`#chk-method-${method === 'phonepe' ? 'phonepe' : 'upi'} .select-dot`);
    if (activeDot) {
      activeDot.className = 'fa-solid fa-circle-check select-dot';
      activeDot.style.color = 'var(--brand-blue)';
    }

    // Toggle panels & button HTML
    const payBtn = document.getElementById('btn-pay-now');
    if (method === 'phonepe') {
      document.getElementById('checkout-panel-phonepe').style.display = 'block';
      document.getElementById('checkout-panel-direct-upi').style.display = 'none';
      if (payBtn) {
        payBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Pay Securely via PhonePe`;
      }
    } else {
      document.getElementById('checkout-panel-phonepe').style.display = 'none';
      document.getElementById('checkout-panel-direct-upi').style.display = 'block';
      if (payBtn) {
        payBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Submit Payment for Verification`;
      }
    }
    PhonePeComponent.updatePricesDisplay();
  },

  updatePricesDisplay: function () {
    const courseId = window.app.getRoute().parts[1];
    const course = window.db.getCourseById(courseId);
    if (!course) return;

    let finalPrice = course.price;
    if (PhonePeComponent._couponApplied) {
      finalPrice = PhonePeComponent._couponApplied.finalPrice;
    }

    const priceSpan = document.getElementById('final-price-display');
    if (priceSpan) priceSpan.textContent = finalPrice.toLocaleString('en-IN');
    
    const orderTotal = document.getElementById('order-total-price');
    if (orderTotal) orderTotal.textContent = '₹' + finalPrice.toLocaleString('en-IN');
  },

  copyUPI: function () {
    const txt = document.getElementById('checkout-upi-id-txt')?.textContent;
    if (txt) {
      navigator.clipboard.writeText(txt).then(() => {
        window.app.showToast('UPI ID copied to clipboard! 📋', 'success');
      }).catch(err => {
        window.app.showToast('Could not copy UPI ID.', 'danger');
      });
    }
  },

  clearScreenshot: function () {
    PhonePeComponent._uploadedScreenshot = null;
    document.getElementById('upi-screenshot-input').value = '';
    document.getElementById('screenshot-preview-container').style.display = 'none';
    document.getElementById('screenshot-drop-area').style.display = 'flex';
  },

  init: function (courseId) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    PhonePeComponent._couponApplied = null;
    PhonePeComponent._uploadedScreenshot = null;
    PhonePeComponent._activeCheckoutMethod = 'phonepe';

    const course = window.db.getCourseById(courseId);
    if (!course) return;

    // Default dates
    const dateInput = document.getElementById('upi-payment-date');
    if (dateInput) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }

    // Sub-payment tabs for PhonePe Gateway
    document.querySelectorAll('.payment-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.payment-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });

    // Setup drag and drop events
    const dropArea = document.getElementById('screenshot-drop-area');
    const fileInput = document.getElementById('upi-screenshot-input');

    if (dropArea && fileInput) {
      ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropArea.classList.add('highlight');
        }, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropArea.classList.remove('highlight');
        }, false);
      });

      dropArea.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files[0]) {
          PhonePeComponent.handleFileSelection(files[0]);
        }
      }, false);

      fileInput.addEventListener('change', (e) => {
        if (fileInput.files && fileInput.files[0]) {
          PhonePeComponent.handleFileSelection(fileInput.files[0]);
        }
      });
    }

    // Coupon
    document.getElementById('btn-apply-coupon')?.addEventListener('click', () => {
      const code = document.getElementById('coupon-code')?.value.trim();
      if (!code) return;
      
      const result = window.db.validateCoupon(code, course.price);
      const resultEl = document.getElementById('coupon-result');
      const couponRow = document.getElementById('coupon-discount-row');
      const couponVal = document.getElementById('coupon-discount-val');
      
      if (result.valid) {
        PhonePeComponent._couponApplied = result;
        if (resultEl) {
          resultEl.style.display = 'block';
          resultEl.innerHTML = `<span style="color:var(--success);font-weight:700;"><i class="fa-solid fa-circle-check"></i> Coupon "${code.toUpperCase()}" applied! Saved ₹${result.discount}</span>`;
        }
        if (couponRow) couponRow.style.display = 'flex';
        if (couponVal) couponVal.textContent = '-₹' + result.discount.toLocaleString('en-IN');
      } else {
        PhonePeComponent._couponApplied = null;
        if (resultEl) {
          resultEl.style.display = 'block';
          resultEl.innerHTML = `<span style="color:var(--danger);font-weight:600;"><i class="fa-solid fa-circle-xmark"></i> ${result.error}</span>`;
        }
        if (couponRow) couponRow.style.display = 'none';
      }
      PhonePeComponent.updatePricesDisplay();
    });

    // Pay / Submit button
    document.getElementById('btn-pay-now')?.addEventListener('click', () => {
      const btn = document.getElementById('btn-pay-now');
      const cu = window.db.getCurrentUser();
      if (!cu) { window.app.showAuthModal(true); return; }

      let finalPrice = course.price;
      if (PhonePeComponent._couponApplied) {
        finalPrice = PhonePeComponent._couponApplied.finalPrice;
      }

      if (PhonePeComponent._activeCheckoutMethod === 'phonepe') {
        // --- PHONEPE PAYMENT REDIRECT ---
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Initializing PhonePe Transaction...';
        
        setTimeout(() => {
          // Generate a PENDING transaction locally, then redirect to simulator
          const details = {
            discount: PhonePeComponent._couponApplied ? PhonePeComponent._couponApplied.discount : 0,
            couponCode: PhonePeComponent._couponApplied ? PhonePeComponent._couponApplied.coupon.code : "",
            gatewayReference: "PHPE_GATEWAY_" + Math.floor(100000 + Math.random() * 900000),
            adminStatus: 'PENDING'
          };
          
          const txn = window.db.addTransaction(cu.username, courseId, finalPrice, 'PhonePe Payment Gateway', 'PENDING', details);
          window.location.hash = `#/phonepe-simulator/${txn.id}`;
        }, 1200);
        
      } else {
        // --- DIRECT UPI MANUAL PAYMENT ---
        const utr = document.getElementById('upi-utr-number')?.value.trim();
        const date = document.getElementById('upi-payment-date')?.value;
        const screenshot = PhonePeComponent._uploadedScreenshot;

        if (!utr || utr.length !== 12 || !/^\d+$/.test(utr)) {
          window.app.showToast('Please enter a valid 12-digit UTR/Transaction Number.', 'danger');
          return;
        }

        if (!date) {
          window.app.showToast('Please select the payment transaction date.', 'danger');
          return;
        }

        if (!screenshot) {
          window.app.showToast('Please upload a screenshot of your payment receipt.', 'danger');
          return;
        }

        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting payment proof...';

        setTimeout(() => {
          // Check if it is a reupload request of an existing transaction
          const existingPending = window.db.getTransactions().find(t => t.username === cu.username && t.courseId === courseId && t.status === 'PENDING');
          
          const details = {
            id: existingPending ? existingPending.id : null, // keep same transaction if re-uploading
            discount: PhonePeComponent._couponApplied ? PhonePeComponent._couponApplied.discount : 0,
            couponCode: PhonePeComponent._couponApplied ? PhonePeComponent._couponApplied.coupon.code : "",
            screenshot: screenshot,
            utr: utr,
            paymentDate: date,
            adminStatus: 'PENDING' // reset state back to pending verification
          };
          
          if (existingPending) {
            // Remove the old transaction before adding updated one
            let allTxns = window.db.getTransactions();
            allTxns = allTxns.filter(t => t.id !== existingPending.id);
            localStorage.setItem("cubaze_transactions", JSON.stringify(allTxns));
          }

          window.db.addTransaction(cu.username, courseId, finalPrice, 'Direct UPI QR Payment', 'PENDING', details);
          
          window.app.showToast('Payment submitted successfully for verification! ⏳', 'success');
          window.location.hash = '#/dashboard';
        }, 1500);
      }
    });

    PhonePeComponent.updatePricesDisplay();
  },

  handleFileSelection: function (file) {
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
      PhonePeComponent._uploadedScreenshot = e.target.result;
      document.getElementById('screenshot-preview-img').src = e.target.result;
      document.getElementById('screenshot-drop-area').style.display = 'none';
      document.getElementById('screenshot-preview-container').style.display = 'block';
    };
    reader.readAsDataURL(file);
  },

  // ============================================================
  // PHONEPE STANDARD CHECKOUT SIMULATOR RENDERERS
  // ============================================================
  renderSimulator: function (txnId) {
    const txn = window.db.getTransactions().find(t => t.id === txnId);
    if (!txn) return `<div class="container" style="text-align:center;padding:100px 0;"><h2>Transaction Not Found</h2></div>`;
    const settings = window.db.getPaymentSettings();

    return `
      <div style="background:#f4f4f7; min-height:calc(100vh - var(--header-height)); padding:40px 0; display:flex; justify-content:center; align-items:center; font-family:'Inter', sans-serif;">
        <div style="width:100%; max-width:480px; background:#fff; border-radius:16px; box-shadow:0 12px 36px rgba(0,0,0,0.08); overflow:hidden;">
          
          <!-- Purple PhonePe Header -->
          <div style="background:#5f259f; color:#fff; padding:24px; text-align:center; position:relative;">
            <div style="font-weight:800; font-size:1.4rem; letter-spacing:0.02em; display:flex; align-items:center; justify-content:center; gap:8px;">
              <span style="background:#fff; color:#5f259f; width:30px; height:30px; border-radius:8px; display:inline-flex; align-items:center; justify-content:center; font-weight:900;">Pe</span>
              PhonePe Merchant
            </div>
            <p style="font-size:0.78rem; opacity:0.85; margin:8px 0 0;">Environment: <span style="background:rgba(255,255,255,0.25); padding:2px 8px; border-radius:20px; font-weight:700; text-transform:uppercase;">${settings.phonepe.environment}</span></p>
          </div>

          <div style="padding:28px;">
            <!-- Merchant Details -->
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px dashed #E2E8F0; padding-bottom:16px; margin-bottom:20px;">
              <div>
                <div style="font-size:0.75rem; color:#64748B; font-weight:700; text-transform:uppercase;">Merchant</div>
                <div style="font-weight:800; color:#1e293b; font-size:0.95rem;">Cubaze Academy</div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:0.75rem; color:#64748B; font-weight:700; text-transform:uppercase;">Amount</div>
                <div style="font-weight:900; color:#059669; font-size:1.3rem;">₹${txn.amount.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:12px; margin-bottom:24px; font-size:0.78rem; color:#475569; display:flex; flex-direction:column; gap:6px;">
              <div>Transaction ID: <code style="font-weight:700; color:#3D46D8;">${txn.id}</code></div>
              <div>PhonePe API Version: <strong>${settings.phonepe.clientVersion}</strong></div>
              <div>Merchant ID: <strong>${settings.phonepe.merchantId}</strong></div>
            </div>

            <h4 style="margin-bottom:14px; color:#1e293b; font-weight:700;">Simulate Callback Gateway Response:</h4>
            
            <div style="display:flex; flex-direction:column; gap:12px;">
              <button class="btn btn-block btn-lg" style="background:#10B981; color:#fff; border-color:#10B981; font-weight:700; height:48px;" onclick="PhonePeComponent.triggerSimulatorCallback('${txnId}', 'success')">
                <i class="fa-solid fa-circle-check"></i> Simulate Success Response
              </button>
              
              <button class="btn btn-block btn-lg" style="background:#EF4444; color:#fff; border-color:#EF4444; font-weight:700; height:48px;" onclick="PhonePeComponent.triggerSimulatorCallback('${txnId}', 'failure')">
                <i class="fa-solid fa-circle-xmark"></i> Simulate Failure Response
              </button>
              
              <button class="btn btn-block btn-lg btn-secondary" style="font-weight:700; height:48px;" onclick="PhonePeComponent.triggerSimulatorCallback('${txnId}', 'pending')">
                <i class="fa-solid fa-hourglass-half"></i> Simulate Gateway Timeout / Pending
              </button>
            </div>
            
            <div style="text-align:center; margin-top:24px; font-size:0.72rem; color:#94A3B8; display:flex; align-items:center; justify-content:center; gap:6px;">
              <i class="fa-solid fa-lock"></i> 256-bit SSL Sandbox encryption
            </div>
          </div>
        </div>
      </div>
    `;
  },

  initSimulator: function (txnId) {},

  triggerSimulatorCallback: function (txnId, outcome) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Webhook simulation - log inside admin activity feed
    window.db.addActivity("PhonePe API", "WEBHOOK_RECEIVED", "webhook", txnId, `Status payload trigger for outcome: ${outcome.toUpperCase()}`);
    
    // Simulate redirection delay
    const view = document.getElementById('app-view');
    view.innerHTML = `
      <div style="background:#f4f4f7; min-height:70vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:48px;">
        <div class="spinner" style="width:50px; height:50px; border-width:4px; margin-bottom:20px;"></div>
        <h3>Authorizing Gateway Transaction...</h3>
        <p style="color:var(--text-muted);">Verifying API checksum and processing callback redirection...</p>
      </div>
    `;

    setTimeout(() => {
      window.location.hash = `#/pay-callback/${outcome}/${txnId}`;
    }, 1200);
  },

  // ============================================================
  // CALLBACK VIEWS
  // ============================================================
  renderCallback: function (status, txnId) {
    const txn = window.db.getTransactions().find(t => t.id === txnId);
    if (!txn) return `<div class="container" style="text-align:center;padding:80px 0;"><h2>Receipt Not Found</h2></div>`;
    const course = window.db.getCourseById(txn.courseId);

    if (status === 'success') {
      // Automatic activation
      return PhonePeComponent._renderSuccess(txn, course);
    } else if (status === 'pending') {
      return `
        <div class="container" style="max-width:600px;margin:0 auto;text-align:center;padding:64px 0;">
          <div style="width:100px;height:100px;background:linear-gradient(135deg,#F59E0B,#D97706);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;box-shadow:0 12px 40px rgba(245,158,11,0.3);">
            <i class="fa-solid fa-hourglass-half" style="color:#fff;font-size:2.5rem;"></i>
          </div>
          <h2 style="font-size:1.8rem;margin-bottom:8px;">Payment is Pending ⏳</h2>
          <p style="color:var(--text-secondary);margin-bottom:32px;line-height:1.6;">
            We are waiting for payment confirmation from your bank. Gateway references are verifying. 
            Once confirmed, your course will be activated automatically.
          </p>

          <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-xl);padding:20px 24px;text-align:left;margin-bottom:24px;font-size:0.88rem;">
            <div>Transaction Reference: <code style="font-weight:700;">${txn.id}</code></div>
            <div style="margin-top:6px;">Status: <span style="color:#D97706;font-weight:700;">PENDING GATEWAY RESPONSIBLE</span></div>
          </div>

          <div style="display:flex;gap:12px;justify-content:center;">
            <a href="#/dashboard" class="btn btn-primary">Go to Dashboard</a>
            <a href="#/courses" class="btn btn-secondary">Browse Other Courses</a>
          </div>
        </div>
      `;
    } else {
      // Failure
      return `
        <div class="container" style="max-width:600px;margin:0 auto;text-align:center;padding:64px 0;">
          <div style="width:100px;height:100px;background:linear-gradient(135deg,#EF4444,#DC2626);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;box-shadow:0 12px 40px rgba(239,68,68,0.3);">
            <i class="fa-solid fa-xmark" style="color:#fff;font-size:2.5rem;"></i>
          </div>
          <h2 style="font-size:1.8rem;margin-bottom:8px;">Transaction Failed ❌</h2>
          <p style="color:var(--text-secondary);margin-bottom:32px;line-height:1.6;">
            The transaction was declined by the payment processor. No charges have been made.
          </p>

          <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-xl);padding:20px 24px;text-align:left;margin-bottom:24px;font-size:0.88rem;">
            <div>Transaction ID: <code style="font-weight:700;">${txn.id}</code></div>
            <div style="margin-top:6px;">Gateway Code: <span style="color:#EF4444;font-weight:700;">PAYMENT_DECLINED_BY_USER</span></div>
          </div>

          <div style="display:flex;gap:12px;justify-content:center;">
            <a href="#/pay/${txn.courseId}" class="btn btn-primary">Retry Payment</a>
            <a href="#/courses" class="btn btn-secondary">Cancel</a>
          </div>
        </div>
      `;
    }
  },

  initCallback: function (status, txnId) {
    if (status === 'success') {
      const txn = window.db.getTransactions().find(t => t.id === txnId);
      if (txn && txn.status !== 'SUCCESS') {
        // Reconcile / set status to Success & auto enroll
        window.db.updatePaymentAdminStatus(txnId, 'APPROVED');
        window.app.updateNavbarAuth();
      }
    }
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
          <h4 style="margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;gap:8px;">
            <span style="display:flex;align-items:center;gap:8px;"><i class="fa-solid fa-receipt" style="color:var(--brand-blue);"></i> Payment Receipt</span>
            <button class="btn btn-ghost btn-sm" onclick="PhonePeComponent.printInvoice('${txn.id}')" style="margin-bottom:0;padding:6px 12px;height:32px;"><i class="fa-solid fa-print"></i> Print Invoice</button>
          </h4>
          ${[['Invoice Number', txn.invoiceNumber || 'INV-' + Date.now()],['Transaction ID', txn.id],['Course', course.title],['Amount Paid', '₹' + txn.amount.toLocaleString('en-IN')],['Payment Method', txn.paymentMethod],['Status', '✅ SUCCESS'],['Date', new Date(txn.timestamp).toLocaleString('en-IN')]].map(([label, val]) => `
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
        <p style="margin-top:20px;font-size:0.8rem;color:var(--text-muted);">A confirmation email & invoice copy have been sent to your registered email address.</p>
      </div>
    `;
  },

  // ============================================================
  // PRINTABLE INVOICE GENERATOR
  // ============================================================
  printInvoice: function (txnId) {
    const txn = window.db.getTransactions().find(t => t.id === txnId);
    if (!txn) {
      window.app.showToast('Transaction not found to print invoice.', 'danger');
      return;
    }
    const user = window.db.getUsers().find(u => u.username === txn.username) || {};

    const printWindow = window.open('', '_blank', 'width=800,height=800');
    if (!printWindow) {
      window.app.showToast('Popup blocked. Please allow popups to download invoices.', 'warning');
      return;
    }

    const originalPrice = Math.round(txn.amount + (txn.discount || 0));
    const taxAmt = Math.round((txn.amount * 18) / 118); // 18% inclusive GST
    const baseAmt = txn.amount - taxAmt;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${txn.invoiceNumber || 'INV'}</title>
        <style>
          body { font-family: 'Inter', system-ui, sans-serif; color: #1E293B; margin: 0; padding: 40px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 1.6rem; font-weight: 800; color: #3D46D8; }
          .invoice-title { text-align: right; }
          .invoice-title h1 { margin: 0; font-size: 1.8rem; color: #0F172A; }
          .invoice-title p { margin: 6px 0 0; color: #64748B; font-size: 0.88rem; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
          .meta-box h3 { margin: 0 0 10px; font-size: 0.78rem; text-transform: uppercase; color: #64748B; letter-spacing: 0.05em; }
          .meta-box p { margin: 0; font-size: 0.92rem; line-height: 1.5; color: #0F172A; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .table th { background: #F8FAFC; text-align: left; padding: 12px 16px; font-size: 0.78rem; text-transform: uppercase; color: #64748B; border-bottom: 1px solid #E2E8F0; }
          .table td { padding: 16px; font-size: 0.9rem; border-bottom: 1px solid #E2E8F0; }
          .summary-box { display: flex; justify-content: flex-end; margin-bottom: 40px; }
          .summary-table { width: 300px; border-collapse: collapse; }
          .summary-table td { padding: 8px 12px; font-size: 0.88rem; }
          .summary-table .total { font-size: 1.2rem; font-weight: 800; color: #3D46D8; border-top: 2px solid #E2E8F0; }
          .footer { text-align: center; border-top: 1px solid #E2E8F0; padding-top: 20px; font-size: 0.78rem; color: #94A3B8; margin-top: 60px; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Cubaze Academy</div>
          <div class="invoice-title">
            <h1>TAX INVOICE</h1>
            <p>Invoice No: <strong>${txn.invoiceNumber || 'INV-MOCK'}</strong></p>
          </div>
        </div>

        <div class="meta-grid">
          <div class="meta-box">
            <h3>Billed From:</h3>
            <p>
              <strong>Cubaze Academy Private Ltd.</strong><br>
              45, Creative Tech Hub,<br>
              Bangalore, Karnataka, 560001<br>
              GSTIN: 29AAACC1206H1Z5<br>
              Email: billing@cubazeacademy.com
            </p>
          </div>
          <div class="meta-box">
            <h3>Billed To:</h3>
            <p>
              <strong>Name:</strong> ${txn.studentName || user.name || txn.username}<br>
              <strong>Username:</strong> @${txn.username}<br>
              <strong>Email:</strong> ${txn.studentEmail || user.email || '—'}<br>
              <strong>Phone:</strong> ${txn.studentPhone || user.phone || '—'}
            </p>
          </div>
        </div>

        <div class="meta-grid" style="margin-bottom: 20px;">
          <div class="meta-box">
            <h3>Transaction Info:</h3>
            <p>
              Payment Method: <strong>${txn.paymentMethod}</strong><br>
              Transaction Ref ID: <code>${txn.id}</code><br>
              ${txn.utr ? `UTR Number: <code>${txn.utr}</code><br>` : ''}
              Payment Date: ${new Date(txn.timestamp).toLocaleDateString('en-IN')}
            </p>
          </div>
          <div class="meta-box" style="text-align: right;">
            <h3>Date of Issue:</h3>
            <p>${new Date(txn.timestamp).toLocaleString('en-IN')}</p>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Course / Item Description</th>
              <th style="text-align: right;">Base Price</th>
              <th style="text-align: right;">Discount</th>
              <th style="text-align: right;">GST (18% Incl.)</th>
              <th style="text-align: right;">Net Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>${txn.courseTitle}</strong><br>
                <span style="font-size:0.75rem; color:#64748B;">LMS Premium Access License Batch Assignment</span>
              </td>
              <td style="text-align: right;">₹${baseAmt.toLocaleString('en-IN')}</td>
              <td style="text-align: right;">-₹${(txn.discount || 0).toLocaleString('en-IN')}</td>
              <td style="text-align: right;">₹${taxAmt.toLocaleString('en-IN')}</td>
              <td style="text-align: right; font-weight:700;">₹${txn.amount.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>

        <div class="summary-box">
          <table class="summary-table">
            <tr>
              <td style="color:#64748B;">Subtotal:</td>
              <td style="text-align: right;">₹${baseAmt.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="color:#64748B;">GST (18% Inclusive):</td>
              <td style="text-align: right;">₹${taxAmt.toLocaleString('en-IN')}</td>
            </tr>
            ${txn.discount ? `
            <tr>
              <td style="color:var(--success);">Coupon Discount (${txn.couponCode || 'PROMO'}):</td>
              <td style="text-align: right; color:var(--success);">-₹${txn.discount.toLocaleString('en-IN')}</td>
            </tr>
            ` : ''}
            <tr class="total">
              <td>Total Paid:</td>
              <td style="text-align: right;">₹${txn.amount.toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </div>

        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print()" style="padding: 10px 24px; font-weight: bold; background: #3D46D8; color: #fff; border: none; border-radius: 6px; cursor: pointer;">Print / Save as PDF</button>
        </div>

        <div class="footer">
          This is a computer-generated tax invoice and requires no physical signature.<br>
          Cubaze Academy · support@cubazeacademy.com · www.cubazeacademy.com
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
};
window.PhonePeComponent = PhonePeComponent;
