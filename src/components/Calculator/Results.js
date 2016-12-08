import React from 'react';
import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';

import {getHero} from '../../lib/undersight';
import heros from '../../data/heros.json';
import HeroIcon from '../HeroIcon';

export default function Results({scores, title}) {
  const minScore = minBy(scores, 'score').score;
  const maxScore = maxBy(scores, 'score').score;

  return (
    <div className="Results">
      <div className="Title">{title}</div>
      <div className="List" style={{
        padding: '10px',
      }}>
        {scores.map((score) => {
          const hero = getHero(heros, score.name);
          const width = score.score >= 0 ? score.score / maxScore : score.score / minScore;
          return (
            <div key={score.name} style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '4px',
            }}>
              <div style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                marginRight: '10px',
              }}>{score.name}</div>
              <div style={{
                flex: 1,
              }}>
                <div style={{
                  width: '200px',
                  height: '100%',
                  background: '#ddd',
                  display: 'flex',
                  justifyContent: score.score >= 0 ? 'flex-start' : 'flex-end',
                }}>
                  <div style={{
                    background: score.score >= 0 ? 'rgba(82, 101, 198, 1)' : 'rgba(237, 121, 160, 1)',
                    width: `${width * 50}%`,
                    height: '100%',
                    marginLeft: score.score >= 0 ? '100px' : 0,
                    marginRight: score.score >= 0 ? 0 : '100px',
                  }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
