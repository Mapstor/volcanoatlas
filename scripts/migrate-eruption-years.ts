#!/usr/bin/env npx tsx
import fs from 'fs';
import path from 'path';

/**
 * Parses various eruption date text formats into a numeric year
 * @param rawString - Text like "2025", "2021-2023", "~2850 BCE", "~70,000 years ago"
 * @param currentYear - Current year for relative date calculations
 * @returns Numeric year (negative for BCE) or null if unparseable
 */
function parseEruptionYear(
  rawString: string | undefined | null,
  currentYear: number = new Date().getFullYear()
): number | null {
  if (!rawString) return null;
  
  const str = rawString.trim();
  
  // Handle "X years ago" format
  const yearsAgoMatch = str.match(/^~?(\d{1,3},?\d{0,3})\s+years?\s+ago/i);
  if (yearsAgoMatch) {
    const years = parseInt(yearsAgoMatch[1].replace(/,/g, ''));
    return currentYear - years;
  }
  
  // Handle BCE dates
  const bceMatch = str.match(/^~?(\d+)\s+BCE$/i);
  if (bceMatch) {
    return -parseInt(bceMatch[1]);
  }
  
  // Handle CE dates (explicit)
  const ceMatch = str.match(/^~?(\d+)\s+CE/i);
  if (ceMatch) {
    return parseInt(ceMatch[1]);
  }
  
  // Handle year ranges (take the most recent year)
  const rangeMatch = str.match(/(\d{4})[–—-](\d{4}|\w+)/);
  if (rangeMatch) {
    // If second part is "present" or starts with text, use current year
    if (rangeMatch[2].match(/^(present|ongoing)/i)) {
      return currentYear;
    }
    // If second part is a year, use it
    const endYear = parseInt(rangeMatch[2]);
    if (!isNaN(endYear)) {
      return endYear;
    }
    // Otherwise use the first year
    return parseInt(rangeMatch[1]);
  }
  
  // Handle "ongoing since X" or "ongoing"
  if (str.match(/ongoing/i)) {
    // For ongoing eruptions, always use current year
    return currentYear;
  }
  
  // Handle parenthetical notes
  const parenMatch = str.match(/^(\d{4})\s*\(/);
  if (parenMatch) {
    // Special case: "2014 (uncertain activity to 2024)"
    if (str.includes('uncertain activity to')) {
      const toYearMatch = str.match(/to\s+(\d{4})/);
      if (toYearMatch) {
        return parseInt(toYearMatch[1]);
      }
    }
    // Special case: "1977 (possible 1994)"
    if (str.includes('possible')) {
      // Use the first year (more certain)
      return parseInt(parenMatch[1]);
    }
    // Default: use the main year
    return parseInt(parenMatch[1]);
  }
  
  // Handle simple 4-digit years
  const simpleYearMatch = str.match(/^(\d{4})$/);
  if (simpleYearMatch) {
    return parseInt(simpleYearMatch[1]);
  }
  
  // Unable to parse
  console.warn(`Unable to parse: "${str}"`);
  return null;
}

// Migration script
async function migrateEruptionYears() {
  const contentDir = path.join(process.cwd(), 'data', 'content');
  const files = fs.readdirSync(contentDir).filter(f => f.startsWith('volcano-') && f.endsWith('.json'));
  
  console.log(`Found ${files.length} volcano content files to migrate\n`);
  
  const results = {
    migrated: [] as string[],
    failed: [] as string[],
    suspicious: [] as { file: string, year: number, text: string }[],
    nulls: [] as { file: string, text: string }[]
  };
  
  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!content.hero) {
      console.warn(`${file}: No hero section found`);
      results.failed.push(file);
      continue;
    }
    
    const textValue = content.hero.last_eruption;
    const numericYear = parseEruptionYear(textValue);
    
    // Add the numeric field
    content.hero.last_eruption_year = numericYear;
    
    // Track results
    if (numericYear === null) {
      results.nulls.push({ file, text: textValue || 'undefined' });
    } else if (numericYear > 2026) {
      results.suspicious.push({ file, year: numericYear, text: textValue });
    } else if (numericYear < -15000) {
      results.suspicious.push({ file, year: numericYear, text: textValue });
    } else {
      results.migrated.push(file);
    }
    
    // Write back with proper formatting
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
  }
  
  // Report results
  console.log('=== MIGRATION RESULTS ===\n');
  console.log(`✓ Successfully migrated: ${results.migrated.length}`);
  console.log(`✗ Failed: ${results.failed.length}`);
  console.log(`⚠ Suspicious values: ${results.suspicious.length}`);
  console.log(`∅ Null values: ${results.nulls.length}`);
  
  if (results.nulls.length > 0) {
    console.log('\n=== FILES WITH NULL VALUES (need manual review) ===');
    results.nulls.forEach(({ file, text }) => {
      console.log(`  ${file}: "${text}"`);
    });
  }
  
  if (results.suspicious.length > 0) {
    console.log('\n=== SUSPICIOUS VALUES (need manual review) ===');
    results.suspicious.forEach(({ file, year, text }) => {
      console.log(`  ${file}: ${year} from "${text}"`);
    });
  }
  
  if (results.failed.length > 0) {
    console.log('\n=== FAILED FILES ===');
    results.failed.forEach(f => console.log(`  ${f}`));
  }
  
  console.log('\nMigration complete!');
}

// Run if called directly
if (require.main === module) {
  migrateEruptionYears().catch(console.error);
}

export { parseEruptionYear };