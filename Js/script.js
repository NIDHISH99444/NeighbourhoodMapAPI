var map;

// Empty array for markers
var markers = [];
var places = [{
    title: 'Ajmer Sharif Dargah',
    location: {
      lat: 26.4561,
      lng: 74.6282
    },
    images: ["Ajmer-Sharif-Dargah.jpg"],
    id: "nav0",
    visible: ko.observable(true),
    boolTest: true
  },
  {
    title: 'Junagarh fort',
    location: {
      lat: 28.0219,
      lng: 73.3187
    },
    images: ["Bikaner-Junagarh-fort.jpg"],
    id: "nav1",
    visible: ko.observable(true),
    boolTest: true
  },
  {
    title: 'Bundi',
    location: {
      lat: 25.430513,
      lng: 75.649902
    },
    images: ["Bundi-Palace.jpg"],
    id: "nav2",
    visible: ko.observable(true),
    boolTest: true
  },
  {
    title: 'Chittorgarh Fort',
    location: {
      lat: 24.8879,
      lng: 74.6451
    },
    images: ["Chittorgarh-Fort.jpg"],
    id: "nav3",
    visible: ko.observable(true),
    boolTest: true
  },
  {
    title: 'Amber Fort',
    location: {
      lat: 26.9855,
      lng: 75.8513
    },
    images: ["Jaipur-Amber-Fort.jpg"],
    id: "nav4",
    visible: ko.observable(true),
    boolTest: true
  },
  {
    title: 'Jaisalmer Fort',
    location: {
      lat: 26.9128,
      lng: 70.9131
    },
    images: ["Jaisalmer-Fort.jpg"],
    id: "nav5",
    visible: ko.observable(true),
    boolTest: true
  },

  {
    title: 'Mehrangarh Fort',
    location: {
      lat: 26.2981,
      lng: 73.0184
    },
    images: ["Jodhpur-Mehrangarh-Fort.jpg"],
    id: "nav6",
    visible: ko.observable(true),
    boolTest: true
  },
  {
    title: 'Pushkar Camel Fair',
    location: {
      lat: 26.487652,
      lng: 74.555922
    },
    images: ["Pushkar-Camel-Fair.jpg"],
    id: "nav7",
    visible: ko.observable(true),
    boolTest: true
  },
  {
    title: 'Lake Pichola',
    location: {
      lat: 24.5720,
      lng: 73.6790
    },
    images: ["Udaipur-Lake-Pichola.jpg"],
    id: "nav8",
    visible: ko.observable(true),
    boolTest: true
  },

];

function initMap() {
  //initializing Map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: parseFloat(26.2981),
      lng: parseFloat(73.0184)
    },
    zoom: 13
  });
  setMarkers(places);
  setAllMap();
  // Function to reset the zoom level to the original state
  function resetMap() {

    map.setZoom(7);
    map.setCenter(new google.maps.LatLng(26.2981, 73.0184));
  }

  //Click handler for resetting map for window resize

  $("#reset").click(function() {
    resetMap();
  });
}

function setAllMap() {
  for (var i = 0; i < places.length; i++) {
    if (places[i].boolTest === true) {
      places[i].marker.setMap(map);
    } else {
      places[i].marker.setMap(null);
    }
  }
}

function setMarkers(places) {
  var largeInfowindow = new google.maps.InfoWindow();
  // Setting default marker icon style
  var defaultIcon = makeMarkerIcon('0091ff');

  // Creating different marker style on mouse over
  var highlightedIcon = makeMarkerIcon('FFFF24');

  var bounds = new google.maps.LatLngBounds();

  //Looping through all the markers
  for (var i = 0; i < places.length; i++) {
    // Get the position from the location array.



    places[i].marker = new google.maps.Marker({

      position: places[i].location,
      lat: places[i].location.lat,
      lng: places[i].location.lng,
      title: places[i].title,
      animation: google.maps.Animation.DROP,
      image: places[i].images,
      icon: defaultIcon,
      id: i
    });

    // Push the marker to our array of markers.
    markers.push(places[i].marker);
    places[i].marker.setMap(map);
    // Create an onclick event to open an infowindow at each marker.
    places[i].marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    // Mouse events for changing color on mouse over and mouse out
    places[i].marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    places[i].marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
   //Showing the marker of the place on clicking the list of places
    var searchNav = $('#nav' + i);
    searchNav.click((function(marker, i) {
      return function() {

        populateInfoWindow(marker, largeInfowindow);
        map.setZoom(10);
        map.setCenter(marker.getPosition());
      };
    })(places[i].marker, i));
    places[i].marker.addListener('click', toggleBounce);

    bounds.extend(markers[i].position);
  }

  // Extend the boundaries of the map for each marker
  map.fitBounds(bounds);
}




