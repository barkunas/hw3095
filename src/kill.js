import { readFileSync } from 'fs';
const PID = +readFileSync('pid')
process.kill(PID);