import React, {Component} from 'react';
import classnames from 'classnames';
import findIndex from 'lodash/findIndex';
import range from 'lodash/range';
import isNil from 'lodash/isNil';
import compact from 'lodash/compact';
import debounce from 'lodash/debounce';

import counters from '../data/counters.json';
import heros from '../data/heros.json';
import herosRanks from '../data/heros_ranks.json';
import {
  getTopScores,
  getTeamPicksByHardCounter,
  getTeamPicksByHardCounterPrime,
  getTeamPicksByHardCounterFlexRoles,
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
      showResults: false,
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

  clearAllPicks = () => {
    this.setState({
      enemyPicks: new Array(6),
    })
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
        title: 'Who counters the enemy team?',
        description: (
          <div className="Description">
            <div className="Overview">Input: Enemy Team, Output: Your Team</div>
            <div className="Details">
              <p>This recommends heros that counter the most number of enemies. Use this when you know what the enemy team looks like.</p>
              <p>A higher score is better. A negative score means you should avoid this hero, as the enemy team counters them very well.</p>
            </div>
          </div>
        ),
        scores: getTopScores(counters, nonEmptyPicks),
      },
    ];

    this.setState({algorithms, isLoading: false});
  }, 500);


  renderEnemyTeam() {
    return (
      <div className="EnemyTeam">
        {range(6).map((i) => {
          const name = this.state.enemyPicks[i];
          return <HeroIcon name={name} key={i} onClick={() => this.removePickAtIndex(i)} />;
        })}
      </div>
    );
  }

  renderPicker() {
    return (
      <div>
        <div className="Section">
          {this.renderEnemyTeam()}
        </div>
        <div className="Section">
          <div className="SectionTitle">
            Add To Enemy Team
          </div>
          <div className="HeroPicker">
            <div className="Role">
              <div className="Label">Offense</div>
              <div className="Icons">
                {heros.filter((hero) => hero.role === 'Offense').map((hero) => (
                  <HeroIcon name={hero.name} key={hero.name} onClick={() => this.addPick(hero.name)} />
                ))}
              </div>
            </div>
            <div className="Role">
              <div className="Label">Defense</div>
              <div className="Icons">
                {heros.filter((hero) => hero.role === 'Defense').map((hero) => (
                  <HeroIcon name={hero.name} key={hero.name} onClick={() => this.addPick(hero.name)} />
                ))}
              </div>
            </div>
            <div className="Role">
              <div className="Label">Tank</div>
              <div className="Icons">
                {heros.filter((hero) => hero.role === 'Tank').map((hero) => (
                  <HeroIcon name={hero.name} key={hero.name} onClick={() => this.addPick(hero.name)} />
                ))}
              </div>
            </div>
            <div className="Role">
              <div className="Label">Support</div>
              <div className="Icons">
                {heros.filter((hero) => hero.role === 'Support').map((hero) => (
                  <HeroIcon name={hero.name} key={hero.name} onClick={() => this.addPick(hero.name)} />
                ))}
              </div>
            </div>
          </div>
        </div>
        {compact(this.state.enemyPicks).length > 0 && (
          <button
            className="NextButton"
            onClick={() => this.setState({showResults: !this.state.showResults})}
          >Calculate</button>
        )}
      </div>
    );
  }

  renderResults() {
    return (
      <div>
        {this.renderEnemyTeam()}
        {this.state.algorithms.map((algorithm) => (
          <div key={algorithm.title} className="Algorithm">
            <ResultsContainer title={algorithm.title} scores={algorithm.scores} />
          </div>
        ))}
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="Topbar">
          <div className="Action Left">
            {!this.state.showResults && (compact(this.state.enemyPicks).length > 0) && (
              <button className="Red" onClick={() => this.clearAllPicks()}>
                Clear All
              </button>
            )}
            {this.state.showResults && (
              <button onClick={() => this.setState({showResults: false})}>
                Edit Team
              </button>
            )}
          </div>
          <div className="Action Center">
            {!this.state.showResults && 'Enemy Team'}
            {this.state.showResults && 'Results'}
          </div>
          <div className="Action Right">
            {!this.state.showResults && (compact(this.state.enemyPicks).length > 0) && (
              <button onClick={() => this.setState({showResults: !this.state.showResults})}>
                Calculate
              </button>
            )}
          </div>
      </div>

        <div className="Calculator">
          {this.state.showResults
            ? this.renderResults()
            : this.renderPicker()
          }
        </div>
      </div>
    );
  }
}
