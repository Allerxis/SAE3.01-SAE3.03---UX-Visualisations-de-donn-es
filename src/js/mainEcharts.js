const chart = echarts.init(document.getElementById('chart'));

async function fetchDataAndRenderChart() {
    try {
        document.getElementById('loading-message').textContent = "Chargement des données...";
        const response = await fetch('https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/');
        const data = await response.json();
        document.getElementById('loading-message').style.display = 'none';

        const categories = data.map(item => item.category); // Adapter selon les clés de l'API
        const values = data.map(item => item.value);

        const options = {
            title: { text: 'Graphique des Masters' },
            tooltip: {},
            xAxis: { type: 'category', data: categories },
            yAxis: { type: 'value' },
            series: [{ name: 'Nombre', type: 'bar', data: values }]
        };

        chart.setOption(options);
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        document.getElementById('loading-message').textContent = "Erreur lors du chargement des données.";
    }
}

fetchDataAndRenderChart();

window.addEventListener('resize', () => {
    chart.resize();
});
