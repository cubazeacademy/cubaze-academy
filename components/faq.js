// Cubaze Academy — FAQ Page (components/faq.js)
const FaqPageComponent = {
  render: function () {
    const faqData = window.db.getFAQ();
    const sectionsHtml = faqData.map((section, si) => `
      <div style="margin-bottom:48px;">
        <h3 style="font-size:1.1rem;font-weight:700;color:var(--brand-blue);margin-bottom:20px;display:flex;align-items:center;gap:10px;">
          <div style="width:8px;height:8px;background:var(--brand-blue);border-radius:50%;"></div>
          ${section.category}
        </h3>
        <div class="faq-list" id="faq-section-${si}">
          ${section.questions.map((item, qi) => `
            <div class="faq-item" data-si="${si}" data-qi="${qi}">
              <div class="faq-question">
                <span>${item.q}</span>
                <div class="faq-icon"><i class="fa-solid fa-plus"></i></div>
              </div>
              <div class="faq-answer">
                <div class="faq-answer-inner">${item.a}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    return `
      <div class="page-hero">
        <div class="container">
          <div class="breadcrumb"><a href="#/">Home</a><span class="sep">/</span><span>FAQ</span></div>
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about Cubaze Academy. Can't find what you're looking for? <a href="#/contact" style="color:var(--brand-blue);">Contact us</a>.</p>
        </div>
      </div>
      <section class="section">
        <div class="container" style="max-width:800px;margin:0 auto;">
          ${sectionsHtml}
          <div class="cta-banner" style="margin-top:40px;">
            <h2 style="font-size:1.5rem;">Still Have Questions?</h2>
            <p>Our support team is ready to help you.</p>
            <a href="#/contact" class="btn btn-white btn-lg" style="position:relative;z-index:1;">Contact Support</a>
          </div>
        </div>
      </section>
    `;
  },
  init: function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelectorAll('.faq-item').forEach(item => {
      item.querySelector('.faq-question').addEventListener('click', () => {
        const si = item.getAttribute('data-si');
        const isActive = item.classList.contains('active');
        document.querySelectorAll(`.faq-item[data-si="${si}"]`).forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    });
  }
};
window.FaqPageComponent = FaqPageComponent;
