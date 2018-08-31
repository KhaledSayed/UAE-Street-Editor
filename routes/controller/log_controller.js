var Message = require('../../db/model/log');
var _ = require('lodash');
var jwt = require('jsonwebtoken')
var helper = require('./helper/log_helper')



get = function(req,res){
    const params = _.pick(req.query,['_creator','_receiver'])

    
    Message.find(params).populate('_receiver','-tokens -password').populate({ path: '_action', populate: { path: 'options._ref' }})
        .then( logs => {
        res.status(200).send({logs:logs})
    }).catch(err => {
        res.status(400).send()
    })
}


module.exports.get = get