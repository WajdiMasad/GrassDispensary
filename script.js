/* =============================================
   THE GRASS STATION DISPENSARY — JAVASCRIPT
   ============================================= */

/* --------------------------------
   AGE GATE LOGIC
   -------------------------------- */
function handleAgeGate() {
  const monthEl = document.getElementById('dob-month');
  const dayEl   = document.getElementById('dob-day');
  const yearEl  = document.getElementById('dob-year');
  const errorEl = document.getElementById('age-gate-error');

  const month = parseInt(monthEl.value, 10);
  const day   = parseInt(dayEl.value, 10);
  const year  = parseInt(yearEl.value, 10);

  // Clear previous errors
  errorEl.textContent = '';
  [monthEl, dayEl, yearEl].forEach(el => el.classList.remove('error'));

  // Validate fields
  if (!monthEl.value || !dayEl.value || !yearEl.value) {
    errorEl.textContent = 'Please enter your full date of birth.';
    if (!monthEl.value) monthEl.classList.add('error');
    if (!dayEl.value)   dayEl.classList.add('error');
    if (!yearEl.value)  yearEl.classList.add('error');
    return;
  }

  const currentYear = new Date().getFullYear();

  if (isNaN(month) || month < 1 || month > 12) {
    errorEl.textContent = 'Please enter a valid month (1–12).';
    monthEl.classList.add('error');
    return;
  }
  if (isNaN(day) || day < 1 || day > 31) {
    errorEl.textContent = 'Please enter a valid day (1–31).';
    dayEl.classList.add('error');
    return;
  }
  if (isNaN(year) || year < 1900 || year > currentYear) {
    errorEl.textContent = 'Please enter a valid birth year.';
    yearEl.classList.add('error');
    return;
  }

  const dob = new Date(year, month - 1, day);
  const today = new Date();

  // Calculate age
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  if (age >= 19) {
    // Store in session so they don't see the gate again this session
    sessionStorage.setItem('ageVerified', 'true');
    const gate = document.getElementById('age-gate');
    gate.classList.add('hidden');
    setTimeout(() => {
      gate.style.display = 'none';
    }, 450);
  } else {
    // Hard block — replace card content with access denied screen
    showAccessDenied();
  }
}

/* --------------------------------
   ACCESS DENIED SCREEN
   -------------------------------- */
function showAccessDenied() {
  const card = document.querySelector('.age-gate__card');

  // Fade out the card content, then swap
  card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  card.style.opacity = '0';
  card.style.transform = 'scale(0.95)';

  setTimeout(() => {
    card.innerHTML = `
      <div class="age-denied">
        <div class="age-denied__icon" aria-hidden="true">🚫</div>
        <h2 class="age-denied__title">Access Denied</h2>
        <p class="age-denied__msg">
          You must be <strong>19 years of age or older</strong> to access this website.
          Cannabis products are for adults only.
        </p>
        <div class="age-denied__divider"></div>
        <p class="age-denied__sub">
          If you believe this is an error, please close your browser and try again with a valid date of birth.
        </p>
        <a href="https://cannabis.ca" target="_blank" rel="noopener noreferrer" class="age-denied__link">
          Learn about responsible cannabis use →
        </a>
      </div>
    `;
    card.style.opacity = '1';
    card.style.transform = 'scale(1)';
    // Add denied class for CSS red styling
    card.classList.add('denied');
  }, 300);
}

// Check if already verified this session
document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('ageVerified') === 'true') {
    const gate = document.getElementById('age-gate');
    gate.style.display = 'none';
  }

  // Allow Enter key to submit age gate
  document.addEventListener('keydown', (e) => {
    const gate = document.getElementById('age-gate');
    const isDenied = document.querySelector('.age-gate__card.denied');
    if (e.key === 'Enter' && gate && gate.style.display !== 'none' && !isDenied) {
      handleAgeGate();
    }
  });
});

/* --------------------------------
   NAVBAR — SCROLL EFFECT & ACTIVE
   -------------------------------- */
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scroll-top-btn');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Navbar scroll class
  if (scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Scroll to top button
  if (scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }

  // Active nav link based on scroll position
  updateActiveNav();
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

/* --------------------------------
   HAMBURGER MENU
   -------------------------------- */
hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on nav link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* --------------------------------
   INTERSECTION OBSERVER — SCROLL ANIMATIONS
   -------------------------------- */
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Attach animation classes programmatically
document.addEventListener('DOMContentLoaded', () => {
  // About section columns
  const aboutImgCol = document.querySelector('.about__img-col');
  const aboutTextCol = document.querySelector('.about__text-col');
  if (aboutImgCol)  { aboutImgCol.classList.add('reveal-left');  observer.observe(aboutImgCol); }
  if (aboutTextCol) { aboutTextCol.classList.add('reveal-right'); observer.observe(aboutTextCol); }

  // Product cards
  document.querySelectorAll('.product-card').forEach((card, i) => {
    card.classList.add('reveal');
    card.style.transitionDelay = `${i * 0.05}s`;
    observer.observe(card);
  });

  // Review cards
  document.querySelectorAll('.review-card').forEach((card, i) => {
    card.classList.add('reveal');
    card.style.transitionDelay = `${i * 0.1}s`;
    observer.observe(card);
  });

  // Section headings & overlines
  document.querySelectorAll('.section-heading, .section-overline, .about__heading, .about__overline').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  // Info strip items
  document.querySelectorAll('.info-strip__item').forEach((item, i) => {
    item.classList.add('reveal');
    item.style.transitionDelay = `${i * 0.1}s`;
    observer.observe(item);
  });

  // Contact info rows
  document.querySelectorAll('.contact__detail-row').forEach((row, i) => {
    row.classList.add('reveal');
    row.style.transitionDelay = `${i * 0.08}s`;
    observer.observe(row);
  });
  const contactMap = document.querySelector('.contact__map');
  if (contactMap) { contactMap.classList.add('reveal-right'); observer.observe(contactMap); }
});

/* --------------------------------
   SMOOTH SCROLL FOR ALL ANCHOR LINKS
   -------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* --------------------------------
   SCROLL-TOP KEYBOARD SUPPORT
   -------------------------------- */
scrollTopBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});
