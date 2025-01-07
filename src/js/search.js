document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments du DOM
    const searchInputs = document.querySelectorAll('input[type="text"][placeholder="Rechercher"]');
    const searchButtons = document.querySelectorAll('button img[alt="Search Icon"]');
    const resultsContainer = document.getElementById('masters-container'); // Pour les résultats sur rechercheETfiltres.html

    // Fonction pour effectuer la recherche
    async function searchMasters(query) {
        try {
            // Construction de l'URL pour la requête
            const response = await fetch(`https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/formations?search=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Erreur lors de la récupération des résultats.');

            const data = await response.json();

            // Afficher les résultats
            displayResults(data);
        } catch (error) {
            console.error('Erreur lors de la recherche :', error);
            if (resultsContainer) {
                resultsContainer.innerHTML = `<p class="text-red-500">Aucun résultat trouvé.</p>`;
            }
        }
    }

    // Fonction pour afficher les résultats
    function displayResults(data) {
        if (resultsContainer) {
            resultsContainer.innerHTML = ''; // Vider les résultats précédents
            data.forEach(master => {
                const masterCard = document.createElement('a');
                masterCard.href = `master.html?id=${master.ifc}`;
                masterCard.innerHTML = `
                    <div class="p-4 bg-white border rounded-md shadow-sm">
                        <h2 class="font-bold text-lg mb-2 lg:text-2xl">${master.parcours || 'Nom non disponible'}</h2>
                        <p class="text-sm text-gray-500 lg:text-lg">Alternance : ${master.alternance ? 'Oui' : 'Non'}</p>
                        <p class="text-xs text-gray-400 lg:text-sm mt-2">Lieu(x) : ${master.lieux || 'Non spécifié'}</p>
                    </div>
                `;
                resultsContainer.appendChild(masterCard);
            });
        }
    }

    // Gestion des événements de recherche
    searchButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const query = searchInputs[index].value.trim();
            if (query) {
                searchMasters(query);
            } else {
                console.warn('Veuillez saisir un terme de recherche.');
            }
        });
    });

    searchInputs.forEach(input => {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const query = input.value.trim();
                if (query) {
                    searchMasters(query);
                }
            }
        });
    });
});
