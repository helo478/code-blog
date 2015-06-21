/**
 * Created by Donald on 6/18//2015.
 */

var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  subject: {type: String, required: true},
  body: {type: String, required: true},
  comments: [{
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    text: {type: String, required: true},
    createdOn: {type: Date, required: true, default: Date.now},
    editedOn: {type: Date, required: false}
  }],
  createdOn: {type: Date, required: true, default: Date.now},
  editedOn: {type: Date, required: false}
});

var Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;