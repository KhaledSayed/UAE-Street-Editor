var    crypto = require('crypto');
var    mime = require('mime');
var    multer = require('multer')  , path     = require('path');
var bcrypt = require('bcryptjs')

// console.log(path.join(__dirname + '/../../../public/uploads/avatar'))

getExpressPath = function(){
    return path.join(__dirname + '/../../../public/uploads/section') ;
}

getReadablePath = function(){
    return '/public/uploads/section'
}

getStorage = function(){
    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'public/uploads/section/')
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



module.exports.express_path = getExpressPath()
module.exports.path = getReadablePath()
module.exports.upload = getStorage()
