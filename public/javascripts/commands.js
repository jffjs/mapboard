define(["./dispatch"], function(dispatch) {
  var commands = {
    help: {
      doc: "",
      fn: function() {
        var msg;
        for(var c in commands) {
          msg = commands[c].doc
          dispatch.to("chat", { text: msg,
                                type: "command" });
        }
      }
    },
    go: {
      doc: "/go <location> - change map center to location",
      fn: function(args) {
        var geocoder = new google.maps.Geocoder();
        var address = args.join(' ');
        geocoder.geocode({ address: address }, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            var center = results[0].geometry.location;
            dispatch.to("map", { center: { lat: center.lat(),
                                           lng: center.lng() }
            });
          }
        });
      }
    },
    zoom: {
      doc: "/zoom <number> - set the zoom level, must be an integer",
      fn: function(args) {
        var zoom = parseInt(args[0]);
        if (isNaN(zoom)) {
          dispatch.to("chat", { text: "You must specify an integer to zoom to.",
                                type: "command" });
        } else {
          dispatch.to("map", { zoom: zoom });
        }
      }
    }
  }

  var run = function(command, args) {
    commands[command].fn(args);
  }

  return {
    run: run
  }
});
