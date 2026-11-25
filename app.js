(() => {
  const STORAGE_KEY_AFFILIATES = "ahd_marca_sports_affiliates_v1";
  const STORAGE_KEY_CLICKS = "ahd_marca_sports_clicks_v1";
  const ESTIMATED_COP_PER_CLICK = 50;

  // Sonido ligero con Web Audio API (sin depender de archivos externos)
  let soundEnabled = true;
  let audioCtx = null;

  function playTone(freq = 520, duration = 0.09) {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.value = 0.08;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (_) {
      // Ignorar si el navegador bloquea el audio antes de interacción
    }
  }

  const toggleSoundBtn = document.getElementById("toggleSoundBtn");
  toggleSoundBtn.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    toggleSoundBtn.setAttribute("aria-pressed", String(soundEnabled));
    toggleSoundBtn.textContent = soundEnabled ? "🔊 Sonido: ON" : "🔇 Sonido: OFF";
    if (soundEnabled) playTone(660, 0.1);
  });

  // Navegación entre pestañas principales
  const navButtons = document.querySelectorAll(".nav-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  function openTab(tabName) {
    navButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === tabName));
    tabPanels.forEach((panel) => panel.classList.toggle("active", panel.id === `tab-${tabName}`));
    playTone(540, 0.08);
  }

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => openTab(btn.dataset.tab));
  });

  document.getElementById("goRegisterBtn").addEventListener("click", () => {
    openTab("afiliacion");
    document.getElementById("regNombre").focus();
  });

  document.getElementById("goLoginBtn").addEventListener("click", () => {
    openTab("afiliacion");
    document.getElementById("loginCedula").focus();
  });

  // 5 Líneas de Acción y Bienestar Social
  const actionsData = {
    1: {
      title: "1) Capacitación y Certificación",
      desc: "Capacitar a todos los afiliados mediante charlas, capacitaciones, cursos, diplomados y congresos deportivos desde todos los enfoques del deporte, con certificación online o presencial."
    },
    2: {
      title: "2) Asociación y Defensa de Derechos",
      desc: "Asociar a los afiliados con el fin de velar por sus derechos formativos, deportivos, sociales y laborales."
    },
    3: {
      title: "3) Representación Gremial",
      desc: "Representar a los afiliados ante los diferentes entes deportivos del Estado y no gubernamentales a nivel nacional e internacional."
    },
    4: {
      title: "4) Asesoría a Entes Deportivos y Educativos",
      desc: "Asesorar entes deportivos, educativos oficiales y no gubernamentales desde las áreas administrativa, pedagógica, educativa y social, entre otras."
    },
    5: {
      title: "5) Contratación y Alianzas Estratégicas",
      desc: "Realizar contratación con instituciones educativas de nivel técnico, tecnológico y universitario, federaciones deportivas nacionales e internacionales, clubes y escuelas deportivas, entidades del Estado y empresas privadas."
    }
  };

  const actionDetailBox = document.getElementById("actionDetailBox");
  const subtabButtons = document.querySelectorAll(".subtab-btn");

  function renderAction(id) {
    const item = actionsData[id] || actionsData["1"];
    actionDetailBox.innerHTML = `<h3>${item.title}</h3><p>${item.desc}</p>`;
    subtabButtons.forEach((b) => b.classList.toggle("active", b.dataset.action === String(id)));
  }

  subtabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      playTone(600, 0.08);
      renderAction(btn.dataset.action);
    });
  });
  renderAction(1);

  // Gestión de Afiliados (con semilla inicial de ejemplo para pruebas)
  function getAffiliates() {
    const raw = localStorage.getItem(STORAGE_KEY_AFFILIATES);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (_) {
        return [];
      }
    }
    const seed = [
      {
        cedula: "100200300",
        nombre: "Martín Cabrera (Ejemplo Afiliado)",
        perfil: "Entrenador Deportivo",
        clase: "Gestor",
        pais: "Colombia - Cali",
        telefono: "+57 322 726 7413",
        cvName: "hoja_de_vida_referencia.pdf"
      }
    ];
    localStorage.setItem(STORAGE_KEY_AFFILIATES, JSON.stringify(seed));
    return seed;
  }

  function saveAffiliates(list) {
    localStorage.setItem(STORAGE_KEY_AFFILIATES, JSON.stringify(list));
  }

  // Ingreso por número de cédula
  const loginForm = document.getElementById("loginForm");
  const loginStatus = document.getElementById("loginStatus");
  const memberDashboard = document.getElementById("memberDashboard");
  const memberInfoText = document.getElementById("memberInfoText");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const cedula = document.getElementById("loginCedula").value.trim();
    const affiliates = getAffiliates();
    const found = affiliates.find((a) => a.cedula === cedula);

    loginStatus.className = "status-box show";
    if (found) {
      playTone(740, 0.12);
      loginStatus.classList.add("status-success");
      loginStatus.textContent = `Bienvenido, ${found.nombre}. Acceso habilitado.`;
      memberDashboard.classList.remove("hidden");
      memberInfoText.textContent = `${found.nombre} — Cédula: ${found.cedula} | Perfil: ${found.perfil} | Clase: ${found.clase} | Ubicación: ${found.pais} | CV: ${found.cvName || "Registrado"}`;
    } else {
      playTone(300, 0.14);
      loginStatus.classList.add("status-warn");
      loginStatus.textContent = `La cédula "${cedula}" no figura afiliada en este registro local. Completa el formulario de afiliación gratuita a la derecha.`;
      memberDashboard.classList.add("hidden");
      document.getElementById("regCedula").value = cedula;
      document.getElementById("regNombre").focus();
    }
  });

  // Formulario de afiliación gratuita con adjunto de hoja de vida
  const registerForm = document.getElementById("registerForm");
  const registerStatus = document.getElementById("registerStatus");

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("regNombre").value.trim();
    const cedula = document.getElementById("regCedula").value.trim();
    const perfil = document.getElementById("regPerfil").value;
    const clase = document.getElementById("regClase").value;
    const pais = document.getElementById("regPais").value.trim();
    const telefono = document.getElementById("regTelefono").value.trim();
    const cvFile = document.getElementById("regCv").files[0];

    if (!cvFile) return;

    const affiliates = getAffiliates();
    const existingIndex = affiliates.findIndex((a) => a.cedula === cedula);
    const record = {
      cedula,
      nombre,
      perfil,
      clase,
      pais,
      telefono,
      cvName: cvFile.name
    };

    if (existingIndex >= 0) {
      affiliates[existingIndex] = record;
    } else {
      affiliates.push(record);
    }

    saveAffiliates(affiliates);
    playTone(820, 0.14);
    registerStatus.className = "status-box show status-success";
    registerStatus.textContent = `¡Afiliación registrada! Ya puedes ingresar con la cédula ${cedula}. Hoja de vida adjunta: ${cvFile.name}.`;
    registerForm.reset();
  });

  // Subida y reproducción local de videos
  const videoForm = document.getElementById("videoForm");
  const videoStatus = document.getElementById("videoStatus");
  const videosGrid = document.getElementById("videosGrid");

  videoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("videoTitle").value.trim();
    const author = document.getElementById("videoAuthor").value.trim();
    const file = document.getElementById("videoFile").files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const card = document.createElement("article");
    card.className = "video-card";
    card.innerHTML = `
      <video src="${objectUrl}" controls preload="metadata"></video>
      <h4>${escapeHtml(title)}</h4>
      <p class="small-muted">Publicado por: ${escapeHtml(author)} (${escapeHtml(file.name)})</p>
    `;
    videosGrid.prepend(card);

    playTone(700, 0.12);
    videoStatus.className = "status-box show status-success";
    videoStatus.textContent = `Video "${title}" agregado a la galería de esta sesión.`;
    videoForm.reset();
  });

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Contador de clics y simulación local de ingresos
  const clickCounterEl = document.getElementById("clickCounter");
  const simulatedRevenueEl = document.getElementById("simulatedRevenue");
  const sponsorActionBtn = document.getElementById("sponsorActionBtn");

  let clicks = Number(localStorage.getItem(STORAGE_KEY_CLICKS) || "0");

  function updateMetrics() {
    clickCounterEl.textContent = String(clicks);
    const totalCop = clicks * ESTIMATED_COP_PER_CLICK;
    simulatedRevenueEl.textContent = `$${totalCop.toLocaleString("es-CO")} COP`;
  }

  document.addEventListener("click", (e) => {
    if (e.target.closest("button")) {
      clicks += 1;
      localStorage.setItem(STORAGE_KEY_CLICKS, String(clicks));
      updateMetrics();
    }
  });

  sponsorActionBtn.addEventListener("click", () => {
    playTone(650, 0.1);
    openTab("acciones");
  });

  updateMetrics();
})();
