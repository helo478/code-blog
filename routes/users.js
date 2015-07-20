/**
 * Created by Donald on 5/22/2015.
 */

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var session = require('../classes/Session');

const INVALID_SESSION = 201;
const ACCESS_DENIED = 202;
const DATABASE_ERROR = 203;

/**
 * @augments mongoose.Model
 */
var User = require('../models/user');

/* get all users */
router.get("/", function(req, res) {

  var query = User.find({}).select({"passwordHash": false});

  query.exec(function(err, users) {

    if (err) {
      res.setHeader("content-type", "application/json");
      res.status(DATABASE_ERROR);
      res.send(JSON.stringify({
        error: "unable to get users from database; " + err
      }));
      return;
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
      res.status(DATABASE_ERROR);
      res.send(JSON.stringify({
        error: "Unable to find user by id" + err
      }));
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

  // hash the password
  new PasswordHasher().hashPassword(password, function(passwordHash) {

    // create a new user model
    var newUser = User({
      name: data.name,
      username: data.username,
      passwordHash: passwordHash
    });

    // save the new user model
    newUser.save(function(err, user) {

      if (err) {
        res.setHeader("content-type", "application/json");
        res.status(DATABASE_ERROR);
        res.send(JSON.stringify({
          error: "Unable to persist new user model; " + err
        }));
        return;
      }

      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify({
        success: true,
        id: user._id,
        username: user.name
      }));
    });
  });
});

/* update an existing user */
router.put("/:id", function(req, res) {

  var userId = req.headers["userid"];
  var token = req.headers["token"];

  if (session.verifyToken(userId, token)) { // If there is a valid authenticated session
    if (userId == req.params["id"]) { // If the user is updating their own account

      // Get the model for the user account from the database
      User.findOne({"_id": req.params["id"]}, function (err, user) {

        if (err) {
          res.setHeader("content-type", "application/json");
          res.status(DATABASE_ERROR);
          res.send(JSON.stringify({
            error: "unable to get the user by id; " + err
          }));
          return;
        }

        var data = req.body;

        // update the model
        user.name = data["name"];
        user.username = data["username"];
        user.password = data["password"];
        user.emailAddress = data["emailAddress"];
        user.firstName = data["firstName"];
        user.lastName = data["lastName"];

        // save the updated user
        user.save(function (err, user) {

          if (err) {
            res.setHeader("content-type", "application/json");
            res.status(DATABASE_ERROR);
            res.send(JSON.stringify({
              error: "unable to save updated user; " + err
            }));
            return;
          }

          res.setHeader("content-type", "application/json");
          res.send();
        });
      });
    }
    else {
      res.setHeader("content-type", "application/json");
      res.status(ACCESS_DENIED);
      res.send();
    }
  }
  else {
    res.setHeader("content-type", "application/json");
    res.status(INVALID_SESSION);
    res.send();
  }
});

/* delete a user's own account */
router.delete("/:id", function(req, res) {

  var userId = req.headers["userid"];
  var token = req.headers["token"];

  if (session.verifyToken(userId, token)) { // If there is a valid authenticated session
    if (userId == req.params["id"]) { // If the user is deleting their own account

      // get the model for the user account from the database
      User.find({
        "_id": req.params["id"]
      })
        .remove(function (err, status) {

        if (err) {
          res.setHeader("content-type", "application/json");
          res.status(DATABASE_ERROR);
          res.send(JSON.stringify({
            error: "unable to delete the user by id; " + err
          }));
          return;
        }

        res.setHeader("content-type", "application/json");
        res.send();
      });
    }
    else {
      res.setHeader("content-type", "application/json");
      res.status(ACCESS_DENIED);
      res.send();
    }
  }
  else {
    res.setHeader("content-type", "application/json");
    res.status(INVALID_SESSION);
    res.send();
  }
});

/* For requests to a user's blogs, parse the user from the userId and route the request to the userBlogs middleware */
router.use("/:userId/blogs", function(req, res, next) {

  var query = User.findOne({
    "_id": req.params["userId"]
  });

  query.exec(function(err, user) {

    if (err) {
      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify({
        "error": "Unable to find user by id; " + err
      }));
      return;
    }

    // Add the user for the userId as an author for the next middleware function
    if(!req.extras) { req.extras = {}; }
    req.extras.author = user;

    next();
  });
});
router.use("/:userId/blogs", require("../routes/userBlogs"));

module.exports = router;