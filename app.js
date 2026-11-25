(() => {
  // Navegación entre secciones principales
  const navButtons = document.querySelectorAll(".nav-btn");
  const sectionPanels = document.querySelectorAll(".section-panel");

  function mostrarSeccion(nombreSeccion) {
    navButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.section === nombreSeccion);
    });
    sectionPanels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === `sec-${nombreSeccion}`);
    });
  }

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      mostrarSeccion(btn.dataset.section);
    });
  });

  document.getElementById("irActividadesBtn").addEventListener("click", () => {
    mostrarSeccion("actividades");
  });

  document.getElementById("irNaturalezaBtn").addEventListener("click", () => {
    mostrarSeccion("naturaleza");
  });

  // Pestañas de actividades de capacitación, actualización y bienestar social
  const actividades = {
    1: {
      titulo: "1) Capacitación y Certificación",
      descripcion:
        "Capacitar a todos los Afiliados a través de charlas, capacitaciones, cursos, diplomados y congresos deportivos, desde todos los enfoques del deporte, y certificarlos de manera online o presencial."
    },
    2: {
      titulo: "2) Asociación y Defensa de Derechos",
      descripcion:
        "Asociar a los afiliados con el fin de velar por sus derechos formativos, deportivos, sociales y laborales."
    },
    3: {
      titulo: "3) Representación Nacional e Internacional",
      descripcion:
        "Representar a los afiliados ante los diferentes entes deportivos del Estado y no gubernamentales a nivel nacional e internacional."
    },
    4: {
      titulo: "4) Asesoría a Entes Deportivos y Educativos",
      descripcion:
        "Asesorar entes deportivos, educativos oficiales y no gubernamentales desde las áreas administrativa, pedagógica, educativa y social, entre otras."
    },
    5: {
      titulo: "5) Contratación y Alianzas",
      descripcion:
        "Hacer todo tipo de contratación con instituciones educativas de nivel técnico, tecnológico y universitario, federaciones deportivas nacionales e internacionales, clubes y escuelas deportivas nacionales e internacionales, entidades del Estado y empresas privadas, entre otras."
    }
  };

  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabDetailCard = document.getElementById("tabDetailCard");

  function renderActividad(id) {
    const item = actividades[id] || actividades["1"];
    tabDetailCard.innerHTML = `
      <h3>${item.titulo}</h3>
      <p>${item.descripcion}</p>
    `;
    tabButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === String(id));
    });
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      renderActividad(btn.dataset.tab);
    });
  });

  renderActividad(1);
})();
