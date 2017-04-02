var express = require('express');
var database = require('../config/database');
var UserModel = database.import("../models/UserModel");
var auth = require('../config/auth')();

module.exports = {

    get_me : [auth.authenticate(), function(req, res) {
        var me = JSON.parse(JSON.stringify(req.user));
        me.password = undefined;
        me.last_token = undefined;
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(me));
    }]

};