// Importation des modules nécessaires
import * as echarts from 'https://cdn.jsdelivr.net/npm/echarts@5.4.0/dist/echarts.esm.min.js';

// URL de l'API pour les statistiques
const URL_API = "https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/";

// Fonction pour récupérer les statistiques liées à un master donné
async function fetchMasterStats(ifc) {
    const body = { // Requête pour récupérer les statistiques
        filters: { // Filtres pour la recherche
            formationIfcs: [ifc], // IFC de la formation
        },
        harvest: { // Données à récupérer
            typeStats: "candidatures", // Type de statistiques
            candidatureDetails: ["general", "experience", "origine"], // Détails des candidatures
        },
    };

    const response = await fetch(`${URL_API}stats/search`, { // Requête pour récupérer les données
        method: "POST", // Méthode POST
        headers: { // En-têtes de la requête
            "Content-Type": "application/json", // Type de contenu
        },
        body: JSON.stringify(body), // Corps de la requête
    });

    if (!response.ok) { // Vérification de la réponse
        throw new Error("Erreur lors de la récupération des données.");
    }

    const data = await response.json(); // Récupération des données
    console.log("Données reçues :", data); // Affichage des données
    return data.candidatures[0]; // Retour des données de candidatures
}

// Fonction pour afficher un graphique linéaire de l'évolution des candidatures
function renderCandidaturesEvolutionChart(data) {
    if (!data || typeof data !== 'object') { // Vérification des données
        console.error("Les données pour 'Évolution des candidatures' sont manquantes ou incorrectes :", data); // Affichage d'une erreur
        return;
    }

    const chartDom = document.getElementById('chart-candidatures-evolution'); // Récupération de l'élément du graphique
    const myChart = echarts.init(chartDom); // Initialisation du graphique

    const options = { // Options du graphique
        title: { // Titre du graphique
            text: 'Évolution des candidatures', // Texte du titre
            left: 'center', // Alignement du titre
        },
        tooltip: { // Infobulle
            trigger: 'item', // Déclencheur de l'infobulle
            formatter: (params) => { // Fonction pour le format de l'infobulle
                const tooltips = [ // Descriptions des données
                    "Capacité totale de la formation.",
                    "Nombre total de candidatures reçues.",
                    "Nombre total de candidatures féminines.",
                    "Nombre de candidats classés.",
                    "Nombre de candidates classées.",
                ];
                return `${params.name}: ${params.value}<br>${tooltips[params.dataIndex] || ''}`; // Retourne le texte de l'infobulle
            },
        },
        xAxis: { // Axe des abscisses
            type: 'category', // Type de l'axe
            data: ['Capacité', 'Total', 'Femmes', 'Classés', 'Classées Femmes'], // Données de l'axe
        },
        yAxis: { // Axe des ordonnées
            type: 'value', // Type de l'axe
        },
        series: [ // Séries du graphique
            {
                data: [data.capacite || 0, data.nb || 0, data.nbFemmes || 0, data.clas || 0, data.clasFemmes || 0], // Données de la série
                type: 'bar', // Type de graphique
            },
        ],
    };

    myChart.setOption(options); // Application des options au graphique
}

// Fonction pour afficher un graphique circulaire du profil académique
function renderAcademicProfileChart(data) {
    if (!data || !data.lg3 || !data.lp3 || !data.master || !data.autre) { // Vérification des données
        console.error("Données manquantes ou incorrectes pour le profil académique :", data); // Affichage d'une erreur
        return;
    }

    console.log("Données pour le profil académique :", data); // Affichage des données

    const chartDom = document.getElementById('chart-academic-profile'); // Récupération de l'élément du graphique
    const myChart = echarts.init(chartDom); // Initialisation du graphique

    const options = { // Options du graphique
        title: { // Titre du graphique
            text: 'Profil académique des candidats', // Texte du titre
            left: 'center', // Alignement du titre
        },
        tooltip: { // Infobulle
            trigger: 'item', // Déclencheur de l'infobulle
            formatter: (params) => { // Fonction pour le format de l'infobulle
                const descriptions = { // Descriptions des données
                    'Licence générale': "Nombre de candidats issus de licences générales.",
                    'Licence professionnelle': "Nombre de candidats issus de licences professionnelles.",
                    'Master': "Nombre de candidats ayant déjà un master.",
                    'Autres': "Nombre de candidats issus d'autres formations.",
                };
                return `${params.name}: ${params.value}<br>${descriptions[params.name] || ''}`; // Retourne le texte de l'infobulle
            },
        },
        series: [ // Séries du graphique
            {
                name: 'Type de formation', // Nom de la série
                type: 'pie', // Type de graphique
                radius: '50%', // Rayon du graphique
                data: [
                    { value: data.lg3.nb || 0, name: 'Licence générale' }, // Données de la série
                    { value: data.lp3.nb || 0, name: 'Licence professionnelle' },
                    { value: data.master.nb || 0, name: 'Master' },
                    { value: data.autre.nb || 0, name: 'Autres' },
                ],
            },
        ],
    };

    myChart.setOption(options); // Application des options au graphique
}

