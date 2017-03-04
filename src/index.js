import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

var root = document.createElement('div');
root.setAttribute('id', 'root');
document.body.appendChild(root);
console.log('asdfasdf')
ReactDOM.render(
  <App />,
  root
);
