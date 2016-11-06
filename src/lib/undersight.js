import sum from 'lodash/sum';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

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

export function getHeroCounters(counters, heroName) {
  return sortBy(
    counters.filter((counter) => counter.you === heroName),
    'score'
  ).reverse();
}

export function getRole(heros, heroName) {
  const matchingRole = heros.find((role) => role.name === heroName);
  return matchingRole.role;
}

export function getRolePicks(counters, enemyPicks, heros, role) {
  return getTopScores(counters, enemyPicks)
    .filter((counter) => getRole(heros, counter.name) === role);
}

export function getAllRolePicks(counters, enemyPicks, heros) {
  return {
    Offense: getRolePicks(counters, enemyPicks, heros, 'Offense'),
    Defense: getRolePicks(counters, enemyPicks, heros, 'Defense'),
    Tank: getRolePicks(counters, enemyPicks, heros, 'Tank'),
    Support: getRolePicks(counters, enemyPicks, heros, 'Support'),
  }
}

export function isSupport(heros, heroName) {
  return getHero(heros, heroName).role === 'Support';
}
