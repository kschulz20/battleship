import React from 'react';
import './Square.css'

export default class AISquare extends React.Component {


  render() {
    const {
      coords,
      className,
      hit
    } = this.props
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