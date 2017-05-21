var express = require('express');
var app = express();
var database = require('./config/database');
var UserModel = database.import("./models/UserModel");
var LocationPointModel = database.import('./models/LocationPointModel');

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var socketioJwt   = require("socketio-jwt");
var config = require('./config/passport.config');

io.use(socketioJwt.authorize({
    secret: config.jwtSecret,
    handshake: true
}));

server.listen(4343);

io.on('connection', function(socket) {
    UserModel.find({
        where: {
            id: socket.decoded_token.id,
            last_token: socket.decoded_token.token
        }
    }).then(function(user) {
        if (user) {
            if (user.type == 'parent'){
                socket.join('room' + user.id);
                var currentRoom = Object.keys( io.sockets.adapter.sids[socket.id]);
                LocationPointModel.findAll({
                    where: {
                        user_fk: user.id
                    },
                    order: 'createdAt DESC'
                }).then(function(locations) {
                    delete user.password;
                    delete user.last_token;
                    user.locations = locations;
                    console.log(user);
                    socket.in(currentRoom[1]).emit('newConnection', {
                        id: user.id,
                        nume: user.nume,
                        prenume: user.prenume,
                        locations: locations,
                        type: user.type
                    });
                });
            }
            else {
                UserModel.find({
                    where: {
                        id: user.parentId
                    }
                }).then(function(parentUser) {
                    socket.join('room'+parentUser.id);
                    var currentRoom = Object.keys( io.sockets.adapter.sids[socket.id]);
                    LocationPointModel.findAll({
                        where: {
                            user_fk: user.id
                        },
                        order: 'createdAt DESC'
                    }).then(function(locations) {
                        delete user.password;
                        delete user.last_token;
                        user.locations = locations;
                        console.log(user);
                        socket.in(currentRoom[1]).emit('newConnection', {
                            id: user.id,
                            nume: user.nume,
                            prenume: user.prenume,
                            locations: locations,
                            type: user.type
                        });
                    });
                });
            }
        }
    });

    socket.on('moveOnMap', function(coordinates) {
        LocationPointModel.create({
            user_fk: socket.decoded_token.id,
            longitude: coordinates.longitude,
            latitude: coordinates.latitude
        }).then(function(newPoint) {
            var currentRoom = Object.keys( io.sockets.adapter.sids[socket.id]);
            socket.in(currentRoom[1]).emit('moveOnMap', {id: socket.decoded_token.id, latitude: newPoint.latitude, longitude: newPoint.longitude});
        });
    });
});

module.exports = io;