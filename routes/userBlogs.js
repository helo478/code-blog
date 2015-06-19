/**
 * Created by Donald on 5/22/2015.
 */

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var Blog = require('../models/blog');

/* get all users */
router.get("/", function(req, res) {

  var author = req.extras.author;

  var query = Blog.find({"author": author});

  query.exec(function(err, users) {
    if (err) {
      throw err;
    }

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(users));
  });
});

module.exports = router;