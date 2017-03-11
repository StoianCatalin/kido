var express = require('express');
var database = require('../config/database');
var UserModel = database.import("../models/UserModel");
var jwt = require("jwt-simple");
var cfg = require("../config/passport.config");


module.exports = {

    post_register : function(req, res) {
        UserModel.create(req.body).then(function(user) {
            var payload = {
                id: user.id
            };
            var token = jwt.encode(payload, cfg.jwtSecret);
            res.json({
                token: token
            });
        }, function(err) {
            res.send(err.errors);
        });
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
                    var payload = {
                        id: user.id
                    };
                    var token = jwt.encode(payload, cfg.jwtSecret);
                    res.json({
                        token: token
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
    }

};