// 1. Créer l'instance ECharts
const chart = echarts.init(document.getElementById('chart'));

// 2. Définir une fonction pour récupérer les données
async function fetchDataAndRenderChart() {
    try {
        // 3. Récupérer les données depuis l'API
        const response = await fetch('https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/'); // Remplacez par votre URL
        const data = await response.json();

        // 4. Traiter les données pour ECharts
        const categories = data.map(item => item.category); // Exemple de clé "category"
        const values = data.map(item => item.value); // Exemple de clé "value"

        // 5. Définir les options du graphique
        const options = {
            title: {
                text: 'Exemple de Graphique avec API'
            },
            tooltip: {},
            xAxis: {
                type: 'category',
                data: categories // Catégories sur l'axe X
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: 'Valeur',
                    type: 'bar', // Type de graphique (barres ici)
                    data: values // Données des barres
                }
            ]
        };

        // 6. Appliquer les options à l'instance ECharts
        chart.setOption(options);
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

// 7. Appeler la fonction pour charger les données et afficher le graphique
fetchDataAndRenderChart();
