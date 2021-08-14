import React from 'react';
import Square from './Square'
import './Board.css'



export default class Board extends React.Component {

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

      name = i === this.props.hoverCoords && this.props.placingShip ? 'square hover' : 'square'
    // if (i === this.props.hoverCoords && this.props.placingShip) {
    //   name = 'square hover'
    // } else {
    //   name = 'square'
    // }
      return (
        <Square
          coords={i}
          onClick={(ix) => this.props.handlePlayerClick(ix)}
          shipType={this.props.board[i].type}
          bgColor={squareColor}
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
