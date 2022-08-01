const mongoose = require('mongoose');
const { modelName } = require('./userModel');
ObjectId = mongoose.Schema.Types.ObjectId

const answerSchema = new mongoose.Schema({

    answeredBy :{
        type :ObjectId,
        ref :'User',
        required :true,
        trim:true
    },

    text : {
        type: String,
        required:true,
        trim:true
    },

    questionId:{
        type:ObjectId,
        ref :'Question',
        required:true,
        trim:true
    },
    
    isDeleted:{
        type :Boolean,
        default :false
    }

},{timestamps:true})

module.exports = mongoose.model('Answer',answerSchema)


