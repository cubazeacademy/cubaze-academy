// Cubaze Academy — Certificate Component (components/certificate.js)
const CertificateComponent = {
  render: function (courseId) {
    const cu = window.db.getCurrentUser();
    if (!cu) return `<div class="container" style="text-align:center;padding:100px 0;"><h2>Please Login</h2><p style="margin:16px 0;">You need to login to view your certificates.</p><button class="btn btn-primary" onclick="window.app.showAuthModal(true)">Login</button></div>`;

    const course = window.db.getCourseById(courseId);
    if (!course) return `<div class="container" style="text-align:center;padding:100px 0;"><h2>Course Not Found</h2><a href="#/dashboard" class="btn btn-primary" style="margin-top:16px;">Back to Dashboard</a></div>`;

    const progress = window.db.getUserProgress(cu.username, courseId);
    if (!progress.certificateEarned) return `
      <div class="container" style="text-align:center;padding:80px 0;">
        <div style="font-size:4rem;margin-bottom:16px;">🔒</div>
        <h2>Certificate Not Yet Earned</h2>
        <p style="margin:16px 0;color:var(--text-secondary);">Complete all lessons and pass the quiz to earn your certificate for <strong>${course.title}</strong>.</p>
        ${(() => {
          const hasLes = course.modules && course.modules.length > 0 && course.modules[0].lessons && course.modules[0].lessons.length > 0;
          if (hasLes) {
            return `<a href="#/lesson/${course.id}/${course.modules[0].lessons[0].id}" class="btn btn-primary">Continue Learning</a>`;
          }
          return `<a href="#/course/${course.id}" class="btn btn-primary">View Course Details</a>`;
        })()}      </div>
    `;

    const enrolledBatches = cu.enrolledBatches || {};
    const batchId = enrolledBatches[courseId];
    const batch = batchId ? window.db.getBatchById(batchId) : null;
    const batchName = batch ? batch.name : '';

    const certNum = `CUBAZE-${courseId.toUpperCase().slice(0,4)}-${cu.username.toUpperCase().slice(0,4)}-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const completionDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    return `
      <div class="certificate-page">
        <div class="container" style="padding-top:48px;padding-bottom:48px;">
          <!-- Actions Bar -->
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap;gap:12px;">
            <div>
              <a href="#/dashboard" style="color:var(--brand-blue);font-size:0.9rem;font-weight:600;display:inline-flex;align-items:center;gap:8px;"><i class="fa-solid fa-arrow-left"></i> Back to Dashboard</a>
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
              <button onclick="window.CertificateComponent.download('${certNum}','${cu.name}','${course.title}','${completionDate}')" class="btn btn-primary"><i class="fa-solid fa-download"></i> Download PDF</button>
              <button onclick="window.CertificateComponent.share()" class="btn btn-secondary"><i class="fa-brands fa-linkedin-in"></i> Share on LinkedIn</button>
            </div>
          </div>

          <!-- Certificate Frame -->
          <div class="certificate-frame" id="certificate-printable">
            <!-- Header -->
            <img src="cubaze-logo.png" alt="Cubaze Academy" class="cert-logo">
            <div class="cert-subtitle">Certificate of Completion</div>
            <div class="cert-title">This is to certify that</div>

            <!-- Student Name -->
            <div class="cert-student-label">Presented to</div>
            <div class="cert-student-name">${cu.name}</div>

            <!-- Course -->
            <div class="cert-for">has successfully completed the course</div>
            <div class="cert-course-name">${course.title}</div>
            ${batchName ? `<div class="cert-batch-name" style="font-size:1.15rem;font-weight:700;color:var(--brand-blue);margin-top:6px;font-family:'Inter',sans-serif;">Batch: ${batchName}</div>` : ''}

            <!-- Stars -->
            <div style="margin-bottom:24px;">
              ${'<i class="fa-solid fa-star" style="color:var(--warning);font-size:1.1rem;margin:0 3px;"></i>'.repeat(5)}
            </div>

            <!-- Meta row -->
            <div class="cert-meta">
              <div class="cert-meta-item">
                <div class="cert-meta-label">Certificate Number</div>
                <div class="cert-meta-value" style="font-size:0.78rem;">${certNum}</div>
              </div>
              <div class="cert-meta-item">
                <div class="cert-meta-label">Completion Date</div>
                <div class="cert-meta-value">${completionDate}</div>
              </div>
              <div class="cert-meta-item">
                <div class="cert-meta-label">Course Duration</div>
                <div class="cert-meta-value">${course.duration}</div>
              </div>
            </div>

            <!-- QR & Signatures -->
            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:24px;">
              <div>
                <div class="cert-qr" title="QR Verification Code">📱</div>
                <div style="font-size:0.72rem;color:var(--text-muted);">Scan to verify</div>
              </div>
              <div style="text-align:center;">
                <div style="font-size:1.8rem;font-weight:900;color:var(--brand-blue);font-style:italic;border-bottom:2px solid var(--border-color);padding-bottom:8px;margin-bottom:6px;">Cubaze Academy</div>
                <div style="font-size:0.75rem;color:var(--text-muted);">Authorized Signature</div>
              </div>
              <div>
                <div style="width:80px;height:80px;background:var(--brand-blue);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 6px;">
                  <i class="fa-solid fa-award" style="color:#fff;font-size:2rem;"></i>
                </div>
                <div style="font-size:0.72rem;color:var(--text-muted);text-align:center;">Official Seal</div>
              </div>
            </div>

            <!-- Footer Note -->
            <div style="margin-top:24px;padding-top:16px;border-top:1px solid var(--border-color);font-size:0.75rem;color:var(--text-muted);">
              This certificate was issued by Cubaze Academy and is valid at cubazeacademy.com/verify
            </div>
          </div>

          <!-- Verification Info -->
          <div style="max-width:800px;margin:32px auto 0;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-xl);padding:24px;display:flex;align-items:center;gap:16px;">
            <div style="width:48px;height:48px;background:var(--success-bg);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1.2rem;">✅</div>
            <div>
              <div style="font-weight:700;font-size:0.9rem;color:var(--text-primary);margin-bottom:4px;">Verified Certificate</div>
              <div style="font-size:0.83rem;color:var(--text-secondary);">Certificate ID: <strong style="color:var(--text-primary);">${certNum}</strong> — This certificate is authentic and can be verified at cubazeacademy.com/verify</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  download: function (certNum, name, course, date) {
    window.app.showToast('Certificate download starting... (PDF generation requires backend)', 'info');
    // In production: use jsPDF or server-side PDF generation
    window.print();
  },

  share: function () {
    window.app.showToast('Opening LinkedIn to share your certificate...', 'success');
    window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent('https://cubazeacademy.com/certificates'), '_blank');
  },

  init: function (courseId) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
window.CertificateComponent = CertificateComponent;
