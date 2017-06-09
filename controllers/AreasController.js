var express = require('express');
var database = require('../config/database');
var UserModel = database.import("../models/UserModel");
var InteresPointModel = database.import("../models/InteresPointModel");
var InteresAreaModel = database.import("../models/InteresAreaModel");
var LocationPointModel = database.import("../models/LocationPointModel");
var auth = require('../config/auth')();
var io = require('../socket');

module.exports = {

    /**
	@brief Aceasta metoda este utilizata pentru crearea unui poligon, 
			ca zona de siguranta pentru utilizatorii child
	@how Se utilizeaza <points>, in care sunt stocate toate punctele care urmeaza a forma
			poligonul si le adauga in baza de date
	*/
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
    
    /**
	@brief Aceasta metoda este utilizata pentru crearea unui cerc, 
			ca zona de siguranta pentru utilizatorii child
	@how Se utilizeaza <points>, in care sunt stocate toate punctele care urmeaza a forma
			poligonul si le adauga in baza de date
	
	*/
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
	
	/**
	@brief Returneaza toate zonele de interes pentru utilizatorul autentificat
	@how Se foloseste JWT pentru a lua utiizatorul autentificat, interogheaza baza de date si returneaza toate zonele
	*/
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
	
	/**
	@brief Returneaza zonele de interes a parintelui utilizatorului conectat (copil)
	@how how Se foloseste JWT pentru a lua utiizatorul autentificat, interogheaza baza de date si returneaza toate zonele
	*/
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
	
	
	/**
	@brief Sterge o zona de interes pentru utilizatorul autentificat
	@how how Se foloseste JWT pentru a lua utiizatorul autentificat si sterge din baza de date toate punctele + interesArea-ul respeciv
	*/
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