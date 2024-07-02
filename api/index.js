import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('MongoDb is connected');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();
const app = express();
// If you can't use it you can't post with req body as json format something like body-parser
app.use(express.json());
// We can just extract cookie from browser without any problem
app.use(cookieParser());
app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

//The presence of the err parameter indicates to Express that this is an error-handling middleware(4 parameters)
//When an error occurs in any of your route handlers or middleware, you can pass the error to the next middleware 
// using next(err).(see in auth.controllers.js)(while signup in try-catch block)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    // Even if the actual error has a detailed message (e.g., "Email already exists"), it won't be reflected 
    // in the response due to the typo 
    res.status(statusCode).json({
      // Also works
      // SUCCESS: false,
      // STATUSCODE:statusCode,
      // MESSAGE:message,
      success: false,
      statusCode,
      message,
    });
  });