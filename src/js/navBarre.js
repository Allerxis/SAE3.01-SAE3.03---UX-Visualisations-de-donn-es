document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll("nav a"); // Sélectionner tous les liens du menu
  const currentPath = window.location.pathname.split('/').pop(); // Obtenir uniquement le nom du fichier (sans dossier)

  tabs.forEach((tab) => {
    // Récupérer le nom de fichier de l'attribut href (sans ./)
    const tabPath = tab.getAttribute("href").replace("./", "");

    if (tabPath === currentPath) {
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