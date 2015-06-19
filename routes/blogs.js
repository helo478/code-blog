/**
 * Created by Donald on 5/25/2015.
 */

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var session = require('../classes/Session');

/**
 * @augments mongoose.Model
 */
var Blog = require('../models/blog');

/* get blogs by user id */
router.get("/", function(req, res) {

  var query = Blog.find({}); // TODO filter by user id
  // TODO attach author reference

  query.exec(function(err, blogs) {
    if (err) {
      throw err;
    }

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(blogs));
  });
});

/* post a new blog */
router.post("/", function(req, res) {

  var userId = req.headers["userid"];
  var token = req.headers["token"];

  var data = req.body;
  data.author = userId;

  // if request has valid userid and sessionToken
  if (session.verifyToken(userId, token)) {
    var newBlog = Blog(data);
    newBlog.save(function (err, blog) {
      if (err) {
        console.log(err);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify("missing or malformed data for post blog"));
        return;
      }

      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify(blog));
    });
  }
  else {
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify("request to post blog could not be authenticated"));
  }
})

/* get the blog by id */
router.get("/:blogId", function(req, res) {

  var query = Blog.findOne({
    "_id": req.params["blogId"]
  })
  .populate("author");

  query.exec(function(err, thing) {
    if (err) {
      throw err;
    }

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(thing));
  });
});

/* insert a new thing */
router.post("/", function(req, res) {

  var data = req.body;

  var newThing = Thing({
    'foo': data.foo,
    'bar': data.bar,
    'baz': data.baz,
    'createdOn': Date.now(),
    'editedOn': null
  });

  newThing.save(function(err, thing) {
    if (err) {
      throw err;
    }

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify({
      'success': true,
      'thing': thing
    }));
  });
});

/* update an existing thing */
router.put("/:id", function(req, res) {

  Thing.findOne({ "_id": req.params["id"] }, function(err, thing) {

    var data = req.body;

    thing.foo = data['foo'];
    thing.bar = data['bar'];
    thing.baz = data['baz'];

    thing.save(function(err, thing) {
      if (err) {
        throw err;
      }

      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify({
        'success': true,
        'thing': thing
      }));
    });
  });
});

/* delete a thing */
router.delete("/:id", function(req, res) {

  Thing.find({"_id": req.params["id"]}).remove(function (err) {
    if (err) {
      throw err;
    }

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify({
      "success": true
    }));
  });
});

module.exports = router;