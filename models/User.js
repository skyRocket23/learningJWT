const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'Please enter an email.'],
        unique:true,
        lowercase:true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password:{
        type:String,
        required:[true,'Please enter a password.'],
        minlength:[6,'Minimum password length is 6 characters']
    }
});


//This will be fired after the document is saved in the database
// userSchema.post('save',(doc,next) => {
//     console.log('New user was created and saved');
//     next();
// })

//This will be fired before the document is saved in the database
// userSchema.pre('save', function(next){
//     console.log('New user is about to be created and saved',this);
//     next();
// })

// This is used to encrypt the password before its saved in database
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();

});

// static method to login user 
userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password,user.password);
        if(auth){
            return user;
        }
        throw Error('Incorrect Password');
    }
    throw Error('Incorrect Email');
}

const User = mongoose.model('user',userSchema);

module.exports = User;