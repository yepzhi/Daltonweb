/* ═══════════════════════════════════════════════════════
   🏎️ DALTON'S BIRTHDAY — Main App Logic
   Music, Countdown, iCal, Particles, Scroll Reveal
   ═══════════════════════════════════════════════════════ */

/* ══════════════ CONFIGURATION ═════════════════════════
   ⚠️ CHANGE THE DATE & TIME HERE:
   Format: Year, Month (0-indexed!), Day, Hour (24h), Minute
   Example: March 8, 2026 at 4:00 PM = new Date(2026, 2, 8, 16, 0)
   ═══════════════════════════════════════════════════════ */
const EVENT_CONFIG = {
    date: new Date(2026, 2, 22, 17, 0), // March 22, 2026 @ 5:00 PM
    endDate: new Date(2026, 2, 22, 23, 0), // ends at 11:00 PM
    title: '🏎️ ¡Cumpleaños de Dalton — 4 Años!',
    location: 'Calle del Acueducto, Lote 136, Real del 14',
    description: '¡Fiesta de cumpleaños de Dalton! Temática de carros 🏎️🏁\\n\\n' +
        '• Trae traje de baño 🏊\\n' +
        '• Se permite alcohol 🍺\\n' +
        '• Regalos: Carros, ropita talla 5, o sobre 💌',
    mapUrl: 'https://www.google.com/maps?q=28.955453872680664,-111.04131317138672&z=17',
};

/* ══════════════ AUDIO / MUSIC PLAYER ══════════════════ */
const audio = document.getElementById('bg-audio');
const btnPlayPause = document.getElementById('btn-play-pause');
const musicStatus = document.getElementById('music-status');
const eqBars = document.getElementById('eq-bars');
let isPlaying = false;

// Set volume to 50%
audio.volume = 0.5;

function tryAutoplayMusic() {
    audio.play().then(() => {
        isPlaying = true;
        updatePlayerUI();
    }).catch(() => {
        // Autoplay blocked — user will manually press play
        isPlaying = false;
        updatePlayerUI();
    });
}

function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
    } else {
        audio.play().then(() => {
            isPlaying = true;
            updatePlayerUI();
        }).catch(() => { });
        return;
    }
    updatePlayerUI();
}

function updatePlayerUI() {
    if (isPlaying) {
        btnPlayPause.textContent = '⏸';
        musicStatus.textContent = 'Reproduciendo';
        eqBars.classList.add('playing');
    } else {
        btnPlayPause.textContent = '▶';
        musicStatus.textContent = 'Pausado';
        eqBars.classList.remove('playing');
    }
}

// Keep UI in sync if audio ends/pauses
audio.addEventListener('pause', () => { isPlaying = false; updatePlayerUI(); });
audio.addEventListener('play', () => { isPlaying = true; updatePlayerUI(); });

/* ══════════════ COUNTDOWN TIMER ══════════════════════ */
function updateCountdown() {
    const now = new Date();
    const diff = EVENT_CONFIG.date - now;

    const el = {
        days: document.getElementById('cd-days'),
        hours: document.getElementById('cd-hours'),
        mins: document.getElementById('cd-mins'),
        secs: document.getElementById('cd-secs'),
    };

    if (diff <= 0) {
        el.days.textContent = '🎉';
        el.hours.textContent = '¡HOY!';
        el.mins.textContent = '';
        el.secs.textContent = '';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    el.days.textContent = String(days).padStart(2, '0');
    el.hours.textContent = String(hours).padStart(2, '0');
    el.mins.textContent = String(mins).padStart(2, '0');
    el.secs.textContent = String(secs).padStart(2, '0');
}

// Update immediately and every second
updateCountdown();
setInterval(updateCountdown, 1000);

/* ══════════════ DATE DISPLAY ═════════════════════════ */
function updateDateDisplay() {
    const d = EVENT_CONFIG.date;
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    document.getElementById('event-day-name').textContent = dayNames[d.getDay()];
    document.getElementById('event-date-num').textContent = String(d.getDate()).padStart(2, '0');
    document.getElementById('event-month-year').textContent = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;

    const h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    document.getElementById('event-time-display').textContent = `${h12}:${m} ${ampm}`;
}

updateDateDisplay();

/* ══════════════ iCAL DOWNLOAD ════════════════════════ */
function formatICSDate(date) {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    const h = String(date.getUTCHours()).padStart(2, '0');
    const min = String(date.getUTCMinutes()).padStart(2, '0');
    const s = String(date.getUTCSeconds()).padStart(2, '0');
    return `${y}${m}${d}T${h}${min}${s}Z`;
}

function downloadICS() {
    const start = formatICSDate(EVENT_CONFIG.date);
    const end = formatICSDate(EVENT_CONFIG.endDate);
    const now = formatICSDate(new Date());

    const description = EVENT_CONFIG.description.replace(/\n/g, '\\n');

    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//DaltonBirthday//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `DTSTAMP:${now}`,
        `UID:dalton-5-birthday-${Date.now()}@daltonweb`,
        `SUMMARY:${EVENT_CONFIG.title}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${EVENT_CONFIG.location}`,
        `URL:${EVENT_CONFIG.mapUrl}`,
        'STATUS:CONFIRMED',
        // Reminder: 1 week before
        'BEGIN:VALARM',
        'TRIGGER:-P7D',
        'ACTION:DISPLAY',
        'DESCRIPTION:¡En 1 semana es el cumple de Dalton! 🏎️',
        'END:VALARM',
        // Reminder: 3 days before
        'BEGIN:VALARM',
        'TRIGGER:-P3D',
        'ACTION:DISPLAY',
        'DESCRIPTION:¡En 3 días es el cumple de Dalton! 🏁',
        'END:VALARM',
        // Reminder: 1 day before
        'BEGIN:VALARM',
        'TRIGGER:-P1D',
        'ACTION:DISPLAY',
        'DESCRIPTION:¡Mañana es el cumple de Dalton! No olvides tu regalo 🎁',
        'END:VALARM',
        // Reminder: Same day (2 hours before)
        'BEGIN:VALARM',
        'TRIGGER:-PT2H',
        'ACTION:DISPLAY',
        'DESCRIPTION:¡Hoy es el cumple de Dalton! La fiesta empieza en 2 horas 🎉',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Cumpleanos_Dalton_4.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Visual feedback
    const btn = document.getElementById('btn-add-calendar');
    const orig = btn.innerHTML;
    btn.innerHTML = '✅ ¡Agregado!';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
    }, 2500);
}

/* ══════════════ LIGHTBOX ═════════════════════════════ */
function openLightbox(imgElement) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = imgElement.src;
    lightboxImg.alt = imgElement.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// ESC key closes lightbox
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

/* ══════════════ SCROLL REVEAL ════════════════════════ */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* ══════════════ FLOATING PARTICLES ═══════════════════ */
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const count = window.innerWidth < 640 ? 15 : 30;

    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = `${Math.random() * 100}%`;
        p.style.animationDelay = `${Math.random() * 8}s`;
        p.style.animationDuration = `${6 + Math.random() * 6}s`;
        container.appendChild(p);
    }
}

createParticles();

/* ══════════════ INIT ON LOAD ═════════════════════════ */
// If intro is already done (e.g., skipped), init reveals
window.addEventListener('load', () => {
    // Scroll reveal will be started by intro.js after transition
    // But also handle case where intro is already hidden
    setTimeout(() => {
        if (!document.body.classList.contains('no-scroll')) {
            initScrollReveal();
        }
    }, 100);
});
