const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

app = express();

mongoose.connect('mongodb://chrisjones0517!:StopPack9@ds141242.mlab.com:41242/heroku_r8jsw2vg', { useNewUrlParser: true, useFindAndModify: false });
const db = mongoose.connection;
const User = require('./models/user');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Mongoose connection to DB successful.');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.static('public'));
app.use(requireHTTPS);
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('home', {
        home: 'active'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        about: 'active'
    });
});

app.get('/portfolio', (req, res) => {
    res.render('portfolio', {
        portfolio: 'active'
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', {
        contact: 'active'
    });
});

app.get('/slot', (req, res) => {
    res.render('slot', {
        games: 'active'
    });
});

app.get('/blackjack', (req, res) => {
    res.render('blackjack', {
        games: 'active'
    });
});

app.get('/videoPoker', (req, res) => {
    res.render('videoPoker', {
        games: 'active'
    });
});

app.get('/leaderBoard', (req, res) => {
    User.find().sort({ money: -1 }).limit(10).select({ username: 1, money: 1 }).exec((err, users) => {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    });
});

app.post('/login', (req, res) => {

    User.findOne({
        username: req.body.username
    }, (err, user) => {
        if (err) {
            res.sendStatus(404);
            console.log(err);
        } else if (user === null) {
            res.send(false);
        } else {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(404);
                } else if (result) {
                    res.json(user);
                } else {
                    res.send(false);
                }
            });
        }
    });
});

app.post('/checkUsername', (req, res) => {
    User.findOne({
        username: req.body.username
    }, (err, user) => {
        if (err) {
            res.sendStatus(404);
            console.log(err);
        } else if (user === null) {
            res.send(true);
        } else {
            res.send(false);
        }
    });
});

app.post('/register', (req, res) => {

    bcrypt.hash(req.body.password, 10, (err, hash) => {

        if (err) {
            console.log(err);
            res.send(false);
        } else {

            const user = new User({ username: req.body.username, password: hash, money: req.body.money });

            user.save((err, user) => {
                if (err) {
                    console.log(err);
                    res.send(false);
                } else {
                    res.send(true);
                }
            });
        }
    });
});

app.post('/update', (req, res) => {
    User.findOneAndUpdate({
        username: req.body.username
    },
        { $set: { money: req.body.money } }, (err, user) => {
            if (err) {
                console.log(err);
            } else {
                res.send(true);
            }
        });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Listening on port:', port);
});

function requireHTTPS(req, res, next) {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && port !== 3000) {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}