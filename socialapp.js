import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import profileRouter from './routes/profileDetRoute.js';
import authRouter from './routes/user.js';
import postsRouter from './routes/postDetRoute.js';
import http from 'http';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('profile'));
app.use(express.static('post'));

const PORT = process.env.PORT || 8443;

mongoose
  .connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connnected');
  })
  .catch((e) => console.log(e));

const db = mongoose.connection;

app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  next();
});

app.get('/', (req, res) => {
  console.log('welcome');
});

app.use('/profile', profileRouter);

app.use('/auth', authRouter);

app.use('/post', postsRouter);

const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
