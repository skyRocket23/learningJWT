const User = require('../models/User');
const jwt = require('jsonwebtoken');


// handling errors
const handelErrors = ( err ) => {
    console.log(err.message,err.code);
    let errors = { email : '', password : ''}


    // incorrect email 
    if (err.message === 'Incorrect Email'){
        errors.email = 'The email is not registered';
        console.log('hi');
    }

    // incorrect password 
    if (err.message === 'Incorrect Password'){
        errors.password = 'The password is incorrect.'
    }



    // duplication error code
    if(err.code === 11000){
        errors.email = 'That email is already registered.'
        return errors;
    } 


    // validation error 
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach( ({properties}) => {
            errors[properties.path] = properties.message;
        })
    }

    return errors;
}


// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createTokens = (id) => {
    return jwt.sign({id},'shh keep this secret',{
        expiresIn:maxAge
    });
}



// controllers action 
module.exports.signup_get = (req,res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.signup_post = async (req, res) => {
    const { email , password } = req.body;
    
    try{
        const user = await User.create({email,password});
        const token = createTokens(user._id);
        res.cookie('jwt',token,{
            httpOnly: true,
            maxAge:maxAge*1000
        });
        res.status(201).json({user:user._id});
    }
    catch (err){
        const errors = handelErrors(err);
        res.status(400).json({errors});
    }

}

module.exports.login_post = async (req, res) => {
    const { email , password } = req.body;
    try {
        const user = await User.login(email,password);
        const token = createTokens(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        });
        res.status(200).json({user:user._id});
    } catch (err) {
        const errors = handelErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.logout_get = (req,res) => {
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
}