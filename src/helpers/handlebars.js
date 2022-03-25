const exhbs = require('express-handlebars')

let hbs = exhbs.create({})

hbs.handlebars.registerHelper('isAdmin', (rol) => {
    return rol == 1 ? true : false
})