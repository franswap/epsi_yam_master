import gameService from "../services/game.service.js";

const grid = [
  [
    { viewContent: "1", id: "brelan1", owner: null, canBeChecked: false },
    { viewContent: "3", id: "brelan3", owner: "player:1", canBeChecked: false },
    { viewContent: "Défi", id: "defi", owner: "player:1", canBeChecked: false },
    { viewContent: "4", id: "brelan4", owner: "player:1", canBeChecked: false },
    { viewContent: "6", id: "brelan6", owner: "player:1", canBeChecked: false },
  ],
  [
    { viewContent: "2", id: "brelan2", owner: null, canBeChecked: false },
    {
      viewContent: "Carré",
      id: "carre",
      owner: "player:1",
      canBeChecked: false,
    },
    { viewContent: "Sec", id: "sec", owner: "player:1", canBeChecked: false },
    { viewContent: "Full", id: "full", owner: null, canBeChecked: false },
    { viewContent: "5", id: "brelan5", owner: "player:1", canBeChecked: false },
  ],
  [
    { viewContent: "≤8", id: "moinshuit", owner: null, canBeChecked: false },
    { viewContent: "Full", id: "full", owner: null, canBeChecked: false },
    { viewContent: "Yam", id: "yam", owner: "player:1", canBeChecked: false },
    { viewContent: "Défi", id: "defi", owner: "player:1", canBeChecked: false },
    { viewContent: "Suite", id: "suite", owner: null, canBeChecked: false },
  ],
  [
    { viewContent: "6", id: "brelan6", owner: "player:1", canBeChecked: false },
    { viewContent: "Sec", id: "sec", owner: null, canBeChecked: false },
    {
      viewContent: "Suite",
      id: "suite",
      owner: "player:1",
      canBeChecked: false,
    },
    { viewContent: "≤8", id: "moinshuit", owner: null, canBeChecked: false },
    { viewContent: "1", id: "brelan1", owner: "player:1", canBeChecked: false },
  ],
  [
    { viewContent: "3", id: "brelan3", owner: null, canBeChecked: false },
    { viewContent: "2", id: "brelan2", owner: "player:1", canBeChecked: false },
    {
      viewContent: "Carré",
      id: "carre",
      owner: null,
      canBeChecked: false,
    },
    { viewContent: "5", id: "brelan5", owner: "player:1", canBeChecked: false },
    { viewContent: "4", id: "brelan4", owner: null, canBeChecked: false },
  ],
];

// describe("gameService", () => {
//   describe("calculateScore", () => {
//     it("should correctly calculate the score", () => {
//       // const input = // insérez ici les données d'entrée appropriées
//       // const expectedOutput = // insérez ici le résultat attendu

//       const result = gameService.utils.calculateScore("player:1", grid);

//       expect(result).toEqual(5);
//     });
//   });
// });

const result = gameService.utils.calculateScore("player:1", grid);
console.log(result);

// Supposons que 'matrix' est votre matrice carrée
let matrix = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
];

let diagonals = [];

for (let i = 0; i < matrix.length; i++) {
  let j = 0,
    k = i;
  let diagonal = [];
  while (k >= 0) {
    diagonal.push(matrix[k][j]);
    k--;
    j++;
  }
  diagonals.push(diagonal);
}

for (let j = 1; j < matrix[0].length; j++) {
  let i = matrix.length - 1,
    k = j;
  let diagonal = [];
  while (k < matrix[0].length) {
    diagonal.push(matrix[i][k]);
    i--;
    k++;
  }
  diagonals.push(diagonal);
}

console.log(diagonals);
