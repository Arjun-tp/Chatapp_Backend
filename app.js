var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
const port = process.env.PORT || 3005;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/chat-app', {useNewUrlParser: true});
mongoose.connection.on('error', function(){
    console.log("error occured while connecting to the database");
});
mongoose.connection.once('open', function(err){
    console.log("successfully connected with the database...");
});

require('./routes')(app);
require('./socket')(server);

server.listen(port, () => {
    console.log("app running on port ", port);
});