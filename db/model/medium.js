const db = require('../config/config')

const Schema = db.Schema ;

const mediumSchema = new Schema({
    url:{
        type: String, 
        required:true 
    },
    type:{
        type: String ,
        enum: ["Video","Image"],
        required: true
    },
    _creator:{ 
        required: true ,
        type: Schema.Types.ObjectId, ref: 'User' 
   },
   _section: {
       required: true ,
       type: Schema.Types.ObjectId , ref: 'Section'
   },
   status: {
       type:Number , 
       enum: [1001,1002,1003,1004,1005]
   }
})

var Medium = db.model('Medium',mediumSchema)

module.exports = Medium