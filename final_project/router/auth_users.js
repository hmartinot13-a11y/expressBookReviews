const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in with access token: " + accessToken);
        //return res.status(200).send(accessToken);
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a review for a book
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.body.username;
  // Check if isbn book exist?
  if (!books[isbn]) {
    return res.status(300).json({message: "book not found"});
   }
  // Initialize object if not the case
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }
  // Create a tab for review if it does not exist
  if (!books[isbn].reviews[username]) {
    books[isbn].reviews[username] = [];
  }
  // Add the review 
  books[isbn].reviews[username].push("review added for book: " + isbn + " by username: " + username );
  //return res.status(200).json({message: "Review sucessfully added for book:" + isbn + " and username:" + username});
  //return res.status(200).json(books[isbn]);
  return res.status(200).json(books);
});

// delete a review for a book
regd_users.delete("/auth/review/:isbn", function (req, res) {
   const isbn = req.params.isbn;
   const username = req.body.username;
   // Check if isbn book exist?
   if (!books[isbn]) {
    return res.status(300).json({message: "book not found"});
   }
  const reviews = books[isbn].reviews;
  // check if username has review
  if (!reviews[username]) {
    return res.status(300).json({message: "no review found for this username"});
  } else {
    // Delete the review for this username
    delete books[isbn].reviews[username];
  }
  return res.status(200).json({message: "Review successfully deleted for book:" + isbn + " and username:" + username});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
