import axios from "axios";

export const API_KEY = 'AIzaSyC68H9SdF9KiJWStgwPugHIgY_IILwefRo'

export async function nearbySearch ({
    lat,
    lng,
    radius,
    searchType,
    keywordType
}) {
    var config = {
        method: 'get',
        // url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522%2C151.1957362&radius=1500&type=restaurant&keyword=cruise&key=YOUR_API_KEY`,
        url: `http://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}%2C${lng}&radius=${radius}&type=${searchType}&keyword=${keywordType}&key=${API_KEY}`,
        headers: {
            'Access-Control-Allow-Origin' : true
        },
        crossOriginIsolated: false
    };

    axios(config)
        .then(function (response) {
            console.log('hex :nearbySearch : ', response.data);
        })
        .catch(function (error) {
            console.log('error: ', error);
        });
}