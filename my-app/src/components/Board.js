import React from 'react';
import Square from './Square'



export default class Board extends React.Component {
  renderSquare(i) {
    //Determine what the color of the square should be
    let squareColor;
    if (this.props.isPlayer) {
      if (this.props.board[i].type !== "empty") {
        squareColor = (this.props.board[i].hit ? "red" : "blue")
      }
      else {
        squareColor = "white";
      }
    }
    else {
      //AI square
      squareColor = (this.props.board[i].type !== "empty" && this.props.board[i].hit) ? "red" : "white";
    }
    return (
      <Square
        value={this.props.board[i]}
        hit={this.props.board[i].hit ? "X" : null}
        bgColor={squareColor}
        onClick={() => this.props.onClick(i)}
        key={i}
      />
    );
  }

  render() {
    let rows = [];
    for(let i = 0; i < 10; ++i) {
      let squares = [];
      for(let j = 0; j < 10; ++j) {
        squares.push(this.renderSquare(10*i + j));
      }
      rows.push(<div key={i} className="board-row">{squares}</div>)
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
}
