// ========================
// Fichier : search.js
// ========================
document.addEventListener('DOMContentLoaded', () => {
    // Charge dynamiquement le header
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;

            // Initialise les fonctionnalités après l'injection du header
            initSearch(); // Pour la barre de recherche
            initBurgerMenu(); // Pour le menu burger
        })
        .catch(error => console.error('Erreur lors du chargement du header :', error));

    // Fonction pour la recherche dans le header
    function initSearch() {
        const searchInput = document.getElementById('header-search-input');
        const searchButton = document.getElementById('header-search-button');

        if (!searchInput || !searchButton) {
            console.error('Éléments de recherche introuvables dans le DOM.');
            return;
        }

        function redirectToSearchPage(query) {
            if (query) {
                window.location.href = `lesMasters.html?search=${encodeURIComponent(query)}`;
            } else {
                alert('Veuillez saisir un terme de recherche.');
            }
        }

        searchButton.addEventListener('click', () => {
            redirectToSearchPage(searchInput.value.trim());
        });

        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                redirectToSearchPage(searchInput.value.trim());
            }
        });
    }

    // Fonction pour le menu burger
    function initBurgerMenu() {
        const burgerBtn = document.getElementById('burger-btn');
        const menu = document.getElementById('menu');

        if (burgerBtn && menu) {
            burgerBtn.addEventListener('click', () => {
                menu.classList.toggle('hidden');
            });
            console.log('Burger menu initialisé avec succès !');
        } else {
            console.error('Éléments burger-btn ou menu non trouvés.');
        }
    }
});


// ========================
// Fichier : mastersSearch.js
// ========================
document.addEventListener('DOMContentLoaded', () => {
    const resultsContainer = document.getElementById('masters-container'); // Conteneur des résultats

    async function fetchFormations() {
        try {
            const response = await fetch('https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/formations');
            if (!response.ok) throw new Error('Erreur lors de la récupération des formations.');
            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération des formations :', error);
            return [];
        }
    }

    function displayResults(data) {
        resultsContainer.innerHTML = '';

        if (data.length === 0) {
            resultsContainer.innerHTML = '<p class="text-gray-500">Aucun résultat trouvé.</p>';
            return;
        }

        data.forEach(formation => {
            const masterCard = document.createElement('a');
            masterCard.href = `master.html?id=${formation.ifc}`;
            masterCard.innerHTML = `
                <div class="p-4 bg-white border rounded-md shadow-sm">
                    <h2 class="font-bold text-lg mb-2 lg:text-2xl">${formation.parcours || 'Nom non disponible'}</h2>
                    <p class="text-sm text-gray-500 lg:text-lg">Lieu : ${formation.lieux || 'Non spécifié'}</p>
                    <p class="text-sm text-gray-500 lg:text-lg">Alternance : ${formation.alternance ? 'Oui' : 'Non'}</p>
                </div>
            `;
            resultsContainer.appendChild(masterCard);
        });
    }

    async function loadMasters(query) {
        const formations = await fetchFormations();
        const filteredFormations = formations.filter(formation =>
            formation.parcours.toLowerCase().includes(query.toLowerCase())
        );
        displayResults(filteredFormations);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('search');

    if (query) {
        console.log('Recherche pour :', query);
        loadMasters(query);
    } else {
        resultsContainer.innerHTML = '<p class="text-gray-500">Veuillez entrer un terme de recherche.</p>';
    }
});