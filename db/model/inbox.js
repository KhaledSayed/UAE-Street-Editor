const db = require('../config/config')

const Schema = db.Schema ;

const inboxSchema = new Schema({
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        _creator:{
            required:true , 
            type: Schema.Types.ObjectId , ref: 'User'
        },
        _receiver:{
            required:true , 
            type: Schema.Types.ObjectId , ref: 'User'
        },
        seen:{
            type: Boolean,
            default:false
        }
   }
);


var Inbox = db.model('Inbox',inboxSchema)

module.exports = Inbox