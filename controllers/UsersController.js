var express = require('express');
var database = require('../config/database');
var UserModel = database.import("../models/UserModel");
var auth = require('../config/auth')();

UserModel.sync();

module.exports = {

    get_me : [auth.authenticate(), function(req, res) {
        var me = req.user;
        me = JSON.stringify(me);
        me = JSON.parse(me);
        me.password = undefined;
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(me));
    }]

};