var express = require('express');
var database = require('../config/database');
var UserModel = database.import("../models/UserModel");
var LocationPointModel = database.import("../models/LocationPointModel");
var NotificationModel = database.import("../models/NotificationModel");
var auth = require('../config/auth')();
var io = require('../socket');

module.exports = {

	/**
	@brief Returneaza datele despre utilizatorul conectat
	@how Returneaza datele exceptand datele securizate prin intermediul JWT
	*/
    get_me : [auth.authenticate(), function(req, res) {
        var me = JSON.parse(JSON.stringify(req.user));
        me.password = undefined;
        me.last_token = undefined;
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(me));
    }],
	/**
	@brief Verifica daca referinta utilizata pentru inregistrarea copilului exista
	@how Primeste ca parametru referinta si verifica in BD daca ea este atasata unui user parinte
	*/
    get_ifparentexist_reference : function(req, res, reference) {
        UserModel.find({
            where: {
                reference: reference
            }
        }).then(function(user) {
            if (user) {
                res.sendStatus(200);
            }
            else{
                res.sendStatus(404);
            }
        }, function() {
            res.sendStatus(501);
        });
    },

	/**
	@brief Returneaza numele camerei parintelui
	@how Numele camerei se formeaza prin stringul room + id-ul parintelui
	*/
    get_parentroomname: [auth.authenticate(), function(req, res) {
        var me = req.user;
        var roomName = 'room' + me.id;
        res.status(200).json({roomName: roomName});
    }],

	/**
	@brief Pentru un copil returneaza datele parintelui
	@how Pe baza JWT, pentru utilizatorul autentificat returneaza, interogand BD, datele parintelui
	*/
    get_myparent: [auth.authenticate(), function(req, res) {
       if (req.user.type == 'child')
           UserModel.find({
               where: {
                   id: req.user.parentId
               },
               order: 'locations.createdAt DESC',
               include: [{
                   model: LocationPointModel,
                   as: 'locations'
               }]
           }).then(function(user) {
               delete user.password;
               delete user.last_token;
               res.json(user);
           }, function() {
               res.status(404).json({message: 'Parent not found!'});
           });
       else
           res.status(409).json({message: 'You are a parent!'});
    }],

	/**
	@brief Pentru un parinte returneaza datele copiilor
	@how Pe baza JWT, pentru utilizatorul autentificat returneaza, interogand BD, datele copiilor
	*/
    get_mychilds: [auth.authenticate(), function(req, res) {
        if (req.user.type == 'parent') {
            UserModel.findAll({
                attributes: ['id', 'nume', 'prenume', 'type', 'parentId'],
                where: {
                    parentId: req.user.id
                },
                order: 'locations.createdAt DESC',
                include: [{
                    model: LocationPointModel,
                    as: 'locations'
                }]
            }).then(function(users) {
                res.json(users);
            }, function(err) {
                res.status(404).json({message: 'No childs found.'});
            })
        }
        else
            res.status(409).json({message: 'You are a child!'});
    }],

	/**
	@brief Sterge un copil pentru parintele autentificat 
	@how Pe baza JWT, pentru utilizatorul conectat (parinte), sterge unul din copiii sai
	*/
    delete_delete: [auth.authenticate(), function(req, res) {
        UserModel.find({
            where: {
                id: req.body.id
            }
        }).then(function(user) {
            if (req.user.id == user.parentId) {
                LocationPointModel.destroy({
                        where: {
                            user_fk: req.body.id
                        }
                    }
                ).then(function() {
                    NotificationModel.destroy({
                        where: {
                            child_fk: user.id
                        }
                    })
                }).then(function() {
                    UserModel.destroy({
                        where: {
                            id : req.body.id,
                            parentId : req.user.id
                        }
                    }).then(function(){
                        res.sendStatus(200);
                    }, function(err) {
                        console.log(err);
                        res.sendStatus(500);
                    });
                });
            }
            else {
                res.sendStatus(401);
            }
        });
    }]

};