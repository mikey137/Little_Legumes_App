const mongoose = require('mongoose')

const FamilyMemberSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    relationship:{
        type: String
    },
    connectedUser:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model("FamilyMember", FamilyMemberSchema)