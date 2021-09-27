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
shapeAI.get("/", async(req,res) => {
    //async await as mongoose is asynchronous
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

/* 
Route           /is
Description     to get specific book based on isbn
Access          public
Parameters      isbn
Method          get
*/
shapeAI.get("/is/:isbn", async(req,res) => {
    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn})
    //returns null if no data matches the condition
    if(!getSpecificBook){
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
shapeAI.get("/books/:category", async(req,res) => {
    const getSpecificBooks = await BookModel.findOne({category: req.params.category});
    
    if(!getSpecificBooks){
        return res.json({
            error: `No book found for the category of ${req.params.category}`,
        });
    }
    return res.json({books: getSpecificBooks});
});

/*
Route           /a
Description     to get a list of books based on author id
Access          public
Parameters      authorId
Method          get
*/
shapeAI.get("/a/:authorId", async(req,res) => {
    const getSpecificBooks = await BookModel.findOne({authors: req.params.authorId});

    if(!getSpecificBooks){
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
shapeAI.get("/authors", async(req,res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json({authors: getAllAuthors});
});

/*
Route           /authors
Description     to get specific author
Access          public
Parameters      author
Method          get
*/
shapeAI.get("/authors/:author", async(req,res) => {
    const getSpecificAuthor = await AuthorModel.findOne({name: req.params.author});
    
    if(!getSpecificAuthor){
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
shapeAI.get("/au/:isbn", async(req,res) => {
    const getSpecificAuthors = await AuthorModel.find({books: req.params.isbn});
    
    if(!getSpecificAuthors){
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
shapeAI.get("/publications", async(req,res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json({publications: getAllPublications});
});
/*
Route           /publications
Description     to get specific publication
Access          public
Parameters      pubId
Method          get
*/
shapeAI.get("/publications/:pubId", async(req,res) => {
    const getSpecificPublication = await PublicationModel.findOne({id: req.params.pubId});
    
    if(!getSpecificPublication){
        return res.json({
            error: `No publication found ${req.params.pubId}`,
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
shapeAI.get("/publication/:isbn", async(req,res) => {
    const getSpecificPublications = await PublicationModel.find({books: req.params.isbn});

    if(!getSpecificPublications){
        return res.json({
            error: `No book found for the category of ${req.params.isbn}`,
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
shapeAI.post("/book/new", async(req,res) => {
    const {newBook} = req.body;
    BookModel.create(newBook);//dosent return anything
    return res.json({message: "book was added!!"});
});

/* 
Route           /author/new
Description     to add new author
Access          public
Parameters      none
Method          POST
*/
shapeAI.post("/author/new", async(req,res) => {
    const {newAuthor} = req.body;
    AuthorModel.create(newAuthor);
    return res.json({message: "author was added!!"});
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
    PublicationModel.create(newPublication);
    return res.json({message: "publication was added!!"});
});

/* 
Route           /book/update
Description     to update title of a book
Access          public
Parameters      isbn
Method          PUT
*/
shapeAI.put("/book/update/:isbn", async(req,res) => {
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn//object to find
        },
        {
            title: req.body.bookTitle,//object to be changed
        },
        {
            new: true,//to return new updated data
        }
    );
    return res.json({books: updatedBook});
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