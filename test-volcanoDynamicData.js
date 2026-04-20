// Custom test runner for volcanoDynamicData functions
const { computeYearsAgo, formatYearsAgo } = require('./lib/volcanoDynamicData.ts');

let testCount = 0;
let passedCount = 0;

function test(name, fn) {
  testCount++;
  try {
    // Mock console.warn for future year test
    const originalWarn = console.warn;
    let warnCalls = [];
    console.warn = (...args) => warnCalls.push(args);
    
    const result = fn(warnCalls);
    
    console.warn = originalWarn;
    
    console.log(`✅ ${name}`);
    passedCount++;
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}`);
      }
    },
    toHaveBeenCalledWith(expected) {
      if (actual.length === 0 || !actual.some(call => call[0] === expected)) {
        throw new Error(`Expected console.warn to be called with "${expected}"`);
      }
    }
  };
}

console.log('Testing computeYearsAgo...\n');

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

test('computeYearsAgo(2027, 2026) → null (future year)', (warnCalls) => {
  process.env.NODE_ENV = 'development';
  expect(computeYearsAgo(2027, 2026)).toBe(null);
  expect(warnCalls).toHaveBeenCalledWith('Invalid future eruption year: 2027 (current year: 2026)');
});

console.log('\nTesting formatYearsAgo...\n');

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

test('formatYearsAgo(2027, 2026) → null', (warnCalls) => {
  process.env.NODE_ENV = 'development';
  expect(formatYearsAgo(2027, 2026)).toBe(null);
});

console.log('\n' + '='.repeat(50));
console.log(`Test Results: ${passedCount}/${testCount} passed`);
process.exit(passedCount === testCount ? 0 : 1);