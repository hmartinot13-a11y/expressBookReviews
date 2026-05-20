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
/*curl -X POST "https://<your-cloud-ide-url>/review/<isbn>" \
  -H "Content-Type: application/json" \
  -d '{"username":"herve","review":"This is an updated review."}'
Expected output example:
{
  "message": "Review added/updated successfully",
  "reviews": {
    "username1": "Great book!",
    "herve": "This is an updated review."
  }
}
*/
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  const reviewer = req.body.reviewer;
  const comment = req.body.comment;
  if (book) {
                 
  } else {
    // Simuler une erreur pour le catch
    throw new Error("No book found for the isbn: " + isbn);
  }
  // Initialize object if not the case
  if (!book.reviews) {
    book.reviews = {};
  }
  // Create a tab for review if it does not exist
  if (!book.reviews[reviewer]) {
    book.reviews[reviewer] = [];
  }
  // Add the review 
  book.reviews[reviewer].push(comment); 
  return res.status(200).json({messsage: "Review added/updated successfully", reviews:book.reviews});
});


// delete a review for a book
/*
curl -X DELETE "https://<your-cloud-ide-url>/review/<isbn>" \
  -H "Content-Type: application/json" \
  -d '{"username":"herve"}'
Expected output example:
{
  "message": "Review deleted successfully",
  "reviews": {
    "username1": "Great book!"
    // other remaining reviews
  }
}
*/
regd_users.delete("/auth/review/:isbn", function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    const reviewer = req.body.reviewer;
    const reviews = book.reviews;
    // Check if isbn book exist?
    if (!book) {
     return res.status(300).json({message: "book not found"});
    }
   // check if username has review
   if (!reviews[reviewer]) {
     return res.status(300).json({message: "No review found for this isbn"});
   } else {
     // Delete the review for this username
     delete reviews[reviewer];
   }
   return res.status(200).json({message:"Review deleted successfully", reviews:reviews[reviewer]});
 });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
