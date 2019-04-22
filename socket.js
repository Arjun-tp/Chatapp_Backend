const usersController = require('./api/users/users.controller');
const auth = require('./api/auth/auth.service');
const messageController = require('./api/messages/messages.controller');
// const ObjectId = require('mongoose').Types.ObjectId;
// var jwt = require('jsonwebtoken');

module.exports = (server) => {
    var io = require('socket.io')(server);
    io.use(async (socket, next) => {
        try {
            const userDetails = await auth.authenticate(socket.handshake.query.token);  //authentication
            if(userDetails && (Object.keys(userDetails).length > 0)) {
                if(io.sockets.adapter.rooms[userDetails._id]) {
                    console.log("duplicate connection 1");
                    next(new Error("Duplicate connection"));
                } else {
                    socket.userDetails = userDetails;
                    next();
                }
            } else {
                next(new Error("We are not able to recognise the user, Please logout and login again"));
            }
        } catch(err) {
            next(err);
        }
    }).on('connection', (socket) => {
        console.log("client connected");
        socket.join(socket.userDetails._id, async () => {
            try {
                await changeUserStatus(true, socket.userDetails._id);
                return true;
            } catch(err) {
                console.log("Error occured: ", err);
            }
        });
        socket.on('message', async (msg) => {
            try {
                await messageController.create(msg);
                io.to(msg.to).emit('message', {msg: msg.msg, from: msg.from});
            } catch(err) {
                console.log("Error in msg: ", err);
            }
        });
        socket.on('get-friends', async (data, cb) => {
            try {
                const users = await usersController.getUsers(data.selfId, data.querry);
                cb({success: true, data: users});
            } catch(err) {
                cb({success: false, data: err});
            }
        });
        socket.on('get-chat-history', async (data, cb) => {
            try {
                const chatHistory = await messageController.getChatHistory(data);
                cb({success: true, data: chatHistory});
            } catch(err) {
                cb({success: false, data: err});
            }
        });
        socket.on('logout', (data, cb) => {
            socket.leave(socket.userDetails._id);
            cb(true);
        });
        async function changeUserStatus(status, id) {
            try {
                await usersController.updateUser({
                    id: id,
                    body: {
                        isOnline: status
                    }
                });
                io.emit('users-update');
                return true;
            } catch(err) {
                throw err;
            }
        }
        socket.on('disconnect', async () => {
            socket.leave(socket.userDetails._id);
            await changeUserStatus(false, socket.userDetails._id);
            console.log("client id: ", socket.userDetails._id);
            console.log("client disconnected");
        });
    });
};