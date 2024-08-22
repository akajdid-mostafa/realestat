// lib/init-middleware.js
import Cors from 'cors';

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}



// Initialize the CORS middleware
export const cors = initMiddleware(
  Cors({
    // Only allow requests from this origin
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'OPTIONS'],
  })
);