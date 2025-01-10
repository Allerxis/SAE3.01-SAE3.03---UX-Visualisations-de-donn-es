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
        const searchInput = document.getElementById('header-search-input'); // Récupère l'élément de recherche
        const searchButton = document.getElementById('header-search-button'); // Récupère le bouton de recherche

        if (!searchInput || !searchButton) { // Vérifie si les éléments existent
            console.error('Éléments de recherche introuvables dans le DOM.');
            return;
        }

        function redirectToSearchPage(query) { //fonction pour rediriger vers la page de recherche
            if (query) { // Vérifie si un terme de recherche est saisi
                window.location.href = `lesMasters.html?search=${encodeURIComponent(query)}`;
            } else { //affiche un message d'erreur si aucun terme de recherche n'est saisi
                alert('Veuillez saisir un terme de recherche.');
            }
        }

        searchButton.addEventListener('click', () => { // Ajoute un événement au clic sur le bouton de recherche
            redirectToSearchPage(searchInput.value.trim()); // Redirige vers la page de recherche avec le terme saisi
        });

        searchInput.addEventListener('keydown', (event) => { // Ajoute un événement à la touche 'Entrée' pour la recherche
            if (event.key === 'Enter') { // Rechercher les masters si la touche 'Entrée' est enfoncée
                redirectToSearchPage(searchInput.value.trim()); // Redirige vers la page de recherche avec le terme saisi
            }
        });
    }

    // Fonction pour le menu burger
    function initBurgerMenu() {
        const burgerBtn = document.getElementById('burger-btn');// Récupère l'élément burger-btn
        const menu = document.getElementById('menu'); // Récupère l'élément menu

        if (burgerBtn && menu) { // Vérifie que les éléments existent avant d'ajouter l'événement
            burgerBtn.addEventListener('click', () => { // Ajoute un événement au clic sur le bouton burger
                menu.classList.toggle('hidden');// Affiche ou cache le menu en ajoutant ou supprimant la classe 'hidden'
            });
            console.log('Burger menu initialisé avec succès !'); // Affiche un message de confirmation
        } else {
            console.error('Éléments burger-btn ou menu non trouvés.'); //affiche un message d'erreur si les éléments ne sont pas trouvés
        }
    }
});


// ========================
// Fichier : mastersSearch.js
// ========================
document.addEventListener('DOMContentLoaded', () => {  // Attend que le DOM soit chargé
    const resultsContainer = document.getElementById('masters-container'); // Conteneur des résultats

    async function fetchFormations() { // Fonction pour récupérer les formations
        try {
            const response = await fetch('https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/formations');
            if (!response.ok) throw new Error('Erreur lors de la récupération des formations.');
            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération des formations :', error);
            return [];
        }
    }

    function displayResults(data) { // Fonction pour afficher les résultats
        resultsContainer.innerHTML = ''; // Nettoyer les résultats précédents

        if (data.length === 0) {    // Vérifier si aucun résultat n'est retourné
            resultsContainer.innerHTML = '<p class="text-gray-500">Aucun résultat trouvé.</p>';
            return;
        }

        data.forEach(formation => { // Afficher chaque résultat
            const masterCard = document.createElement('a'); // Créer un lien pour chaque master
            masterCard.href = `master.html?id=${formation.ifc}`; // Lien vers la page détaillée
            masterCard.innerHTML = `
                <div class="p-4 bg-white border rounded-md shadow-sm">
                    <h2 class="font-bold text-lg mb-2 lg:text-2xl">${formation.parcours || 'Nom non disponible'}</h2>
                    <p class="text-sm text-gray-500 lg:text-lg">Lieu : ${formation.lieux || 'Non spécifié'}</p>
                    <p class="text-sm text-gray-500 lg:text-lg">Alternance : ${formation.alternance ? 'Oui' : 'Non'}</p>
                </div>
            `;
            resultsContainer.appendChild(masterCard);   // Ajouter la carte au conteneur
        });
    }

    async function loadMasters(query) { // Fonction pour charger les masters
        const formations = await fetchFormations(); // Récupérer les formations
        const filteredFormations = formations.filter(formation => // Filtrer les formations
            formation.parcours.toLowerCase().includes(query.toLowerCase()) // Vérifier si le terme de recherche est inclus
        );
        displayResults(filteredFormations); // Afficher les résultats filtrés
    }

    const urlParams = new URLSearchParams(window.location.search); // Récupérer les paramètres de l'URL
    const query = urlParams.get('search'); // Récupérer le terme de recherche

    if (query) { // Vérifier si un terme de recherche est présent
        console.log('Recherche pour :', query); // Afficher le terme de recherche dans la console
        loadMasters(query); // Charger les masters correspondants
    } else { // Afficher un message si aucun terme de recherche n'est saisi
        resultsContainer.innerHTML = '<p class="text-gray-500">Veuillez entrer un terme de recherche.</p>';
    }
});