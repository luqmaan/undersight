import React from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';

import Counters from './Counters';
import './index.css';

FastClick.attach(document.body);

ReactDOM.render(
  <Counters />,
  document.getElementById('root')
);
