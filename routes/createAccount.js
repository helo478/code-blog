/**
 * Created by Donald on 6/14/2015.
 */

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var passwordHasher = require("../classes/PasswordHasher");
var Error = require('../classes/Error');

var User = require('../models/user');

router.post("/", function(req, res) {

  var userName = req.headers["username"];
  var password = req.headers["password"];

  if (!userName) {
    Error.throw(res, "requires header 'username'");
  }

  if (!password) {
    Error.throw(res, "requires header 'password'");
    return;
  }

  passwordHasher.hashPassword(password, function(err, passwordHash) {
    if(err) {
      Error.throw(res, "Unable to hash password", err);
      return;
    }

    User.create({
      userName: userName,
      passwordHash: passwordHash
    }, function(err, user) {
      if (err) {
        Error.throw(res, "Unable to persist account", err);
        return;
      }

      var userId = user._id;

      res.setHeader("content-type", "application/json");
      res.send({
        'success': true,
        'userId': userId
      })
    });
  });
});

module.exports = router;