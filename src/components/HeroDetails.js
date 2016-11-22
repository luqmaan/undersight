import React, {Component} from 'react';
import {Card, CardImage, Heading, Text} from 'rebass';
import {Redirect} from 'react-router'
import sortBy from 'lodash/sortBy';

import heros from '../data/heros';
import counters from '../data/counters';
import {getHero, getCounterTo, getCounteredBy} from '../lib/undersight';
import HeroIcon from './HeroIcon';


export default function HeroDetails({heroName}) {
  const hero = getHero(heros, heroName);
  const counterTo = getCounterTo(counters, heroName).filter(counter => counter.score === 2);
  const counteredBy = getCounteredBy(counters, heroName).filter(counter => counter.score === 2);

  return (
    <div>
      <HeroIcon name={hero.name} huge />
      <div className="HeroDetails">
          <div className="Instructions"></div>
          <div>
            <div className="Title">{heroName} is countered by</div>
            <div className="Counters">
              {counteredBy.map((counter) => (
                <div key={counter.you} className="Counter">
                  <HeroIcon
                    name={counter.you}
                    onClick={() => window.location.hash = `/reference/${counter.you}`}
                  />
                </div>
              ))}
              {counteredBy.length === 0 && "Nobody"}
            </div>
          </div>
          <div>
            <div className="Title">{heroName} is a counter to</div>
              <div className="Counters">
                {counterTo.map((counter) => (
                  <div key={counter.enemy} className="Counter">
                    <HeroIcon
                      name={counter.enemy}
                      onClick={() => window.location.hash = `/reference/${counter.enemy}`}
                    />
                  </div>
                ))}
                {counterTo.length === 0 && "Nobody"}
              </div>
          </div>
      </div>
    </div>
  );
}
