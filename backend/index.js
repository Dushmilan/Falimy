require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const db = require("./database/database");

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Test database connection
db.query('SELECT 1')
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection failed:', err));



// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
 