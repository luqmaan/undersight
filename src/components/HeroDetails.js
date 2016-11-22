import React, {Component} from 'react';
import {Card, CardImage, Heading, Text} from 'rebass';
import {Redirect} from 'react-router'

import heros from '../data/heros';
import counters from '../data/counters';
import {getHero, getHeroCounters} from '../lib/undersight';
import HeroIcon from './HeroIcon';

export default function HeroDetails({heroName}) {
  const hero = getHero(heros, heroName);
  const heroCounters = getHeroCounters(counters, heroName);
  return (
    <div className="HeroDetails">
        <HeroIcon name={hero.name} hideName />
        <div className="Instructions"></div>
        <div>
          <Heading size={3}>Counters to {heroName}</Heading>
          <div className="Counters">
            {heroCounters.filter(counter => counter.score === -2).map((counter) => (
              <div key={counter.enemy} className="Counter">
                <HeroIcon
                  name={counter.enemy}
                  onClick={() => <Redirect to={`/reference/${counter.enemy}`} />}
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <Heading size={3}>{heroName} is a counter to</Heading>
          <div className="Counters">
            {heroCounters.filter(counter => counter.score === 2).map((counter) => (
              <div key={counter.enemy} className="Counter">
                <HeroIcon
                  name={counter.enemy}
                  onClick={() => <Redirect to={`/reference/${counter.enemy}`} />}
                />
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
