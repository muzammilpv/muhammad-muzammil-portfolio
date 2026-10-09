/**
 * MUHAMMAD MUZAMMIL - MAIN PORTFOLIO CONTROLLER
 * Fixed modal gallery rendering so all projects appear immediately when "SEE MY WORKS" is clicked.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initStickyHeader();
  initMobileMenu();
  renderCompactSelectedWorks();
  renderGalleryWorks('all');
  initWorksGalleryModal();
  initFilterTabs();
  initVideoObservers();
  initScrollAnimations();
  initContactModal();
});

/* ==========================================================================
   CUSTOM CURSOR SYSTEM
   ========================================================================== */
function initCustomCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const ring = document.querySelector('.custom-cursor-ring');

  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverSelectors = 'a, button, .project-card, .service-card, .filter-tab-btn, .skill-pill, .contact-info-card, .trigger-works-gallery';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelectors)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSelectors)) {
      document.body.classList.remove('cursor-hover');
    }
  });
}

/* ==========================================================================
   STICKY HEADER & NAV HIGHLIGHT
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   MOBILE HAMBURGER MENU
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.hamburger-toggle');
  const overlay = document.querySelector('.mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !overlay) return;

  function toggleMenu() {
    const isOpen = toggleBtn.classList.toggle('is-active');
    overlay.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  toggleBtn.addEventListener('click', toggleMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (overlay.classList.contains('is-open')) {
        toggleMenu();
      }
    });
  });
}

/* ==========================================================================
   MAIN PAGE COMPACT WORKS HIGHLIGHT
   ========================================================================== */
function renderCompactSelectedWorks() {
  const container = document.getElementById('selected-works-grid');
  if (!container) return;

  container.innerHTML = projectsData.map(p => createProjectCardHTML(p, true, true)).join('');
  attachProjectCardEvents(container);
}

function renderGalleryWorks(category = 'all') {
  const container = document.getElementById('gallery-works-grid');
  if (!container) return;

  const filtered = category === 'all' 
    ? projectsData 
    : projectsData.filter(p => p.filterCategory === category);

  container.innerHTML = filtered.map(p => createProjectCardHTML(p, false, true)).join('');
  attachProjectCardEvents(container);
  initVideoObservers();
}

function createProjectCardHTML(p, isCompact = false, forceVisible = true) {
  const isVideo = p.videoUrl && p.videoUrl.length > 0;
  
  return `
    <article class="project-card size-${isCompact ? 'medium' : p.gridSize} ${forceVisible ? 'in-view' : ''}" data-project-id="${p.id}">
      <div class="project-media-wrapper">
        ${isVideo ? `
          <video class="project-video" muted loop playsinline preload="none" poster="${p.posterUrl}" data-src="${p.videoUrl}">
          </video>
        ` : `
          <img src="${p.posterUrl}" alt="${p.title}" class="project-img" loading="lazy">
        `}
        <div class="project-media-overlay">
          <span class="project-number">${p.number}</span>
          <span class="project-hover-badge">VIEW PROJECT ↗</span>
        </div>
      </div>
      <div class="project-info">
        <span class="project-category">${p.category}</span>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-description">${p.description}</p>
        <div class="project-tags-list">
          ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
        </div>
      </div>
    </article>
  `;
}

function attachProjectCardEvents(container) {
  container.querySelectorAll('.project-card').forEach(card => {
    const video = card.querySelector('video.project-video');

    card.addEventListener('mouseenter', () => {
      if (video) {
        if (!video.src && video.dataset.src) {
          video.src = video.dataset.src;
        }
        video.play().catch(() => {});
      }
    });

    card.addEventListener('mouseleave', () => {
      if (video) {
        video.pause();
      }
    });

    card.addEventListener('click', () => {
      const id = card.getAttribute('data-project-id');
      const project = projectsData.find(p => p.id === id);
      if (project) {
        openProjectModal(project);
      }
    });
  });
}

/* ==========================================================================
   "SEE MY WORKS" GALLERY DRAWER MODAL
   ========================================================================== */
function initWorksGalleryModal() {
  const triggers = document.querySelectorAll('.trigger-works-gallery');
  const backdrop = document.getElementById('works-gallery-modal');
  const closeBtn = document.getElementById('works-gallery-close');

  if (!backdrop) return;

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      renderGalleryWorks('all');
      backdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });
}

/* ==========================================================================
   FILTER TABS CONTROLLER
   ========================================================================== */
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-filter');
      renderGalleryWorks(cat);
    });
  });
}

/* ==========================================================================
   PROJECT DETAIL MODAL (CASE STUDY)
   ========================================================================== */
