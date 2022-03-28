const exhbs = require('express-handlebars')

let hbs = exhbs.create({})

hbs.handlebars.registerHelper('yourAnswer', (answer_user, user) => {
    return answer_user == user ? true : false
})
