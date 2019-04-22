var UsersModel = require('./users.model');
var response = require('../../lib/response');

exports.create = async (reqData) => {
    try {
        const newUser = new UsersModel(reqData);
        const data = await newUser.save();
        return data;
    } catch(err) {
        console.log("error in user controller: ", err);
        throw err;
    };
}

exports.readAll = async () => {
    try {
        const users = await UsersModel.find().select('-password').lean().exec();
        return users;
    } catch(err) {
        throw err;
    }
}

exports.getUser = async (querry) => {
    try {
        const user = await UsersModel.findOne(querry).select('-password').lean().exec();
        if(!user) {
            throw new Error("User details not found");
        }
        return user;
    } catch(err) {
        throw new Error("We are facing some problem in finding the user details");
    }
}

exports.getUsers = async (selfId, querry) => {
    try {
        let obj = {_id: {$ne: selfId}, ...querry};
        const users = await UsersModel.find(obj).select('-password').lean().exec();
        return users;
    } catch(err) {
        throw err;
    }
}

exports.updateUser = async (data) => {
    try {
        await UsersModel.update({_id: data.id}, {$set: data.body});
        return {msg: "updated successfully"};
    } catch(err) {
        throw err;
    }
}

exports.removeUser = async (id) => {
    try {
        await UsersModel.remove({_id: id});
        return {msg: "user removed successfully"};
    } catch(err) {
        throw err;
    }
}