

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
  stagePadding: 50,
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
          items: 6
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
          stagePadding:50,
          loop: true,
          autoplay: true,
          autoplayTimeout: 6000,
          nav: true,
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
        stagePadding:50,
        loop: true,
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

const regForm = $('#registration')
const loginForm = $('#login')

regForm.on('submit', function(e){
e.preventDefault(); 
const obj = regForm.serializeArray().reduce((acc, {name, value}) => ({...acc, [name]: value}), {})

$.post('/user/create', obj)
      .done(result => { 
                  if(!result.status){ 
                          $("#error").show().text(result.errors); }else{
                            Swal.fire({
                              icon: 'success',
                              title: 'Signed up, try to login',
                              showConfirmButton: false,
                              timer: 1500
                            }) 
                            
                          location.reload();
                       }
      }).fail(result=>{ console.log(result)
            $("#error").show().text(result.responseJSON.errors);
       });

})

loginForm.on('submit', function(e){
  e.preventDefault(); 
  const obj = loginForm.serializeArray().reduce((acc, {name, value}) => ({...acc, [name]: value}), {})
  
  $.post('/user/login', obj)
        .done(result => { 
                    if(!result.status){ 
                            $("#loginError").show().text(result.errors); }else{
                              Swal.fire({
                                  icon: 'success',
                                  title: 'Logged in successfully',
                                  showConfirmButton: false,
                                  timer: 1500
                                }) 
                                location.reload();
                         }
        }).fail(result=>{
                  $("#loginError").show().text(result.responseJSON.errors);
         });

})


$(".xakkti").click(function(){ 
 
          let sku = $(this).data('id'); 
          let section = $(this).data('prop');
          
          let greyClass = `.${section}-grey-${sku}`;
          let redClass  = `.${section}-red-${sku}`;
          
          $(`${greyClass}, ${redClass}`).toggleClass("d-none")
  });

/*$('.xpdetails').click(function(){
     $('.product_view').modal('show')
})  */

$(function () {
  $('[data-toggle="tooltip"]').tooltip()

 })

 $('.product_view').on('show.bs.modal',function(e){
  var a =  $(e.relatedTarget)
 
  var modal = $(this)
  modal.find('.xproduct-img').prop('src',a.data('img'))
  modal.find('.modal-title').text(a.data('product-name'))
  modal.find('.deal-price').text(a.data('deal-price'))
  modal.find('.regular-price').text(a.data('regular-price'))
  modal.find('.sku').text(a.data('sku'))
  modal.find('.currency').text(a.data('store-currency'))
})

$('.x-cart,.x-heart,.x-list').click(function(){
     

     switch ($(this).data('prop')) {
      case "x-cart":
          $(this).parents('.xshop').siblings('.button_type').val('x-cart');
          $(this).closest("form").submit()
        break;
      case "x-heart":
          $(this).parents('.xshop').siblings('.button_type').val('x-heart');
          $(this).closest("form").submit()
        break;
      case "x-list":
          $(this).parents('.xshop').siblings('.button_type').val('x-list');
        break;
      
    }

     
})

$('.cart-form').submit(function(e){ 
   e.preventDefault()
   const obj = $(this).serializeArray().reduce((acc, {name, value}) => ({...acc, [name]: value}), {})
 
 switch (obj.button_type) {
    case "x-cart":
          url = 'http://localhost:4800/product/add-to-cart';
      break;
    case "x-heart":
      url = 'http://localhost:4800/product/add-to-favlist';
      break;
    case "x-list":
      url = 'http://localhost:4800/shoppinglist/add_product';    
      break;
    
  }
   $.post(url, obj)
        .done(result => { 
                    if(!result.status){ 
                            $("#shopilistError").show().text(result.message); 
                        }
        }).fail(result=>{
                      $("#shopilistError").removeClass('d-none').html(result.responseJSON.message);
         });
   
})

/*
$('#cartbutton').on('click',function(){
   if(!$(this).data('storeid')){ 

    Swal.fire({
      title: "No store selected!",
      text: "For your cart, you need to select your store first",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }) 

    }else{
          $('#cartModal').modal('show')
    }
})*/


$('.xakkt-popup').on('click',function(e){

   if(!$(this).data('storeid')){ 
         Swal.fire({
        title: "No store selected!",
        text: "For your cart, you need to select your store first",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }) 
  }else{
    var modal = $(this).data('modal')
    $(`#${modal}`).modal('show')
  }

})

$('#favListModal').on('show.bs.modal',function(e){
  var data ={}
  data._user = $(".cartbutton").data('userid')??null
  data._store = $(".cartbutton").data('storeid')


  $.post('/wishlist/products', data).done(result => { 
     
    if(result.status){ 
        
        var tableHtml = ''
        var total = 0;
        result.data.forEach((product,index)=>{
         
            tableHtml += `<tr>
                            <td class="w-25">
                              <img src="${product._product.image}" class="cart-prod-img img-fluid img-thumbnail" alt="">
                            </td>
                            <td>${product._product.name.english}</td>
                            <td>50</td>
                            <td>
                              <a href="#" class="btn btn-danger btn-sm">
                                <i class="fa fa-times"></i>
                              </a>
                            </td>
                      </tr>`
          })
          
          }else{
                
                tableHtml = `<tr>
                                <td colspan="5">
                                No data for cart
                                </td>
                              </tr>`
                $('.fav-table').html()
         }
         $('#fav-table').html(tableHtml) 

}).fail(result=>{
    $("#loginError").show().text(result.responseJSON.errors);
});
 
})

