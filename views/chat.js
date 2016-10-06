$( document ).ready(function() {
  var socket = io(); // initialise socket.io connection
  var messageStore = [];

  function clearMessages() {
    messageStore.length = 0
    riot.update();
  }

  function renderMessage(message) {
    message = JSON.parse(message);
    messageStore.push(message);
    riot.update();
    return;
  }

  $('form').submit(function() {
    //if input is empty or white space do not send message
    if($('#m').val().match(/^[\s]*$/) !== null) { 
      $('#m').val('');
      $('#m').attr('placeholder', 'please enter your message here');
      return false; 
    }

    var message = $('#m').val();
    socket.emit('chat_message', message);
    $('#m').val(''); // clear message form ready for next/new message
    $('#m').attr('placeholder', ''); //clears placeholder once a message is successfully sent
    return false;
  });

  // keeps latest message at the bottom of the screen
  // http://stackoverflow.com/a/11910887/2870306
  function scrollToBottom () {
    $(window).scrollTop($('#messages').height());
  }

  window.onresize = function(){
    scrollToBottom();
  }

  socket.on('chat_message', function(message) {
    renderMessage(message);
    scrollToBottom();
  });

  // Focus on the message input
  $("#m").focus();

  // Load the message history
  socket.on('chat_history', function(messages) {
    clearMessages();
    messages.map(function(message){
        renderMessage(message);
    });
  });

  // Mount riot
  riot.mount('message', {
    messageStore: messageStore,
    scrollToBottom: scrollToBottom
  });
});
