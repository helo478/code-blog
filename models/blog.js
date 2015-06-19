/**
 * Created by Donald on 6/18//2015.
 */

var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  subject: {type: String, required: true},
  body: {type: String, required: true}
});

var Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;