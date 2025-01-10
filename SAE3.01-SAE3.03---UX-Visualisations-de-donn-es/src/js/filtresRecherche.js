// Fonction pour récupérer les données des secteurs disciplinaires depuis l'API
async function fetchSecteursDisciplinaires() {
    try { //récupère les données de l'API
        const response = await fetch('https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/secteurs-disciplinaires');
        if (!response.ok) { //vérifie si la réponse est ok
            throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }
        const data = await response.json(); //récupère les données en format json
        populateFilters(data); // Remplir les filtres dans le DOM
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error); //affiche un message d'erreur si la récupération des données a échoué
    }
}

// Fonction pour ajouter les boutons dans le DOM
function populateFilters(secteurs) {
    const filtersContainer = document.getElementById('filters-container'); // Conteneur des filtres
    filtersContainer.innerHTML = ''; // Nettoyer les filtres existants

    secteurs.forEach((secteur) => { //boucle pour chaque secteur
        const button = document.createElement('button'); // Créer un bouton pour chaque secteur
        button.className = 'bg-gray-200 py-2 px-4 rounded-full text-center text-gray-800 text-sm shadow-sm'; // Ajouter des classes CSS
        button.textContent = secteur.nom; // Nom du secteur

        // Ajouter un événement pour filtrer dynamiquement
        button.addEventListener('click', () => { // Ajoute un événement au clic sur le bouton
            console.log(`Filtre sélectionné : ${secteur.nom} (ID: ${secteur.id})`); // Affiche le secteur sélectionné dans la console

            // Appeler la fonction de recherche dynamique
            applyFilter(secteur.id);
        });

        filtersContainer.appendChild(button); // Ajouter le bouton au conteneur
    });
}

// Fonction pour appliquer un filtre dynamique
async function applyFilter(secteurId) { //fonction pour appliquer un filtre dynamique
    const resultsContainer = document.getElementById('masters-container'); // Conteneur des résultats
    const apiURL = 'https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/formations'; // URL de l'API

    try { //récupère les données de l'API
        const response = await fetch(`${apiURL}?sdid=${encodeURIComponent(secteurId)}`); // Récupérer les résultats filtrés
        if (!response.ok) throw new Error('Erreur lors de la récupération des résultats.'); // Afficher une erreur si la récupération échoue

        const data = await response.json(); //récupère les données en format json
        console.log('Données filtrées reçues :', data); // Afficher les données filtrées dans la console

        // Mettre à jour les résultats affichés
        displayResults(data); // Afficher les résultats dans la page
    } catch (error) { //affiche un message d'erreur si la récupération des données a échoué
        console.error('Erreur lors de l’application du filtre :', error);
        resultsContainer.innerHTML = `<p class="text-red-500">Aucun résultat trouvé.</p>`;
    }
}

// Fonction pour afficher les résultats dans la page
function displayResults(data) {
    const resultsContainer = document.getElementById('masters-container'); // Conteneur des résultats
    resultsContainer.innerHTML = ''; // Nettoyer les résultats précédents

    if (data.length === 0) { // Vérifier si aucun résultat n'est retourné
        resultsContainer.innerHTML = '<p class="text-gray-500">Aucun résultat trouvé.</p>'; // Afficher un message d'erreur
        return;
    }

    data.forEach(master => { // Afficher chaque résultat
        const masterCard = document.createElement('a'); // Créer un lien pour chaque master
        masterCard.href = `master.html?id=${master.ifc}`; // Lien vers la page détaillée
        masterCard.innerHTML = ` 
            <div class="p-4 bg-white border rounded-md shadow-sm">
                <h2 class="font-bold text-lg mb-2 lg:text-2xl">${master.parcours || 'Nom non disponible'}</h2>
                <p class="text-sm text-gray-500 lg:text-lg">
                    Alternance : ${master.alternance ? 'Oui' : 'Non'}
                </p>
                <p class="text-xs text-gray-400 lg:text-sm mt-2">Lieu(x) : ${master.lieux || 'Non spécifié'}</p>
            </div>
        `;
        resultsContainer.appendChild(masterCard); // Ajouter la carte au conteneur
    });
}

// Charger les secteurs disciplinaires dès que la page est prête
document.addEventListener('DOMContentLoaded', fetchSecteursDisciplinaires);
