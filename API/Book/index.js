// Initializing Router
const Router = require("express").Router();

// Database models
const BookModel = require("../../database/book");

/* 
Route           /
Description     to get all books
Access          public
Parameters      none
Method          get
*/
Router.get("/", async(req,res) => {
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
Router.get("/is/:isbn", async(req,res) => {
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
Route           /c
Description     to get a list of books based on category
Access          public
Parameters      category
Method          get
*/
Router.get("/c/:category", async(req,res) => {
    const getSpecificBooks = await BookModel.find({category: req.params.category});
    
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
Router.get("/a/:authorId", async(req,res) => {
    const getSpecificBooks = await BookModel.findOne({authors: parseInt(req.params.authorId)});

    if(!getSpecificBooks){
        return res.json({
            error: `No books found for the author ${req.params.author}`,
        });
    }
    return res.json({books: getSpecificBooks});
});
/* 
Route           /book/new
Description     to add new book
Access          public
Parameters      none
Method          POST
*/
Router.post("/new", async(req,res) => {
    try {
        const {newBook} = req.body;
        await BookModel.create(newBook);//dosent return anything
        return res.json({message: "book was added!!"});
    } catch (error) {
        return res.json({error: error.message})
    }
});

/* 
Route           /book/update
Description     to update title of a book
Access          public
Parameters      isbn
Method          PUT
*/
Router.put("/update/:isbn", async(req,res) => {
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
    return res.json({book: updatedBook});
});
/* 
Route           /book/author/update
Description     to update/add new author
Access          public
Parameters      isbn
Method          PUT
*/
Router.put("/author/update/:isbn", async(req,res) => {
    // update book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            $addToSet: {
                authors: req.body.newAuthor,
                //push newauthor to authors
            },
        },
        {
            new: true,
        }
    );
    //update author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: req.body.newAuthor,
        },
        {
            $addToSet: {
                books: req.params.isbn,
            },
        },
        {
            new: true,
        }
    );
    return res.json({
        books: updatedBook, 
        authors: updatedAuthor, 
        message: "New author was added",});
});
/*
Route           /book/delete
Description     to delete a book
Access          public
Parameters      isbn
Method          DELETE
*/
Router.delete("/delete/:isbn", async(req,res) => {    
    const updatedBookDatabase = await BookModel.findOneAndDelete({ISBN: req.params.isbn});
    return res.json({books: updatedBookDatabase});
});
/*
Route           /book/delete/author
Description     to delete an author from a book
Access          public
Parameters      isbn, authorId
Method          DELETE
*/
Router.delete("/delete/author/:isbn/:authorId", async(req,res) => {    
    //update book database
    const updatedBook = await BookModel.findOneAndUpdate(
        //find one and update to update an array not delete it
        {
            ISBN: req.params.isbn,
        },
        {
            $pull:{
                authors: parseInt(req.params.authorId),
            },
        },
        {
            new: true,
        }
    );
    
    //update author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(req.params.authorId),
        },
        {
            $pull:{
                books: req.params.isbn,
            },
        },
        {
            new: true,
        }
    );
    return res.json({
        message: "Author was deleted!!",
        book: updatedBook,
        author: updatedAuthor});
});

module.exports = Router;