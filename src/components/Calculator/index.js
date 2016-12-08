import React, {Component} from 'react';
import classnames from 'classnames';
import findIndex from 'lodash/findIndex';
import range from 'lodash/range';
import isNil from 'lodash/isNil';
import compact from 'lodash/compact';
import debounce from 'lodash/debounce';

import counters from '../../data/counters.json';
import heros from '../../data/heros.json';
import herosRanks from '../../data/heros_ranks.json';

import './Calculator.css';

import HeroIcon from '../HeroIcon';
import ResultsContainer from './ResultsContainer';

import TeamPicker from './TeamPicker';

export default class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enemyTeam: new Array(6),
      yourTeam: new Array(6),
      showResults: false,
      showPickerModal: false,
      enemyTeam: ['Reaper', 'Tracer', 'Pharah', 'Winston', null, null],
      showResults: true,
    };
  }

  clearAllPicks = () => {
    this.setState({
      enemyTeam: new Array(6),
      yourTeam: new Array(6),
    })
  }

  renderPicker() {
    const hasPicks = compact(this.state.enemyTeam).length > 0 || compact(this.state.yourTeam).length > 0;
    return (
      <div>
        <div className="Section">
          <TeamPicker
            title="Enemy Team"
            team={this.state.enemyTeam}
            onChange={(team) => this.setState({enemyTeam: team})}
          />
          <TeamPicker
            title="Your Team"
            team={this.state.yourTeam}
            onChange={(team) => this.setState({yourTeam: team})}
          />
        </div>
        {hasPicks && (
          <button
            className="NextButton"
            onClick={() => this.setState({showResults: !this.state.showResults})}
          >Calculate</button>
        )}
      </div>
    );
  }

  render() {
    const hasPicks = compact(this.state.enemyTeam).length > 0 || compact(this.state.yourTeam).length > 0;

    return (
      <div>
        <div className="Topbar">
          <div className="Action Left">
            {!this.state.showResults && hasPicks && (
              <button className="Red" onClick={() => this.clearAllPicks()}>
                Clear All
              </button>
            )}
            {this.state.showResults && (
              <button onClick={() => this.setState({showResults: false})}>
                Edit Teams
              </button>
            )}
          </div>
          <div className="Action Center">
            {!this.state.showResults && 'Enter Teams'}
            {this.state.showResults && 'Results'}
          </div>
          <div className="Action Right">
            {!this.state.showResults && hasPicks && (
              <button onClick={() => this.setState({showResults: !this.state.showResults})}>
                Calculate
              </button>
            )}
          </div>
      </div>

        <div className="Calculator">
          {this.state.showResults
            ? <ResultsContainer enemyTeam={this.state.enemyTeam} yourTeam={this.state.yourTeam} />
            : this.renderPicker()
          }
        </div>
      </div>
    );
  }
}
