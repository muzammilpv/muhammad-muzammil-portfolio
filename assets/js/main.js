/**
 * MUHAMMAD MUZAMMIL - MAIN PORTFOLIO CONTROLLER
 * Fixed modal gallery rendering so all projects appear immediately when "SEE MY WORKS" is clicked.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  renderCompactSelectedWorks();
  initWorksGalleryModal();
  initFilterTabs();
  initVideoObservers();
  initScrollAnimations();
  initContactModal();
  initCustomCursor();
  initInstagramDeepLinks();
  
  // Ensure direct contact cards and social links handle navigation cleanly without interference
  document.querySelectorAll('a.contact-info-card').forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });
  
  // Lazy pre-render gallery in background idle time
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => renderGalleryWorks('all'));
  } else {
    setTimeout(() => renderGalleryWorks('all'), 1500);
  }
});

/* ==========================================================================
   CUSTOM CURSOR SYSTEM (OPTIMIZED FOR ZERO LAG)
   ========================================================================== */
function initCustomCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const ring = document.querySelector('.custom-cursor-ring');

  if (!dot || !ring) return;

  // Disable custom cursor on touch devices / mobile phones to prevent lag
  if (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    return;
  }

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  }, { passive: true });

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
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSelectors)) {
      document.body.classList.remove('cursor-hover');
    }
  }, { passive: true });
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
    <article class="project-card size-${isCompact ? 'medium' : p.gridSize} ${forceVisible ? 'in-view' : ''}" data-project-id="${p.id}" ${p.liveUrl ? `data-live-url="${p.liveUrl}"` : ''}>
      <div class="project-media-wrapper">
        ${isVideo ? `
          <video class="project-video" muted loop playsinline preload="none" poster="${p.posterUrl}" data-src="${p.videoUrl}">
          </video>
        ` : `
          <img src="${p.posterUrl}" alt="${p.title}" class="project-img" loading="lazy">
        `}
        <div class="project-media-overlay">
          <span class="project-number">${p.number}</span>
          ${p.liveUrl ? `
            <a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-hover-badge card-direct-link" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.4rem;">
              VISIT WEBSITE <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.75em;"></i>
            </a>
          ` : `
            <span class="project-hover-badge">VIEW PROJECT ↗</span>
          `}
        </div>
      </div>
      <div class="project-info">
        <span class="project-category">${p.category}</span>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-description">${p.description}</p>
        ${p.liveUrl ? `
          <div style="margin: 0.6rem 0;">
            <a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="card-direct-link" style="color: var(--accent-amber); font-size: 0.85rem; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.35rem 0.8rem; border: 1px solid rgba(245, 158, 11, 0.5); border-radius: 6px; background: rgba(245, 158, 11, 0.12);">
              <i class="fa-solid fa-globe"></i> ${p.liveUrl.replace('https://', '')} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.72rem;"></i>
            </a>
          </div>
        ` : ''}
        <div class="project-tags-list">
          ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
        </div>
      </div>
    </article>
  `;
}

function attachProjectCardEvents(container) {
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

  container.querySelectorAll('.project-card').forEach(card => {
    const video = card.querySelector('video.project-video');
    const liveUrl = card.getAttribute('data-live-url');

    // Only attach hover preview playback on desktop mouse devices (never on mobile touch)
    if (!isTouchDevice && video) {
      card.addEventListener('mouseenter', () => {
        if (!video.src && video.dataset.src) {
          video.src = video.dataset.src;
        }
        video.play().catch(() => {});
      });

      card.addEventListener('mouseleave', () => {
        video.pause();
      });
    }

    // Direct click handler on the entire card
    card.addEventListener('click', (e) => {
      // Pause all background/preview videos immediately
      document.querySelectorAll('video').forEach(v => {
        try { v.pause(); } catch (err) {}
      });

      // If this card is a live website (like Edexora), directly open the website in a new tab
      if (liveUrl) {
        e.preventDefault();
        e.stopPropagation();
        window.open(liveUrl, '_blank', 'noopener,noreferrer');
        return;
      }

      if (e.target.closest('.card-direct-link')) {
        return;
      }

      const id = card.getAttribute('data-project-id');
      const project = projectsData.find(p => p.id === id);
      if (project) {
        openProjectModal(project);
      }
    });

    // Also explicit click handler on .card-direct-link to guarantee opening website
    card.querySelectorAll('.card-direct-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('video').forEach(v => {
          try { v.pause(); } catch (err) {}
        });
        const targetUrl = link.getAttribute('href') || liveUrl;
        if (targetUrl) {
          e.preventDefault();
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }
      });
    });
  });
}

/* ==========================================================================
   "SEE MY WORKS" GALLERY DRAWER MODAL
   ========================================================================== */
function closeGalleryModal(triggerHistoryBack = false) {
  const backdrop = document.getElementById('works-gallery-modal');
  if (!backdrop) return;
  backdrop.classList.remove('is-open');
  document.body.style.overflow = '';
  document.querySelectorAll('video').forEach(v => {
    try { v.pause(); } catch(e) {}
  });
  if (triggerHistoryBack && window.history.state && window.history.state.modal === 'works-gallery') {
    window.history.back();
  }
}

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
      window.history.pushState({ modal: 'works-gallery' }, '');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeGalleryModal(true));
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeGalleryModal(true);
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
   VIDEO CLEANUP HELPER (GUARANTEES NO AUDIO IN BACKGROUND)
   ========================================================================== */
function stopAndDestroyVideo(v) {
  if (!v) return;
  try {
    v.pause();
    v.muted = true;
    v.volume = 0;
    v.currentTime = 0;
    v.removeAttribute('src');
    const sources = v.querySelectorAll('source');
    sources.forEach(s => {
      s.removeAttribute('src');
      s.src = '';
    });
    v.load();
  } catch (e) {}
}

/* ==========================================================================
   PROJECT DETAIL MODAL (CASE STUDY)
   ========================================================================== */
function openProjectModal(project) {
  if (project.liveUrl && (!project.videoUrl || project.videoUrl.length === 0)) {
    // Pure website project: directly open live website in a new tab without modal or video
    window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
    return;
  }

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
        <video controls autoplay loop playsinline webkit-playsinline class="modal-video" poster="${project.posterUrl}" src="${project.videoUrl}">
          <source src="${project.videoUrl}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      ` : `
        <img src="${project.posterUrl}" alt="${project.title}" style="width:100%; max-height:65vh; object-fit:contain;">
      `}
    </div>

    <div style="padding: 1.75rem 2rem;">
      <div class="modal-header-block" style="margin-bottom: 1.5rem;">
        <span class="modal-category" style="color:var(--accent-amber); font-weight:600; font-size:0.85rem; letter-spacing:0.1em; text-transform:uppercase;">${project.category} • ${project.year || '2026'}</span>
        <h2 class="modal-title" style="font-size: clamp(1.5rem, 3vw, 2.2rem); margin: 0.4rem 0 0.75rem 0; color: var(--text-primary); font-weight: 700;">${project.title}</h2>
        ${project.liveUrl ? `
          <div style="margin-top: 1rem; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
            <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary-amber" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem; padding: 0.75rem 1.6rem; border-radius: 6px; font-weight:700; font-size: 0.9rem;">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> VISIT LIVE WEBSITE
            </a>
            <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-amber); font-size: 0.88rem; text-decoration: underline; word-break: break-all;">
              ${project.liveUrl}
            </a>
          </div>
        ` : ''}
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

  // Push history state so Android/iOS back button or gesture closes the modal cleanly
  window.history.pushState({ modal: 'project-detail' }, '');

  const modalVideo = container.querySelector('video.modal-video');
  if (modalVideo) {
    modalVideo.load();
    const playPromise = modalVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy fallback: mute and play
        modalVideo.muted = true;
        modalVideo.play().catch(() => {});
      });
    }
  }

  const backBtn = document.getElementById('modal-back-btn');
  const closeBtn = document.getElementById('modal-close');

  if (backBtn) backBtn.addEventListener('click', () => closeModal(true));
  if (closeBtn) closeBtn.addEventListener('click', () => closeModal(true));

  backdrop.onclick = (e) => {
    if (e.target === backdrop) closeModal(true);
  };

  window.onkeydown = (e) => {
    if (e.key === 'Escape') closeModal(true);
  };
}

