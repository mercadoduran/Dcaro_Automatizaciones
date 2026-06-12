document.addEventListener('DOMContentLoaded', () => {

  // ── MENÚ MÓVIL ──
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // ── REVELADO AL HACER SCROLL (FADE IN UP) ──
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('vis');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ── SIMULADOR TOGGLE (EL CAOS VS EL PROGRESO) ──
  const tabBtns = document.querySelectorAll('.sim-tab-btn');
  const tabContents = document.querySelectorAll('.sim-content');

  if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');

        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const activeContent = document.querySelector(`.sim-content[data-content="${target}"]`);
        if (activeContent) {
          activeContent.classList.add('active');
        }
      });
    });
  }

  // ── CONTADORES ANIMADOS EN EL HERO ──
  const counterElements = document.querySelectorAll('.counter');

  if (counterElements.length > 0) {
    const animateCounter = (el) => {
      const targetVal = parseInt(el.getAttribute('data-val'), 10);
      const pre = el.getAttribute('data-pre') || '';
      const suf = el.getAttribute('data-suf') || '';
      const hasFormat = el.getAttribute('data-format') === 'true';

      let currentVal = 0;
      const duration = 1200; // Duración de la animación en ms
      const increment = targetVal / (duration / 16); // 16ms por frame (60fps)

      const updateNumber = () => {
        currentVal += increment;
        if (currentVal >= targetVal) {
          let formattedVal = targetVal;
          if (hasFormat) {
            // Formatear miles con punto
            formattedVal = targetVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          }
          el.textContent = pre + formattedVal + suf;
        } else {
          let displayVal = Math.floor(currentVal);
          if (hasFormat) {
            displayVal = displayVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          }
          el.textContent = pre + displayVal + suf;
          requestAnimationFrame(updateNumber);
        }
      };

      requestAnimationFrame(updateNumber);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  // ── FORMULARIO INTERACTIVO MULTI-PASO (V2) ──
  const formSteps = document.querySelectorAll('.form-step');
  const nextBtns = document.querySelectorAll('.btn-next');
  const prevBtns = document.querySelectorAll('.btn-prev');
  const stepIndicators = document.querySelectorAll('.step-indicator');
  const progressBar = document.querySelector('.step-progress-bar');

  let currentStep = 0;

  // Guardar respuestas del usuario
  const userAnswers = {
    dolor: '',
    herramientas: [],
    nombre: '',
    correo: '',
    telefono: ''
  };

  const updateFormSteps = () => {
    formSteps.forEach((step, idx) => {
      step.classList.toggle('active', idx === currentStep);
    });

    // Actualizar indicadores de progreso
    stepIndicators.forEach((indicator, idx) => {
      if (idx === currentStep) {
        indicator.classList.add('active');
        indicator.classList.remove('completed');
      } else if (idx < currentStep) {
        indicator.classList.remove('active');
        indicator.classList.add('completed');
      } else {
        indicator.classList.remove('active');
        indicator.classList.remove('completed');
      }
    });

    // Actualizar barra de progreso
    if (progressBar && stepIndicators.length > 1) {
      const percentage = (currentStep / (stepIndicators.length - 1)) * 100;
      progressBar.style.width = `${percentage}%`;
    }
  };

  // Selección de dolor (Paso 1 - Selección Única)
  const dolorOptions = document.querySelectorAll('.option-item[data-dolor]');
  dolorOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      dolorOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      userAnswers.dolor = opt.getAttribute('data-dolor');
    });
  });

  // Selección de herramientas (Paso 2 - Selección Múltiple)
  const toolOptions = document.querySelectorAll('.option-item[data-tool]');
  toolOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      opt.classList.toggle('selected');
      const tool = opt.getAttribute('data-tool');
      if (opt.classList.contains('selected')) {
        if (!userAnswers.herramientas.includes(tool)) {
          userAnswers.herramientas.push(tool);
        }
      } else {
        userAnswers.herramientas = userAnswers.herramientas.filter(t => t !== tool);
      }
    });
  });

  // Botones Siguiente
  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep === 0) {
        // Validar Paso 1: Dolor
        if (!userAnswers.dolor) {
          alert('Por favor, selecciona el mayor dolor en tu operación.');
          return;
        }
      } else if (currentStep === 1) {
        // Validar Paso 2: Herramientas
        if (userAnswers.herramientas.length === 0) {
          alert('Por favor, selecciona al menos una herramienta.');
          return;
        }
      } else if (currentStep === 2) {
        // Validar Paso 3: Inputs de contacto
        const nombreInput = document.getElementById('form-nombre');
        const correoInput = document.getElementById('form-correo');
        const telInput = document.getElementById('form-tel');

        if (!nombreInput.value.trim()) {
          nombreInput.style.borderColor = 'var(--red-text)';
          alert('Por favor, ingresa tu nombre.');
          return;
        } else {
          nombreInput.style.borderColor = '';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!correoInput.value.trim() || !emailRegex.test(correoInput.value.trim())) {
          correoInput.style.borderColor = 'var(--red-text)';
          alert('Por favor, ingresa un correo electrónico corporativo válido.');
          return;
        } else {
          correoInput.style.borderColor = '';
        }

        if (!telInput.value.trim()) {
          telInput.style.borderColor = 'var(--red-text)';
          alert('Por favor, ingresa tu número de WhatsApp.');
          return;
        } else {
          telInput.style.borderColor = '';
        }

        userAnswers.nombre = nombreInput.value.trim();
        userAnswers.correo = correoInput.value.trim();
        userAnswers.telefono = telInput.value.trim();

        // Avanzar al paso de éxito
        currentStep++;
        updateFormSteps();

        // Generar enlace dinámico de WhatsApp
        const waBtn = document.getElementById('whatsapp-submit-btn');
        if (waBtn) {
          const formattedTools = userAnswers.herramientas.join(', ');
          const messageText = `Hola DCARO PROGRESS, acabo de completar el diagnóstico interactivo en la landing page.\n\n*Mis respuestas:*\n- 🔴 *Mayor dolor:* ${userAnswers.dolor}\n- 🛠️ *Herramientas M365:* ${formattedTools}\n- 👤 *Nombre:* ${userAnswers.nombre}\n- 📧 *Correo:* ${userAnswers.correo}\n- 📱 *Teléfono:* ${userAnswers.telefono}\n\nMe gustaría coordinar mi sesión de diagnóstico de 30 minutos sin costo.`;
          const encodedText = encodeURIComponent(messageText);

          // NOTA: Reemplaza con tu número de WhatsApp corporativo (código de país + número, ej. 573163158021)
          const WHATSAPP_PHONE = '573169378665';
          waBtn.setAttribute('href', `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`);
        }
        return;
      }

      currentStep++;
      updateFormSteps();
    });
  });

  // Botones Anterior
  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        updateFormSteps();
      }
    });
  });

  // Inicializar estado del formulario
  if (formSteps.length > 0) {
    updateFormSteps();
  }

  // ── MOSTRAR/OCULTAR BOTÓN FLOTANTE WHATSAPP ──
  const whatsappFloat = document.querySelector('.whatsapp-float');

  if (whatsappFloat) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        whatsappFloat.classList.add('show');
      } else {
        whatsappFloat.classList.remove('show');
      }
    });
  }



});
