var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/EditorApp',{ useNewUrlParser: true })
    .catch(err => {
        console.log(err)
    });


module.exports = mongoose