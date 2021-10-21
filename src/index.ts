import express from 'express'
import fs from 'fs'
import variants from './variants.json'
import bodyParser from 'body-parser'
import path from 'path'

fs.writeFileSync('pid', process.pid.toString());
const app = express();
const PORT = 3000;
const variantsTyped = <IKeyStringString>variants;

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
            res.send(obj);
            break;
        case 'xml':
            const xml = convertToXML(JSON.parse(obj.toString()));
            res.send(xml);
            break;
        case 'html':
            const html = convertToHTNL(JSON.parse(obj.toString()));
            res.send(html);
            break;
        default:
            const json = JSON.parse(obj.toString());
            res.json(json);
            break;
    }
    res.end()

});
app.get('/error', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})
app.post<'/vote', {}, {}, IKeyStringString>('/vote', (req, res) => {
    const voteId = req.body.voteId;
    const origin = req.headers.origin;
    //if (origin) res.setHeader("Location", origin)
    const queryVoteIdtext = `?voteId=${voteId}`
    try {
        if (variants.hasOwnProperty(voteId)) {
            const obj = JSON.parse(fs.readFileSync('./results.json').toString());
            obj[voteId] += 1;
            fs.writeFileSync('./results.json', JSON.stringify(obj));
            //ВОТ ЭТОТ ВАРИАНТ ПОВТОРНО ГОЛОСУЕТ ПРИ ОБНОВЛЕНИИ СТРАНИЦЫ
            //res.sendFile(path.resolve('public/index.html'))
            res.redirect(`/${queryVoteIdtext}`)
        } else {
            res.redirect(`/error${queryVoteIdtext}`)
        }

    } catch (error) {
        res.redirect(`/error${queryVoteIdtext}`)
    }
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});

function convertToXML(json: IKeyStringNumber) {
    var xml = '<results>';
    for (const id in json) {
        xml += `<${id}>${json[id]}</${id}>`;
    };
    xml += '</results>';
    return xml
}
function convertToHTNL(json: IKeyStringNumber) {
    var html = '<div>';
    for (const id in json) {
        html += `<div>${variantsTyped[id]}</div><div>${json[id] || 0}</div><Br>`;
    };
    html += '</div>';
    return html
}

interface IKeyStringString {
    [key: string]: string
}

interface IKeyStringNumber {
    [key: string]: string
}

