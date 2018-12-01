var User = require('../../db/model/user');
var _ = require('lodash');
var jwt = require('jsonwebtoken')
var helper = require('./helper/user_helper')
var middleware = require('../middleware/user_middleware')


const createUser = function(req,res,next) {

//     if(middleware.admin(req,res,next) == next){
//         console.log("Real Admin , Next")
//         next()
//     }

    let avatar = null ;

    if(req.file != null && req.file.destination != null){
        avatar = `${req.file.destination}${req.file.filename}`
    }

    var user = _.pick(req.body,['name','email','password','type'])
    user.avatar = avatar


    var user = new User(user).save().then(user => {
        user.generateJSON().then( userJSON => {
            res.status(201).send({
                status:true , 
                message: 'success generating user',
                data:{
                    user:userJSON
                }
                })
        })

        // user.generateAuthToken(req.get('client_id')).then(user => {
        //     res.append('x_auth',user.get(`tokens.auth.${req.get('client_id')}`))
        // })
    }).catch((err,user) => {
        console.log(err)
        res.status(400).send({
            status:false,
            message:'validation error',
            error: err
        });
    })
}



const getUsers = function(req,res) {

    const params = _.pick(req.query,['type','banned'])

    console.log(req.query)
    console.log(params)


    User.find(params).then( users => {

        users = _.map(users,item => _.assign(
            { _id: item._id,
              name: item.name,
              avatar: item.avatar,
              email: item.email,
              type: item.type  
            } 
          ));


        res.status(200).send({
            users: users
        }
    )}).catch(error => {
        res.send(400)
    })
}


const login = function(req,res){
    // helper.testPassword("123456")
    // console.log(req.body)
    const client = req.headers['client_id'];

    if(client == null){
        res.status(500).send({
            status:false,
            message:"Client ID Not Provided"
        })
    }

    const params = _.pick(req.body,['email'])
    const password = req.body.password
    const apn = req.body.apn
    console.log(password)

    
    User.findOne(params).then(user =>{
        //password is correct
        console.log(user)
        user.apn = apn

        if(user != null){

            if (helper.isPasswordCorrect(password,user.password)){
                user.generateAuthToken(req.get('client_id')).then(userWithToken => {
                    
                    User.findByIdAndUpdate(user._id,{$set: userWithToken}, {new:true},function(err,user){

                        if(err){
                            res.status(500).send({
                                status:false,
                                message:"Login Faield due to server problems",
                                error:err
                            })
                        }

                        res.append('x_auth',user.get(`tokens.auth.${req.get('client_id')}`))

                        res.status(200).send({
                            status:true,
                            message: 'Login Successfully',
                            data:{user: _.pick(user,['name','email','type','_id'])}
                            }
                        )
                    })
                }).catch( err => {
                    res.send({
                        status:false,
                        message:'login faield due to server problems',
                        error:err
                    })
                })
            }
            else{ //password is invalid
                res.status(403).send({
                    status:false,
                    message: "Password is invalid"
                })
            }    
        }
        else{
            res.status(403).send({
                status:false,
                message: "Email is invalid"
            })
        }
    }).catch(err => {
        res.status(400)
        res.send(err)
    })
}


updateUser = function(req,res){
    const updateUser = _.pick(req.body,['name','email','type','apn'])

    try {
        var decoded = jwt.verify(auth, 'khaled');
        // res.send(decoded)
        User.findOne({_id:req.body.user._id}).then( user => {
            user.set(`tokens.apn.${client}`,updateUser.apn)
            console.log(user)
            User.findByIdAndUpdate(
                 user.id
            ,{$set: updateUser}, {new:true},function(err,user){
    
                if(err){
                    res.status(500).send({
                        status:false,
                        message:'server problem , happened',
                        error:err
                    })
                }
                res.send({
                    status:true,
                    message:"Update Success",
                    data:{
                        user:user
                    }
                })
            }).catch(err =>{
                res.status(400).send({
                    status:false,
                    message:"Bad Request Data",
                    error:err
                })
            })
        })
      } catch(err) {
        res.status(err)
      }
      
}


module.exports.post = createUser
module.exports.get = getUsers
module.exports.helper = helper
module.exports.login = login 
module.exports.update = updateUser
