mapboxgl.accessToken =
  'pk.eyJ1Ijoic3N0cmF1YzEiLCJhIjoiY2syaHl6eDNpMWI4azNucDBoaTZuamFnZSJ9.9EjV8zoR-lN2pSXc0VTDKA';
let latlng;

let geojson = {
  id: 'places',
  type: 'symbol',
  layout: {
    'icon-image': '{icon}-15',
    'icon-allow-overlap': true
  },
  source: {
    type: 'FeatureCollection',
    features: []
  }
};

const foo = this.document.querySelector('#map');
let map = new mapboxgl.Map({
  container: foo, // container id
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9 // starting zoom
});

// Gets lat/lng of mouse cursor
map.on('mousemove', e => {
  let coords = e.lngLat.wrap();
  latlng = [coords.lng, coords.lat];
});

// Adds marker to click
map.on('click', () => {
  // try {
  // new mapboxgl.Marker(el).setLngLat(latlng).addTo(map);
  geojson.source.features.push({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: latlng
    },
    properties: {
      title: 'Marker',
      description: `${latlng}`
    }
  });
  console.log(latlng);

  render();
  // } catch {
  //   console.log('Pin failed');
  // }
});

const render = () => {
  geojson.source.features.forEach(marker => {
    let el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker(el)
      .setLngLat(marker.geometry.coordinates)
      // .setPopup(new mapboxgl.Popup({ offset: 25 }))
      // .setHTML(`<h3> ${marker.properties.title} </h3>`)
      .addTo(map);
  });
  map.removeLayer(geojson);
  map.addLayer(geojson);
};

const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
});

map.on('mouseenter', 'places', e => {
  map.getCanvas().style.cursor = pointer;

  let coordinates = e.features[0].geometry.coordinates.slice();
  console.log(coordinates);

  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  popup
    .setLngLat(coordinates)
    .setHTML(`<button> TEST </button>`)
    .addTo(map);
});

map.on('mouseleave', 'places', () => {
  map.getCanvas().style.cursor = '';
  popup.remove();
});
