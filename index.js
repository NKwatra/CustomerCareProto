var express = require("express");
app = express();
var bodyParser = require('body-parser');

var server = app.listen(process.env.PORT|| 3000, function(){
    console.log("Server has started!!!");
});
var liveChat = require('./liveChat');

var messagesArray = [];

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
    var Sender = req.body.From;
    if(Message.replaceAll(" ",'').toUpperCase == "Endchat".toUpperCase)
        liveChat.liveChatsNumbers[Sender] = false;

    if(liveChat.liveChatsNumbers.hasOwnProperty(Sender) && liveChat.liveChatsNumbers[Sender] === true){
        console.log("Live chat on");
        messagesArray.push(Message);
        sockett.emit("new_message", {message: Message});
    }else 
    {
        if(liveChat.liveChatsNumbers.hasOwnProperty(Sender) || Message.replaceAll(" ","").toUpperCase() == "LiveChat".toUpperCase())
        {
            console.log("Live chat started");
            liveChat.liveChatsNumbers[Sender] = true;
            client.messages.create({
                from: 'whatsapp:+14155238886',
                body: "Hang on! we are connecting you to a Customer Care Executive to help you with your query. We appreciate your patience",
                to: Sender,
            }).then(message => console.log(message));
        }else 
        {
            console.log("Reply form bot");
            if(!liveChat.liveChatsNumbers.hasOwnProperty(Sender)){
                liveChat.liveChatsNumbers[Sender] = false;
                console.log("Number saved");
                console.log(liveChat.liveChatsNumbers);
            }

            // message would be processed here and replied via bot by default 
            // received message is stored in Message variable  
            client.messages.create({
                from: 'whatsapp:+14155238886',
                body: "Sent via bot",// replace this message with the required one
                to: Sender,
            }).then(message => console.log(message));
        }
    }    
});
