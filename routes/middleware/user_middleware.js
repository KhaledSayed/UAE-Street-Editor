const jwt = require('jsonwebtoken')
const User = require('./../../db/model/user')



const admin = function (req, res, next) {
   
    const auth_token = req.headers['x_auth']
    const client = req.headers['client_id']
    
    console.log('x_auth',auth_token)
    console.log('client_id',client)


    try {
        var decoded = jwt.verify(auth_token, 'khaled');
        console.log(decoded)
      } catch(err) {
        // err
        res.status(401).send({
            status: false,
            message:"You must be an admin"
        })
      }


      return User.findById(decoded.id).then( user => {
          if(user == null)
          {
              res.status(401).send({
                  status: false,
                  message:"You must be an admin"
              })
          }


          console.log(user)
          if(user.type == 'Admin' ){

            if(auth_token == user.get('tokens.auth.'+client)){
                req.body.user = user
             return   next 
            }
            else{
                res.status(401).send({
                    status:false,
                    message:"you need to logout and login again , your session is expired"
                })
            }
          }
          else{
              res.status(402).send({
                  status:false,
                  message:"You must be an admin"
              })
          }
      })
  }

  const superUser = function (req, res, next) {
   
    const auth_token = req.headers['x_auth']
    const client = req.headers['client_id']
    
    console.log('x_auth',auth_token)
    console.log('client_id',client)


    try {
        var decoded = jwt.verify(auth_token, 'khaled');
        console.log(decoded)
      } catch(err) {
        // err
        res.status(401).send({
            status: false,
            message:"You must be an admin"
        })
      }


       User.findById(decoded.id).then( user => {
          if(user == null)
          {
              res.status(401).send({
                  status: false,
                  message:"You must be an admin"
              })
          }


          console.log(user)
          if(user.type == 'Admin' ){
            console.log(auth_token)
            console.log(user.get('tokens.auth.'+client))
            if(auth_token == user.get('tokens.auth.'+client)){
                req.body.user = user
                next() 
            }
            else{
                res.status(401).send({
                    status:false,
                    message:"you need to logout and login again , your session is expired"
                })
            }
          }
          else{
              res.status(402).send({
                  status:false,
                  message:"You must be an admin"
              })
          }
      })
  }



  const anyMember = function (req, res, next) {
   
    const auth_token = req.headers['x_auth']
    const client = req.headers['client_id']
    
    console.log('x_auth',auth_token)
    console.log('client_id',client)


    try {
        var decoded = jwt.verify(auth_token, 'khaled');
        console.log(decoded)
      } catch(err) {
        // err
        res.status(401).send({
            status: false,
            message:"You must be a member"
        })
      }


      return User.findById(decoded.id).then( user => {
          if(user == null)
          {
              res.status(401).send({
                  status: false,
                  message:"You must be a member"
              })
          }


          console.log(user)
          if(user.type == 'Admin' || user.type == 'Editor' || user.type == 'Moderator'){

            if(auth_token == user.get('tokens.auth.'+client)){
                req.body.user = user
                next() 
            }
            else{
                res.status(401).send({
                    status:false,
                    message:"you need to logout and login again , your session is expired"
                })
            }
          }
          else{
              res.status(401).send({
                  status:false,
                  message:"You're not a member"
              })
          }
      })
  }




  const anyMemberForMedia = function (req, res, next,cb) {
   
    const auth_token = req.headers['x_auth']
    const client = req.headers['client_id']
    
    console.log('x_auth',auth_token)
    console.log('client_id',client)


    try {
        var decoded = jwt.verify(auth_token, 'khaled');
        console.log(decoded)
      } catch(err) {
        // err
        res.status(401).send({
            status: false,
            message:"You must be a member"
        })
      }


       return User.findById(decoded.id).then( user => {
          if(user == null)
          {
              res.status(401).send({
                  status: false,
                  message:"You must be a member"
              })
          }


          console.log(user)
          if(user.type == 'Admin' || user.type == 'Editor' || user.type == 'Moderator'){

            if(auth_token == user.get('tokens.auth.'+client)){
                req.body.user = user
                console.log("Middleware Next()")
                return Promise.resolve(user)
            }
            else{
                res.status(401).send({
                    status:false,
                    message:"you need to logout and login again , your session is expired"
                })
            }
          }
          else{
              res.status(401).send({
                  status:false,
                  message:"You're not a member"
              })
          }
      })
  }




  const adminOrModeratorForMedia = function (req, res, next,cb) {
   
    const auth_token = req.headers['x_auth']
    const client = req.headers['client_id']
    
    console.log('x_auth',auth_token)
    console.log('client_id',client)


    try {
        var decoded = jwt.verify(auth_token, 'khaled');
        console.log(decoded)
      } catch(err) {
        // err
        res.status(401).send({
            status: false,
            message:"You must be a member"
        })
      }


       return User.findById(decoded.id).then( user => {
          if(user == null)
          {
              res.status(401).send({
                  status: false,
                  message:"You must be a member"
              })
          }


          console.log(user)
          if(user.type == 'Admin' ||  user.type == 'Moderator'){

            if(auth_token == user.get('tokens.auth.'+client)){
                req.body.user = user
                console.log("Middleware Next()")
                return Promise.resolve(user)
            }
            else{
                res.status(401).send({
                    status:false,
                    message:"you need to logout and login again , your session is expired"
                })
            }
          }
          else{
              res.status(401).send({
                  status:false,
                  message:"You're not a member"
              })
          }
      })
  }


  module.exports.admin = admin
  module.exports.superUser = superUser
  module.exports.anyMember = anyMember
  module.exports.anyMemberForMedia = anyMemberForMedia
  module.exports.adminOrModeratorForMedia = adminOrModeratorForMedia