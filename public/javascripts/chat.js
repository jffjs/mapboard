define(["jquery", "./client", "./commands"], function($, client, commands) {
  var name = $("#name").val();
  var messages = [];
  var users = [];
  var view = (function() {
    var lastMessage = 0;

    function append(message) {
      var str;
      switch (message.type) {
        case "announcement":
        case "command":
          str = message.text;
          break;
        default:
          str = message.user + ': ' + message.text;
      }
      console.log(JSON.stringify(message));
      $('#message-box ul').append($('<li>').text(str));
    }

    var update = function() {
      while (messages.length > lastMessage) {
        append(messages[lastMessage]);
        lastMessage++;
      }

      $('#name').val(name);
    }

    $('#message-form').submit(function() {
      var message = { user: $('#name').val(), text: $('#message').val() };
      $('#message').val('');
      if (message.text.match(/^\//)) {
        processCommand(message.text);
      } else {
        push(message);
        client.send('message', message);
      }
      return false;
    });

    $('#name-form input').blur(function() {
      var oldName = name;
      name = $('#name-form input').val();
      if (oldName !== name) {
        var message = { type: "announcement",
                        text: oldName + " is now " + name };
        push(message);
        client.send("message", message);
      }
    });

    return {
      update: update
    };
  }());

  var processCommand = function(text) {
    var args, cmd;
    args = text.match(/(^\/\w+)|(\w+\.?\w*)/g);
    if (args) {
      cmd = args.splice(0,1)[0].replace(/^\//, ""); // strip off the slash
    }

    commands.run(cmd, args);
  }
  var push = function(message) {
    messages.push(message);
    view.update();
  }

  // register client events
/*  client.on('name', function(data) {
    name = data.name;
    view.update();
  });*/

  client.on('message', function(message) {
    push(message);
  });

  return {
    push: push
  };
});

