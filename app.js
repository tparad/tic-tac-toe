const gameBoard = (() => {
    const boardSize = 9;
    let board = Array(boardSize).fill(null)
    buildBoard();
    const gridElements = document.querySelectorAll('.grid-element');
    renderBoard();

    function buildBoard() {
        const gridContainer = document.querySelector('#grid-container');
        for (i = 0; i < boardSize; i++) {
            const gridElement = document.createElement('div');
            gridElement.classList.add('grid-element');
            gridElement.dataset.index = i;
            gridContainer.appendChild(gridElement);
        };
    };
    function renderBoard() {
        for (let i = 0, len = gridElements.length; i < len; i++) {
            gridElements[i].innerText = board[i];
        };
    };
    function addPiece(piece, index) {
        board[index] = piece;
        renderBoard();
    };
    function resetBoard() {
        for (let i = 0, len = board.length; i < len; i++) {
            board[i] = null;
        }
        renderBoard();
    };
    return {addPiece, resetBoard, board};
})();

const Player = (name, boardPiece) => {
    this.name = name;
    this.boardPiece = boardPiece;
    return {name, boardPiece};
};

const game = (() => {
    const gridElements = document.querySelectorAll('.grid-element');
    const gameMessage = document.querySelector('#game-message');
    bindEvents();

    playerOne = Player('Player 1', 'X');
    playerTwo = Player('Player 2', 'O');
    let gameIsActive = true;
    let turn = playerOne;
    const winningMatrix = [[0, 1, 2],
                        [3, 4, 5],
                        [6, 7, 8],
                        [0, 3, 6],
                        [1, 4, 7],
                        [2, 5, 8],
                        [0, 4, 8],
                        [2, 4, 6]];

    function bindEvents () {
        for (let i = 0, len = gridElements.length; i < len; i++) {
            gridElements[i].addEventListener('click', makeMove);
        };
    };
    function nextTurn() {
        turn = turn === playerOne? playerTwo : playerOne;
    };
    function makeMove(e) {
        if (!gameIsActive) return;
        const index = e.target.dataset.index;
        if (gameBoard.board[index]) return;
        gameBoard.addPiece(turn.boardPiece, index);
        checkWinner();
    };
    function checkWinner() {

        for (const combination of winningMatrix) {
            const [a, b, c] = combination;
            if (gameBoard.board[a] === turn.boardPiece && gameBoard.board[b] === turn.boardPiece && gameBoard.board[c] === turn.boardPiece) {
                declareWinner();
                return;
            };
        };
        if (!gameBoard.board.includes(null)) {
            declareDraw();
            return;
        };
        nextTurn();
    };
    function declareWinner() {
        gameMessage.innerText = `${turn.name} wins!`;
        gameIsActive = false;
    };
    function declareDraw() {
        gameMessage.innerText = `Draw!`;
        gameIsActive = false;
    };
    function restartGame() {
        gameIsActive = true;
        gameMessage.innerText = "";
        turn = playerOne;
        gameBoard.resetBoard();
    };
    return {restartGame, playerOne, playerTwo};
})();

const viewController = (() => {
    const playerSignupWindow = document.querySelector('#player-signup-window');
    const playerSignupForm = document.querySelector('#player-signup-form');
    const playerSignupOverlay = document.querySelector('#signup-overlay');
    const restartButton = document.querySelector('#restart-button');
    const playerSubmitButton = document.querySelector('#player-submit-button');
    const playerOneNameSubmission = document.querySelector('#player-one-name');
    const playerTwoNameSubmission = document.querySelector('#player-two-name');
    const playerOneDisplay = document.querySelector('#player-one-display');
    const playerTwoDisplay = document.querySelector('#player-two-display');
    restartButton.addEventListener('click', game.restartGame);
    playerSubmitButton.addEventListener('click', submitPlayers);

    function submitPlayers() {
        game.playerOne.name = playerOneNameSubmission.value;
        game.playerTwo.name = playerTwoNameSubmission.value;
        playerOneDisplay.innerText += `Player One (X): ${playerOneNameSubmission.value}`;
        playerTwoDisplay.innerText += `Player Two (O): ${playerTwoNameSubmission.value}`;
        console.log(game.playerOne);
        console.log(game.playerTwo);
        playerSignupWindow.remove('active');
        playerSignupOverlay.remove('active');
        playerSignupForm.reset()

    };
})();
