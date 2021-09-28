// Initializing Router
const Router = require("express").Router();

// Database models
const AuthorModel = require("../../database/author");

/* 
Route           /authors
Description     to get all the authors
Access          public
Parameters      none
Method          get
*/
Router.get("/authors", async(req,res) => {
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
Router.get("/authors/:author", async(req,res) => {
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
Router.get("/au/:isbn", async(req,res) => {
    const getSpecificAuthors = await AuthorModel.find({books: req.params.isbn});
    
    if(!getSpecificAuthors){
        return res.json({
            error: `No author found for the book ${req.params.isbn}`,
        });
    }
    return res.json({authors: getSpecificAuthors});
});
/* 
Route           /author/new
Description     to add new author
Access          public
Parameters      none
Method          POST
*/
Router.post("/new", async(req,res) => {
    try {const {newAuthor} = req.body;
    AuthorModel.create(newAuthor);
    return res.json({message: "author was added!!"});} catch(error){
        return res.json({error: error.message});
    };
});
/*
Route           /author/update
Description     to update author name
Access          public
Parameters      id
Method          PUT
*/
Router.put("/update/:id", async(req,res) => {
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(req.params.id),//object to find
        },
        {
            name: req.body.authorName,//object to be changed
        },
        {
            new: true,//to return new updated data
        }
    );
    return res.json({author: updatedAuthor});
});
/*
Route           /author/delete
Description     to delete a whole author
Access          public
Parameters      authorId
Method          DELETE
*/
Router.delete("/delete/:authorId", async(req,res) => {    
    const updatedAuthorDatabase = await AuthorModel.findOneAndDelete({id: parseInt(req.params.authorId)});
    return res.json({authors: updatedAuthorDatabase});
});


module.exports = Router;