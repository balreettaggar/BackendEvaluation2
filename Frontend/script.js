const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;
const USERS_FILE = "./users.json";
const SECRET_KEY = "your_secret_key"; // Change this in production

app.use(cors());
app.use(bodyParser.json());

// Ensure users.json exists
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]", "utf-8");
}

// Register User
app.post("/register", async (req, res) => {
    const { fullname, username, email, password, confirmPassword } = req.body;

    if (!fullname || !username || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: "All fields are required!" });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match!" });
    }

    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));

    if (users.some((user) => user.username === username || user.email === email)) {
        return res.status(400).json({ error: "Username or email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), fullname, username, email, password: hashedPassword };

    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");

    res.status(201).json({ message: "Registration successful! You can now log in." });
});

// Login User
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
    const user = users.find((u) => u.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid username or password!" });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Login successful!", token });
});

// Protected Route (For Future Use)
app.get("/profile", (req, res) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ error: "Access denied!" });

    try {
        const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
        res.json({ message: "Protected data accessed!", user: decoded });
    } catch {
        res.status(401).json({ error: "Invalid token!" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
