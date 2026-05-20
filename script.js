/* ==========================================
   Birat Portfolio — script.js
   Material 3 Interactions & Animations
   ========================================== */

// ===== Theme Toggle =====
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const themeIconMobile = document.getElementById('themeIconMobile');

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  const icon = theme === 'dark' ? 'light_mode' : 'dark_mode';
  themeIcon.textContent = icon;
  themeIconMobile.textContent = icon;
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
  showSnackbar(html.getAttribute('data-theme') === 'dark' ? 'Switched to dark mode' : 'Switched to light mode');
}

themeToggle.addEventListener('click', toggleTheme);
themeToggleMobile.addEventListener('click', toggleTheme);

// ===== Smooth Scroll + Active Nav =====
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavLinks = document.querySelectorAll('.mnav-link');

function setActiveNav(id) {
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === id);
  });
  mobileNavLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === id);
  });
}

// Intersection Observer for active section
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setActiveNav(entry.target.id);
    }
  });
}, { threshold: 0.3, rootMargin: '-10% 0px -10% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// Smooth scroll on nav click
[...navLinks, ...mobileNavLinks].forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(`#${link.dataset.section}`);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== Reveal Animations =====
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// Trigger hero reveals immediately
setTimeout(() => {
  document.querySelectorAll('.hero-section .reveal').forEach(el => {
    el.classList.add('visible');
  });
}, 100);

// ===== Counter Animation =====
const counters = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const duration = 1400;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

counters.forEach(c => counterObserver.observe(c));

// ===== Skill Bars =====
const skillFills = document.querySelectorAll('.skill-fill');

function animateSkillBars(container) {
  const fills = container ? container.querySelectorAll('.skill-fill') : skillFills;
  fills.forEach(fill => {
    fill.style.width = '0';
    setTimeout(() => {
      fill.style.width = fill.dataset.width + '%';
    }, 50);
  });
}

// Animate active tab's bars on load
const skillsSection = document.getElementById('skills');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const activePanel = document.querySelector('.tab-panel.active');
      animateSkillBars(activePanel);
    }
  });
}, { threshold: 0.3 });

skillObserver.observe(skillsSection);

// ===== Skills Tabs =====
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    const panel = document.getElementById(`tab-${target}`);
    panel.classList.add('active');

    // Re-animate skill bars in new panel
    setTimeout(() => animateSkillBars(panel), 50);
  });
});

// ===== Project Filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      if (match) {
        card.classList.remove('hidden');
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.3s, transform 0.3s';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        setTimeout(() => card.classList.add('hidden'), 300);
      }
    });
  });
});

// ===== Contact Form =====
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const fields = form.querySelectorAll('input, textarea');
  fields.forEach(field => {
    field.classList.remove('error');
    if (!field.value.trim()) {
      field.classList.add('error');
      valid = false;
    }
    if (field.type === 'email' && field.value && !field.value.includes('@')) {
      field.classList.add('error');
      valid = false;
    }
  });

  if (!valid) {
    showSnackbar('Please fill in all fields correctly.');
    return;
  }

  const btn = form.querySelector('.btn-filled');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<span class="material-icons-round">send</span> Send Message';
    btn.disabled = false;
    form.reset();
    formSuccess.classList.add('show');
    showSnackbar('Message sent successfully!');
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }, 1500);
});

// Remove error class on input
form.querySelectorAll('input, textarea').forEach(field => {
  field.addEventListener('input', () => field.classList.remove('error'));
});

// ===== Snackbar =====
const snackbar = document.getElementById('snackbar');
let snackTimeout;

function showSnackbar(message) {
  clearTimeout(snackTimeout);
  snackbar.textContent = message;
  snackbar.classList.add('show');
  snackTimeout = setTimeout(() => snackbar.classList.remove('show'), 3000);
}

// ===== Ripple Effect (Material 3) =====
function addRipple(el) {
  el.style.position = 'relative';
  el.style.overflow = 'hidden';
  el.addEventListener('pointerdown', function(e) {
    const ripple = document.createElement('span');
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      border-radius: 50%;
      background: currentColor;
      opacity: 0.15;
      transform: scale(0);
      animation: ripple-anim 0.5s cubic-bezier(0.2,0,0,1) forwards;
      pointer-events: none;
    `;
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

// Inject ripple keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-anim {
    to { transform: scale(1); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Apply ripple to interactive elements
document.querySelectorAll('.btn, .tab-btn, .filter-btn, .nav-link, .mnav-link').forEach(addRipple);

// ===== Scroll-triggered nav shadow =====
const mainContent = document.querySelector('.main-content');
const navRail = document.getElementById('navRail');

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    navRail.style.boxShadow = '2px 0 12px rgba(0,0,0,0.08)';
  } else {
    navRail.style.boxShadow = 'none';
  }
}, { passive: true });

// ===== Project card hover tilt =====
projectCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s cubic-bezier(0.2,0,0,1), box-shadow 0.25s';
  });
});
