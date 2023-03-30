const User = require('../models/User')
const bcrypt = require('bcrypt')

const signup = async (req, res) => {
    console.log("Inside signup controller")
    try {
        const { name, email, password } = req.body;
        console.log('email', email)
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            console.log(err)
            await User.create({ name, email, password: hash })
            res.status(201).json({ message: 'Successfuly create new user' })
        })
    } catch (err) {
        res.status(500).json(err);
    }

}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(password);
        const user = await User.findAll({ where: { email } })
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    throw new Error('Something went wrong')
                }
                if (result === true) {
                    return res.status(200).json({ success: true, message: "User logged in successfully" })
                }
                else {
                    return res.status(400).json({ success: false, message: 'Password is incorrect' })
                }
            })
        } else {
            return res.status(404).json({ success: false, message: 'User Doesnot exitst' })
        }
    } catch (err) {
        res.status(500).json({ message: err, success: false })
    }
}

module.exports = {
    signup,
    login
}