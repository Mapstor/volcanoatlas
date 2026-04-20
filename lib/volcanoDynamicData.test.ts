import { computeYearsAgo, formatYearsAgo } from './volcanoDynamicData';

describe('computeYearsAgo', () => {
  test('computeYearsAgo(2026, 2026) → 0', () => {
    expect(computeYearsAgo(2026, 2026)).toBe(0);
  });

  test('computeYearsAgo(2025, 2026) → 1', () => {
    expect(computeYearsAgo(2025, 2026)).toBe(1);
  });

  test('computeYearsAgo(950, 2026) → 1076', () => {
    expect(computeYearsAgo(950, 2026)).toBe(1076);
  });

  test('computeYearsAgo(-50, 2026) → 2076', () => {
    expect(computeYearsAgo(-50, 2026)).toBe(2076);
  });

  test('computeYearsAgo(-8300, 2026) → 10326', () => {
    expect(computeYearsAgo(-8300, 2026)).toBe(10326);
  });

  test('computeYearsAgo(null) → null', () => {
    expect(computeYearsAgo(null)).toBe(null);
  });

  test('computeYearsAgo(2027, 2026) → null (future year)', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    expect(computeYearsAgo(2027, 2026)).toBe(null);
    expect(consoleSpy).toHaveBeenCalledWith('Invalid future eruption year: 2027 (current year: 2026)');
    consoleSpy.mockRestore();
  });
});

describe('formatYearsAgo', () => {
  test('formatYearsAgo(2026, 2026) → "This year"', () => {
    expect(formatYearsAgo(2026, 2026)).toBe('This year');
  });

  test('formatYearsAgo(2025, 2026) → "1 year ago"', () => {
    expect(formatYearsAgo(2025, 2026)).toBe('1 year ago');
  });

  test('formatYearsAgo(2023, 2026) → "3 years ago"', () => {
    expect(formatYearsAgo(2023, 2026)).toBe('3 years ago');
  });

  test('formatYearsAgo(1550, 2026) → "476 years ago"', () => {
    expect(formatYearsAgo(1550, 2026)).toBe('476 years ago');
  });

  test('formatYearsAgo(950, 2026) → "1,076 years ago"', () => {
    expect(formatYearsAgo(950, 2026)).toBe('1,076 years ago');
  });

  test('formatYearsAgo(-50, 2026) → "2,076 years ago"', () => {
    expect(formatYearsAgo(-50, 2026)).toBe('2,076 years ago');
  });

  test('formatYearsAgo(-9540, 2026) → "11,566 years ago"', () => {
    expect(formatYearsAgo(-9540, 2026)).toBe('11,566 years ago');
  });

  test('formatYearsAgo(0, 2026) → "2,026 years ago"', () => {
    expect(formatYearsAgo(0, 2026)).toBe('2,026 years ago');
  });

  test('formatYearsAgo(null) → null', () => {
    expect(formatYearsAgo(null)).toBe(null);
  });

  test('formatYearsAgo(2027, 2026) → null', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    expect(formatYearsAgo(2027, 2026)).toBe(null);
    consoleSpy.mockRestore();
  });
});