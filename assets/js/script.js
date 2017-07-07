// EVENT HANDLERS

// intro screen start button event handler -DONE
$(document).on('click', '#start-button', function(e) {
  e.preventDefault();
  $("#introduction-screen").fadeOut("slow", function() {
    $("#page-one-div").fadeIn()
    database = firebase.database();
    instance = {};
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
     userArray = createUsersArray(numOfUsers);
     var selectedCuisineArray = generateCuisineArray(userArray);

     talliedVotes = selectedCuisineArray.reduce(function(acc, item) {
       if (acc[item]) {
         acc[item]++;
       } else {
         acc[item] = 1;
       }
       return acc;
     }, {});

     instance.users = userArray;
     instance.votes = talliedVotes;

     groupSelectedCuisine = selectCuisineAtRandom(selectedCuisineArray);
     instance.cuisine_selected = groupSelectedCuisine;

     $("#cuisine-selected").text(groupSelectedCuisine);

     let cityCoords;
     let placeName;
     let placeLat;
     let placeLng;
     let map;
     let service;

     initMap();

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

  // group related gastro output
  let userArray;
  let groupSelectedCuisine;
  let talliedVotes;

  // save state and firebase
  let database;
  let instance;

  var config = {
  apiKey: "AIzaSyBIQQT9cEZh5i1OczhTGZ_NGO2ENhQ5-Jw",
  authDomain: "gastro-app-1498357614418.firebaseapp.com",
  databaseURL: "https://gastro-app-1498357614418.firebaseio.com",
  projectId: "gastro-app-1498357614418",
  storageBucket: "gastro-app-1498357614418.appspot.com",
  messagingSenderId: "101008018647"
};
  firebase.initializeApp(config);

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
    console.log(instance);
    instance.place = placeName;
  });

});

// FUNCTIONS

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: cityCoords
  });

  let request = {
    location: cityCoords,
    radius: groupRadius,
    type: ['restaurant'],
    minPriceLevel: groupMinPrice,
    maxPriceLevel: groupMaxPrice,
    openNow: true,
    keyword: [groupSelectedCuisine]
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);

  function callback(results, status) {

    if (status == google.maps.places.PlacesServiceStatus.OK) {

      let resultsFiltered = results.filter(function (item) {
        return item.rating >= 3.8;
      });

      let randomThreeRestaurants = [];
      for (var i=0; i < 3; i++) {
        let randNum = Math.floor(Math.random()*resultsFiltered.length);
        randomThreeRestaurants.push(results[randNum]);
      }

      for (var i=0; i < randomThreeRestaurants.length; i++) {
        createMarker(map, randomThreeRestaurants[i]);
        $("#page-three-deck").append(createResultCard(randomThreeRestaurants[i]));
      }

      let restaurantsChosen = [];
      for (var i=0; i < randomThreeRestaurants.length; i++) {
        let obj = {};
        obj.name = randomThreeRestaurants[i].name;
        obj.address = randomThreeRestaurants[i].vicinity;
        obj.price = randomThreeRestaurants[i].price_level;
        obj.rating = randomThreeRestaurants[i].rating;
        restaurantsChosen.push(obj);
      }
      instance.selections = restaurantsChosen;

      database.ref().push(instance);
    }
  }

}

function createMarker(map, place) {

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

  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
}

function parseGroupSubmission() {
  groupCity = document.getElementById('city-input').value;
  numOfUsers = document.getElementById('group-size-input').value;
  groupMinPrice = document.getElementById('min-price-input').value;
  groupMaxPrice = document.getElementById('max-price-input').value;
  var miles = document.getElementById('radius-input').value;
  groupRadius = convertMilesToMeters(miles);
  return;
}

function createResultCard(place) {
  let restaurant =
    `
    <div class="card">
      <div class="card-block restaurant-entry">
        <h4 class="card-title restaurant-name">${place.name}</h4>
        <p class="restaurant-address">${place.vicinity}</p>
        <p class="restaurant-rating"><strong>Rating:</strong> ${place.rating}</p>
        <p class="restuarant-price-level"><strong>Price:</strong> ${place.price_level}</p>
      </div>
    </div>
    `;
  return restaurant;
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

function generateCuisineArray (arr) {
  var cuisineArray = []
  for (i=0; i < arr.length; i++) {
    cuisineArray.push(arr[i].cuisine);
  }
  return cuisineArray;
}

function selectCuisineAtRandom(arr) {
  let randNum = Math.floor(Math.random()*arr.length);
  return arr[randNum];
}


function convertMilesToMeters(miles) {
  let meters = Math.round(miles * (50000 / 31.0686));
  return meters
}
