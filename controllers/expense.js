const Expense = require('../models/expenses');
const User = require('../models/users')
const sequelize = require('../util/database')
const UserServices = require('../services/userservices')
const S3service = require('../services/S3services')


const downloadexpense = async (req, res) => {
    try {

        if (!req.user.ispremiumuser) {
            return res.status(401).json({ success: false, message: 'User is not a premium User' })
        }
        const expenses = await UserServices.getExpenses(req);
        // console.log(expenses)
        const stringifiedExpenses = JSON.stringify(expenses);
        const userId = req.user.id;
        const filename = `Expense${userId}/${new Date()}.txt`
        const fileURL = await S3service.uploadToS3(stringifiedExpenses, filename);
        // console.log(fileURL)
        res.status(200).json({ fileURL, success: true })
    }
    catch (err) {
        // console.log(err)
        res.status(500).json({ fileURL: '', success: false })
    }
}

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

// const getexpenses = (req, res) => {

//     Expense.findAll({ where: { userId: req.user.id } }).then(expenses => {
//         // console.log('>>>>>>>>>>>>>>inside expense', expenses)
//         return res.status(200).json({ expenses, success: true })
//     })
//         .catch(err => {
//             console.log(err)
//             return res.status(500).json({ error: err, success: false })
//         })
// }
const expense_per_page = 3;

const getexpenses = (req, res) => {
    const page = +req.query.page || 1;
    let totalExp;
    // console.log(req.user.id)
    // totalExp = total;
    Expense.findAndCountAll({
        where: { userId: req.user.id },
        offset: (page-1) * expense_per_page,
        limit : expense_per_page
    }).then((expenses) => {
        // console.log(">>>>>>>>>>>>>>>>>>>>>total expenses are ", expenses.count)
         totalExp = expenses.count
        res.status(200).json({
            expenses: expenses,
            success: true,
            pageData: {
                currentPage: page,
                hasNextPage: expense_per_page * page < totalExp,
                nextPage: page + 1,
                hasPreviousPage: page > 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalExp / expense_per_page)
            }
        });
    })
        .catch(err => {
            // console.log(err)
            return res.status(500).json({ error: err, success: false })
        })

}

const deleteexpense = async (req, res) => {
    const expenseid = req.params.expenseid;
    if (expenseid == undefined || expenseid.length === 0) {
        return res.status(400).json({ success: false, })
    }

    // const user = await User.findOne({ where: { id: req.user.userId } });
    // console.log(user.totalExpenses)
    //  const exp =  await Expense.findAll({ where: { id: expenseid } })

    //  console.log("expense is >>>>>>>>>>>>>>>>>>>>>>>>>>>>", exp)

    Expense.destroy({ where: { id: expenseid, userId: req.user.id } }).then((noofrows) => {
        if (noofrows === 0) {
            return res.status(404).json({ success: false, message: 'Expense doesnt belong to the user' })
        }
        return res.status(200).json({ success: true, message: "Deleted Successfuly" })
    }).catch(err => {
        // console.log(err);
        return res.status(500).json({ success: true, message: "Failed" })
    })
}

module.exports = {
    deleteexpense,
    getexpenses,
    addexpense,
    downloadexpense
}