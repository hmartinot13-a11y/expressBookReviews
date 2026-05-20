const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function filterBooksByAuthor(authorName) {
  const booksArray = Object.values(books);
  return booksArray.filter(book => book.author.toLowerCase() === authorName.toLowerCase());
}

function filterBooksByTitle(bookTitle) {
  const booksArray = Object.values(books);
  return booksArray.filter(book => book.title.toLowerCase() === bookTitle.toLowerCase());
}

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

/*
public_users.get('/review/:username',async function (req, res) {
  let booksArray = Object.values(books);
  let theReviewByBook = "";
  try {    
      booksArray.forEach((book,item) => {
      if ((book.reviews[req.params.username])) {
        theReviewByBook = theReviewByBook + "Book: "+ (parseInt(item)+1) + " ";
      }
    });
    if (theReviewByBook==="") 
    {
      res.status(200).json({message:"No review for this username"});
    } else
    {
      res.status(200).json({message:theReviewByBook});
    }  
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});
*/

public_users.post("/register", (req,res) => {
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
});

// Get the book list available in the shop
const myAxiosFct = (apiUrl) => { 
  return axios.get(apiUrl) // Appel HTTP GET avec Axios
  .then (response => {        
    if (response) {
      return response.data;
    } else {
      // Simuler une erreur pour le catch
      throw new Error("The REST API did not manage to get the result:" + response);
    }
  })
  .catch (err => {
    if (err.response) {
      // Erreur côté serveur (ex: 404, 500)
      response.status(err.response.status).json({ message: err.response.data.message || 'Error fetching books' });
    } else if (err.request) {
      // Pas de réponse reçue
      response.status(503).json({ message: 'No response from external API' });
    } else {
      // Autre erreur (ex: problème de configuration)
      response.status(500).json({ message: err.message });
    }
  });
};

// Appel des GET RESTFul APIs en utilisant Axios. function synchrone
public_users.get('/test/:mynb',function (req, res) {
  let myUrl = "https://hmartinot13-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/";
  if (req.params.mynb === "2")
    { 
      myUrl = "https://hmartinot13-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/2";
    };
  if (req.params.mynb === "3")
  { 
    myUrl = "https://hmartinot13-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/Dante%20Alighieri";
  };
  if (req.params.mynb === "4")
  { 
    myUrl = "https://hmartinot13-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/The%20Divine%20Comedy";
  };

  //POST https://hmartinot13-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/register
  //POST https://hmartinot13-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/customer/login
  //PUT https://hmartinot13-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/customer/auth/review/2
  //DELETE https://hmartinot13-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/customer/auth/review/2

  myAxiosFct(myUrl)
  .then(result => {
    res.status(200).json(result);
  })
  .catch (err => {
    res.status(404).json({ message: err.message });
  })
});
 
// Afficher la liste des livres referencés. function asynchrone
public_users.get('/',async function (req, res) {
  try { 
    if (books) {
      res.status(200).json(books);
    } else {
      // Simuler une erreur pour le catch
      throw new Error("No book found with the isbn:" + isbn);
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

 
// Rechercher un livre par son numero ISBN. function asynchrone
public_users.get('/isbn/:isbn',async function (req, res) {
  try { 
    const book = books[req.params.isbn];
    if (book) {
      res.status(200).json(book);
    } else {
      // Simuler une erreur pour le catch
      throw new Error("No book found with the isbn:" + isbn);
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// Rechercher la liste des livres d'un auteur. function asynchrone
public_users.get('/author/:author', async function (req, res) {
  try {
    // Filtrer les livres par auteur
    const filteredBooks = filterBooksByAuthor(req.params.author);
    if (filteredBooks.length > 0) {
      res.status(200).json(filteredBooks);
  } else {
    // Simuler une erreur pour le catch
    throw new Error("No books found for the author:" + authorName);
  }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});


// Rechercher la liste des livres par titre. function asynchrone
public_users.get('/title/:title', async function (req, res) {
  try {
    const filteredBooks = filterBooksByTitle(req.params.title);
    if (filteredBooks.length > 0) {
      res.status(200).json(filteredBooks);
    } else {
      // Simuler une erreur pour le catch
      throw new Error("No books found by the title:" + bookTitle);
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// Afficher la liste des reviews pour un isbn. function asynchrone
/*
curl -X GET "https://<your-cloud-ide-url>/review/<isbn>"
Replace <your-cloud-ide-url> with your actual Cloud IDE URL and <isbn> with the book’s ISBN number.
Expected output:
{
  "username1": "Great book!",
  "username2": "Enjoyed reading it."
}
*/
public_users.get('/review/:isbn',async function (req, res) {
    try {    
      const isbn = req.params.isbn;
      const book = books[isbn];
      if (book) {
          res.status(200).json(book.reviews);            
      } else {
        // Simuler une erreur pour le catch
        throw new Error("No book found fot the isbn: " + isbn);
      }
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  });

/*
public_users.get('/reviews/:isbn',async function (req, res) {
  try {    
    const isbn = req.params.isbn;
    const book = books[isbn];
    const isEmpty = Object.keys(book.reviews).length === 0;
    if (book) {
      if (isEmpty)
      {
        // Simuler une erreur pour le catch
        throw new Error("No review found with isbn: " + isbn);
      } else {
        res.status(200).json(book.reviews);            
      }
    } else {
      // Simuler une erreur pour le catch
      throw new Error("No book found fot the isbn: " + isbn);
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});
*/

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
public_users.delete("/review/:isbn", function (req, res) {
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

module.exports.general = public_users;
