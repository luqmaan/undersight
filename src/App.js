import React, {Component} from 'react';
import {Toolbar, NavItem, Space} from 'rebass';
import classNames from 'classnames';
import Icon from 'react-geomicons';

import heros from './data/heros.json';
import counters from './data/counters.json';
import {
  getTopScores,
  getTopFour,
  getAllRolePicks,
  getHero,
} from './lib/undersight';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enemyPicks: [],
      topFourPicks: [],
      rolePicks: null,
    };
  }

  componentDidMount() {
    this.setState({enemyPicks: ['Hanzo', 'Soldier: 76']}, () => this.addPick('Zarya'));
  }

  addPick = (pick) => {
    let enemyPicks = [...this.state.enemyPicks, pick];
    this.setState({enemyPicks});
    const topFourPicks = getTopFour(counters, enemyPicks);
    this.setState({topFourPicks});
    const rolePicks = getAllRolePicks(counters, enemyPicks, heros);
    this.setState({rolePicks});
  }

  render() {
    return (
      <div className="App">
        <div className="EnemyTeamWrapper">
          <div className="EnemyTeam">
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const name = this.state.enemyPicks[i];
              const hero = name ? getHero(heros, name) : null;
              return (
                <div key={i} className={classNames("HeroIcon", {'Missing': !hero})}>
                  <div className="HeroIconImage">
                    {hero && <img src={`heros/${hero.icon}`} />}
                  </div>
                  <div className="HeroIconName">
                    {hero ? name : 'Choose'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="HeroPicker">
          {heros.map((hero) => (
            <button key={hero.name} className="Hero" onClick={() => this.addPick(hero.name)}>
              {hero.name}
            </button>
          ))}
        </div>
        <div className="TopThree">
          <h3>Top Four Counters</h3>
          {this.state.topFourPicks.map((counter) => {
            return (
              <div key={counter.name}><strong>{counter.name}</strong> Score: {counter.score}</div>
            )
          })}
        </div>
        {this.state.rolePicks && (
          <div className="TopThree">
            <h3>By Role</h3>
            <div>Offense: {this.state.rolePicks.Offense.name} {this.state.rolePicks.Offense.score}</div>
            <div>Defense: {this.state.rolePicks.Defense.name} {this.state.rolePicks.Defense.score}</div>
            <div>Tank: {this.state.rolePicks.Tank.name} {this.state.rolePicks.Tank.score}</div>
            <div>Support: {this.state.rolePicks.Support.name} {this.state.rolePicks.Support.score}</div>
          </div>
        )}
      </div>
    );
  }
}
