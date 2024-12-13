// Fonction pour récupérer les données de l'API
async function fetchSecteursDisciplinaires() {
    try {
        const response = await fetch('https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/secteurs-disciplinaires');
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }
        const data = await response.json();
        populateFilters(data);
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

// Fonction pour ajouter les boutons dans le DOM
function populateFilters(secteurs) {
    const filtersContainer = document.getElementById('filters-container');
    const sliderContainer = document.getElementById('slider-container');

    // Nettoyer les conteneurs
    filtersContainer.innerHTML = '';
    sliderContainer.innerHTML = '';

    // Ajouter les 5 premiers filtres dans le conteneur visible
    secteurs.slice(0, 5).forEach((secteur) => {
        const button = document.createElement('button');
        button.className = 'bg-gray-200 py-2 px-4 rounded-full text-center text-gray-800 text-sm shadow-sm';
        button.textContent = secteur.nom; // Utiliser le nom du secteur

        // Ajouter l'événement de redirection
        button.addEventListener('click', () => {
            const url = `lesMasters.html?id=${secteur.id}`;
            window.location.href = url; // Redirige vers la page avec l'ID
        });

        filtersContainer.appendChild(button);
    });

    // Ajouter les filtres restants dans le slider
    secteurs.slice(5).forEach((secteur) => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';

        const button = document.createElement('button');
        button.className = 'bg-gray-200 py-2 px-4 rounded-full text-center text-gray-800 text-sm shadow-sm';
        button.textContent = secteur.nom;

        // Ajouter l'événement de redirection
        button.addEventListener('click', () => {
            const url = `resultat.html?id=${secteur.id}`;
            window.location.href = url; // Redirige vers la page avec l'ID
        });

        slide.appendChild(button);
        sliderContainer.appendChild(slide);
    });

    // Initialiser Swiper.js après avoir inséré les éléments
    new Swiper('.swiper-container', {
        slidesPerView: 3,
        spaceBetween: 10,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            // Responsive settings
            640: { slidesPerView: 4, spaceBetween: 15 },
            768: { slidesPerView: 5, spaceBetween: 20 },
        },
    });
}

// Appeler la fonction pour charger les données dès que la page est prête
document.addEventListener('DOMContentLoaded', fetchSecteursDisciplinaires);