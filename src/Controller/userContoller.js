const { default: mongoose } = require('mongoose')
const userModel = require('../Models/userModel')
//const bcrypt = require('bcrypt')
//const validator = require("../validator/validator.js")

const registerUser = async function (req, res) {
    try {
        let data = req.body
        let created = await userModel.create(data)
        res.status(201).send({ status: true, msg: "success", data: created })

    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: "error", error: err.message })
    }
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++ GET USER DATAILS API-2 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

const getUser = async (req, res) => {
    let userId = req.params.userId
    try {
        //authorization
        if (!mongoose.isValidObjectId(userId))
            res.status(400).send({ status: false, msg: "invalid user _id plz check and retry" })

        let findUser = await userModel.findOne({ _id: userId, isDeleted: false })//isDeleted check
        if (!findUser) {
            return res.status(404).send({ status: false, msg: "user not found" })
        }

        res.status(200).send({ status: true, data: findUser })

    } catch (err) {
        console.log(err)
        res.send({ status: false, msg: err.message })
    }
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//UPDATE USER PROFILE//+++++++++++++++++++++++++++++++++++++++++++++++++++++++

const updateUser = async (req, res) => {
    let userId = req.params.userId
    //let authUser = req.headers['valid-auth-user_id']
    try {
        let findUser = await userModel.findById(userId)
        if (!findUser)
            return res.statsu(404).send({ status: false, msg: "userId not found please check and retry again" })

        //authorization
        //if(findUser.userId ! =authUser)
        // return res.status(401).send({status:false ,msg : "You don't have authority to update this book"})

        let updateUser = await userModel.findOneAndUpdate({ _id: findUser, isDeleted: false },
            {
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                phone: req.body.phone
            }, { new: true })

        if (!updateUser) {
            return res.status(404).send({ status: false, msg: "User not found in database" })
        }
        res.status(200).send({ status: true, data: updateUser })


    } catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, msg: err.message })
    }

}
//-----------------------------------------EXPORTING------------------------------------------------------------------------------------//

module.exports = { registerUser, getUser, updateUser }

