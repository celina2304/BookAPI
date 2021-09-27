// Frame work
const { response } = require("express");
const express = require("express");

// Database
const database = require("./database/index");

// Initializing express
const shapeAI = express();

// Configurations
shapeAI.use(express.json());

/* 
Route           /
Description     to get all books
Access          public
Parameters      none
Method          get
*/
shapeAI.get("/", (req,res) => {
    return res.json({books: database.books});
});

/* 
Route           /is
Description     to get specific book based on isbn
Access          public
Parameters      isbn
Method          get
*/
shapeAI.get("/is/:isbn", (req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn);
    
    if(getSpecificBook.length === 0){
        return res.json({
            error: `No book found for the ISBN of ${req.params.isbn}`,
        });
    }
    return res.json({book: getSpecificBook});
});

/* 
Route           /books
Description     to get a list of books based on category
Access          public
Parameters      category
Method          get
*/
shapeAI.get("/books/:category", (req,res) => {
    const getSpecificBooks = database.books.filter(
        (book) => book.category.includes(req.params.category));
    
    if(getSpecificBooks.length === 0){
        return res.json({
            error: `No book found for the category of ${req.params.category}`,
        });
    }
    return res.json({books: getSpecificBooks});
});

/*          HOLD
Route           /a
Description     to get a list of books based on author
Access          public
Parameters      author
Method          get
*/
shapeAI.get("/a/:author", (req,res) => {
    var authorId = 0;
    database.authors.forEach((author) => {
        if(author.name === req.params.author){
            authorId = author.id;
            return;
        }
        return;
    })
    console.log(database.authors);
    const getSpecificBooks = database.books.filter(
        (book) => book.authors.includes(authorId));

    if(getSpecificBooks.length === 0){
        return res.json({
            error: `No books found for the author ${req.params.author}`,
        });
    }
    return res.json({books: getSpecificBooks});
});

/* 
Route           /authors
Description     to get all the authors
Access          public
Parameters      none
Method          get
*/
shapeAI.get("/authors", (req,res) => {
    return res.json({authors: database.authors});
});

/*
Route           /authors
Description     to get specific author
Access          public
Parameters      author
Method          get
*/
shapeAI.get("/authors/:author", (req,res) => {
    const getSpecificAuthor = database.authors.filter(
        (author) => author.name.includes(req.params.author));
    
    if(getSpecificAuthor.length === 0){
        return res.json({
            error: `No author found for name ${req.params.author}`,
        });
    }
    return res.json({author: getSpecificAuthor});
});

/*
Route           /au
Description     to get a list of authors based on a book's isbn
Access          public
Parameters      isbn
Method          get
*/
shapeAI.get("/au/:isbn", (req,res) => {
    const getSpecificAuthors = database.authors.filter(
        (author) => author.books.includes(req.params.isbn));
    
    if(getSpecificAuthors.length === 0){
        return res.json({
            error: `No author found for the book ${req.params.isbn}`,
        });
    }
    return res.json({authors: getSpecificAuthors});
})
/* 
Route           /publications
Description     to get all the publications
Access          public
Parameters      none
Method          get
*/
shapeAI.get("/publications", (req,res) => {
    return res.json({publications: database.publications});
});
/*
Route           /punlications
Description     to get specific publication
Access          public
Parameters      publication
Method          get
*/
shapeAI.get("/publications/:publication", (req,res) => {
    const getSpecificPublication = database.publications.filter(
        (publication) => publication.name.includes(req.params.publication));
    
    if(getSpecificPublication.length === 0){
        return res.json({
            error: `No publication found ${req.params.publication}`,
        });
    }
    return res.json({publication: getSpecificPublication});
})
/*             
Route           /publication
Description     to get a list of publication based on a book's isbn
Access          public
Parameters      isbn
Method          get
*/
shapeAI.get("/publication/:isbn", (req,res) => {
    const getSpecificPublications = database.publications.filter(
        (publication) => publication.books.includes(req.params.isbn));

    if(getSpecificPublications.length === 0){
        return res.json({
            error: `No book found for the category of ${req.params.category}`,
        });
    }
    return res.json({publications: getSpecificPublications});
});

/* 
Route           /book/new
Description     to post new book
Access          public
Parameters      none
Method          POST
*/
shapeAI.post("/book/new", (req,res) => {
    const {newBook} = req.body;
    database.books.push(newBook);
    return res.json({books: database.books, message: "book was added!!"});
});

/* 
Route           /author/new
Description     to add new author
Access          public
Parameters      none
Method          POST
*/
shapeAI.post("/author/new", (req,res) => {
    const {newAuthor} = req.body;
    database.authors.push(newAuthor);
    return res.json({authors: database.authors, message: "author was added!!"});
});
/* 
Route           /publication/new
Description     to add new publication
Access          public
Parameters      none
Method          POST
*/
shapeAI.post("/publication/new", (req,res) => {
    const {newPublication} = req.body;
    database.publications.push(newPublication);
    return res.json({publications: database.publications, message: "publication was added!!"});
});


shapeAI.listen(3000, () => console.log("server is running!"));