import React from 'react';
import Square from './Square'
import './Board.css'



export default class Board extends React.Component {

  /* returns true if square should be set as hovered based on current hovered square*/
  checkHover(mouseSquare, currSquare, shipType) {
    let length;
    length = shipType === 'ACarrier' ? 5 
      : shipType === 'Battleship' ? 4
      : shipType === 'Cruiser' ? 3
      : shipType === 'Submarine' ? 3
      : shipType === 'Destroyer' ? 2
      : 1
    return mouseSquare >= currSquare && 
      Math.floor(mouseSquare/10) - Math.floor(currSquare/10) < length && 
      mouseSquare%10 === currSquare%10// TODO: change to implement out of bounds and rotations

  }

  renderSquare(i) {
    // //Determine what the color of the square should be
    let squareColor;
    let name;

      if (this.props.board[i].type !== "empty") {
        squareColor = (this.props.board[i].hit ? "red" : "blue")
      }
      else {
        squareColor = "white";
      }

      name = this.checkHover(this.props.hoverCoords, i, this.props.placingShip) ? 'square hover' : 'square'

      return (
        <Square
          coords={i}
          onClick={(ix) => this.props.onClick(ix)}
          shipType={this.props.board[i].type}
          hit={this.props.board[i].hit ? "X" : null}
          onMouseEnter={(coords) => this.props.onMouseEnter(coords)}
          onMouseLeave={(coords) => this.props.onMouseLeave(coords)}
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
