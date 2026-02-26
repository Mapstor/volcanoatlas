// Generate estimated eruption timeline for volcanoes without detailed data
// Based on total eruptions count and last eruption year
export function generateEstimatedEruptions(
  lastEruption: number,
  totalEruptions: number,
  volcanoName: string
): Array<{ year: number; vei?: number; description: string; estimated: boolean }> {
  const eruptions: Array<{ year: number; vei?: number; description: string; estimated: boolean }> = [];
  
  // Known eruptions for specific volcanoes (manually researched)
  const knownEruptions: Record<string, Array<{ year: number; vei?: number; description: string }>> = {
    'akan': [
      { year: 2025, vei: 2, description: 'Minor phreatic eruption at Meakandake' },
      { year: 2018, vei: 1, description: 'Small phreatic eruption' },
      { year: 2008, vei: 2, description: 'Phreatic eruptions from Ponmachineshiri crater' },
      { year: 2006, vei: 1, description: 'Minor eruption at Meakandake' },
      { year: 1998, vei: 1, description: 'Small phreatic activity' },
      { year: 1996, vei: 2, description: 'Phreatomagmatic eruption' },
      { year: 1988, vei: 2, description: 'Eruption at Meakandake with ashfall' },
      { year: 1966, vei: 1, description: 'Minor activity' },
      { year: 1964, vei: 1, description: 'Phreatic eruption' },
      { year: 1962, vei: 1, description: 'Small eruption' },
      { year: 1960, vei: 1, description: 'Minor phreatic activity' },
      { year: 1959, vei: 1, description: 'Small eruption at crater' },
      { year: 1958, vei: 1, description: 'Phreatic eruption' },
      { year: 1957, vei: 1, description: 'Minor activity' },
      { year: 1956, vei: 1, description: 'Small eruption' },
      { year: 1955, vei: 2, description: 'Moderate eruption with ash emissions' },
      { year: 1954, vei: 1, description: 'Minor phreatic eruption' },
      { year: 1951, vei: 1, description: 'Small eruption' },
      { year: 1874, vei: 2, description: 'Historical eruption' },
      { year: 1808, vei: 2, description: 'Early 19th century activity' },
    ]
  };
  
  const cleanName = volcanoName.toLowerCase().trim();
  
  // If we have known data for this volcano, return it
  if (knownEruptions[cleanName]) {
    return knownEruptions[cleanName].map(e => ({
      ...e,
      estimated: false
    }));
  }
  
  // Otherwise, generate estimated timeline based on patterns
  // Most volcanoes have irregular eruption patterns
  if (lastEruption && totalEruptions) {
    // Add the confirmed last eruption
    eruptions.push({
      year: lastEruption,
      description: 'Most recent confirmed eruption',
      estimated: false
    });
    
    // Generate estimated historical eruptions
    // Assume higher frequency in recent centuries
    const currentYear = new Date().getFullYear();
    const yearsToGenerate = Math.min(totalEruptions - 1, 20); // Limit to recent 20 eruptions
    
    // Common eruption intervals for active volcanoes
    const intervals = [2, 3, 5, 7, 10, 12, 15, 20, 25, 30];
    
    let year = lastEruption;
    for (let i = 0; i < yearsToGenerate && year > 1800; i++) {
      const interval = intervals[Math.floor(Math.random() * intervals.length)];
      year -= interval;
      
      if (year > 1800) {
        eruptions.push({
          year,
          vei: Math.floor(Math.random() * 3) + 1, // Random VEI 1-3
          description: 'Historical eruption (estimated)',
          estimated: true
        });
      }
    }
  }
  
  return eruptions.sort((a, b) => b.year - a.year);
}

// Format eruption for display
export function formatEruption(eruption: { year: number; vei?: number; description: string; estimated: boolean }) {
  const yearStr = eruption.year < 0 
    ? `${Math.abs(eruption.year)} BCE` 
    : eruption.year.toString();
    
  const veiStr = eruption.vei ? `VEI ${eruption.vei}` : '';
  
  return {
    year: yearStr,
    vei: veiStr,
    description: eruption.description,
    estimated: eruption.estimated
  };
}