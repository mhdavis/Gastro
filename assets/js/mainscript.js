// EVENT HANDLERS

// intro screen start button event handler -DONE
$(document).on('click', '#start-button', function(e) {
  e.preventDefault();
  $("#introduction-screen").fadeOut("slow", function() {
    $("#page-one-div").fadeIn()
  });
});

// page ONE submit button event handler
$(document).on('click', '#page-one-submit', function(e) {
  e.preventDefault();
  $("#page-one-div").fadeOut("slow", function() {
    parseGroupSubmission();
    for (var i=0; i < numOfUsers; i++) {
      $('#page-two-deck').append(submissionCard());
    }
    $("#page-two-div").fadeIn()
  });
});

// page TWO submit button event handler
$(document).on('click', '#page-two-submit', function(e) {
  e.preventDefault();
  $("#page-two-div").fadeOut('slow', function() {
    $('#map').hide();
    createUsersArray(numOfUsers);

    $("#page-three-div").fadeIn();
  });
});


// document ready function
$(document).ready(function() {
  // group inputs
  let groupCity;
  let numOfUsers;
  let groupRadius;
  let groupMinPrice;
  let groupMaxPrice;

  // map generator inputs
  let cityCoords;
  let placeName, placeLat, placeLng;
  let map;
  let service;

  // save state
  let instance = {};

  $("#page-one-div").hide();
  $("#page-two-div").hide();
  $("#page-three-div").hide();

  let searchOptions = {
    types: ['(cities)']
  };

  let autocomplete = new google.maps.places.Autocomplete(document.getElementById("city-input"), searchOptions);

  autocomplete.addListener('place_changed', function() {
    let placeObj = autocomplete.getPlace();
    placeName = placeObj.name;
    placeLat = placeObj.geometry.location.lat();
    placeLng = placeObj.geometry.location.lng();
    cityCoords = new google.maps.LatLng(placeLat, placeLng);
  });

  function initialize() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: {
        lat: placeLat,
        lng: placeLng
      }
    });

    let request = {
      location: cityCoords,
      radius: groupRadius,
      type: ['restaurant'],
      minPriceLevel: groupMinPrice,
      maxPriceLevel: groupMaxPrice,
      openNow: true,
      keyword: [specificMealType, groupSelectedCuisine]
    };

    function callback(results, status) {
      function createMarker(place) {

        var restaurantIcon = {
          url: "assets/img/restaurant.png",
          scaledSize: new google.maps.Size(30, 30),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 0)
        };

        var marker = new google.maps.Marker({
          map: map,
          icon: restaurantIcon,
          position: place.geometry.location
        });

        var formattedContent =
        `
        <div class="map-content">
          <h3 class="map-title">${place.name}</h3>
          <p>${place.vicinity}</p>
          <p><strong>Rating:</strong> ${place.rating}</p>
          <p><strong>Price:</strong> ${place.price_level}<p>
        </div>
        `;

        var infowindow = new google.maps.InfoWindow({
          content: formattedContent
        });

        marker.addListener('click', () => {
          infowindow.open(map, marker);
        });
      }

      if (status == google.maps.places.PlacesServiceStatus.OK) {

        for (var i=0; i < results.length; i++) {
          createMarker(results[i]);
          $("body").append(
            createRestaurantEntry(results[i])
          );
        }

      }
    }

  }
});

// FUNCTIONS
function parseGroupSubmission() {
  groupCity = document.getElementById('city-input').value;
  numOfUsers = document.getElementById('group-size-input').value;
  groupMinPrice = document.getElementById('min-price-input').value;
  groupMaxPrice = document.getElementById('max-price-input').value;
  var miles = document.getElementById('radius-input').value;
  groupRadius = convertMilesToMeters(miles);
  return;
}

function submissionCard() {
  var userCard =
    `
  <div class="card custom-card-style">
    <div class="card-block">
      <form class="user-submission">
        <div class="form-group">
          <label class="card-title">Name</label><br>
          <input name="user-name" type="text" placeholder="What should we call you?">
        </div>
        <div class="form-group">
          <label class="card-title">Cuisine</label><br>
          <select name="cuisine-option">
            <option value="mexican">Mexican</option>
            <option value="italian">Italian</option>
            <option value="arabic">Arabic</option>
            <option value="chinese">Chinese</option>
            <option value="deli">Deli</option>
            <option value="indian">Indian</option>
            <option value="french">French</option>
            <option value="american">American</option>
            <option value="german">German</option>
            <option value="thai">Thai</option>
          </select>
        </div>
      </form>
    </div>
  </div>
  `;
  return userCard;
}

function createUsersArray(totalUsers) {
  var usersArr = []
  var users = document.getElementsByName('user-name');
  var cuisines = document.getElementsByName('cuisine-option');
  for (var i = 0; i < totalUsers; i++) {
    var name = users[i].value;
    var cuisine = cuisines[i].value;
    var obj = {};
    obj.cuisine = cuisine;
    obj.name = name;
    usersArr.push(obj);
  }
  return usersArr;
}

function convertMilesToMeters(miles) {
  let meters = Math.round(miles * (50000 / 31.0686));
  return meters
}

function createRestaurantEntry(place) {
  let restaurant = $('<div>').addClass('restaurant-entry card');
  restaurant.html(
    `
    <h2>${place.name}</h2>
    <p>${place.vicinity}</p>
    <p>${place.rating}</p>
    <p>${place.price_level}</p>
    `
  );
  return restaurant;
}
