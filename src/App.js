import React, {Component} from 'react';
import {Toolbar, NavItem} from 'rebass';
import {HashRouter, Match, Miss, Link, Redirect} from 'react-router'

import Reference from './components/Reference';
import Calculator from './components/Calculator';
import './App.css';

const BottombarLink = ({isActive, label, href}) => (
  <a href={href} className={isActive ? 'active' : ''}>{label}</a>
);

export default class App extends Component {
  render() {
    return (
      <HashRouter>
        <div className="App">
          <Match pattern="/reference" component={Reference} exactly />
          <Match pattern="/reference/:heroName" component={Reference} exactly />
          <Match pattern="/calculator" component={Calculator} />
          <Miss component={() => <Redirect to="/calculator" />} />
          <div className="Bottombar">
            <Link to="/calculator">{(props) => <BottombarLink label="Calculator" {...props} />}</Link>
            <Link to="/reference">{(props) => <BottombarLink label="Reference" {...props} />}</Link>
          </div>
        </div>
      </HashRouter>
    );
  }
}
