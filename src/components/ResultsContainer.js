import React, {Component} from 'react';
import shallowCompare from 'react-addons-shallow-compare'

import './ResultsContainer.css';
import Results from './Results';

import take from 'lodash/take';
import head from 'lodash/head';
import groupBy from 'lodash/groupBy';

import heros from '../data/heros.json';
import {isSupport, getRole} from '../lib/undersight';

export default class ResultsContainer extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate = shallowCompare(this, nextProps, nextState)
    return shouldUpdate;
  }

  render() {
    const {scores} = this.props;

    const rolePicks = groupBy(
      scores.map((score) => ({...score, role: getRole(heros, score.name)})),
      'role'
    );

    return (
      <div className="ResultsContainer">
        <div className="ResultsTitle">{this.props.title}</div>
        <div className="ResultsGrid">
          {scores.length > 0 && (
            <Results title="Use" scores={take(scores, 6)} />
          )}
          {scores.length > 0 && (
            <Results
              title="Avoid"
              scores={take(scores.reverse().filter((score) => !isSupport(heros, score.name)), 6)}
            />
          )}
          {rolePicks && (
            <Results title="By Role" scores={[
                head(rolePicks.Offense),
                head(rolePicks.Defense),
                head(rolePicks.Tank),
                head(rolePicks.Support),
              ]}
            />
          )}
        </div>
      </div>
    );
  }
}
