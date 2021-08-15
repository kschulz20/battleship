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
    //If the game hasn't been started, don't let player click this board
    if (this.state.gameStart === false) {
      return;
    }

    let aiBoardCopy = this.state.aiBoard.slice();
    let playerBoardCopy = this.state.playerBoard.slice();
    let aiTakeTurn = true;

    //Mark this square as being hit
    if (this.state.aiBoard[i].hit === false) {
      aiBoardCopy[i].hit = true;
    }
    else {
      //Square was already clicked
      aiTakeTurn = false;
    }

    //Let AI take its turn
    //If square hasn't been hit yet, let AI take its turn, else do nothing
    if (aiTakeTurn) {
      playerBoardCopy[randomInt(0, 100)].hit = true;

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
    let playerBoard, length, orientation, index
    playerBoard = this.state.playerBoard
    orientation = this.state.orientation
    index = i

    length = shipName === 'ACarrier' ? 5 
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
  
  render() {
    const playerStatus = this.state.gameStart ? "Game ready" : "Place all ships to start"
    let disableStart = true;

    //If the game isn't started and all the ships have been placed, enable the start button
    if (!this.state.gameStart && this.checkShips()) {
      disableStart = false;
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

