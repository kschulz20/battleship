import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';

function Square(props) {
  return (
    <button className="square" style={{ backgroundColor: props.bgColor }} onClick={props.onClick}>
      {null}
    </button>
  );
}

export default class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.board[i]}
        bgColor={ (this.props.board[i].type !== "empty" ? "blue" : "white") }
        onClick={() => this.props.onClick(i)}
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
      rows.push(<div className="board-row">{squares}</div>)
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
}
