import express from 'express'
import fs from 'fs'
import variants from './variants.json'
import bodyParser from 'body-parser'

fs.writeFileSync('pid',process.pid.toString())

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/variants', (req, res) => {
    res.json(variants);
});

app.post('/stat', (req, res) => {
    const obj = JSON.parse(fs.readFileSync('results.json').toString());
    res.json(obj);
});

app.post('/vote', (req, res) => {
    const voteId = req.body.voteId as string;
    const obj = JSON.parse(fs.readFileSync('./results.json').toString());
    if (variants.hasOwnProperty(voteId)) {
        obj[voteId] += 1;
        fs.writeFileSync('./results.json', JSON.stringify(obj));
        res.json(variants);
    } else {
        res.json(variants);
    }
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});

