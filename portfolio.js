/* =====================================================
   Portfolio — Vanilla JS
   ===================================================== */

/* ── Smooth active nav highlight ── */
(function () {
  const links = document.querySelectorAll('.nav__links a, .nav__mobile a');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    const scrollY = window.scrollY + 80;
    let current = '';
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollY) current = sec.id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ── Hamburger menu ── */
(function () {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('open'));
  });
})();

/* ── Typewriter / rotating roles ── */
(function () {
  const el = document.getElementById('typedRole');
  if (!el) return;
  const roles = ['Developer', 'Designer', 'Creator', 'Problem Solver'];
  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const word = roles[ri];
    if (deleting) {
      ci--;
      el.textContent = word.slice(0, ci);
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
        setTimeout(tick, 400);
        return;
      }
    } else {
      ci++;
      el.textContent = word.slice(0, ci);
      if (ci === word.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
    }
    setTimeout(tick, deleting ? 60 : 90);
  }
  setTimeout(tick, 600);
})();

/* ── IntersectionObserver fade-in ── */
(function () {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
})();

/* ── Skill bars (animate when tab shown or in view) ── */
function animateSkills() {
  document.querySelectorAll('.skill__fill[data-width]').forEach(bar => {
    bar.style.width = bar.dataset.width + '%';
  });
}

/* ── Resume Tabs ── */
(function () {
  const tabs = document.querySelectorAll('.resume__tab');
  const panels = document.querySelectorAll('.resume__panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById('panel-' + tab.dataset.tab);
      if (target) {
        target.classList.add('active');
        if (tab.dataset.tab === 'skills') animateSkills();
      }
    });
  });
})();

/* ── Skill bar animation via IntersectionObserver ── */
(function () {
  const panel = document.getElementById('panel-skills');
  if (!panel) return;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateSkills();
      obs.disconnect();
    }
  }, { threshold: 0.3 });
  // Only animate when skills tab is active and visible
  // triggered by tab click OR by the observer if already on that tab
})();

/* ── Count-up for stats ── */
(function () {
  const counters = document.querySelectorAll('.stat__number[data-target]');
  if (!counters.length) return;

  function countUp(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();
    const plus = el.dataset.plus === 'true';

    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.querySelector('.num').textContent = Math.floor(ease * target);
      if (p < 1) requestAnimationFrame(step);
      else el.querySelector('.num').textContent = target;
    }
    requestAnimationFrame(step);
  }

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      counters.forEach(countUp);
      obs.disconnect();
    }
  }, { threshold: 0.4 });
  const statsSection = document.getElementById('stats');
  if (statsSection) obs.observe(statsSection);
})();

/* ── Portfolio filter ── */
(function () {
  const btns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio__item');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      items.forEach(item => {
        if (filter === 'all' || item.dataset.cat === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
})();

/* ── Testimonial slider ── */
(function () {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonials__dot');
  if (!slides.length) return;
  let current = 0, timer;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function autoplay() { timer = setInterval(() => goTo(current + 1), 5000); }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { clearInterval(timer); goTo(i); autoplay(); });
  });

  goTo(0);
  autoplay();
})();

/* ── Contact form ── */
(function () {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.style.display = 'none';
    success.style.display = 'block';
  });
})();

