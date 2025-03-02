const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/database');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password, familycode } = req.body;

    // Find user by email using SQL
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      if (results.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'User not found'
        });
      }

      const user = results[0];

      // Verify family code
      if (user.family_code !== familycode) {
        return res.status(400).json({
          success: false,
          message: 'Invalid family User Name'
        });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({
          success: false,
          message: 'Invalid password'
        });
      }

      // Create JWT token
      const token = jwt.sign(
        { id: user.id, familyCode: user.family_code },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          familyCode: user.family_code
        }
      });
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});






// new family route
router.post('/newfamily', async (req, res) => {
  try {
    const { email, username, password, familycode } = req.body;

    // Input validation
    if (!email || !username || !password || !familycode) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Check if family code exists
    const familyCheckQuery = 'SELECT * FROM family WHERE familycode = ?';
    const [familyResults] = await db.promise().query(familyCheckQuery, [familycode]);
    if (familyResults.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Family code already exists',
      });
    }

    // Check if username exists
    const userCheckQuery = 'SELECT * FROM users WHERE username = ?';
    const [userResults] = await db.promise().query(userCheckQuery, [username]);
    if (userResults.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Use transaction for atomicity
    const connection = await db.promise().getConnection();
    try {
      await connection.beginTransaction();

      const insertFamilyQuery = 'INSERT INTO family (familycode) VALUES (?)';
      await connection.query(insertFamilyQuery, [familycode]);

      const insertUserQuery = 'INSERT INTO users (email, username, password, familycode) VALUES (?, ?, ?, ?)';
      const [userResult] = await connection.query(insertUserQuery, [email, username, hashedPassword, familycode]);

      await connection.commit();

      // Create JWT token
      const token = jwt.sign(
        { id: userResult.insertId, familyCode: familycode },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Family created successfully',
        token,
        user: {
          id: userResult.insertId,
          email,
          username,
          familyCode: familycode,
        },
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('New family error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during signup. Please try again.',
    });
  }
});





// exist family route
router.post('/existingfamily', async (req, res) => {
  try {
    const { email, username, password, familycode } = req.body;
    // Check if family code exists
    const query = 'SELECT * FROM family WHERE familycode = ?';
    db.query(query, [familycode], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }
      if (results.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Family code does not exist',
          redirect: '/newfamily'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user into database
      const insertQuery = 'INSERT INTO users (email, username, password, familycode) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [email, username, hashedPassword, familycode], (insertErr, insertResults) => {
        if (insertErr) {
          console.error('Database error:', insertErr);
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        // Create JWT token
        const token = jwt.sign(
          { id: insertResults.insertId, familyCode: familycode },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
        res.json({
          success: true,
          message: 'Successfully joined family',
          token,
          user: {
            id: insertResults.insertId,
            email,
            username,
            familyCode: familycode
          }
        });
      });
    });
  } catch (error) {
    console.error('Join family error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});
module.exports = router;