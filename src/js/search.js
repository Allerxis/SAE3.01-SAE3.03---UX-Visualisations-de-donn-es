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