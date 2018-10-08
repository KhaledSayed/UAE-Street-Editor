var Section = require('../../db/model/section');
var _ = require('lodash');
var jwt = require('jsonwebtoken')
var helper = require('./helper/section_helper')
var middleware = require('../middleware/user_middleware')



getSections = function(req,res){
    const params = _.pick(req.query,['description','title','_id', 'width', 'height'])
    Section.find(params).then( sections => {
        res.status(200).send({
                status:true , 
                message:"sections reterived success",
                data:{
                    sections:sections
                }
            }
        )
    })
}


postSection = function(req,res,next){

    if(middleware.admin(req,res,next) == next){
        console.log("Real Admin , Next")
        next()
    }


    let template = null ;

    if(req.file != null && req.file.destination != null){
        template = `${req.file.destination}${req.file.filename}`
    }

    const sectionParams = _.pick(req.body,['title','description', 'width', 'height'])
    sectionParams.template = template

    new Section(sectionParams).save().then(section => {
        res.status(201).send({
            status:true,
            message:"Section Created Successfully",
            data:{
                section:section
            }
        })
    }).catch(err => {
        res.status(406).send({
            status:false,
            message: "Server Problem Occured",
            error:err
        })
    })
}


updateSection = function(req,res){
    let template = null ;

    if(req.file != null && req.file.destination != null){
        template = `${req.file.destination}${req.file.filename}`
    }

    const section_id = _.pick(req.body,['_id'])
    const updatedData = _.pick(req.body,['title','description', 'width', 'height'])
    updatedData.template = template
    console.log(updatedData)
    Section.findOneAndUpdate(section_id, {$set:updatedData}, {new: true}).then(section => {
        res.send({
            status:true,
            message:"Section updated Successfully"
        })
    }).catch(err => {
        res.status(400).send(err)
    })
}

module.exports.get = getSections
module.exports.post = postSection
module.exports.update = updateSection
module.exports.helper = helper