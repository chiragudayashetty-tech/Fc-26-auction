const fs = require('fs');
const js = fs.readFileSync('script_0.txt', 'utf8');

// Try to extract JSON-like structures that have standard player fields
// Fields to look for: "rating", "pace", "shooting", "passing"
const regex = /\{[^{}]*"rating":[0-9]+,[^{}]*"pace":[0-9]+[^{}]*\}/g;
const matches = js.match(regex);
if (matches) {
  console.log("Found simple regex matches:", matches.length);
  console.log(matches[0].substring(0, 500));
} else {
  console.log("No simple regex match found.");
  
  // Let's try matching any large array of objects
  const arrays = js.match(/\[\{.*?\}\]/g);
  if (arrays) {
    console.log("Found arrays. Lengths:");
    arrays.forEach((a, i) => console.log(i, a.length));
    // Print a bit of the largest one
    const largest = arrays.sort((a,b) => b.length - a.length)[0];
    console.log(largest.substring(0, 500));
  }
}
