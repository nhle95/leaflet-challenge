
// Use earthquake link to get the GeoJSON data.
let earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create the base layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})
  
let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
  

// Create a  object to contain the streetmap and the darkmap.
let streetandtopo = {
    Street: street,
    Topography: topo
};

// start the map
let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4,
  layers:street
});
  
// Add to the map.
L.control.layers(streetandtopo).addTo(myMap);

//use d3 to query data
d3.json(earthquake_url).then(function(data) {
    //the color of the marker based on depth
    function Color(depth) {
        if (depth <= 10) return "#31906E";
        else if (depth <= 30) return "#3EB489";
        else if (depth <= 50) return "#f7db11";
        else if (depth <= 70) return "#fdb72a";
        else if (depth <= 90) return "#fca35d";
        else return "#e3181c";
        
    }
      
    // get the size of marker
    function Size(magnitude) {
        // if magnitude is 0, add marker. else, multiple by 10000 the size of marker
        if (magnitude === 0) {
          return 1;
        }
        return magnitude * 26000;
    }

    //start creating markers
    for (let i = 0; i < data.features.length; i++) {
        let feature = data.features[i]
        // console.log(feature);

        L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]],{
            fillOpacity: 1,
            color: "white",
            fillColor: Color(feature.geometry.coordinates[2]),
            radius: Size(feature.properties.mag),
            stoke: true,
            weight: 0.5
        }).bindPopup(`<h2>Where: ${feature.properties.place}</h2><h3>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]}</h3>`).addTo(myMap);
    }
    
});
   
// Here we create a legend control object.
  let legend = L.control({position: "bottomright"});

// Then add all the details for the legend
  legend.onAdd= function(map){
    let div = L.DomUtil.create('div', 'info legend');
    let limits = ['-10-10', '10-30','30-50','50-70','70-90','90+'];
    let colors=['#31906E"',"#3EB489","#f7db11","#fdb72a", '#fca35d','#e3181c'];
    div.innerHTML += "<h4>Depth of the Earthquakes</h4>";
    for (let i=0; i<limits.length; i++) {
        div.innerHTML+= `<p style="background-color:${colors[i]}" > ${limits[i]} </p>`
        
    }
    return div
  };

  legend.addTo(myMap)

