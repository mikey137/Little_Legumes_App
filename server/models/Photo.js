const mongoose = require('mongoose')

const PhotoSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    dateId:{
        type: String,
        required: true
    },
    momentCaption: {
        type: String,
    },
    thumbnailUrl:{
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Photo", PhotoSchema)