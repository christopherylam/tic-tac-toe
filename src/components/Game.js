import React from 'react';
import Board from './Board';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                { squares: Array(9).fill(null) }
            ],
            xIsNext: true,
            stepNumber: 0
        };

        this.resetGame = this.resetGame.bind(this);
        this.undoMove = this.undoMove.bind(this);
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0 ? true : false
        });
    }

    resetGame() {
        this.setState({
            history: [
                { squares: Array(9).fill(null) }
            ],
            xIsNext: true,
            stepNumber: 0
        });
    }

    undoMove() {
        const history = this.state.history.slice(0, this.state.history.length - 1);
        this.setState({
            history: history,
            xIsNext: ((history.length - 1) % 2) === 0 ? true : false,
            stepNumber: history.length - 1
        });
    }

    calculateWinner(squares) {
        const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }

        for(let i = 0; i < squares.length; i++) {
            if(!squares[i]) {
                return null;
            }
        }

        return 'draw';
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];

        if(this.calculateWinner(current.squares) || current.squares[i]) {
            return;
        }
        const squares = current.squares.slice();
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{squares: squares}]), 
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = this.calculateWinner(current.squares);

        let moves = history.map((step, move) => {
            return (
                <li key={move}>
                    <button onClick={() => {this.jumpTo(move)}}>Move { move }</button>
                </li>
            );
        });

        moves = moves.slice(1);

        let status;
        if(winner === 'draw') {
            status = 'Draw';
        }
        else {
            if(winner) {
                status = `Winner: ${winner}`;
            }
            else {
                status = `Player's Turn: ${this.state.xIsNext ? 'X' : 'O'}`;
            }
        }

        let gameInfo, gameButtons;
        if(history.length > 1) {
            gameInfo = (
                <div>
                    <h4>Past Moves</h4>
                    <ol>{moves}</ol>
                </div>
            );

            gameButtons = (
                <div align="center">
                    <button onClick={this.resetGame}>Reset</button>
                    <button style={{marginLeft:'10px'}} onClick={this.undoMove}>Undo</button>
                </div>
            );
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => {this.handleClick(i)}}
                    />
                    <br />
                    { gameButtons }
                </div>
                <div className="game-info">
                    <h3>{status}</h3>
                    {gameInfo}
                </div>
            </div>
        );
    }
}

export default Game;