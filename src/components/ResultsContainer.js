import React, {Component} from 'react';
import shallowCompare from 'react-addons-shallow-compare'

import HeroIcon from './HeroIcon';
import Results from './Results';

import findIndex from 'lodash/findIndex';
import findLastIndex from 'lodash/findLastIndex';
import fp from 'lodash/fp';
import take from 'lodash/take';
import takeRight from 'lodash/takeRight';
import head from 'lodash/head';
import dropWhile from 'lodash/dropWhile';
import isNil from 'lodash/isNil';
import compact from 'lodash/compact';
import debounce from 'lodash/debounce';

import heros from '../data/heros.json';
import counters from '../data/counters.json';
import {
  getTopScores,
  getAllRolePicks,
  getHero,
  isSupport,
} from '../lib/undersight';

export default class ResultsContainer extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate = shallowCompare(this, nextProps, nextState)
    console.log('shouldUpdate?', shouldUpdate)
    return shouldUpdate;
  }
  render() {
    const {scores, rolePicks} = this.props;

    console.log('render')

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
