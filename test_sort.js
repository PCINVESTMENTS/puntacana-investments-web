const { properties } = require('./src/data/properties.js');
const prop = properties.find(p => p.id === 1005);
console.log("Villa Canoa featured:", prop.featured);
const featuredProps = properties.filter(p => p.featured === true).sort((a, b) => b.id - a.id);
console.log(featuredProps.map(p => ({ id: p.id, title: p.title })));
