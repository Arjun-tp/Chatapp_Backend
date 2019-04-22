var mongoose = require('mongoose');

var UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    isOnline: {
        type: Boolean,
        default: true
    },
    dp: String
});

// UsersSchema.pre('save', async function(next) {
//     console.log("this: ", this);
//     const regex = /^\d+$/g;
//     if(regex.test(this.phoneNum)) {
//         return next();
//     }
//     return next(new Error("Phone number should contain only numbers"));
// });
// {
//     type: String,
//     required: true,
//     unique: true
// }
module.exports = mongoose.model('User', UsersSchema);
