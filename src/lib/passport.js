const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const helpers = require('../helpers/helpers')
const connection = require('../database')

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req, email, password, done) => {
    const rows = await connection.query(`select * from users where email = '${email}'`)
    if (rows.length > 0) {
        const user = rows[0]
        const validatePassword = await helpers.mathPassword(password, user.password)
        if (validatePassword) {
            done(null, user, req.flash('success_msg', `Bienvenido ${user.username}`))
        } else{
            done(null, false, req.flash('error_msg', 'Contraseña incorrecta. Intentalo de nuevo'))
        }
    } else{
        return done(null, false, req.flash('error_msg', 'El correo no existe. Intentalo de nuevo'))
    }
}))

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done ) => {
    const existsemail = await helpers.emailExists(email)    
    if(!existsemail){
        const { username, fullname } = req.body
        const newUser = {
            username,
            fullname,
            email,
            password
        }
        newUser.password = await helpers.encryptPassword(password)
        const result = await connection.query('insert into users set ?', [newUser])
        req.flash("success_msg", "Account registered successfully")
        newUser.id = result.insertId
        return done(null, newUser)
    } else {
        return done(null, false, req.flash("error_msg", "The email is already registered"))
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    const rows = await connection.query(`select * from users where id = ${id}`)
    done(null, rows[0])
})