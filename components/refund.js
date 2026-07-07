// Cubaze Academy — Refund Policy (components/refund.js)
const RefundComponent = {
  render: function () {
    return `
      <div class="page-hero">
        <div class="container">
          <div class="breadcrumb"><a href="#/">Home</a><span class="sep">/</span><span>Refund Policy</span></div>
          <h1>Refund Policy</h1>
          <p>Last updated: July 1, 2026</p>
        </div>
      </div>
      <div class="legal-layout container">
        <div style="background:var(--success-bg);border:1px solid rgba(16,185,129,0.3);border-radius:var(--radius-xl);padding:24px;margin-bottom:40px;display:flex;align-items:flex-start;gap:16px;">
          <i class="fa-solid fa-shield-halved" style="color:var(--success);font-size:1.5rem;flex-shrink:0;margin-top:2px;"></i>
          <div>
            <strong style="color:var(--success);display:block;margin-bottom:6px;font-size:1rem;">7-Day Money-Back Guarantee</strong>
            <p style="font-size:0.9rem;color:var(--text-secondary);">We stand behind the quality of our courses. If you're not satisfied within 7 days of purchase, we'll refund your money — no questions asked.</p>
          </div>
        </div>
        <div class="legal-section">
          <h2>1. Eligibility for Refund</h2>
          <p>You are eligible for a full refund if:</p>
          <ul>
            <li>Your refund request is submitted within 7 days of the original purchase date</li>
            <li>You have completed less than 30% of the course content</li>
            <li>The course is substantially different from its description</li>
            <li>You experienced technical issues that prevented normal course access</li>
          </ul>
        </div>
        <div class="legal-section">
          <h2>2. Non-Refundable Circumstances</h2>
          <p>Refunds will not be issued in the following cases:</p>
          <ul>
            <li>More than 7 days have passed since the original purchase</li>
            <li>More than 30% of the course has been completed</li>
            <li>The certificate has already been issued</li>
            <li>The course was purchased using a promotional price of ₹1 or free</li>
            <li>The account has been found violating our Terms of Service</li>
          </ul>
        </div>
        <div class="legal-section">
          <h2>3. How to Request a Refund</h2>
          <p>To request a refund:</p>
          <ul>
            <li>Email us at <strong>refund@cubazeacademy.com</strong> within 7 days of purchase</li>
            <li>Include your Transaction ID (found in your Order History)</li>
            <li>Briefly describe the reason for your refund request</li>
          </ul>
          <p style="margin-top:12px;">Our support team will review your request within 2 business days and respond with a decision.</p>
        </div>
        <div class="legal-section">
          <h2>4. Refund Processing Time</h2>
          <p>Once approved, refunds are processed within 5-7 business days. The amount will be credited back to the original payment method used for the purchase.</p>
        </div>
        <div class="legal-section">
          <h2>5. Contact for Refund Support</h2>
          <p><strong>Email:</strong> refund@cubazeacademy.com<br><strong>WhatsApp:</strong> +91 98765 43210<br><strong>Response Time:</strong> Within 24 hours (Mon–Sat)</p>
        </div>
      </div>
    `;
  },
  init: function () { window.scrollTo({ top: 0, behavior: 'smooth' }); }
};
window.RefundComponent = RefundComponent;
