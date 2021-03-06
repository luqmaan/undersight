import React, {PropTypes} from 'react';
import classNames from 'classnames';

import './HeroIcon.css';
import heros from '../data/heros.json';
import {getHero} from '../lib/undersight';

export default function HeroIcon({name, onClick, hideName, huge}) {
  const hero = name ? getHero(heros, name) : null;
  return (
    <div className={classNames("HeroIcon", {'Missing': !hero, 'Huge': huge, 'Clickable': !!onClick})} onClick={onClick}>
      <div className="HeroIconImage">
        {hero && <img src={`heros/${hero.icon}`} alt={hero.name} />}
      </div>
      {!hideName && (
        <div className="HeroIconName">
          {hero ? hero.name : 'Choose'}
        </div>
      )}
    </div>
  );
}

HeroIcon.defaultProps = {
  hideName: false,
}

HeroIcon.propTypes = {
  name: PropTypes.string,
  onClick: PropTypes.func,
  hideName: PropTypes.bool,
}
