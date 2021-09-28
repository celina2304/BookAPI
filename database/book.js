const mongoose = require("mongoose");

// Creating a book schema
const BookSchema = mongoose.Schema({
    ISBN: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 10,
    },//required
    title: {
        type: String,
        required: true,
    },
    authors: {
        type: [Number],
        required: true,
        minItems: 1,
    },
    language: {
        type: String,
        required: true,
    },
    pubDate: {
        type: String,
        required: true,
    },
    numOfPage:{
        type: Number,
        required: true,
        minimum: 10,
    },
    category: {
        type: [String],
        required: true,
        minItems: 1
    },
    publication: {
        type: Number,
        required: true,
        minimum: 0,
    },
});

// Create a book model with books as document
const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;