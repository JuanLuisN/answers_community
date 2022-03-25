const passport = require('passport')
const connection = require('../../database')
const helpers = require('../../helpers/helpers')

const controller = {}

controller.renderSignin = (req, res) => {
    res.render('auth/signin')
}

controller.renderSignup = (req, res) => {
    res.render('auth/signup')
}

controller.renderProfile = (req, res) => {
    res.render('auth/profile')
}

controller.editProfile = async (req, res) => {
    try {
        const email = await connection.query(`select email from users where id = ${req.user.id}`)
        req.body.password = await helpers.encryptPassword(req.body.password)
        if (email[0].email === req.body.email) {
            await connection.query('update users set ? where id = ?', [req.body, req.user.id])
            req.flash("success_msg", "Account edited successfully")
            console.log("entre aqui", req.body)
            res.redirect('/profile')
        } else {
            const existsemail = await helpers.emailExists(req.body.email)
            if(!existsemail){    
                await connection.query('update users set ? where id = ?', [req.body, req.user.id])
                req.flash("success_msg", "Account edited successfully")
                console.log(req.body)
                res.redirect('/profile')
            } else {
                req.flash("error_msg", "The email is already registered")
                res.redirect('/profile')
            }      
        }
    } catch (error) {
        console.log(error)
        req.flash("error_msg", "Something went wrong, try again")
        res.redirect('/profile')
    }
}

controller.signIn = passport.authenticate('local.signin', {
        successRedirect: '/',
        failureRedirect: '/signin',
        failureFlash: true
})

controller.signUp = passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
})

controller.logOut = (req, res, next) => {
    req.logOut()
    res.redirect('/signin')
}

module.exports = controller