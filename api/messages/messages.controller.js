var MessagesModel = require('./messages.model');
var response = require('../../lib/response');
const ObjectId = require('mongoose').Types.ObjectId;

exports.create = async (msg) => {
    try {
        msg.sentAt = new Date();
        const newMessage = new MessagesModel(msg);
        const data = await newMessage.save();
        return data;
    } catch(err) {
        console.log("error in saving new message: ", err);
        throw err;
    };
}

exports.getChatHistory = async (obj) => {
    try {
        const chatFromMeToFrnd = await MessagesModel.find({
            from: ObjectId(obj.myId), 
            to: ObjectId(obj.friendId)
        });
        const chatFromFrndToMe = await MessagesModel.find({
            from: ObjectId(obj.friendId), 
            to: ObjectId(obj.myId)
        });
        
        return [...chatFromMeToFrnd, ...chatFromFrndToMe];
    } catch(err) {
        throw new Error("Error in fetching chat history form database");
    }
}

exports.readAll = async (req, res) => {
    try {
        const messages = await MessagesModel.find().lean().exec();
        return response.success(res, messages);
    } catch(err) {
        return response.error(res, err);
    }
}

exports.getMessage = async (req, res) => {
    try {
        const message = MessagesModel.findById(req.params.id).lean().exec();
        if(message) {
            return response.error(res, null, "message details not found", 404);
        }
        return response.success(res, message);
    } catch(err) {
        return response.error(res, err);
    }
}

exports.updateMessage = async (req, res) => {
    try {
        await MessagesModel.update(req.params.id, {$set: req.body});
        return response.success(res, {msg: "updated successfully"});
    } catch(err) {
        return response.error(res, err);
    }
}

exports.removeMessage = async (req, res) => {
    try {
        await MessagesModel.remove({_id: req.params.id});
        return response.success(res, {msg: "message removed successfully"});
    } catch(err) {
        return response.error(res, err);
    }
}