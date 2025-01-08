document.addEventListener('DOMContentLoaded', () => {
    // Fonction pour afficher un loader
    const showLoader = (containerId, message = "Chargement en cours...") => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const loaderHTML = `
            <div class="loader flex flex-col items-center justify-center h-full">
                <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                <p class="mt-4 text-gray-600 text-lg font-semibold">${message}</p>
            </div>
        `;
        container.innerHTML = loaderHTML;
        container.classList.add('loader-active');
    };

    // Fonction pour masquer le loader
    const hideLoader = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = ''; // Nettoyer le conteneur
        container.classList.remove('loader-active');
    };

    // Appliquer automatiquement le loader aux div avec la classe "loader-container"
    const loaderContainers = document.querySelectorAll('.loader-container');
    loaderContainers.forEach(container => {
        const id = container.id;
        if (!id) return;

        showLoader(id); // Affiche le loader
    });
});
