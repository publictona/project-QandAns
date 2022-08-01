const userModel = require('../Models/userModel')
const questionModel = require('../Models/questionModel')
const answerModel = require('../Models/answerModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')


const isValid = function (value) {
    if (typeof value == "undefined" || value == null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    if (typeof value === Number && value.trim().length === 0) return false
    return true
}


//========================================create user=======================================================================

const createUserValidation = async function (req, res, next) {
    try {
        let data = req.body
        if (Object.keys(data) == 0) {
            return res.status(400).send({ status: false, msg: "Bad request plz provide data" })
        }
        let { fname, lname, email, phone, password, creditScore } = data

        // validation
        if (!isValid(fname)) {
            return res.status(400).send({ status: false, msg: "lname is required" })
        }
        if (!(/^(?![\. ])[a-zA-Z\. ]+(?<! )$/.test(fname))) {
            return res.status(400).send({ status: false, msg: "Please provide a valid fname" })
        }

        if (!isValid(lname)) {
            return res.status(400).send({ status: false, msg: "lname is required" })
        }
        //email validation
        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "email is required" })
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            return res.status(400).send({ status: false, msg: "Please provide a valid email" })
        }

        let uniqueEmail = await userModel.findOne({ email })
        if (uniqueEmail) {
            return res.status(400).send({ status: false, msg: "Email Already Exist" })
        }
        //phone validation

        let uniquePhone = await userModel.findOne({ phone })
        if (uniquePhone) {
            return res.status(400).send({ status: false, msg: "Phone Number Already Exist" })
        }
        //indian phone no regex
        if (!(/^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/.test(phone))) {
            return res.status(400).send({ status: false, msg: "Please Provide a Valid Phone Number" })
        }

        //password validation
        if (!isValid(password)) {
            return res.status(400).send({ status: false, msg: "password is required" })
        }
        if (!(password.length >= 8 && password.length <= 15)) {
            return res.status(400).send({ status: false, msg: "Password Should be minimum 8 characters and maximum 15 characters", });
        }

        // Password Encryption :-
        let protectedPassword = await bcrypt.hash(password, 10)
        data.password = protectedPassword

        if (!isValid(creditScore)) {//number regex
            return res.status(400).send({ status: false, msg: "creditScore is required" })
        }
        next()

    } catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, msg: "err.message" })
    }
}

//====================================================//LOGIN USER VALIDATION====================================================
const loginUserValidation = async function (req, res) {
    try {
        const data = req.body;
        if (Object.keys(data) == 0) {
            return res.status(400).send({ status: false, msg: "Bad Request, No Data Provided" })
        }

        const { email, password } = data;

        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: "Email is required." });
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim()))) {
            return res.status(400).send({ status: false, msg: "Please provide a valid email" })
        }

        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: "Password is required." });
        }

    } catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, msg: "err.message" })
    }
}


//==================================================//UPDATE USER VALIDATION//====================================================

const updateUserValidation = async function (req, res, next) {
        try {
            let data = req.body
            if (Object.keys(data) == 0) {
                return res.status(400).send({ status: false, msg: "Bad request plz provide data" })
            }
            let { fname, lname, email, phone, password, creditScore } = data

            // if (!validator.isValid(userId)) {
            //     return res.status(400).send({ status: false, msg: "userId is required for update data" })
            // }
    
    
            // if (Object.keys(bodyData) == 0) {
            //     return res.status(400).send({ status: false, msg: "Bad Request, No Data Provided" })
            // }
    
    
            // if (req.userId != userId) {
            //     return res.status(401).send({ status: false, message: "You're not Authorized" })
            // }
    
            // const { fname, lname, email, phone, profileImage, password, address } = bodyData;
    
            // let updateUser = {};
    
            // // Validation for first and  name :-
            // if (fname == 0) {
            //     return res.status(400).send({ status: false, msg: "first name should not be empty" })
            // }
            // updateUser["fname"] = fname;
    
            // // Validation for last name :-
            // if (lname == 0) {
            //     return res.status(400).send({ status: false, msg: "Last name should not be empty" })
            // }
            // updateUser["lname"] = lname;
    
            // // For profileImage
            // if (profileImage) {
            //     if (files && files.length > 0) {
            //         profileImage = await uploadFile(files[0]);
            //     }
            //     updateUser["profileImage"] = profileImage;
            // }
    
            // // Validation for Email :-
            // if (email == 0) {
            //     return res.status(400).send({ status: false, msg: "Email should not be empty" })
            // }
    
            // if (email) {
            //     if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim()))) {
            //         return res.status(400).send({ status: false, message: "Please enter valid a email " });
            //     }
    
            //     let uniqueEmail = await userModel.findOne({ email })
            //     if (uniqueEmail) {
            //         return res.status(400).send({ status: false, msg: "Email Already Exist" })
            //     }
            //     updateUser["email"] = email;
            // }
    
            // // Validation for Password :-
            // if (password == 0) {
            //     return res.status(400).send({ status: false, msg: "Password should not be empty" })
            // }
    
            // if (password) {
            //     if (!(password.length >= 8 && password.length <= 15)) {
            //         return res.status(400).send({ status: false, msg: "Password should be minimum 8 characters and maximum 15 characters", });
            //     }
    
            //     let hash = bcrypt.hashSync(password, saltRounds);
            //     updateUser["password"] = hash;
            // }
    
            // // Validation For Phone Number :-
            // if (phone == 0) {
            //     return res.status(400).send({ status: false, msg: "Phone Number should not be empty" })
            // }
    
            // if (phone) {
            //     if (!(/^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/.test(phone))) {
            //         return res.status(400).send({ status: false, message: "Please enter a valid phone number" });
            //     }
    
            //     let duplicatePhone = await userModel.findOne({ phone });
            //     if (duplicatePhone) {
            //         return res.status(400).send({ status: false, msg: "Phone number already exist" });
            //     }
            //     updateUser["phone"] = phone;
            // }




            next()
        } catch (err) {
            console.log(err)
            return res.status(500).send({ status: false, msg: "err.message" })
        }
    }

    //==========================================EXPORTING================================================================

    module.exports = {createUserValidation,loginUserValidation ,updateUserValidation}



































