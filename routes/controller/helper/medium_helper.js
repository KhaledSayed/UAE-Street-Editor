var    crypto = require('crypto');
var    mime = require('mime');
var    multer = require('multer')  , path     = require('path');
var bcrypt = require('bcryptjs')
const MessageHelper = require('./log_helper')
const ActionHelper = require('./action_helper')
const NotificationHelper = require('./notification_helper')


// console.log(path.join(__dirname + '/../../../public/uploads/avatar'))

getExpressPath = function(){
    return path.join(__dirname + '/../../../public/uploads/medium') ;
}

getReadablePath = function(){
    return '/public/uploads/medium'
}

getStorage = function(){
    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'public/uploads/medium/')
        },
        filename: function(req, file, cb) {
            crypto.pseudoRandomBytes(16, function(err, raw) {
                cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
            });
          }
      });
      
      var upload = multer({
        storage: storage
      });    


      return upload ;
}


//actionID,type,medium,uid

addMediumToLog = function(object ,actionParams,model,uid){
    console.log(object)
    if(object._creator != uid){
        object._creator = uid
    }

    let type = actionParams.status

    

    return ActionHelper.create(actionParams,object,model).then(action => {
         
        return MessageHelper.sendBulk(action._id,type,object).then(messageStatus => {
            console.log("Message Status:"+messageStatus)
            if(messageStatus){
                return Promise.resolve(true)
            }
            else{
                return Promise.reject(false)
            }
        }).catch(err => {
            console.log("ERRRR "+err)
            return Promise.reject(false)
        })
        // console.log(action)
    }).catch(err => {
        console.log('may be there is an error: '+err)
        return Promise.reject(false)
    })
}





module.exports.express_path = getExpressPath()
module.exports.path = getReadablePath()
module.exports.upload = getStorage()
module.exports.afterPost = addMediumToLog
