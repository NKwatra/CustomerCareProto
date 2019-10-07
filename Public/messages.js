$(function(){
    // var socket = io.connect("https://simple-chat12.herokuapp.com");
    $("#chatroom").scrollTop($("#chatroom")[0].scrollHeight);    
    if($("#chat-header").text() == "")
        $("#chat-header").text(localStorage.getItem("phone"));
    var socket = io.connect("localhost:3000");
    $("#sendMessageButton").click(function(){
        var Message = $("#message").val();
        $("#message").val("");
        $("#chatroom").append(`<div class="m-3"><span class="p-2 bg-executive rounded">${Message}</span></div>`);
        $("#chatroom").scrollTop($("#chatroom")[0].scrollHeight);
        socket.emit('new_message', {message: Message});
    })
    
    socket.on("new_message", (data) =>{
        if($("#chat-container").css("visibility") == "hidden")
        {
            $("#chat-container").css("visibility", "visible");
        }
        if(data.from != null)
        {
            var phoneNo = data.from.replace(/[^0-9+]/gi,"");
            $("#chat-header").text(phoneNo);
            localStorage.setItem("phone", phoneNo);
        }
        $("#chat-header").addClass("collapsed");
        $("#chatwindow").addClass("show");
        $("#chatroom").append(`<div class="m-3"><span class="bg-user px-4 py-2 rounded">${data.message}</span></div>`);
        $("#chatroom").scrollTop($("#chatroom")[0].scrollHeight);
    });

    if($("#chatroom").children().length == 0)
        $("#chat-container").css("visibility", "hidden");
});