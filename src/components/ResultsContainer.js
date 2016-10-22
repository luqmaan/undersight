import React, {Component} from 'react';
import shallowCompare from 'react-addons-shallow-compare'

import Results from './Results';

import take from 'lodash/take';
import head from 'lodash/head';

import heros from '../data/heros.json';
import {isSupport} from '../lib/undersight';

export default class ResultsContainer extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate = shallowCompare(this, nextProps, nextState)
    return shouldUpdate;
  }

  render() {
    const {scores, rolePicks} = this.props;

    return (
      <div className="ResultsContainer">
        {scores.length > 0 && (
          <Results title="Top Counters" scores={take(scores, 6)} />
        )}
        {scores.length > 0 && (
          <Results
            title="Bottom Counters"
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
    );
  }
}
