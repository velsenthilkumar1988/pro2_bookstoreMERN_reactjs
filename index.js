import express, { request, response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import {Book} from '../backend/models/bookModel.js';
const app = express();

app.use(express.json())


app.get('/', (request, response)=>{
    console.log(request);
    return response.status(234).send('Welcome to MERN Stack Project 3')
});
//Route function GET Single Data
app.get('/books/:id', async(request, response)=>{
    try {
        const {id} = request.params;
        const books = await Book.findById(id);
        return response.status(200).json(books)   
    } catch (error) {
        console.log(error.message)
        response.status(500).send({message: error.message})
    }
});
//Route function GET All Data
app.get('/books', async(request, response)=>{
    try {
        const books = await Book.find({});
        return response.status(200).json({
            count : books.length,
            data : books
        })
    } catch (err) {
        console.log(err.message);
        response.status(500).send({message: err.message});
    }
})
//Route function POST / Craete  Data
app.post('/books', async(request, response)=>{
    try {
        if(!request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ){
            return response.status(400).send({
                message: 'Send all required fields : title, author, published year',
            });
        }
        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
        };
        const book = await Book.create(newBook);

        return response.status(201).send(book);
    } catch (error) {
        response.status(500).send({message: error.message})
    }
});
//Route function Update / Modify  Data
app.put('/books/:id', async(request, response)=>{
    try {
        if(!request.body.title || !request.body.author || !request.body.publishYear){
            return response.status(400).send({
                message : 'Send All required field: title, author, publishyear',
            });
        }
        const {id} = request.params;
        const result = await Book.findByIdAndUpdate(id, request.body);
        if(!result){
            return response.status(404).json({message: 'Book Not Found!'});
        }
        return response.status(200).send({message: 'Book Update Successfully'})
    } catch (error) {
        response.status(500).send({message: error.message});
    }
})

//Route function Delete / Remove  Data
app.delete('/books/:id', async(request, response)=>{
    try {
        if(!request.body.title || !request.body.author || !request.body.publishYear){
            return response.status(400).send({
                message : 'Send All required field: title, author, publishyear',
            });
        }
        const {id} = request.params;
        const result = await Book.findByIdAndDelete(id);
        if(!result){
            return response.status(404).json({message: 'Book Not Deleted!'});
        }
        return response.status(200).send({message: 'Book Deleted Successfully'})
    } catch (error) {
        return response.status(500).send({message: error.message})
    }
});
mongoose.connect(mongoDBURL).then(()=>{
    console.log('Mongo DB Connected Successfully');
    app.listen(PORT, ()=>{
        console.log('====================================');
        console.log(`App Port is Working : ${PORT}`);
        console.log('====================================');
    });
}).catch((error)=>{
    console.log(error);
})