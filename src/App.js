import React, {Component} from 'react';
import {Toolbar, NavItem, Space} from 'rebass';
import classNames from 'classnames';

import Counters from './Counters';
export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Counters />
      </div>
    );
  }
}
