import React from 'react';
import Board from './Board'
import AIBoard from './AIBoard'
import './Game.css'
import {  
  makeEmptyBoard,
  flatten,
  randomInt,
  makeBoard,
} from '../functions/Game'
import update from 'immutability-helper'


export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.state = {
      playerBoard: flatten(makeEmptyBoard()),
      aiBoard: flatten(makeBoard()),
      playerNext: true,
      playerWin: false,
      gameOver: false,
      aiSunkShips: [{ACarrier: false}, {Battleship: false}, {Cruiser: false}, {Submarine: false}, {Destroyer: false}],
      recentlySunk: null,
      shipsPlaced: [{ACarrier: false}, {Battleship: false}, {Cruiser: false}, {Submarine: false}, {Destroyer: false}],
      placingShip: '',
      hoverCoords: -1,
      gameStart: false,
      orientation: 'up'
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress)
  }

  handleKeyPress(e) {
    if (e.keyCode === 82) { /* R */
      switch (this.state.orientation) {
        case 'up':
          this.setState({orientation: 'right'})
          break;
        case 'right':
          this.setState({orientation: 'down'})
          break;
        case 'down':
          this.setState({orientation: 'left'})
          break;
        case 'left':
          this.setState({orientation: 'up'})
          break;
        default:
          console.log(`Unexpected state: ${this.state.orientation}`)         
      }
      console.log(`R key pressed. Now facing ${this.state.orientation}`)
    } else if (e.keyCode === 69) { /* E */
      switch (this.state.orientation) {
        case 'up':
          this.setState({orientation: 'left'})
          break;
        case 'right':
          this.setState({orientation: 'up'})
          break;
        case 'down':
          this.setState({orientation: 'right'})
          break;
        case 'left':
          this.setState({orientation: 'down'})
          break;
        default:
          console.log(`Unexpected state: ${this.state.orientation}`)         
      }
    }
  }

  handleAIClick(i) {
    //If the game hasn't been started, don't let player click this board.
    //IF the game is over, also don't let player click the board.
    if (this.state.gameStart === false) {
      return;
    }
    else if (this.state.gameOver) {
      return;
    }

    let aiBoardCopy = this.state.aiBoard.slice();
    let playerBoardCopy = this.state.playerBoard.slice();
    let aiTakeTurn = true;
    //Local variable to keep track if we ended game on this turn
    //(necessary since state doesn't change immediately on setState call)
    let over = false;

    //Mark this square as being hit
    if (this.state.aiBoard[i].hit === false) {
      aiBoardCopy[i].hit = true;
    }
    else {
      //Square was already clicked
      aiTakeTurn = false;
    }

    //Check if a ship has been sunk and if so, update aiSunkShips to reflect that
    let sunkShip = this.returnSunkShip();
    if (sunkShip !== null) {
      //Set recentlySunk to the name of the ship that we just sunk on player's click
      this.setState({recentlySunk: sunkShip});
      this.updateSunkShips(sunkShip);
    }

    //Check if the game is over after the player clicked the AI board
    if (this.checkGameOver(aiBoardCopy)) {
      this.setState({
        playerWin: true,
        gameOver: true
      });
      over = true;
      return;
    }
    else if (this.checkGameOver(playerBoardCopy)) {
      this.setState({gameOver: true});
      over = true;
      return;
    }

    //Let AI take its turn
    //If square hasn't been hit yet, let AI take its turn, else do nothing
    if (aiTakeTurn) {
      if (!over) { 
        playerBoardCopy[randomInt(0, 100)].hit = true;
      }

      this.setState({
        playerBoard: playerBoardCopy,
        aiBoard: aiBoardCopy
      })
    }
  }

  handleHover(entering, coords) {
    if (entering && this.placingShip) this.setState({hoverCoords: coords})
    else this.setState({hoverCoords: -1})
  }
  
  placeShip(shipName, i) { /* use this.state.orientation too and add error handling */
    let playerBoard = this.state.playerBoard
    let orientation = this.state.orientation

    let length = shipName === 'ACarrier' ? 5 
    : shipName === 'Battleship' ? 4
    : shipName === 'Cruiser' ? 3
    : shipName === 'Submarine' ? 3
    : shipName === 'Destroyer' ? 2
    : 0

    switch(orientation) {
      /* TODO: can remove checking if square is valid since we should prevent those clicks anyways*/
      case 'left':
        for (let j=0; j<length; j++) {
          if (Math.floor(i/10) - Math.floor((i-j)/10) === 0) { 
            // console.log(`updating at ${i-j}`)
            playerBoard = update(playerBoard, {
              [i-j]: {$set: {hit: false, type: shipName}}
            })
          }
        }
        break;
      case 'right':
        for (let j=0; j<length; j++) {
          if (Math.floor(i/10) - Math.floor((i+j)/10) === 0) {
            // console.log(`updating at ${i-j}`)
            playerBoard = update(playerBoard, {
              [i+j]: {$set: {hit: false, type: shipName}}
            })
          }
        }
        break;
      case 'down':
        for (let j=0; j<length; j++) {
          if ((i+j*10) <= 100) {
            // console.log(`updating at ${i-j}`)
            playerBoard = update(playerBoard, {
              [i+j*10]: {$set: {hit: false, type: shipName}}
            })
          }
        }
        break;
      default:
        for (let j=0; j<length; j++) {
          if ((i-j*10) >= 0) {
            // console.log(`updating at ${i-j}`)
            playerBoard = update(playerBoard, {
              [i-j*10]: {$set: {hit: false, type: shipName}}
            })
          }
        }
    }

    // playerBoard = update(this.state.playerBoard, {
    //   [i]: {$set: {hit: false, type: shipName}}
    // })
    this.setState({playerBoard})
  }

  handlePlayerClick(shipName, i) {
    // TODO put error handling here
    this.setState({placingShip: ''})
    this.setState({orientation: 'up'})
    let shipsPlaced
    switch(shipName) {
      case 'ACarrier':
        shipsPlaced = update(this.state.shipsPlaced, {
          0: {$set: {ACarrier: true}}
        })
        this.setState({shipsPlaced})
        this.placeShip(shipName, i)
        console.log(`placing ACarrier at ${i}`)
        break;
        
      case 'Battleship':
        shipsPlaced = update(this.state.shipsPlaced, {
          1: {$set: {Battleship: true}}
        })
        this.setState({shipsPlaced})
        this.placeShip(shipName, i)
        console.log(`placing Battleship at ${i}`)
        break;
        
      case 'Cruiser':
        shipsPlaced = update(this.state.shipsPlaced, {
          2: {$set: {Cruiser: true}}
        })
        this.setState({shipsPlaced})
        this.placeShip(shipName, i)
        console.log(`placing Cruiser at ${i}`)
        break;
        
      case 'Submarine':
        shipsPlaced = update(this.state.shipsPlaced, {
          3: {$set: {Submarine: true}}
        })
        this.setState({shipsPlaced})
        this.placeShip(shipName, i)
        console.log(`placing Submarine at ${i}`)
        break;
        
      case 'Destroyer':
        shipsPlaced = update(this.state.shipsPlaced, {
          4: {$set: {Destroyer: true}}
        })
        this.setState({shipsPlaced})
        this.placeShip(shipName, i)
        console.log(`placing Destroyer at ${i}`)
        break;
      default: 
        console.log("No ship selected.");
        break;
    }
  }

  placingShip(shipName) {
    this.setState(() => ({
      placingShip: shipName
    }))
  }

  //Signifies that the game has started - only runs once
  handleStartClick() {
    this.setState({gameStart: true})
  }

  //Check if all ships on given board have been destroyed.
  //If 17 hits are detected, that means every ship is destoryed.
  checkGameOver(board) {
    let hits = 0;
    for(let i = 0; i < board.length; ++i) {
      if ((board[i].hit === true) && (board[i].type !== "empty")) ++hits;
    }
    return hits === 17 ? true : false;
  }

  //Checks if all the ships have been placed and returns true if they have
  checkShips() {
    let ready = true;
    for(let obj in this.state.shipsPlaced) {
      for(let bool in this.state.shipsPlaced[obj]) {
        if (!this.state.shipsPlaced[obj][bool]) {
          ready = false;
        }
      }
    }
    return ready;
  }
  
  returnSunkShip() {
    let aiUnsunkShips = [];
    //Look at AI's sunken ships and only push the ones that haven't been sunk to aiSunkShips
    for(let obj in this.state.aiSunkShips) {
      for(let bool in this.state.aiSunkShips[obj]) {
        //If the ship is false (hasn't been sunk) push
        if (!this.state.aiSunkShips[obj][bool]) {
          //Push name of unsunk ships to array
          aiUnsunkShips.push(Object.keys(this.state.aiSunkShips[obj])[0]);
        }
      }
    }
    //Idk maybe unnecessary
    if (aiUnsunkShips.length === 0) return null;
    //Loop through unsunk ships and look at board and see if any of them have been sunk on most recent turn
    for(let ships = 0; ships < aiUnsunkShips.length; ++ships) {
      //let shipType = Object.keys(aiUnsunkShips[ships])[0];
      let shipType = aiUnsunkShips[ships];
      let shipLen = shipType === "ACarrier" ? 5 :
                    shipType === "Battleship" ? 4 :
                    shipType === "Destroyer" ? 2 : 3;
      let acc = 0;
      for(let i = 0; i < this.state.aiBoard.length; ++i) {
        if ((this.state.aiBoard[i].type === shipType) && (this.state.aiBoard[i].hit === true)) {
          ++acc;
        }
      }
      //If the ship has as many hits as its length, then that ship is sunk and we return it
      if (acc === shipLen) return shipType;
    }
    //No ship sunk
    return null;
  }

  updateSunkShips(shipType) {
    let aiSunkShips;
    switch(shipType) {
      case "ACarrier":
        aiSunkShips = update(this.state.aiSunkShips, {
          0: {$set: {ACarrier: true}}
        });
        this.setState({aiSunkShips: aiSunkShips});
        break;
      case "Battleship":
        aiSunkShips = update(this.state.aiSunkShips, {
          1: {$set: {Battleship: true}}
        });
        this.setState({aiSunkShips: aiSunkShips})
        break;
      case "Cruiser":
        aiSunkShips = update(this.state.aiSunkShips, {
          2: {$set: {Cruiser: true}}
        });
        this.setState({aiSunkShips: aiSunkShips})
        break;
      case "Submarine":
        aiSunkShips = update(this.state.aiSunkShips, {
          3: {$set: {Submarine: true}}
        });
        this.setState({aiSunkShips: aiSunkShips})
        break;
      case "Destroyer":
        aiSunkShips = update(this.state.aiSunkShips, {
          4: {$set: {Destroyer: true}}
        });
        this.setState({aiSunkShips: aiSunkShips})
        break;
      default:
        console.log("Unknown error in updateSunkShips");
        break;
    }
  }
  
  render() {
    let playerStatus = this.checkShips() ? "Game ready" : "Place all ships to start"
    let disableStart = true;

    //If the game isn't started and all the ships have been placed, enable the start button
    if (!this.state.gameStart && this.checkShips()) {
      disableStart = false;
    }

    let sunkShip = this.state.recentlySunk;
    if (sunkShip !== null) {
      playerStatus = "You've sunk the enemy's " + sunkShip;
    }

    if (this.state.gameOver) {
      playerStatus = this.state.playerWin ? "You won!" : "You lost :(";
    }
    
    return (
      <>
        <div className="game">
          <div className="ships">
            <button className="start-button" disabled={disableStart} onClick={() => this.handleStartClick()}>
              {"Start Game"}
            </button>
            <ul>
              <li>
                <button disabled={this.state.shipsPlaced[0].ACarrier ? true : false}
                        onClick={() => this.placingShip('ACarrier')}>Place ACarrier</button>
              </li>
              <li>
                <button disabled={this.state.shipsPlaced[1].Battleship ? true : false}
                        onClick={() => this.placingShip('Battleship')}>Place Battleship</button>
              </li>
              <li>
                <button disabled={this.state.shipsPlaced[2].Cruiser ? true : false}
                        onClick={() => this.placingShip('Cruiser')}>Place Cruiser</button>
              </li>
              <li>
                <button disabled={this.state.shipsPlaced[3].Submarine ? true : false}
                        onClick={() => this.placingShip('Submarine')}>Place Submarine</button>
              </li>
              <li>
                <button disabled={this.state.shipsPlaced[4].Destroyer ? true : false}
                        onClick={() => this.placingShip('Destroyer')}>Place Destroyer</button>
              </li>
            </ul>
          </div>
          <div className="game-board" id="left">
            <Board
              board={this.state.playerBoard}
              placingShip={this.state.placingShip}
              onClick={(i) => this.handlePlayerClick(this.state.placingShip, i)}
              onMouseEnter={(coords) => this.handleHover(true, coords)}
              onMouseLeave={(coords) => this.handleHover(false, coords)}
              hoverCoords={this.state.hoverCoords}
              orientation={this.state.orientation}
            />
          </div>
          <div className="game-board" id="right">
            <AIBoard
              board={this.state.aiBoard}
              onClick={(i) => this.handleAIClick(i)}
              sunkShips={this.state.aiSunkShips}
            />
          </div>
        </div>
        <div className="player-status">
          {playerStatus}
        </div>
        <div>
          <p></p>
        </div>
      </>
    );
  }
}

