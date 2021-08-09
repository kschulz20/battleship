import React from 'react';
import './Square.css'

export default class Square extends React.Component {

  render() {
    return (    
      <button 
        className="square" 
        style={{ backgroundColor: this.props.bgColor }} 
        onClick={this.props.onClick}
      >
        {null}
      </button>)
  }
}