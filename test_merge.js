const { properties } = require('./src/data/properties.js');
console.log(properties.find(p => p.id === 1005)?.title);
