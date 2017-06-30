$(document).ready(function(){
$(".fa").hide();
$(".cuisineResult").hide();
$(".card").hide();

$(".btn").on("click", function(){
  $(".fa").show();
  setTimeout(function(){
    $(".fa").hide();
    $(".cuisineResult").show();
    $(".card").show();
  }, 2000)

});

function createRestaurantEntry(place) {
      let restaurant = $('<div>').addClass('restaurant-entry card');
      restaurant.html(
        `
        <div class="card-block">
          <div class="card-title restaurant-name"${place.name}</div>
        </div>
        <div class="card-block">
          <div class="card-title restaurant-address"${place.vicinity}</div>
        </div>
        <div class="card-block">
          <div class="card-title rating"${place.rating}</div>
        </div>
        <div class="card-block">
          <div class="card-title price"${place.price_level}</div>
        </div>

        `
      );
      return restaurant;
    }
});
