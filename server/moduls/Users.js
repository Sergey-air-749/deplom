const mongoose = require('mongoose')

const user = new mongoose.Schema({
    email: {
        type: String,
        require: true,
    },
    shareId: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        require: true,
    },
    avatar: {
        type: Object,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    filse: {
        type: Array,
    },
    filseStorySend: {
        type: Array,
    },
    filseStoryGet: {
        type: Array,
    },

})

module.exports = mongoose.model("User", user);