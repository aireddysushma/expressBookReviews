const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if username already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists." });
    }

    // Register the user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully." });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const bookList = books;
    return res.status(200).send(JSON.stringify(bookList, null, 4)); // Pretty-printed JSON
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn], null, 4));
    } else {
        res.status(404).send(`Book with ISBN ${isbn} not found.`);
    }
});

  
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = [];

    // Get all book keys
    const bookKeys = Object.keys(books);

    // Iterate through books to find matches by author
    bookKeys.forEach(key => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            booksByAuthor.push(books[key]);
        }
    });

    if (booksByAuthor.length > 0) {
        res.send(JSON.stringify(booksByAuthor, null, 4));
    } else {
        res.status(404).send(`No books found by author: ${author}`);
    }
});


public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksByTitle = [];

    // Get all book keys
    const bookKeys = Object.keys(books);

    // Iterate through books to find matches by title
    bookKeys.forEach(key => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            booksByTitle.push(books[key]);
        }
    });

    if (booksByTitle.length > 0) {
        res.send(JSON.stringify(booksByTitle, null, 4));
    } else {
        res.status(404).send(`No books found with title: ${title}`);
    }
});


public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        res.status(404).send(`Book with ISBN ${isbn} not found.`);
    }
});


module.exports.general = public_users;
