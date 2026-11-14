/**
 * Portfolio de Diseño Multimedial - Mariano Rodríguez (Marian89)
 * Interacciones: Pantalla de carga con Logo Intro, Visor Dual Photoshop 3,
 * Controles de video After Effects, Lightbox y Redes Sociales.
 */

// SVGs reutilizables para controles
const ICONS = {
  play: `<svg class="ctrl-icon icon-play" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  pause: `<svg class="ctrl-icon icon-pause" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
  audioOn: `<svg class="ctrl-icon icon-audio" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
  audioMute: `<svg class="ctrl-icon icon-audio" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/></svg>`,
  check: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--magenta);"><polyline points="20 6 9 17 4 12"/></svg>`
};

document.addEventListener('DOMContentLoaded', () => {
  initIntroScreen();
  initNavbar();
  initPhotoshopDualViewer();
  initAEVideoCards();
  initLightbox();
  initSocialInteractions();
  initContactForm();
});

/* ==========================================================================
   1. PANTALLA DE CARGA / INTRO CON "LOGO INTRO"
   ========================================================================== */
function initIntroScreen() {
  const introScreen = document.getElementById('intro-screen');
  const introVideo = document.getElementById('intro-video');
  const loaderFill = document.getElementById('intro-loader-fill');
  const loaderPercent = document.getElementById('intro-loader-percent');
  const skipBtn = document.getElementById('btn-skip-intro');
  const replayBtn = document.getElementById('btn-replay-intro');

  if (!introScreen) return;

  let introDismissed = false;

  function dismissIntro() {
    if (introDismissed) return;
    introDismissed = true;
    introScreen.classList.add('hide-intro');
    if (introVideo) {
      introVideo.pause();
    }
  }

  // Actualizar barra de progreso con el avance del video
  if (introVideo) {
    introVideo.addEventListener('timeupdate', () => {
      if (introVideo.duration) {
        const progress = Math.min(100, Math.round((introVideo.currentTime / introVideo.duration) * 100));
        if (loaderFill) loaderFill.style.width = `${progress}%`;
        if (loaderPercent) loaderPercent.textContent = `${progress}%`;
      }
    });

    // Al finalizar el video, cerrar intro automáticamente
    introVideo.addEventListener('ended', () => {
      setTimeout(dismissIntro, 400);
    });

    // Iniciar reproducción automática
    const playPromise = introVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        simulateProgress();
      });
    }
  } else {
    simulateProgress();
  }

  function simulateProgress() {
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      if (loaderFill) loaderFill.style.width = `${p}%`;
      if (loaderPercent) loaderPercent.textContent = `${p}%`;
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(dismissIntro, 500);
      }
    }, 70);
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', dismissIntro);
  }

  // Permitir reabrir la intro desde la barra de navegación o hero
  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      introDismissed = false;
      introScreen.classList.remove('hide-intro');
      if (loaderFill) loaderFill.style.width = '0%';
      if (loaderPercent) loaderPercent.textContent = '0%';
      if (introVideo) {
        introVideo.currentTime = 0;
        introVideo.play().catch(console.warn);
      }
    });
  }
}

/* ==========================================================================
   2. NAVBAR Y NAVEGACIÓN
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    let currentSection = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   3. VISOR DUAL PHOTOSHOP 3 (VIDEO MOTION VS COMPOSICIÓN JPG)
   ========================================================================== */
function initPhotoshopDualViewer() {
  const modeButtons = document.querySelectorAll('.btn-dual-mode');
  const displayWrapper = document.getElementById('ps3-dual-display');
  const ps3Video = document.getElementById('ps3-video-element');
  const playPauseBtn = document.getElementById('btn-ps3-play');
  const muteBtn = document.getElementById('btn-ps3-audio');

  if (!displayWrapper) return;

  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      modeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.getAttribute('data-mode');
      displayWrapper.className = 'dual-display-wrapper';

      if (mode === 'split') {
        displayWrapper.classList.add('split-view');
      } else if (mode === 'video') {
        displayWrapper.classList.add('video-only-view');
      } else if (mode === 'jpg') {
        displayWrapper.classList.add('jpg-only-view');
      }
    });
  });

  if (playPauseBtn && ps3Video) {
    playPauseBtn.addEventListener('click', () => {
      if (ps3Video.paused) {
        ps3Video.play();
        playPauseBtn.innerHTML = ICONS.pause;
      } else {
        ps3Video.pause();
        playPauseBtn.innerHTML = ICONS.play;
      }
    });
  }

  if (muteBtn && ps3Video) {
    muteBtn.addEventListener('click', () => {
      ps3Video.muted = !ps3Video.muted;
      muteBtn.innerHTML = ps3Video.muted ? ICONS.audioMute : ICONS.audioOn;
    });
  }
}

