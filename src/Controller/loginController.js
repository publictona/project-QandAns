const userModel = require('../Models/userModel')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET || "WHAT is THIS? "
const exp = process.env.JWT_EXP || '5600'

const generateToken = (userDATA) =>{
    return jwt.sign({
        
        userId : userDATA._id.toString(),
    },secret , {expiresIn:exp})
}

const decodeToken =(token) =>{
    return jwt.verify(token,secret,(error,data) =>{
        if(error)
          return null
        else
          return data
    })
}

//================================================USER -AUTHORIZATION ===============================================================
// const userAuthorization = async (req,res,next) => {
//     try{
//         let token = req.headers['user-auth-key']
//         let verifyToken = decodeToken(token)
//         if(!verifyToken)
//             return res.status(401).send({
//                 status: false,
//                 message: "Token is either Invalid or Expired."
//             })
//         req.headers['valid-auth-user_id'] = verifyToken.userId
//         next()
//     }catch(err){
//         console.log(err.message)
//         res.status(500).sens({
//             status: false,
//             message: err.message
//         })
//     }
    
// }

// module.exports = userAuthorization

const userAuth = async (req,res,next) => {
    try{
        let token = req.headers['student-AUTH-key']
        let verifyToken =decodeToken(token)
        if(!verifyToken)
        return res.status(401).send({status:false ,msg :"token is either Invalid or Expired"})

        req.headers['valid-AUTH-user_id'] = verifyToken.userId
        next()


}catch(err){
    console.log(err.message)
    res.status(500).send({status:false ,msg :"error" ,error:err.message})
}
} 


//===========================================USERlogin===================================================//

const loginUser = async (req,res) =>{
    let data = req.body
    try{
        if(Object.keys(data).length === 2 && data.email && data.password){
            let userCheck = await userModel.findOne(data)
            if(!userCheck)
            return res.status(401).send({status:false ,message : "Invalid credentials user details are incorrect plz check"})
        
         
        let token = generateToken(userCheck)
        res.setHeader('x-api-key',token)
        res.status(200).send({status:true ,data:{
                                                  userId:userCheck._id.toString(),
                                                  token
                                                }
    })
} else{
    res.status(401).send({status:false, message : "please enter valid email and password"})
}

} catch(err){
    console.log(err.message)
    res.status(500).send({status:false ,message : "error" ,error : err.message})

     }
}

module.exports = {loginUser ,userAuth}

