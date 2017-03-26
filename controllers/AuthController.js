var express = require('express');
var database = require('../config/database');
var UserModel = database.import("../models/UserModel");
var jwt = require("jwt-simple");
var cfg = require("../config/passport.config");


module.exports = {

    post_register : function(req, res) {
    	console.log(req.body);
    	if (req.body.nume && req.body.prenume && req.body.email && req.body.password && req.body.data_nastere)
	        UserModel.create(req.body).then(function(user) {
	            var token = jwt.encode(payload, cfg.jwtSecret);
	            var payload = {
	                id: user.id,
	                token: token
	            };
	            user.lastToken = token;
	            user.save();
	            res.json({
	                token: token
	            });
	        }, function(err) {
	            res.send(err.errors);
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
                	var token = jwt.encode(payload, cfg.jwtSecret);
                    var payload = {
                        id: user.id,
                        token: token
                    };
                    user.lastToken = token;
                    user.save();
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
    },

    post_logout : function(req, res) {
    	var token = req
    }

};