/* ── Tweaks ── */
(function () {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "primaryColor": "#1F1F1F",
    "accentColor": "#5A4FCF",
    "heroStyle": "dark",
    "fontFamily": "Inter"
  }/*EDITMODE-END*/;

  let panel = null;

  function applyTweaks(t) {
    document.documentElement.style.setProperty('--color-primary', t.primaryColor);
    document.documentElement.style.setProperty('--color-dark', t.heroStyle === 'dark' ? '#111111' : '#1a1a2e');
    document.documentElement.style.setProperty('--color-accent', t.accentColor);
    document.documentElement.style.setProperty('--font-body', `"${t.fontFamily}", -apple-system, sans-serif`);
    document.documentElement.style.setProperty('--font-heading', `"${t.fontFamily}", -apple-system, sans-serif`);
    if (t.fontFamily !== 'Inter') {
      const id = 'tweak-font';
      let link = document.getElementById(id);
      if (!link) { link = document.createElement('link'); link.id = id; link.rel = 'stylesheet'; document.head.appendChild(link); }
      link.href = `https://fonts.googleapis.com/css2?family=${t.fontFamily.replace(/ /g,'+')}:wght@400;500;600&display=swap`;
    }
  }

  function buildPanel() {
    const state = { ...TWEAK_DEFAULTS };
    const div = document.createElement('div');
    div.id = 'tweaks-panel';
    div.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:999;background:#fff;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.13);padding:20px;width:260px;font-family:var(--font-body);font-size:13px;display:none;`;
    div.innerHTML = `
      <div style="font-size:13px;font-weight:600;color:#1F1F1F;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;">
        Tweaks <button id="close-tweaks" style="background:none;border:none;cursor:pointer;color:#999;font-size:16px;line-height:1;">×</button>
      </div>
      <label style="display:block;margin-bottom:10px;">
        <span style="font-size:11px;font-weight:500;color:#6B6B6B;display:block;margin-bottom:5px;letter-spacing:0.04em;text-transform:uppercase;">Primary Color</span>
        <div style="display:flex;gap:8px;align-items:center;">
          <input type="color" id="tw-primary" value="${state.primaryColor}" style="width:36px;height:30px;border:none;border-radius:6px;cursor:pointer;padding:2px;">
          <span id="tw-primary-val" style="font-size:11px;color:#999;">${state.primaryColor}</span>
        </div>
      </label>
      <label style="display:block;margin-bottom:10px;">
        <span style="font-size:11px;font-weight:500;color:#6B6B6B;display:block;margin-bottom:5px;letter-spacing:0.04em;text-transform:uppercase;">Accent Color</span>
        <div style="display:flex;gap:8px;align-items:center;">
          <input type="color" id="tw-accent" value="${state.accentColor}" style="width:36px;height:30px;border:none;border-radius:6px;cursor:pointer;padding:2px;">
          <span id="tw-accent-val" style="font-size:11px;color:#999;">${state.accentColor}</span>
        </div>
      </label>
      <label style="display:block;margin-bottom:10px;">
        <span style="font-size:11px;font-weight:500;color:#6B6B6B;display:block;margin-bottom:5px;letter-spacing:0.04em;text-transform:uppercase;">Font Family</span>
        <select id="tw-font" style="width:100%;font-family:inherit;font-size:13px;padding:7px 10px;border:1px solid #E5E5E7;border-radius:8px;outline:none;background:#fff;">
          ${['Inter','DM Sans','Plus Jakarta Sans','Outfit','Sora'].map(f=>`<option value="${f}" ${f===state.fontFamily?'selected':''}>${f}</option>`).join('')}
        </select>
      </label>
    `;
    document.body.appendChild(div);

    div.querySelector('#close-tweaks').onclick = () => { div.style.display = 'none'; };
    div.querySelector('#tw-primary').oninput = e => {
      state.primaryColor = e.target.value;
      div.querySelector('#tw-primary-val').textContent = e.target.value;
      applyTweaks(state);
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { primaryColor: e.target.value } }, '*');
    };
    div.querySelector('#tw-accent').oninput = e => {
      state.accentColor = e.target.value;
      div.querySelector('#tw-accent-val').textContent = e.target.value;
      applyTweaks(state);
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { accentColor: e.target.value } }, '*');
    };
    div.querySelector('#tw-font').onchange = e => {
      state.fontFamily = e.target.value;
      applyTweaks(state);
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { fontFamily: e.target.value } }, '*');
    };
    return div;
  }

  window.addEventListener('message', e => {
    if (e.data?.type === '__activate_edit_mode') {
      if (!panel) panel = buildPanel();
      panel.style.display = 'block';
    }
    if (e.data?.type === '__deactivate_edit_mode' && panel) {
      panel.style.display = 'none';
    }
  });
  window.parent.postMessage({ type: '__edit_mode_available' }, '*');
  applyTweaks(TWEAK_DEFAULTS);
})();
