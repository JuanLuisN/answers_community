const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')
const passport = require('passport')
const helpers = require('./helpers/helpers')

const { database } = require('./config/keys')

//Initializations
const app = express()
require('./lib/passport')
helpers.initialState()

//Settings
app.set('port', process.env.PORT || 5000)
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'components'),
    extname: '.hbs',
    helpers: require('./helpers/handlebars')
}))
app.set('view engine', '.hbs')

//Middlewares
app.use(session({
    secret: 'luisknifesqlsession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}))
app.use(flash())
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())

// Global variables
app.use((req, res, next) => {
    app.locals.success_msg = req.flash('success_msg')
    app.locals.error_msg = req.flash('error_msg')
    app.locals.user = req.user
    next()
})

//Routes
app.use(require('./routes/landingPage.routes'))
app.use(require('./routes/auth/auth.routes'))

//Public
app.use(express.static(path.join(__dirname, 'public')))

//Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'))
})