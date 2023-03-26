const User = require('../models/User')

const signup = async (req, res, next) => {
    console.log("Inside signup controller")
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const data = await User.create({ name: name, email: email, password: password })
        res.status(201).json({ newUserDetail: data })
    }
    catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

const login = async (req, res, next ) => { 
    try{
        const {email, password} = req.body;
        const user = await User.findAll({where : {email}})
        
        if(user.length > 0){
            console.log(user)
            if(user[0].password === password)
            {
                res.status(200).json({success : true, message : "User logged in successfully"})
            }
            else{
                return res.status(400).json({success : false, message : "Password incorrect"})
            }
        }
        else{
            return res.status(404).json({success : false, message : "User doesn't exists"})
        }
    }
    catch(err){
        res.status(500).json({success : false, message : err})
    }
}

module.exports = {
    signup,
    login
}