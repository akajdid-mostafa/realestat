import express from 'express';
import cors from 'cors';

const app = express();

// List of allowed origins
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the request origin is in the list of allowed origins
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Example endpoint
app.post('/api/login', (req, res) => {
  res.json({ message: 'Login successful' });
});
app.use('/api/posts', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
});
app.get('/api/posts',(req,res)=>{
  res.json({ message: 'posts successful' })
})
// app.use('/api/posts', (req, res) => {
//   res.json({ message: 'Posts successful' });
// });
app.use('api/categories',(req,res)=>{
  res.json({message:"categorie"})
})
app.listen(3009, () => {
  console.log('Server is running on http://localhost:3002');
});
