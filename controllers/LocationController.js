var express = require('express');
var database = require('../config/database');
var UserModel = database.import("../models/UserModel");
var LocationPointModel = database.import("../models/LocationPointModel");
var auth = require('../config/auth')();
var io = require('../socket');

module.exports = {

	/**
	@brief Returneaza locatia curenta a utilizatorului autentifcat
	@how Extrage din baza de date locatia curenta stocata in baza de date
	*/
    get_mylocation : [auth.authenticate(), function(req, res) {
        LocationPointModel.find({
            where: {
                user_fk: req.user.id
            },
            order: 'createdAt DESC'
        }).then(function(point) {
            res.json(point);
        }, function() {
            res.sendStatus(404);
        })
    }]

};