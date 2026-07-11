const { properties: localProperties } = require('./src/data/properties.js');

const sanityIds = new Set([1000, 999, 998, 17, 9, 8, 7, 4, 3]); // Simulated Sanity IDs
const localOnlyProperties = localProperties.filter(p => !sanityIds.has(p.id));

const mergedProperties = []; // Simulated merged

const properties = [...mergedProperties, ...localOnlyProperties].sort((a, b) => {
  return b.id - a.id;
});

const nonLandProperties = properties.filter(p => p.type !== "land");
const saleProperties = nonLandProperties.filter(p => p.status === "sale").slice(0, 6);

console.log(saleProperties.map(p => p.title));
