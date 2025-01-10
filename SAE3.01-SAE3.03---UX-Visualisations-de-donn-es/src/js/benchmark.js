document.addEventListener('DOMContentLoaded', () => {
    // Initialiser deux systèmes de recherche indépendants
    initSearch('search-input-1', 'search-button-1', 'masters-container-1', 'load-more-1', 'details-container-1');//
    initSearch('search-input-2', 'search-button-2', 'masters-container-2', 'load-more-2', 'details-container-2');
});

// Fonction pour initialiser la recherche et l'affichage des détails
function initSearch(inputId, buttonId, containerId, loadMoreId, detailsContainerId) {
    const searchInput = document.getElementById(inputId);//récupère l'élément input
    const searchButton = document.getElementById(buttonId);//récupère l'élément button
    const resultsContainer = document.getElementById(containerId);// récupère l'élément container
    const detailsContainer = document.getElementById(detailsContainerId);// récupère l'élément detailsContainer
    const loadMoreButton = document.getElementById(loadMoreId);// récupère l'élément loadMoreButton

    let filteredMasters = []; // Tableau pour stocker les résultats filtrés
    let currentIndex = 0; // Index pour suivre les résultats affichés

    // Fonction pour rechercher les masters
    async function searchMasters(query) {
        try { //récupère les données de l'API
            const response = await fetch(`https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/formations?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Erreur lors de la récupération des résultats.');
            //récupère les données en format json
            filteredMasters = await response.json();
            console.log(`Résultats pour ${query}:`, filteredMasters);//affiche les résultats dans la console

            currentIndex = 0; // Réinitialiser l'index
            resultsContainer.innerHTML = ''; // Nettoyer les résultats précédents
            loadMore(9); // Charger les 9 premiers résultats

            if (filteredMasters.length > 9) { // Afficher le bouton 'Charger plus' si plus de 9 résultats
                loadMoreButton.style.display = 'block';
            } else { // Cacher le bouton 'Charger plus' si moins de 9 résultats
                loadMoreButton.style.display = 'none';
            }
        } catch (error) { //affiche un message d'erreur si la recherche n'a pas abouti
            console.error('Erreur lors de la recherche :', error);
            resultsContainer.innerHTML = `<p class="text-red-500">Aucun résultat trouvé.</p>`;
        }
    }

    // Fonction pour charger dynamiquement plus de résultats
    function loadMore(count) {
        const nextMasters = filteredMasters.slice(currentIndex, currentIndex + count); // Récupérer les prochains résultats
        nextMasters.forEach(master => { // Afficher chaque résultat
            const masterCard = document.createElement('div'); // Créer une carte pour chaque master
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

            resultsContainer.appendChild(masterCard); // Ajouter la carte au conteneur
        });
        currentIndex += count; // Mettre à jour l'index

        if (currentIndex >= filteredMasters.length) { // Cacher le bouton 'Charger plus' si tous les résultats sont affichés
            loadMoreButton.style.display = 'none';
        }
    }

    // Charger dynamiquement la page master.html avec le master sélectionné
    async function loadMasterPage(masterId, container) {
        try {
            const response = await fetch(`master.html?id=${masterId}`); // Charger la page master.html
            if (!response.ok) throw new Error('Erreur lors du chargement de la page master.html'); // Afficher une erreur si le chargement échoue

            const html = await response.text(); // Récupérer le contenu de la page
            container.innerHTML = html; // Afficher le contenu dans le conteneur
        } catch (error) { // Afficher une erreur si le chargement échoue
            console.error('Erreur lors du chargement de la page master.html :', error);
            container.innerHTML = `<p class="text-red-500">Impossible de charger les détails.</p>`;
        }
    }

    // Ajouter un événement au bouton 'Charger plus'
    loadMoreButton.addEventListener('click', () => loadMore(9)); // Charger 9 résultats supplémentaires

    searchButton.addEventListener('click', () => { // Ajouter un événement au bouton de recherche
        const query = searchInput.value.trim(); // Récupérer la requête de recherche
        if (query) searchMasters(query); // Rechercher les masters si la requête n'est pas vide
    });

    searchInput.addEventListener('keydown', (event) => { // Ajouter un événement à la touche 'Entrée' pour la recherche
        if (event.key === 'Enter') { // Rechercher les masters si la touche 'Entrée' est enfoncée
            const query = searchInput.value.trim(); // Récupérer la requête de recherche
            if (query) searchMasters(query); // Rechercher les masters si la requête n'est pas vide
        }
    });
}
