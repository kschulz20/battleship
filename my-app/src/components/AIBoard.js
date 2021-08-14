import React from 'react';
import Square from './Square'
import './Board.css'

export default class AIBoard extends React.Component {

  renderSquare(i) {
    let squareColor;

    //AI square
    squareColor = (this.props.board[i].type !== "empty" && this.props.board[i].hit) ? "red" : "white";

    return (
      <Square
        coords={i}
        onClick={(ix) => this.props.onClick(ix)} // todo change to ai click
        shipType={this.props.board[i].type}
        bgColor={squareColor}
        hit={this.props.board[i].hit ? "X" : null}
        className='square'
        key={i}
        onMouseEnter={() => {
          console.log('aiEnter')
        }}
        onMouseLeave={() => {
          console.log('aiLeave')
        }}
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