
var map;
var geocoder;

function init(){
  geocoder = new google.maps.Geocoder();
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}


function showPosition(position) {
  var s = document.querySelector('#status_geolocation');
  
  s.innerHTML = "found you!";
  s.className = 'success';
  
  var mapcanvas = document.createElement('div');
  mapcanvas.id = 'mapcanvas';
  mapcanvas.style.height = '400px';
  mapcanvas.style.width = '100%';

  document.querySelector('#article_geolocation').appendChild(mapcanvas);
  
  var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  var myOptions = {
    zoom: 15,
    center: latlng,
    mapTypeControl: false,
    navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  
  map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);
  
  var marker = new google.maps.Marker({
    position: latlng, 
    map: map, 
    title:"You are here! (at least within a "+position.coords.accuracy+" meter radius)"
  });

  
  geocoder.geocode({'latLng': latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      
      var street_address = "";
      var postal_code = "";
      var locality = "";
      var country = "";

      var street_address_elem = document.getElementById("street_address");
      var postal_code_elem = document.getElementById("postal_code");
      var locality_elem = document.getElementById("locality");
      var country_elem = document.getElementById("country");

      for (var i = 0; i < results.length; i++){
        var length = results[i].types.length;
        if (length == 0)
          continue;

        for(var j = 0; j < length; j++)
          switch(results[i].types[0]){
            case "street_address":
              if (street_address == ""){
                street_address_elem.value = results[i].address_components[0].long_name + " " + results[i].address_components[1].long_name;
              }
            break;
            case "postal_code":
              if (postal_code == ""){
                postal_code_elem.value = results[i].address_components[0].long_name;
              }
            break;
            case "locality":
              if (locality == ""){
                locality_elem.value = results[i].address_components[0].long_name;
              }
            break;
            case "country":
              if (country == ""){
                country_elem.value = results[i].address_components[0].long_name;
              }
            break;
          }
      }
      if (results[0]) {                
        var elem = document.getElementById("address_geo");
        elem.innerText = "Your address: " + results[0].formatted_address;
      } else {
        alert('No results found');
      }
    } else {
      alert('Geocoder failed due to: ' + status);
    }
  });
}

function findAddress() {
    var address = document.getElementById('address_geo').value;
    geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location
                        });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function findAddressByForm() {
    
    var street_address_elem = document.getElementById("street_address").value;
    var postal_code_elem = document.getElementById("postal_code").value;
    var locality_elem = document.getElementById("locality").value;
    var country_elem = document.getElementById("country").value;

    var address = street_address_elem + " " + postal_code_elem + " " + locality_elem + " " + country_elem;

    geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location
                        });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function error(msg) {
  var s = document.querySelector('#status');
  s.innerHTML = typeof msg == 'string' ? msg : "failed";
  s.className = 'fail';
  
  // console.log(arguments);
}