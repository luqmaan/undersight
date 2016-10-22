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

export function getRole(heroName, hero) {
  const matchingRole = hero.find((role) => role.name === heroName);
  return matchingRole.role;
}

export function getRolePicks(counters, enemyPicks, hero, role) {
  return getTopScores(counters, enemyPicks)
    .filter((counter) => getRole(counter.name, hero) === role);
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
