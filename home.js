// =====================================================
// OAK HARBOR MUSIC FESTIVAL — home.js
// Interactividad EXCLUSIVA del nuevo homepage (Index1.html):
// countdown, filtros del line-up, tabs del schedule, acordeón
// de FAQ y la galería (imagen destacada + miniaturas). sponsors.html
// y about.html no cargan este archivo, así que no los afecta en nada.
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  // ---------- Countdown ----------
  const countdownEl = document.getElementById("countdown");

  if (countdownEl) {
    const targetDate = new Date(countdownEl.dataset.target);
    const daysEl = countdownEl.querySelector('[data-unit="days"]');
    const hoursEl = countdownEl.querySelector('[data-unit="hours"]');
    const minutesEl = countdownEl.querySelector('[data-unit="minutes"]');
    const secondsEl = countdownEl.querySelector('[data-unit="seconds"]');

    const pad = (n) => String(n).padStart(2, "0");

    function updateCountdown() {
      const now = new Date();
      let diff = targetDate.getTime() - now.getTime();

      if (isNaN(diff)) return;

      if (diff <= 0) {
        diff = 0;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      if (daysEl) daysEl.textContent = pad(days);
      if (hoursEl) hoursEl.textContent = pad(hours);
      if (minutesEl) minutesEl.textContent = pad(minutes);
      if (secondsEl) secondsEl.textContent = pad(seconds);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ---------- Filtros del line-up (botón "Filters" que abre un panel
  // lateral con varias categorías — inspirado en el filtro de
  // orlando.houseofblues.com/shows que pidió Mateo) ----------
  const lineupCards = document.querySelectorAll(".lineup-card");
  const lineupEmpty = document.getElementById("lineup-empty");
  const filterTrigger = document.getElementById("lineup-filter-trigger");
  const filterCount = document.getElementById("lineup-filter-count");
  const filterDrawer = document.getElementById("lineup-filter-drawer");
  const filterBackdrop = document.getElementById("lineup-filter-backdrop");
  const filterClose = document.getElementById("lineup-filter-close");
  const filterClear = document.getElementById("lineup-filter-clear");
  const filterApply = document.getElementById("lineup-filter-apply");
  const activeChipsEl = document.getElementById("lineup-active-chips");
  const resultsCountEl = document.getElementById("lineup-results-count");
  const filterOptionButtons = filterDrawer
    ? filterDrawer.querySelectorAll(".lineup-filter[data-filter-group]")
    : [];

  if (filterTrigger && filterDrawer && lineupCards.length) {
    const totalActs = lineupCards.length;
    const filterLabels = {
      day: { 1: "Day 1 · Fri", 2: "Day 2 · Sat", 3: "Day 3 · Sun" },
      stage: { east: "Island Thrift East", west: "Peoples Bank West" },
      genre: {
        rock: "Rock",
        "folk-americana": "Folk & Americana",
        "blues-soul": "Blues & Soul",
        "pop-funk": "Pop & Funk",
        "teen-showcase": "Teen Talent Showcase",
      },
    };

    // Filtros ya aplicados al grid.
    const appliedFilters = { day: "all", stage: "all", genre: "all" };
    // Selección dentro del panel — se confirma recién al tocar "Show
    // Results" (o se descarta si se cierra el panel de otra forma).
    let pendingFilters = { ...appliedFilters };

    const countMatches = (filters) => {
      let count = 0;
      lineupCards.forEach((card) => {
        const matches =
          (filters.day === "all" || card.dataset.day === filters.day) &&
          (filters.stage === "all" || card.dataset.stage === filters.stage) &&
          (filters.genre === "all" || card.dataset.genre === filters.genre);
        if (matches) count += 1;
      });
      return count;
    };

    const setDrawerButtonsFromPending = () => {
      filterOptionButtons.forEach((btn) => {
        const group = btn.dataset.filterGroup;
        const isActive = btn.dataset.value === pendingFilters[group];
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-checked", String(isActive));
      });
    };

    const updateApplyLabel = () => {
      if (!filterApply) return;
      const n = countMatches(pendingFilters);
      filterApply.textContent = n === 0 ? "Show Results (0)" : `Show Results (${n})`;
    };

    const updateActiveChips = () => {
      if (!activeChipsEl) return;
      activeChipsEl.innerHTML = "";

      Object.keys(appliedFilters).forEach((group) => {
        const value = appliedFilters[group];
        if (value === "all") return;

        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "lineup-active-chip";
        chip.dataset.chipGroup = group;
        chip.setAttribute(
          "aria-label",
          `Remove filter: ${filterLabels[group][value]}`
        );
        chip.innerHTML = `${filterLabels[group][value]} <span aria-hidden="true">&times;</span>`;
        chip.addEventListener("click", () => {
          appliedFilters[group] = "all";
          pendingFilters = { ...appliedFilters };
          applyToGrid();
        });
        activeChipsEl.appendChild(chip);
      });
    };

    const updateTriggerBadge = () => {
      const activeCount = Object.values(appliedFilters).filter((v) => v !== "all").length;
      if (filterCount) {
        filterCount.textContent = String(activeCount);
        filterCount.hidden = activeCount === 0;
      }
      filterTrigger.classList.toggle("has-active-filters", activeCount > 0);
    };

    const applyToGrid = () => {
      let visibleCount = 0;

      lineupCards.forEach((card) => {
        const matches =
          (appliedFilters.day === "all" || card.dataset.day === appliedFilters.day) &&
          (appliedFilters.stage === "all" || card.dataset.stage === appliedFilters.stage) &&
          (appliedFilters.genre === "all" || card.dataset.genre === appliedFilters.genre);
        card.hidden = !matches;
        if (matches) visibleCount += 1;
      });

      if (lineupEmpty) lineupEmpty.hidden = visibleCount !== 0;
      if (resultsCountEl) {
        resultsCountEl.textContent =
          visibleCount === totalActs
            ? `Showing all ${totalActs} acts`
            : `Showing ${visibleCount} of ${totalActs} acts`;
      }

      updateTriggerBadge();
      updateActiveChips();
      pendingFilters = { ...appliedFilters };
      setDrawerButtonsFromPending();
      updateApplyLabel();
    };

    const openDrawer = () => {
      pendingFilters = { ...appliedFilters };
      setDrawerButtonsFromPending();
      updateApplyLabel();
      filterDrawer.classList.add("is-open");
      filterDrawer.setAttribute("aria-hidden", "false");
      if (filterBackdrop) filterBackdrop.hidden = false;
      filterTrigger.setAttribute("aria-expanded", "true");
      document.body.classList.add("lineup-drawer-open");
      const firstBtn = filterDrawer.querySelector(".lineup-filter[data-filter-group]");
      if (firstBtn) firstBtn.focus();
    };

    const closeDrawer = ({ discard = true } = {}) => {
      if (discard) pendingFilters = { ...appliedFilters };
      filterDrawer.classList.remove("is-open");
      filterDrawer.setAttribute("aria-hidden", "true");
      if (filterBackdrop) filterBackdrop.hidden = true;
      filterTrigger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("lineup-drawer-open");
      filterTrigger.focus();
    };

    filterTrigger.addEventListener("click", () => {
      const isOpen = filterDrawer.classList.contains("is-open");
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (filterClose) filterClose.addEventListener("click", () => closeDrawer());
    if (filterBackdrop) filterBackdrop.addEventListener("click", () => closeDrawer());

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && filterDrawer.classList.contains("is-open")) {
        closeDrawer();
      }
    });

    filterOptionButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const group = btn.dataset.filterGroup;
        pendingFilters[group] = btn.dataset.value;
        setDrawerButtonsFromPending();
        updateApplyLabel();
      });
    });

    if (filterClear) {
      filterClear.addEventListener("click", () => {
        pendingFilters = { day: "all", stage: "all", genre: "all" };
        setDrawerButtonsFromPending();
        updateApplyLabel();
      });
    }

    if (filterApply) {
      filterApply.addEventListener("click", () => {
        Object.assign(appliedFilters, pendingFilters);
        applyToGrid();
        closeDrawer({ discard: false });
      });
    }

    // Estado inicial.
    applyToGrid();
  }

  // ---------- Tabs del schedule diario ----------
  const scheduleTabs = document.querySelectorAll(".schedule-tab");
  const schedulePanels = document.querySelectorAll(".schedule-columns");

  if (scheduleTabs.length && schedulePanels.length) {
    scheduleTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const day = tab.dataset.day;

        scheduleTabs.forEach((t) => {
          t.classList.remove("is-active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");

        schedulePanels.forEach((panel) => {
          panel.hidden = panel.id !== `panel-day${day}`;
          panel.classList.toggle("is-active", panel.id === `panel-day${day}`);
        });
      });
    });
  }

  // ---------- Acordeón de FAQ ----------
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const isOpen = question.getAttribute("aria-expanded") === "true";
      question.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  // ---------- Galería: imagen destacada + filmstrip de miniaturas ----------
  const galleryThumbs = document.querySelectorAll(".gallery-thumb");
  const galleryFeaturedImage = document.getElementById("gallery-featured-image");

  if (galleryThumbs.length && galleryFeaturedImage) {
    galleryThumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const full = thumb.dataset.full;
        const alt = thumb.dataset.alt || "";

        if (!full) return;

        galleryFeaturedImage.src = full;
        galleryFeaturedImage.alt = alt;

        galleryThumbs.forEach((t) => t.classList.remove("is-active"));
        thumb.classList.add("is-active");
      });
    });
  }
});