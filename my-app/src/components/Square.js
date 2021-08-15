import React from 'react';
import './Square.css'

export default class Square extends React.Component {


  render() {
    let {
      shipType,
      coords,
      className,
      hit
    } = this.props
    if (hit && shipType !== 'empty') {
      className += ' hit'
    }

    if (shipType !== 'empty') {
      className += ` ${shipType}`
    }
    return (    
      <button 
        className={className}
        id={shipType}
        onClick={() => this.props.onClick(coords)}
        onMouseEnter={() => this.props.onMouseEnter(coords)}
        onMouseLeave={() => this.props.onMouseLeave(coords)}
      >
        {hit}
      </button>)
  }
}