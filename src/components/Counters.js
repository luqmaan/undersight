import React, {Component} from 'react';
import findIndex from 'lodash/findIndex';
import isNil from 'lodash/isNil';
import compact from 'lodash/compact';
import debounce from 'lodash/debounce';

import heros from '../data/heros.json';
import counters from '../data/counters.json';
import {
  getTopScores,
  getAllRolePicks,
} from '../lib/undersight';
import './Counters.css';

import HeroIcon from './HeroIcon';
import ResultsContainer from './ResultsContainer';

export default class Counters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enemyPicks: new Array(6),
      scores: [],
      rolePicks: null,
      isLoading: true,
    };
  }

  addPick = (pick) => {
    const enemyPicks = [...this.state.enemyPicks];
    const emptyIndex = findIndex(enemyPicks, isNil);
    if (emptyIndex === -1) {
      return;
    }
    enemyPicks[emptyIndex] = pick;
    this.setState({enemyPicks}, () => this.recompute(enemyPicks));
  }

  removePickAtIndex = (index) => {
    const enemyPicks = [...this.state.enemyPicks];
    delete enemyPicks[index];
    this.setState({enemyPicks}, () => this.recompute(enemyPicks));
  }

  recompute = () => {
    this.setState({isLoading: true}, () => this.recomputeInner());
  }

  recomputeInner = debounce(() => {
    const nonEmptyPicks = compact(this.state.enemyPicks);

    if (nonEmptyPicks.length === 0) {
      this.setState({
        scores: [],
        rolePicks: null,
        isLoading: false,
      });
      return;
    }

    const scores = getTopScores(counters, nonEmptyPicks);
    const rolePicks = getAllRolePicks(counters, nonEmptyPicks, heros);
    this.setState({scores, rolePicks, isLoading: false});
  }, 500);

  render() {
    return (
      <div className="Counters">
        <div className="HeroPicker">
          {heros.map((hero) => <HeroIcon name={hero.name} key={hero.name} onClick={() => this.addPick(hero.name)} />)}
        </div>
        <div className="EnemyTeamWrapper">
          <div className="EnemyTeam">
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const name = this.state.enemyPicks[i];
              return <HeroIcon name={name} key={i} onClick={() => this.removePickAtIndex(i)} />;
            })}
          </div>
        </div>
        <ResultsContainer scores={this.state.scores} rolePicks={this.state.rolePicks} />
      </div>
    );
  }
}
