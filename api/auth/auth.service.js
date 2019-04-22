const Users = require('../users/users.model');
const usersController = require('../users/users.controller');
var jwt = require('jsonwebtoken');

function generateJwt(userDetails) {
    const obj = {
        userId: userDetails._id,
        userName: userDetails.name,
        loginTime: new Date()
    };
    var token = jwt.sign(obj, "C#@t@PP", {expiresIn: '7d'});
    obj.accessToken = token;
    return obj;
}

exports.authenticate = (token) => {
    return new Promise((resolve, reject) => {
        if(!token) {
            return reject("Token not found");
        }
        jwt.verify(token, 'C#@t@PP', function(err, decoded) {
            if(err || !decoded) {
                console.log("err: ", err);
                console.log("decoded: ", decoded);
                return reject("Failed to authenticate user");
            }
            Users.findById(decoded.userId).select('name email').lean()
            .then((user) => {
                if(!user)
                    return reject("Unable to identify the user");
                return resolve(user);
            })
            .catch((err) => {
                return reject("Problem in finding the user details");
            });
        });
    });
}

exports.register = async (data) => {
    try {
        console.log("data: ", data);
        const response = await usersController.create(data);
        console.log("response: ", response);
        const authObj = generateJwt(response);
        console.log("authObj: ", authObj);
        return authObj;
    } catch(err) {
        console.log("error in auth service: ", err);
        throw err;
    }
}

exports.login = async (data) => {
    try {
        console.log("data in auth service: ", data);
        const response = await usersController.getUser(data);
        const authObj = generateJwt(response);
        return authObj;
    } catch(err) {
        throw err;
    }
}

exports.logout = async (data) => {
    try {
        return true;
    } catch(err) {
        throw err;
    }
}

exports.changePassword = (data) => {};