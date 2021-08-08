

$('#storeCarousel').on('slide.bs.carousel', function (e) {
    showPosition(e.relatedTarget.dataset.lat,e.relatedTarget.dataset.long)
})

function showPosition(lat,long) { 
  var lat = lat;
  var lon = long;
  var latlon = new google.maps.LatLng(lat, lon)
  var mapholder = document.getElementById('map')
  
  var myOptions = {
    center:latlon,zoom:19,
    mapTypeId:google.maps.MapTypeId.ROADMAP,
    mapTypeControl:false,
    navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
  }
    
  var map = new google.maps.Map(document.getElementById("map"), myOptions);
  var marker = new google.maps.Marker({position:latlon,map:map,title:"You are here!"});
}

function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.")
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.")
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.")
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.")
      break;
  }
}

  
  $(".owl-carousel")&&$(".owl-carousel").length&&$('.owl-carousel').owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    navText: ["<div class='nav-btn prev-slide'></div>", "<div class='nav-btn next-slide'></div>"],
    responsive: {
        0: {
            items: 1
        },
        600: {
            items: 3
        },
        1000: {
            items: 8
        }
    }
})



$('.carousel')&&$('.carousel').length&&$('.carousel').carousel({
    interval: false,
    touch:true
  });



  $(document).ready(function() {


    if ($('.bbb_viewed_slider').length) {
        var viewedSlider = $('.bbb_viewed_slider');

        viewedSlider.owlCarousel({
            loop: true,
            margin: 30,
            autoplay: true,
            autoplayTimeout: 6000,
            nav: false,
            dots: false,
            responsive: {
                0: {
                    items: 1
                },
                575: {
                    items: 2
                },
                768: {
                    items: 3
                },
                991: {
                    items: 4
                },
                1199: {
                    items: 6
                }
            }
        });

        if ($('.bbb_viewed_prev').length) {
            var prev = $('.bbb_viewed_prev');
            prev.on('click', function() {
                viewedSlider.trigger('prev.owl.carousel');
            });
        }

        if ($('.bbb_viewed_next').length) {
            var next = $('.bbb_viewed_next');
            next.on('click', function() {
                viewedSlider.trigger('next.owl.carousel');
            });
        }
    }


    if ($('.ccc_viewed_slider').length) {
      var viewedCSlider = $('.ccc_viewed_slider');
  
      viewedCSlider.owlCarousel({
          loop: true,
          margin: 30,
          autoplay: true,
          autoplayTimeout: 6000,
          nav: false,
          dots: false,
          responsive: {
              0: {
                  items: 1
              },
              575: {
                  items: 2
              },
              768: {
                  items: 3
              },
              991: {
                  items: 4
              },
              1199: {
                  items: 6
              }
          }
      });
  
      if ($('.ccc_viewed_prev').length) {
          var prev = $('.ccc_viewed_prev');
          prev.on('click', function() {
            viewedCSlider.trigger('prev.owl.carousel');
          });
      }
  
      if ($('.ccc_viewed_next').length) {
          var next = $('.ccc_viewed_next');
          next.on('click', function() {
            viewedCSlider.trigger('next.owl.carousel');
          });
      }
  }

});


	
$('.minus-btn').on('click', function(e) {
  e.preventDefault();
  var $this = $(this);
  var $input = $this.closest('div').find('input');
  var value = parseInt($input.val());

  if (value > 1) {
      value = value - 1;
  } else {
      value = 0;
  }

$input.val(value);

});

$('.plus-btn').on('click', function(e) {
  e.preventDefault();
  var $this = $(this);
  var $input = $this.closest('div').find('input');
  var value = parseInt($input.val());

  if (value < 100) {
      value = value + 1;
  } else {
      value =100;
  }

  $input.val(value);
});