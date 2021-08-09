import React from 'react';
import './Square.css'

export default class Square extends React.Component {


  render() {
    const {
      shipType,
      coords,
      className
    } = this.props
    return (    
      <button 
        className={className}
        id={shipType}
        onClick={() => this.props.handlePlayerClick(coords)}
        onMouseEnter={() => this.props.onMouseEnter(coords)}
        onMouseLeave={() => this.props.onMouseLeave(coords)}
      >
        {this.props.hit}
      </button>)
  }
}