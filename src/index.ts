import express from 'express'
import fs from 'fs'
import variants from './variants.json'

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/variants', (req, res) => {
    res.json(variants);
});

app.get('/stat', (req, res) => {
    const obj = JSON.parse(fs.readFileSync('results.json').toString());
    res.json(obj);
});

app.get('/vote', (req, res) => {
    const voteId = req.query.voteId as string;
    const obj = JSON.parse(fs.readFileSync('./results.json').toString());
    if (variants.hasOwnProperty(voteId)) {
        obj[voteId] += 1;
        fs.writeFileSync('./results.json', JSON.stringify(obj));
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});