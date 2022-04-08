const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');

const { response } = require('express');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname,'views'));

//nastavuje adresu takzvanych statických souborů UwU
app.use(express.static('public'));
//nastavení endpointu na kterém server provede odpověd a pošle klientovi
app.get('/about', (req, res) => {
    res.send('Webserver IT2')
    res.end();
});
//endpoint serveru ocekavajíci dva perymetry - user a password 
//priklad:  http://localhost:3000/secret?user=Pepa&password=69
app.get('/secret', (req, res) => {
    let user = req.query.user;
    let password = req.query.password;
    res.send(`Uživatel: ${user} | heslo: ${password}`);
    res.end();
});

app.get('/save', (req, res) => {
    let player = req.query.player;
    let points = req.query.points;
    res.send(`Hráč: ${player} | Body: ${points}`);
    res.end();
});


const urlencodedParser = bodyParser.urlencoded({extended:false});


app.post('/save',urlencodedParser, (req, res) => {
    let player = req.body.player || 'anonym';
    let points = req.body.points;
    let date = new Date();
    let str = `${player},${points},${date.toLocaleDateString()},${date.toLocaleTimeString()}\r\n`;
    fs.appendFile('./data/result.csv', str,function(err){
        if(err){
            console.error(err);
            return res.status(400).json({
                success: false,
                message: 'byla zjistěna chyba při zápisu do souboru',
            })
        }
    });
    res.redirect(301,'/');
});

app.get('/results',(req,res)=>{
    csv().fromFile('./data/result.csv')
    .then(data=>{
        console.log(data);
        //res.send(data);
        res.render('results.pug',{'players':data,'nadpis':'vysledky hráču'});
        
    })
    .catch(err=>{
        console.log(err);
    })
})

app.listen(port, () => {
    console.log(`Server funguje na portu ${port}`);
});