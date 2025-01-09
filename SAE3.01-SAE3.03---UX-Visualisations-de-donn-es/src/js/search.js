document.addEventListener('DOMContentLoaded', () => {
    // Fonction pour initialiser les événements après chargement du header
    function initSearch() {
        const searchInput = document.getElementById('search-input'); // Champ de recherche
        const searchButton = document.getElementById('search-button'); // Bouton de recherche
        const resultsContainer = document.getElementById('masters-container'); // Conteneur des résultats

        // Vérifie si les éléments existent
        if (!searchInput || !searchButton) {
            console.error('Éléments de recherche introuvables dans le DOM.');
            return; // Arrête le script si les éléments ne sont pas trouvés
        }

        console.log('Éléments de recherche trouvés !'); // Débugging

        // Fonction pour effectuer la recherche
        async function searchMasters(query, secteur = null, ville = null) { 
            try {
                let url = 'https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/formations';
                const params = [];

                if (query) {
                    params.push(`q=${encodeURIComponent(query)}`);
                }
                if (secteur) {
                    params.push(`sdid=${encodeURIComponent(secteur)}`);
                }
                if (ville) {
                    params.push(`ville=${encodeURIComponent(ville)}`);
                }
                if (params.length > 0) {
                    url += `?${params.join('&')}`;
                }

                console.log('URL finale :', url);

                const response = await fetch(url);
                if (!response.ok) throw new Error('Erreur lors de la récupération des résultats.');

                const data = await response.json();
                console.log('Données récupérées :', data);

                // Afficher les résultats récupérés
                displayResults(data);
            } catch (error) {
                console.error('Erreur lors de la recherche :', error);
                resultsContainer.innerHTML = `<p class="text-red-500">Aucun résultat trouvé.</p>`;
            }
        }

        // Fonction pour afficher les résultats
        function displayResults(data) {
            resultsContainer.innerHTML = '';

            if (data.length === 0) {
                resultsContainer.innerHTML = '<p class="text-gray-500">Aucun résultat trouvé.</p>';
                return;
            }

            data.forEach(master => {
                const masterCard = document.createElement('a');
                masterCard.href = `master.html?id=${master.ifc}`;
                masterCard.innerHTML = `
                    <div class="p-4 bg-white border rounded-md shadow-sm">
                        <h2 class="font-bold text-lg mb-2 lg:text-2xl">${master.parcours || 'Nom non disponible'}</h2>
                        <p class="text-sm text-gray-500 lg:text-lg">
                            ${master.lieux || 'Lieu non spécifié'}
                        </p>
                        <p class="text-sm text-gray-500 lg:text-lg">
                            Alternance : ${master.alternance ? 'Oui' : 'Non'}
                        </p>
                    </div>
                `;
                resultsContainer.appendChild(masterCard);
            });
        }

        // Gestion des événements
        function handleSearch() {
            const query = searchInput.value.trim();
            if (query) {
                searchMasters(query);
            } else {
                console.warn('Veuillez saisir un terme de recherche.');
            }
        }

        searchButton.addEventListener('click', handleSearch);
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') handleSearch();
        });
    }

    // Attendre l'injection dynamique du header
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;

            // Appel pour initialiser la recherche après l'injection
            initSearch();
        })
        .catch(error => console.error('Erreur lors du chargement du header :', error));
});
