var express = require('express');
var passport = require("passport");
var passportJWT = require("passport-jwt");
var database = require('../config/database');
var UserModel = database.import("../models/UserModel");
var cfg = require("./passport.config");
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeader()
};

module.exports = function() {
    var strategy = new Strategy(params, function(payload, done) {
        UserModel.find({
            where: {
                id: payload.id,
                last_token: payload.token
            }
        }).then(function(user) {
            if (user) {
                return done(null, user);
            } else {
                return done(new Error("User not found"), null);
            }
        });
    });
    passport.use(strategy);
    return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function() {
            return passport.authenticate("jwt", cfg.jwtSession);
        }
    };
};