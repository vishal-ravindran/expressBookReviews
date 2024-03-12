const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { authenticated, users } = require('./router/auth_users.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))


app.use("/customer/auth/*", function auth(req,res,next){
    //Write the authenication mechanism here

    if (req.session.authorization){
        token = req.session.authorization['accessToken'];
        jwt.verify(token, 'access', (err, user)=>{
            if(!err){
                req.user = user;
                next();
            }
            else{
                res.status(403).json({message: "user not authenticated"})
            }
        })
    }
    else{
        res.status(403).json({message: "User  not logged in"})
    }    
    });




// app.use("/customer/auth/*", function auth(req,res,next){
// //Write the authenication mechanism here
// const username = req.body.username;
// const password = req.body.password;
// console.log(`\nusername : ${username}\npassword: ${password}`)

// if (!username || !password){
//     res.status(404).send("Error loggin in")
// }
// console.log("\nOutside if loop authenticated!!!")
// if (authenticated){
// // if (authenticated(username, password)){
//     console.log("\nInside if loop authenticated!!!")
//     let accessToken = jwt.sign({
//         data: password
//     }, "access", {expiresIn: 60 *60});

//     req.session.authorization ={
//         accessToken, username
//     };
//     console.log("[App.USE-customer-auth-*]User succesfully Logged in")
//     return res.status(200).send(`User ${username} succesfully Logged in`)
    
// }else{
//     return res.status(208).json("Invalid username or password! ")
// }
// });



 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
