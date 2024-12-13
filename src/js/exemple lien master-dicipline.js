const secDisciplinaires = [];
/*
[
  {id, nom, disciplineId, disciplineNom, in}
]
*/

const disciplineNom= "";

// Creer liste d'id de sect discipline qui corres. à la discipline choisie

const sectDiscIds = secDisciplinaires.filter((sd) => sd.disciplineNom === disciplineNom).map((sd) => sd.id);
/*
[1, 2, 4, 6,32, 43]
*/

const paramUrl = 'sdid=' + sectDiscIds.join('&sdid=');

fetch(`.../api/rest/formations?${paramUrl}`).then()