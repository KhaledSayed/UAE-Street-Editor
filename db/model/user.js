const mongoose = require('../config/config')
const jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs');
const _ = require('lodash')
// console.log(mongoose)

var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {
        type:String ,
        required: [true, "E-mail is required"],
        unique: true
    },
    password:{
        type:String ,
        required: [true,"Passowrd is required"],
        minlength: 6 ,
        maxLength: 32
    },
    type:{
        type:String,
        enum: ['Admin' , 'Moderator' , 'Editor'],
        required: [true,"Membership type is required like he/she is admin or moderator ... etc"]
    },
    name:{
        type:String ,
        required:[true,"Name is required you can use it when you assign task"]
    },
    avatar: {
        type:String,
        required:false 
    },
    banned:{
        type:Boolean,
        default: false
    },
    tokens:{
        apn:{
            type: Map,
            of: String
        },
        auth:{
            type: Map,
            of: String        
        }
    }
});


userSchema.methods.generateAuthToken = function(deviceUID){
    var user = this ;

    const token = jwt.sign({
        id: user._id
    },'khaled')
    
    user.tokens.auth = new Map([[deviceUID, token]]);
    user.tokens.apn = new Map([[deviceUID,user.apn]])

    return Promise.resolve(user)
}

userSchema.methods.generateJSON = function(){
    const user  = this ;
    var res = _.pick(user,['name','email','avatar'])
    console.log(res)
    return Promise.resolve(res)
}


userSchema.pre('save', function (next){

    var user = this ;
    var saltRounds = 10 ;
    
    // bcrypt.genSalt(saltRounds, function(err, salt) {
    //     console.log(salt)
    //     if(err){
    //         return Promise.reject("Generating Salat failure")
    //     }
    //     bcrypt.hash(user.password, salt, function(err, hash) {
    //         if(err){
    //             return Promise.reject("Hashing Password Failure")
    //         }
    //         console.log(hash)

    //         user.password = hash

    //         next()
    //     });

    // });

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(this.password, salt);
    user.password = hash
    next()
      
});

var User = mongoose.model('User', userSchema);

module.exports = User