import React, { useState, useEffect } from 'react';
import './TicTacToe.css';

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [winner, setWinner] = useState(null);
    const [scores, setScores] = useState({ player: 0, ai: 0 });

    const checkWinner = (board) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        if (!board.includes(null)) {
            return 'Tie!';
        }

        return null;
    };

    const aiMove = (board) => {
        let bestScore = -Infinity;
        let bestMove = null;
        let alpha = -Infinity;
        let beta = Infinity;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                const newBoard = [...board];
                newBoard[i] = 'O';
                const score = minimax(newBoard, 0, false, alpha, beta);
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
                alpha = Math.max(alpha, bestScore);
            }
        }

        return bestMove;
    };

    const minimax = (board, depth, isMaximizingPlayer, alpha, beta) => {
        const result = checkWinner(board);
        if (result !== null) {
            if (result === 'O') {
                return 10 - depth;
            } else if (result === 'X') {
                return depth - 10;
            } else {
                return 0;
            }
        }

        if (isMaximizingPlayer) {
            let maxEval = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === null) {
                    const newBoard = [...board];
                    newBoard[i] = 'O';
                    const evaluation = minimax(newBoard, depth + 1, false, alpha, beta);
                    maxEval = Math.max(maxEval, evaluation);
                    alpha = Math.max(alpha, evaluation);
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === null) {
                    const newBoard = [...board];
                    newBoard[i] = 'X';
                    const evaluation = minimax(newBoard, depth + 1, true, alpha, beta);
                    minEval = Math.min(minEval, evaluation);
                    beta = Math.min(beta, evaluation);
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
            return minEval;
        }
    };

    const handleClick = (index) => {
        if (board[index] === null && isPlayerTurn && !winner) {
            const newBoard = [...board];
            newBoard[index] = 'X';
            setBoard(newBoard);
            setIsPlayerTurn(false);
        }
    };

    useEffect(() => {
        if (!isPlayerTurn) {
            const aiMoveIndex = aiMove(board);
            const newBoard = [...board];
            newBoard[aiMoveIndex] = 'O';
            setBoard(newBoard);
            setIsPlayerTurn(true);

            const result = checkWinner(newBoard);
            if (result !== null) {
                setWinner(result === 'X' ? 'You win!' : result === 'O' ? 'AI wins!' : 'Tie!');
                if (result === 'X') {
                    setScores(prevScores => ({ ...prevScores, player: prevScores.player + 1 }));
                } else if (result === 'O') {
                    setScores(prevScores => ({ ...prevScores, ai: prevScores.ai + 1 }));
                }
            }
        }
    }, [board, isPlayerTurn]);

    const renderCell = (index) => {
        return (
            <div className="cell" key={index} onClick={() => handleClick(index)}>
                {board[index]}
            </div>
        );
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsPlayerTurn(true);
        setWinner(null);
    };

    useEffect(() => {
        if (winner === 'Tie!') {
            alert('The game is a tie!');
            resetGame();
        }
    }, [winner]);

    return (
        <div className="tic-tac-toe">
            <h1>Tic Tac Toe</h1>
            <div className="board">
                {board.map((_, index) => (
                    renderCell(index)
                ))}
            </div>
            {winner && <h2>{winner}</h2>}
            <div className="scores">
                <p>Player: {scores.player}</p>
                <p>AI: {scores.ai}</p>
            </div>
            {winner && <button onClick={resetGame}>Play Again</button>}
        </div>
    );
};

export default TicTacToe;
