import { properties } from './src/data/properties.ts';
import fs from 'fs';

fs.writeFileSync('properties_extracted.json', JSON.stringify(properties, null, 2));
console.log(`Extracted ${properties.length} properties to JSON.`);
