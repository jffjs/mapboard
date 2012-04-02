define(["./dispatch"], function(dispatch) {
  var commands = {
    help: function() {
      var msg = "/go <location> - change map center to location"
      dispatch.to("chat", { text: msg,
                            type: "command" });
    },
    go: function(args) {
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
    },
    zoom: function(args) {
      var zoom = parseInt(args[0]);
      if (isNaN(zoom)) {
        dispatch.to("chat", { text: "You must specify an integer to zoom to.",
                              type: "command" });
      } else {
        dispatch.to("map", { zoom: zoom });
      }
    }
  }

  var run = function(command, args) {
    commands[command](args);
  }

  return {
    run: run
  }
});
