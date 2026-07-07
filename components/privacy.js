// Cubaze Academy — Privacy Policy (components/privacy.js)
const PrivacyComponent = {
  render: function () {
    return `
      <div class="page-hero">
        <div class="container">
          <div class="breadcrumb"><a href="#/">Home</a><span class="sep">/</span><span>Privacy Policy</span></div>
          <h1>Privacy Policy</h1>
          <p>Last updated: July 1, 2026</p>
        </div>
      </div>
      <div class="legal-layout container">
        <div class="legal-section">
          <h2>1. Introduction</h2>
          <p>Cubaze Academy ("we", "our", or "us") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>
        </div>
        <div class="legal-section">
          <h2>2. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, username, and password when you register.</li>
            <li><strong>Payment Information:</strong> Payment data is processed securely by PhonePe. We do not store your payment card details.</li>
            <li><strong>Usage Data:</strong> Course progress, quiz results, lesson completion data, and platform activity.</li>
            <li><strong>Device Information:</strong> Browser type, IP address, and device identifiers for analytics and security.</li>
          </ul>
        </div>
        <div class="legal-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and improve our educational services</li>
            <li>Process payments and send receipts</li>
            <li>Issue course completion certificates</li>
            <li>Send course updates and promotional communications (with your consent)</li>
            <li>Provide customer support</li>
            <li>Comply with legal obligations</li>
          </ul>
        </div>
        <div class="legal-section">
          <h2>4. Data Storage & Security</h2>
          <p>Your data is stored securely using industry-standard encryption. We use localStorage on your device for session management and progress tracking. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        </div>
        <div class="legal-section">
          <h2>5. Sharing Your Information</h2>
          <p>We do not sell, trade, or otherwise transfer your personal information to third parties, except:</p>
          <ul>
            <li>Payment processors (PhonePe) for transaction processing</li>
            <li>When required by law or legal proceedings</li>
            <li>To protect our rights and the safety of our users</li>
          </ul>
        </div>
        <div class="legal-section">
          <h2>6. Cookies</h2>
          <p>We use localStorage and session cookies to maintain your login state, preferences, and course progress. You can control cookie settings in your browser, though disabling cookies may affect platform functionality.</p>
        </div>
        <div class="legal-section">
          <h2>7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and associated data</li>
            <li>Opt-out of marketing communications</li>
          </ul>
          <p style="margin-top:12px;">To exercise these rights, contact us at privacy@cubazeacademy.com.</p>
        </div>
        <div class="legal-section">
          <h2>8. Contact Us</h2>
          <p>For privacy-related queries, contact us at:<br><strong>Email:</strong> privacy@cubazeacademy.com<br><strong>Phone:</strong> +91 98765 43210</p>
        </div>
      </div>
    `;
  },
  init: function () { window.scrollTo({ top: 0, behavior: 'smooth' }); }
};
window.PrivacyComponent = PrivacyComponent;
