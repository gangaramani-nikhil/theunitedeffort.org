const elig = require('../eligibility');

test('add callback adds two numbers', () => {
  expect(elig.add(1, 2)).toBe(3);
  expect(elig.add(-1, 1)).toBe(0);
});

test('Dates are formatted as US dates', () => {
  const expected = '1/22/1973';
  expect(elig.formatUsDate('1973-01-22T00:00')).toBe(expected);
  expect(elig.formatUsDate(new Date('1973-01-22T00:00'))).toBe(expected);
});

describe('indexOfAll', () => {
  test('Finds matching indices', () => {
    expect(elig.indexOfAll([1, 2, 4, 2, 2, 1], 2)).toEqual([1, 3, 4]);
    expect(elig.indexOfAll([0, 1, 1, 0, 0, 1], true)).toEqual([1, 2, 5]);
  });

  test('Returns empty array for no matches', () => {
    expect(elig.indexOfAll(['a', 'b', 'c'], 'd')).toEqual([]);
  });

  test('Handles empty input array', () => {
    expect(elig.indexOfAll([], 1)).toEqual([]);
  });
});

describe('isOneOf', () => {
  test('Works for non-null search value', () => {
    const allowedOptions = ['apple', 'orange', 'banana'];
    expect(elig.isOneOf('banana', allowedOptions)).toBe(true);
    expect(elig.isOneOf('kiwi', allowedOptions)).toBe(false);
  });

  test('Returns null for null search value', () => {
    expect(elig.isOneOf(null, ['earth', 'mars'])).toBe(null);
  });
});

describe('hasNulls', () => {
  test('Returns true for included NaN', () => {
    expect(elig.hasNulls(1, 2, NaN)).toBe(true);
    expect(elig.hasNulls(NaN)).toBe(true);
    expect(elig.hasNulls(1, NaN, NaN)).toBe(true);
  });

  test('Returns true for included null', () => {
    expect(elig.hasNulls(1, 2, null)).toBe(true);
    expect(elig.hasNulls(null)).toBe(true);
    expect(elig.hasNulls(1, null, null)).toBe(true);
  });

  test('Returns false for all non-null and non-NaN', () => {
    expect(elig.hasNulls(0, 1, 2)).toBe(false);
    expect(elig.hasNulls('0', '1', '2')).toBe(false);
    expect(elig.hasNulls(false, false, false)).toBe(false);
  });
});

describe('toCamelCase', () => {
  test('Converts strings with "-", "_", or " " separators to camel case', () => {
    const expected = 'thisIsATest';
    expect(elig.toCamelCase('this-is-a-test')).toBe(expected);
    expect(elig.toCamelCase('this_is_a_test')).toBe(expected);
    expect(elig.toCamelCase('this is a test')).toBe(expected);
    expect(elig.toCamelCase('THIS IS A TEST')).toBe(expected);
  });

  test('Passes strings with no separators through unchanged', () => {
    const inputStr = 'thisisatest';
    expect(elig.toCamelCase(inputStr)).toBe(inputStr);
  });

  test('Passes strings with some other separator through unchanged', () => {
    const inputStr = 'this/is/a/test';
    expect(elig.toCamelCase(inputStr)).toBe(inputStr);
  })
});

test('Date strings are converted to local datetime strings', () => {
  expect(elig.dateStrToLocal('1969-07-16')).toBe('1969-07-16T00:00');
});

describe('getNumberOfDays', () => {
  test('Computes number of days between two dates correctly', () => {
    expect(elig.getNumberOfDays('1999-12-31', '2000-01-01')).toBe(1);
    expect(elig.getNumberOfDays('2020-03-07', '2020-03-01')).toBe(-6);
    expect(elig.getNumberOfDays(
      new Date('1999-12-31'), new Date('2000-01-01'))).toBe(1);
  });

  test('Counts partial days as full days in date difference', () => {
    expect(elig.getNumberOfDays(
      '1980-05-15T03:45', '1980-05-15T03:59')).toBe(1);
  });

  test('Will return NaN when given a NaN input', () => {
    expect(elig.getNumberOfDays(NaN, '2012-12-21')).toBe(NaN);
  });
});

describe('Null-passing OR', () => {
  test('Combines boolean inputs', () => {
    expect(elig.or(true, true)).toBe(true);
    expect(elig.or(true, false)).toBe(true);
    expect(elig.or(false, false)).toBe(false);
    expect(elig.or(true, true, false)).toBe(true);
  });

  test('Works with null inputs', () => {
    expect(elig.or(true, null)).toBe(true);
    expect(elig.or(false, null)).toBe(null);
    expect(elig.or(null, null)).toBe(null);
  });
});

