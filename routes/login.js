/**
 * Created by Donald on 6/13/2015.
 */

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var passwordHasher = require("../classes/PasswordHasher");
var Session = require("../classes/Session");
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

  User.findOne({ "userName": userName }, function(err, user) {
    if (err) {
      Error.throw(res, "Unable to search users collection", err);
      return;
    }

    if (!user) {
      Error.throw(res, "No result for username '" + userName + "'");
      return;
    }

    var userObject = user.toObject();
    var passwordHash = userObject["passwordHash"];

    passwordHasher.comparePasswordToHash(password, passwordHash, function(err, success) {
      if (err) {
        Error.throw(res, "Unable to compare password to hash", err);
        return;
      }

      userObject.passwordHash = null;

      if(success) {
        userObject.session = Session.createSession(userObject["_id"]);

        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(userObject));
      }
      else {
        Error.throw(res, "Incorrect userName or password");
      }
    });
  });
});

module.exports = router;