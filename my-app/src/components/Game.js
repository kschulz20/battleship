import React from 'react';
import Board from './Board'
import './Game.css'


export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerBoard: flatten(makeEmptyBoard()),
      aiBoard: flatten(makeBoard()),
      playerNext: true,
      shipsPlaced: [{ACarrier: false}, {Battleship: false}, {Cruiser: false}, {Submarine: false}, {Destroyer: false}],
      placingShip: ''
    };
  }

  handleClick(i) {
    const aiBoardCopy = this.state.aiBoard.slice();
    if (this.state.aiBoard.hit === false) {
      aiBoardCopy[i].hit = true;
    }
    this.setState({
      aiBoard: aiBoardCopy
    })
  }

  handlePlayerClick(shipName, i) {
    // TODO put error handling here
    let shipsPlaced;
    let shipPlaced
    this.setState(() => ({placingShip: ''}))
    switch(shipName) {
      case 'ACarrier':
        shipsPlaced = [...this.state.shipsPlaced]
        shipPlaced = {...shipsPlaced[0], ACarrier: true}
        shipsPlaced[0] = shipPlaced
        this.setState(shipsPlaced)
        console.log(`placing ACarrier at ${i}`)
        break;
        
      case 'Battleship':
        shipsPlaced = [...this.state.shipsPlaced]
        shipPlaced = {...shipsPlaced[1], Battleship: true}
        shipsPlaced[1] = shipPlaced
        this.setState(shipsPlaced)
        console.log(`placing Battleship at ${i}`)
        break;
        
      case 'Cruiser':
        shipsPlaced = [...this.state.shipsPlaced]
        shipPlaced = {...shipsPlaced[2], Cruiser: true}
        shipsPlaced[2] = shipPlaced
        this.setState(shipsPlaced)
        console.log(`placing Cruiser at ${i}`)
        break;
        
      case 'Submarine':
        shipsPlaced = [...this.state.shipsPlaced]
        shipPlaced = {...shipsPlaced[3], Submarine: true}
        shipsPlaced[3] = shipPlaced
        this.setState(shipsPlaced)
        console.log(`placing Submarine at ${i}`)
        break;
        
      case 'Destroyer':
        shipsPlaced = [...this.state.shipsPlaced]
        shipPlaced = {...shipsPlaced[4], Destroyer: true}
        shipsPlaced[4] = shipPlaced
        this.setState(shipsPlaced)
        console.log(`placing Destroyer at ${i}`)
        break;
      default: 
        console.log('no ship selected')
    }
  }

  placingShip(shipName) {
    this.setState(() => ({
      placingShip: shipName
    }))
    // setTimeout(() => {
    //   console.log(this.state.placingShip)
    // }, 1000);
  }
  
  render() {
    return (
      <div className="game">
        <div className="ships">
          <ul>
            <li>
              <button onClick={() => this.placingShip('ACarrier')}>Place ACarrier</button>
            </li>
            <li>
              <button onClick={() => this.placingShip('Battleship')}>Place Battleship</button>
            </li>
            <li>
              <button onClick={() => this.placingShip('Cruiser')}>Place Cruiser</button>
            </li>
            <li>
              <button onClick={() => this.placingShip('Submarine')}>Place Submarine</button>
            </li>
            <li>
              <button onClick={() => this.placingShip('Destroyer')}>Place Destroyer</button>
            </li>
          </ul>
        </div>
        <div className="game-board" id="left">
          <Board
            board={this.state.playerBoard}
            onClick={(i) => this.handleClick(i)}
            handlePlayerClick={(i) => this.handlePlayerClick(this.state.placingShip, i)}
          />
        </div>
        <div className="game-board" id="right">
          <Board
            board={this.state.aiBoard}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
      </div>
    );
  }
}


function makeEmptyBoard() {
  let board = Array(10).fill(null).map(arr => Array(10).fill({ type: "empty", hit: false} ));
  return board;
}
// ========================================

