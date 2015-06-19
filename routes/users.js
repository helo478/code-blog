/**
 * Created by Donald on 5/22/2015.
 */

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var passwordHasher = require("../classes/PasswordHasher");

/**
 * @augments mongoose.Model
 */
var User = require('../models/user');

/* get all users */
router.get("/", function(req, res) {

  var query = User.find({}).select({"passwordHash": false});

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

  var query = User.findOne({
      "_id": req.params["id"]
    })
    .select({
      "passwordHash": false
    });

  query.exec(function(err, user) {
    if (err) {
      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify({"error": "Unable to find user by id"}));
      return;
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

/* For requests to a user's blogs, parse the user from the userId and route the request to the userBlogs middleware */
router.use("/:userId/blogs", function(req, res, next) {

  var query = User.findOne({
    "_id": req.params["userId"]
  });

  query.exec(function(err, user) {
    if (err) {
      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify({"error": "Unable to find user by id"}));
      return;
    }

    if(!req.extras) { req.extras = {}; }
    req.extras.author = user;

    next();
  });
});
router.use("/:userId/blogs", require("../routes/userBlogs"));

module.exports = router;