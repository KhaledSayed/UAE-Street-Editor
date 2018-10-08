const db = require('../config/config')

const Schema = db.Schema ;


const sectionSchema = new Schema({
    title: {
        type: String ,
        required: true 
    },
    description: {
        type: String , 
        required:false
    },
    template:{
        type: String ,
        required: true
    },
    width:{
        type: Number,
        default: 0
    },
    height:{
        type: Number,
        default: 0
    }
});

var Section = db.model('Section',sectionSchema);


module.exports = Section