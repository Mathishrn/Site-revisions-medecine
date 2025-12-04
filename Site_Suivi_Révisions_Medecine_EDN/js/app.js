// js/app.js
// Point d'entrée qui orchestre les événements

document.addEventListener("DOMContentLoaded", () => {
  const settings = loadSettings();
  const state = loadState();
  initUI(state, settings);

  const deadlineBar = document.getElementById("deadline-progress-bar");
  if (deadlineBar) {
    updateDeadlineBox(state, settings);
  }
});
