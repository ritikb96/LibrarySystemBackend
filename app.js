var express = require('express')
const connectToDatabase = require('./database')
const app = express()
const mongoose = require('mongoose')
const Book = require("./model/bookModel")
const fs = require('fs')

const {multer,storage} =require("./middleware/multerConfig")
const upload = multer({storage:storage})



//cors package
const cors = require('cors')

app.use(cors({
    origin: '*'
}))




app.use(express.json())
connectToDatabase()

app.get("/",(req,res)=>
{
    res.send("haha world")
})


//create book

app.post("/book",upload.single("image") ,async(req,res)=>
{
    console.log(req.file)
    let fileName;
    if(!req.file)
    {
        fileName ="https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"
    }
    else{
        fileName = "http://localhost:3000/" + req.file.filename
    }
    const {bookName ,bookPrice, isbnNumber,authorName,publishedAt,publication} = req.body
    await Book.create(
        {
            bookName, 
            bookPrice,
            isbnNumber, 
            authorName,
            publishedAt,
            publication,
            imageUrl :fileName
        }
    )
    res.status(201).json
   (
    {
        message:"book created successfully"
    }
   )
})

//all read
app.get("/book", async(req,res)=>

{
    const books = await Book.find() //returns array
    res.status(200).json(
      {  message:"Books fetched successfully",
        data: books
    })
})

//single read
app.get("/book/:id",async(req,res)=>
{
    try{
    const id = req.params.id;
    const book = await Book.findById(id) //returns object
    if(!book)
    {
        res.status(404).json(
            {
                message: "No book of that id !"
            }
        )
    }
    else
    {
    res.status(200).json(
        {
            message:"Single book triggered",
            data:book
        }
    )
    }
}
catch(error)
{
    res.status(500).json({
        message:"something went wrong"

    })
}

})

//delete operation
app.delete("/book/:id",async(req,res)=>
{
    const id = req.params.id
    await Book.findByIdAndDelete(id)
    res.status(200).json(
        {
            message:"Book Deleted successfully"
        }
    )
})

//update operation
app.patch("/book/:id",upload.single('image'), async(req,res)=>
{
    const id = req.params.id //which book to update
    const {bookName,bookPrice,authorName,publishedAt,publication,isbnNumber} =req.body
    const oldDatas = await Book.findById(id)
    let fileName;
    if(req.file)
    {

        
        const oldImagePath = oldDatas.imageUrl
        console.log(oldImagePath)
        const localhostUrlLength = "http://localhost:3000/".length
        const newOldImagePath = oldImagePath.slice(localhostUrlLength)
        console.log(newOldImagePath)
        fs.unlink(`storage/${newOldImagePath}`,(err)=>
    {
        if(err)
        {
            console.log(err)

        }
        else{
            console.log("file Deleted successfully")
        }
        
    })
    fileName = "http://localhost:3000/" + req.file.filename
        console.log(fileName)
    }
    await Book.findByIdAndUpdate(id,{
        bookName:bookName,
        bookPrice:bookPrice,
        authorName:authorName,
        publication:publication,
        publishedAt:publishedAt,
        isbnNumber:isbnNumber,
        imageUrl:fileName
    })
    res.status(200).json(
        {
            message:"Book updated successfully!"
        }
    )
    
})

app.use(express.static("./storage/"))

app.listen(3000,()=>
{
    console.log('app is listening on 3000')
}
)
