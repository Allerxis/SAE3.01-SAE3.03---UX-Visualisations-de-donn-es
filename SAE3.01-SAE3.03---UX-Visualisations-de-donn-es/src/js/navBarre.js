document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll("nav a"); // Sélectionner tous les liens du menu
  const currentPath = window.location.pathname.split('/').pop(); // Obtenir uniquement le nom du fichier (sans dossier)

  tabs.forEach((tab) => {
    // Récupérer le nom de fichier de l'attribut href (sans ./)
    const tabPath = tab.getAttribute("href").replace("./", "");

    if (tabPath === currentPath) { // Vérifier si le lien correspond à l'URL actuelle
      // Activer le lien correspondant à l'URL actuelle
      tab.classList.add("text-black", "active:bg-gray-200"); // Ajouter les classes CSS
      tab.classList.remove("text-gray-500"); // Supprimer la classe CSS
    } else {
      // Désactiver les autres liens
      tab.classList.remove("text-black", "active:bg-gray-200"); // Supprimer les classes CSS
      tab.classList.add("text-gray-500"); // Ajouter la classe CSS
    }
  });
});

document.addEventListener('DOMContentLoaded', () => { // Attend que le DOM soit chargé
  const buttonRecherche = document.getElementById('button-recherche');// Récupère le bouton de recherche
  if (buttonRecherche) { // Vérifie si le bouton existe
    buttonRecherche.addEventListener('click', () => { // Ajoute un événement au clic sur le bouton
      window.location.href = './lesMasters.html'; // Redirige vers la page de recherche
    });
  } else {
    console.error('La div #button-recherche est introuvable.'); //affiche un message d'erreur si le bouton n'est pas trouvé
  }
});