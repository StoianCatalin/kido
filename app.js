var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressControllers = require('express-controller');
var database = require('./config/database');
var middleware = require('./middleware/middleware');


var app = express();
var router = express.Router();

var auth = require("./config/auth.js")();

var index = require('./routes/index');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public/dist')));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(auth.initialize());

express.middleware = middleware;

app.use('/api', router);
//Tell expressControllers to use the controllers-directory, and use bind() to set up routing.
expressControllers
    .setDirectory( __dirname + '/controllers')
    .bind(router);

app.use(router);

app.use('/', index);

// error handler
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(err.stack)
});


module.exports = app;
