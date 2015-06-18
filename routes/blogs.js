/**
 * Created by Donald on 5/25/2015.
 */

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

/**
 * @augments mongoose.Model
 */
var Thing = require('../models/blog');

/* get blogs by user id */
router.get("/", function(req, res) {

  var query = Blog.find({}); // TODO filter by user id

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

  var data = req.body;
  var newBlog = Blog(data);
  newBlog.save(function(err, blog) {
    if (err) {
      console.log(err);
      return;
    }

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(blog));
  });

  // TODO verify authentication
})

/* get the thing by id */
router.get("/:id", function(req, res) {

  var query = Thing.find({
    "_id": req.params["id"]
  });

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