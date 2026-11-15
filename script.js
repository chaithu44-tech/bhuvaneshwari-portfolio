/**
 * BHUVANESHWARI C — PORTFOLIO JAVASCRIPT
 * Interactions, Modals, Skills Filtering, Web Audio Haptics, Live Clock, and Print Support
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Sound Synthesis (Web Audio API Haptics) ---
  let soundEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playHaptic(type = 'click') {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'tab') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      }
    } catch (e) {
      // Audio not permitted or supported
    }
  }

  // Sound Toggle Button
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');

  if (soundToggleBtn && soundIcon) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        soundIcon.className = 'fa-solid fa-volume-high';
        soundToggleBtn.style.color = 'var(--accent-red)';
        showToast('Sound Effects Enabled');
        playHaptic('success');
      } else {
        soundIcon.className = 'fa-solid fa-volume-xmark';
        soundToggleBtn.style.color = 'var(--text-muted)';
        showToast('Sound Effects Muted');
      }
    });
  }


  // --- 2. Live Bengaluru Time & Editorial Date ---
  const liveDateEl = document.getElementById('live-date');
  const bengaluruTimeEl = document.getElementById('bengaluru-time');

  function updateClock() {
    const now = new Date();

    // Format Date: e.g. "NOVEMBER 15, 2026"
    if (liveDateEl) {
      const options = { month: 'short', day: '2-digit', year: 'numeric' };
      liveDateEl.textContent = now.toLocaleDateString('en-US', options).toUpperCase();
    }

    // Format IST Time
    if (bengaluruTimeEl) {
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      bengaluruTimeEl.innerHTML = `<i class="fa-regular fa-clock"></i> ${timeStr} IST`;
    }
  }

  updateClock();
  setInterval(updateClock, 1000);


  // --- 3. Mobile Navigation Menu ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      playHaptic('click');
    });

    // Close on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        playHaptic('click');
      });
    });
  }


  // --- 4. Toast Notification Helper ---
  const toastContainer = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');
  let toastTimeout = null;

  function showToast(message) {
    if (!toastContainer || !toastMessage) return;
    toastMessage.textContent = message;
    toastContainer.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastContainer.classList.remove('show');
    }, 2800);
  }


  // --- 5. Clipboard Copy Functionality ---
  document.querySelectorAll('.copy-email-btn, .channel-copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy') || 'bhuvanaac27@gmail.com';

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
          playHaptic('success');
        }).catch(() => {
          fallbackCopy(textToCopy);
        });
      } else {
        fallbackCopy(textToCopy);
      }
    });
  });

  function fallbackCopy(text) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast(`Copied: ${text}`);
    playHaptic('success');
  }


  // --- 6. Modal Open/Close Controls ---
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      playHaptic('click');
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      playHaptic('click');
    }
  }

  // Project Modal Triggers
  document.querySelectorAll('.open-project-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      openModal(modalId);
    });
  });

  // Resume Modal Triggers
  const resumeBtnNav = document.getElementById('resume-btn-nav');
  const resumeBtnMain = document.getElementById('resume-btn-main');

  if (resumeBtnNav) {
    resumeBtnNav.addEventListener('click', () => openModal('modal-resume'));
  }
  if (resumeBtnMain) {
    resumeBtnMain.addEventListener('click', () => openModal('modal-resume'));
  }

  // Modal Close Buttons
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close');
      closeModal(modalId);
    });
  });

  // Close when clicking modal backdrop
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach(modal => {
        closeModal(modal.id);
      });
    }
  });


  // --- 7. Print Resume Trigger ---
  const printResumeBtn = document.getElementById('print-resume-btn');
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      playHaptic('click');
      window.print();
    });
  }


  // --- 8. Skills Filtering Tabs ---
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillTiles = document.querySelectorAll('.skill-tile');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');
      playHaptic('tab');

      skillTiles.forEach(tile => {
        const categories = tile.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          tile.style.display = 'block';
          tile.style.opacity = '1';
        } else {
          tile.style.display = 'none';
          tile.style.opacity = '0';
        }
      });
    });
  });


  // --- 9. Contact Form Simulation ---
  const contactForm = document.getElementById('portfolio-contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('sender-name').value.trim();
      const email = document.getElementById('sender-email').value.trim();
      const subject = document.getElementById('sender-subject').value;
      const message = document.getElementById('sender-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields');
        return;
      }

      // UI feedback during sending
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>SENDING...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
      playHaptic('click');

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>SEND MESSAGE</span> <i class="fa-solid fa-paper-plane"></i>`;

        formFeedback.className = 'form-feedback-message success';
        formFeedback.innerHTML = `<strong>Thank you, ${name}!</strong> Your message regarding "<em>${subject}</em>" has been noted. I will reply to <em>${email}</em> promptly.`;

        showToast('Message sent successfully!');
        playHaptic('success');
        contactForm.reset();

        // Also prepare mailto draft if requested
        const mailtoUrl = `mailto:bhuvanaac27@gmail.com?subject=${encodeURIComponent(subject + ' - ' + name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')')}`;
        console.log('Prepared mailto:', mailtoUrl);
      }, 700);
    });
  }


  // --- 10. Subtle Mouse Parallax on Red Graphic Circles ---
  const stages = document.querySelectorAll('.circle-portrait-stage');
  if (window.matchMedia('(min-width: 992px)').matches) {
    stages.forEach(stage => {
      const disc = stage.querySelector('.red-graphic-disc');
      const img = stage.querySelector('.circle-portrait-img, .academic-cutout-img');

      stage.addEventListener('mousemove', (e) => {
        const rect = stage.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        if (disc) {
          disc.style.transform = `translateX(-50%) translate(${x * 12}px, ${y * 12}px)`;
        }
        if (img) {
          img.style.transform = `translate(${x * -8}px, ${y * -8}px)`;
        }
      });

      stage.addEventListener('mouseleave', () => {
        if (disc) disc.style.transform = 'translateX(-50%) translate(0, 0)';
        if (img) img.style.transform = 'translate(0, 0)';
      });
    });
  }

});
