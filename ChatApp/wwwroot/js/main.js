"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chat").build();
$("#send").disabled = true;

connection.start().then(function () {
    $("#send").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

connection.on("ReceiveMessage", function (user, message) {
    const li = $("<li></li>").text(`${user}: ${message}`);
    li.addClass("list-group-item");
    $("#messagesList").append(li);
});

$("#send").on("click", sendMessage);
$('#message').on('keypress', event => {
    if (event.originalEvent.keyCode == 13 && event.originalEvent.shiftKey) {
        sendMessage(event);
    }
});

function sendMessage(event) {
    event.preventDefault();
    const user = localStorage.getItem('user');
    const message = $("#message").val();
    $('#message').val('');
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
}

$('#btnEntrar').on('click', entrar);

function entrar(event) {
    event.preventDefault();
    const user = $('#user').val();
    if (!user) {
        $('#userValidation').removeClass('d-none');
        return;
    };
    localStorage.setItem('user', user);
    $('#login').addClass('d-none');
    $('#chat').removeClass('d-none');
}