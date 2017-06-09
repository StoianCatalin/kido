var express = require('express');
var database = require('../config/database');
var UserModel = database.import("../models/UserModel");
var InteresPointModel = database.import("../models/InteresPointModel");
var InteresAreaModel = database.import("../models/InteresAreaModel");
var LocationPointModel = database.import("../models/LocationPointModel");
var auth = require('../config/auth')();
var io = require('../socket');

module.exports = {

    post_create_polygon : [auth.authenticate(), function(req, res) {
        var points = req.body;
        InteresAreaModel.create({parent_fk: req.user.id, name: Math.floor(Date.now() / 1000)})
            .then(function(interesArea) {
                for(var index in points) {
                    InteresPointModel.create({
                        interesarea_fk: interesArea.id,
                        longitude: points[index].lng,
                        latitude: points[index].lat
                    }).then(function(interesPoint) {
                        interesArea.add(interesPoint);
                    });
                }
                res.json(interesArea);
            });
    }],
    post_create_circle : [auth.authenticate(), function(req, res) {
        var point = req.body;
        InteresAreaModel.create({parent_fk: req.user.id, name: Math.floor(Date.now() / 1000)})
            .then(function(interesArea) {
                InteresPointModel.create({
                    interesarea_fk: interesArea.id,
                    longitude: point.longitude,
                    latitude: point.latitude,
                    radius: point.radius
                }).then(function(interesPoint) {
                    interesArea.add(interesPoint);
                });
                res.json(interesArea);
            });
    }],
    get_polygon : [auth.authenticate(), function(req, res) {
        InteresAreaModel.findAll({
            where: {
                parent_fk: req.user.id
            },
            include: [{
                model: InteresPointModel,
                as: 'interespoints'
            }]
        }).then(function(interesAreas) {
            res.json(interesAreas);
        });
    }],
    get_polygon_parent : [auth.authenticate(), function(req, res) {
        InteresAreaModel.findAll({
            where: {
                parent_fk: req.user.parentId
            },
            include: [{
                model: InteresPointModel,
                as: 'interespoints'
            }]
        }).then(function(interesAreas) {
            res.json(interesAreas);
        });
    }],
    delete_polygon : [auth.authenticate(), function(req, res) {
        InteresPointModel.destroy({
            where: {
                interesarea_fk: req.body.id
            }
        }).then(function() {
            InteresAreaModel.destroy({
                where: {
                    id: req.body.id
                },
                cascade: true
            }).then(function() {
                res.sendStatus(200);
            }, function(err) {
                console.log(err);
                res.sendStatus(501);
            });
        });
    }]

};