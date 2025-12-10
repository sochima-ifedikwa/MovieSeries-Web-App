/*
  scripts/ui.js
  Small UI helpers (loading/empty states) and theme toggle logic.
  - setupThemeToggle(button): applies stored theme preference and wires toggle
  - showLoading(container, text): display loading placeholder
  - showEmpty(container, text): display empty placeholder
*/
// scripts/ui.js
export function showLoading(container, text = "Loading...") {
  container.innerHTML = `<div class="loading">${text}</div>`;
}

export function showEmpty(container, text = "No results") {
  container.innerHTML = `<div class="empty">${text}</div>`;
}

export function setupThemeToggle(button) {
  const current = localStorage.getItem("theme") || "dark";
  applyTheme(current);

  button.addEventListener("click", () => {
    const now = document.body.classList.contains("light") ? "dark" : "light";
    applyTheme(now);
    localStorage.setItem("theme", now);
  });
}

function applyTheme(name) {
  if (name === "light") document.body.classList.add("light");
  else document.body.classList.remove("light");
}
