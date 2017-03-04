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
  constructor() {
    super();
    this.state = {
      interactions: [],
      questions: [],
    };
  }
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
    socket.on("R:App\\Events\\Interaction", (data) => {
      this.pushInteraction(data);
    });

    // if we get an question - show it
    socket.on("R:App\\Events\\Question", (data) => {
      this.pushQuestion(data);
    });
  }
  pushInteraction(data) {
    const {
      interactions
    } = this.state;

    console.log(data);
    const emoji = get(data, 'text');
    const id = Math.random();

    this.setState({
      interactions: [...interactions, {
        id: id,
        value: emoji
      }
    ]});

    // after 5 seconds remove the interaction from the state
    setTimeout(() => {
      // remove id from state.interactions
      this.setState({
        interactions: this.state.interactions.filter((obj) => obj.id !== id)
      });
    }, 5000);
  }
  pushQuestion(data) {
    const {
      questions
    } = this.state;

    console.log(data);
    const question = get(data, 'question');

    this.setState({
      questions: [...questions, question]
    });
  }
  renderInteractions() {
    const {
      interactions
    } = this.state;

    return interactions.map((interaction, i) => (
      <span
        className="ReacivlyApp-interaction"
        key={`emoji-${interaction.id}`}
      >
        {interaction.value}
      </span>
    ));
  }
  render() {
    return (
      <div className="ReacivlyApp-wrapper">
        <div className="ReacivlyApp-banner">
          React At:
          {' '}
          {process.env.REACT_APP_SPA_URL}
        </div>
        {this.renderInteractions()}
      </div>
    );
  }
}

export default App;
