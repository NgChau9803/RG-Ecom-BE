import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
  
const app = express();

app.get("/", (_, response) => {
    response.send(`Listening on ${process.env.PORT}`);
});

app.use(express.json());
app.use(cookieParser());


app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
});

try {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log('Connected to MongoDB');
} catch (err) {
  console.error('MongoDB connection error:', err);
}
