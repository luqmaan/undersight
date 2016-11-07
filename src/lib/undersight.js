import sum from 'lodash/sum';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import difference from 'lodash/difference';

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

export function getRolePicks(counters, heros, enemyPicks, role) {
  return getTopScores(counters, enemyPicks)
    .filter((counter) => getRole(heros, counter.name) === role);
}

export function isSupport(heros, heroName) {
  return getHero(heros, heroName).role === 'Support';
}

export function getTeamPicksByHardCounter(counters, heros, teamPicks) {
  const allHeros = heros.map((hero) => hero.name);

  const teamHardCounters = uniq(flatten(teamPicks.map((heroName) => {
    return counters
      .filter((counter) => counter.you === heroName)
      .filter((counter) => counter.score === 2)
      .map((counter) => counter.enemy);
  })));

  const uncounteredHeros = difference(allHeros, teamHardCounters);
  const notPicked = difference(allHeros, teamPicks);

  const scores = notPicked.map((heroName) => {
    const numHardCounters = counters.reduce((prev, counter) => {
      if (counter.you === heroName && counter.score === 2 && uncounteredHeros.indexOf(counter.enemy) !== -1) {
        return prev + 1;
      }
      return prev;
    }, 0);

    return {
      score: numHardCounters,
      name: heroName,
    };
  });

  return sortBy(scores, 'score').reverse();
}

export function getTeamPicksByHardCounterPrime(counters, heros, herosRanks, teamPicks) {
  // distinguishes between heros with same score based on their
  // rank relative to the other heros with the same role.
  // rank is determined by different factors depending on the role
  // (all based on competitive play stats from masteroverwatch)
  // the rank data is in heros_rank.json
  // Offense - rank by KD ratio
  // every other role - rank by popularity
  // TODO: test ranking by different combinations of factors
  const allHeros = heros.map((hero) => hero.name);

  const teamHardCounters = uniq(flatten(teamPicks.map((heroName) => {
    return counters
      .filter((counter) => counter.you === heroName)
      .filter((counter) => counter.score === 2)
      .map((counter) => counter.enemy);
  })));

  const teamRoles = uniq(teamPicks.map((heroName) => heros.filter((hero) => hero.name === heroName)[0].role));

  const uncounteredHeros = difference(allHeros, teamHardCounters);

  const scores = sortBy(herosRanks.map((hero) => {
    const numHardCounters = counters.reduce((prev, counter) => {
      if (counter.you === hero.name && counter.score === 2 && uncounteredHeros.indexOf(counter.enemy) !== -1) {
        return prev + 1;
      }
      return prev;
    }, 0);

    const roleRank = 10 - hero.roleRank;
    const teamIsMissingRole = teamRoles.indexOf(hero.role) === -1;
    const missingRoleBonus = teamIsMissingRole ? 1 : 0;

    return {
      score: numHardCounters + roleRank + missingRoleBonus,
      name: hero.name,
    };
  }), 'score').reverse();

  return scores;
}

export function getTeamPicksByHardCounterFlexRoles(counters, heros, herosRanks, teamPicks, roleCountGoal) {
  const allHeros = heros.map((hero) => hero.name);

  const teamHardCounters = uniq(flatten(teamPicks.map((heroName) => {
    return counters
      .filter((counter) => counter.you === heroName && counter.score === 2)
      .map((counter) => counter.enemy);
  })));
  
  const roleCounts = teamPicks
    .map((heroName) => {
      return herosRanks.filter((hero) => hero.name === heroName)[0].teamRole;
    })
    .reduce((prev, cur) => {
      prev[cur]--;
      return prev;
    }, roleCountGoal);
    
  const uncounteredHeros = difference(allHeros, teamHardCounters);

  const scores = sortBy(herosRanks.map((hero) => {
    const numHardCounters = counters.reduce((prev, counter) => {
      if (counter.you === hero.name && counter.score === 2 && uncounteredHeros.indexOf(counter.enemy) !== -1) {
        return prev + 1;
      }
      return prev;
    }, 0);

    const roleRank = 10 - hero.roleRank;
    
    const roleCount = roleCounts[hero.teamRole];
    const adjRoleCount = roleCount > 0 ? roleCount : roleCount - 3;
    const roleBonus = adjRoleCount * 2;

    return {
      name: hero.name,
      score: numHardCounters + roleRank + roleBonus,
    };
  }), 'score').reverse();

  return scores;
}
