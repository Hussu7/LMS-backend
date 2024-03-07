const express = require("express")
const app = express();
const fs = require("fs")
const cors =require('cors')
const connectToDatabase = require("./database/database")
const Book = require("./model/bookModel")
const { storage, multer, limits } = require("./middleware/multerConfig");
const { error } = require("console");
const upload = multer({ storage, limits })


app.use(express.json())
connectToDatabase(); 
app.use(cors({
    origin:"*"
}))

const serverPathLength = "http://localhost:3000-".length



app.post("/book", upload.single("image"), async (req, res) => {
    try {
        let imageUrl;
        if (!req.file) {
            imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9fOiek2kWwg3ayjG9k5G6l6MJTDE56Hzj_Q0JziboCg&s"
        }
        else {
            imageUrl = "http://localhost:3000/" + req.file.filename
        }
        const { bookName, bookPrice, aurtherName, isbnNumber, publicationDate, publication } = req.body;
        await Book.create({
            bookName,
            bookPrice,
            aurtherName,
            isbnNumber,
            publicationDate,
            publication,
            imageUrl
        })
        res.status(201).json({
            massage: " created successfully"
        })
    } catch (error) {
        res.status(404).json({
            message: "Something went wrong",
            data: error
        })

    }

})
app.get("/book", async (req, res) => {
    const books = await Book.find() //return array
    if (books.length === 0) {
        res.status(404).json({
            message: "No book found"
        })
    }
    else {
        res.status(200).json({
            message: "data fetched successfully",
            data: books
        })
    }


})

app.get("/book/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const book = await Book.findById(id) //return object
        if (!book) {
            res.status(404).json({
                message: "Book not found"
            })
        }
        else {
            res.status(200).json({
                message: "single book fetched successfully",
                data: book
            })
        }

    } catch (error) {
        res.status(404).json({
            message: "something went wrong"
        })
    }
})

//delete operation
app.delete("/book/:id", upload.single("image"), async (req, res) => {
    const id = req.params.id
    const oldBook = await Book.findById(id)
    const fileName = oldBook.imageUrl.slice(serverPathLength)
    await Book.findByIdAndDelete(id)
    fs.unlink(`./storage/${fileName}`, (error) => {
        if (error) {
            console.log(error)
        } else {
            console.log("book Image deleted ")
        }
    })
    res.status(200).json({
        message: "Book deleted successfully"
    })
})

//update Operation 
app.patch("/book/:id", upload.single("image"), async (req, res) => {
    const id = req.params.id
    let imageUrl;
    const { bookName, bookPrice, aurtherName, isbnNumber, publicationDate, publication } = req.body
    const oldData = await Book.findById(id);
    if (!req.file) {
        imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9fOiek2kWwg3ayjG9k5G6l6MJTDE56Hzj_Q0JziboCg&s"
    }
    else {
        const fileName = oldData.imageUrl.slice(serverPathLength)
        fs.unlink(`./storage/${fileName}`,(err)=>{
            if (err){
                console.log(err)
            }
        })
        imageUrl = "http://localhost:3000/" + req.file.filename
        await Book.findByIdAndUpdate(id, {
            bookName,
            bookPrice,
            publication,
            publicationDate,
            isbnNumber,  
            aurtherName,
            imageUrl
        })
        res.status(200).json({
            message: "Book updated successfully!"
        })
    }
})

app.use(express.static("./storage"))
const port = 3000;
app.listen(port, () => {  
    console.log("nodejs server started at port number:", port)

})


