const db = require('../config/config')

const Schema = db.Schema ;

const logSchema = new Schema({
    title:{
        type: String, 
        required:true 
    },
    description:{
        type: String ,
        required: true
    },
    _action:{ 
        required: true ,
        type: Schema.Types.ObjectId, ref: 'Action' 
   },
   _receiver:{
       required:true,
       type:Schema.Types.ObjectId , ref: 'User'
   }
})

var Log = db.model('Log',logSchema)

module.exports = Log