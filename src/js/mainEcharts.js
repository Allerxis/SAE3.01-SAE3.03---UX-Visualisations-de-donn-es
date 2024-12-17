import * as echarts from 'echarts';

const URL_API = "https://la-lab4ce.univ-lemans.fr/masters-stats/api/rest/"; //constante avec l'url de base de l'API

function test () {
    return fetch ( `${URL_API}/formations`);  //appel  la table formation de l'API 
} //on doit filtrer ensuite pour garder que les informations essentiels 