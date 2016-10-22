import React from 'react';
import ReactDOM from 'react-dom';
import Counters from './Counters';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Counters />, div);
});