// Fonction pour afficher un graphique à barres des taux de réussite
function renderSuccessRatesChart(data) {
    if (!data || typeof data.nb !== 'number' || typeof data.clas !== 'number' || typeof data.accept !== 'number') { // Vérification des données
        console.error("Données incorrectes pour les taux de réussite :", data);     // Affichage d'une erreur
        return;
    }

    const chartDom = document.getElementById('chart-success-rates');    // Récupération de l'élément du graphique
    const myChart = echarts.init(chartDom); // Initialisation du graphique

    const options = {   // Options du graphique
        title: {   // Titre du graphique
            text: 'Taux de réussite',  // Texte du titre
            subtext: 'Pourcentage des classés et acceptés', // Sous-titre
            left: 'center', // Alignement du titre
        },
        tooltip: { // Infobulle
            trigger: 'item', // Déclencheur de l'infobulle
            formatter: (params) => { // Fonction pour le format de l'infobulle
                const tooltips = { // Descriptions des données
                    '% Classés parmi Candidats': "Pourcentage des candidats ayant été évalués et classés.",
                    '% Acceptés parmi Classés': "Pourcentage des candidats classés ayant reçu une offre d'admission.",
                };
                return `${params.name}: ${params.value}%<br>${tooltips[params.name] || ''}`;
            },
        },
        xAxis: { // Axe des abscisses
            type: 'category', // Type de l'axe
            data: ['% Classés parmi Candidats', '% Acceptés parmi Classés'], // Données de l'axe
        },
        yAxis: { // Axe des ordonnées
            type: 'value', // Type de l'axe
            axisLabel: { // Étiquettes de l'axe
                formatter: '{value} %', // Format des étiquettes
            },
        },
        series: [ // Séries du graphique
            {
                data: [ // Données de la série
                    ((data.clas / data.nb) * 100).toFixed(2), // Pourcentage des classés parmi les candidats
                    ((data.accept / data.clas) * 100).toFixed(2), // Pourcentage des acceptés parmi les classés
                ],
                type: 'bar', // Type de graphique
                label: { // Étiquettes des barres
                    show: true, // Affichage des étiquettes
                    position: 'top', // Position des étiquettes
                    formatter: '{c}%', // Format des étiquettes
                },
            },
        ],
    };

    myChart.setOption(options); // Application des options au graphique
}

// Fonction pour afficher un graphique à barres empilées pour les débouchés professionnels
function renderProfessionalOutcomesChart(data) {
    if (!data || typeof data.capacite !== 'number' || typeof data.nb !== 'number' || typeof data.clas !== 'number') { // Vérification des données
        console.warn("Pas assez de données pour les débouchés professionnels :", data); // Affichage d'un avertissement
        return;
    }

    const chartDom = document.getElementById('chart-professional-outcomes'); // Récupération de l'élément du graphique
    const myChart = echarts.init(chartDom); // Initialisation du graphique

    const options = { // Options du graphique
        title: { // Titre du graphique
            text: 'Débouchés professionnels', // Texte du titre
            left: 'center', // Alignement du titre
        },
        tooltip: { // Infobulle
            trigger: 'item', // Déclencheur de l'infobulle
            formatter: (params) => { // Fonction pour le format de l'infobulle
                const descriptions = [ // Descriptions des données
                    "Capacité totale de la formation.",
                    "Nombre total de candidats.",
                    "Nombre total de candidats classés.",
                ];
                return `${params.name}: ${params.value}<br>${descriptions[params.dataIndex] || ''}`; // Retourne le texte de l'infobulle
            },
        },
        xAxis: { // Axe des abscisses
            type: 'category',  // Type de l'axe
            data: ['Capacité', 'Candidats', 'Classés'], // Données de l'axe
        },
        yAxis: { // Axe des ordonnées
            type: 'value', // Type de l'axe
        },
        series: [ // Séries du graphique
            {
                name: 'Valeurs', // Nom de la série
                type: 'bar', // Type de graphique
                data: [data.capacite || 0, data.nb || 0, data.clas || 0], // Données de la série
            },
        ],
    };

    myChart.setOption(options); // Application des options au graphique
}

