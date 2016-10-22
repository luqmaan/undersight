import React from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';

import App from './App';
import './index.css';

FastClick.attach(document.body);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
