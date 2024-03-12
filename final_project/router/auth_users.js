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
    }
    else{
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
        console.log(`\n[AccessToken] : ${accessToken}, \t[username]: ${username}`)
        console.log("\n[regd_users.post-login]User logged in Succesfully")

        return res.status(200).send("User logged in Succesfully")
    }
    else{
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    console.log("Review processing handler invoked.");

    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    const review = req.query.review;
    console.log(`isbn : ${isbn}\tusername : ${username}\treview: ${review}`)

    if (!username) {
        return res.status(401).send("User not found. Please log in to leave a review.");
    }

    if (!books[isbn]) {
        return res.status(404).send("Book not found.");
    }

    let alreadyReviewed = books[isbn].reviews[username];

    if (alreadyReviewed) {
        console.log("User has already reviewed the book. If another review is posted, it will overwrite the original.");
        books[isbn].reviews[username] = review;
        return res.status(200).send(books[isbn]);
    } else {
        books[isbn].reviews[username] = review;
        return res.status(200).send(books[isbn]);
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    if (!username) {
        return res.status(401).send("User not found. Please log in to leave a review.");
    }
    if (!books[isbn]) {
        return res.status(404).send("Book not found.");
    }

    let userReview = books[isbn].reviews[username];
    if (userReview){
        delete books[isbn].reviews[username]
        return res.status(200).json({ message: "Review deleted successfully." });

    }
    else{
        res.status(404).json({message : "No review found for the user"+ username})
    }

});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
