export function initAutoCompleteFunction({
    mapPassed,
    inputPassed
}) {

    const map = mapPassed

    // 
    // Create the search box and link it to the UI element.
    // const input = document.getElementById("pac-input");
    const input = inputPassed;
    const searchBox = new window.google.maps.places.SearchBox(input);

    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);

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
        const bounds = new window.google.maps.LatLngBounds();

        places.forEach((place) => {
            if (!place.geometry || !place.geometry.location) {
                console.log("Returned place contains no geometry");
                return;
            }

            const icon = {
                url: place.icon,
                size: new window.google.maps.Size(71, 71),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(17, 34),
                scaledSize: new window.google.maps.Size(25, 25),
            };

            // Create a marker for each place.
            markers.push(
                new window.google.maps.Marker({
                    map,
                    icon,
                    title: place.name,
                    position: place.geometry.location,
                })
            );


            /**HERE */

            searchPlacesFunction({
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





export function searchPlacesFunction({
    mapPassed,
    myLocation
}) {
    // 
    // Create the places service.
    const service = new window.google.maps.places.PlacesService(mapPassed);
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

            addPlaces(results, mapPassed);
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
                    size: new window.google.maps.Size(71, 71),
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(17, 34),
                    scaledSize: new window.google.maps.Size(25, 25),
                };

                new window.google.maps.Marker({
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