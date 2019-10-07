$(function(){
    var socket = io.connect("https://simple-chat12.herokuapp.com");
    $("#sendMessageButton").click(function(){
        var Message = $("#message").val();
        $("#chatroom").append(`<div class="m-3 text-right"><span class="px-4 py-2 bg-executive rounded">${Message}</span></div>`);
        socket.emit('new_message', {message: Message});
    })
    
    socket.on("new_message", (data) =>{
        if($("#chat-container").css("visibility") == "hidden")
        {
            $("#chat-container").css("visibility", "visible");
        }
        if(data.from != null)
        {
            $("#chat-header").text(data.from.replace(/[^0-9+]/gi,""));
        }
        $("#chat-header").addClass("collapsed");
        $("#chatwindow").addClass("show");
        $("#chatroom").append(`<div class="m-3"><span class="bg-user px-4 py-2 rounded">${data.message}</span></div>`);
    });

    if($("#chatroom").children().length == 0)
        $("#chat-container").css("visibility", "hidden");
});