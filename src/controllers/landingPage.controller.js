const connection = require('../database')

controller = {}

controller.renderLandingPage = async (req, res) => {
    const categories = await connection.query('select * from categories')
    const questions = await connection.query(
        `select q.id, u.username, q.question, q.description, q.views, 'answers' as answers, c.category from questions q, categories c, users u where q.fk_user = u.id && q.fk_category = c.id`)
    for (let i = 0; i < questions.length; i++) {
        const respuestas = await connection.query(`select count(*) as answers from answers where fk_question = ${questions[i].id}`)
        questions[i].answers = respuestas[0].answers
    }
    res.render('index', {
        questions, categories
    })
}

controller.renderLandingPageByCategory = async (req, res) => {
    const { category } = req.params
    const categories = await connection.query('select * from categories')
    const questions = await connection.query(
        `select q.id, u.username, q.question, q.description, q.views, 'answers' as answers, c.category from questions q, categories c, users u where q.fk_user = u.id && q.fk_category = c.id && q.fk_category = ${category}`)
    for (let i = 0; i < questions.length; i++) {
        const respuestas = await connection.query(`select count(*) as answers from answers where fk_question = ${questions[i].id}`)
        questions[i].answers = respuestas[0].answers
    }
    res.render('index', {
        questions, categories, category: questions[0].category
    })
}

controller.searchQuestion = async (req, res) => {
    try {
        const { search } = req.body;
        const categories = await connection.query('select * from categories')
        const questions = await connection.query(
            `select q.id, u.username, q.question, q.description, q.views, 'answers' as answers, c.category from questions q, categories c, users u where q.fk_user = u.id && q.fk_category = c.id && q.question like '%${search.toLowerCase()}%'`)
        for (let i = 0; i < questions.length; i++) {
        const respuestas = await connection.query(`select count(*) as answers from answers where fk_question = ${questions[i].id}`)
        questions[i].answers = respuestas[0].answers
    }
        res.render('index', { questions, categories });
      } catch (error) {
        console.log(error);
        res.redirect('/')
      }
  
}

module.exports = controller