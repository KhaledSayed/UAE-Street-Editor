const MessageHelper = require('./log_helper')
const ActionHelper = require('./action_helper')
const NotificationHelper = require('./notification_helper')



addTaskToLog = function(object ,type,model){
    return ActionHelper.create(type,object,model).then(action => {
         return MessageHelper.sendMessage(action._id,type,object).then(messageStatus => {
            console.log("Message Status:"+messageStatus)
            if(messageStatus){
                return Promise.resolve(true)
            }
            else{
                return Promise.reject(false)
            }
        }).catch(err => {
            console.log("ERRRR "+err)
        })

        // console.log(action)
    }).catch(err => {
        throw(err)
    })
}



module.exports.afterPost = addTaskToLog
