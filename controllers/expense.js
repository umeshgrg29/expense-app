const Expense = require('../models/expenses');
const User = require('../models/users')
const sequelize = require('../util/database')

const addexpense = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { expenseamount, description, category } = req.body;

        if (expenseamount == undefined || expenseamount.length === 0) {
            return res.status(400).json({ success: false, message: 'Parameters missing' })
        }

        const expense = await Expense.create({ expenseamount, description, category, userId: req.user.id }, { transaction: t })
        const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount)
        await User.update({
            totalExpenses: totalExpense
        }, {
            where: { id: req.user.id },
            transaction: t
        })
        await t.commit();
        res.status(200).json({ expense: expense })
    }
    catch (err) {
        await t.rollback();
        return res.status(500).json({ success: false, error: err })
    }
}

const getexpenses = (req, res) => {

    Expense.findAll({ where: { userId: req.user.id } }).then(expenses => {
        // console.log('>>>>>>>>>>>>>>inside expense', expenses)
        return res.status(200).json({ expenses, success: true })
    })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ error: err, success: false })
        })
}

const deleteexpense = async (req, res) => {
    const expenseid = req.params.expenseid;
    if (expenseid == undefined || expenseid.length === 0) {
        return res.status(400).json({ success: false, })
    }
    
    //  const exp =  await Expense.findAll({ where: { id: expenseid } })

    //  console.log("expense is >>>>>>>>>>>>>>>>>>>>>>>>>>>>", exp)

    Expense.destroy({ where: { id: expenseid, userId: req.user.id } }).then((noofrows) => {
        if (noofrows === 0) {
            return res.status(404).json({ success: false, message: 'Expense doesnt belong to the user' })
        }
        return res.status(200).json({ success: true, message: "Deleted Successfuly" })
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ success: true, message: "Failed" })
    })
}

module.exports = {
    deleteexpense,
    getexpenses,
    addexpense
}