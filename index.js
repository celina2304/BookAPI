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

// Initializing express
const shapeAI = express();

// Configurations
shapeAI.use(express.json());

// Establish database connections
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connection established!!"));
// using environment variable for security purposes and code will be injected only at runtime

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
        //includes - array with only strings on number it will work
        //not work for arrays in array
        //matches req.params.category with every element returnes true/false
    
    if(getSpecificBooks.length === 0){
        return res.json({
            error: `No book found for the category of ${req.params.category}`,
        });
    }
    return res.json({books: getSpecificBooks});
});

/*
Route           /a
Description     to get a list of books based on author
Access          public
Parameters      authorId
Method          get
*/
shapeAI.get("/a/:authorId", (req,res) => {
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

/* 
Route           /book/update
Description     to update title of a book
Access          public
Parameters      isbn
Method          PUT
*/
shapeAI.put("/book/update/:isbn", (req,res) => {
    //forEach better than map as it updates the existing array
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            book.title = req.body.bookTitle;
            return;
        }
    });
    return res.json({books: database.books});
});
/* 
Route           /book/author/update
Description     to update/add new author
Access          public
Parameters      isbn
Method          PUT
*/
shapeAI.put("/book/author/update/:isbn", (req,res) => {
    // update book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            return book.authors.push(req.body.newAuthor);
        }
    });
    //update author database
    database.authors.forEach((author) => {
        if(author.id === req.body.newAuthor) {
            return author.books.push(req.params.isbn);
        }
    });
    return res.json({
        books: database.books, 
        authors: database.authors, 
        message: "New author was added",});
});

/*
Route           /author/update
Description     to update author details
Access          public
Parameters      name
Method          PUT
*/
shapeAI.put("/author/update/:name", (req,res) => {
    //for updating one element (name)
    database.authors.forEach((author) => {
        if(author.name === req.params.name) {
            author.name = req.body.authorName;
            return;
        }
    });
    return res.json({authors: database.authors});
});

/*   hold
Route           /publication/update
Description     to update publication name using id
Access          public
Parameters      id
Method          PUT
*/
shapeAI.put("/publication/update/:id", (req,res) => {
    //for updating one element (name)
    
    database.publications.forEach((publication) => {
        //for req.params.id you'll have to parse it
        if(publication.id === req.body.pubId) {
            publication.name = req.body.publicationName;
            return;
        }
    });
    return res.json({publications: database.publications});
});

/*
Route           /publication/update/book
Description     to update/add new book to a publication
Access          public
Parameters      isbn
Method          PUT
*/
shapeAI.put("/publication/update/book/:isbn", (req,res) => {
    //for update publication database
    database.publications.forEach((publication) => {
        if(publication.id === req.body.pubId) {
            return publication.books.push(req.params.isbn);
        }
    });
    // update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn){
            book.publication = req.body.pubId;
            return;
        } 
    });
    return res.json({books: database.books, publications: database.publications});
});

/*
Route           /book/delete
Description     to delete a book
Access          public
Parameters      isbn
Method          DELETE
*/
shapeAI.delete("/book/delete/:isbn", (req,res) => {    
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn);
    //new array
    database.books = updatedBookDatabase;
    return res.json({books: database.books});
});

/*
Route           /book/delete/author
Description     to delete an author from a book
Access          public
Parameters      isbn, authorId
Method          DELETE
*/
shapeAI.delete("/book/delete/author/:isbn/:authorId", (req,res) => {    
    //update book database
    database.books.forEach((book) => {
        //searching
        if(book.ISBN === req.params.isbn){
            //go inside object
            const newAuthorList = book.authors.filter(
                //filter authors and remove the authors with id given in params
                (author) => author !== parseInt(req.params.authorId));
        //updating list of authors
        book.authors = newAuthorList;
        return;
        }
    });
    //update author database
    database.authors.forEach((author) => {
        if(author.id === req.params.authorId){
            const newBooksList = author.books.filter(
                (book) => book !== req.params.isbn);
        author.books = newAuthorList;
        return;
        }
    });
    
    return res.json({book: database.books, author: database.authors});
});

/*
Route           /author/delete
Description     to delete a whole author
Access          public
Parameters      authorId
Method          DELETE
*/
shapeAI.delete("/author/delete/:authorId", (req,res) => {    
    const updatedAuthorDatabase = database.authors.filter(
        (author) => author.id !== parseInt(req.params.authorId));
    //new array
    database.authors = updatedAuthorDatabase;
    return res.json({authors: database.authors});
});

/*
Route           /publication/delete/book
Description     to delete a book from publication
Access          public
Parameters      isbn, pubId
Method          DELETE
*/
shapeAI.delete("/publication/delete/book/:isbn/:pubId", (req,res) => {    
    // update publication database
    database.publications.forEach((publication) => {
        if(publication.id === parseInt(req.params.pubId)){
            const newBooksList = publication.books.filter(
                (book) => book !== req.params.isbn);
        publication.books = newBooksList;
        return;
        }
    });
    // update book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.publication = 0;//no publication available
            return;
        }
    });

    return res.json({book: database.books, publications: database.publications});
});

/*
Route           /publication/delete
Description     to delete a publication
Access          public
Parameters      pubId
Method          DELETE
*/
shapeAI.delete("/publication/delete/:pubId", (req,res) => {    
    const updatedPublicationDatabase = database.publications.filter(
        (publication) => publication.id !== parseInt(req.params.pubId));
    //new array
    database.publications = updatedPublicationDatabase;
    return res.json({publications: database.publications});
});

shapeAI.listen(3000, () => console.log("server is running!"));