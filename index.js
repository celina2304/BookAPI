require("dotenv").config();
// Frame work
const { response } = require("express");
const express = require("express");
const mongoose = require("mongoose");
// Database
const database = require("./database/index");

// Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");
const { parse } = require("dotenv");

// Microservices routes
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication");

// Initializing express
const shapeAI = express();

// Configurations
shapeAI.use(express.json());

// Establish database connections
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connection established!!"));
// using environment variable for security purposes and code will be injected only at runtime

// Initializing Microservices
shapeAI.use("/book", Books);
shapeAI.use("/author", Authors);
shapeAI.use("/publication", Publications);

shapeAI.listen(3000, () => console.log("server is running!"));