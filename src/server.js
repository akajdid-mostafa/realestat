import express from 'express';
import cors from 'cors';

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'], // Add more if needed
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
// Apply CORS to all routes
app.use(cors());

// Handle preflight requests for all routes
// app.options('*', cors(corsOptions));

// Example endpoint
app.post('/api/login', (req, res) => {
  res.json({ message: 'Login successful' });
});

app.use('/api/posts', (req, res) => {
  res.json({ message: 'Login successful' });
});

app.listen(3005, () => {
  console.log('Server is running on http://localhost:3005');
});
