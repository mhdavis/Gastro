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
    for (var i = 0; i < numOfUsers; i++) {
      $('#page-two-deck').append(submissionCard());
    }
    $("#page-two-div").fadeIn()
  });
});

// page TWO submit button event handler
$(document).on('click', '#page-two-submit', function(e) {
  e.preventDefault();
  $("#page-two-div").fadeOut('slow', function() {
    createUsersArray(numOfUsers);
    $("#page-three-div").fadeIn();
  });
});


// document ready function
$(document).ready(function() {
  let groupCity;
  let numOfUsers;
  let groupRadius;
  let groupMinPrice;
  let groupMaxPrice;

  $("#page-one-div").hide();
  $("#page-two-div").hide();
  $("#page-three-div").hide();

});

// FUNCTIONS
function parseGroupSubmission() {
  groupCity = document.getElementById('city-input').value;
  numOfUsers = document.getElementById('group-size-input').value;
  groupMinPrice = document.getElementById('min-price-input').value;
  groupMaxPrice = document.getElementById('max-price-input').value;
  groupRadius = document.getElementById('radius-input').value;
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
