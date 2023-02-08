const mongoose = require('mongoose')


const eventRegistration = new mongoose.Schema({
    name: String,
    email : String,
    phone : String,
    phone : String,
    libid: String,
    eventName: {type: String, default:"11feb"}
})

const event = new mongoose.model('Event', eventRegistration);

module.exports = event;