// Cubaze Academy — Quiz System (components/quiz.js)
const QuizComponent = {
  _state: { answers: {}, current: 0, submitted: false, timeLeft: 0, timer: null },

  render: function (courseId) {
    const cu = window.db.getCurrentUser();
    if (!cu) return `<div class="container" style="text-align:center;padding:100px 0;"><h2>Please Login</h2><button class="btn btn-primary" onclick="window.app.showAuthModal(true)" style="margin-top:16px;">Login</button></div>`;

    const course = window.db.getCourseById(courseId);
    if (!course || !course.quiz) return `<div class="container" style="text-align:center;padding:80px 0;"><h2>Quiz Not Found</h2><a href="#/dashboard" class="btn btn-primary" style="margin-top:16px;">Dashboard</a></div>`;

    const enrolled = cu.enrolledCourses || [];
    if (!enrolled.includes(courseId)) return `<div class="container" style="text-align:center;padding:80px 0;"><h2>Not Enrolled</h2><a href="#/course/${courseId}" class="btn btn-primary" style="margin-top:16px;">View Course</a></div>`;

    const q = course.quiz.questions;
    return `
      <div class="quiz-container">
        <div class="quiz-header">
          <div class="section-label" style="margin:0 auto 12px;"><i class="fa-solid fa-trophy"></i> Final Quiz</div>
          <h2 style="margin-bottom:8px;">${course.title}</h2>
          <p style="color:var(--text-muted);font-size:0.9rem;">${q.length} questions · Pass score: 60% · Earn your certificate!</p>
          <div style="display:flex;align-items:center;gap:12px;justify-content:center;margin-top:12px;">
            <div class="quiz-timer" id="quiz-timer"><i class="fa-solid fa-clock"></i> <span id="timer-display">--:--</span></div>
          </div>
          <div class="quiz-progress-bar" style="margin-top:16px;">
            <div class="quiz-progress-fill" id="quiz-progress" style="width:0%;"></div>
          </div>
          <div style="font-size:0.8rem;color:var(--text-muted);margin-top:4px;text-align:left;" id="quiz-progress-label">Question 0 of ${q.length}</div>
        </div>

        <div id="quiz-body">
          ${QuizComponent._renderQuestions(q)}
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:24px;" id="quiz-nav">
          <button id="quiz-prev" class="btn btn-secondary" style="display:none;"><i class="fa-solid fa-arrow-left"></i> Previous</button>
          <span></span>
          <button id="quiz-next" class="btn btn-primary">Next <i class="fa-solid fa-arrow-right"></i></button>
          <button id="quiz-submit" class="btn btn-success" style="display:none;"><i class="fa-solid fa-paper-plane"></i> Submit Quiz</button>
        </div>
      </div>
    `;
  },

  _renderQuestions: function (questions) {
    return questions.map((q, qi) => `
      <div class="quiz-question-card" id="question-${qi}" style="display:${qi === 0 ? 'block' : 'none'};">
        <div class="quiz-question-num">Question ${qi + 1} of ${questions.length}</div>
        <div class="quiz-question-text">${q.question}</div>
        <div class="quiz-options">
          ${q.options.map((opt, oi) => `
            <div class="quiz-option" data-qi="${qi}" data-oi="${oi}">
              <div class="quiz-option-letter">${['A','B','C','D'][oi]}</div>
              ${opt}
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  },

  _renderResult: function (courseId, score, total, passed) {
    const pct = Math.round((score / total) * 100);
    return `
      <div class="quiz-container">
        <div class="quiz-result-card">
          <div class="quiz-score-circle" style="background:${passed ? 'linear-gradient(135deg,var(--success),#059669)' : 'linear-gradient(135deg,var(--danger),#dc2626)'};">
            <div class="quiz-score-number">${pct}%</div>
          </div>
          <h2 style="margin-bottom:8px;">${passed ? '🎉 Congratulations!' : '😔 Better Luck Next Time'}</h2>
          <p style="color:var(--text-secondary);margin-bottom:24px;">
            You scored <strong>${score} out of ${total}</strong> (${pct}%) — Pass score is 60%
          </p>
          ${passed ? `
            <div style="background:var(--success-bg);border:1px solid rgba(16,185,129,0.3);border-radius:var(--radius-lg);padding:20px;margin-bottom:24px;">
              <i class="fa-solid fa-certificate" style="color:var(--success);font-size:1.5rem;margin-bottom:8px;display:block;"></i>
              <div style="font-weight:700;color:var(--success);margin-bottom:6px;">Your certificate is ready!</div>
              <div style="font-size:0.85rem;color:var(--text-secondary);">You've earned your Cubaze Academy certificate for this course.</div>
            </div>
            <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
              <a href="#/certificate/${courseId}" class="btn btn-primary btn-lg"><i class="fa-solid fa-award"></i> Download Certificate</a>
              <a href="#/dashboard" class="btn btn-secondary">Back to Dashboard</a>
            </div>
          ` : `
            <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
              <button onclick="window.app.renderRoute()" class="btn btn-primary btn-lg"><i class="fa-solid fa-redo"></i> Retry Quiz</button>
              <a href="#/lesson/${courseId}/${window.db.getCourseById(courseId).modules[0].lessons[0].id}" class="btn btn-secondary">Review Lessons</a>
            </div>
          `}
        </div>
      </div>
    `;
  },

  init: function (courseId) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const course = window.db.getCourseById(courseId);
    if (!course || !course.quiz) return;
    const questions = course.quiz.questions;
    const state = QuizComponent._state;
    state.answers = {}; state.current = 0; state.submitted = false;
    state.timeLeft = questions.length * 60; // 1 min per question

    // Timer
    const timerEl = document.getElementById('timer-display');
    if (timerEl) {
      state.timer = setInterval(() => {
        state.timeLeft--;
        const m = Math.floor(state.timeLeft / 60), s = state.timeLeft % 60;
        timerEl.textContent = `${m}:${s.toString().padStart(2,'0')}`;
        if (state.timeLeft <= 0) { clearInterval(state.timer); QuizComponent._submitQuiz(courseId, questions); }
      }, 1000);
    }

    const updateNav = () => {
      document.querySelectorAll('.quiz-question-card').forEach((card, i) => card.style.display = i === state.current ? 'block' : 'none');
      document.getElementById('quiz-prev').style.display = state.current > 0 ? 'flex' : 'none';
      document.getElementById('quiz-next').style.display = state.current < questions.length - 1 ? 'flex' : 'none';
      document.getElementById('quiz-submit').style.display = state.current === questions.length - 1 ? 'flex' : 'none';
      const pct = ((state.current + 1) / questions.length) * 100;
      document.getElementById('quiz-progress').style.width = pct + '%';
      document.getElementById('quiz-progress-label').textContent = `Question ${state.current + 1} of ${questions.length}`;
    };
    updateNav();

    // Option selection
    document.querySelectorAll('.quiz-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const qi = parseInt(opt.getAttribute('data-qi'));
        const oi = parseInt(opt.getAttribute('data-oi'));
        state.answers[qi] = oi;
        document.querySelectorAll(`.quiz-option[data-qi="${qi}"]`).forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
      });
    });

    document.getElementById('quiz-next')?.addEventListener('click', () => { if (state.current < questions.length - 1) { state.current++; updateNav(); } });
    document.getElementById('quiz-prev')?.addEventListener('click', () => { if (state.current > 0) { state.current--; updateNav(); } });
    document.getElementById('quiz-submit')?.addEventListener('click', () => QuizComponent._submitQuiz(courseId, questions));
  },

  _submitQuiz: function (courseId, questions) {
    clearInterval(QuizComponent._state.timer);
    const answers = QuizComponent._state.answers;
    let score = 0;
    questions.forEach((q, i) => { if (answers[i] === q.answer) score++; });
    const passed = (score / questions.length) >= 0.6;
    const cu = window.db.getCurrentUser();
    if (cu) window.db.saveQuizProgress(cu.username, courseId, score, passed);
    document.getElementById('app-view').innerHTML = QuizComponent._renderResult(courseId, score, questions.length, passed);
  }
};
window.QuizComponent = QuizComponent;
