import React, {Component} from 'react';
import {Toolbar, NavItem} from 'rebass';
import {HashRouter, Match, Miss, Link} from 'react-router'

import Reference from './components/Reference';
import Calculator from './components/Calculator';
import './App.css';

export default class App extends Component {
  render() {
    return (
      <HashRouter>
        <div className="App">
          <Toolbar>
            <NavItem is={Link} to="/reference">Reference</NavItem>
            <NavItem is={Link} to="/calculator">Calculator</NavItem>
          </Toolbar>
          <Match pattern="/reference/:heroName" component={Reference} />
          <Match pattern="/calculator" component={Calculator} />
          <Miss component={Reference} />
        </div>
      </HashRouter>
    );
  }
}
