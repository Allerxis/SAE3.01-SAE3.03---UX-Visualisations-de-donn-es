// import * as echarts from 'https://cdn.jsdelivr.net/npm/echarts@5.4.0/dist/echarts.esm.min.js';

// const URL_API = "https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/"; //constante avec l'url de base de l'API

// function formation () {
//     return fetch ( `${URL_API}/formations`);  //appel  la table formation de l'API 
//     console.log
// } //on doit filtrer ensuite pour garder que les informations essentiels 

// function etablissement () {
//     return fetch ( `${URL_API}/etablissements`);  //appel  la table etablissement de l'API 
//     console.log
// } //on doit filtrer ensuite pour garder que les informations essentiels 

// function academie () {
//     return fetch ( `${URL_API}/academies`);  //appel  la table academies de l'API 
//     console.log
// } //on doit filtrer ensuite pour garder que les informations essentiels 

// function secteursDisciplinaires () {
//     return fetch ( `${URL_API}/secteurs-disciplinaires`);  //appel  la table secteurs-disciplinaires de l'API 
//     console.log
// } //on doit filtrer ensuite pour garder que les informations essentiels 

// function mentions () {
//     return fetch ( `${URL_API}/mentions`);  //appel  la table mentions de l'API 
//     console.log
// } //on doit filtrer ensuite pour garder que les informations essentiels 

// function statsSearch () {
//     return fetch ( `${URL_API}/stats/search`);  //appel  la table stats/search de l'API 
//     console.log
// } //on doit filtrer ensuite pour garder que les informations essentiels 

// document.addEventListener('DOMContentLoaded', () => {
//     const chartDom = document.getElementById('chart-container');
//     if (chartDom) {
//         const myChart = echarts.init(chartDom);

//         const options = {
//             title: {
//                 text: 'Titre du Graphique',
//                 subtext: 'Source: NaMaster',
//                 left: 'center'
//             },
//             tooltip: {},
//             xAxis: {
//                 type: 'category',
//                 data: ['A', 'B', 'C', 'D']
//             },
//             yAxis: {
//                 type: 'value'
//             },
//             series: [
//                 {
//                     data: [10, 20, 30, 40],
//                     type: 'bar'
//                 }
//             ]
//         };

//         myChart.setOption(options);
//     } else {
//         console.error("L'élément #chart-container n'a pas été trouvé.");
//     }
// });

import * as echarts from 'https://cdn.jsdelivr.net/npm/echarts@5.4.0/dist/echarts.esm.min.js';

const URL_API = "https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/";

async function fetchMasterStats(ifc) {
    const body = {
        filters: {
            formationIfcs: [ifc] // Filtrer par l'IFC du master
        },
        harvest: {
            typeStats: "candidatures",
            candidatureDetails: ["general"]
        }
    };

    const response = await fetch(`${URL_API}stats/search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données.");
    }

    const data = await response.json();
    return data.candidatures[0].general; // Retourne les données générales du master
}

// Fonction pour afficher les graphiques
function renderCandidaturesChart(data) {
    const chartDom = document.getElementById('chart-candidatures');
    const myChart = echarts.init(chartDom);

    const options = {
        title: {
            text: 'Candidatures - Total vs Femmes',
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
        },
        legend: {
            bottom: '0%',
        },
        series: [
            {
                name: 'Candidatures',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: data.nb - data.nbFemmes, name: 'Hommes' },
                    { value: data.nbFemmes, name: 'Femmes' },
                ],
            },
        ],
    };

    myChart.setOption(options);
}

function renderPropositionsChart(data) {
    const chartDom = document.getElementById('chart-propositions');
    const myChart = echarts.init(chartDom);

    const options = {
        title: {
            text: 'Propositions envoyées',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            bottom: '0%',
        },
        xAxis: {
            type: 'category',
            data: ['Total', 'Femmes'],
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
               
                type: 'bar',
                name: 'Propositions',
                data: [data.prop, data.propFemmes],
            },
        ],
    };

    myChart.setOption(options);
}

function renderAcceptationsChart(data) {
    const chartDom = document.getElementById('chart-acceptations');
    const myChart = echarts.init(chartDom);

    const options = {
        title: {
            text: 'Acceptations globales vs Femmes',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: ['Acceptations'],
            bottom: '0%',
        },
        xAxis: {
            type: 'category',
            data: ['Total', 'Femmes'],
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: 'Acceptations',
                type: 'bar',
                data: [data.accept, data.acceptFemmes],
            },
        ],
    };

    myChart.setOption(options);
}

function renderRatiosChart(data) {
    const chartDom = document.getElementById('chart-ratios');
    const myChart = echarts.init(chartDom);

    const totalRatio = ((data.clas / data.nb) * 100).toFixed(2);
    const acceptRatio = ((data.accept / data.clas) * 100).toFixed(2);

    const options = {
        title: {
            text: 'Ratios',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            bottom: '0%',
        },
        xAxis: {
            type: 'category',
            data: ['Classés/Candidats', 'Acceptés/Classés'],
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} %',
            },
        },
        series: [
            {
                data: [totalRatio, acceptRatio],
                type: 'bar',
            },
        ],
    };

    myChart.setOption(options);
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const ifc = urlParams.get('id');

    if (!ifc) {
        console.error("Aucun IFC trouvé dans l'URL.");
        return;
    }

    try {
        const data = await fetchMasterStats(ifc);

        // Rendu des graphiques
        renderCandidaturesChart(data);
        renderPropositionsChart(data);
        renderAcceptationsChart(data);
        renderRatiosChart(data);
    } catch (error) {
        console.error("Erreur:", error);
    }
});
