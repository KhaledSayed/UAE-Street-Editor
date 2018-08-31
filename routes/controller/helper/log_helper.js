const Log = require('../../../db/model/log')
const Task = require('../../../db/model/task')
const User = require('../../../db/model/user')
const Medium = require('../../../db/model/medium')

buildMessage = function(type,object){
    // console.log(type)
    if(type == 2002){
        return Task.findById(object._id).populate('_creator').then(task => {
            // console.log(task._creator.name)
            // console.log(object._id)
    
            return Promise.resolve({
                title: `لقد تم تكليفك بمهمه جديدة`,
                description:                                `لقد تم تكليفك بمهمة جديدة بواسطة ${task._creator.name}`
                })   ;
        }).catch(err => {
            console.log("FAILURE")
            return Promise.reject("failure")
        })
    }
    else if(type == 2003){
        return Task.findById(object._id).populate('_receiver').then(task => {
            return Promise.resolve({
                title: `لقد تم الانتهاء من المهمة بنجاح`,
                description: `لقد تم الانتهاء من المهمة المكلفة الي ${task._receiver.name}`
            });
        }).catch(err => {
            return Promise.reject('failure')
        })
    }
    else if(type == 1001){
        return User.findById(object._creator).then(user => {
            let type_mime = null ;
            if(object.type == "Video"){
                type_mime = "فيديو"
            }
            else{
                type_mime = "صورة"
            }
            return Promise.resolve({
                title: `ميديا جديدة بانتظار المراجعة`,
                description: `قام ${user.name} بنشر ${type_mime} جديد بانتظار المراجعة `
            })
        });
    }
    else if(type == 1002){
        console.log("HEEEEEEEh")
        return User.findById(object._creator).then(user => {
            let type_mime = null ;
            if(object.type == "Video"){
                type_mime = "فيديو"
            }
            else{
                type_mime = "صورة"
            }

            console.log(user)            
            return Promise.resolve({
                title: `تم الموافقة علي ال${type_mime} الخاص بك`,
                description: `قام ${user.name} بالموافقه علي  ال${type_mime+" "}الخاص بك  `
            })
        });
    }
    else if(type == 1004){
        return User.findById(object._creator).then(user => {
            let type_mime = null ;
            if(object.type == "Video"){
                type_mime = "فيديو"
            }
            else{
                type_mime = "صورة"
            }

            console.log(user)            
            return Promise.resolve({
                title: `ميديا جديدة`,
                description: `قام ${user.name} بنشر ميديا جديدة  `
            })
        });
    }
    else if(type == 1003){
        console.log("HEEEEEEEh-1003")
        return User.findById(object._creator).then(user => {
            let type_mime = null ;
            if(object.type == "Video"){
                type_mime = "فيديو"
            }
            else{
                type_mime = "صورة"
            }

            console.log(user)            
            return Promise.resolve({
                title: `تم رفض ال${type_mime} الخاص بك`,
                description: `قام ${user.name} برفض  ال${type_mime+" "}الخاص بك  `
            })
        });
    }

}



send = function(id,type,task){

    if(type == 2002 || type == 2003){

        const receiver = type == 1002 ? task._receiver : task._creator ;
           
    //    buildMessage(type,task).then( notif => {
    //         console.log(notif)
    //     }).catch(err => {
    //         console.log(err)
    //     })

        return buildMessage(type,task).then(notf => {    
            console.log(notf)
            console.log(receiver)
           return  new Log({
                title: notf.title ,
                description: notf.description , 
                _action:id,
                _receiver: receiver
            }).save().then(msg => {
                console.log(msg)
                return Promise.resolve(true)
            }).catch(err => {
                // throw(err)
                console.log("ERROR TO SAVE MESSAGE")

                return Promise.reject(err)
            })
            }).catch(err => {
                // throw(err)
                
                return Promise.reject(err)
            })        
    }
}

sendBulk = function(actionID,type,medium,uid){
    console.log(type)
    if(type == 1001){
        console.log(actionID,type,medium,uid)
        return User.find({$or:[{'type':'Admin'},{'type':'Moderator'}]}).then(users=> {
            return buildMessage(type,medium).then(notif => {
                let logs = []
                console.log(notif)
                users.forEach( function(value){
                    logs.push({
                        title: notif.title , 
                        description: notif.description,
                        _receiver:medium._creator,
                        _action: actionID
                    })
                })
                return Log.insertMany(logs).then(logsFromDB => {
                    return Promise.resolve(true)
                }).catch(err => {
                    console.log('Insert Many Error: '+err)
                    return Promise.reject(false)
                })

            })
        })
    }
    else if (type == 1002){
        // console.log(medium)

        return Medium.findById(medium._id).then(medium_item => {
            // console.log(medium)
            return buildMessage(type,medium).then(notif => {
                console.log(notif)
                return new Log({
                    title:notif.title,
                    description:notif.description,
                    _receiver:medium_item._creator ,
                    _action:actionID
                }).save().then(log => {
                    return Promise.resolve(true)
                })
            }).catch(err => {
                console.log("error 1002: "+err)
                return Promise.reject(false)
            })
        })
    }
    else if(type == 1003){
        return Medium.findById(medium._id).then( medium_item => {

            return buildMessage(type,medium).then( notif => {
                console.log(notif)
                return new Log({
                    title:notif.title,
                    description:notif.description,
                    _receiver:medium_item._creator,
                    _action:actionID
                }).save().then(log => {
                    return Promise.resolve(true)
                })
            })
        }).catch(err => {
            console.log('error 1003: '+err)
            return Promise.reject(false)
        })
    }
    else if(type == 1004){
        return User.find().then(users => {
            let logs = []

            return Medium.findById(medium._id).then(mediumItem => {
                return buildMessage(type,medium).then(notif => {
                    users.forEach(function(userItem){
                        if(userItem._id != mediumItem._id){
                            logs.push({
                                title:notif.title ,
                                description:notif.description,
                                _receiver:userItem._id,
                                _action:actionID
                            })
                        }
                    })
                    console.log(logs.length)
    
                    return Log.insertMany(logs).then(manyLogs => {
                        return Promise.resolve(true)
                    }).catch(error => {
                        console.log(type,error)
                        return Promise.reject(false)
                    })
                })
            })
            .catch(err => {
                console.log(type,err)
                return Promise.reject(false)
            })

        })
    }   
}

module.exports.sendMessage = send
module.exports.sendBulk = sendBulk