const fs = require('fs');
let content = fs.readFileSync('src/data/properties.ts', 'utf8');

// The issue is that the bullet points have 4 spaces before the hyphen, making them code blocks in markdown.
// Let's replace "    - " with "- " but only inside the descriptions.
// A simpler regex that just finds 4 spaces followed by a hyphen and a space at the start of a line
// since no other valid code in properties.ts starts with exactly "    - " (except these bullet points).

content = content.replace(/^[ \t]+- /gm, '- ');

fs.writeFileSync('src/data/properties.ts', content);
console.log("Fixed markdown indentation");
