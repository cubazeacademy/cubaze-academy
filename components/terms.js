// Cubaze Academy — Terms & Conditions (components/terms.js)
const TermsComponent = {
  render: function () {
    return `
      <div class="page-hero">
        <div class="container">
          <div class="breadcrumb"><a href="#/">Home</a><span class="sep">/</span><span>Terms & Conditions</span></div>
          <h1>Terms & Conditions</h1>
          <p>Please read these terms carefully before using Cubaze Academy.</p>
        </div>
      </div>
      <div class="legal-layout container">
        <div class="legal-section">
          <h2>1. Introduction</h2>
          <p>Welcome to Cubaze Academy! By accessing or using our online courses, you agree to comply with and be bound by the following terms and conditions. Please review them carefully. If you do not agree with these terms, you should not use our services.</p>
        </div>
        
        <div class="legal-section">
          <h2>2. Course Access and Enrollment</h2>
          <p><strong>Eligibility:</strong> You must be at least 13 years old to enroll in our courses. If you are under 13, you may only use our services with the involvement of a parent or guardian.</p>
          <p><strong>Account:</strong> To access our courses, you must create an account. You are responsible for maintaining the confidentiality of your account and password and for all activities that occur under your account.</p>
          <p><strong>Course Access:</strong> Once enrolled, you will have access to the course materials for lifetime.</p>
        </div>
        
        <div class="legal-section">
          <h2>3. Payment and Pricing</h2>
          <p><strong>Pricing:</strong> All prices for courses are displayed on our website and are subject to change without notice.</p>
          <p><strong>Payment:</strong> Payment for courses must be made in full at the time of enrollment. We accept various payment methods as indicated on our website.</p>
        </div>
        
        <div class="legal-section">
          <h2>4. Course Materials and License</h2>
          <p><strong>License:</strong> Upon enrollment, Cubaze Academy grants you a limited, non-exclusive, non-transferable license to access and use the course materials for personal, non-commercial use.</p>
          <p><strong>Prohibited Uses:</strong> You may not reproduce, distribute, modify, or create derivative works of any course materials without prior written consent from Cubaze Academy.</p>
        </div>
        
        <div class="legal-section">
          <h2>5. Privacy Policy</h2>
          <p><strong>Data Collection:</strong> We collect personal information such as your name, email address, and payment details to provide our services.</p>
          <p><strong>Data Use:</strong> Your information is used to process enrollments, provide customer support, and improve our services. We do not sell or share your personal data with third parties without your consent, except as required by law.</p>
          <p><strong>Security:</strong> We implement reasonable security measures to protect your personal information from unauthorized access, use, or disclosure.</p>
          <p><strong>Course Termination:</strong> Cubaze Academy reserves the right to terminate your access to a course if you violate these terms and conditions.</p>
        </div>
        
        <div class="legal-section">
          <h2>6. Limitation of Liability</h2>
          <p><strong>Disclaimer:</strong> Cubaze Academy provides courses “as is” and makes no representations or warranties of any kind, express or implied, regarding the course materials or services.</p>
          <p><strong>Liability:</strong> To the fullest extent permitted by law, Cubaze Academy shall not be liable for any indirect, incidental, or consequential damages arising out of or in connection with your use of our courses.</p>
        </div>
        
        <div class="legal-section">
          <h2>7. Changes to Terms and Conditions</h2>
          <p><strong>Modifications:</strong> Cubaze Academy reserves the right to modify these terms and conditions at any time. We will notify you of any changes by posting the new terms on our website. Your continued use of our services after such changes constitutes your acceptance of the new terms.</p>
        </div>
        
        <div class="legal-section">
          <h2>8. Governing Law</h2>
          <p><strong>Jurisdiction:</strong> These terms and conditions are governed by India and construed in accordance with the laws of the jurisdiction in which Cubaze Academy operates, without regard to its conflict of law principles.</p>
        </div>
        
        <div class="legal-section">
          <h2>9. Contact Information</h2>
          <p>If you have any questions or concerns about these terms and conditions, please contact our support team at:</p>
          <ul style="list-style:none; padding-left:0; margin-top:12px; line-height:1.8;">
            <li><strong>Email:</strong> <a href="mailto:cubazeacademy@gmail.com" style="color:var(--brand-blue); font-weight:600;">cubazeacademy@gmail.com</a></li>
            <li><strong>Phone:</strong> <a href="tel:+917510337087" style="color:var(--brand-blue); font-weight:600;">+91 7510337087</a></li>
            <li><strong>Operational Address:</strong> Omanoor, Kondotty, Olavattor (po) 673638 (PIN), Malappuram (dist), Kerala, India</li>
          </ul>
        </div>
        
        <div class="legal-section" style="border-top:1px solid var(--border-color); padding-top:24px; margin-top:32px;">
          <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.6;">
            By using Cubaze Academy, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.
          </p>
          <p style="font-weight:700; margin-top:16px; color:var(--text-primary); font-size:0.95rem;">
            Business Name: MOHAMMED SINAN M P
          </p>
        </div>
      </div>
    `;
  },
  init: function () { window.scrollTo({ top: 0, behavior: 'smooth' }); }
};
window.TermsComponent = TermsComponent;