$('#cartModal').on('show.bs.modal',function(e){ 
  
  var data ={}
  data.userid = $(".cartbutton").data('userid')??null
  data.storeid = $(".cartbutton").data('storeid')

  $.post('/products/cart', data).done(result => { 
     
    if(result.status){ 
        
        var tableHtml = ''
        var total = 0;
        result.data.forEach((product,index)=>{
            total += product.total_price;

            tableHtml += `<tr>
                            <td class="w-25">
                              <img src="http://xgrocery.cf/images/products/${product._product.image}" class="cart-prod-img img-fluid img-thumbnail" alt="Sheep">
                            </td>
                            <td>${product._product.name.english}</td>
                            <td class="qty"><input type="number" class="form-control" id="input1" value="${product.quantity}"></td>
                            <td>${product.total_price}</td>
                            <td>
                              <a href="#" class="btn btn-danger btn-sm">
                                <i class="fa fa-times"></i>
                              </a>
                            </td>
                      </tr>`
          })
          $('.cart-price').html(total)
          }else{
                
                tableHtml = `<tr>
                                <td colspan="5">
                                No data for cart
                                </td>
                              </tr>`
                $('.cart-price').html()
         }
         $('#cart-table').html(tableHtml) 

}).fail(result=>{
    $("#loginError").show().text(result.responseJSON.errors);
});


})

$('#shoppingListModal').on('show.bs.modal',function(event){
  var data ={}
  data._user = $(".cartbutton").data('userid')??null
  data._store = $(".cartbutton").data('storeid')
  
  var button = $(event.relatedTarget) // Button that triggered the modal
  var productForm = button.data('formid')
  
             
                  $.post('/list/shoppinglist', data).done(result => { 
              
                    if(result.status){ 
                        var tableHtml = ''
                        result.data.forEach((list,index)=>{
                            tableHtml += `<tr>
                                            <td class="lsname" data-formid="#${productForm}" onclick="listnameClick(this)" data-id="${list._id}">${list.name}</td>
                                          </tr>`
                              })
                          
                            }else{
                                tableHtml = `<tr> <td> No data for cart </td> </tr>`
                              }
                          $('#shopping-table').html(tableHtml) 
                }).fail(result=>{
                    $("#loginError").show().text(result.responseJSON.errors);
                });
            
})

$('#allAhoppingListsModal').on('show.bs.modal',function(event){
  var data ={}
  data._user = $(".cartbutton").data('userid')??null
  data._store = $(".cartbutton").data('storeid')
  
             
                  $.post('/list/shoppinglist', data).done(result => { 
              
                    if(result.status){ 
                        var tableHtml = ''
                        result.data.forEach((list,index)=>{
                            tableHtml += `<tr>
                                            <td class="lsproducts" data-toggle="modal" data-target="#shoppingListProducsModal" data-listid="${list._id}">${list.name}</td>
                                          </tr>`
                              })
                          
                            }else{
                                tableHtml = `<tr> <td> No data for cart </td> </tr>`
                              }
                          $('#shopping-table-navbar').html(tableHtml) 
                }).fail(result=>{
                    $("#loginError").show().text(result.responseJSON.errors);
                });
            
})

$('#shoppingListProducsModal').on('show.bs.modal',function(event){
  $('#allAhoppingListsModal').modal('hide')
 
   var button = $(event.relatedTarget) // Button that triggered the modal
  var shoplist = button.data('listid')
  
             
                  $.get(`/shoppinglist/${shoplist}/products`).done(result => { 
                      if(result.status){ 
                        var tableHtml = ''
                        result.data.forEach((product,index)=>{
                          tableHtml += `<tr>
                                            <td class="w-25">
                                              <img src="${product._product.image}" class="cart-prod-img img-fluid img-thumbnail" alt="Sheep">
                                            </td>
                                            <td>${product._product.name.english}</td>
                                            <td class="qty"><input type="number" class="form-control" id="input1" value="${product.quantity}"></td>
                                            <td>${product._product._unit.name}</td>
                                            <td>
                                              <a href="#" class="btn btn-danger btn-sm">
                                                <i class="fa fa-times"></i>
                                              </a>
                                            </td>
                                      </tr>`
                              })
                          
                            }else{
                                tableHtml = `<tr> <td> No data for cart </td> </tr>`
                              }
                          $('#shoppinglist-product-table').html(tableHtml) 
                }).fail(result=>{
                    $("#loginError").show().text(result.responseJSON.errors);
                });
            
})

function listnameClick(that){
  
  $('.shoplist').val($(that).data('id'))
  $(that).toggleClass('active')
  $($(that).data('formid')).submit()
  
}



