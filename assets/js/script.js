/*
CENTRAL APP PROCESS

1 - Users input number of Users
2 - Users input specific City
3 - Users enter a meal type (Breakfast, Brunch, Lunch, Dinner, Snack)
4 - Each user adds a cultural style
    4.1 - App can suggest cultural style previously
          entered by pull data from Firebase DB of
          last known selections
    4.2 - Otherwise, users can input predefined array
          of available styles (ex. Mexican, Chinese, Thai, etc.)
5 - Users can upvote or downvote cultural styles that they prefer or don't fancy
6 - App assigns probabilities to cuisine style based on the number of
    upvotes / downvotes and randomly selects one food type to eat
7 - App queries google maps for restaurants in the city indicated
8 - App parses the ratings of restaurants array in order to select top three
    outputted restaurants based on their rating
    8.1 - If multiple restaurants are highly rated (ex. six 5 star restaurants)
          selects 3 restaurants at random from the top rated restaurants
9 - Present user with the randomly selected restaurant, along with its address.
    9.1 - If users disagree with the restaurant selected, presents user with the
          two other restaurants found in the "top three" list

POTENTIAL FEATURES:
- Incoporate price range option for user group for those more financially concious
- Display the path from current location to the restaurant using google maps waypoints
*/

/*
1 - Input Number of Users
--------------------------------------------------------------------------------
*/
// prompt the user for the number of users
let numOfUsers;
let userArray = [];
let instance = {};

//
function User(name) {
  this.name = name
}


for (i=0; i < numOfUsers; i++) {
  let currentUserName = prompt("Person" + JSON.stringify(i + 1) + " : What is your name?");
  let currentUserObj = new User(currentUserName);
  userArray.push(currentUserObj);
}

instance.total_users = userArray.length;


/*
2 - Users input specific Radius and Price
--------------------------------------------------------------------------------
*/
let specificRadius = convertMilesToMeters(30);
let groupMinPrice = 1;
let groupMaxPrice = 3;


function convertMilesToMeters (miles) {
  let meters = Math.round(miles*(50000/31.0686));
  return meters
}

/*
4 - Each user adds a cultural style
--------------------------------------------------------------------------------
*/

instance.users = userArray;

// create an array of objects with all of the user's cuisine styles and their
// corresponding number of votes;
function generateCuisineArray (arr) {
  var cuisineArray = []
  for (i=0; i < arr.length; i++) {
    cuisineArray.push(arr[i].cuisine);
  }
  return cuisineArray;
}

let selectedCuisineArray = generateCuisineArray(userArray);

let talliedVotes = selectedCuisineArray.reduce((acc, item) => {
  if (acc[item]) {
    acc[item]++;
  } else {
    acc[item] = 1;
  }
  return acc;
}, {});

instance.votes = talliedVotes;
/*FOR IN LOOP - USE SECOND DATA STRUCTURE*/
/*
// EXAMPLE DATA STRUCTURE ALTERNATIVE
let talliedVotesAltExample = {
  total: 6,
  votes: {
    "mexican": 1,
    "italian": 2,
    "chinese": 3
  }
}
*/

/*
6 - App assigns probabilities to cuisine style based on the number of
    upvotes / downvotes and randomly selects one food type to eat
--------------------------------------------------------------------------------
*/

let groupSelectedCuisine = selectCuisineAtRandom(selectedCuisineArray);

function selectCuisineAtRandom(arr) {
  let randNum = Math.floor(Math.random()*arr.length);
  return arr[randNum];
}

instance.cuisine_chosen = groupSelectedCuisine;
console.log(instance);

/*
7 - App queries google maps for restaurants in the city indicated
--------------------------------------------------------------------------------
*/

function initialize() {

  // autocomplete
  let searchField = document.getElementById("city-input");
  let searchOptions = {
    types: ['(cities)']
  };
  let autocomplete = new google.maps.places.Autocomplete(searchField, searchOptions);

  let city;
  let placeName;
  let placeLat;
  let placeLng;
  let map;

  // autocomplete listener
  autocomplete.addListener('place_changed', () => {
    let placeObj = autocomplete.getPlace();
    placeName = placeObj.name;
    placeLat = placeObj.geometry.location.lat();
    placeLng = placeObj.geometry.location.lng();
    city = new google.maps.LatLng(placeLat, placeLng);

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: {lat: placeLat, lng: placeLng}
    });
  });

  let service;

  // generate restaurants on map
  document.getElementById('test-button').addEventListener('click', () => {
    let request = {
      location: city,
      radius: specificRadius,
      type: ['restaurant'],
      minPriceLevel: groupMinPrice,
      maxPriceLevel: groupMaxPrice,
      openNow: true,
      keyword: [specificMealType, groupSelectedCuisine]
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
  });

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

} // end intialize function

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
