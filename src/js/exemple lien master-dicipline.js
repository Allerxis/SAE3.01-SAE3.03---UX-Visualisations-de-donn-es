const secDisciplinaires = [];
/*
[
  {id, nom, disciplineId, disciplineNom, in}
]
*/

const disciplineNom= "";

// Creer liste d'id de sect discipline qui corres. à la discipline choisie

const usp = new URLSearchParams();

const sectDiscIds = secDisciplinaires.filter((sd) => sd.disciplineNom === disciplineNom).forEach((sd) => {
    usp.append('sdid', sd.id);
});
/*
[1, 2, 4, 6,32, 43]
*/

fetch(`.../api/rest/formations?${usp.toString()}`).then() // Récupère les formations ayant pour id l'un de ceux présents dans usp