const connection = require('../../database')

const controller = {}

controller.renderQuestions = async (req, res) => {
    const categories = await connection.query('select * from categories')
    const questions = await connection.query(
        `select q.id, q.fk_user, q.question, q.description, q.image, q.views, 'answers' as answers, c.category from questions q, categories c where q.fk_user = ${req.user.id} && q.fk_category = c.id`)
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
    let answers
    if(req.user) {
        answers = await connection.query(
            `select a.id, a.fk_user, '${req.user.id}' as user, u.username, a.fk_question, a.answer, a.votes from answers a, users u where fk_question = ${id} && a.fk_user = u.id ORDER BY votes DESC`)
        const viewExists = await connection.query(`select * from questions_views where fk_user = ${req.user.id} && fk_question = ${id}`)
        if (viewExists.length < 1) {
            const newView = {
                fk_user: req.user.id,
                fk_question: id
            }
            const getViews = await connection.query(`select * from questions where id = ${id}`)
            const views = parseInt(getViews[0].views) + 1
            await connection.query(`update questions set views = ${views} where id = ${id}`)
            await connection.query('insert into questions_views set ?', [newView])
        }
    } else {
        answers = await connection.query(
            `select a.id, a.fk_user, u.username, a.fk_question, a.answer, a.votes from answers a, users u where fk_question = ${id} && a.fk_user = u.id ORDER BY votes DESC`)
    }
    const question = await connection.query(
        `select q.id, u.username, q.question, q.description, q.image, q.views, c.category from questions q, categories c, users u where q.id = ${id} && q.fk_user = u.id && q.fk_category = c.id`)
    res.render('user/detailsQuestion', {
        answers, idquestion: question[0].id, username: question[0].username, question: question[0].question, description: question[0].description, image: question[0].image, category: question[0].category, views: question[0].views
    })
}

controller.saveQuestion = async (req, res) => {
    const { question, description, image, fk_category } = req.body
    const newQuestion = {
        fk_user: req.user.id,
        question,
        description,
        image,
        views: 0,
        fk_category
    }
    try {
        await connection.query('insert into questions set ?', [newQuestion])
        req.flash('success_msg', 'Question added successfully')
        res.redirect('back')
    } catch (error) {
        console.log(error)
        req.flash("error_msg", "Something went wrong, try again")
        res.redirect('back')
    }
}

controller.editQuestion = async (req, res) => {
    const { id } = req.params
    const { question, description, image } = req.body
    const User = await connection.query(`select * from questions where id = ${id} && fk_user = ${req.user.id}`)
    const newQuestion = {
        question,
        description,
        image
    }
    try {
        if (User.length < 1) {
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
    console.log(User)
    try {
        if (User.length < 1) {
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

controller.searchQuestion = async (req, res) => {
    try {
        const { search } = req.body;
        const categories = await connection.query('select * from categories')
        const questions = await connection.query(
            `select q.id, q.fk_user, q.question, q.description, q.image, q.views, 'answers' as answers, c.category from questions q, categories c where q.fk_user = ${req.user.id} && q.fk_category = c.id && q.question like '%${search.toLowerCase()}%'`)
        for (let i = 0; i < questions.length; i++) {
        const respuestas = await connection.query(`select count(*) as answers from answers where fk_question = ${questions[i].id}`)
        questions[i].answers = respuestas[0].answers
        }
        res.render('user/questions', {
            questions, categories
        })
      } catch (error) {
        console.log(error);
        res.redirect('/myquestions')
      }
  
}


module.exports = controller