//function for setting the bounce effect on mouse click
function toggleBounce() {
  if (this.getAnimation() !== null) {
    this.setAnimation(null);
  }
	else
	{
    this.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout((function() {
    this.setAnimation(null);
    }).bind(this), 1400);
  }
}
//Populating thre info window containg the content of moarker on clicking it
function populateInfoWindow(marker, infowindow) {
  // Condition to check if the info wondow is already open
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    wikiArticle(marker.title);
    console.log(marker.title);
    currentTemperature(marker.lat, marker.lng)
    console.log(marker.lat + " " + marker.lng);
    marker.contentString = '<div><a target="_blank" id="wiki-article" href="">' + marker.title +
      '</a>&nbsp;&nbsp;&nbsp; <b>Current Temperature: <span class="temp"></span></b> </div> <br>' +
      '<img class="info-image" src="Images/' + marker.image + '">';
    infowindow.setContent(marker.contentString);

    infowindow.open(map, marker);
    // clearing the marker when the info wondow is closed
    infowindow.addListener('closeclick', function() {

      infowindow.setMarker = null;

    });
  }
}

function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21, 34));
  return markerImage;
}

//Setting the link for wiki accessing the wiki page on clicking the marker title
function wikiArticle(location) {
  var wikiRequestTimeout = setTimeout(function() {
    $wikiElem.text('Failed to get Wikipedia Resources');
  }, 8000);
  var wiki_url = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=' + location + '&limit=5&callback=wikiCallback&key=AIzaSyCTa8MkSqzaYoqlMw7wZW0yTmP1Gy2ibAo';
  $.ajax({
    url: wiki_url,
    dataType: "jsonp",
    success: function(response) {
      console.log(response);
      var articleList = response[3];
      console.log("article is")
      console.log(articleList)
      $("#wiki-article").attr("href", articleList[0]);
      clearTimeout(wikiRequestTimeout);
    }
  })
}


//Getting the current temperature for the loccation using DARKSKY api
function currentTemperature(lat, lng) {
  var current_temp = "";
  var secretKey = "50ee5fd3e7360c676e9846c9312bf5ea";
  var init_url = "https://api.darksky.net/forecast/";
  var darkskyAPI = init_url + secretKey + '/' + lat + ',' + lng +
    '?exclude=minutely,hourly,daily,alerts,flags&units=si';
  console.log(darkskyAPI);
  $.ajax(darkskyAPI, {

      dataType: 'jsonp'
    }).done(function(result) {
      current_temp = result.currently.temperature;
      $('.temp').text(current_temp + "°C");
    })
    .fail(function(err) {
      current_temp = "Not Available";
      $('.temp').text(current_temp);
    });

}


//Model View binding using Knockout js
var viewModel = {
  query: ko.observable(''),
};


viewModel.places = ko.dependentObservable(function() {
  var self = this;
  var search = self.query().toLowerCase();
  console.log("search " + search);
  return ko.utils.arrayFilter(places, function(place) {
    
    if (place.title.toLowerCase().indexOf(search) >= 0) {
      place.boolTest = true;
      console.log(place.boolTest);
      return place.visible(true);

    } else {
      place.boolTest = false;
      setAllMap();
      return place.visible(false);
    }
  });
}, viewModel);

ko.applyBindings(viewModel);
$("#input").keyup(function() {
  setAllMap();
});
