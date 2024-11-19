document.addEventListener('DOMContentLoaded', function () {
    const burgerBtn = document.getElementById('burger-btn');
    const menu = document.getElementById('menu');

    if (burgerBtn) { // Vérifie que l'élément existe avant d'ajouter l'événement
        burgerBtn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }
});