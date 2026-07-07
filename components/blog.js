// Cubaze Academy — Blog Page (components/blog.js)
const BlogComponent = {
  _currentCategory: 'All',

  render: function () {
    return `
      <div class="page-hero">
        <div class="container">
          <div class="breadcrumb"><a href="#/">Home</a><span class="sep">/</span><span>Blog</span></div>
          <h1>Cubaze Blog</h1>
          <p>Tips, tutorials, and career guides for 3D artists, video editors, and creative professionals.</p>
        </div>
      </div>

      <section class="section">
        <div class="container">
          <div class="blog-filter-bar" id="blog-filter-bar">
            ${['All','Blender','Premiere Pro','Career','Freelancing','AI Tools'].map(cat =>
              `<button class="blog-filter-btn ${cat === 'All' ? 'active' : ''}" data-cat="${cat}">${cat}</button>`
            ).join('')}
          </div>
          <div class="blog-grid" id="blog-grid">
            ${BlogComponent._renderCards('All')}
          </div>
        </div>
      </section>
    `;
  },

  _renderCards: function (cat) {
    const posts = window.db.getBlogByCategory(cat);
    if (posts.length === 0) return `<p style="text-align:center;color:var(--text-muted);grid-column:1/-1;padding:40px 0;">No posts in this category yet.</p>`;
    return posts.map(p => `
      <div class="blog-card" data-post-id="${p.id}">
        <div class="blog-img"><img src="${p.image}" alt="${p.title}" loading="lazy"></div>
        <div class="blog-body">
          <div class="blog-meta">
            <span class="blog-cat">${p.category}</span>
            <span><i class="fa-regular fa-calendar"></i> ${p.date}</span>
            <span><i class="fa-regular fa-clock"></i> ${p.readTime}</span>
          </div>
          <div class="blog-title">${p.title}</div>
          <div class="blog-excerpt">${p.excerpt}</div>
          <span class="blog-read-more">Read More <i class="fa-solid fa-arrow-right"></i></span>
        </div>
      </div>
    `).join('');
  },

  renderPost: function (postId) {
    const post = window.db.getBlogPostById(postId);
    if (!post) return `<div class="container" style="text-align:center;padding:100px 0;"><h2>Post Not Found</h2><a href="#/blog" class="btn btn-primary" style="margin-top:16px;">Back to Blog</a></div>`;
    return `
      <div class="page-hero">
        <div class="container">
          <div class="breadcrumb"><a href="#/">Home</a><span class="sep">/</span><a href="#/blog">Blog</a><span class="sep">/</span><span>${post.title}</span></div>
          <span class="blog-cat" style="display:inline-block;margin-bottom:12px;">${post.category}</span>
          <h1>${post.title}</h1>
          <div style="display:flex;align-items:center;gap:16px;margin-top:16px;font-size:0.85rem;color:var(--text-muted);">
            <span><i class="fa-regular fa-calendar"></i> ${post.date}</span>
            <span><i class="fa-regular fa-clock"></i> ${post.readTime}</span>
            <span><i class="fa-solid fa-user"></i> ${post.author}</span>
          </div>
        </div>
      </div>
      <div class="container" style="max-width:760px;margin:0 auto;padding-top:48px;padding-bottom:80px;">
        <img src="${post.image}" alt="${post.title}" style="width:100%;border-radius:var(--radius-xl);margin-bottom:40px;box-shadow:var(--shadow-lg);">
        <div style="font-size:1rem;color:var(--text-secondary);line-height:1.9;">${post.content}</div>
        <div style="margin-top:40px;padding-top:32px;border-top:1px solid var(--border-color);display:flex;flex-wrap:wrap;gap:8px;">
          ${post.tags.map(t => `<span style="background:var(--brand-blue-pale);color:var(--brand-blue);padding:5px 14px;border-radius:var(--radius-pill);font-size:0.78rem;font-weight:600;">#${t}</span>`).join('')}
        </div>
        <div style="margin-top:40px;">
          <a href="#/blog" class="btn btn-secondary"><i class="fa-solid fa-arrow-left"></i> Back to Blog</a>
        </div>
      </div>
    `;
  },

  init: function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelectorAll('.blog-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.blog-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-cat');
        document.getElementById('blog-grid').innerHTML = BlogComponent._renderCards(cat);
        BlogComponent.bindCards();
      });
    });
    BlogComponent.bindCards();
  },

  bindCards: function () {
    document.querySelectorAll('.blog-card').forEach(card => {
      card.addEventListener('click', () => {
        window.location.hash = `#/blog/${card.getAttribute('data-post-id')}`;
      });
    });
  },

  initPost: function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
window.BlogComponent = BlogComponent;
