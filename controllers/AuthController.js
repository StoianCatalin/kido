var express = require('express');
var database = require('../config/database');
var UserModel = database.import("../models/UserModel");
var LocationPoint = database.import("../models/LocationPointModel");
var jwt = require("jwt-simple");
var cfg = require("../config/passport.config.js");
var auth = require("../config/auth")();

/**
@brief creeaza un string random
@how stringul se creeaza pe baza unui parametru random care reprezinta lungimea stringului
*/
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

	/**
	@brief creeaza un utilizator nou (copil / parinte)
	@how pe baza parametrilor primiti decide daca sa creeze copil sau parinte, il insereaza in BD, creeaza un token privat pentru el si 
		il trimite inapoi utilizatorului pentru a-l folosi in scopul actiunilor urmatoare
	*/
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

	/**
	@brief Verifica daca credentialele sunt valide si autentifica utilizatorul
	@how Primeste email si password, verifica daca exista in BD, iar daca exista creeaza un token ce 
			urmeaza a fi folosit in actiunile urmatoare
	*/
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

	/**
	@brief Invalideaza tokenul
	@how Sterge token_key din baza de date
	*/
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