import React, { Component } from 'react';

import get from 'lodash/get';
import sample from 'lodash/sample';
import io from 'socket.io-client';

const socket = io(`http://localhost:3001`)

import './App.css';
import './Interactions.css';

import {
  getRequest, 
  originUrl
} from './http-util';

// you'll see a lot of long class names, it's because
// this code will live side by side with whatever
// webpage the user activates it on, so it's safer to be specific
const paths = [
  'ReacivlyApp-path-1',
  'ReacivlyApp-path-2',
  'ReacivlyApp-path-3',
  'ReacivlyApp-path-4',
  'ReacivlyApp-path-5',
  'ReacivlyApp-path-6',
];

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
      console.log(data);
      this.pushQuestion(data);
    });
  }

  pushInteraction(data) {
    const {
      interactions
    } = this.state;

    const emoji = get(data, 'text');

    // make a crappy id to keep track 
    // of this in the array
    const id = Math.random();

    this.setState({
      interactions: [...interactions, {
        id: id,
        value: emoji,
        path: sample(paths),
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

    const question = get(data, 'question');

    // make a crappy id to keep track 
    // of this in the array just like emojis above ^^^
    const id = Math.random();

    this.setState({
      questions: [...questions, {
        id: id,
        value: question
      }
    ]});

    // after 5 seconds remove the interaction from the state
    // after 12 seconds
    setTimeout(() => {
      // remove id from state.interactions
      this.setState({
        questions: this.state.questions.filter((obj) => obj.id !== id)
      });
    }, 20000);
  }

  renderInteractions() {
    const {
      interactions
    } = this.state;

    return interactions.map((interaction, i) => (
      <span
        className={`ReacivlyApp-interaction ${interaction.path}`}
        key={`emoji-${interaction.id}`}
      >
        {interaction.value}
      </span>
    ));
  }

  renderQuestions() {
    const {
      questions
    } = this.state;

    if (!get(questions, 'length')) {
      return null;
    }

    return (
      <div className="ReacivlyApp-questions-wrapper">
        <div className="ReacivlyApp-questions">{
          questions.map((question, i) => (
            <span
              className="ReacivlyApp-question"
              key={`question-${question.id}`}
            >
              {question.value}
            </span>
          ))
        }</div>
      </div>
    );
  }

  // the {' '} is react's silly way of rendering a space
  render() {
    return (
      <div className="ReacivlyApp-wrapper">
        <div className="ReacivlyApp-banner">
          Visit
          {' '}
          {process.env.REACT_APP_SPA_URL}
          {' '}
          to react!
        </div>
        {this.renderInteractions()}
        {this.renderQuestions()}
      </div>
    );
  }
}

export default App;
