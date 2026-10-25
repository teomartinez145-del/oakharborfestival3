// =====================================================
// OAK HARBOR MUSIC FESTIVAL — script.js
// Menú móvil, header con sombra al hacer scroll,
// y animaciones al hacer scroll (reveal).
// =====================================================
 
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  const backdrop = document.querySelector(".nav-backdrop");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
 
  // ---------- Menú móvil ----------
  function closeNav() {
    if (!nav) return;
    nav.classList.remove("is-open");
    backdrop?.classList.remove("is-open");
    navToggle?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
 
  function toggleNav() {
    if (!nav) return;
    const isOpen = nav.classList.toggle("is-open");
    backdrop?.classList.toggle("is-open", isOpen);
    navToggle?.classList.toggle("is-open", isOpen);
    navToggle?.setAttribute("aria-expanded", String(isOpen));
  }
 
  if (navToggle && nav) {
    navToggle.addEventListener("click", toggleNav);
    backdrop?.addEventListener("click", closeNav);
    nav.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", closeNav)
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }
 
  // ---------- Highlight deslizante del menú ----------
  // Píldora animada que se mueve detrás del link que se está
  // tocando con el mouse o con el teclado (inspirada en el
  // componente "motion navigation menu", hecha con CSS + JS puro).
  const navHighlight = nav?.querySelector(".nav-highlight");
 
  if (nav && navHighlight) {
    const navLinks = Array.from(nav.querySelectorAll("a"));
 
    const moveHighlightTo = (el) => {
      const navRect = nav.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      navHighlight.style.left = `${elRect.left - navRect.left}px`;
      navHighlight.style.top = `${elRect.top - navRect.top}px`;
      navHighlight.style.width = `${elRect.width}px`;
      navHighlight.style.height = `${elRect.height}px`;
      navHighlight.style.opacity = "1";
    };
 
    const hideHighlight = () => {
      navHighlight.style.opacity = "0";
    };
 
    navLinks.forEach((link) => {
      link.addEventListener("mouseenter", () => moveHighlightTo(link));
      link.addEventListener("focus", () => moveHighlightTo(link));
    });
 
    nav.addEventListener("mouseleave", hideHighlight);
    nav.addEventListener("focusout", (e) => {
      if (!nav.contains(e.relatedTarget)) hideHighlight();
    });
  }
 
  // ---------- Máquina de escribir del hero ----------
  // Escribe el título letra por letra; cuando termina, revela el
  // botón "Save the date" y los íconos de abajo (.hero-fade) en
  // cascada, en vez de esperar a que el usuario haga scroll.
  const typewriterEl = document.querySelector(".typewriter");
  const heroCta = document.querySelector(".hero-cta");
  const heroFadeEls = document.querySelectorAll(".hero-fade");
 
  function revealAfterHero() {
    heroCta?.classList.add("in-view");
    heroFadeEls.forEach((el) => el.classList.add("in-view"));
  }
 
  if (typewriterEl) {
    const text = typewriterEl.dataset.text || "";
 
    if (prefersReducedMotion) {
      typewriterEl.textContent = text;
      typewriterEl.classList.add("is-done");
      revealAfterHero();
    } else {
      let i = 0;
      const speed = 55; // ms por letra
 
      (function typeNextChar() {
        if (i <= text.length) {
          typewriterEl.textContent = text.slice(0, i);
          i += 1;
          setTimeout(typeNextChar, speed);
        } else {
          typewriterEl.classList.add("is-done");
          revealAfterHero();
        }
      })();
    }
  } else {
    // Si por alguna razón no está el título, igual mostramos lo demás.
    revealAfterHero();
  }
 
  // ---------- Formulario de contacto (about.html) ----------
  // El sitio es estático (no hay backend real que reciba el formulario),
  // así que en vez de dejar que se recargue la página al enviar,
  // mostramos un mensaje de confirmación y limpiamos los campos.
  const contactForm = document.querySelector(".contact-form");
 
  if (contactForm) {
    let confirmationEl = null;
 
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
 
      if (!confirmationEl) {
        confirmationEl = document.createElement("p");
        confirmationEl.className = "form-confirmation";
        confirmationEl.setAttribute("role", "status");
        contactForm.appendChild(confirmationEl);
      }
 
      confirmationEl.textContent =
        "Thanks! Your message has been sent — we'll get back to you soon.";
      confirmationEl.classList.remove("is-visible");
      // Forzamos un reflow para poder reiniciar la animación de aparición
      // si el usuario envía el formulario más de una vez.
      void confirmationEl.offsetWidth;
      confirmationEl.classList.add("is-visible");
 
      contactForm.reset();
    });
  }
 
  // ---------- Header con sombra al hacer scroll ----------
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
 
  // ---------- Animación al aparecer en pantalla (scroll reveal) ----------
  const revealEls = document.querySelectorAll(".reveal");
 
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in-view"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
 
    revealEls.forEach((el) => observer.observe(el));
  }
});