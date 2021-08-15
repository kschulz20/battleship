import React from 'react';
import Square from './AISquare'
import './Board.css'

export default class AIBoard extends React.Component {

  renderSquare(i) {
    return (
      <Square
        coords={i}
        onClick={(ix) => this.props.onClick(ix)}
        hit={this.props.board[i].hit ? "X" : null}
        className='square'
        key={i}
      />
    );

  }

  render() {

    /* attempt to add sunk conditioning*/
    // let [
    //   a,
    //   b,
    //   c,
    //   s,
    //   d
    // ] = this.props.sunkShips
    // a = Object.values(a)[0]
    // console.log(a)


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