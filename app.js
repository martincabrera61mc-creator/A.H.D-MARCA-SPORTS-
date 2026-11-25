(function () {
  'use strict';

  const STORAGE_AFFILIATES = 'ahd_integrado_affiliates_v1';
  const STORAGE_CLICKS = 'ahd_integrado_clicks_v1';
  const SIM_COP_PER_CLICK = 50;

  // Sonido opcional con Web Audio API
  let soundOn = true;
  let audioCtx = null;

  function tone(freq = 540, dur = 0.08) {
    if (!soundOn) return;
    try {
      if (!audioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        audioCtx = new Ctx();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.value = 0.07;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + dur);
    } catch (_) {}
  }

  const soundBtn = document.getElementById('toggle-sound-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', function () {
      soundOn = !soundOn;
      soundBtn.setAttribute('aria-pressed', String(soundOn));
      soundBtn.textContent = soundOn ? '🔊 Sonido ON' : '🔇 Sonido OFF';
      if (soundOn) tone(680, 0.09);
    });
  }

  // Menú móvil
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('menu-icon-open');
  const iconClose = document.getElementById('menu-icon-close');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      mobileMenu.classList.toggle('hidden');
      iconOpen.classList.toggle('hidden');
      iconClose.classList.toggle('hidden');
      tone(520, 0.07);
    });
    document.querySelectorAll('.mobile-nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        menuBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.add('hidden');
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
      });
    });
  }

  // Mapa SVG de Hispanoamérica
  const regionTitle = document.getElementById('region-title');
  const regionDesc = document.getElementById('region-desc');
  document.querySelectorAll('.hispanic-region').forEach(function (el) {
    el.addEventListener('click', function () {
      tone(600, 0.08);
      if (regionTitle) regionTitle.textContent = el.getAttribute('data-region') || '';
      if (regionDesc) regionDesc.textContent = el.getAttribute('data-info') || '';
    });
  });

  // Pestañas de Ecosistema Deportivo
  const ecoBtns = document.querySelectorAll('.eco-tab-btn');
  const ecoPanels = document.querySelectorAll('.eco-panel');
  ecoBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tone(580, 0.08);
      const target = btn.getAttribute('data-eco-tab');
      ecoBtns.forEach(function (b) {
        b.setAttribute('aria-selected', 'false');
        b.className = 'eco-tab-btn px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-orange-50 text-stone-700 hover:bg-orange-100 cursor-pointer';
      });
      btn.setAttribute('aria-selected', 'true');
      btn.className = 'eco-tab-btn px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-ahd-warmDark text-white shadow-md cursor-pointer';
      ecoPanels.forEach(function (panel) {
        panel.classList.toggle('hidden', panel.id !== 'eco-panel-' + target);
      });
    });
  });

  // Filtro de roles
  const filterBtns = document.querySelectorAll('.role-filter-btn');
  const roleCards = document.querySelectorAll('.role-card');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tone(620, 0.07);
      const filter = btn.getAttribute('data-role-filter');
      filterBtns.forEach(function (b) {
        b.className = 'role-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-stone-700 border border-orange-200 cursor-pointer';
      });
      btn.className = 'role-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-600 text-white cursor-pointer';
      roleCards.forEach(function (card) {
        card.classList.toggle('hidden', filter !== 'todos' && card.getAttribute('data-area') !== filter);
      });
    });
  });

  // Afiliados locales (datos personales, tipo de afiliación, fotografía y hoja de vida)
  const defaultPhotoSvg =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="#ffedd5"/><circle cx="48" cy="36" r="16" fill="#ea580c"/><path d="M20 82c4-15 16-23 28-23s24 8 28 23" fill="#7c2d12"/></svg>'
    );

  function loadAffiliates() {
    try {
      const raw = localStorage.getItem(STORAGE_AFFILIATES);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    const initial = [
      {
        cedula: '100200300',
        nombre: 'Afiliado Ejemplo — Dirección Técnica',
        tipoAfiliacion: 'Entrenador Deportivo',
        claseAsociado: 'Gestor',
        telefono: '+57 3227267413',
        correo: 'contacto@ahdmarcasports.org',
        ubicacion: 'Colombia — Santiago de Cali',
        fotoUrl: defaultPhotoSvg,
        cvName: 'hoja_de_vida_entrenador.pdf'
      }
    ];
    localStorage.setItem(STORAGE_AFFILIATES, JSON.stringify(initial));
    return initial;
  }

  function saveAffiliates(list) {
    localStorage.setItem(STORAGE_AFFILIATES, JSON.stringify(list));
  }

  const directoryGrid = document.getElementById('affiliates-directory-grid');
  const filterTypeSelect = document.getElementById('filter-affiliates-type');

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderDirectory() {
    if (!directoryGrid) return;
    const list = loadAffiliates();
    const selectedType = filterTypeSelect ? filterTypeSelect.value : 'TODOS';
    const filtered = selectedType === 'TODOS' ? list : list.filter(function (a) { return a.tipoAfiliacion === selectedType; });

    if (filtered.length === 0) {
      directoryGrid.innerHTML = '<p class="text-sm text-stone-600 col-span-full">No hay registros guardados para este tipo de afiliación.</p>';
      return;
    }

    directoryGrid.innerHTML = filtered
      .map(function (a) {
        return (
          '<article class="rounded-2xl bg-ahd-cream border border-orange-200 p-4 flex items-start gap-3.5">' +
          '<img src="' + esc(a.fotoUrl || defaultPhotoSvg) + '" alt="Foto de ' + esc(a.nombre) + '" class="w-16 h-16 rounded-xl object-cover border border-orange-300 bg-white shrink-0" />' +
          '<div class="min-w-0 text-xs space-y-1">' +
          '<span class="inline-block px-2 py-0.5 rounded-md bg-orange-600 text-white font-bold">' + esc(a.tipoAfiliacion) + '</span>' +
          '<h4 class="font-extrabold text-ahd-warmDark text-sm truncate">' + esc(a.nombre) + '</h4>' +
          '<p class="text-stone-600">Cédula: <strong>' + esc(a.cedula) + '</strong> • Clase: ' + esc(a.claseAsociado) + '</p>' +
          '<p class="text-stone-600 truncate">' + esc(a.ubicacion) + ' • ' + esc(a.telefono) + '</p>' +
          '<p class="text-stone-500 truncate">CV: ' + esc(a.cvName || 'Adjunto') + '</p>' +
          '</div>' +
          '</article>'
        );
      })
      .join('');
  }

  if (filterTypeSelect) {
    filterTypeSelect.addEventListener('change', renderDirectory);
  }

  // Ingreso por cédula
  const loginForm = document.getElementById('cedula-login-form');
  const loginFeedback = document.getElementById('login-feedback');
  const activeMemberCard = document.getElementById('active-member-card');

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const cedula = document.getElementById('login-cedula').value.trim();
      const found = loadAffiliates().find(function (a) { return a.cedula === cedula; });

      loginFeedback.classList.remove('hidden');
      if (found) {
        tone(760, 0.12);
        loginFeedback.className = 'p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs sm:text-sm font-semibold';
        loginFeedback.textContent = 'Afiliado encontrado: ' + found.nombre + '.';
        activeMemberCard.classList.remove('hidden');
        document.getElementById('active-member-photo').src = found.fotoUrl || defaultPhotoSvg;
        document.getElementById('active-member-name').textContent = found.nombre;
        document.getElementById('active-member-role').textContent = found.tipoAfiliacion + ' (' + found.claseAsociado + ')';
        document.getElementById('active-member-meta').textContent =
          'Cédula: ' + found.cedula + ' | Ubicación: ' + found.ubicacion + ' | Correo: ' + found.correo + ' | CV: ' + found.cvName;
      } else {
        tone(290, 0.14);
        loginFeedback.className = 'p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs sm:text-sm font-semibold';
        loginFeedback.textContent = 'La cédula "' + cedula + '" no figura registrada. Completa el formulario de afiliación gratuita.';
        activeMemberCard.classList.add('hidden');
        const regCedula = document.getElementById('reg-cedula');
        if (regCedula) regCedula.value = cedula;
      }
    });
  }

  // Registro con datos personales, fotografía y hoja de vida
  const fullForm = document.getElementById('full-affiliate-form');
  const regFeedback = document.getElementById('reg-feedback');

  if (fullForm) {
    fullForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const nombre = document.getElementById('reg-nombre').value.trim();
      const cedula = document.getElementById('reg-cedula').value.trim();
      const tipoAfiliacion = document.getElementById('reg-tipo').value;
      const claseAsociado = document.getElementById('reg-clase').value;
      const telefono = document.getElementById('reg-telefono').value.trim();
      const correo = document.getElementById('reg-correo').value.trim();
      const ubicacion = document.getElementById('reg-ubicacion').value.trim();
      const fotoFile = document.getElementById('reg-foto').files[0];
      const cvFile = document.getElementById('reg-cv').files[0];
      if (!fotoFile || !cvFile) return;

      const reader = new FileReader();
      reader.onload = function () {
        const list = loadAffiliates();
        const record = {
          cedula: cedula,
          nombre: nombre,
          tipoAfiliacion: tipoAfiliacion,
          claseAsociado: claseAsociado,
          telefono: telefono,
          correo: correo,
          ubicacion: ubicacion,
          fotoUrl: typeof reader.result === 'string' ? reader.result : defaultPhotoSvg,
          cvName: cvFile.name
        };
        const idx = list.findIndex(function (a) { return a.cedula === cedula; });
        if (idx >= 0) list[idx] = record;
        else list.push(record);
        saveAffiliates(list);
        renderDirectory();

        tone(820, 0.14);
        regFeedback.classList.remove('hidden');
        regFeedback.textContent =
          'Afiliación registrada para ' + nombre + ' (' + tipoAfiliacion + ') con fotografía y hoja de vida (' + cvFile.name + ').';
        fullForm.reset();
      };
      reader.readAsDataURL(fotoFile);
    });
  }

  // Galería local de videos
  const videoForm = document.getElementById('video-upload-form');
  const videoFeedback = document.getElementById('video-feedback');
  const videosGrid = document.getElementById('videos-gallery-grid');

  if (videoForm && videosGrid) {
    videoForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const titulo = document.getElementById('vid-titulo').value.trim();
      const autor = document.getElementById('vid-autor').value.trim();
      const file = document.getElementById('vid-archivo').files[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      const card = document.createElement('article');
      card.className = 'rounded-2xl bg-ahd-cream border border-orange-200 p-4 shadow-2xs';
      card.innerHTML =
        '<video src="' + url + '" controls preload="metadata" class="w-full rounded-xl bg-stone-950 mb-3"></video>' +
        '<h4 class="font-extrabold text-ahd-warmDark text-sm">' + esc(titulo) + '</h4>' +
        '<p class="text-xs text-stone-600 mt-1">Ponente/Afiliado: ' + esc(autor) + ' (' + esc(file.name) + ')</p>';
      videosGrid.prepend(card);

      tone(720, 0.12);
      if (videoFeedback) {
        videoFeedback.classList.remove('hidden');
        videoFeedback.textContent = 'Video "' + titulo + '" agregado a la galería de esta sesión.';
      }
      videoForm.reset();
    });
  }

  // Contador local de clics
  const clicksEl = document.getElementById('session-clicks');
  const simCopEl = document.getElementById('session-sim-cop');
  let clicks = Number(localStorage.getItem(STORAGE_CLICKS) || '0');

  function updateClicksUI() {
    if (clicksEl) clicksEl.textContent = String(clicks);
    if (simCopEl) simCopEl.textContent = '$' + (clicks * SIM_COP_PER_CLICK).toLocaleString('es-CO') + ' COP';
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('button')) {
      clicks += 1;
      localStorage.setItem(STORAGE_CLICKS, String(clicks));
      updateClicksUI();
    }
  });

  renderDirectory();
  updateClicksUI();
})();
