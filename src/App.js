import React, {Component} from 'react';
import {Toolbar, NavItem, Space} from 'rebass';
import classNames from 'classnames';
import Icon from 'react-geomicons';

import findIndex from 'lodash/findIndex';
import findLastIndex from 'lodash/findLastIndex';
import fp from 'lodash/fp';
import take from 'lodash/take';
import takeRight from 'lodash/takeRight';

import heros from './data/heros.json';
import counters from './data/counters.json';
import {
  getTopScores,
  getAllRolePicks,
  getHero,
} from './lib/undersight';
import './App.css';

import HeroIcon from './components/HeroIcon';
import Results from './components/Results';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enemyPicks: [],
      scores: [],
      rolePicks: null,
    };
  }

  componentDidMount() {
    // this.setState({enemyPicks: ['Hanzo', 'Soldier: 76', 'Zarya']}, () => this.removePick('Zarya'));
  }

  addPick = (pick) => {
    if (this.state.enemyPicks.length > 5) {
      return;
    }
    const enemyPicks = [...this.state.enemyPicks, pick];
    this.setState({enemyPicks}, () => this.recompute(enemyPicks));
  }

  removePick = (pick) => {
    const enemyPicks = fp.pullAt(this.state.enemyPicks.lastIndexOf(pick))(this.state.enemyPicks);
    this.setState({enemyPicks}, () => this.recompute(enemyPicks));
  }

  recompute() {
    if (this.state.enemyPicks.length === 0) {
      this.setState({
        scores: [],
        rolePicks: null,
      });
      return;
    }

    const scores = getTopScores(counters, this.state.enemyPicks);
    this.setState({scores});

    const rolePicks = getAllRolePicks(counters, this.state.enemyPicks, heros);
    this.setState({rolePicks});
  }

  render() {
    return (
      <div className="App">
        <div className="EnemyTeamWrapper">
          <div className="EnemyTeam">
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const name = this.state.enemyPicks[i];
              return <HeroIcon name={name} key={i} onClick={() => this.removePick(name)} />;
            })}
          </div>
        </div>
        <div className="HeroPicker">
          {heros.map((hero) => <HeroIcon name={hero.name} key={hero.name} onClick={() => this.addPick(hero.name)} />)}
        </div>
        <div className="ResultsContainer">
          {this.state.scores.length > 0 && (
            <Results title="Top Counters" scores={take(this.state.scores, 6)} />
          )}
          {this.state.rolePicks && (
            <Results title="By Role" scores={[
                this.state.rolePicks.Offense,
                this.state.rolePicks.Defense,
                this.state.rolePicks.Tank,
                this.state.rolePicks.Support,
              ]}
            />
          )}
        </div>
      </div>
    );
  }
}
