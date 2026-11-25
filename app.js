(function () {
  'use strict';

  // 1. Menú móvil responsive
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('menu-icon-open');
  const iconClose = document.getElementById('menu-icon-close');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!isExpanded));
      mobileMenu.classList.toggle('hidden');
      iconOpen.classList.toggle('hidden');
      iconClose.classList.toggle('hidden');
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

  // 2. Interactividad del mapa SVG de Hispanoamérica
  const regionTitle = document.getElementById('region-title');
  const regionDesc = document.getElementById('region-desc');
  document.querySelectorAll('.hispanic-region').forEach(function (el) {
    el.addEventListener('click', function () {
      const title = el.getAttribute('data-region');
      const info = el.getAttribute('data-info');
      if (regionTitle && title) regionTitle.textContent = title;
      if (regionDesc && info) regionDesc.textContent = info;
    });
  });

  // 3. Pestañas de Estatutos
  const statuteBtns = document.querySelectorAll('.statute-tab-btn');
  const statutePanels = document.querySelectorAll('.statute-panel');

  statuteBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = btn.getAttribute('data-statute-tab');

      statuteBtns.forEach(function (b) {
        b.setAttribute('aria-selected', 'false');
        b.className = 'statute-tab-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 text-orange-100 hover:bg-white/20 cursor-pointer';
      });

      btn.setAttribute('aria-selected', 'true');
      btn.className = 'statute-tab-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-600 text-white cursor-pointer';

      statutePanels.forEach(function (panel) {
        panel.classList.toggle('hidden', panel.id !== 'statute-panel-' + target);
      });
    });
  });

  // 4. Pestañas principales de Ecosistema Deportivo y Afiliados
  const ecoBtns = document.querySelectorAll('.eco-tab-btn');
  const ecoPanels = document.querySelectorAll('.eco-panel');

  ecoBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = btn.getAttribute('data-eco-tab');

      ecoBtns.forEach(function (b) {
        b.setAttribute('aria-selected', 'false');
        b.className = 'eco-tab-btn px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-orange-50 text-stone-700 hover:bg-orange-100 transition-all cursor-pointer';
      });

      btn.setAttribute('aria-selected', 'true');
      btn.className = 'eco-tab-btn px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-ahd-warmDark text-white shadow-md transition-all cursor-pointer';

      ecoPanels.forEach(function (panel) {
        panel.classList.toggle('hidden', panel.id !== 'eco-panel-' + target);
      });
    });
  });

  // 5. Filtro de roles en el ámbito deportivo
  const filterBtns = document.querySelectorAll('.role-filter-btn');
  const roleCards = document.querySelectorAll('.role-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = btn.getAttribute('data-role-filter');

      filterBtns.forEach(function (b) {
        b.className = 'role-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-stone-700 border border-orange-200 hover:bg-orange-50 cursor-pointer';
      });

      btn.className = 'role-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-600 text-white cursor-pointer';

      roleCards.forEach(function (card) {
        const area = card.getAttribute('data-area');
        if (filter === 'todos' || area === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // 6. Modal interactivo de afiliación / carnet / convenio
  const modal = document.getElementById('action-modal');
  const modalBadge = document.getElementById('modal-badge');
  const modalTitle = document.getElementById('modal-title');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const cancelModalBtn = document.getElementById('cancel-modal-btn');
  const modalForm = document.getElementById('modal-form');
  const formFeedback = document.getElementById('form-feedback');

  window.openModal = function (mode) {
    if (!modal) return;
    if (formFeedback) {
      formFeedback.classList.add('hidden');
      formFeedback.textContent = '';
    }
    if (mode === 'carnet') {
      modalBadge.textContent = 'Carnetización • $20.000 COP';
      modalTitle.textContent = 'Solicitud de Carnet Acreditativo';
    } else if (mode === 'convenio') {
      modalBadge.textContent = 'Convenio Marco Institucional';
      modalTitle.textContent = 'Solicitud de Practicantes y Convenio';
    } else {
      modalBadge.textContent = 'Afiliación Totalmente Gratis';
      modalTitle.textContent = 'Formulario de Afiliación en Línea';
    }
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  function closeModal() {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }

  if (modalForm) {
    modalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const nameInput = document.getElementById('full-name');
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (formFeedback) {
        formFeedback.classList.remove('hidden');
        formFeedback.textContent =
          'Solicitud preparada para ' +
          (nameVal || 'tu perfil') +
          ' ante A.H.D MARCA SPORTS. Para confirmación directa comunícate al +57 3227267413 o +57 3146584787.';
      }
      modalForm.reset();
    });
  }
})();
