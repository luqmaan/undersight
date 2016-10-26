import React, {Component} from 'react';
import {Card, CardImage, Heading, Text} from 'rebass';

import heros from '../data/heros';
import counters from '../data/counters';
import {getHero, getHeroCounters} from '../lib/undersight';
import HeroIcon from './HeroIcon';

export default function HeroDetails({heroName}) {
  const hero = getHero(heros, heroName);
  return (
    <div className="HeroDetails">
        <HeroIcon name={hero.name} hideName />
        <Heading size={3}>{hero.name}</Heading>
        <Heading size={6}>{hero.role}</Heading>
        <div className="Instructions">
        {`Genjis power and survivability stems entirely from mobility.
He needs to keep chaining eliminations and dashes to stay relevant.
Winston is a good choice to counter him because he has enough health to survive anything Genji might do to him quickly and his lightning gun can keep applying pressure no matter how fast Genji moves.
Mei has an even better time, because she can freeze herself to dodge the worst of Genji's burst damage capability before freezing him to bring his killing spree to a close.`}
        </div>
        <div>
          {getHeroCounters(counters, heroName).map((counter) => (
            <div key={counter.enemy} className="Counter">
              <HeroIcon name={counter.enemy} />
              <div className="Score">{counter.score}</div>
            </div>
          ))}
        </div>
    </div>
  );
}
