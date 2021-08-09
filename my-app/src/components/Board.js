import React from 'react';
import Square from './Square'



export default class Board extends React.Component {
  constructor() {
    super()

    this.state = {
      square: 'square',
      hoverSquare: 'square hover'
    }
  }
  renderSquare(i) {
    // //Determine what the color of the square should be
    let squareColor;
    let name;

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

    if (i === this.props.hoverCoords && this.props.placingShip) {
      name = 'square hover'
    } else {
      name = 'square'
    }
      return (
        <Square
          coords={i}
          handlePlayerClick={(ix) => this.props.handlePlayerClick(ix)}
          shipType={this.props.board[i].type}
          placingShip={this.props.placingShip}
          bgColor={squareColor}
          onMouseEnter={(coords) => this.props.onMouseEnter(coords)}
          onMouseLeave={(coords) => this.props.onMouseLeave(coords)}
          hit={this.props.board[i].hit ? "X" : null}
          className={name}
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
