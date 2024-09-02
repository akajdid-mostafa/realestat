// pages/api/upload.js
import nextConnect from 'next-connect';
import multer from 'multer';
import path from 'path';

// Set up multer for file handling
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
  }),
});

// Create handler
const handler = nextConnect()
  .use(upload.array('img', 10)) // Limit to 10 images
  .post((req, res) => {
    // Handle the files
    const files = req.files;
    res.status(200).json({ message: 'Files uploaded successfully', files });
  });

export default handler;
