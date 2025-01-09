document.addEventListener('DOMContentLoaded', () => {
    // Initialiser deux systèmes de recherche indépendants
    initSearch('search-input-1', 'search-button-1', 'masters-container-1', 'load-more-1', 'details-container-1');
    initSearch('search-input-2', 'search-button-2', 'masters-container-2', 'load-more-2', 'details-container-2');
});

// Fonction pour initialiser la recherche et l'affichage des détails
function initSearch(inputId, buttonId, containerId, loadMoreId, detailsContainerId) {
    const searchInput = document.getElementById(inputId);
    const searchButton = document.getElementById(buttonId);
    const resultsContainer = document.getElementById(containerId);
    const detailsContainer = document.getElementById(detailsContainerId);
    const loadMoreButton = document.getElementById(loadMoreId); 

    let filteredMasters = [];
    let currentIndex = 0;

    // Fonction pour rechercher les masters
    async function searchMasters(query) {
        try {
            const response = await fetch(`https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/formations?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Erreur lors de la récupération des résultats.');

            filteredMasters = await response.json();
            console.log(`Résultats pour ${query}:`, filteredMasters);

            currentIndex = 0;
            resultsContainer.innerHTML = '';
            loadMore(9);

            if (filteredMasters.length > 9) {
                loadMoreButton.style.display = 'block';
            } else {
                loadMoreButton.style.display = 'none';
            }
        } catch (error) {
            console.error('Erreur lors de la recherche :', error);
            resultsContainer.innerHTML = `<p class="text-red-500">Aucun résultat trouvé.</p>`;
        }
    }

    // Fonction pour charger dynamiquement plus de résultats
    function loadMore(count) {
        const nextMasters = filteredMasters.slice(currentIndex, currentIndex + count);
        nextMasters.forEach(master => {
            const masterCard = document.createElement('div');
            masterCard.className = 'p-4 bg-white border rounded-md shadow-sm cursor-pointer hover:bg-gray-100';
            masterCard.innerHTML = `
                <h2 class="font-bold text-lg mb-2 lg:text-2xl">${master.parcours || 'Nom non disponible'}</h2>
                <p class="text-sm text-gray-500 lg:text-lg">
                    Alternance : ${master.alternance ? 'Oui' : 'Non'}
                </p>
                <p class="text-xs text-gray-400 lg:text-sm mt-2">Lieu(x) : ${master.lieux || 'Non spécifié'}</p>
            `;

            // Affichage des détails dynamiquement au clic
            masterCard.addEventListener('click', () => {
                // Nettoyer les résultats pour afficher uniquement les détails
                resultsContainer.innerHTML = '';
                loadMoreButton.style.display = 'none';
                loadMasterPage(master.ifc, detailsContainer);
            });

            resultsContainer.appendChild(masterCard);
        });
        currentIndex += count;

        if (currentIndex >= filteredMasters.length) {
            loadMoreButton.style.display = 'none';
        }
    }

    // Charger dynamiquement la page master.html avec le master sélectionné
    async function loadMasterPage(masterId, container) {
        try {
            const response = await fetch(`master.html?id=${masterId}`);
            if (!response.ok) throw new Error('Erreur lors du chargement de la page master.html');

            const html = await response.text();
            container.innerHTML = html;
        } catch (error) {
            console.error('Erreur lors du chargement de la page master.html :', error);
            container.innerHTML = `<p class="text-red-500">Impossible de charger les détails.</p>`;
        }
    }

    // Ajouter un événement au bouton 'Charger plus'
    loadMoreButton.addEventListener('click', () => loadMore(9));

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) searchMasters(query);
    });

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) searchMasters(query);
        }
    });
}
