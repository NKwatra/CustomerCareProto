var express = require("express");
app = express();
var bodyParser = require('body-parser');

var server = app.listen(process.env.PORT|| 3000, function(){
    console.log("Server has started!!!");
}); 

var messagesArray = ["Hi there", "Hey", "How are you?", "I am good, wbu?", "Sailing in the same boat"];

var io = require("socket.io")(server);

const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
let sockett;

io.on('connection', (socket) => {
    console.log("New user connected");
    sockett = socket;
    socket.on("new_message", function(data){
        messagesArray.push(data.message);
        client.messages.create({
            from: 'whatsapp:+14155238886',
            body: data.message,
            to: 'whatsapp:+918851365733',
        }).then(message => console.log(message));
    });
});


app.use(bodyParser.urlencoded({ extended: true}));


app.get("/", function(req,res){
    res.redirect("/messages");
})

app.get("/messages",function(req,res){
    res.render("messages.ejs", {"Msg" : messagesArray});
});

app.post("/receiveMessage", function(req,res){
    var Message = req.body.Body;
    messagesArray.push(Message);
    sockett.emit("new_message", {message: Message});
});
