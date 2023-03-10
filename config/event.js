const mongoose = require('mongoose')


const eventRegistration = new mongoose.Schema({
    name: String,
    email : String,
    phone : String,
    phone : String,
    libid: String,
    residence: String,
    eventName: {type: String, default:"18feb"}
})

const event = new mongoose.model('Event', eventRegistration);

module.exports = event;