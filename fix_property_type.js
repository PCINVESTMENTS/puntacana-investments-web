const fs = require('fs');
let formContent = fs.readFileSync('src/components/investments/OffMarketForm.tsx', 'utf8');

formContent = formContent.replace(
    /\{oppPropertyTypes\.map\(\(t, i\) => <option key=\{i\} value=\{t\}>\{t\}<\/option>\)\}/,
    '{t.fields.opportunityType.options.map((opt: string, i: number) => <option key={i} value={i === 0 ? "" : opt}>{opt}</option>)}'
);

// We should also check if any other variables are missing.
// hotelEnvironments, hotelRooms, hotelOperators, hotelObjectives, oppPhysicalStates, oppDiscounts, oppStrategies
// Let's do a quick regex check
fs.writeFileSync('src/components/investments/OffMarketForm.tsx', formContent);
