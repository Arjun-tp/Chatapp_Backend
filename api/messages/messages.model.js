var mongoose = require('mongoose');

var MessagesSchema = new mongoose.Schema({
    msg: {
        type: String,
        required: true
    },
    sentAt: Date,
    receivedAt: Date,
    readAt: Date,
    updatedAt: Date,
    deletedAt: Date,
    deleted: {
        type: Boolean,
        default: false
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Message', MessagesSchema);