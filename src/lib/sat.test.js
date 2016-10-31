import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import difference from 'lodash/difference';
import sortBy from 'lodash/sortBy';

import counters from '../data/counters.json';
import heros from '../data/heros.json';
import herosRanks from '../data/heros_rank.json';

function getTeamPicksV2(teamPicks, competitive) {
  const allHeros = heros.map((hero) => hero.name);

  const teamHardCounters = uniq(flatten(teamPicks.map((heroName) => {
    return counters
      .filter((counter) => counter.you === heroName)
      .filter((counter) => counter.score === 2)
      .map((counter) => counter.enemy);
  })));

  const uncountersHeros = difference(allHeros, teamHardCounters);
  const notPicked = difference(allHeros, competitive ? teamPicks : []);

  const scores = notPicked.map((heroName) => {
    const numHardCounters = counters.reduce((prev, counter) => {
      if (counter.you === heroName) {
        return prev + counter.score;
      }
      return prev;
    }, 0);

    return {
      score: numHardCounters,
      heroName,
    };
  });

  return sortBy(scores, 'score').reverse();
}


function getTeamPicksV3(teamPicks, competitive) {
  const allHeros = heros.map((hero) => hero.name);

  const teamHardCounters = uniq(flatten(teamPicks.map((heroName) => {
    return counters
      .filter((counter) => counter.you === heroName)
      .filter((counter) => counter.score === 2)
      .map((counter) => counter.enemy);
  })));

  const uncountersHeros = difference(allHeros, teamHardCounters);
  const notPicked = difference(allHeros, competitive ? teamPicks : []);

  const scores = notPicked.map((heroName) => {
    const numHardCounters = counters.reduce((prev, counter) => {
      if (counter.you === heroName && uncountersHeros.indexOf(counter.enemy) !== -1) {
        return prev + counter.score;
      }
      return prev;
    }, 0);

    return {
      score: numHardCounters,
      heroName,
    };
  });

  return sortBy(scores, 'score').reverse();
}


function getTeamPicksByHardCounter(teamPicks, competitive) {
  const allHeros = heros.map((hero) => hero.name);

  const teamHardCounters = uniq(flatten(teamPicks.map((heroName) => {
    return counters
      .filter((counter) => counter.you === heroName)
      .filter((counter) => counter.score === 2)
      .map((counter) => counter.enemy);
  })));

  const uncounteredHeros = difference(allHeros, teamHardCounters);
  const notPicked = difference(allHeros, competitive ? teamPicks : []);

  const scores = notPicked.map((heroName) => {
    const numHardCounters = counters.reduce((prev, counter) => {
      if (counter.you === heroName && counter.score === 2 && uncounteredHeros.indexOf(counter.enemy) !== -1) {
        return prev + 1;
      }
      return prev;
    }, 0);

    return {
      score: numHardCounters,
      heroName
    };
  });

  return sortBy(scores, 'score').reverse();
}

function getTeamPicksByHardCounterPrime(teamPicks, competitive) {
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
  
  const teamRoles = uniq(teamPicks.map((heroName) => heros.filter((hero) => hero.name == heroName)[0].role));

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
      role: hero.role,
    };
  }), 'score').reverse();
  
  
  return scores;
}



describe('sat', () => {
  fit('should asdf', () => {
    console.log(getTeamPicksByHardCounterPrime(['Reinhardt', 'Reaper', 'Tracer'], false));
  });

});
