import React from 'react';
import './Square.css'

export default class Square extends React.Component {


  render() {
    const {
      shipType,
      coords,
      className,
      hit
    } = this.props
    return (    
      <button 
        className={className}
        id={shipType}
        onClick={() => this.props.onClick(coords)}
        onMouseEnter={() => this.props.onMouseEnter(coords)}
        onMouseLeave={() => this.props.onMouseLeave(coords)}
        style={{ backgroundColor: this.props.bgColor }} 
      >
        {hit}
      </button>)
  }
}