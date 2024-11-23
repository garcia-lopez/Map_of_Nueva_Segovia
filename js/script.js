import {json_data} from '../data/json_Data.js';
import { json_data_puntos } from '../data/json_Data_Puntos.js';
import { Text } from './Text.js';
import { darkerColors } from './Colors.js';
import { getColors } from './GetColors.js';
import { legendValue } from './Leyenda.js';

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
 let leyenda = document.getElementById('legend');
//Geojson Layers
let geojson;
let geojson2;

//Marker
let marker;
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

function style(feature) {
    return {
        fillColor: getColors[selectedFeature](feature.properties[selectedFeature]),
        weight: 2,
        color: '#162A2C',
        opacity: 1,
        dashArray: '',
        fillOpacity: 0.7,
    };
}

function highlightFeature(e) {
    let layer = e.target;
    let originalFillColor = getColors[selectedFeature](layer.feature.properties[selectedFeature]);
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
                mouseover: highlightFeature, 
                mouseout: function (e) {
                    geojson.resetStyle(e.target); 
                },
                click: function (e) {

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

//Clear the Legend div
function clearLegend(){
    while (leyenda.firstChild) {
        leyenda.removeChild(leyenda.firstChild);
    }
}

function selectMap(mapType) {
    switch (mapType) {
        case "Coropletas":
            marker.remove();
            addLegend(selectedFeature, leyenda);
            removeLayer();
            selectData();
            break;

        case "SimProp":
            marker.remove();
            addLegendCircles(selectedFeature, leyenda);
            removeLayer();
            geojson2 = L.geoJson(json_data).addTo(map);
            selectDataDots()
            break;

        default:
            marker = L.marker([13.76285370795506, -86.276463822283588])
            .bindPopup('Nueva Segovia')
            .addTo(map);
        
            // Show the popup on hover
            marker.on('mouseover', function (e) {
                this.openPopup();
            });
        
            // Hide the popup when the mouse leaves the marker
            marker.on('mouseout', function (e) {
                this.closePopup();
            });
            clearLegend();
            removeLayer();
            geojson = L.geoJson(json_data).addTo(map);
            break;
    }
}
function calculateRadius(value, ranges) {
    const maxRadius = 20; // Adjust as needed for visualization
    const minRadius = 2;  // Minimum size for the smallest range
    const maxValue = Math.max(...ranges.map(item => parseInt(item.range.split(' - ')[1], 10))); // Get the maximum upper bound
    return (value / maxValue) * (maxRadius - minRadius) + minRadius;
}
function addLegendCircles(selectedFeature, leyenda) {
    clearLegend();
    let ul = document.createElement('ul');
    legendValue[selectedFeature].forEach(value => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        li.textContent = `${value.range}`;
        li.style.fontSize = '14px';
        const rangeValues = value.range.split('-');
        const radius = calculateRadius(parseInt(rangeValues[1], 10), legendValue[selectedFeature]);

        Object.assign(span.style, {
            backgroundColor:'blue',
            borderRadius: '50%',
            height: `${radius * 2}px`, 
            width: `${radius * 2}px`, 
            display: 'inline-block', // Ensure it renders the height/width properly
        });
        li.appendChild(span);
        ul.appendChild(li); 
    });
    let h1 = document.createElement('h1');
    h1.innerText = "Leyenda";
    leyenda.appendChild(h1);
    leyenda.appendChild(ul);
}



function addLegend(selectedFeature, leyenda) {
    clearLegend();
    let ul = document.createElement('ul');
    legendValue[selectedFeature].forEach(value => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        li.textContent = `${value.range}`;
        Object.assign(span.style, {
            backgroundColor: `${value.color}`,
            padding: '5px',
            height: '10px', 
            width: '10px', 
            display: 'inline-block' // Ensure it renders the height/width properly
        });
        li.appendChild(span);
        ul.appendChild(li); 
    });
    let h1 = document.createElement('h1');
    h1.innerText = "Leyenda";
    leyenda.appendChild(h1);
    leyenda.appendChild(ul);
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
                addLegend(selectedFeature, leyenda);
                removeLayer();
                selectData();
                info.update();
            }
            else if(mapType.value == "SimProp"){
                if (geojson) {
                    map.removeLayer(geojson);
                    geojson = null;
                } 
                addLegendCircles(selectedFeature, leyenda);
                selectDataDots();
                info.update();
            }

        });
    } else {
        console.error("comboBox element not found");
    }

    //Location Button action
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