describe('Null-passing AND', () => {
  test('Combines boolean inputs', () => {
    expect(elig.and(true, true)).toBe(true);
    expect(elig.and(true, false)).toBe(false);
    expect(elig.and(false, false)).toBe(false);
    expect(elig.and(true, true, false)).toBe(false);
  });

  test('Works with null inputs', () => {
    expect(elig.and(true, null)).toBe(null);
    expect(elig.and(false, null)).toBe(false);
    expect(elig.and(null, null)).toBe(null);
  });
});

describe('Null-passing NOT', () => {
  test('Inverts boolean input', () => {
    expect(elig.not(true)).toBe(false);
    expect(elig.not(false)).toBe(true);
  });

  test('Returns null for null input', () => {
    expect(elig.not(null)).toBe(null);
  });
});

describe('Null-passing equal', () => {
  test('Compares non-null inputs', () => {
    expect(elig.eq(1, 2)).toBe(false);
    expect(elig.eq(2, 2)).toBe(true);
    expect(elig.eq('1', 1)).toBe(true);
  });

  test('Returns null for null input', () => {
    expect(elig.eq(1, null)).toBe(null);
    expect(elig.eq(null, null)).toBe(null);
  });

  test('Returns null for NaN inputs', () => {
    expect(elig.eq(1, NaN)).toBe(null);
    expect(elig.eq(NaN, NaN)).toBe(null);
  });
});

describe('Null-passing not-equal', () => {
  test('Compares non-null inputs', () => {
    expect(elig.ne(1, 2)).toBe(true);
    expect(elig.ne(2, 2)).toBe(false);
    expect(elig.ne('1', 1)).toBe(false);
  });

  test('Returns null for null inputs', () => {
    expect(elig.ne(1, null)).toBe(null);
    expect(elig.ne(null, null)).toBe(null);
  });

  test('Returns null for NaN inputs', () => {
    expect(elig.ne(1, NaN)).toBe(null);
    expect(elig.ne(NaN, NaN)).toBe(null);
  });
});

describe('Null-passing greater-than', () => {
  test('Compares non-null inputs', () => {
    expect(elig.gt(1, 2)).toBe(false);
    expect(elig.gt(2, 2)).toBe(false);
    expect(elig.gt(2, 1)).toBe(true);
    expect(elig.gt(1, '2')).toBe(false);
    expect(elig.gt(2, '2')).toBe(false);
    expect(elig.gt('2', 1)).toBe(true);
  });

  test('Returns null for null inputs', () => {
    expect(elig.gt(1, null)).toBe(null);
    expect(elig.gt(null, null)).toBe(null);
  });

  test('Returns null for NaN inputs', () => {
    expect(elig.gt(1, NaN)).toBe(null);
    expect(elig.gt(NaN, NaN)).toBe(null);
  });
});

describe('Null-passing greater-than-or-equal-to', () => {
  test('Compares non-null inputs', () => {
    expect(elig.ge(1, 2)).toBe(false);
    expect(elig.ge(2, 2)).toBe(true);
    expect(elig.ge(2, 1)).toBe(true);
    expect(elig.ge(1, '2')).toBe(false);
    expect(elig.ge(2, '2')).toBe(true);
    expect(elig.ge('2', 1)).toBe(true);
  });

  test('Returns null for null inputs', () => {
    expect(elig.ge(1, null)).toBe(null);
    expect(elig.ge(null, null)).toBe(null);
  });

  test('Returns null for NaN inputs', () => {
    expect(elig.ge(1, NaN)).toBe(null);
    expect(elig.ge(NaN, NaN)).toBe(null);
  });
});

describe('Null-passing less-than', () => {
  test('Compares non-null inputs', () => {
    expect(elig.lt(1, 2)).toBe(true);
    expect(elig.lt(2, 2)).toBe(false);
    expect(elig.lt(2, 1)).toBe(false);
    expect(elig.lt(1, '2')).toBe(true);
    expect(elig.lt(2, '2')).toBe(false);
    expect(elig.lt('2', 1)).toBe(false);
  });

  test('Returns null for null inputs', () => {
    expect(elig.lt(1, null)).toBe(null);
    expect(elig.lt(null, null)).toBe(null);
  });

  test('Returns null for NaN inputs', () => {
    expect(elig.lt(1, NaN)).toBe(null);
    expect(elig.lt(NaN, NaN)).toBe(null);
  });
});

describe('Null-passing less-than-or-equal-to', () => {
  test('Compares non-null inputs', () => {
    expect(elig.le(1, 2)).toBe(true);
    expect(elig.le(2, 2)).toBe(true);
    expect(elig.le(2, 1)).toBe(false);
    expect(elig.le(1, '2')).toBe(true);
    expect(elig.le(2, '2')).toBe(true);
    expect(elig.le('2', 1)).toBe(false);
  });

  test('Returns null for null inputs', () => {
    expect(elig.le(1, null)).toBe(null);
    expect(elig.le(null, null)).toBe(null);
  });

  test('Returns null for NaN inputs', () => {
    expect(elig.le(1, NaN)).toBe(null);
    expect(elig.le(NaN, NaN)).toBe(null);
  });
});
