import express from 'express';
import cors from 'cors';

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend's origin
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));

app.options('*', cors(corsOptions)); // Handle preflight requests

app.post('/api/login', (req, res) => {
  // Your login logic here
});

app.listen(3005, () => {
  console.log('Server is running on http://localhost:3005');
});
