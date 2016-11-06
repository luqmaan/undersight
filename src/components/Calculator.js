import React, {Component} from 'react';
import findIndex from 'lodash/findIndex';
import range from 'lodash/range';
import isNil from 'lodash/isNil';
import compact from 'lodash/compact';
import debounce from 'lodash/debounce';

import heros from '../data/heros.json';
import counters from '../data/counters.json';
import {
  getTopScores,
  getAllRolePicks,
} from '../lib/undersight';
import './Calculator.css';

import HeroIcon from './HeroIcon';
import ResultsContainer from './ResultsContainer';

export default class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enemyPicks: new Array(6),
      algorithms: [],
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
      this.setState({algorithms: [], isLoading: false});
      return;
    }

    const algorithms = [
      {
        title: 'Sum of all scores',
        description: 'Sum of counters....',
        scores: getTopScores(counters, nonEmptyPicks),
      }
    ];

    this.setState({algorithms, isLoading: false});
  }, 500);

  render() {
    return (
      <div className="Calculator">
        <div className="HeroPicker">
          {heros.map((hero) => <HeroIcon name={hero.name} key={hero.name} onClick={() => this.addPick(hero.name)} />)}
        </div>
        <div className="EnemyTeamWrapper">
          <div className="EnemyTeam">
            {range(6).map((i) => {
              const name = this.state.enemyPicks[i];
              return <HeroIcon name={name} key={i} onClick={() => this.removePickAtIndex(i)} />;
            })}
          </div>
        </div>
        {this.state.algorithms.map((algorithm) => (
          <div key={algorithm.title}>
            <h1>{algorithm.title}</h1>
            <div>{algorithm.description}</div>
            <ResultsContainer title={algorithm.title} scores={algorithm.scores} />
          </div>
        ))}
      </div>
    );
  }
}
