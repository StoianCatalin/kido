var express = require('express');
var database = require('../config/database');
var UserModel = database.import("../models/UserModel");
var LocationPoint = database.import("../models/LocationPointModel");
var jwt = require("jwt-simple");
var cfg = require("../config/passport.config.js");
var auth = require("../config/auth")();

var randomString = function(number) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < number; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

module.exports = {

    post_index: function(req, res) {
        res.sendStatus(200);
    },

    post_register : function(req, res) {
        if (req.body.nume && req.body.prenume && req.body.email && req.body.password)
            UserModel.create(req.body).then(function(user) {
                var tokenKey = randomString(40);
                var reference;
                if (req.body.type == 'parent') {
                    reference = randomString(10);
                    var payload = {
                        id: user.id,
                        token: tokenKey
                    };
                    var token = jwt.encode(payload, cfg.jwtSecret);
                    user.update({last_token: tokenKey, reference: reference}).then(function(user) {
                        LocationPoint.create({
                            user_fk: user.id,
                            longitude: 27.579407,
                            latitude: 47.1770846
                        }).then(function() {
                            res.json({
                                token: token
                            });
                        }, function() {
                            res.sendStatus(500);
                        });
                    }, function(err) {
                        res.status(409).json(err.errors);
                    });
                }
                else {
                    UserModel.find({where: {
                        reference: req.body.parent_reference
                    }}, function(err) {
                        res.status(409).json(err.errors);
                    }).then(function(parent) {
                        var payload = {
                            id: user.id,
                            token: tokenKey
                        };
                        var token = jwt.encode(payload, cfg.jwtSecret);
                        user.update({last_token: tokenKey, parentId: parent.id}).then(function(user) {
                            LocationPoint.create({
                                user_fk: user.id,
                                longitude: 27.579407,
                                latitude: 47.1770846
                            }).then(function() {
                                res.json({
                                    token: token
                                });
                            }, function() {
                                res.sendStatus(500);
                            });
                        }, function(err) {
                            res.status(409).json(err.errors);
                        });
                    })
                }
            }, function(err) {
                res.status(409).send(err.errors);
            });
        else {
            res.sendStatus(412);
        }
    },

    post_login : function(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        if (email && password) {
            UserModel.find({
                where: {
                    email: req.body.email
                }
            }).then(function(user) {
                if (user && user.validPassword(password)) {
                    var tokenKey = randomString(40);
                    var payload = {
                        id: user.id,
                        token: tokenKey
                    };
                    var token = jwt.encode(payload, cfg.jwtSecret);
                    user.last_token = tokenKey;
                    user.update({last_token: tokenKey}).then(function(user) {
                        res.json({
                            token: token
                        });
                    }, function(err){
                        res.status(409).json(err.errors);
                    });
                }
                else {
                    res.sendStatus(404);
                }
            }, function(err) {
                res.sendStatus(501);
            });
        }
        else {
            res.send("Bad parrameters!");
        }
    },

    post_logout : [ auth.authenticate(), function(req, res) {
        var me = req.user;
        UserModel.update(
            {last_token: null},
            {where: {id: me.id}}).then(function(){
            res.sendStatus(200);
        }, function(err) {
            res.sendStatus(500)
        });
    }]

};