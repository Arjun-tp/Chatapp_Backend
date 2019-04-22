exports.success = function (res, response, status = 200) {
    return res.status(status).send(response);
}

exports.error = function (res, err, msg = "Internal Server error", status = 500) {
    console.log("error response: ", err.message, msg);
    return res.status(status).send(msg);
}