function closeModal(triggerHistoryBack = false) {
  const backdrop = document.getElementById('project-modal');
  if (!backdrop) return;
  backdrop.classList.remove('is-open');

  // Immediately kill and unload all video and audio elements inside modal
  const videos = backdrop.querySelectorAll('video');
  videos.forEach(v => stopAndDestroyVideo(v));

  // Clear modal DOM so no hidden media node can keep running in background
  const container = backdrop.querySelector('.modal-content-container');
  if (container) {
    container.innerHTML = '';
  }

  // Safety: pause any other video on the page
  document.querySelectorAll('video').forEach(v => {
    try { v.pause(); } catch (e) {}
  });

  const galleryModal = document.getElementById('works-gallery-modal');
  if (!galleryModal || !galleryModal.classList.contains('is-open')) {
    document.body.style.overflow = '';
  }

  if (triggerHistoryBack && window.history.state && window.history.state.modal === 'project-detail') {
    window.history.back();
  }
}

/* ==========================================================================
   GLOBAL BACK NAVIGATION & AUDIO SAFETY LISTENERS
   ========================================================================== */
window.addEventListener('popstate', () => {
  const projectModal = document.getElementById('project-modal');
  if (projectModal && projectModal.classList.contains('is-open')) {
    closeModal(false);
    return;
  }

  const galleryModal = document.getElementById('works-gallery-modal');
  if (galleryModal && galleryModal.classList.contains('is-open')) {
    closeGalleryModal(false);
    return;
  }
});

