import fs from 'fs';
import parseAVAFields from '../courses/AvailabilityParser';
import path from 'path';

const avaPath = path.join(__dirname, 'avail-example.xml');
const xml = fs.readFileSync(avaPath, 'utf8').replace("\ufeff", "");

it('subtracts 5 - 1 to equal 4 in TypeScript', async () => {
    const data = await parseAVAFields(xml);
    console.log(data);
});
