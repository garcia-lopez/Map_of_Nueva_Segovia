import {json_data} from '../data/json_Data.js';
import { json_data_puntos } from '../data/json_Data_Puntos.js';
import { Text } from './Text.js';
import { darkerColors } from './Colors.js';

// Tile layer for the map
let openStreetMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | Autor: María Paula López García'
});

let osm = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA) | MPLG'
});

// Initialize the map with the default layers
let map = L.map('map', {
    center: [13.76285370795506, -86.276463822283588],
    zoom: 10,
    minZoom: 5,
    maxZoom: 19,
    layers: [openStreetMap] // Add the base layer and the default overlay here,
});

// Define base layers and overlay layers
let baseLayers = {
    "OpenStreetMap": openStreetMap,
    "OpenTopoMap": osm,
};

//Popup letiable
let popup = L.popup();
//Selected Feature from ComboBox
let selectedFeature = document.getElementById('comboBox').value;
//Geojson Layers
let geojson;
let geojson2;

//New info control
let info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); 
     this._div.classList.add('bottom-right'); 
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>'+Text[selectedFeature]+'</h4>' +  (props ?
        '<b>' + props.Municipio + '</b><br />' + props[selectedFeature] 
        : 'Señala un municipio');
};

//Adding info square (? to my map
info.addTo(map);

// Add layer control to the map
L.control.layers(baseLayers, null).addTo(map);

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
        fillColor: getColor(feature.properties[selectedFeature]),
        weight: 2,
        color: '#162A2C',
        opacity: 1,
        dashArray: '',
        fillOpacity: 0.7,
    };
}

function highlightFeature(e) {
    let layer = e.target;
    let originalFillColor = getColor(layer.feature.properties[selectedFeature]);
    layer.setStyle({
        weight: 5,
        color: darkerColors[originalFillColor],
        dashArray: '',
        fillOpacity: 2
    });

    layer.bringToFront();
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}


// Add geojson with listeners
function selectData() {
    geojson = L.geoJson(json_data, {
        style: style, 
        onEachFeature: function(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: function(e) {
                    popup
            .setLatLng(e.latlng)
            .setContent(Text[selectedFeature] + " en el municipio de "+feature.properties.Municipio +": "+ feature.properties[selectedFeature])
            .openOn(map);
                }
            });
        }
    }).addTo(map);
}


//Proportional Symbols Map
function getRadius(area) {
    let radius = Math.sqrt(area / Math.PI);
    return radius * 0.6;
}

function selectDataDots() {
    geojson = L.geoJson(json_data_puntos, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                color: 'darkblue',
                weight: 1,
                fillColor: 'blue',
                fillOpacity: 0.3,
                radius: getRadius(feature.properties[selectedFeature])
            });
        },
        onEachFeature: function (feature, layer) {

            layer.on({
                mouseover: highlightFeature, // Llama a tu función highlightFeature
                mouseout: function (e) {
                    geojson.resetStyle(e.target); // Resetea el estilo al salir
                },
                click: function (e) {
                    // Example: Show popup with feature info
                    popup
                        .setLatLng(e.latlng)
                        .setContent(
                            Text[selectedFeature] + 
                            " en el municipio de "+
                            feature.properties.Municipio +
                            ": "
                            + feature.properties[selectedFeature]
                        )
                        .openOn(map);
                },
                
            });
        }
    }).addTo(map);
}

// Tile layer for the MiniMap
let miniMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 6,
    maxZoom: 13,
    attribution: '&copy; OpenStreetMap contributors'
});



// MiniMap control
let miniMap = new L.Control.MiniMap(miniMapLayer, {
    toggleDisplay: true,
    minimized: false,
    position: 'bottomright',
    
}).addTo(map);

new L.Control.Scale({
    imperial: false, 
    position: 'bottomright' 
}).addTo(map);

//Function to remove a geojson layer 
function removeLayer() {
    if (geojson) {
        map.removeLayer(geojson);
        geojson = null;
    } 
    if (geojson2) {
        map.removeLayer(geojson2);
        geojson2 = null;
    }
}

function selectMap(mapType) {
    switch (mapType) {
        case "Coropletas":
            removeLayer();
            selectData();
            break;

        case "SimProp":
            removeLayer();
            geojson2 = L.geoJson(json_data).addTo(map);
            selectDataDots()
            break;

        default:
            removeLayer();
            geojson = L.geoJson(json_data).addTo(map);
            break;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const comboBox = document.getElementById("comboBox");
    const locationButton = document.getElementById("location");
    let mapType = document.getElementById('mapType');
    selectMap(mapType.value);

    if (mapType) {
        mapType.addEventListener("change", function (event) {
            selectMap(mapType.value);
        });
    } else {
        console.log("combobox element not found");
    }

    if (comboBox) {
        comboBox.addEventListener("change", function (event) {
            const selectElement = event.target;
            selectedFeature = selectElement.value;

            if (mapType.value == "Coropletas"){
                removeLayer();
                selectData();
                info.update();
            }
            else if(mapType.value == "SimProp"){
                if (geojson) {
                    console.log("buenas buenas");
                    map.removeLayer(geojson);
                    geojson = null;
                } 
                selectDataDots();
                info.update();
            }

        });
    } else {
        console.error("comboBox element not found");
    }

    if (locationButton) {
        locationButton.addEventListener("click", function () {
            if (map && typeof map.flyTo === "function") {
                map.flyTo([13.76285370795506, -86.276463822283588], 10);
            } else {
                console.error("map or flyTo function not defined");
            }
        });
    } else {
        console.error("location element not found");
    }
});

