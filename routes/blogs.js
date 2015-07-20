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

    // Create a blog object from the data and set system-derived values
    data.comments = [];
    data.createdOn = Date.now();
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
});

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

module.exports = router;