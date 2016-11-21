import React, {Component} from 'react';
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
        title: 'Counters based on enemy team',
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
      {
        title: 'Counters based on your team',
        description: (
          <div className="Description">
            <div className="Overview">Input: Your Team, Output: Your Team</div>
            <div className="Details">
              <p>This recommends heros that counter the widest variety of enemies. Use this before a match starts.</p>
              <p>A higher score is better.</p>
            </div>
          </div>
        ),
        scores: getTeamPicksByHardCounter(counters, heros, nonEmptyPicks),
      },
      {
        title: 'Counters based on your team + Missing Roles + Master Overwatch Stats',
        description: (
          <div className="Description">
            <div className="Overview">Input: Your Team, Output: Your Team</div>
            <div className="Details">
              <p>This recommends heros that counter widest variety of enemies. It also considers stats (popularity, KD ratio) from <a href="http://masteroverwatch.com/heroes/pc/global/mode/ranked" target="_blank">Master Overwatch</a> and the missing roles on your team. Use this before a match starts.</p>
              <p>A higher score is better.</p>
            </div>
          </div>
        ),
        scores: getTeamPicksByHardCounterPrime(counters, heros, herosRanks, nonEmptyPicks),
      },
      {
        title: 'Counters based on your team + Flexible Missing Roles (3 Tank, 3 DPS) + Master Overwatch Stats',
        description: (
          <div className="Description">
            <div className="Overview">Input: Your Team, Output: Your Team</div>
            <div className="Details">
              <p>This recommends heros that counter widest variety of enemies. It also considers stats (popularity, KD ratio) from <a href="http://masteroverwatch.com/heroes/pc/global/mode/ranked" target="_blank">Master Overwatch</a> and the missing roles on your team. Assumes you want 3 tanks and 3 DPS heroes. Use this before a match starts.</p>
              <p>A higher score is better.</p>
            </div>
          </div>
        ),
        scores: getTeamPicksByHardCounterFlexRoles(counters, heros, herosRanks, nonEmptyPicks, {tank: 3, dps: 3, support: 0}),
      },
      {
        title: 'Counters based on your team + Flexible Missing Roles (2 Tank, 2 DPS, 2 Support) + Master Overwatch Stats',
        description: (
          <div className="Description">
            <div className="Overview">Input: Your Team, Output: Your Team</div>
            <div className="Details">
              <p>This recommends heros that counter widest variety of enemies. It also considers stats (popularity, KD ratio) from <a href="http://masteroverwatch.com/heroes/pc/global/mode/ranked" target="_blank">Master Overwatch</a> and the missing roles on your team. Assumes you want 2 tanks, 2 supports, and 3 DPS heroes. Use this before a match starts.</p>
              <p>A higher score is better.</p>
            </div>
          </div>
        ),
        scores: getTeamPicksByHardCounterFlexRoles(counters, heros, herosRanks, nonEmptyPicks, {tank: 2, dps: 2, support: 2}),
      },
    ];

    this.setState({algorithms, isLoading: false});
  }, 500);

  renderPicker() {
    return (
      <div>
        <div className="Section">
          <div className="SectionTitle">
            Enemy Team
          </div>
          <div className="EnemyTeam">
            {range(6).map((i) => {
              const name = this.state.enemyPicks[i];
              return <HeroIcon name={name} key={i} onClick={() => this.removePickAtIndex(i)} />;
            })}
          </div>
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
          >Results</button>
        )}
      </div>
    );
  }

  renderResults() {
    return (
      <div>
        {this.state.algorithms.map((algorithm) => (
          <div key={algorithm.title} className="Algorithm">
            <div className="Title">{algorithm.title}</div>
            {algorithm.description}
            <ResultsContainer title={algorithm.title} scores={algorithm.scores} />
          </div>
        ))}
      </div>
    );
  }

  render() {
    return (
      <div className="Calculator">
        {this.state.showResults
          ? this.renderResults()
          : this.renderPicker()
        }
      </div>
    );
  }
}
