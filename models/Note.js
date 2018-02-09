var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    noteBody: String,
    contentNum: String
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;