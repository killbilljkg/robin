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

const RSVP_ENDPOINT = 'https://sheetdb.io/api/v1/d3etfidhvnoh4';

async function submitRSVP(e) {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('rsvp-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  const payload = {
    firstName: form.firstName.value.trim(),
    lastName: form.lastName.value.trim(),
    email: form.email.value.trim(),
    attendance: form.attendance.value,
    invitationType: form.invitationType.value,
    group: form.group.value,
    message: form.message.value.trim(),
    timestamp: new Date().toISOString()
  };

  submitBtn.disabled = true;
  status.textContent = 'Sending your blessing…';
  status.className = 'rsvp-status sending';

  try {
    const res = await fetch(RSVP_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: payload })
    });
    if (!res.ok) throw new Error('Request failed');
    status.textContent = `Thank you, ${payload.firstName}! Your blessing has been received. 🤍`;
    status.className = 'rsvp-status success';
    form.reset();
  } catch (err) {
    status.textContent = 'Something went wrong — please try again or reach us directly.';
    status.className = 'rsvp-status error';
  } finally {
    submitBtn.disabled = false;
  }

  return false;
}
