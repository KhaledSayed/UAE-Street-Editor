const Action = require('./../../../db/model/action')


createAction = function(type,object,modelValue){
    let action = null
    console.log(type)

    if(type.status != 1003){
        type.note = null
    }

        action = new Action({
            type: type.status,
            note:type.note ,
            options:{
                model:modelValue,
                _ref:object._id , 
                _creator: object._creator
            }
        })
    
    

    return action.save()
}


module.exports.create = createAction