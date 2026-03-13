const fs = require('fs');
const file = 'c:/Users/Ulises/Downloads/Puntacana_System/pagina web Punta Cana Investments/web/src/data/properties.ts';
let lines = fs.readFileSync(file, 'utf8').split('\n');

// Verify we are deleting the right thing
if (lines[409].includes('{') && lines[410].includes('id: 4,') && lines[411].includes('slug: "condos-cruise-on-land-resort-punta-cana",')) {
    console.log("Deleting property ID 4 at lines 410-530");
    lines.splice(409, 121);
    fs.writeFileSync(file, lines.join('\n'));
    console.log("Deleted successfully.");
} else {
    console.log("Verification failed, lines changed.");
    console.log("Line 410:", lines[409]);
    console.log("Line 411:", lines[410]);
    console.log("Line 412:", lines[411]);
}