function openProjectModal(project) {
  const backdrop = document.getElementById('project-modal');
  const container = backdrop.querySelector('.modal-content-container');

  const isVideo = project.videoUrl && project.videoUrl.length > 0;

  const html = `
    <div class="modal-top-nav">
      <button class="modal-back-btn" id="modal-back-btn">
        <i class="fa-solid fa-arrow-left"></i> BACK TO WORKS
      </button>
      <button class="modal-close-icon" id="modal-close" aria-label="Close modal">&times;</button>
    </div>

    <div class="modal-media-wrapper">
      ${isVideo ? `
        <video controls autoplay loop playsinline class="modal-video" poster="${project.posterUrl}">
          <source src="${project.videoUrl}" type="video/mp4">
        </video>
      ` : `
        <img src="${project.posterUrl}" alt="${project.title}" style="width:100%; max-height:65vh; object-fit:contain;">
      `}
    </div>

    <div style="padding: 1.75rem 2rem;">
      <div class="modal-header-block" style="margin-bottom: 1.5rem;">
        <span class="modal-category" style="color:var(--accent-amber); font-weight:600; font-size:0.85rem; letter-spacing:0.1em; text-transform:uppercase;">${project.category} • ${project.year || '2026'}</span>
        <h2 class="modal-title" style="font-size: clamp(1.5rem, 3vw, 2.2rem); margin: 0.4rem 0 0.75rem 0; color: var(--text-primary); font-weight: 700;">${project.title}</h2>
      </div>

      <div class="modal-body-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div>
          <h4 class="modal-section-title" style="color: var(--accent-amber); margin-bottom: 0.6rem; font-size: 0.9rem; letter-spacing: 0.08em; text-transform: uppercase;">About the Project</h4>
          <p class="modal-text" style="color: var(--text-secondary); line-height: 1.65; font-size: 0.95rem;">${project.description}</p>
          
          ${project.features ? `
            <div style="margin-top: 1.5rem;">
              <h4 class="modal-section-title" style="color: var(--accent-amber); margin-bottom: 0.6rem; font-size: 0.9rem; letter-spacing: 0.08em; text-transform: uppercase;">Key Features</h4>
              <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">
                <div><strong style="color:var(--accent-amber)">STUDENT PORTAL:</strong> ${project.features.student.join(', ')}</div>
                <div><strong style="color:var(--accent-amber)">TEACHER PORTAL:</strong> ${project.features.teacher.join(', ')}</div>
                <div><strong style="color:var(--accent-amber)">ADMIN CONSOLE:</strong> ${project.features.admin.join(', ')}</div>
              </div>
            </div>
          ` : ''}
        </div>

        <div>
          ${project.creativeApproach && project.creativeApproach.length ? `
            <h4 class="modal-section-title" style="color: var(--accent-amber); margin-bottom: 0.6rem; font-size: 0.9rem; letter-spacing: 0.08em; text-transform: uppercase;">Creative Approach</h4>
            <ul style="list-style: none; padding: 0; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
              ${project.creativeApproach.map(item => `<li style="color: var(--text-secondary); font-size: 0.9rem; position: relative; padding-left: 1.25rem;"><span style="position: absolute; left: 0; color: var(--accent-amber);">•</span> ${item}</li>`).join('')}
            </ul>
          ` : ''}

          <h4 class="modal-section-title" style="color: var(--accent-amber); margin-bottom: 0.6rem; font-size: 0.9rem; letter-spacing: 0.08em; text-transform: uppercase;">Tools & Tags</h4>
          <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
            ${(project.tags || []).map(t => `<span style="border: 1px solid var(--border-amber); background: var(--bg-card); color: var(--text-primary); padding: 0.35rem 0.85rem; border-radius: 20px; font-size: 0.78rem; font-weight: 600;">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
  backdrop.classList.add('is-open');
  document.body.style.overflow = 'hidden';

  const backBtn = document.getElementById('modal-back-btn');
  const closeBtn = document.getElementById('modal-close');

  if (backBtn) backBtn.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  backdrop.onclick = (e) => {
    if (e.target === backdrop) closeModal();
  };

  window.onkeydown = (e) => {
    if (e.key === 'Escape') closeModal();
  };
}

function closeModal() {
  const backdrop = document.getElementById('project-modal');
  backdrop.classList.remove('is-open');
  document.body.style.overflow = '';
  const video = backdrop.querySelector('video');
  if (video) video.pause();
}

/* ==========================================================================
   LAZY VIDEO VIEWPORT OBSERVER
   ========================================================================== */
function initVideoObservers() {
  const videos = document.querySelectorAll('video.project-video');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (!entry.isIntersecting) {
        video.pause();
      }
    });
  }, { threshold: 0.1 });

  videos.forEach(v => observer.observe(v));
}

/* ==========================================================================
   SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   INTERACTIVE CONTACT FORM MODAL
   ========================================================================== */
function initContactModal() {
  const openBtns = document.querySelectorAll('.trigger-contact-modal');
  const backdrop = document.getElementById('contact-modal');
  const closeBtn = document.getElementById('contact-modal-close');
  const form = document.getElementById('contact-form');

  if (!backdrop) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      backdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.innerText = 'MESSAGE SENT ✓';
      submitBtn.style.backgroundColor = '#10b981';
      setTimeout(() => {
        backdrop.classList.remove('is-open');
        document.body.style.overflow = '';
        form.reset();
        submitBtn.innerText = 'SEND MESSAGE →';
        submitBtn.style.backgroundColor = '';
      }, 1500);
    });
  }
}
