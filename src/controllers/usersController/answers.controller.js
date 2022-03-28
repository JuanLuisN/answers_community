const connection = require('../../database')

const controller = {}

controller.renderAnswers = async (req, res) => {
    const answers = await connection.query(
        `select a.id, a.fk_user, a.fk_question, q.question, a.answer, a.votes from answers a, questions q where a.fk_user = ${req.user.id} && a.fk_question = q.id`)
    res.render('user/answers',{
        answers
    })
}

controller.saveAnswer = async (req, res) => {
    const { id } = req.params
    const { answer } = req.body
    const newAnswer = {
        fk_user: req.user.id,
        fk_question: id,
        answer,
        votes: 0
    }
    try {
        await connection.query('insert into answers set ?', [newAnswer])
        req.flash('success_msg', 'Answer added successfully')
        res.redirect(`/details-question=${id}`)
    } catch (error) {
        console.log(error)
        req.flash("error_msg", "Something went wrong, try again")
        res.redirect(`/details-question=${id}`)
    }
}

controller.editAnswer = async (req, res) => {
    const { id } = req.params
    try {
        await connection.query('update answers set ? where id = ?', [req.body, id])
        req.flash('success_msg', 'Answer edited successfully')
        res.redirect(req.get('referer'))
    } catch (error) {
        console.log(error)
        req.flash("error_msg", "Something went wrong, try again")
        res.redirect(req.get('referer'))
    }
}

controller.deleteAnswer = async (req, res) => {
    const { id } = req.params    
    const User = await connection.query(`select * from answers where id = ${id} && fk_user = ${req.user.id}`)
    try {
        if (User) {
            await connection.query('delete from answers where id = ?', [id])
            req.flash('success_msg', 'Answer deleted successfully')
            res.redirect(req.get('referer'))
        } else {
            req.flash("error_msg", "You do not have permission to delete this data")
            res.redirect(req.get('referer'))
        }
    } catch (error) {
        console.log(error)
        req.flash("error_msg", "Something went wrong, try again")
        res.redirect(req.get('referer'))
    }
}

controller.addVote = async (req, res) => {
    const { fk_answer, fk_question} = req.params
    const voteExists = await connection.query(`select * from answers_votes where fk_answer = ${fk_answer} && fk_question = ${fk_question} && fk_user = ${req.user.id}`)
    const getVotes = await connection.query(`select * from answers where id = ${fk_answer}`)
    const newVote = {
        fk_answer,
        fk_question,
        fk_user: req.user.id
    }
    try {
        if (voteExists.length < 1) {
            const votes = parseInt(getVotes[0].votes) + 1
            await connection.query('insert into answers_votes set ?', [newVote])
            await connection.query(`update answers set votes = ${votes} where id = ${fk_answer}`)
            req.flash('success_msg', 'The answer was upvoted')
            res.redirect(`/details-question=${fk_question}`)
        } else {
            req.flash('error_msg', 'You have already upvoted this answer')
            res.redirect(`/details-question=${fk_question}`)
        }
    } catch (error) {
        console.log(error)
        req.flash("error_msg", "Something went wrong, try again")
        res.redirect(`/details-question=${fk_question}`)
    }
}

controller.subtractVote = async (req, res) => {
    const { fk_answer, fk_question} = req.params
    const voteExists = await connection.query(`select * from answers_votes where fk_answer = ${fk_answer} && fk_question = ${fk_question} && fk_user = ${req.user.id}`)
    const getVotes = await connection.query(`select * from answers where id = ${fk_answer}`)
    const newVote = {
        fk_answer,
        fk_question,
        fk_user: req.user.id
    }
    try {
        if (voteExists.length < 1) {
            const votes = parseInt(getVotes[0].votes) - 1
            await connection.query('insert into answers_votes set ?', [newVote])
            await connection.query(`update answers set votes = ${votes} where id = ${fk_answer}`)
            req.flash('success_msg', 'The answer was upvoted')
            res.redirect(`/details-question=${fk_question}`)
        } else {
            req.flash('error_msg', 'You have already upvoted this answer')
            res.redirect(`/details-question=${fk_question}`)
        }
    } catch (error) {
        console.log(error)
        req.flash("error_msg", "Something went wrong, try again")
        res.redirect(`/details-question=${fk_question}`)
    }
}

module.exports = controller