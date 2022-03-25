const bcrypt = require('bcryptjs')
const connection = require('../database')

const helpers = {}

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    return hash
}

helpers.mathPassword = async (password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword)
    } catch (error) {
        console.log(error)
    }
}

helpers.emailExists = async (email) => {
    const exists = await connection.query(`select * from users where email like '%${email}%'`)
    return exists.length > 0 ? true : false
}

helpers.initialState = async () => {
    const usuarios = await connection.query('select * from users')
    if(usuarios.length > 0) return
    try{
        const usuarioInicial = {
            username: 'Admin',
            fullname: 'Administrador',
            email: 'admin@gmail.com',
            password: 'familia4',
        }
        usuarioInicial.password = await helpers.encryptPassword(usuarioInicial.password)
        await connection.query('insert into users set ?', [usuarioInicial])
    }catch(error){
        console.log(error)
    }
}

module.exports = helpers