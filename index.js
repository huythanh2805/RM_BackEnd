import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
// .env
dotenv.config();
const port = process.env.PORT || 3333;
// App
const app = express();

// middlle ware 
app.use(cors());
// connect to db
mongoose.connect(process.env.DB_URL)
.then(() => console.log('Connected to MongoDB succcesfully!'))
.catch(err => console.error('Could not connect to MongoDB...', err));


app.get('/', (req, res) => {
    res.send('This is my server using port 1111')
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
