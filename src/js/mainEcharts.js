import * as echarts from 'https://cdn.jsdelivr.net/npm/echarts@5.4.0/dist/echarts.esm.min.js';

const URL_API = "https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/"; //constante avec l'url de base de l'API

function test () {
    return fetch ( `${URL_API}/formations`);  //appel  la table formation de l'API 
    console.log
} //on doit filtrer ensuite pour garder que les informations essentiels 


document.addEventListener('DOMContentLoaded', () => {
    const chartDom = document.getElementById('chart-container');
    if (chartDom) {
        const myChart = echarts.init(chartDom);

        const options = {
            title: {
                text: 'Titre du Graphique',
                subtext: 'Source: NaMaster',
                left: 'center'
            },
            tooltip: {},
            xAxis: {
                type: 'category',
                data: ['A', 'B', 'C', 'D']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: [10, 20, 30, 40],
                    type: 'bar'
                }
            ]
        };

        myChart.setOption(options);
    } else {
        console.error("L'élément #chart-container n'a pas été trouvé.");
    }
});