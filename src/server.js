import express from 'express';
import cors from 'cors';

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'], // Add more as needed
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};


const app = express();
app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.post('/api/login', (req, res) => {
  
});

app.listen(3005, () => {
  console.log('Server is running on http://localhost:3005');
});
