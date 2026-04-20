const fs = require('fs');

const shapes = fs.readFileSync('eruption_shapes.txt', 'utf8').split('\n').filter(Boolean);

const categories = {
  simpleYear: [],
  yearRange: [],
  rangeToPresent: [],
  bceDate: [],
  ceDate: [],
  yearsAgo: [],
  ongoing: [],
  parenthetical: [],
  unparseable: []
};

shapes.forEach(shape => {
  const trimmed = shape.trim();
  
  // Simple 4-digit year
  if (/^\d{4}$/.test(trimmed)) {
    categories.simpleYear.push(trimmed);
  }
  // Year range (various dash types)
  else if (/^\d{4}[–—-]\d{4}/.test(trimmed)) {
    categories.yearRange.push(trimmed);
  }
  // Range to present
  else if (/^\d{4}[–—-]present/i.test(trimmed)) {
    categories.rangeToPresent.push(trimmed);
  }
  // BCE dates
  else if (/BCE$/i.test(trimmed)) {
    categories.bceDate.push(trimmed);
  }
  // CE dates  
  else if (/CE(\s|$)/i.test(trimmed)) {
    categories.ceDate.push(trimmed);
  }
  // Years ago
  else if (/years?\s+ago/i.test(trimmed)) {
    categories.yearsAgo.push(trimmed);
  }
  // Ongoing (including "ongoing since")
  else if (/ongoing/i.test(trimmed)) {
    categories.ongoing.push(trimmed);
  }
  // Year with parenthetical note
  else if (/^\d{4}\s*\(/.test(trimmed)) {
    categories.parenthetical.push(trimmed);
  }
  else {
    categories.unparseable.push(trimmed);
  }
});

console.log('=== ERUPTION SHAPE ANALYSIS ===\n');
console.log(`Total unique shapes: ${shapes.length}\n`);

console.log('PARSEABLE CATEGORIES:');
console.log(`✓ Simple years (YYYY): ${categories.simpleYear.length}`);
console.log(`✓ Year ranges (YYYY-YYYY): ${categories.yearRange.length}`);
console.log(`✓ Range to present: ${categories.rangeToPresent.length}`);
console.log(`✓ BCE dates: ${categories.bceDate.length}`);
console.log(`✓ CE dates: ${categories.ceDate.length}`);
console.log(`✓ Years ago: ${categories.yearsAgo.length}`);
console.log(`✓ Ongoing eruptions: ${categories.ongoing.length}`);
console.log(`⚠ Parenthetical notes: ${categories.parenthetical.length}`);

const parseableCount = shapes.length - categories.unparseable.length;
console.log(`\nTotal parseable: ${parseableCount}/${shapes.length} (${(parseableCount/shapes.length*100).toFixed(1)}%)`);

console.log('\n✗ UNPARSEABLE SHAPES:');
console.log(`Count: ${categories.unparseable.length}`);
if (categories.unparseable.length > 0) {
  categories.unparseable.forEach(s => console.log(`  - "${s}"`));
}

console.log('\n⚠ PARENTHETICAL SHAPES (need careful handling):');
categories.parenthetical.forEach(s => console.log(`  - "${s}"`));

console.log('\nONGOING VARIATIONS:');
categories.ongoing.forEach(s => console.log(`  - "${s}"`));

console.log('\nBCE DATES:');
categories.bceDate.forEach(s => console.log(`  - "${s}"`));

console.log('\nYEARS AGO:');
categories.yearsAgo.forEach(s => console.log(`  - "${s}"`));