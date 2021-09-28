const mongoose = require("mongoose");

// Creating an publication schema
const PublicationSchema = mongoose.Schema({
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

// Create a publication model
const PublicationModel = mongoose.model("publications", PublicationSchema);

module.exports = PublicationModel;