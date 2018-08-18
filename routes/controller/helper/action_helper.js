const Action = require('./../../../db/model/action')


createAction = function(type,object,modelValue){
    let action = new Action({
        type: type,
        options:{
            model:modelValue,
            _ref:object._id , 
            _creator: object._creator
        }
    })

    return action.save()
}


module.exports.create = createAction