// Countdown to the wedding date: July 16, 2026
const WEDDING_DATE = new Date('2026-07-16T10:00:00+05:30').getTime();

function pad(n) {
  return String(n).padStart(2, '0');
}

function updateCountdown() {
  const now = Date.now();
  const diff = WEDDING_DATE - now;

  if (diff <= 0) {
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('days').textContent = pad(days);
  document.getElementById('hours').textContent = pad(hours);
  document.getElementById('minutes').textContent = pad(minutes);
  document.getElementById('seconds').textContent = pad(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
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

// Gallery lightbox
document.querySelectorAll('.gallery-track img').forEach((img) => {
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
