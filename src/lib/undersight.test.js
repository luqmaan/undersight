import {
  getTopScores,
  getTopFour,
  getAllRolePicks,
} from './undersight';
import allCountersJSON from '../data/counters.json';
import rolesJSON from '../data/roles.json';

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

  describe('getTopFour', () => {
    it('should get the top three counters to a team', () => {
      expect(getTopFour(testCounters, ['Pharah', 'Pharah', 'Pharah'])).toMatchSnapshot();
      expect(getTopFour(testCounters, ['Reaper', 'Reaper', 'Reaper'])).toMatchSnapshot();
      expect(getTopFour(testCounters, ['Soldier: 76', 'Soldier: 76', 'Soldier: 76'])).toMatchSnapshot();
      expect(getTopFour(testCounters, ['Reaper', 'Soldier: 76', 'Pharah'])).toMatchSnapshot();
      expect(getTopFour(testCounters, ['Soldier: 76', 'Pharah', 'Reaper'])).toMatchSnapshot();
    });
  });

  describe('getAllRolePicks', () => {
    it('should get picks for each category', () => {
      expect(getAllRolePicks(allCountersJSON, ['Pharah', 'Pharah', 'Pharah'], rolesJSON)).toMatchSnapshot();
      expect(getAllRolePicks(allCountersJSON, ['Pharah', 'Pharah', 'Pharah', 'Zenyatta', 'Zenyatta', 'Zenyatta'], rolesJSON)).toMatchSnapshot();
    });
  });
});
