import React from 'react';
import Square from './Square';

class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square 
            key={i}
            value={this.props.squares[i].state} 
            onClick={() => {this.props.onClick(i)}}
            highlighted={this.props.squares[i].highlighted}
        />);
    }
  
    render() {
        let boardRows = [];
        for(let i = 0; i < 3; i++) {
            let rows = [];
            for(let j = 0; j < 3; j++) {
                rows.push(this.renderSquare(i * 3 + j));
            }
            boardRows.push(<div className="board-row" key={i}>{ rows }</div>);
        }

        return (
            <div style={{minWidth: '440px'}}>
                { boardRows }
            </div>
        );
    }
}

export default Board;