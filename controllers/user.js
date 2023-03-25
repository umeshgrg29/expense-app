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

module.exports = {
    signup
}