import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';
import findIndex from 'lodash/findIndex';
import range from 'lodash/range';
import isNil from 'lodash/isNil';
import compact from 'lodash/compact';
import debounce from 'lodash/debounce';

import counters from '../../data/counters.json';
import heros from '../../data/heros.json';
import herosRanks from '../../data/heros_ranks.json';
import {
  getTopScores,
  getTeamPicksByHardCounter,
  getTeamPicksByHardCounterPrime,
  getTeamPicksByHardCounterFlexRoles,
} from '../../lib/undersight';
import './Calculator.css';

import HeroIcon from '../HeroIcon';
import ResultsContainer from './ResultsContainer';


export default class TeamPicker extends Component {
  static propTypes = {
    team: PropTypes.array,
    onChange: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      showPickerModal: false,
    };
  }

  addPick = (pick) => {
    const team = [...this.props.team];
    const emptyIndex = findIndex(team, isNil);
    if (emptyIndex === -1) {
      return;
    }
    team[emptyIndex] = pick;

    this.setState({showPickerModal: false});
    this.props.onChange(team);
  }

  removePickAtIndex = (index) => {
    if (!this.props.team[index]) {
      this.setState({showPickerModal: true});
      return;
    }

    const team = [...this.props.team];
    delete team[index];

    this.props.onChange(team);
  }

  renderPickerModal() {
    return (
      <div className="Modal">
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
    );
  }

  render() {
    return (
      <div>
        <div className="SectionTitle">{this.props.title}</div>
        <div className="EnemyTeam">
          {range(6).map((i) => {
            const name = this.props.team[i];
            return <HeroIcon name={name} key={i} onClick={() => this.removePickAtIndex(i)} />;
          })}
        </div>
        {this.state.showPickerModal && this.renderPickerModal()}
      </div>
    );
  }
}
