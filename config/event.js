const mongoose = require('mongoose')


const eventRegistration = new mongoose.Schema({
    name: String,
    email : String,
    phone : String,
    libid: String,
    eventName: {type: String, default:"example"}
})

const event = new mongoose.model('Event', eventRegistration);

module.exports = event;