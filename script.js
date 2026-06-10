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

// RSVP form — client-side acknowledgement.
// Wire this up to a Google Form / Formspree / your own endpoint when ready.
function submitRSVP(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const event = form.event.value;
  const wa = '919876543210'; // <-- replace with the family contact WhatsApp number

  const eventLabel = {
    engagement: 'the Engagement on June 20',
    wedding: 'the Wedding on July 16',
    both: 'both the Engagement and Wedding'
  }[event] || 'the celebration';

  const msg =
    `Hello! I'm ${name}.%0A` +
    `I'd love to attend ${eventLabel}.%0A` +
    `Guests: ${form.guests.value}%0A` +
    `Phone: ${form.phone.value}` +
    (form.message.value ? `%0AMessage: ${encodeURIComponent(form.message.value)}` : '');

  // Open WhatsApp prefilled with the RSVP details
  window.open(`https://wa.me/${wa}?text=${msg}`, '_blank');

  alert(`Thank you, ${name}! Your blessing has been received. 🤍`);
  form.reset();
  return false;
}
