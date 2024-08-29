import express from 'express';
import cors from 'cors';

const app = express();

// Apply CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  methods: 'GET,POST,OPTIONS',
  credentials: true,
}));

// Example endpoint for login
app.post('/api/login', (req, res) => {
  res.json({ message: 'Login successful!' });
});
app.get('/api/posts', (req, res) => {
  res.json({ message: 'Login successful!' });
});
// Set the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
