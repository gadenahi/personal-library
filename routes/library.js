const mongoose = require("mongoose");
var Schema = mongoose.Schema;


var LibrarySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  comments: {
    type: Array,
    default: []
  },
  commentcount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Library", LibrarySchema);
