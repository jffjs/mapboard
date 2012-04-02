define(["./chat", "./map"], function(chat, map) {
  var receivers = {
    chat: function(message) {
      // circular dependency here with chat, need to call require to resolve it
      require("chat").push(message);
    },
    map: function(status) {
      map.update(status);
    }
  }
  var dispatchTo = function(receiver, deliverable) {
    receivers[receiver](deliverable);
  }

  return {
    to: dispatchTo
  }
});