//Generating random board code

//Convert "2D" array to "1D" array
function flatten(arr) {
  let newArr = [];
  for(let i = 0; i < arr.length; ++i) {
    newArr = newArr.concat(arr[i])
  }
  return newArr;
}


function randomInt(min, max) { 
  return Math.floor(Math.random() * (max - min)) + min;
}

function checkVertical(board, xPos, yPos, size, dir) {
  if (dir === 'n') {
    if (yPos - size < 0) {
      return false;
    }
  }
  else {
    if (yPos + size > 9) {
      return false;
    }
  }
  for(let i = 0; i < size; ++i) {
    if (dir === 'n') {
      if (board[xPos][yPos - i].type !== "empty") {
        return false;
      }
    }
    else {
      if (board[xPos][yPos + i].type !== "empty") {
        return false;
      }
    }
  }
  return true;
}

function checkHorizontal(board, xPos, yPos, size, dir) {
  if (dir === 'e') {
    if (xPos + size > 9) {
      return false;
    }
  }
  else {
    if (xPos - size < 0) {
      return false;
    }
  }
  for(let i = 0; i < size; ++i) {
    if (dir === 'e') {
      if (board[xPos + i][yPos].type !== "empty") {
        return false;
      }
    }
    else {
      if (board[xPos - i][yPos].type !== "empty") {
        return false;
      }
    }
  }
  return true;
}

function makeBoard() {
  function placeShip(board, size, type) {
    let removeDirection = (arr, type) => directions.filter(d => d !== type);

    let boardCopy = board.slice(0, board.length);
    let directions = ['n', 'e', 's', 'w'];
    let xPos = randomInt(0, 10);
    let yPos = randomInt(0, 10);
    let place = true;
    while(place) {
      //If trying to place ship in impossible place (i.e., no more directions to try), 
      //try to place it somewhere else and refresh directions array.
      if (directions.length === 0) {
        xPos = randomInt(0, 10);
        yPos = randomInt(0, 10);
        directions = ['n', 'e', 's', 'w'];
      }
      let dir = directions[randomInt(0, directions.length)];
      switch(dir) {
        case 'n': {
          if (checkVertical(boardCopy, xPos, yPos, size, 'n')) {
            place = false;
            for(let i = 0; i < size; ++i) {
              boardCopy[xPos][yPos - i] = { type: type, hit: false };
            }
          }
          else {
            directions = removeDirection(directions, 'n');
          }
          break;
        }
        case 'e': {
          if (checkHorizontal(boardCopy, xPos, yPos, size, 'e')) {
            place = false;
            for(let i = 0; i < size; ++i) {
              boardCopy[xPos + i][yPos] = { type: type, hit: false };
            }
          }
          else {
            directions = removeDirection(directions, 'e');
          }
          break;
        }
        case 's': {
          if (checkVertical(boardCopy, xPos, yPos, size, 's')) {
            place = false;
            for(let i = 0; i < size; ++i) {
              boardCopy[xPos][yPos + i] = { type: type, hit: false };
            }
          }
          else {
            directions = removeDirection(directions, 's');
          }
          break;
        }
        case 'w': {
          if (checkHorizontal(boardCopy, xPos, yPos, size, 'w')) {
            place = false;
            for(let i = 0; i < size; ++i) {
              boardCopy[xPos - i][yPos] = { type: type, hit: false };
            }
          }
          else {
            directions = removeDirection(directions, 'w');
          }
          break;
        }
        default: {
          break;
        }
      }
    }
    return boardCopy;
  }
  let board = Array(10).fill(null).map(arr => Array(10).fill( { type: "empty", hit: false} ));
  board = placeShip(board, 2, 'D') 
  board = placeShip(board, 3, 'C');
  board = placeShip(board, 3, 'S');
  board = placeShip(board, 4, 'B');
  board = placeShip(board, 5, 'A');
  return board;
}