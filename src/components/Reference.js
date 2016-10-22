import React, {Component} from 'react';
import Icon from 'react-geomicons';
import {ButtonCircle, Stat} from 'rebass';
import {Link} from 'react-router';

import heros from '../data/heros';

import HeroIcon from './HeroIcon';
import HeroDetails from './HeroDetails';
import'./Reference.css';

function HeroList() {
  return (
    <div className="HeroList">
    {heros.map((hero) => (
        <Link to={`/reference/${hero.name}`} key={hero.name}>
          {({onClick}) => (
            <div className="Row" onClick={onClick}>
              <HeroIcon
                name={hero.name}
                hideName
              />
              <div className="Middle">
                <div className="HeroName">{hero.name}</div>
              </div>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}

export default class Reference extends Component {
  render() {
    const {params} = this.props;
    const {heroName} = params || {};
    return (
      <div className="Reference" >
        {heroName
          ? <HeroDetails heroName={heroName} />
          : <HeroList />
        }
      </div>
    );
  }
}
