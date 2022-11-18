const mongoose = require('mongoose');

const roleType= {
    ADMIN: 'ADMIN',
    USER: 'USER',
    STAFF: 'STAFF'

}
const userSchema = mongoose.Schema({
    name:{
        type: String
    },
    username:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required:true
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER', 'STAFF'],
        default: 'USER'
    }
});

mongoose.model("User", userSchema, "users");

module.exports = {
    roleType,
    userSchema
}