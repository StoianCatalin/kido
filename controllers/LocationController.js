var express = require('express');
var database = require('../config/database');
var UserModel = database.import("../models/UserModel");
var LocationPointModel = database.import("../models/LocationPointModel");
var auth = require('../config/auth')();
var io = require('../socket');

module.exports = {

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