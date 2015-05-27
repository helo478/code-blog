/**
 * Created by Donald on 5/22/2015.
 */

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

//var passwordHasher = require('./classes/PasswordHasher.js');
// TODO figure out how to import the PasswordHasher
var passwordHasher = {
  'hashPassword': function(password) {
     return password;
  }
};

/**
 * @augments mongoose.Model
 */
var User = require('../models/user');

/* GET sample JSON users from the server */

/* get all users */
router.get("/", function(req, res) {

  var query = User.find({}).select({"password": false});

  query.exec(function(err, users) {
    if (err) {
      throw err;
    }

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(users));
  });
});

/* get the user by id */
router.get("/:id", function(req, res) {

  var query = User.find({
      "_id": req.params["id"]
    })
    .select({
      "password": false
    });

  query.exec(function(err, user) {
    if (err) {
      throw err;
    }

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(user));
  });
});

/* insert a new user */
router.post("/", function(req, res) {

  var data = req.body;
  var password = data.password;

  new PasswordHasher().hashPassword(password, function(passwordHash) {

    var newUser = User({
      'name': data.name,
      'username': data.username,
      'passwordHash': passwordHash
    });

    newUser.save(function(err, user) {
      if (err) {
        throw err;
      }

      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify({
        'success': true,
        'id': user._id,
        'username': user.name
      }));
    });
    
  });

});

/* update an existing user */
router.put("/:id", function(req, res) {

  User.findOne({ "_id": req.params["id"] }, function(err, user) {

    var data = req.body;

    user.name = data['name'];
    user.username = data['username'];
    user.password = data['password'];

    user.save(function(err, user) {
      if (err) {
        throw err;
      }

      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify({
        'success': true,
        'id': user._id,
        'username': user.name
      }));
    });
  });
});

/* delete a user */
router.delete("/:id", function(req, res) {

  User.find({ "_id": req.params["id"]}).remove(function(err, status) {
    if (err) {
      throw err;
    }

    console.log(status);

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify({
      "success": true
    }));
  });
});

module.exports = router;