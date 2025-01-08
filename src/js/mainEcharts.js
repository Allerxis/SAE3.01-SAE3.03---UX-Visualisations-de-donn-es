// Importation des modules nécessaires
import * as echarts from 'https://cdn.jsdelivr.net/npm/echarts@5.4.0/dist/echarts.esm.min.js';

const URL_API = "https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/";

// Fonction pour récupérer les statistiques liées à un master donné
async function fetchMasterStats(ifc) {
    const body = {
        filters: {
            formationIfcs: [ifc],
        },
        harvest: {
            typeStats: "candidatures",
            candidatureDetails: ["general", "experience", "origine"],
        },
    };

    const response = await fetch(`${URL_API}stats/search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données.");
    }

    const data = await response.json();
    console.log("Données reçues :", data);
    return data.candidatures[0];
}

// Fonction pour afficher un graphique linéaire de l'évolution des candidatures
function renderCandidaturesEvolutionChart(data) {
    if (!data || typeof data !== 'object') {
        console.error("Les données pour 'Évolution des candidatures' sont manquantes ou incorrectes :", data);
        return;
    }

    const chartDom = document.getElementById('chart-candidatures-evolution');
    const myChart = echarts.init(chartDom);

    const options = {
        title: {
            text: 'Évolution des candidatures',
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
            formatter: (params) => {
                const tooltips = [
                    "Capacité totale de la formation.",
                    "Nombre total de candidatures reçues.",
                    "Nombre total de candidatures féminines.",
                    "Nombre de candidats classés.",
                    "Nombre de candidates classées.",
                ];
                return `${params.name}: ${params.value}<br>${tooltips[params.dataIndex] || ''}`;
            },
        },
        xAxis: {
            type: 'category',
            data: ['Capacité', 'Total', 'Femmes', 'Classés', 'Classées Femmes'],
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: [data.capacite || 0, data.nb || 0, data.nbFemmes || 0, data.clas || 0, data.clasFemmes || 0],
                type: 'bar',
            },
        ],
    };

    myChart.setOption(options);
}

// Fonction pour afficher un graphique circulaire du profil académique
function renderAcademicProfileChart(data) {
    if (!data || !data.lg3 || !data.lp3 || !data.master || !data.autre) {
        console.error("Données manquantes ou incorrectes pour le profil académique :", data);
        return;
    }

    console.log("Données pour le profil académique :", data);

    const chartDom = document.getElementById('chart-academic-profile');
    const myChart = echarts.init(chartDom);

    const options = {
        title: {
            text: 'Profil académique des candidats',
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
            formatter: (params) => {
                const descriptions = {
                    'Licence générale': "Nombre de candidats issus de licences générales.",
                    'Licence professionnelle': "Nombre de candidats issus de licences professionnelles.",
                    'Master': "Nombre de candidats ayant déjà un master.",
                    'Autres': "Nombre de candidats issus d'autres formations.",
                };
                return `${params.name}: ${params.value}<br>${descriptions[params.name] || ''}`;
            },
        },
        series: [
            {
                name: 'Type de formation',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: data.lg3.nb || 0, name: 'Licence générale' },
                    { value: data.lp3.nb || 0, name: 'Licence professionnelle' },
                    { value: data.master.nb || 0, name: 'Master' },
                    { value: data.autre.nb || 0, name: 'Autres' },
                ],
            },
        ],
    };

    myChart.setOption(options);
}

// Fonction pour afficher un graphique à barres des taux de réussite
function renderSuccessRatesChart(data) {
    if (!data || typeof data.nb !== 'number' || typeof data.clas !== 'number' || typeof data.accept !== 'number') {
        console.error("Données incorrectes pour les taux de réussite :", data);
        return;
    }

    const chartDom = document.getElementById('chart-success-rates');
    const myChart = echarts.init(chartDom);

    const options = {
        title: {
            text: 'Taux de réussite',
            subtext: 'Pourcentage des classés et acceptés',
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
            formatter: (params) => {
                const tooltips = {
                    '% Classés parmi Candidats': "Pourcentage des candidats ayant été évalués et classés.",
                    '% Acceptés parmi Classés': "Pourcentage des candidats classés ayant reçu une offre d'admission.",
                };
                return `${params.name}: ${params.value}%<br>${tooltips[params.name] || ''}`;
            },
        },
        xAxis: {
            type: 'category',
            data: ['% Classés parmi Candidats', '% Acceptés parmi Classés'],
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} %',
            },
        },
        series: [
            {
                data: [
                    ((data.clas / data.nb) * 100).toFixed(2),
                    ((data.accept / data.clas) * 100).toFixed(2),
                ],
                type: 'bar',
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}%',
                },
            },
        ],
    };

    myChart.setOption(options);
}

// Fonction pour afficher un graphique à barres empilées pour les débouchés professionnels
function renderProfessionalOutcomesChart(data) {
    if (!data || typeof data.capacite !== 'number' || typeof data.nb !== 'number' || typeof data.clas !== 'number') {
        console.warn("Pas assez de données pour les débouchés professionnels :", data);
        return;
    }

    const chartDom = document.getElementById('chart-professional-outcomes');
    const myChart = echarts.init(chartDom);

    const options = {
        title: {
            text: 'Débouchés professionnels',
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
            formatter: (params) => {
                const descriptions = [
                    "Capacité totale de la formation.",
                    "Nombre total de candidats.",
                    "Nombre total de candidats classés.",
                ];
                return `${params.name}: ${params.value}<br>${descriptions[params.dataIndex] || ''}`;
            },
        },
        xAxis: {
            type: 'category',
            data: ['Capacité', 'Candidats', 'Classés'],
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: 'Valeurs',
                type: 'bar',
                data: [data.capacite || 0, data.nb || 0, data.clas || 0],
            },
        ],
    };

    myChart.setOption(options);
}

// Fonction pour afficher un graphique circulaire des candidatures
function renderCandidaturesChart(data) {
    if (!data || typeof data.nb !== 'number' || typeof data.nbFemmes !== 'number') {
        console.error("Données incorrectes pour les candidatures :", data);
        return;
    }

    const chartDom = document.getElementById('chart-candidatures');
    const myChart = echarts.init(chartDom);

    const options = {
        title: {
            text: 'Candidatures - Total vs Femmes',
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
            formatter: (params) => {
                const descriptions = {
                    'Hommes': "Nombre total de candidatures masculines.",
                    'Femmes': "Nombre total de candidatures féminines.",
                };
                return `${params.name}: ${params.value}<br>${descriptions[params.name] || ''}`;
            },
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

// Fonction pour afficher un graphique à barres des propositions envoyées
function renderPropositionsChart(data) {
    if (!data || typeof data.prop !== 'number' || typeof data.propFemmes !== 'number') {
        console.error("Données incorrectes pour les propositions :", data);
        return;
    }

    const chartDom = document.getElementById('chart-propositions');
    const myChart = echarts.init(chartDom);

    const options = {
        title: {
            text: 'Propositions envoyées',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
            formatter: (params) => {
                const descriptions = {
                    'Total': "Nombre total de propositions envoyées.",
                    'Femmes': "Nombre de propositions envoyées à des candidats féminins.",
                };
                return params.map(param => 
                    `${param.axisValue}: ${param.data}<br>${descriptions[param.axisValue] || ''}`
                ).join('');
            },
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
                name: 'Total',
                type: 'bar',
                data: [data.prop, data.propFemmes],
            },
        ],
    };

    myChart.setOption(options);
}


// Fonction pour afficher un graphique à barres pour les acceptations
function renderAcceptationsChart(data) {
    if (!data || typeof data.accept !== 'number' || typeof data.acceptFemmes !== 'number') {
        console.error("Données incorrectes pour les acceptations :", data);
        return;
    }

    const chartDom = document.getElementById('chart-acceptations');
    const myChart = echarts.init(chartDom);

    const options = {
        title: {
            text: 'Acceptations globales vs Femmes',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
            formatter: (params) => {
                const descriptions = {
                    'Total': "Nombre total d'acceptations.",
                    'Femmes': "Nombre d'acceptations pour les candidates.",
                };
                return params.map(param => 
                    `${param.axisValue}: ${param.data}<br>${descriptions[param.axisValue] || ''}`
                ).join('');
            },
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


// Fonction pour afficher un graphique pour les ratios
function renderRatiosChart(data) {
    if (!data || typeof data.clas !== 'number' || typeof data.nb !== 'number' || typeof data.accept !== 'number') {
        console.error("Données incorrectes pour les ratios :", data);
        return;
    }

    const totalRatio = ((data.clas / data.nb) * 100).toFixed(2);
    const acceptRatio = ((data.accept / data.clas) * 100).toFixed(2);

    const chartDom = document.getElementById('chart-ratios');
    const myChart = echarts.init(chartDom);

    const options = {
        title: {
            text: 'Ratios',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
            formatter: (params) => {
                const descriptions = {
                    'Classés/Candidats': "Pourcentage de candidats classés parmi les postulants.",
                    'Acceptés/Classés': "Pourcentage de candidats acceptés parmi ceux classés.",
                };
                return `${params[0].name}: ${params[0].value}%<br>${descriptions[params[0].name] || ''}`;
            },
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

// Fonction principale pour charger les graphiques
async function loadCharts() {
    const urlParams = new URLSearchParams(window.location.search);
    const ifc = urlParams.get('id');

    if (!ifc) {
        console.error("Aucun IFC trouvé dans l'URL.");
        return;
    }

    try {
        const data = await fetchMasterStats(ifc);

        // Rendu des graphiques
        renderCandidaturesChart(data.general);
        renderCandidaturesEvolutionChart(data.general);
        renderAcademicProfileChart(data.experience);
        renderSuccessRatesChart(data.general);
        renderPropositionsChart(data.general);
        renderAcceptationsChart(data.general);
        renderRatiosChart(data.general);

        // Vérification pour les débouchés professionnels
        if (data.general && data.general.capacite) {
            renderProfessionalOutcomesChart(data.general);
        } else {
            console.warn("Pas de données pour les débouchés professionnels.");
        }
    } catch (error) {
        console.error("Erreur:", error);
    }
}

// Charger les graphiques au chargement de la page
document.addEventListener('DOMContentLoaded', loadCharts);
