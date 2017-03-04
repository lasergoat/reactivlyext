import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const rootName = 'reactivly334422331122__1';

// since this is a chrome extension it gets injected into the page
// so, we need to make a new element for our app to live in
// however, we need to remove an existing instance if they click it again
const existingRoot = document.getElementById(rootName);

const add = () => {
  const root = document.createElement('div');
  root.setAttribute('id', rootName);
  document.body.appendChild(root);

  ReactDOM.render(
    <App />,
    root
  );
}

if (existingRoot) {
  document.body.removeChild(existingRoot);
}

add();
