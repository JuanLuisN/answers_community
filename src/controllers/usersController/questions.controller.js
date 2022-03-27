const connection = require('../../database')

const controller = {}

controller.renderQuestions = async (req, res) => {
    const categories = await connection.query('select * from categories')
    const questions = await connection.query(
        `select q.id, q.fk_user, q.question, q.description, q.views, 'answers' as answers, c.category from questions q, categories c where q.fk_user = ${req.user.id} && q.fk_category = c.id`)
    for (let i = 0; i < questions.length; i++) {
        const respuestas = await connection.query(`select count(*) as answers from answers where fk_question = ${questions[i].id}`)
        questions[i].answers = respuestas[0].answers
    }
    res.render('user/questions', {
        questions, categories
    })
}

controller.renderDetailsQuestion = async (req, res) => {
    const { id } = req.params
    const question = await connection.query(
        `select u.username, q.question, q.description, c.category from questions q, categories c, users u where q.id = ${id} && q.fk_user = u.id && q.fk_category = c.id`)
    const views = await connection.query(`select count(*) as answers from answers where fk_question = ${id}`)
    const answers = await connection.query(
        `select a.id, u.username, a.fk_question, a.answer, a.votes from answers a, users u where fk_question = ${id} && a.fk_user = u.id`)
    res.render('user/detailsQuestion', {
        answers, username: question[0].username, question: question[0].question, description: question[0].description, category: question[0].category, views: views[0].answers
    })
}

controller.saveQuestion = async (req, res) => {
    const { question, description, fk_category } = req.body
    const newQuestion = {
        fk_user: req.user.id,
        question,
        description,
        views: 0,
        fk_category
    }
    try {
        await connection.query('insert into questions set ?', [newQuestion])
        req.flash('success_msg', 'Question added successfully')
        res.redirect('/myquestions')
    } catch (error) {
        console.log(error)
        req.flash("error_msg", "Something went wrong, try again")
        res.redirect('/myquestions')
    }
}

controller.editQuestion = async (req, res) => {
    const { id } = req.params
    const { question, description } = req.body
    const User = await connection.query(`select * from questions where id = ${id} && fk_user = ${req.user.id}`)
    const newQuestion = {
        question,
        description
    }
    try {
        if (User) {
            await connection.query('update questions set ? where id = ?', [newQuestion, id])
            req.flash('success_msg', 'Question edited successfully')
            res.redirect('/myquestions')
        } else {
            req.flash("error_msg", "You do not have permission to delete this data")
            res.redirect('/myquestions')
        }
    } catch (error) {
        console.log(error)
        req.flash("error_msg", "Something went wrong, try again")
        res.redirect('/myquestions')
    }
}

controller.deleteQuestion = async (req, res) => {
    const { id } = req.params
    const User = await connection.query(`select * from questions where id = ${id} && fk_user = ${req.user.id}`)
    try {
        if (User) {
            await connection.query('delete from questions where id = ?', [id])
            req.flash('success_msg', 'Question deleted successfully')
            res.redirect('/myquestions')
        } else {
            req.flash("error_msg", "You do not have permission to delete this data")
            res.redirect('/myquestions')
        }
    } catch (error) {
        console.log(error)
        req.flash("error_msg", "Something went wrong, try again")
        res.redirect('/myquestions')
    }
}


module.exports = controller