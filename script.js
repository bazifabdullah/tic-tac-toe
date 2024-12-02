const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    }

    const setMark = (index, mark) => {
        if (board[index] === "") {
            board[index] = mark;
            return true
        }
        return false;
    };

    return { getBoard, resetBoard, setMark };
})();

const Player = (name, mark) => {
    return { name, mark };
}

const DisplayController = (() => {
    const boardElement = document.querySelector(".gameboard");
    const messageElement = document.querySelector(".message");
    const restartButton = document.querySelector(".restart");

    const renderBoard = () => {
        boardElement.innerHTML = "";
        Gameboard.getBoard().forEach((mark, index) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.textContent = mark;
            if (mark !== "") {
                cell.classList.add("taken");
            }
            cell.addEventListener("click", () => handleClick(index));
            boardElement.appendChild(cell);
        });
    };

    const setMessage = (message) => {
        messageElement.textContent = message;
    };

    const handleClick = (index) => {

        if (GameController.isGameOver()) {
            return;
        }

        const currentPlayer = GameController.getCurrentPlayer();
        if (GameController.playTurn(index)) {
            renderBoard();
            if (GameController.isGameOver()) {
                const winner = GameController.getWinner();
                if (winner) {
                    setMessage(`🎉 ${winner.name} (${winner.mark}) wins!`);
                } else {
                    setMessage("It's a tie! 🤝");
                }
            } else {
                const nextPlayer = GameController.getCurrentPlayer();
                setMessage(`${nextPlayer.name}'s (${nextPlayer.mark}) turn.`);
            }
        } else {
            setMessage("Spot taken! Choose another.");
        }
    };

    restartButton.addEventListener("click", () => {
        restartButton.innerHTML = "Restart Game"
        GameController.startGame("Player 1", "Player 2");
        renderBoard();
        setMessage("Game started! Player 1's (X) turn.");
    });

    return { renderBoard, setMessage };
})();

const GameController = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let gameOver = false;
    let winner = null;

    const startGame = (player1Name, player2Name) => {
        players = [
            Player(player1Name, "X"),
            Player(player2Name, "O")
        ];
        currentPlayerIndex = 0;
        gameOver = false;
        winner = null;
        Gameboard.resetBoard();
    };

    const playTurn = (index) => {
        if (gameOver) return false;

        if (Gameboard.setMark(index, players[currentPlayerIndex].mark)) {
            if (checkWinner()) {
                gameOver = true;
                winner = players[currentPlayerIndex];
            } else if (Gameboard.getBoard().every(cell => cell !== "")) {
                gameOver = true;
            } else {
                currentPlayerIndex = 1 - currentPlayerIndex; // Switch player
            }
            return true;
        }
        return false; // Spot was taken
    };

    const checkWinner = () => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]            // Diagonals
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return (
                Gameboard.getBoard()[a] === players[currentPlayerIndex].mark &&
                Gameboard.getBoard()[b] === players[currentPlayerIndex].mark &&
                Gameboard.getBoard()[c] === players[currentPlayerIndex].mark
            );
        });
    };

    const getCurrentPlayer = () => players[currentPlayerIndex];
    const getWinner = () => winner;
    const isGameOver = () => gameOver;

    return { startGame, playTurn, getCurrentPlayer, getWinner, isGameOver };
})();

