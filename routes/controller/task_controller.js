var Task = require('../../db/model/task');
var User = require('../../db/model/user');
var _ = require('lodash');
var jwt = require('jsonwebtoken')
var helper = require('./helper/task_helper')



getTasks = function(req,res){
    
    const params = _.pick(req.query,['done','_creator','_receiver'])


    Task.find(params).populate('_receiver','-tokens -password').then(tasks => {
        res.send({
            status:true,
            message:'reading tasks',
            data:{
                tasks:tasks
            }
        })
    }).catch(err => {
        res.send(err)
    })

    

}

postTasks = function(req,res){
    const task = _.pick(req.body,['title','description','_receiver'])
    task._creator = req.body.user._id

    new Task(task).save().then(task => {
        helper.afterPost(task ,2002,'Task').then(status => {
            console.log('Task Controller Status:'+status)
            if(status){
                res.send({
                    status:true,
                    message:"task assigned and All Notification has been sended",
                    data:{
                        task:task
                    }
                })
            }
            else{
                res.send({
                    status: false ,
                    message: "Failure to Send Message"
                })
            }
        }).catch(err => {
            res.send({error: err})
        })
    }).catch(err => {
        res.send(err)
    })
}



//Task is Done

doneTask = function(req,res){
    const task = _.pick(req.body,['_id'])
    const data = {done:true}

    Task.findByIdAndUpdate(task._id,{$set: data}, {new: true} , function (err, task) {
        if (err) {
            // Handle validation errors
            res.status(500).send({
                status:false , 
                message:"Server Problem Occured",
                error:err
            })
        }
        //TODO: Send done action
        res.send({
            status:true , 
            message:"Task status updated , Task assigner has been notfied",
            data:{
                task:task
            }
        })

    }).catch(err => {
        res.send({
            status:false , 
            message:"Server Problem happened",
            error:err
        })
    })

}



module.exports.get = getTasks
module.exports.post = postTasks
// module.exports.test = testTasks
module.exports.update = doneTask