define(["./client"], function(client) {
  var control = true;
  var ll = new google.maps.LatLng(-34.397, 150.644);

  var mapOptions = {
    zoom: 8,
    center: ll,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  var controlOptions = {
    draggable: control,
    scrollWheel: control,
    zoomControl: control,
    panControl: control,
    streetViewControl: control
  }
  var gmap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  gmap.setOptions(controlOptions);

  var getState = function() {
    return {
      center: { lat: gmap.getCenter().lat(),
                lng: gmap.getCenter().lng() },
      zoom: gmap.getZoom()
     };
   }

  google.maps.event.addListener(gmap, 'idle', function() {
    console.log('map idle event');
    if (control) {
      client.send('map', getState());
    }
  });

  var update = function(state) {
    if (state.center && state.center.lat && state.center.lng) {
      gmap.setCenter(new google.maps.LatLng(state.center.lat,
                                            state.center.lng));
    }

    if (state.zoom) {
      gmap.setZoom(state.zoom);
    }

    if (state.control != 'undefined') {
      control = state.control;
      for (var opt in controlOptions) {
        controlOptions[opt] = control;
      }
      gmap.setOptions(controlOptions);
      console.log('updating control:' + control);
      console.log('control options:' + JSON.stringify(controlOptions));
    }
  }

  // register client events
  client.on('map', function(state) {
    console.log(JSON.stringify(state));
    update(state);
  });

  client.on('map init', function() {
    if (control) {
      var state = getState();
      state.control = false;
      client.send('map', state);
    }
  });

  return {
    getState: getState,
    update: update
  };
});

