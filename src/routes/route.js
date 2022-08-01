const express = require('express')
const router = express.Router()
const userContoller = require("../Controller/userContoller")
const logincontoller = require ("../Controller/loginController")
const questionController = require('../Controller/questionController')
const answerContoller = require('../Controller/answerController')
const validation = require('../middleware/validation')

//@ USER ROUTE HANDLER
router.post('/register',validation.createUserValidation ,userContoller.registerUser)
router.post('/login',logincontoller.loginUser)
router.get('/user/:userId/profile',userContoller.getUser)
router.put('/user/:userId/profile',userContoller.updateUser)

//@ QUESTION ROUTE HANDLER
router.post('/question',questionController.createQuestion)
router.get('/questions',questionController.getQuestion)
router.get('/questions/:questionId',questionController.getQuestions)
router.put('/questions/:questionId',questionController.updateQuestion)
router.delete('/questions/:questionId',questionController.deleteQuestion)

//@ ANSWER ROUTE HANDLER
 router.post('/answer',answerContoller.createAnswer)
 router.get('/questions/:questionId/answer',answerContoller.getAllAnswerWithQuestion)
 router.put('/answer/:answerId',answerContoller.updateAnswer)
 router.delete('/answers/:answerId',answerContoller.deleteAnswer)

module.exports = router

