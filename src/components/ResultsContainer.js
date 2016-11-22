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

import {isSupport, getRole, getTopScores} from '../lib/undersight';

export default class ResultsContainer extends Component {
  static propTypes = {
    enemyPicks: PropTypes.array,
    teamPicks: PropTypes.array,
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
    if (nextProps.enemyPicks !== this.props.enemyPicks) {
      this.recompute();
    }
  }

  recompute = () => {
    const nonEmptyPicks = compact(this.props.enemyPicks);

    if (nonEmptyPicks.length === 0) {
      this.setState({algorithms: []});
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

    this.setState({algorithms});
  }

  render() {
    return (
      <div className="ResultsContainer">
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
