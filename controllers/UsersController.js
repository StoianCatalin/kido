var express = require('express');
var database = require('../config/database');
var UserModel = database.import("../models/UserModel");
var LocationPointModel = database.import("../models/LocationPointModel");
var auth = require('../config/auth')();
var io = require('../socket');

module.exports = {

    get_me : [auth.authenticate(), function(req, res) {
        var me = JSON.parse(JSON.stringify(req.user));
        me.password = undefined;
        me.last_token = undefined;
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(me));
    }],
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

    get_parentroomname: [auth.authenticate(), function(req, res) {
        var me = req.user;
        var roomName = 'room' + me.id;
        res.status(200).json({roomName: roomName});
    }],

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

    delete_delete: [auth.authenticate(), function(req, res) {
        res.sendStatus(200);

    }]

};