import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.MONGODB_URI;

// Connect to Database and start server
mongoose
  .connect(DB_URI)
  .then(() => {
    console.log('Connected to Database successfully.');
    app.listen(PORT, () => {
      console.log(`⚙️ Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });