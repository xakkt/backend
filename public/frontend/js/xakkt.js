

$('#storeCarousel').on('slide.bs.carousel', function (e) {
  showPosition(e.relatedTarget.dataset.lat,e.relatedTarget.dataset.long)
})



function showPosition(lat,long) {
  var lat = lat;
  var lon = long;
  var latlon = new google.maps.LatLng(lat, lon)
  var mapholder = document.getElementById('map')
  

  var myOptions = {
    center:latlon,zoom:20,
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

    
    function initAutocomplete() {
        const map = new google.maps.Map(document.getElementById("map"), {
          center: { lat: -33.8688, lng: 151.2195 },
          zoom: 13,
          mapTypeId: "roadmap",
        });
        const input = document.getElementById("pac-input");
        const searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.addListener("bounds_changed", () => {
          searchBox.setBounds(map.getBounds());
        });
        let markers = [];
        searchBox.addListener("places_changed", () => {
          const places = searchBox.getPlaces();
      
          if (places.length == 0) {
            return;
          }
          // Clear out the old markers.
          markers.forEach((marker) => {
            marker.setMap(null);
          });
          markers = [];
          // For each place, get the icon, name and location.
          const bounds = new google.maps.LatLngBounds();
          places.forEach((place) => {
            if (!place.geometry || !place.geometry.location) {
              console.log("Returned place contains no geometry");
              return;
            }
            const icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25),
            };
            // Create a marker for each place.
            markers.push(
              new google.maps.Marker({
                map,
                icon,
                title: place.name,
                position: place.geometry.location,
              })
            );
      
            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });
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