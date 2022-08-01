const mongoose = require('mongoose');
ObjectID = mongoose.Schema.Types.ObjectId

const questionSchema = new mongoose.Schema({

    description : {
        type:String,
        required:true,
        trim:true
    },

    tag:{
        type: ['string'],
        trim:true
   },

   askedBy:{
       type:ObjectID,
       ref:'User',
       trim:true
   },

   deletedAt:{
       type:Boolean,
       default:null,
       trim:true
   }

},{timestamps:true})

module.exports = mongoose.model('Question',questionSchema)


