mapboxgl.accessToken =
  'pk.eyJ1Ijoic3N0cmF1YzEiLCJhIjoiY2syaHl6eDNpMWI4azNucDBoaTZuamFnZSJ9.9EjV8zoR-lN2pSXc0VTDKA';

const foo = this.document.querySelector('#map');
let map = new mapboxgl.Map({
  container: foo, // container id
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9 // starting zoom
});

// Gets lat/lng of mouse cursor
map.on('mousemove', e => {
  console.log(`${JSON.stringify(e.point)}\n${JSON.stringify(e.lngLat.wrap())}`);
});

// Adds marker to click
map.on('click', e => {
  console.log('click');
});
