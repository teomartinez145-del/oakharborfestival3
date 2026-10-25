// =====================================================
// OAK HARBOR MUSIC FESTIVAL — scholarships.js
// Interactividad EXCLUSIVA de scholarships.html: las tarjetas de "The
// Scholarships" giran en 3D al hacer click (mismo mecanismo que los
// tickets de precio de camping.html) para mostrar en el reverso la
// lista de ganadores anteriores de cada scholarship.
// Las demás páginas no cargan este archivo, así que no las afecta.
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".schol-card");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const isFlipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", String(isFlipped));
    });
  });
});