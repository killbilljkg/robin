// Countdown to the wedding date: July 16, 2026
const WEDDING_DATE = new Date('2026-07-16T10:00:00+05:30').getTime();

function pad(n) {
  return String(n).padStart(2, '0');
}

function updateCountdown() {
  const d = document.getElementById('days');
  if (!d) return;
  const h = document.getElementById('hours');
  const m = document.getElementById('minutes');
  const s = document.getElementById('seconds');
  const diff = WEDDING_DATE - Date.now();

  if (diff <= 0) {
    d.textContent = h.textContent = m.textContent = s.textContent = '00';
    return;
  }

  d.textContent = pad(Math.floor(diff / (1000 * 60 * 60 * 24)));
  h.textContent = pad(Math.floor((diff / (1000 * 60 * 60)) % 24));
  m.textContent = pad(Math.floor((diff / (1000 * 60)) % 60));
  s.textContent = pad(Math.floor((diff / 1000) % 60));
}

if (document.getElementById('days')) {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  document.querySelectorAll('.nav-links a').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Smooth fade-in on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('section').forEach((s) => {
  s.classList.add('fade-section');
  observer.observe(s);
});

// Gallery lightbox (carousel on home + grid on gallery page)
document.querySelectorAll('.gallery-track img, .gallery-grid img').forEach((img) => {
  img.addEventListener('click', () => openLightbox(img.src));
});

function openLightbox(src) {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.innerHTML = `<button class="lightbox-close" aria-label="Close">&times;</button><img src="${src}" alt="" />`;
  const close = () => {
    overlay.classList.remove('lightbox-show');
    setTimeout(() => overlay.remove(), 220);
    document.removeEventListener('keydown', onKey);
  };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', onKey);
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('lightbox-show'));
}

const RSVP_ENDPOINT = 'https://sheetdb.io/api/v1/d3etfidhvnoh4';

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast-show'));
  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 350);
  }, 4500);
}

async function submitRSVP(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const fd = new FormData(form);
  const get = (k) => (fd.get(k) || '').toString().trim();

  const payload = {
    firstName: get('firstName'),
    lastName: get('lastName'),
    email: get('email'),
    attendance: get('attendance'),
    invitationType: get('invitationType'),
    group: get('group'),
    message: get('message'),
    timestamp: new Date().toISOString()
  };

  submitBtn.disabled = true;
  const originalLabel = submitBtn.innerHTML;
  submitBtn.innerHTML = 'Sending…';

  try {
    const res = await fetch(RSVP_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: payload })
    });
    if (!res.ok) throw new Error('Request failed');
    showToast(`Thank you, ${payload.firstName}! Your blessing has been received 🤍`, 'success');
    form.reset();
  } catch (err) {
    showToast('Something went wrong — please try again or reach us directly.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalLabel;
  }

  return false;
}
