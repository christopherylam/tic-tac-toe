import React from 'react';
import Board from './Board';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                { squares: Array.from({ length: 9 }, () => ({ state: null, highlighted: false })) }
            ],
            player1IsNext: true,
            stepNumber: 0,
            player1: null,
            player2: null
        };

        this.resetGame = this.resetGame.bind(this);
        this.undoMove = this.undoMove.bind(this);
    }

    jumpTo(step) {
        let history = this.state.history;
        let result = this.calculateWinner(history[step].squares);
        if(!result) {
            history[step].squares.forEach(square => {
                square.highlighted = false;
            });
        } 
        else {
            result.forEach(num => {
                history[step].squares[num].highlighted = true;
            });
        }

        this.setState({
            history: history,
            stepNumber: step,
            player1IsNext: (step % 2) === 0 ? true : false
        });
    }

    resetGame() {
        this.setState({
            history: [
                { squares: Array.from({ length: 9 }, () => ({ state: null, highlighted: false })) }
            ],
            player1IsNext: true,
            stepNumber: 0,
            player1: null,
            player2: null
        });
    }

    undoMove() {
        let history = this.state.history.slice(0, this.state.history.length - 1);
        let result = this.calculateWinner(history[history.length - 1].squares);
        if(!result) {
            history[history.length - 1].squares.forEach(square => {
                square.highlighted = false;
            });
        } 
        else {
            result.forEach(num => {
                history[history.length - 1].squares[num].highlighted = true;
            });
        }
        this.setState({
            history: history,
            player1IsNext: ((history.length - 1) % 2) === 0 ? true : false,
            stepNumber: history.length - 1
        });
    }

    selectPlayer(type) {
        if(type === 'X') {
            this.setState({ player1: 'X', player2: 'O' });
        }
        else {
            this.setState({ player1: 'O', player2: 'X' });
        }
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
            if (squares[a].state && squares[a].state === squares[b].state && squares[a].state === squares[c].state) {
                return lines[i];
            }
        }

        for(let i = 0; i < squares.length; i++) {
            if(!squares[i].state) {
                return null;
            }
        }

        return 'draw';
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        let result = this.calculateWinner(current.squares);

        if(result || current.squares[i].state) {
            return;
        }

        const squares = current.squares.slice();
        squares[i] = this.state.player1IsNext ? {state: this.state.player1, highlighted: false} : {state: this.state.player2, highlighted: false};
        
        result = this.calculateWinner(squares);
        if(result && result !== 'draw') {
            result.forEach(num => {
                squares[num].highlighted = true; 
            });
        }
        
        this.setState({
            history: history.concat([{squares: squares}]), 
            player1IsNext: !this.state.player1IsNext,
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
                status = `Winner: ${current.squares[winner[0]].state}`;
            }
            else {
                status = `Player's Turn: ${this.state.player1IsNext ? this.state.player1 : this.state.player2}`;
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
            <div>
                {
                    (!this.state.player1 && !this.state.player2) && (
                        <div>
                            <h3 align="center">Select which player goes first:</h3>
                            <br />
                            <div style={{display:'flex', justifyContent: 'center'}}>
                                <span style={{ marginRight: "10px" }} className="player-button" onClick={() => {this.selectPlayer('O')}}>O</span>
                                <span style={{ marginLeft: "10px" }} className="player-button" onClick={() => {this.selectPlayer('X')}}>X</span>
                            </div>
                        </div>
                    )
                }
                {
                    (this.state.player1 && this.state.player2) && (
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
                    )
                }
            </div>
        );
    }
}

export default Game;