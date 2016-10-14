import sum from 'lodash/sum';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import take from 'lodash/take';
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

export function getTopFour(counters, enemyPicks) {
  const scores = getTopScores(counters, enemyPicks);
  return take(scores, 4);
}

export function getHeroCounters(counters, enemy) {
  const scores = getTopScores(counters, [enemy]);
  return take(scores, 2);
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
    Offense: head(getRolePicks(counters, enemyPicks, hero, 'Offense')),
    Defense: head(getRolePicks(counters, enemyPicks, hero, 'Defense')),
    Tank: head(getRolePicks(counters, enemyPicks, hero, 'Tank')),
    Support: head(getRolePicks(counters, enemyPicks, hero, 'Support')),
  }
}
