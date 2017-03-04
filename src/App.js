import React, { Component } from 'react';

import get from 'lodash/get';
import io from 'socket.io-client';

const socket = io(`http://localhost:3001`)

import './App.css';

import {
  getRequest, 
  originUrl
} from './http-util';

// we have to use inline styles since 
// we aren't importing css
class App extends Component {
  componentWillMount() {
    console.log('mounted-reactiv.ly');

    // first thing to do when mounted is send current url to API
    const url = originUrl();
    getRequest(`${process.env.REACT_APP_API_URL}?name=Daniel&url=${url}`)
      .catch((err) => console.error(err))

    socket.on('event', (data) => {
      console.log(data);
    });

    // if we get an emoji - show it
    socket.on("emoji", (data) => {
      this.pushInteraction(data);
    });

    // if we get an question - show it
    socket.on("R:App\\Events\\Question", (data) => {
      this.pushQuestion(data);
    });
  }
  pushInteraction(data) {
    console.log(data);
  }
  pushQuestion(data) {
    console.log(data);
  }
  render() {
    return (
      <div className="ReacivlyApp-wrapper">
        <div className="ReacivlyApp-banner">
          React to this presentation at: 
          {process.env.REACT_APP_SPA_URL}
        </div>
      </div>
    );
  }
}

export default App;
