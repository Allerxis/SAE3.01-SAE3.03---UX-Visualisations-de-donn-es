// Fonction pour récupérer les données des secteurs disciplinaires depuis l'API
async function fetchSecteursDisciplinaires() {
    try {
        const response = await fetch('https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/secteurs-disciplinaires');
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }
        const data = await response.json();
        populateFilters(data); // Remplir les filtres dans le DOM
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
} 

// Fonction pour ajouter les boutons dans le DOM
function populateFilters(secteurs) {
    const filtersContainer = document.getElementById('filters-container');
    filtersContainer.innerHTML = ''; // Nettoyer les filtres existants

    secteurs.forEach((secteur) => {
        const button = document.createElement('button');
        button.className = 'bg-gray-200 py-2 px-4 rounded-full text-center text-gray-800 text-sm shadow-sm';
        button.textContent = secteur.nom; // Nom du secteur

        // Ajouter un événement pour filtrer dynamiquement
        button.addEventListener('click', () => {
            console.log(`Filtre sélectionné : ${secteur.nom} (ID: ${secteur.id})`);

            // Appeler la fonction de recherche dynamique
            applyFilter(secteur.id);
        });

        filtersContainer.appendChild(button);
    });
}

// Fonction pour appliquer un filtre dynamique
async function applyFilter(secteurId) {
    const resultsContainer = document.getElementById('masters-container'); // Conteneur des résultats
    const apiURL = 'https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/formations';

    try {
        const response = await fetch(`${apiURL}?sdid=${encodeURIComponent(secteurId)}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des résultats.');

        const data = await response.json();
        console.log('Données filtrées reçues :', data);

        // Mettre à jour les résultats affichés
        displayResults(data);
    } catch (error) {
        console.error('Erreur lors de l’application du filtre :', error);
        resultsContainer.innerHTML = `<p class="text-red-500">Aucun résultat trouvé.</p>`;
    }
}

// Fonction pour afficher les résultats dans la page
function displayResults(data) {
    const resultsContainer = document.getElementById('masters-container');
    resultsContainer.innerHTML = ''; // Nettoyer les résultats précédents

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
                    Alternance : ${master.alternance ? 'Oui' : 'Non'}
                </p>
                <p class="text-xs text-gray-400 lg:text-sm mt-2">Lieu(x) : ${master.lieux || 'Non spécifié'}</p>
            </div>
        `;
        resultsContainer.appendChild(masterCard);
    });
}

// Charger les secteurs disciplinaires dès que la page est prête
document.addEventListener('DOMContentLoaded', fetchSecteursDisciplinaires);
