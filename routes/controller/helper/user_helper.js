var    crypto = require('crypto');
var    mime = require('mime');
var    multer = require('multer')  , path     = require('path');
var bcrypt = require('bcryptjs')

// console.log(path.join(__dirname + '/../../../public/uploads/avatar'))

getExpressPath = function(){
    return path.join(__dirname + '/../../../public/uploads/avatar') ;
}

getReadablePath = function(){
    return '/public/uploads/avatar'
}

getStorage = function(){
    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'public/uploads/avatar/')
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


isPasswordCorrect = function(password,hash){
    console.log(password,hash)
    // console.log(bcrypt.compareSync(password, hash))
    console.log("======================================")
    return bcrypt.compareSync(password, hash);
}


testPassword = function(password){
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    
    console.log(password)
    console.log(hash)
    console.log(bcrypt.compareSync(password, hash));
    console.log("===============")
}


  module.exports.express_path = getExpressPath()
  module.exports.path = getReadablePath()
  module.exports.upload = getStorage()
  module.exports.isPasswordCorrect = isPasswordCorrect
  module.exports.testPassword = testPassword