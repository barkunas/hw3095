const fs = require('fs');
const PID = +fs.readFileSync('pid')
process.kill(PID);