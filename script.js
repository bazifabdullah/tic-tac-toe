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

