document.addEventListener('DOMContentLoaded', function () {
    const burgerBtn = document.getElementById('burger-btn'); // Récupère l'élément burger-btn
    const menu = document.getElementById('menu'); // Récupère l'élément menu

    if (burgerBtn) { // Vérifie que l'élément existe avant d'ajouter l'événement
        burgerBtn.addEventListener('click', () => { // Ajoute un événement au clic sur le bouton burger
            menu.classList.toggle('hidden'); // Affiche ou cache le menu en ajoutant ou supprimant la classe 'hidden'
        });
    }
});