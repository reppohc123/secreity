//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var encrypt = require('mongoose-encryption');

const app =express();


app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
  extended:true
}));
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true},function(err){
  if(!err){
    console.log("connect to Database");
  }
})

const userSchema=new mongoose.Schema({
  email: String,
  password: String
});

// Add any other plugins or middleware here. For example, middleware for hashing passwords

const secret =process.env.SECRET;
userSchema.plugin(encrypt, { secret:secret,encryptedFields: ["password"] });
// This adds _ct and _ac fields to the schema, as well as pre 'init' and pre 'save' middleware,
// and encrypt, decrypt, sign, and authenticate instance methods

const User = new mongoose.model("User",userSchema)

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const newUser = new User({
    email: req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(err){
      res.send(err)
    }else{
      res.render("secrets")
    }
  })
})

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password===password){
          res.render("secrets")
        }
      }
    }
  })
})

app.listen(3000,function(){
  console.log("Server is online at localhost 3000");
})
