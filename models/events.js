const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: String,
    host: String,
    username: String,
    ready: Boolean,
    checklist:[],   
    date: Date,
})

const Event = mongoose.model('Event',eventSchema);

module.exports = Event;