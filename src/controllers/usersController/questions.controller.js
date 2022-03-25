const connection = require('../../database')

const controller = {}

controller.renderQuestions = async (req, res) => {
    const questions = await connection.query(
        `select q.id, q.fk_user, q.question, q.description, q.views, 'answers' as answers, c.category from questions q, categories c where q.fk_user = ${req.user.id} && q.fk_category = c.id`)
    for (let i = 0; i < questions.length; i++) {
        const respuestas = await connection.query(`select count(*) as answers from answers where fk_question = ${questions[i].id}`)
        questions[i].answers = respuestas[0].answers
    }
    res.render('user/questions', {
        questions
    })
}


module.exports = controller