const mongoose = require("mongoose");

// Creating an author schema
const AuthorSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        minimum: 1,
    },
    name: {
        type: String,
        required: true,
    },
    books: {
        type: [String],
        required: true,
    },
});

// Create a author model
const AuthorModel = mongoose.model("authors", AuthorSchema);

module.exports = AuthorModel;