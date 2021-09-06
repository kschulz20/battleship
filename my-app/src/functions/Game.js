
const makeEmptyBoard = () => {
  let board = Array(10).fill(null);
  for(let i = 0; i < board.length; ++i) {
    let arr = [];
    for(let j = 0; j < 10; ++j) {
      arr.push({ type: "empty", hit: false })
    }
    board[i] = arr;
  }
  return board
}
// ========================================

//Generating random board code

//Convert "2D" array to "1D" array
const flatten = (arr) => {
  let newArr = [];
  for(let i = 0; i < arr.length; ++i) {
    newArr = newArr.concat(arr[i])
  }
  return newArr;
}


const randomInt = (min, max) => { 
  return Math.floor(Math.random() * (max - min)) + min;
}

const checkVertical = (board, xPos, yPos, size, dir) => {
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

const checkHorizontal = (board, xPos, yPos, size, dir) => {
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

const makeBoard = () => {
  let board = Array(10).fill(null);
  for(let i = 0; i < board.length; ++i) {
    let arr = [];
    for(let j = 0; j < 10; ++j) {
      arr.push({ type: "empty", hit: false })
    }
    board[i] = arr;
  }
  board = placeRandomShip(board, 2, 'Destroyer') 
  board = placeRandomShip(board, 3, 'Cruiser');
  board = placeRandomShip(board, 3, 'Submarine');
  board = placeRandomShip(board, 4, 'Battleship');
  board = placeRandomShip(board, 5, 'ACarrier');
  return board;
}

const placeRandomShip = (board, size, type)  => {
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

//Returns an array filled with numbers min to max (inclusive)
function makeNumArray(min, max) {
  let arr = [];
  for(let i = min; i <= max; ++i) {
    arr.push(i);
  }
  return arr;
}

//Returns arr with all instances of num removed
const removeNum = (arr, num) => {
  return arr.filter(x => x !== num);
}

module.exports = {
  makeEmptyBoard,
  flatten,
  randomInt,
  makeBoard,
  makeNumArray,
  removeNum,
}