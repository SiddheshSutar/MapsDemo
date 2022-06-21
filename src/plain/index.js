// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
let map, infoWindow;
let globalMap
// function initMapObj(obj) {

//   let defaultLat = -34.397
//   let defaultLng = 150.644
//   if (
//     obj
//   ) {
//     if (obj.lat) defaultLat = obj.lat
//     if (obj.lng) defaultLng = obj.lat
//   }

//   globalMap = new google.maps.Map(document.getElementById("map"), {
//     center: { lat: defaultLat, lng: defaultLng },
//     zoom: 15,
//     mapTypeId: "roadmap",
//   });
// }

function initAutoComplete({
  mapPassed
}) {

  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       const pos = {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude,
  //       };

  //       myLocation = { ...pos }
  //     })
  // }

  const map = mapPassed


  // 
  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [];

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
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

      
      /**HERE */
      
      searchPlaces({
        mapPassed,
        myLocation: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
      })

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
  // 

}

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -40, lng: 150 },
    zoom: 15,
    mapTypeId: "roadmap",
  });
  infoWindow = new google.maps.InfoWindow();

  let myLocation = {}
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        myLocation = { ...pos }

        infoWindow.setPosition(pos);
        infoWindow.setContent("Location found.");
        infoWindow.open(map);
        map.setCenter(pos);

        searchPlaces({
          mapPassed: map,
          myLocation
        })

        initAutoComplete({
          mapPassed: map
        })
      })
  }
  else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

}

function searchPlaces({
  mapPassed,
  myLocation
}) {
  // 
  // Create the places service.
  const service = new google.maps.places.PlacesService(mapPassed);
  let getNextPage;
  const moreButton = document.getElementById("more");

  moreButton.onclick = function () {
    moreButton.disabled = true;

    if (getNextPage) {
      getNextPage();
    }
  };

  // Perform a nearby search.
  service.nearbySearch(
    { location: myLocation, radius: 1500, type: "bank" },
    (
      results,
      status,
      pagination
    ) => {
      if (status !== "OK" || !results) return;

      addPlaces(results, map);
      moreButton.disabled = !pagination || !pagination.hasNextPage;

      if (pagination && pagination.hasNextPage) {
        getNextPage = () => {
          // Note: nextPage will call the same handler function as the initial call
          pagination.nextPage();
        };
      }
    }
  );
  // }

  function addPlaces(
    places,
    map
  ) {
    const placesList = document.getElementById("HDFC");

    for (const place of places) {
      if (place.geometry && place.geometry.location && place.business_status !== 'CLOSED_TEMPORARILY'
        && (place.name.toLowerCase().indexOf('hdfc') !== -1)
        && (place.name.toLowerCase().indexOf('atm') === -1)
      ) {
      console.log('hex:', place)

        const image = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };

        new google.maps.Marker({
          map,
          icon: image,
          title: place.name,
          position: place?.geometry?.location,
        });

        const li = document.createElement("li");

        li.textContent = place.name;

        placesList.appendChild(li);

        li.addEventListener("click", () => {
          map.setCenter(place.geometry.location);
        });
      }
    }
  }
  // 




}



function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

window.initMap = initMap;
window.initAutoComplete = initAutoComplete;
// window.initMapObj = initMapObj;