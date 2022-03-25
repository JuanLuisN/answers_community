const authMiddleware = {}
const helpers = require('../helpers/helpers')

authMiddleware.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error_msg', 'Log in to access')
    res.redirect('/signin')
}

authMiddleware.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        return next()
    }
    req.flash('error_msg', `You cant access this view right now`)
    res.redirect('/')
}

module.exports = authMiddleware