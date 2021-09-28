// Initializing Router
const Router = require("express").Router();

// Database models
const PublicationModel = require("../../database/publication");

/* 
Route           /publication
Description     to get all the publications
Access          public
Parameters      none
Method          get
*/
Router.get("/", async(req,res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json({publications: getAllPublications});
});
/*
Route           /p
Description     to get specific publication
Access          public
Parameters      pubId
Method          get
*/
Router.get("/p/:pubId", async(req,res) => {
    const getSpecificPublication = await PublicationModel.findOne({id: parseInt(req.params.pubId)});
    
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
Router.get("/:isbn", async(req,res) => {
    const getSpecificPublications = await PublicationModel.find({books: req.params.isbn});

    if(!getSpecificPublications){
        return res.json({
            error: `No book found for the isbn of ${req.params.isbn}`,
        });
    }
    return res.json({publications: getSpecificPublications});
});


/* 
Route           /publication/new
Description     to add new publication
Access          public
Parameters      none
Method          POST
*/
Router.post("/new", async(req,res) => {
    try {const {newPublication} = req.body;
    PublicationModel.create(newPublication);
    return res.json({message: "publication was added!!"});} catch(error){
        return res.json({error: error.message});
    };
});


/*
Route           /publication/update
Description     to update publication name using id
Access          public
Parameters      id
Method          PUT
*/
Router.put("/update/:id", async(req,res) => {
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id: parseInt(req.params.id)//object to find
        },
        {
            name: req.body.pubName,//object to be changed
        },
        {
            new: true,//to return new updated data
        }
    );
    return res.json({publications: updatedPublication});
});

/*
Route           /publication/update/book
Description     to update/add new book to a publication
Access          public
Parameters      isbn, pubId
Method          PUT
*/
Router.put("/update/book/:isbn", async(req,res) => {
    // update publication database
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id: req.body.pubId,
        },
        {
            books: req.params.isbn,
        },
        {
            new: true,
        }
    );
    //update book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            publication: req.body.pubId,
        },
        {
            new: true,
        }
    );
    return res.json({
        book: updatedBook, 
        publication: updatedPublication, 
        message: "New book was added",});
});



/*
Route           /publication/delete/book
Description     to delete a book from publication
Access          public
Parameters      isbn, pubId
Method          DELETE
*/
Router.delete("/delete/book/:isbn/:pubId", async(req,res) => {    
    // update publication database
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id: parseInt(req.params.pubId),
        },
        {
            $pull :{
                books: req.params.isbn,
            },
        },
        {
            new: true,
        }
    );
    // update book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            publication: 0,
        },
        {
            new: true,
        }
    );

    return res.json({books: updatedBook, publications: updatedPublication});
});

/*
Route           /publication/delete
Description     to delete a publication
Access          public
Parameters      pubId
Method          DELETE
*/
Router.delete("/delete/:pubId", async(req,res) => {    
    const updatedPublicationDatabase = await PublicationModel.findOneAndDelete({id: parseInt(req.params.pubId)});
    return res.json({publications: updatedPublicationDatabase});
});

module.exports = Router;
