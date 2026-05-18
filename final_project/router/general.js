const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
    //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
//public_users.get('/',function (req, res) {
//  res.send(JSON.stringify(books,null,4));
//});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];  // Access book by key
    if (book) {
      res.send(JSON.stringify(book,null,4));
    } else {
      res.status(404).send({ message: "Book not found" });
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorName = req.params.author;
    // Convert books object values to an array
    const booksArray = Object.values(books);
      // Filter books by author
    const filteredBooks = booksArray.filter(book => book.author.toLowerCase() === authorName.toLowerCase());
  
    if (filteredBooks.length > 0) {
      res.send(JSON.stringify(filteredBooks,null,4));
    } else {
      res.status(404).send({ message: "No books found by that author" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const bookTitle = req.params.title;
    // Convert books object values to an array
    const booksArray = Object.values(books);
      // Filter books by title
    const filteredBooks = booksArray.filter(book => book.title.toLowerCase() === bookTitle.toLowerCase());
  
    if (filteredBooks.length > 0) {
      res.send(JSON.stringify(filteredBooks,null,4));
    } else {
      res.status(404).send({ message: "No books found by that title" });
    }
});

//  Get book review
//public_users.get('/review/:param1',function (req, res) {
//const isbnTest = 2;
//    res.send(JSON.stringify(books[isbn].reviews ,null,4));
//});

//axios.get(`http://localhost:3000/review/${isbn}`)
axios.get(`./`)
  .then(response => {
    console.log('Book reviews:', response.data);
    res.send("toto");
    //res.send(JSON.stringify(response.data,null,4));
  })
  .catch(error => {
    console.error('Error fetching reviews:', error);
  });



 
module.exports.general = public_users;
