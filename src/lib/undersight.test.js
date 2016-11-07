import {
  getTopScores,
  getTopFour,
  getRolePicks,
  getHeroCounters,
  getTeamPicksByHardCounter,
  getTeamPicksByHardCounterPrime,
  getTeamPicksByHardCounterFlexRoles,
} from './undersight';
import allCountersJSON from '../data/counters.json';
import herosJSON from '../data/heros.json';
import herosRanksJSON from '../data/heros_ranks.json';

const testCounters = allCountersJSON.filter((counter) => (
  counter.you === 'Reaper' ||
  counter.you === 'Pharah' ||
  counter.you === 'Soldier: 76'
)).filter((counter) => (
  counter.enemy === 'Reaper' ||
  counter.enemy === 'Pharah' ||
  counter.enemy === 'Soldier: 76'
));

describe('undersight', () => {
  describe('getTopScores', () => {
    it('should calculate scores', () => {
      expect(getTopScores(testCounters, ['Pharah', 'Pharah', 'Pharah'])).toMatchSnapshot();
      expect(getTopScores(testCounters, ['Reaper', 'Reaper', 'Reaper'])).toMatchSnapshot();
      expect(getTopScores(testCounters, ['Soldier: 76', 'Soldier: 76', 'Soldier: 76'])).toMatchSnapshot();
      expect(getTopScores(testCounters, ['Reaper', 'Soldier: 76', 'Pharah'])).toMatchSnapshot();
      expect(getTopScores(testCounters, ['Soldier: 76', 'Pharah', 'Reaper'])).toMatchSnapshot();
    });

    it('should calculate score for one enemy', () => {
      expect(getTopScores(testCounters, ['Pharah'])).toMatchSnapshot();
    });

    it('should calculate score for four enemy', () => {
      expect(getTopScores(testCounters, ['Pharah', 'Pharah', 'Pharah', 'Pharah'])).toMatchSnapshot();
    });
  });

  describe('getHeroCounters', () => {
    it('should return counters sorted by score desc', () => {
      expect(getHeroCounters(allCountersJSON, 'Pharah')).toMatchSnapshot();
    });
  });

  describe('getTeamPicksByHardCounter', () => {
    it('should return team picks', () => {
      expect(getTeamPicksByHardCounter(allCountersJSON, herosJSON, ['Genji', 'Junkrat', 'Roadhog', 'Zenyatta', 'Hanzo', 'Reaper'], false)).toMatchSnapshot();
    });
  });

  describe('getTeamPicksByHardCounterPrime', () => {
    it('should return team picks', () => {
      expect(getTeamPicksByHardCounterPrime(allCountersJSON, herosJSON, herosRanksJSON, ['Genji', 'Junkrat', 'Roadhog', 'Zenyatta', 'Hanzo', 'Reaper'], false)).toMatchSnapshot();
    });
  });

  describe('getTeamPicksByHardCounterFlexRoles', () => {
    it('should return team picks', () => {
      const teamPicks = ['Tracer', 'Junkrat', 'Zarya', 'Reinhardt'];
      const roleCountGoal = {tank: 3, dps: 3, support: 0};
      expect(getTeamPicksByHardCounterFlexRoles(allCountersJSON, herosJSON, herosRanksJSON, teamPicks, roleCountGoal)).toMatchSnapshot();
    });
  });
});
