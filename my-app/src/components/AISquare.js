import React from 'react';
import './Square.css'

export default class AISquare extends React.Component {


  render() {


    let {
      coords,
      className,
      hit,
      sunk,
      shipType
    } = this.props

    if (hit && shipType !== 'empty') {
      className += ' AIhit'
    }

    if (sunk) className += 'sunk'
    return (    
      <button 
        className={className}
        onClick={() => this.props.onClick(coords)}
        style={{ backgroundColor: this.props.bgColor }} 
      >
        {hit}
      </button>)
  }
}