// Fonction pour afficher un graphique circulaire des candidatures
function renderCandidaturesChart(data) {
    if (!data || typeof data.nb !== 'number' || typeof data.nbFemmes !== 'number') { // Vérification des données
        console.error("Données incorrectes pour les candidatures :", data); // Affichage d'une erreur
        return;
    }

    const chartDom = document.getElementById('chart-candidatures'); // Récupération de l'élément du graphique
    const myChart = echarts.init(chartDom); // Initialisation du graphique

    const options = { // Options du graphique
        title: { // Titre du graphique
            text: 'Candidatures - Total vs Femmes', // Texte du titre
            left: 'center', // Alignement du titre
        },
        tooltip: { // Infobulle
            trigger: 'item', // Déclencheur de l'infobulle
            formatter: (params) => { // Fonction pour le format de l'infobulle
                const descriptions = { // Descriptions des données
                    'Hommes': "Nombre total de candidatures masculines.", 
                    'Femmes': "Nombre total de candidatures féminines.",
                };
                return `${params.name}: ${params.value}<br>${descriptions[params.name] || ''}`; // Retourne le texte de l'infobulle
            },
        },
        legend: { // Légende du graphique
            bottom: '0%', // Position de la légende
        },
        series: [ // Séries du graphique
            {
                name: 'Candidatures', // Nom de la série
                type: 'pie', // Type de graphique
                radius: '50%', // Rayon du graphique
                data: [ // Données de la série
                    { value: data.nb - data.nbFemmes, name: 'Hommes' }, // Nombre de candidatures masculines
                    { value: data.nbFemmes, name: 'Femmes' }, // Nombre de candidatures féminines
                ],
            },
        ],
    };

    myChart.setOption(options); // Application des options au graphique
}

// Fonction pour afficher un graphique à barres des propositions envoyées
function renderPropositionsChart(data) {
    if (!data || typeof data.prop !== 'number' || typeof data.propFemmes !== 'number') { // Vérification des données
        console.error("Données incorrectes pour les propositions :", data); // Affichage d'une erreur
        return; 
    }

    const chartDom = document.getElementById('chart-propositions'); // Récupération de l'élément du graphique
    const myChart = echarts.init(chartDom); // Initialisation du graphique

    const options = { // Options du graphique
        title: { // Titre du graphique
            text: 'Propositions envoyées', // Titre du graphique
            left: 'center', // Alignement du titre
        },
        tooltip: { // Infobulle
            trigger: 'axis', // Déclencheur de l'infobulle
            formatter: (params) => { // Fonction pour le format de l'infobulle
                const descriptions = { // Descriptions des données
                    'Total': "Nombre total de propositions envoyées.",
                    'Femmes': "Nombre de propositions envoyées à des candidats féminins.",
                };
                return params.map(param =>  // Retourne le texte de l'infobulle
                    `${param.axisValue}: ${param.data}<br>${descriptions[param.axisValue] || ''}` 
                ).join('');// Retourne le texte de l'infobulle
            },
        },
        xAxis: { // Axe des abscisses
            type: 'category', // Type de l'axe
            data: ['Total', 'Femmes'], // Données de l'axe
        },
        yAxis: { // Axe des ordonnées
            type: 'value', // Type de l'axe
        },
        series: [  // Séries du graphique
            {
                name: 'Total', // Nom de la série
                type: 'bar', // Type de graphique
                data: [data.prop, data.propFemmes], // Données de la série
            },
        ],
    };

    myChart.setOption(options); // Application des options au graphique
}


