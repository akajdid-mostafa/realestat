import Cors from 'cors';
import { initMiddleware } from './init-middleware';

// Initialize the cors middleware
export const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    origin: '*', // Adjust this according to your needs
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
