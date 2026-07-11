const fs = require('fs');
let content = fs.readFileSync('src/data/properties.ts', 'utf8');

// The simplest way to fix this safely is to use a regex to replace HTML tags with Markdown equivalents
// inside the backticks for Villa Canoa.
let replaced = content.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
replaced = replaced.replace(/<em>(.*?)<\/em>/g, '*$1*');
replaced = replaced.replace(/<p>(.*?)<\/p>/g, '$1\n\n');
replaced = replaced.replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n');
replaced = replaced.replace(/<ul.*?>(.*?)<\/ul>/gs, '$1\n\n');
replaced = replaced.replace(/<li>(.*?)<\/li>/g, '- $1');

fs.writeFileSync('src/data/properties.ts', replaced);
console.log("Done");
