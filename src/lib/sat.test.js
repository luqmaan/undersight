import Logic from 'logic-solver';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import difference from 'lodash/difference';
import sortBy from 'lodash/sortBy';

import counters from '../data/counters.json';
import heros from '../data/heros.json';

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


function getTeamPicks(teamPicks, competitive) {
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
      if (counter.you === heroName && counter.score === 2 && uncountersHeros.indexOf(counter.enemy) !== -1) {
        return prev + 1;
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



describe('sat', () => {
  fit('should asdf', () => {
    console.log(getTeamPicks(['Tracer', 'Junkrat', 'Hanzo', 'Mei', 'Bastion', 'Reinhardt'], false))
    // console.log(getTeamPicksV2(teamPicks, false))
    console.log(getTeamPicksV3(['Tracer', 'Junkrat', 'Pharah', 'McCree', 'Mei', 'Bastion'], false))

    // expect(getTeamPicks(['Pharah', 'D.Va', 'D.Va', 'D.Va', 'D.Va', 'D.Va'], false)).toMatchSnapshot();

  });

});
