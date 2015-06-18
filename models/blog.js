/**
 * Created by Donald on 6/18//2015.
 */

var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
  subject: String,
  body: String
});

var Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;