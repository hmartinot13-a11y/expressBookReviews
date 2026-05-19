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
const myAxiosFct = (apiUrl) => { 
    console.log ("apiUrl:" + apiUrl);
    return axios.get(apiUrl) // Appel HTTP GET avec Axios
    .then (response => {        
        //return response.data;
        //console.log("receive1:" + response.data.status);
        // Supposons que les livres sont dans response.data.books
        if (response) {
            //resp.dataata=respo.datanse;
            console.log("receive2:" + JSON.stringify(response.data,null,4));
            //resp.send(JSON.stringify(resp.data,null,4));
            return response.data;
            //res.send(JSON.stringify(book,null,4));
        } else {
           // Simuler une erreur pour le catch
           console.log("receive3");
           throw new Error("The REST API did not manage to get the result:" + response);
        }
        //res.send(JSON.stringify(books,null,4));
    })
    .catch (err => {
        //console.log("erreur axios api");
        if (err.response) {
            console.log("test1");
            // Erreur côté serveur (ex: 404, 500)
            //response.status(err.response.status).json({ message: err.response.data.message || 'Error fetching books' });
        } else if (err.request) {
            console.log("test2");
            // Pas de réponse reçue
            //response.status(503).json({ message: 'No response from external API' });
            //console.log(response.data);
        } else {
            console.log("test3");
            // Autre erreur (ex: problème de configuration)
            //response.status(500).json({ message: err.message });
            //console.log(response.status);
        }
        //throw err;
        //return false;
        //res.status(404).send({ message: err.message });
    });
};

// Get books
public_users.get('/test/:mynb',function (req, res) {
    //try {
    let myUrl = "https://hmartinot13-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/";
    if (req.params.mynb === "2")
    { myUrl = "https://hmartinot13-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/2";};
    if (req.params.mynb === "3")
    { myUrl = "https://hmartinot13-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/Dante%20Alighieri";};
    if (req.params.mynb === "4")
    { myUrl = "https://hmartinot13-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/The%20Divine%20Comedy";};

    
    myAxiosFct(myUrl)
    .then(result => {
        //console.log("res.data:" + JSON.stringify(resp.data,null,4));
        //console.log("isbnobj:" + JSON.stringify(isbnobj,null,4));
        console.log("result:" + JSON.stringify(result,null,4));
        res.send(JSON.stringify(result,null,4));
        //res.send(JSON.stringify(result,null,4)+JSON.stringify(books,null,4));
        //res.send(JSON.stringify(books,null,4));
    })
    .catch (err => {
        res.status(404).send({ message: err.message });
    })
});
 
// Get All books
public_users.get('/',async function (req, res) {
    try { 
        if (books) {
          res.send(JSON.stringify(books,null,4));
        } else {
         // Simuler une erreur pour le catch
         throw new Error("No book found with the isbn:" + isbn);
        }
     } catch (err) {
         res.status(404).send({ message: err.message });
     }
 });

 
// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    try { 
       const isbn = req.params.isbn;
       const book = books[isbn];  // Access book by key
       console.log("test" + JSON.stringify(book,null,4));
       if (book) {
         res.send(JSON.stringify(book,null,4));
       } else {
        // Simuler une erreur pour le catch
        throw new Error("No book found with the isbn:" + isbn);
       }
    } catch (err) {
        res.status(404).send({ message: err.message });
    }
});

/*
// Original : without async/await Get book details based on author
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
*/

public_users.get('/author/:author', async function (req, res) {
    try {
      const authorName = req.params.author;
      const booksArray = Object.values(books);
  
      // Filtrer les livres par auteur (synchroniquement)
      const filteredBooks = booksArray.filter(book => book.author.toLowerCase() === authorName.toLowerCase());
  
      if (filteredBooks.length > 0) {
        res.send(JSON.stringify(filteredBooks, null, 4));
      } else {
        // Simuler une erreur pour le catch
        throw new Error("No books found for the author:" + authorName);
      }
    } catch (err) {
      res.status(404).send({ message: err.message });
    }
  });

/*--Retourner une Promise qui filtre les livres
public_users.get('/author/:author', function (req, res) {
    const authorName = req.params.author;
  
    new Promise((resolve, reject) => {
      const booksArray = Object.values(books);
      const filteredBooks = booksArray.filter(book => book.author.toLowerCase() === authorName.toLowerCase());
  
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject(new Error("No books found by that author"));
      }
    })
    .then(filteredBooks => {
      res.send(JSON.stringify(filteredBooks, null, 4));
    })
    .catch(err => {
      res.status(404).send({ message: err.message });
    });
  });
*/

/*--Exemple d'URL d'API externe qui retourne des livres
public_users.get('/author/:author', async (req, res) => {
    const authorName = req.params.author;
  
    try {
      // Remplacez cette URL par l'API réelle que vous souhaitez appeler
      const apiUrl = `https://example.com/api/books?author=${encodeURIComponent(authorName)}`;
  
      // Appel HTTP GET avec Axios
      const response = await axios.get(apiUrl);
  
      // Supposons que les livres sont dans response.data.books
      const books = response.data.books;
  
      if (books && books.length > 0) {
        res.json(books);
      } else {
        res.status(404).json({ message: "No books found by that author" });
      }
    } catch (error) {
      // Gestion des erreurs Axios
      if (error.response) {
        // Erreur côté serveur (ex: 404, 500)
        res.status(error.response.status).json({ message: error.response.data.message || 'Error fetching books' });
      } else if (error.request) {
        // Pas de réponse reçue
        res.status(503).json({ message: 'No response from external API' });
      } else {
        // Autre erreur (ex: problème de configuration)
        res.status(500).json({ message: error.message });
      }
    }
  });
*/

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
       const bookTitle = req.params.title;
       // Convert books object values to an array
       const booksArray = Object.values(books);
       // Filter books by title
       const filteredBooks = booksArray.filter(book => book.title.toLowerCase() === bookTitle.toLowerCase());
  
       if (filteredBooks.length > 0) {
         res.send(JSON.stringify(filteredBooks,null,4));
       } else {
         // Simuler une erreur pour le catch
         throw new Error("No books found by the title:" + bookTitle);
       }
    } catch (err) {
        res.status(404).send({ message: err.message });
      }
});

//  Get book review
//public_users.get('/review/:param1',function (req, res) {
//const isbnTest = 2;
//    res.send(JSON.stringify(books[isbn].reviews ,null,4));
//});

//axios.get(`http://localhost:3000/review/${isbn}`)
//const baseURL = 'https://hmartinot13-5002.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/';
//const baseURL = 'http://localhost:3002';

//axios.get(`${baseURL}/`)
//  .then(response => {
//    console.log('Book reviews:', response.data);
//    res.send("toto");
//    //res.send(JSON.stringify(response.data,null,4));
//  })
//  .catch(error => {
//    console.error('Error fetching reviews:', error);
// });
 
module.exports.general = public_users;
