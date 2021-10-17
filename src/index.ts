import express from 'express'
import fs from 'fs'
import variants from './variants.json'
import bodyParser from 'body-parser'

fs.writeFileSync('pid', process.pid.toString())
const app = express();
const PORT = 3000;
const variantsTyped = variants as { [key: string]: string }

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/variants', (req, res) => {
    res.json(variants);
});
app.get('/stat', (req, res) => {
    const obj = fs.readFileSync('results.json');
    res.set('Cache-Control', 'public, max-age=0');
    switch (req.headers.accept) {
        case 'json':
            res.send(obj)
            break;
        case 'xml':
            const xml = convertToXML(JSON.parse(obj.toString()))
            res.send(xml);
            break;
        case 'html':
            const html = convertToHTNL(JSON.parse(obj.toString()))
            res.send(html);
            break;
        default:
            res.status(404).end()
            break;
    }
    res.end()

})
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

function convertToXML(json: { [key: string]: number }) {
    var xml = '<results>';
    for (const id in json) {
        xml += `<${id}>${json[id]}</${id}>`;
    };
    xml += '</results>';
    return xml
}
function convertToHTNL(json: { [key: string]: number }) {
    var html = '<div>';
    for (const id in json) {
        html += `<div>${variantsTyped[id]}</div><div>${json[id] || 0}</div><Br>`;
    };
    html += '</div>';
    return html
}

