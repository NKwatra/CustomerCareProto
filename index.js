var express = require("express");
app = express();
var bodyParser = require('body-parser');

var server = app.listen(process.env.PORT|| 3000, function(){
    console.log("Server has started!!!");
});
var liveChat = require('./liveChat');

app.use(express.static("Public"));

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

    // if user ends chat
    if(Message.replace(/[^a-z]/gi,'').toUpperCase().search("Endchat".toUpperCase()) != -1)   
    {
        liveChat.liveChatsNumbers[Sender] = false;
        client.messages.create({
            from: 'whatsapp:+14155238886',
            body: "Live chat ended!!",
            to: Sender,
        }).then(message => console.log(message));
        return;
    }    

    // if live chat is on
    if(liveChat.liveChatsNumbers.hasOwnProperty(Sender) && liveChat.liveChatsNumbers[Sender] === true){
        console.log("Live chat on");
        messagesArray.push(Message);
        sockett.emit("new_message", {message: Message});
    }else 
    {
        // user asks for live chat
        if(Message.replace(/[^a-z]/gi,"").toUpperCase().search("LiveChat".toUpperCase()) != -1)
        {
            console.log("Live chat started");
            liveChat.liveChatsNumbers[Sender] = true;
            client.messages.create({
                from: 'whatsapp:+14155238886',
                body: "Hang on! we are connecting you to a Customer Care Executive to help you with your query. We appreciate your patience",
                to: Sender,
            }).then(message => console.log(message));
            sockett.emit("new_message", {message: "New complaint", from: Sender});
        }else 
        {
            console.log("Reply form bot");

            // first message, store user's number
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
