import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare'
import take from 'lodash/take';
import head from 'lodash/head';
import groupBy from 'lodash/groupBy';
import compact from 'lodash/compact';

import './ResultsContainer.css';
import Results from './Results';

import counters from '../data/counters.json';
import heros from '../data/heros.json';
import herosRanks from '../data/heros_ranks.json';

import {isSupport, getRole, getTopScores, getTeamPicksByHardCounterFlexRoles} from '../lib/undersight';

export default class ResultsContainer extends Component {
  static propTypes = {
    enemyTeam: PropTypes.array,
    yourTeam: PropTypes.array,
  }

  constructor(props) {
    super(props);

    this.state = {
      algorithms: [],
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate = shallowCompare(this, nextProps, nextState)
    return shouldUpdate;
  }

  componentWillMount() {
    this.recompute();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.enemyTeam !== this.props.enemyTeam) {
      this.recompute();
    }
  }

  recompute = () => {
    let algorithms = [];

    if (compact(this.props.enemyTeam).length > 0) {
      algorithms = [
        ...algorithms,
        {
          title: 'Who counters the enemy team?',
          scores: getTopScores(counters, compact(this.props.enemyTeam)),
        },
      ];
    }

    if (compact(this.props.yourTeam).length > 0) {
      algorithms = [
        ...algorithms,
        {
          title: 'Whats missing from your team?',
          scores: getTeamPicksByHardCounterFlexRoles(counters, heros, herosRanks, compact(this.props.yourTeam), {tank: 2, dps: 2, support: 2}),
        },
      ];
    }

    this.setState({algorithms});
  }

  render() {
    return (
      <div className="ResultsContaine9r">
        {this.state.algorithms.map(({scores, title}) => (
          <div key={title} className="Algorithm">
            <div className="ResultsTitle">{title}</div>
            <div className="ResultsGrid">
              {scores.length > 0 && (
                <Results title="Use" scores={take(scores, 7)} />
              )}
              {scores.length > 0 && (
                <Results
                  title="Avoid"
                  scores={take(scores.reverse().filter((score) => !isSupport(heros, score.name)), 7)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
}
