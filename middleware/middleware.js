var express = require('express');

module.exports = {
  ifUserIsLogged : function(req, res, next) {
      if (req.user) {
          next();
      }
      else {
          res.status(404)
              .send('Not found');
      }
  },
    ifUserIsNotLogged : function(req, res, next) {
        if (req.user) {
            res.status(500)
                .send('Bad Request');
        }
        else {
            next();
        }
    }
};