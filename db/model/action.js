const db = require('../config/config')

const Schema = db.Schema ;

const actionSchema = new Schema({
    type: {
        type: Number , 
        enum: [1001,1002,1003,1004,1005,2001,2002,2003,2004,3001]
    },
   options:{
        model: {
        type: Schema.Types.String
        },
        _ref: {
            type: Schema.Types.ObjectId , required: true , refPath: 'options.model'
        },
        _creator: {
            required:true , 
            type: Schema.Types.ObjectId , ref: 'User'
        }
   }
});


var Action = db.model('Action',actionSchema)

module.exports = Action