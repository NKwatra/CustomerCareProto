var express = require("express");
app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true}));

const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

var messagesArray = ["Hi there", "Hey", "How are you?", "I am good, wbu?", "Sailing in the same boat"];

app.get("/", function(req,res){
    res.redirect("/messages");
})

app.get("/messages",function(req,res){
    res.render("messages.ejs", {"Msg" : messagesArray});
});

app.post("/sendMessage", function(req,res){
    var Message = "->  "  + req.body.message;
    messagesArray.push(Message);   
    client.messages.create({
    from: 'whatsapp:+14155238886',
    body: Message,
    to: 'whatsapp:+918851365733',
}).then(message => console.log(message));
    res.redirect("/messages");
})

app.post("/messages", function(req,res){
    var Message = req.body.Body;
    messagesArray.push(Message);
    res.redirect("/messages");
})

app.listen(process.env.PORT|| 3000, function(){
    console.log("Server has started!!!");
});
