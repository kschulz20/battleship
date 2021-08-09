import React from 'react';
import './Square.css'

export default class Square extends React.Component {
  render() {
    const {
      shipType,
      coords
    } = this.props
    return (    
      <button 
        className="square"
        id={shipType}
        style={{ backgroundColor: this.props.bgColor }} 
        onClick={() => this.props.handlePlayerClick(coords)}
      >
        {null}
      </button>)
  }
}