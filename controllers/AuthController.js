var express = require('express');
var database = require('../config/database');
var UserModel = database.import("../models/UserModel");
var jwt = require("jwt-simple");
var cfg = require("../config/passport.config");


module.exports = {

    post_register : function(req, res) {
        var randomString = function() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for( var i=0; i < 40; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        };
    	if (req.body.nume && req.body.prenume && req.body.email && req.body.password && req.body.data_nastere)
	        UserModel.create(req.body).then(function(user) {
	            var tokenKey = randomString();
                var payload = {
                    id: user.id,
                    token: tokenKey
                };
	            var token = jwt.encode(payload, cfg.jwtSecret);
                user.update({last_token: tokenKey}).then(function() {
                    res.json({
                        token: token
                    });
                }, function(err) {
	                res.json(err.errors);
                });
	        }, function(err) {
	            res.send(err.errors);
	        });
    	else {
    		res.sendStatus(412);
    	}
    },

    post_login : function(req, res) {
        var randomString = function() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for( var i=0; i < 40; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        };
        var email = req.body.email;
        var password = req.body.password;
        if (email && password) {
            UserModel.find({
                where: {
                    email: req.body.email
                }
            }).then(function(user) {
                if (user && user.validPassword(password)) {
                    var tokenKey = randomString();
                    var payload = {
                        id: user.id,
                        token: tokenKey
                    };
                    var token = jwt.encode(payload, cfg.jwtSecret);
                    user.last_token = tokenKey;
                    user.update({last_token: tokenKey}).then(function(user) {
                        console.log(user);
                        res.json({
                            token: token
                        });
                    }, function(err){
                        res.json(err.errors);
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

    post_logout : function(req, res) {
    	var token = req
    }

};