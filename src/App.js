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

function HeroIcon({name, onClick}) {
  const hero = name ? getHero(heros, name) : null;

  return (
    <div className={classNames("HeroIcon", {'Missing': !hero})} onClick={onClick}>
      <div className="HeroIconImage">
        {hero && <img src={`heros/${hero.icon}`} />}
      </div>
      <div className="HeroIconName">
        {hero ? hero.name : 'Choose'}
      </div>
    </div>
  );
}

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
    // this.setState({enemyPicks: ['Hanzo', 'Soldier: 76']}, () => this.addPick('Zarya'));
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
              return <HeroIcon name={name} key={i} />;
            })}
          </div>
        </div>
        <div className="HeroPicker">
          {heros.map((hero) => <HeroIcon name={hero.name} key={hero.name} onClick={() => this.addPick(hero.name)} />)}
        </div>
        <div className="ResultsContainer">
          {this.state.topFourPicks.length > 0 && (
            <div className="Results">
              <div className="Title">Top Counters</div>
              <div className="Counters">
                {this.state.topFourPicks.map((counter) => {
                  return (
                    <div key={counter.name} className="Counter">
                      <HeroIcon name={counter.name} />
                      <div className="Score">{counter.score}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          {this.state.rolePicks && (
            <div className="Results">
              <div className="Title">By Role</div>
              <div className="Counters">
                <div className="Counter">
                  <HeroIcon name={this.state.rolePicks.Offense.name} />
                  <div className="Score">{this.state.rolePicks.Offense.score}</div>
                </div>
                <div className="Counter">
                  <HeroIcon name={this.state.rolePicks.Defense.name} />
                  <div className="Score">{this.state.rolePicks.Defense.score}</div>
                </div>
                <div className="Counter">
                  <HeroIcon name={this.state.rolePicks.Tank.name} />
                  <div className="Score">{this.state.rolePicks.Tank.score}</div>
                </div>
                <div className="Counter">
                  <HeroIcon name={this.state.rolePicks.Support.name} />
                  <div className="Score">{this.state.rolePicks.Support.score}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
