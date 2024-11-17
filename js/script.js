import {json_data} from '../data/json_Data.js'
var map = L.map('map').setView([13.647, -86.468], 9);
var popup = L.popup();

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


function getColor(d) {
    return d >= 7870 && d < 25264 ? '#A6CEE3' :  // Pastel Blue
    d >= 2186 && d < 7870  ? '#B2DF8A' :  // Pastel Green
    d >= 1118 && d < 2186  ? '#FB9A99' :  // Pastel Red
    d >= 408 && d < 1118   ? '#FDBF6F' :  // Pastel Orange
    d >= 203 && d < 408    ? '#CAB2D6' :  // Pastel Purple
                             '#FFFF99';   // Pastel Yellow
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.Viviendas_),
        weight: 2,
        color: '#162A2C',
        opacity: 1,
        dashArray: '',
        fillOpacity: 0.7,
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#567C8D',
        dashArray: '',
        fillOpacity: 2
    });

    layer.bringToFront();
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

var geojson;
// Add geojson with listeners
geojson = L.geoJson(json_data, {
    style: style, // Apply the style function
    onEachFeature: function(feature, layer) {
        // Add event listeners to each feature's layer
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: function(e) {
                popup
        .setLatLng(e.latlng)
        .setContent("Total de viviendas en el municipio de "+feature.properties.Municipio +": "+ feature.properties.Viviendas_)
        .openOn(map);
            }
        });
    }
}).addTo(map);

// Tile layer for the MiniMap
var miniMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 6,
    maxZoom: 13,
    attribution: '&copy; OpenStreetMap contributors'
});



// MiniMap control
var miniMap = new L.Control.MiniMap(miniMapLayer, {
    toggleDisplay: true,
    minimized: false,
    position: 'bottomright',
    
}).addTo(map);
