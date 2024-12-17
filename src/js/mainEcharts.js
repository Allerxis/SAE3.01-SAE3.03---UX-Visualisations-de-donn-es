import * as echarts from 'echarts';
// Créer l'instance ECharts
const chart = echarts.init(document.getElementById('chart'));

// Fonction pour récupérer et afficher les données depuis l'API
async function fetchStatsAndRenderChart() {
    try {
        // Préparer les filtres pour la requête POST
        const payload = {
            filters: { secteurDisciplinaireIds: [1, 2, 3] }, // IDs à ajuster selon vos besoins
            harvest: { typeStats: 'candidatures' }
        };

        // Envoyer la requête POST
        const response = await fetch('https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/stats/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // Traiter la réponse
        const data = await response.json();
        console.log(data);

        // Vérifier si les données sont valides
        if (!data || data.length === 0) {
            console.error('Pas de données disponibles');
            return;
        }

        // Traiter les données pour ECharts    A REMPLACER
        const categories = data.map(item => item.nom); // Exemple : noms des secteurs ou données similaires
        const values = data.map(item => item.valeur);  // Exemple : valeurs associées aux secteurs

        // Configurer le graphique
        const options = {
            title: {
                text: 'Statistiques de Candidatures',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: categories,
                axisLabel: { rotate: 45 }
            },
            yAxis: {
                type: 'value',
                name: 'Nombre de candidatures'
            },
            series: [
                {
                    name: 'Candidatures',
                    type: 'bar',
                    data: values,
                    itemStyle: { color: '#5470C6' }
                }
            ]
        };

        // Appliquer les options au graphique
        chart.setOption(options);
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

// Appeler la fonction pour initialiser le graphique
fetchStatsAndRenderChart();

// Assurer la réactivité lors du redimensionnement
window.addEventListener('resize', () => {
    chart.resize();
});
