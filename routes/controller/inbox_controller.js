var Inbox = require('../../db/model/inbox');
var _ = require('lodash');
var jwt = require('jsonwebtoken')
var helper = require('./helper/inbox_helper')



get = function(req,res){
    const params = _.pick(req.query,['_creator','_receiver','seen'])
    Inbox.find(params).populate('_creator','-password').populate('_receiver','-password').then( messages => {
        res.status(200).send({
            status:true,
            message:"Retreived Messages" ,
            data:{
                messages:messages
            }
        })
    }).catch(err => {
        res.status(400).send()
    })
}


post = function(req,res){
    

    const params = _.pick(req.body,['_creator','_receiver','title','description'])
    params._creator = req.body.user._id

    new Inbox(params).save().then(inbox => {
        res.status(201).send()
    }).catch(err => {
        res.status(406).send(err)
    })
}


update = function(req,res){
    let template = null ;


    const _receiver = req.body.user._id

    const updatedData = _.pick(req.body,['status'])
    
    
    console.log(updatedData)
    
    Inbox.findByIdAndUpdate(_receiver,{seen:true},{multi:true}).then(numbers => {
        console.log(numbers)
        res.send()
    }).catch(err => {
        res.status(400).send()
    })
}

module.exports.get = get
module.exports.post = post
module.exports.update = update
module.exports.helper = helper