// Immediately stop audio if browser tab is switched or minimized
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.querySelectorAll('video').forEach(v => {
      try { v.pause(); } catch (e) {}
    });
  }
});

window.addEventListener('pagehide', () => {
  document.querySelectorAll('video').forEach(v => {
    try { v.pause(); } catch (e) {}
  });
});

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
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      const nameInput = form.querySelector('input[name="name"]');
      const emailInput = form.querySelector('input[name="email"]');
      const projectInput = form.querySelector('input[name="project_type"]');
      const messageInput = form.querySelector('textarea[name="message"]');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const projectType = projectInput ? projectInput.value.trim() : 'General Inquiry';
      const message = messageInput ? messageInput.value.trim() : '';

      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> SENDING...';
      submitBtn.disabled = true;

      try {
        const response = await fetch('https://formsubmit.co/ajax/muzammilmuthu546@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `⚡ New Project Request: ${name} (${projectType})`,
            _template: 'table',
            _captcha: 'false',
            "Client Name": name,
            "Client Email": email,
            "Project Type": projectType,
            "Message / Brief": message
          })
        });

        if (response.ok) {
          submitBtn.innerText = 'MESSAGE SENT ✓';
          submitBtn.style.backgroundColor = '#10b981';
          submitBtn.style.borderColor = '#10b981';

          setTimeout(() => {
            backdrop.classList.remove('is-open');
            document.body.style.overflow = '';
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.style.backgroundColor = '';
            submitBtn.style.borderColor = '';
            submitBtn.disabled = false;
          }, 2000);
        } else {
          throw new Error('FormSubmit response not ok');
        }
      } catch (err) {
        const mailtoUrl = `mailto:muzammilmuthu546@gmail.com?subject=${encodeURIComponent(`Project Request from ${name}`)}&body=${encodeURIComponent(`Client Name: ${name}\nClient Email: ${email}\nProject Type: ${projectType}\n\nMessage:\n${message}`)}`;
        window.location.href = mailtoUrl;

        submitBtn.innerText = 'OPENING MAIL APP...';
        setTimeout(() => {
          backdrop.classList.remove('is-open');
          document.body.style.overflow = '';
          form.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 2000);
      }
    });
  }
}

/* ==========================================================================
   INSTAGRAM DEEP LINKING (DIRECT PROFILE LAUNCHER)
   Bypasses Instagram background video/reel cache on Android & iOS by using
   explicit user profile schemes, landing users strictly on the @ai_muzammil_
   profile view.
   ========================================================================== */
function initInstagramDeepLinks() {
  const username = 'ai_muzammil_';
  const webUrl = `https://www.instagram.com/${username}/`;
  const igLinks = document.querySelectorAll('a[href*="instagram.com/ai_muzammil_"], .ig-profile-link');

  igLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation();
      const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';

      if (/android/i.test(userAgent)) {
        e.preventDefault();
        // Android Intent specifically routes to the user profile (_u/username), resetting any active video/reel
        const intentUrl = `intent://instagram.com/_u/${username}/#Intent;package=com.instagram.android;scheme=https;end;`;
        window.location.href = intentUrl;
        setTimeout(() => {
          window.location.href = webUrl;
        }, 1200);
      } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        e.preventDefault();
        // iOS custom URL scheme routes directly to the user profile
        window.location.href = `instagram://user?username=${username}`;
        setTimeout(() => {
          window.location.href = webUrl;
        }, 1200);
      }
      // On desktop, default behavior follows standard href in a new tab
    });
  });
}
