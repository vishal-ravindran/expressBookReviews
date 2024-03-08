const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid

    let alreadyRegisteredUser = users.filter((user)=> user.username === username);
    if (alreadyRegisteredUser.length> 0){
        return true;
    }else{
        return false;
    }

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validUser = users.filter((user)=>{
        return (user.username === username && user.password === password)
    })

    if (validUser.length > 0){
        return true;
    }else{
        return false;
    }

}



//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password){
        return res.status(404).send("Invalid username or password!")
    }

    if (authenticatedUser(username, password)){
        let accessToken = jwt.sign({
            data:password
        }, "access", {expiresIn: 60 * 60});

        req.session.authorization = {
            accessToken, username
        }

        return res.status(200).send("User logged in Succesfully")

    }
    else{
        req.status(208).send("failed to authenticate user")
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let username = req.session.username;
    console.log(`isbn : ${isbn}, username: ${username}`)
    const review = req.query.reviews;
    if (books[isbn] && username){
        let alreadyReviewed = books[isbn].reviews.find((review)=>review.username === username);
        if (alreadyReviewed){
            alreadyReviewed.reviews = review
            // books[isbn].reviews[reviews] = {review}
            return res.status(200).send(books[isbn], null, 4);
        }else{

        }
        books[isbn].reviews.push(

            {
               "username": username,
               "review": review
           }
        )
        return res.status(200).send(books[isbn], null, 4);
    }
    else{

        return res.status(404).send("Please log in to leave a review");

    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
