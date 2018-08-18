const db = require('../config/config')

const Schema = db.Schema ;

const taskSchema = new Schema({
    title:{
        type: String, 
        required:true 
    },
    description:{
        type: String ,
        required: true
    },
    _creator:{ 
        required: true ,
        type: Schema.Types.ObjectId, ref: 'User' 
   },
   _receiver: {
       required: true ,
       type: Schema.Types.ObjectId , ref: 'User'
   },
   done:{
       type: Boolean,
       default: false
   }
})

var Task = db.model('Task',taskSchema)

module.exports = Task