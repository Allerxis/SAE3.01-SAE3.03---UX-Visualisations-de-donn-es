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
                let url = 'https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/formations'; // URL de l'API
                const params = []; // Tableau pour stocker les paramètres de recherche

                if (query) { // Vérifie si un terme de recherche est saisi
                    params.push(`q=${encodeURIComponent(query)}`); // Ajoute le terme de recherche aux paramètres
                }
                if (secteur) { // Vérifie si un secteur est sélectionné
                    params.push(`sdid=${encodeURIComponent(secteur)}`); // Ajoute le secteur aux paramètres
                }
                if (ville) { // Vérifie si une ville est sélectionnée
                    params.push(`ville=${encodeURIComponent(ville)}`); // Ajoute la ville aux paramètres
                }
                if (params.length > 0) {
                    url += `?${params.join('&')}`; // Ajoute les paramètres à l'URL
                }

                console.log('URL finale :', url);  // Affiche l'URL finale dans la console

                const response = await fetch(url); // Récupère les résultats filtrés
                if (!response.ok) throw new Error('Erreur lors de la récupération des résultats.'); // Affiche une erreur si la récupération échoue 

                const data = await response.json(); // Récupère les données en format JSON
                console.log('Données récupérées :', data); // Affiche les données récupérées dans la console

                // Afficher les résultats récupérés
                displayResults(data);
            } catch (error) {  // Affiche un message d'erreur si la recherche échoue
                console.error('Erreur lors de la recherche :', error); // Affiche l'erreur dans la console
                resultsContainer.innerHTML = `<p class="text-red-500">Aucun résultat trouvé.</p>`; // Affiche un message d'erreur dans le conteneur
            }
        }

        // Fonction pour afficher les résultats
        function displayResults(data) { // Fonction pour afficher les résultats
            resultsContainer.innerHTML = ''; // Nettoyer les résultats précédents

            if (data.length === 0) { // Vérifier si aucun résultat n'est retourné
                resultsContainer.innerHTML = '<p class="text-gray-500">Aucun résultat trouvé.</p>';
                return;
            }

            data.forEach(master => { // Afficher chaque résultat
                const masterCard = document.createElement('a'); // Créer un lien pour chaque master
                masterCard.href = `master.html?id=${master.ifc}`; // Lien vers la page détaillée
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
                resultsContainer.appendChild(masterCard); // Ajouter la carte au conteneur
            });
        }

        // Gestion des événements
        function handleSearch() { // Fonction pour gérer la recherche
            const query = searchInput.value.trim(); // Récupère le terme de recherche
            if (query) { // Vérifie si un terme de recherche est saisi
                searchMasters(query); // Appelle la fonction de recherche
            } else {
                console.warn('Veuillez saisir un terme de recherche.');
            }
        }

        searchButton.addEventListener('click', handleSearch); // Ajoute un événement au clic sur le bouton de recherche
        searchInput.addEventListener('keydown', (event) => { // Ajoute un événement à l'appui sur la touche 'Entrée'
            if (event.key === 'Enter') handleSearch(); // Appelle la fonction de recherche si la touche 'Entrée' est enfoncée
        });
    }

    // Attendre l'injection dynamique du header
    fetch('header.html')
        .then(response => response.text()) // Convertir la réponse en texte
        .then(data => { // Injecter le header dans la page
            document.getElementById('header-container').innerHTML = data; // Injecter le contenu dans le conteneur

            // Appel pour initialiser la recherche après l'injection
            initSearch();
        })
        .catch(error => console.error('Erreur lors du chargement du header :', error));
});
