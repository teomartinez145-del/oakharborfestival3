document.addEventListener("DOMContentLoaded", () => {
  const tickets = document.querySelectorAll(".ticket");
 
  tickets.forEach((ticket) => {
    ticket.addEventListener("click", () => {
      const isFlipped = ticket.classList.toggle("is-flipped");
      ticket.setAttribute("aria-pressed", String(isFlipped));
    });
  });
});
 