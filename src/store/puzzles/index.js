export default {
  namespaced: true,
  state: {
    openedFilterPanel: [0],
    ratingRange: [800, 1500],
    numberOfPiecesRange: [4, 7],    
    sideFilter: 'any', 
    pieceFilters: {
    include: [],
    exclude: [],
    },
    puzzles: [],
    noPuzzles: false,
    activePuzzleExists: false,
    activePuzzle: {
      puzzle_id: '03zfY',
      rating: 1386,
      moves_alg: ['Kg6', 'Qf6#'],
      active: 'b',
      castling: '-',
      enpassant: '-',
      number_of_pieces: 6,
      positions: {
        K: ['g6'],
        Q: ['h5'],
        P: ['h4'],
        k: ['g8'],
        q: ['e5'],
        p: ['g7'],
      },
      id: 1600,
    },
    solutionVisible: false,
    playerSolution: '',
    playerCorrect: 0,
    playerWrongAnswers: [],
    puzzleSolved: false,
  },
  mutations: {
    updateNoPuzzles(state, payload) {
      state.noPuzzles = payload;
    },
    updateOpenedFilterPanel(state) {
      if (state.openedFilterPanel[0] === 0) {
        state.openedFilterPanel = [];
      } else {
        state.openedFilterPanel = [0];
      }
    },
    closeOpenedFilterPanel(state) {
      state.openedFilterPanel = [];
    },
    updatePuzzles(state, payload) {
      state.puzzles = payload.puzzles;
    },
    updateRatingRange(state, payload) {
      state.ratingRange = payload;
    },
    updateNumberOfPiecesRange(state, payload) {
      state.numberOfPiecesRange = payload;
    },
    updateActivePuzzle(state, payload) {
      state.activePuzzleExists = true;
      state.activePuzzle = payload;
    },
    updateActivePuzzleExists(state, payload) {
      state.activePuzzleExists = payload;
    },
    updateSolutionVisible(state, payload) {
      state.solutionVisible = payload;
    },
    cleanPlayerWrongAnswers(state) {
      state.playerWrongAnswers = [];
    },
    pushPlayerWrongAnswers(state, payload) {
      state.playerWrongAnswers.push(payload);
    },
    updatePlayerSolution(state, payload) {
      state.playerSolution = payload;
    },
    increasePlayerCorrect(state, payload) {
      state.playerCorrect += payload;
    },
    cleanPlayerCorrect(state) {
      state.playerCorrect = 0;
    },
    updatePuzzleSolved(state, payload) {
      state.puzzleSolved = payload;
    },
    updateSideFilter(state, payload) {
      state.sideFilter = payload;
    },
    updatePieceFilters(state, payload) {
      state.pieceFilters = payload;
    },
  },
  actions: {
    loadPuzzles({ commit }) {
      const puzzles = require('../../data/puzzles_alg.json');
      commit('updatePuzzles', { puzzles });
    },
getRandomPuzzleFromFilteredPuzzles({ state, commit }) {
  let filteredPuzzles = state.puzzles.filter((puzzle) => {
    const ratingOk =
      puzzle.rating >= state.ratingRange[0] &&
      puzzle.rating <= state.ratingRange[1];

    const piecesCountOk =
      puzzle.number_of_pieces >= state.numberOfPiecesRange[0] &&
      puzzle.number_of_pieces <= state.numberOfPiecesRange[1];

    const sideOk =
      state.sideFilter === 'any' || puzzle.active === state.sideFilter;

    const presentPieces = Object.keys(puzzle.positions);

    const includeOk = state.pieceFilters.include.every((piece) =>
      presentPieces.includes(piece)
    );

    const excludeOk = !state.pieceFilters.exclude.some((piece) =>
      presentPieces.includes(piece)
    );

    return ratingOk && piecesCountOk && sideOk && includeOk && excludeOk;
  });

  if (filteredPuzzles.length == 0) {
    commit('updateNoPuzzles', true);
    commit('updateActivePuzzleExists', false);
  } else {
    let activePuzzle =
      filteredPuzzles[Math.floor(Math.random() * filteredPuzzles.length)];

    commit('closeOpenedFilterPanel');
    commit('updateNoPuzzles', false);
    commit('updateSolutionVisible', false);
    commit('updateActivePuzzle', activePuzzle);
    commit('cleanPlayerWrongAnswers');
    commit('updatePlayerSolution', '');
    commit('cleanPlayerCorrect');
  }
},
  getters: {
    noPuzzles: (state) => {
      return state.noPuzzles;
    },
    activePuzzle: (state) => {
      return state.activePuzzle;
    },
    activePuzzleExists: (state) => {
      return state.activePuzzleExists;
    },
    activePlayer: (state) => {
      return state.activePuzzle.active === 'w' ? 'White' : 'Black';
    },
    inactivePlayer: (state) => {
      return state.activePuzzle.active === 'w' ? 'Black' : 'White';
    },
    castling: (state) => {
      let cast = state.activePuzzle.castling;
      return cast === '-'
        ? ''
        : `Castling possible: ${cast.includes('K') ? 'White kingside. ' : ''}${
            cast.includes('Q') ? 'White queenside. ' : ''
          }${cast.includes('k') ? 'Black kingside. ' : ''}${
            cast.includes('q') ? 'Black queenside. ' : ''
          }`;
    },
    enPassant: (state) => {
      let en = state.activePuzzle.enpassant;
      return en === '-' ? '' : `En passant square: ${en}.`;
    },
    solutionVisible: (state) => {
      return state.solutionVisible;
    },
    solution: (state) => {
      return state.activePuzzle.moves_alg.slice(1);
    },
    solutionPlayerPart: (state) => {
      return state.activePuzzle.moves_alg.slice(1).filter((v, i) => !(i % 2));
    },
    solutionOpponentPart: (state) => {
      return state.activePuzzle.moves_alg.slice(1).filter((v, i) => i % 2);
    },
    playerSolution: (state) => {
      return state.playerSolution;
    },
    playerCorrect: (state) => {
      return state.playerCorrect;
    },
    playerWrongAnswers: (state) => {
      return state.playerWrongAnswers;
    },
    puzzleSolved: (state) => {
      return state.puzzleSolved;
    },
  },
};
