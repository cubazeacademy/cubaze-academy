// Cubaze Academy — Contact Page (components/contact.js)
const ContactComponent = {
  render: function () {
    return `
      <div class="page-hero">
        <div class="container">
          <div class="breadcrumb"><a href="#/">Home</a><span class="sep">/</span><span>Contact</span></div>
          <h1>Get in Touch</h1>
          <p>Have a question, feedback, or need help? We're here for you. Reach out anytime.</p>
        </div>
      </div>

      <section class="section">
        <div class="container">
          <div class="contact-grid">
            <!-- Contact Info -->
            <div>
              <h2 style="margin-bottom:32px;">We'd Love to Hear From You</h2>
              <div style="display:flex;flex-direction:column;gap:16px;margin-bottom:40px;">
                <div class="contact-info-item">
                  <div class="contact-info-icon"><i class="fa-solid fa-envelope"></i></div>
                  <div class="contact-info-text">
                    <h4>Email Support</h4>
                    <p>cubazeacademy@gmail.com</p>
                    <p style="font-size:0.78rem;color:var(--text-muted);">We typically respond within 24 hours</p>
                  </div>
                </div>
                <div class="contact-info-item">
                  <div class="contact-info-icon"><i class="fa-brands fa-whatsapp" style="color:#25D366;"></i></div>
                  <div class="contact-info-text">
                    <h4>WhatsApp</h4>
                    <p><a href="https://wa.me/916235651852" target="_blank" style="color:var(--brand-blue);">+91 6235651852</a></p>
                    <p style="font-size:0.78rem;color:var(--text-muted);">Mon–Sat, 9 AM – 8 PM IST</p>
                  </div>
                </div>
                <div class="contact-info-item">
                  <div class="contact-info-icon"><i class="fa-solid fa-phone"></i></div>
                  <div class="contact-info-text">
                    <h4>Phone</h4>
                    <p>+91 6235651852</p>
                    <p style="font-size:0.78rem;color:var(--text-muted);">Mon–Sat, 9 AM – 6 PM IST</p>
                  </div>
                </div>
                <div class="contact-info-item">
                  <div class="contact-info-icon"><i class="fa-solid fa-location-dot"></i></div>
                  <div class="contact-info-text">
                    <h4>Office</h4>
                    <p>Cubaze Academy, Tech Park, Bangalore, Karnataka, India — 560001</p>
                  </div>
                </div>
              </div>
              <!-- Map -->
              <div class="contact-map">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.886539092!2d77.49085452708696!3d12.95428023822568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1720300000000!5m2!1sen!2sin" width="100%" height="280" style="border:0;display:block;" allowfullscreen="" loading="lazy"></iframe>
              </div>
            </div>

            <!-- Contact Form -->
            <div>
              <div class="glass-panel">
                <h3 style="margin-bottom:24px;"><i class="fa-solid fa-paper-plane" style="color:var(--brand-blue);margin-right:8px;"></i>Send Us a Message</h3>
                <form id="form-contact">
                  <div class="form-group">
                    <label for="c-name"><i class="fa-solid fa-user"></i> Full Name</label>
                    <input type="text" id="c-name" required placeholder="Your full name">
                  </div>
                  <div class="form-group">
                    <label for="c-email"><i class="fa-solid fa-envelope"></i> Email Address</label>
                    <input type="email" id="c-email" required placeholder="your@email.com">
                  </div>
                  <div class="form-group">
                    <label for="c-subject"><i class="fa-solid fa-tag"></i> Subject</label>
                    <select id="c-subject">
                      <option>Course Inquiry</option>
                      <option>Technical Support</option>
                      <option>Payment Issue</option>
                      <option>Certificate Request</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="c-message"><i class="fa-solid fa-comment"></i> Message</label>
                    <textarea id="c-message" rows="5" required placeholder="Tell us how we can help you..."></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary btn-block">Send Message <i class="fa-solid fa-paper-plane"></i></button>
                </form>
              </div>

              <!-- Social Links -->
              <div style="margin-top:24px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-xl);padding:24px;">
                <h4 style="margin-bottom:16px;">Follow Us on Social Media</h4>
                <div style="display:flex;gap:12px;flex-wrap:wrap;">
                  ${[['fa-brands fa-youtube','YouTube','youtube.com','#FF0000'],['fa-brands fa-instagram','Instagram','instagram.com','#E4405F'],['fa-brands fa-telegram','Telegram','t.me','#2CA5E0'],['fa-brands fa-linkedin-in','LinkedIn','linkedin.com','#0077B5']].map(([icon, name, url, color]) => `
                    <a href="https://${url}" target="_blank" style="display:flex;align-items:center;gap:8px;padding:10px 16px;background:var(--bg-primary);border:1px solid var(--border-color);border-radius:var(--radius-md);font-size:0.83rem;font-weight:600;color:var(--text-secondary);transition:var(--transition);text-decoration:none;" onmouseover="this.style.borderColor='${color}';this.style.color='${color}';" onmouseout="this.style.borderColor='';this.style.color='';">
                      <i class="${icon}" style="color:${color};"></i>${name}
                    </a>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },
  init: function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('form-contact')?.addEventListener('submit', e => {
      e.preventDefault();
      window.app.showToast('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
      e.target.reset();
    });
  }
};
window.ContactComponent = ContactComponent;