/* ==========================================================================
   4. TARJETAS DE VIDEO AFTER EFFECTS (INTERACCIÓN & HOVER)
   ========================================================================== */
function initAEVideoCards() {
  const aeCards = document.querySelectorAll('.ae-card');

  aeCards.forEach((card) => {
    const video = card.querySelector('video');
    const playBtn = card.querySelector('.btn-ae-play');
    const muteBtn = card.querySelector('.btn-ae-mute');

    if (!video) return;

    card.addEventListener('mouseenter', () => {
      video.play().catch(() => {});
    });

    card.addEventListener('mouseleave', () => {
      if (!card.classList.contains('playing-fixed')) {
        video.pause();
      }
    });

    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.paused) {
          video.play();
          card.classList.add('playing-fixed');
          playBtn.innerHTML = ICONS.pause;
        } else {
          video.pause();
          card.classList.remove('playing-fixed');
          playBtn.innerHTML = ICONS.play;
        }
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        muteBtn.innerHTML = video.muted ? ICONS.audioMute : ICONS.audioOn;
      });
    }
  });
}

/* ==========================================================================
   5. LIGHTBOX / MODAL UNIVERSAL (SIMPLE Y VISTA SPLIT COMPARATIVA)
   ========================================================================== */
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const normalContainer = modal?.querySelector('.lightbox-container');
  const mediaContainer = document.getElementById('lightbox-media');
  const titleEl = document.getElementById('lightbox-title');
  const descEl = document.getElementById('lightbox-desc');
  const closeBtn = document.getElementById('btn-lightbox-close');

  // Elementos del split modal
  const splitContainer = document.getElementById('lightbox-split-container');
  const splitTitleEl = document.getElementById('split-modal-title');
  const splitDescEl = document.getElementById('split-modal-desc');
  const splitImgBase = document.getElementById('img-split-base');
  const splitImgResult = document.getElementById('img-split-result');
  const splitLabelBase = document.getElementById('label-split-base');
  const splitLabelResult = document.getElementById('label-split-result');
  const tabBaseText = document.getElementById('tab-split-base-text');
  const tabResultText = document.getElementById('tab-split-result-text');
  const splitBodyWrapper = document.getElementById('split-body-wrapper');
  const splitTabs = document.querySelectorAll('.btn-split-tab');
  const splitCloseBtn = document.getElementById('btn-split-close');

  if (!modal) return;

  function openLightbox(type, src, title, desc) {
    if (!mediaContainer) return;
    if (normalContainer) normalContainer.style.display = 'flex';
    if (splitContainer) splitContainer.style.display = 'none';

    mediaContainer.innerHTML = '';

    if (type === 'video') {
      const vid = document.createElement('video');
      vid.src = src;
      vid.controls = true;
      vid.autoplay = true;
      vid.playsInline = true;
      vid.loop = true;
      mediaContainer.appendChild(vid);
    } else {
      const img = document.createElement('img');
      img.src = src;
      img.alt = title || 'Artwork';
      mediaContainer.appendChild(img);
    }

    if (titleEl) titleEl.textContent = title || '';
    if (descEl) descEl.textContent = desc || '';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function openSplitLightbox(baseSrc, resultSrc, title, desc, labelBase, labelResult) {
    if (!splitContainer) return;
    if (normalContainer) normalContainer.style.display = 'none';
    splitContainer.style.display = 'flex';

    if (splitTitleEl) splitTitleEl.textContent = title || 'Comparativa de Material & Resultado';
    if (splitDescEl) splitDescEl.textContent = desc || '';
    if (splitImgBase) splitImgBase.src = baseSrc || '';
    if (splitImgResult) splitImgResult.src = resultSrc || '';
    if (splitLabelBase) splitLabelBase.textContent = labelBase || 'Material Base';
    if (splitLabelResult) splitLabelResult.textContent = labelResult || 'Resultado Final';
    if (tabBaseText) tabBaseText.textContent = labelBase || 'Material Base';
    if (tabResultText) tabResultText.textContent = labelResult || 'Resultado Final';

    // Reiniciar al modo Lado a Lado
    if (splitBodyWrapper) splitBodyWrapper.className = 'lightbox-split-body';
    splitTabs.forEach(t => t.classList.remove('active'));
    document.getElementById('tab-split-both')?.classList.add('active');

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    const video = mediaContainer?.querySelector('video');
    if (video) video.pause();
    setTimeout(() => {
      if (mediaContainer) mediaContainer.innerHTML = '';
      if (normalContainer) normalContainer.style.display = 'flex';
      if (splitContainer) splitContainer.style.display = 'none';
    }, 300);
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (splitCloseBtn) splitCloseBtn.addEventListener('click', closeLightbox);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Tabs de control en el visor split
  splitTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      splitTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const mode = tab.getAttribute('data-split-mode');
      if (splitBodyWrapper) {
        if (mode === 'base') {
          splitBodyWrapper.className = 'lightbox-split-body mode-base';
        } else if (mode === 'result') {
          splitBodyWrapper.className = 'lightbox-split-body mode-result';
        } else {
          splitBodyWrapper.className = 'lightbox-split-body';
        }
      }
    });
  });

  // Triggers para Lightbox simple
  document.querySelectorAll('[data-lightbox]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const type = trigger.getAttribute('data-type') || 'image';
      const src = trigger.getAttribute('data-src') || trigger.getAttribute('href');
      const title = trigger.getAttribute('data-title') || '';
      const desc = trigger.getAttribute('data-desc') || '';
      openLightbox(type, src, title, desc);
    });
  });

  // Triggers para Vista Split (Collages & Originales)
  document.querySelectorAll('.btn-split-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const base = btn.getAttribute('data-base');
      const result = btn.getAttribute('data-result');
      const title = btn.getAttribute('data-title');
      const desc = btn.getAttribute('data-desc');
      const labelBase = btn.getAttribute('data-label-base');
      const labelResult = btn.getAttribute('data-label-result');
      openSplitLightbox(base, result, title, desc, labelBase, labelResult);
    });
  });
}

