const express = require('express');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
const jwt = require('jsonwebtoken');
const secretKey = "your-secret-key"; // You can change this to a more secure value

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if user exists and password matches
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: "Invalid username or password." });
    }

    // Create JWT token
    const token = jwt.sign({ username: username }, secretKey, { expiresIn: '1h' });

    // Save token in session (simulate login)
    req.session.authorization = {
        token,
        username
    };

    return res.status(200).json({ message: "Login successful!", token });
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.username;  // from JWT token

    if (!review) {
        return res.status(400).json({ message: "Review text is required as a query parameter." });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or update the review for this username
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: `Review added/updated for ISBN ${isbn} by user ${username}.`, reviews: books[isbn].reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;  // from JWT middleware
  
    if (!books[isbn]) {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
  
    // Check if user has a review on this book
    if (books[isbn].reviews && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];  // Delete user's review
      return res.status(200).json({ message: "Review deleted successfully." });
    } else {
      return res.status(404).json({ message: "Review not found for this user." });
    }
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
