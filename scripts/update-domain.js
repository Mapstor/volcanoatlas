const fs = require('fs');
const path = require('path');

// Directory containing volcano content files
const contentDir = path.join(__dirname, '..', 'data', 'content');

// Get all JSON files in the content directory
const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.json'));

console.log(`Found ${files.length} JSON files to update`);

let updatedCount = 0;

files.forEach(file => {
  const filePath = path.join(contentDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if file contains the old domain
  if (content.includes('volcanoatlas.com')) {
    // Replace all occurrences
    content = content.replace(/volcanoatlas\.com/g, 'volcanosatlas.com');
    
    // Write the updated content back
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
    console.log(`Updated: ${file}`);
  }
});

console.log(`\nCompleted! Updated ${updatedCount} files.`);