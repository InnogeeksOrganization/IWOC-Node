const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')
const mongoose = require('mongoose');
const project = require('../config/project');
const user = require('../config/user');

AdminBro.registerAdapter(AdminBroMongoose)

const AdminBroOptions = {
    resources: [project,user],
}
const adminBro = new AdminBro(AdminBroOptions)

const Admin = {
    email : 'admin@gmail.com',
    password : 'admin'
}

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro,{
    cookieName : 'iwocadmin',
    cookiePassword : 'iwocpassword',
    authenticate : async (email , password) => {
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS){
            return Admin
        }
        else{
            return null
        }
    }  
})

module.exports = router