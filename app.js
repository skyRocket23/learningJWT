const express = require('express');
const mongoose = require('mongoose');
const authroutes = require('./routes/authroutes');
const cookieParser = require('cookie-parser');
const {requireAuth,checkUser} = require('./middleware/authmiddleware')


const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());

// this will attach a cookie method in response object 
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://vbelwal73:Lbvtacmpikuc1@cluster0.dtygzxn.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('*',checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth,(req, res) => res.render('smoothies'));

app.use(authroutes);


// cookies
// app.get('/set-cookies', (req,res) => {
  // res.setHeader('Set-Cookie','newUser=true');
//      res.cookie('newUser',false);
//      res.cookie('isEmployee',true,{maxAge: 1000*60*60*24, httpOnly:true});


//   res.send('You got the cookies');
// });


// app.get('/read-cookies', (req,res) => {
//   const cookies = req.cookies;
//   console.log(cookies);

//   res.json(cookies);
// })