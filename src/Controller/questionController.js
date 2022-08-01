const userModel = require ('../Models/userModel')
const questionModel = require('../Models/questionModel')
const mongoose = require('mongoose')
//const moment = require('moment');

//===========================================================//create question api//================================================================
const createQuestion = async (req,res) =>{
   try{
       let data = req.body
       let created = await questionModel.create(data)
       res.status(201).send({status:true ,msg :"success" ,data : created})
    
    } catch(err){
        console.log(err.message)
        res.status(500).send({status:false , msg : "err.message"})
    }

}

//========================================================= //GET QUESTION -anyone can get this question(public)====================================================================//
//get all Q pending
const getQuestion = async (req,res) =>{
    try{
        let data = req.query
        let filter = [{tag :data.tag}]

         //if(!validation.isValidRequestBody(req.query)){
            if(!data.req.query){
             let question = await questionModel.find({isDeleted:false})
             return res.status(200).send({status:true , data :question})
         }

        let getQuestionByTag = await questionModel.findOne({$or:filter ,isDeleted:false}).sort({tag : -1})
        return res.status(200).send({status :true ,data : getQuestionByTag})
    
    }catch(err){
        console.log(err)
        res.status(500).send({status: false , msg :err.message})
    }

}
//==========================================================GET QUESTION ID===============================================================//

const getQuestions = async (req,res) =>{
    let questionId = req.params.questionId
    try{
        if(!mongoose.isValidObjectId(questionId))
        return res.status(400).send({status :false ,message :"Invalid question ObjectId"})

        let findQuestion = await questionModel.findOne({_id :questionId ,isDeleted:false})
        if(!findQuestion){
        return res.status(400).send({status:false ,message :"question Not Found"})
    }
    res.status(200).send({status:true , data : findQuestion})


    }catch(err){
        console.log(err)
        res.status(500).send({status:false , msg :"err.msg"})
    }
}
//============================================================//UPDATE BY questionID===========================================================// 

const updateQuestion = async (req,res) =>{
    let data = req.body
    let questionId =req.params.questionId
    //let authUser = req.headers['valid-auth-user_id']
    
    try{
        let findQuestion = await questionModel.findById(questionId)
        if(!findQuestion)
        res.status(404).send({status:false , message: "There is No question available with this questionId."})
      
        //authorization
        //if(findQuestion.userId !=authUser)
        //return res.status(401).send({status:false ,msg:"You don't have Authority to Update this question"})

        let updateQuestion = await questionModel.findOneAndUpdate({_id :findQuestion ,isDeleted: false},{tag:req.body.tag},{new:true})
        if(!updateQuestion){
        return res.status(404).send({status:false, message:"question not found"})
    }
    res.status(200).send({status:true, message: "Question updated Successfully",data: updateQuestion })
        
}catch(err){
    console.log(err.message)
    res.status(500).send({status: false ,message :err.message})
}
}
//==========================================================//DELETE QUESTION BY ID//==========================================================
//pending
// ### DELETE /questions/:questionId(authentication and authorisation )

const deleteQuestion = async (req,res) =>{
    let questionId = req.params.questionId
    //let authUser = req.headers['valid-auth-user_id']
    try{
        let findQuestion = await questionModel.findOne({questionId :questionId ,isDeleted:false})
        if(!findQuestion)
        return res.status(404).send({status:false ,message : "Question is not found "})
      
        //authorization
        // if(findQuestion.userId ! = authUser)
        // return res.status(401).send({status:false ,message : " you don't have authorization to delete this question"})
        let deleteQuestion = await questionModel.findOneAndUpdate([
                                                                  {questionId:findQuestion ,isDeleted:false},
                                                                  {isDeleted:true},
                                                                  {new:true},
                                                                  {deletedAt:Date.now()}
                                                                  ])
                                                                  
                                                                  if(!deleteQuestion){
                                                                      return res.status(404).send({status:false ,msg:"quuestion is already deleted", data:deleteQuestion})
                                                                 }
                                                                  res.status(200).send({status:true ,message : "Question Deleted Successfully" ,data:deleteQuestion })
    }catch(err){
        console.log(err)
        res.status(500).send({status:false , message: err.message})
    }

}
//*********************************************************//EXPORTING//***********************************************************************//

 module.exports = {createQuestion ,getQuestion,getQuestions,updateQuestion,deleteQuestion}

 