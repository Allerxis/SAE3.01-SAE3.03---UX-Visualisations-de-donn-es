document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll("nav a"); // Sélectionner tous les liens du menu
  const currentPath = window.location.pathname; // Obtenir le chemin de l'URL actuelle

  tabs.forEach((tab) => {
    if (tab.getAttribute("href") === currentPath) {
      // Activer le lien correspondant à l'URL actuelle
      tab.classList.add("text-black", "active:bg-gray-200");
      tab.classList.remove("text-gray-500");
    } else {
      // Désactiver les autres liens
      tab.classList.remove("text-black", "active:bg-gray-200");
      tab.classList.add("text-gray-500");
    }
  });
});
