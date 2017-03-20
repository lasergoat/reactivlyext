import React, { Component } from 'react';

import get from 'lodash/get';
import sample from 'lodash/sample';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCK_URL || `http://localhost:3001`)

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
      room: null,
      interactions: [],
      questions: [],
    };
    window.addEventListener("beforeunload", () => {
      const {
        room
      } = this.state;

      if (room) {
        socket.emit('endpresentation', {
          room,
        });
      }

      return true;
    });
  }

  componentWillMount() {
    console.log('mounted-reactiv.ly');

    // first thing to do when mounted is send current url to API
    const url = originUrl();
    // getRequest(`${process.env.REACT_APP_API_URL}/room`)
    //   .then((data) => console.log(data))
    //   .catch((err) => console.error(err))

    socket.on('connect', (sock) => {
      console.log('connected');

      socket.emit('presenter', {
        url,
      });

      socket.on('assignroom', ({ room }) => {
        this.setState({ room });
      });

    });

    // if we get an emoji - show it
    socket.on("react", (data) => {
      this.pushInteraction(data);
    });

    // if we get an question - show it
    socket.on("question", (data) => {
      this.pushQuestion(data);
    });
  }

  pushInteraction(data) {
    console.log(data);
    const {
      interactions
    } = this.state;

    const emoji = get(data, 'emoji');

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
    }, 8000);
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
    }, 30000);
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
    const {
      room
    } = this.state;

    return (
      <div className="ReacivlyApp-wrapper">
        <div className="ReacivlyApp-banner">
          Visit
          {' '}
          {process.env.REACT_APP_SPA_URL}
          /{room}
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
