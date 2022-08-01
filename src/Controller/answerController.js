const answerModel = require('../Models/answerModel')
const questionModel = require('../Models/questionModel')


//### POST /answer(authentication and authorisation required)
// Please note a user can not answer their own question. In such a scenario, return a suitable HTTP status code and message.
const createAnswer = async (req,res) => {
    try{
        let data = req.body
        let created = await answerModel.create(data)
        res.status(201).send({status:true ,data: created})
    }catch(err){
        console.log(err)
        res.send(500).send({status:false , msg : err.message})

    }
} 

//=========================================================### GET questions/:questionId/answer (public api)=========================================//
//get all the answers linked to the question id.

const getAllAnswerWithQuestion = async (req,res) =>{
    let questionId =req.params.questionId
    try{

        //await answerModel.find()
        let getQuestion = await questionModel.findOneAndUpdate({_id :questionId ,isDeleted:false},{new:true})
        getQuestion._doc["answerData"] =await answerModel.find({questionId})
        if(!getQuestion)
        return res.status(404).send({status:false , msg : "question is not found"})
        res.status(200).send({status: true  ,data :getQuestion})
        
}catch(err){
        console.log(err)
        res.status(500).send({status: false ,msg :err.message})

    }

 }
 //=========================================================### PUT /answer/:answerId (authentication and authorisation required)=====================================
//pending
 const updateAnswer = async (req,res) =>{
    try{
        let answerId = req.params.answerId
        //let data = req.body
       

        let findAnswer = await answerModel.findById({_id :answerId ,isDeleted:false})
        if(findAnswer)
         return res.status(404).send({status:false ,msg :" Answer is not found"})

        let updateAns = await answerModel.findOneAndUpdate(
                                                            {_id:findAnswer ,isDeleted:false},
                                                            {answeredBy :req.body.answeredBy,
                                                             questionId: req.body.questionId,
                                                             text :req.body.text},
                                                            {new:true}
                                                            )
                                                            if(!updateAns){
                                                                return res.status(404).send({status:false ,msg :"answer is not found"})
                                                            }
                                                            res.send(200).send({status:true,data :updateAns})//check status code)

       
    }catch(err){
        console.log(err)
        res.status(500).send({status:false ,msg :err.message})
    }
}
//==========================================### DELETE answers/:answerId(authentication and authorisation required)=========================================//

// -only the user posted the answer can delete it. Get the userId and questionId in the request body.
// - __Response format__
//   - _**On success**_ - Return HTTP status 200. Also return the answer document. The response should be a JSON object like [this](#successful-response-structure)
//   - _**On error**_ - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like [this](#error-response-structur
    
const deleteAnswer = async (req,res) =>{
    let answerId =req.params.answerId
    //let authUser = req.headers[valid-auth-user_id]
    try{
        let findAnswer =await answerModel.findOne({_id :answerId ,isDeleted :false})
        if(!findAnswer)
        return res.status(404).send({status:false ,msg : "Answer is not found"})

        //Authorization
        // if(findAnswer.userId != authUser)
        //     return res.status(401).send({
        //         status: false,
        //         message: "You don't have Authorization to delete this book."
        //     })
        await answerModel.findByIdAndUpdate({_id:findAnswer ,isDeleted :false},{isDeleted: true} ,{new:true})
        res.status(200).send({status: false , msg :"Answer Deleted successfully"})


    }catch(err){
        console.log(err)
        res.status(500).send({status:false.valueOf, message :err.message})
    }

}

       








    module.exports ={createAnswer ,getAllAnswerWithQuestion,updateAnswer,deleteAnswer}