// Fonction pour afficher un graphique à barres pour les acceptations
function renderAcceptationsChart(data) {
    if (!data || typeof data.accept !== 'number' || typeof data.acceptFemmes !== 'number') { // Vérification des données
        console.error("Données incorrectes pour les acceptations :", data); // Affichage d'une erreur
        return;
    }

    const chartDom = document.getElementById('chart-acceptations'); // Récupération de l'élément du graphique
    const myChart = echarts.init(chartDom); // Initialisation du graphique

    const options = { // Options du graphique
        title: { // Titre du graphique
            text: 'Acceptations globales vs Femmes', // Texte du titre
            left: 'center', // Alignement du titre
        },
        tooltip: { // Infobulle
            trigger: 'axis', // Déclencheur de l'infobulle
            formatter: (params) => { // Fonction pour le format de l'infobulle
                const descriptions = { // Descriptions des données
                    'Total': "Nombre total d'acceptations.", 
                    'Femmes': "Nombre d'acceptations pour les candidates.",
                };
                return params.map(param =>  // Retourne le texte de l'infobulle
                    `${param.axisValue}: ${param.data}<br>${descriptions[param.axisValue] || ''}` 
                ).join(''); // Retourne le texte de l'infobulle
            },
        },
        
        xAxis: { // Axe des abscisses
            type: 'category', // Type de l'axe
            data: ['Total', 'Femmes'], // Données de l'axe
        },
        yAxis: { // Axe des ordonnées
            type: 'value', // Type de l'axe
        },
        series: [ // Séries du graphique
            {
                name: 'Acceptations', // Nom de la série
                type: 'bar', // Type de graphique
                data: [data.accept, data.acceptFemmes], // Données de la série
            },
        ],
    };

    myChart.setOption(options); // Application des options au graphique
}


// Fonction pour afficher un graphique pour les ratios
function renderRatiosChart(data) {
    if (!data || typeof data.clas !== 'number' || typeof data.nb !== 'number' || typeof data.accept !== 'number') { // Vérification des données
        console.error("Données incorrectes pour les ratios :", data); // Affichage d'une erreur
        return;
    }

    const totalRatio = ((data.clas / data.nb) * 100).toFixed(2); // Calcul du ratio total
    const acceptRatio = ((data.accept / data.clas) * 100).toFixed(2); // Calcul du ratio d'acceptation

    const chartDom = document.getElementById('chart-ratios'); // Récupération de l'élément du graphique
    const myChart = echarts.init(chartDom); // Initialisation du graphique

    const options = { // Options du graphique
        title: {   // Titre du graphique
            text: 'Ratios',  // Texte du titre
            left: 'center', // Alignement du titre
        },
        tooltip: { // Infobulle
            trigger: 'axis',  // Déclencheur de l'infobulle
            formatter: (params) => { // Fonction pour le format de l'infobulle
                const descriptions = { // Descriptions des données
                    'Classés/Candidats': "Pourcentage de candidats classés parmi les postulants.", 
                    'Acceptés/Classés': "Pourcentage de candidats acceptés parmi ceux classés.",
                };
                return `${params[0].name}: ${params[0].value}%<br>${descriptions[params[0].name] || ''}`; // Retourne le texte de l'infobulle
            },
        },
        xAxis: { // Axe des abscisses
            type: 'category', // Type de l'axe
            data: ['Classés/Candidats', 'Acceptés/Classés'], // Données de l'axe
        },
        yAxis: { // Axe des ordonnées
            type: 'value', // Type de l'axe
            axisLabel: { // Étiquettes de l'axe
                formatter: '{value} %', // Format des étiquettes
            },
        },
        series: [ // Séries du graphique
            {
                data: [totalRatio, acceptRatio], // Données de la série
                type: 'bar', // Type de graphique
            },
        ],
    };

    myChart.setOption(options); // Application des options au graphique
}

// Fonction principale pour charger les graphiques
async function loadCharts() { 
    const urlParams = new URLSearchParams(window.location.search); // Paramètres de l'URL
    const ifc = urlParams.get('id'); // IFC de la formation

    if (!ifc) { // Vérification de l'IFC
        console.error("Aucun IFC trouvé dans l'URL."); // Affichage d'une erreur
        return;
    }

    try { // Récupération des données
        const data = await fetchMasterStats(ifc); // Récupération des statistiques

        // Rendu des graphiques
        renderCandidaturesChart(data.general); 
        renderCandidaturesEvolutionChart(data.general);
        renderAcademicProfileChart(data.experience);
        renderSuccessRatesChart(data.general);
        renderPropositionsChart(data.general);
        renderAcceptationsChart(data.general);
        renderRatiosChart(data.general);

        // Vérification pour les débouchés professionnels
        if (data.general && data.general.capacite) { // Vérification des données 
            renderProfessionalOutcomesChart(data.general); // Affichage des débouchés professionnels
        } else {
            console.warn("Pas de données pour les débouchés professionnels.");
        }
    } catch (error) {
        console.error("Erreur:", error); // Affichage de l'erreur
    }
}

// Charger les graphiques au chargement de la page
document.addEventListener('DOMContentLoaded', loadCharts);
