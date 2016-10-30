import Logic from 'logic-solver';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import difference from 'lodash/difference';
import sortBy from 'lodash/sortBy';

import counters from '../data/counters.json';
import heros from '../data/heros.json';

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
    // T = your team
    // A = heroes currently hard countered by your team picks
    // find the hero not currently picked, who has the most hard counters who are not in a
    //
    // uncountersHeros = all heros - A
    // notPicked = all heros - T
    // hero with the most hard counters in uncountersHeros
    //
    // heros = []
    //
    // for hero in T:
    //   hard_ctrs = 0
    //   for ctr in counters:
    //     if ctr.you == hero and ctr.score == -2 and ctr.enemy in uncountersHeros:
    //       hard_ctrs += 1
    //   heros.append((hero, hard_ctrs))
    //
    // heros = sorted(cmp=lambda a, b: a[1] - b[1])
    //
    // num_hard_ctrs = counters[(counters.you == hero) & (counters.score == -2) & (counters.enemy in uncountersHeros)]
    // if num_hard_ctrs > max_hard_ctrs:
    //   current_pick = hero

    expect(getTeamPicks(['Pharah', 'D.Va', 'D.Va', 'D.Va', 'D.Va', 'D.Va'], false)).toMatchSnapshot();

  });

});
