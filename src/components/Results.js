import React from 'react';
import HeroIcon from './HeroIcon';

export default function Results({scores, title}) {
  return (
    <div className="Results">
      <div className="Title">{title}</div>
      <div className="List">
        {scores.map((score) => {
          return (
            <div key={score.name} className="Counter">
              <HeroIcon name={score.name} />
              <div className="Score">{score.score}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
