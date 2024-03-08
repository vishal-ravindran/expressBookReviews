const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    let registeredUser = users.find((user) => user.username === username);

    if (!registeredUser) {
      users.push({ username: username, password: password });
      return res.status(200).send(`User with username ${username} registered`);
    } else {
      return res.status(409).send("Username already exists!");
    }
  } else {
    return res.status(400).send("Invalid username or password");
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
  } else {
    return res.status(208).send("Couldnt find book with isbn " + isbn);
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;
  let isbns = Object.keys(books);
  let booksByAuthor = [];

  if (author) {
    for (let isbn of isbns) {
      if (books[isbn].author === author) {
        booksByAuthor.push(books[isbn]);
      }
    }
    return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
  } else {
    return res
      .status(208)
      .json({ message: "couldn't find any books by author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title;
  let isbns = Object.keys(books);
  let booksByTitle = [];

  if (title) {
    for (let isbn of isbns) {
      if (books[isbn].title === title) {
        booksByTitle.push(books[isbn]);
      }
    }
    return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
  } else {
    return res
      .status(208)
      .json({ message: "couldn't find any books by title " + title });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  if (books[isbn]) {
    let bookReview = books[isbn].reviews;
    console.log("Book Review : " + bookReview);
    return res.status(200).send(JSON.stringify(bookReview, null, 4));
  } else {
    return res.status(208).send("Couldn't find review for the book");
  }
});

module.exports.general = public_users;
