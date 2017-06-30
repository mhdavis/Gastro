//CONSOLE.LOG IN FUNCTION IS WORKING - NOT WORKING ON CLICK SUBMIT
//Assigning value to raidus
function radiusTotal () {
	var fiveRadius = parseInt($('.five-radius').attr('data-value'));
	var tenRadius = parseInt($('.ten-radius').attr('data-value'));
	var fifteenRadius = parseInt($('.fifteen-radius').attr('data-value'));
};

//Assigning slider selection to a value between 0-4
function priceSlider() {
  var slider = $('.price-slider'),
    price = $('.price-slider__range'),
    value = $('.price-slider__value');

  slider.each(function() {

    value.each(function() {
      var value = $(this).prev().attr('value');
      $(this).html(value);
    });


    price.on('input', function() {
      $(this).next(value).html(this.value);
    });
  });
};
priceSlider();

//Assigning slider # to a value
function priceTotal () {

};

//Assigning # of users value selected on home page to variable and value
function userTotal () {
	var users = $('#number-users').val();
	console.log(users);
	return users;
};

$(".one-submit-button").on('click', function () {
	userTotal();
	radiusTotal();

});
