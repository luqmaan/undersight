import sum from 'lodash/sum';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import head from 'lodash/head';

export function getHero(heros, heroName) {
    return heros.find((hero) => hero.name === heroName);
}

export function getTopScores(counters, enemyPicks) {
  let scores = {};
  enemyPicks.forEach((pick) => scores[pick] = 0);
  counters.forEach((counter) => {
    scores[counter.you] = sum(enemyPicks.map(
      (enemy) => counters.find(x => x.enemy === enemy && x.you === counter.you).score
    ));
  });
  return sortBy(map(scores, (score, name) => ({score, name})), 'score').reverse();
}

export function getHeroCounters(counters, enemy) {
  return getTopScores(counters, [enemy]);
}

export function getRole(heroName, hero) {
  const matchingRole = hero.find((role) => role.name === heroName);
  return matchingRole.role;
}

export function getRolePicks(counters, enemyPicks, hero, role) {
  const countersWithRole = counters.filter((counter) => getRole(counter.you, hero) === role);
  return getTopScores(countersWithRole, enemyPicks);
}

export function getAllRolePicks(counters, enemyPicks, hero) {
  return {
    Offense: getRolePicks(counters, enemyPicks, hero, 'Offense'),
    Defense: getRolePicks(counters, enemyPicks, hero, 'Defense'),
    Tank: getRolePicks(counters, enemyPicks, hero, 'Tank'),
    Support: getRolePicks(counters, enemyPicks, hero, 'Support'),
  }
}

export function isSupport(heros, heroName) {
  return getHero(heros, heroName).role === 'Support';
}