/* ==========================================================================
   6. REDES SOCIALES & COPIAR CORREO CON TOAST
   ========================================================================== */
function initSocialInteractions() {
  const copyGmailBtn = document.getElementById('btn-copy-gmail');

  if (copyGmailBtn) {
    copyGmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = copyGmailBtn.getAttribute('data-email') || 'marianrgz89@gmail.com';

      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
          showToast('¡Correo copiado al portapapeles! (' + email + ')');
        }).catch(() => {
          showToast('Correo: ' + email);
        });
      } else {
        showToast('Correo: ' + email);
      }
    });
  }
}

function showToast(message) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `${ICONS.check} <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ==========================================================================
   7. FORMULARIO DE CONTACTO (ENVÍO FINAL A marianrgz89@gmail.com)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  const targetEmail = 'marianrgz89@gmail.com';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

    const name = form.querySelector('#form-name')?.value.trim() || '';
    const email = form.querySelector('#form-email')?.value.trim() || '';
    const subject = form.querySelector('#form-subject')?.value.trim() || 'Consulta desde Portfolio';
    const message = form.querySelector('#form-message')?.value.trim() || '';

    if (!name || !email || !message) {
      showToast('Por favor completa los campos obligatorios.');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spin-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25" stroke="currentColor"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"/>
        </svg>
        <span>Enviando mensaje...</span>
      `;
    }

    try {
      // Envío asíncrono directo a marianrgz89@gmail.com mediante FormSubmit API
      const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Nombre: name,
          Email: email,
          Asunto: subject,
          Mensaje: message,
          _subject: `[Portfolio Marian89] Mensaje de ${name} - ${subject}`,
          _template: 'table'
        })
      });

      const data = await response.json();

      if (response.ok && (data.success === 'true' || data.success === true || response.status === 200)) {
        showToast(`¡Gracias ${name}! Mensaje enviado a ${targetEmail}. Te responderé a la brevedad.`);
        form.reset();
      } else {
        throw new Error(data.message || 'Error en el servicio de recepción');
      }
    } catch (err) {
      console.warn('Envío AJAX no completado, usando fallback por mailto:', err);
      // Fallback 100% garantizado: abrir cliente de correo con los datos precompletados dirigidos a marianrgz89@gmail.com
      const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(`[Portfolio Marian89] ${subject}`)}&body=${encodeURIComponent(`De: ${name} (${email})\n\nMensaje:\n${message}`)}`;
      window.location.href = mailtoUrl;
      showToast(`Abriendo correo para enviar a ${targetEmail}...`);
      form.reset();
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }
  });
}
