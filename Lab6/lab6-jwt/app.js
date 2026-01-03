require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (username, password, role) VALUES (?, ?, 'user')";
    db.query(sql, [username, hashedPassword], (err) => {
      if (err) {
        return res.status(400).json({ message: "User already exists" });
      }
      res.json({ message: "User registered successfully" });
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
});

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

function authorizeAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied: Admin only",
    });
  }
  next();
}

app.get("/admin", authenticateToken, authorizeAdmin, (req, res) => {
  res.json({
    message: "Welcome Admin",
    user: req.user,
  });
}
);

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const loginTime = new Date();
  const loginIp =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const updateLoginInfo = `
      UPDATE users
      SET last_login_time = ?, last_login_ip = ?
      WHERE id = ?
    `;

    db.query(updateLoginInfo, [loginTime, loginIp, user.id]);

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
        loginTime,
        loginIp
      },
      JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      }
    );

    const insertToken = "INSERT INTO tokens (user_id, token) VALUES (?, ?)";
    db.query(insertToken, [user.id, token]);

    res.json({
      message: "Login successful",
      token,
    });
  });
});

app.get("/verify", (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      message: "Token is valid",
      decoded,
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

app.post("/logout", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  const sql = "DELETE FROM tokens WHERE token = ?";
  db.query(sql, [token], (err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.json({ message: "Logout successful" });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
